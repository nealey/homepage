Title: Python ipqueue

No Longer Maintained
--------------------

This software is no longer maintained.

ipqueue has been deprecated in favor of nfqueue.  You can download a [Python
nfqueue module](http://software.inl.fr/trac/wiki/nfqueue-bindings) which should
support all the functionality of ipqueue.  In Debian or Ubuntu, you can just

    # apt-get install libnetfilter-queue-python

This page remains here for those who know what they're doing and are
still using the old libipq.  This software will not compile with the
backwards-compatibility library provided by nfqueue.

About
-----

This is the Netfilter userspace IPQueue module for Python. It allows you
to do all your Linux IPQueue stuff from the comfort of Python. This only
works with Linux.

Put in simpler terms, this is a way to hook a Python script into your
kernel's networking stack. This could be the fundamental building block
of a firewall. You can use it to snoop on traffic, modify or discard
certain packets, make routing decisions, masquerade stuff, whatever--and
you get it all with garbage collection :)

Apparently this program appears in a book called "Security Power Tools".
That means I'm *Internet Famous*!

Download
--------

This software is no longer maintained (see above).

* [Latest version](/neale/g.cgi/attic/py-ipqueue/snapshot/py-ipqueue-master.tar.gz)
* [Git repository](/neale/g.cgi/attic/py-ipqueue/)
* [Netfilter QUEUE bindings](nfqueue-0.1.tar.bz2) by Mike Auty <mike.auty@gmail.com>
* [nfqueue bindings](http://software.inl.fr/trac/wiki/nfqueue-bindings)

License
-------

GPL, of course.

Support
-------

This software is no longer maintained (see above).  Support requests
will be politely redirected to the newer [nfqueue
bindings](http://software.inl.fr/trac/wiki/nfqueue-bindings).


Screen Shots
------------

Here's an example program which transparently proxies all traffic it
gets to port 25 of 10.1.1.2. This is just an example, a real-world
transparent proxy would be much more sophisticated.

    #! /usr/bin/env python

    import ipqueue
    import iputils

    rewrite = 1

    q = ipqueue.IPQ(ipqueue.IPQ_COPY_PACKET)
    while 1:
        p = q.read()
        tcp = iputils.TCP(p[ipqueue.PAYLOAD])
        print "Got %s -> %s on hook %d" % (iputils.ntoa(tcp.saddr),
                                           iputils.ntoa(tcp.daddr),
                                           p[ipqueue.HOOK])

        if rewrite and p[ipqueue.HOOK] == 0:
            tcp.daddr = iputils.aton("10.1.1.2")
            tcp.th_dport = 25
            q.set_verdict(p[0], ipqueue.NF_ACCEPT, tcp.to_str())
        else:
            q.set_verdict(p[0], ipqueue.NF_ACCEPT)
