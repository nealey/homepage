---
title: Introduction To TCP Sockets
---

Client Sockets
--------------

Sockets are sort of like PBX phone systems, where the IP address is
the phone number, and the port is the extension.  Every paired
(connected) socket has a source IP/port and a destination IP/port.


When you want to hook up to a listening server, first you have to
request a socket from the kernel.  You use the socket() call.  In
Python, that'd be:

<pre>
  import socket
  s = socket.socket(socket.PF_INET, socket.SOCK_STREAM)
</pre>

That tells Python that you want a socket in the Internet class (as
opposed to, say Appletalk), and that it should be a streaming
socket (TCP, as opposed to a datagram socket, which would be UDP).

The next thing you can do is tell the kernel what IP/port you'd like to
use as the source port (think of this as the number that will show
up on caller ID when you make your connection).   You can do this
with the bind() call, like this:

<pre>
  s.bind(("192.168.4.216", 9234))
</pre>

This tells the kernel to use the IP/port of 192.168.4.216 and 9234. When
you make an outbound connection, it will come from that IP and that
port.  You can use 0 for the IP and 0 for the port, in which case
the kernel picks one for you.  Or you can skip the bind call
entirely, which is the same as binding to `('', 0)`.

So you've got a socket and it's bound to something, now all you
have to do is connect it (make your phone call).  In Python:

<pre>
  s.connect(("192.168.4.12", 80))
</pre>

That'll hook you up to port 80 (the HTTP port) of 192.168.4.12.

From then on you can use s just like it was a file, with read and
write replaced with send and recv (I think you can actually use
read and write on sockets, but traditionally send and recv are used):

<pre>
  s.send("GET / HTTP/1.0\n\n")
  print s.recv(8192)
</pre>

When you're done, just close it:

<pre>
  s.close()
</pre>


Server Sockets
--------------

Since a server operates on a IP/port combination too, you still do the
socket and bind calls (and you can skip the bind if you want any random
port, but I've never heard of a server that doesn't care what port it's
listening to).  Then the next thing you have to do for a server, instead
of connecting, is listen. In Python:

<pre>
  s.listen()
</pre>

That tells the kernel to start listening for incoming connections
to the IP/Port you got with bind.

Once you get a connection set up in the kernel, you have to ask the
kernel for that connection.  That conenction will be a different file
descriptor than the one you had listening, so that you can have multiple
connections plugged in to the same ip/port and keep them all distinct.
The call you make to the kernel is "accept" and by default it will block
(that is, the kernel won't return control to your program) until there's
a new socket established.  So you'll see loops like this:

<pre>
  while 1:
    c = s.accept()
    cli_sock, cli_addr = c

    cli_sock.send("Hello, person from %s" % cli_addr)
</pre>

So there, you are accepting from s, it puts the new socket in c. Python
does a little trick here, in that it actually returns a tuple (like a
list) with the first value the actual socket, and the second value the
address (ip/port) of the incoming connection. So you don't have to ask
again to find out who just connected to you, get get it with the accept
call.  The C library does this in a slightly different way, but you
still get the same information. And at that point, you can start
treating the client socket just like you would any other connected
socket.


Forking for fun and profit
--------------------------

The code above is the serializing (FIFO) model, but you'd need to
fork to handle multiple requests simultaneously.  In practice,
hardly anything serializes requests, what's more common is
something like this:

<pre>
  while 1:
    c = s.accept()
    if os.fork():
      c.close()
    else:
      do_client_stuff(c)
      c.close()
      exit(0)
</pre>

If you're just learning sockets, do a serialized socket first. It'll be
easier to understand what's going on that way.  But forks are easy too.
You call fork() and then you get a new process that starts with the same
everything (all the variables are the same and it starts running right
after the fork() call).  After the fork, both are running as if the fork
has just completed, but the parent's fork returned the PID of the new
process, and the child's fork returned 0.
