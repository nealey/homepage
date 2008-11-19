#! /bin/sh -x

JUNK=$HOME/Maildir/.Junk

deliver () {
  fn=`date +%s`.$$.`hostname`
  mv $1 $2/tmp/$fn
  mv $2/tmp/$fn $2/new/
  chmod 600 $2/new/$fn
}

if [ -d $JUNK ]; then
  tmp=`tempfile`
  trap "rm -f $tmp" 0

  bogofilter -p -u > $tmp
  case $? in
    0) # spam
      deliver $tmp $JUNK
    ;;
    1) # ham
      /usr/lib/dovecot/deliver < $tmp
    ;;
    2) # unsure
      for d in .maybe -maybe; do
        if [ -d $JUNK$d ]; then
          deliver $tmp $JUNK$d
	  exit 0
        fi
      done

      # Fall-through
      /usr/lib/dovecot/deliver < $tmp
    ;;
  esac
else
  exec /usr/lib/dovecot/deliver
fi