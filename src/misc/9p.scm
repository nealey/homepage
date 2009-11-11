#! /usr/bin/gosh

;; Description: 9p implementation in Scheme
;; Author: Neale Pickett <neale@woozle.org>

;; This uses gauche's networking stuff, but no other gauche stuff.  It
;; should be possible to substitute your implementation's networking
;; procedures without too much effort.
(use gauche.net)
(require-extension (srfi 1 4 8 9))

(define message-specs
  ;; name     num  format
  '((TVersion 100 (2 4 s))		;x64
    (RVersion 101 (2 4 s))
    (TAuth    102 (2 4 s s))
    (RAuth    103 (2 13))
    (TAttach  104 (2 4 4 s s))		;x68
    (RAttach  105 (2 13))
    (TError   106 ())			;illegal
    (RError   107 (2 s))
    (TFlush   108 (2 2))		;x6c
    (RFlush   109 (2))
    (TWalk    110 (2 4 4 (2 . s)))
    (RWalk    111 (2 (2 . 13)))
    (TOpen    112 (2 4 1))		;x70
    (ROpen    113 (2 13 4))
    (TCreate  114 (2 4 s 4 1))
    (RCreate  115 (2 13 4))
    (TRead    116 (2 4 8 4))		;x74
    (RRead    117 (2 (4 . d)))
    (TWrite   118 (2 4 8 (4 . s)))
    (RRwrite  119 (2 4))
    (TClunk   120 (2 4))		;x78
    (RClunk   121 (2))
    (TRemove  122 (2 4))
    (RRemove  123 (2))
    (TStat    124 (2 4))		;x7c
    (RStat    125 (2 n))
    (TWStat   126 (2 4 n))
    (RWStat   127 (2))))		;x7f

(define (spec-by-num num)
  (let loop ((specs message-specs))
    (cond
     ((null? specs)
      #f)
     ((equal? (cadar specs) num)
      (car specs))
     (else
      (loop (cdr specs))))))


;;
;; Helper procedures
;;

(define (u8-list->uint l)
  (let loop ((l (reverse l))
	     (acc 0))
    (if (null? l)
	acc
	(loop (cdr l)
	      (+ (* 256 acc)
		 (car l))))))

(define (uint->u8-list width i)
  (if (zero? width)
      '()
      (let ((b (modulo i 256))
	    (r (floor (/ i 256))))
	(cons b (uint->u8-list (- width 1) r)))))

;; XXX: s had better be printable 7-bit ASCII
(define (string->u8-list s)
  (map char->integer (string->list s)))

(define (u8-list->string l)
  (list->string (map integer->char l)))


;;
;; Packing and unpacking, both deal with u8-lists
;;

(define (pack fmt args)
  (let loop ((fmt fmt)
	     (args args)
	     (acc '()))
    ;;(write (list fmt args acc)) (newline)
    (cond
     ((null? fmt)
      acc)
     ((number? (car fmt))
      (loop (cdr fmt)
	    (cdr args)
	    (append acc (uint->u8-list (car fmt) (car args)))))
      ((equal? (car fmt) 's)
       ;;XXX Should handle UTF-8
       (loop (cdr fmt)
	     (cdr args)
	     (append acc
		     (uint->u8-list 2 (string-length (car args)))
		     (string->u8-list (car args)))))
      ((pair? (car fmt))
       ;; fmt item is (c . type), which gets packed to a c-octet n,
       ;; followed by n types.
       (let ((count (length (car args))))
	 (loop (cdr fmt)
	       (cdr args)
	       (append acc
		       (uint->u8-list (caar fmt) count)
		       (pack (make-list count (cdar fmt))
			     (car args))))))
      ((equal? (car fmt) 'n)
       ;; XXX: total guess here
       (loop (cdr fmt)
	     (cdr args)
	     (append acc (car args))))
      (else
       (error (format "Unknown format element: ~a" (car fmt)))))))

(define (unpack fmt l)
  (reverse
   (let loop ((fmt fmt)
	      (l l)
	      (acc '()))
     ;;(write (list fmt l acc)) (newline)
     (cond
      ((null? fmt)
       acc)
      ((number? (car fmt))
       (loop (cdr fmt)
	     (drop l (car fmt))
	     (cons (u8-list->uint (take l (car fmt)))
		   acc)))
      ((equal? (car fmt) 's)
       (let ((len (u8-list->uint (take l 2)))
	     (m (drop l 2)))
	 (loop (cdr fmt)
	       (drop m len)
	       (cons (u8-list->string (take m len))
		     acc))))
      ((pair? (car fmt))
       (let* ((count (u8-list->uint (take l (caar fmt))))
	      (m (drop l (caar fmt))))
	 (receive (p octets)
		  (case (cdar fmt)
		    ((s)
		     (let ((p (reverse (unpack (make-list count (cdar fmt))
					       l))))
		       (values p
			       (reduce + 0 (map string-length p)))))
		    ((d)
		     (values (take m count)
			     count))
		    (else
		     (values (reverse (unpack (make-list count (cdar fmt))
					      l))
			     (* count (cdar fmt)))))
           (loop (cdr fmt)
		 (drop m octets)
		 (cons p acc)))))
	       
      (else
       (error (format "Unknown format element: ~a" (car fmt))))))))


;;
;; Packet assembly and disassembly
;;

(define (make-packet type . args)
  (let* ((spec (cdr (assoc type message-specs)))
	 (msgnum (car spec))
	 (fmt (cadr spec))
	 (p (pack fmt args)))
    (append (uint->u8-list 4 (+ 5 (length p)))
	    (list msgnum)
	    p)))

(define (write-packet ixp type . args)
  ((ixp-write ixp) (apply make-packet (cons type args))))

(define (read-uint width ixp)
  (u8-list->uint ((ixp-read ixp) width)))

(define (read-packet ixp)
  (let* ((len (read-uint 4 ixp))
	 (msgnum (read-uint 1 ixp))
	 (spec (spec-by-num msgnum))
	 (fmt (caddr spec))
	 (datum ((ixp-read ixp) (- len 5))))
    (cons (car spec)
	  (unpack fmt datum))))


;;
;; 9p record
;;
;; This is how I deal with the fact that no two scheme implementations
;; have the same socket API.  There are no SRFIs for sockets so that's
;; not likely to change in the near future.
;;
;; You create one of these with (make-ixp read-u8-list write-u8-list).
;; read-u8-list should one argument, count, and return a list of length
;; count of octets (u8s) read from the socket.  write-u8-list takes one
;; argument, l (a u8-list), and writes that to the socket.
;;
(define-record-type ixp
  (make-ixp read-u8-list write-u8-list)
  ixp?
  (read-u8-list ixp-read)
  (write-u8-list ixp-write))


(define (ixp-transaction ixp type . args)
  (apply write-packet (append (list ixp type 1) args))
  (let ((ret (read-packet ixp)))
    (if (equal? (car ret) 'RError)
	(error (format "IXP Recieve: ~a" ret))
	ret)))

;; Rewriting this procedure should be all you need to do in order to
;; port this code.
(define (gauche-with-ixp socket proc)
  (call-with-client-socket socket
   (lambda (in out)
     (let ((ixp (make-ixp
		 (lambda (count)
		   (let ((vec (make-u8vector count)))
		     (if (not (equal? (read-block! vec in) count))
			 (error "read-octets: short read")
			 (u8vector->list vec))))
		 (lambda (u8-list)
		   (write-block (list->u8vector u8-list) out)
		   (flush out)))))
       (proc ixp)))))


(define (main args)
  (gauche-with-ixp (make-client-socket 'unix "/tmp/ns.neale.:0/wmii")
    (lambda (ixp)
      (let ((root-fid #xf00fb1ba)
	    (fid 1)
	    (username "the dink")
	    (filename "event")
	    (data "hello\n"))
	(ixp-transaction ixp 'TVersion 4096 "9P2000")
	(ixp-transaction ixp 'TAttach root-fid #xffffffff username "")

	(ixp-transaction ixp 'TWalk root-fid fid (list filename))
	(ixp-transaction ixp 'TOpen fid 1)
	(ixp-transaction ixp 'TWrite fid 0 (list data))
	(ixp-transaction ixp 'TClunk fid)

	(ixp-transaction ixp 'TWalk root-fid fid (list filename))
	(ixp-transaction ixp 'TOpen fid 0)
	(write
	 (let ((cl (caddr (ixp-transaction ixp 'TRead fid 0 4096))))
	   (ixp-transaction ixp 'TClunk fid)
	   (u8-list->string cl)))
	(newline))))
  0)