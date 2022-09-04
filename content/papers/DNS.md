---
title: How DNS Works
section: computing
---

When you request a URL like `http://goob.woozle.org/~neale/foo.html`,
the first thing your browser does is send out a DNS query on
"goob.woozle.org".  Specifically, it asks for A records or CNAMEs.  A
records contain the name → IP mapping, and CNAMEs are like aliases.
CNAMEs are a little out of vogue these days, so I'll focus on A records.

Your browser sends the query to your recursive DNS resolver (the
nameserver in /etc/resolv.conf).  The resolver then pulls out the last
part of the hostname (the .org), and looks for the server that can
answer for the .org Top Level Domain (TLD).  It does this by asking some
big central nameservers that are listed by IP in its configuration.  One
of those big central nameservers will come back and say something like,
".org is served by 1.2.3.4".  Then your recursive resolver goes off to
1.2.3.4 and asks it about "woozle.org".  1.2.3.4 will come back with
another IP, in this case 216.39.146.229.  Finally, the resolver connects
to 216.39.146.229 and asks it about "goob.woozle.org". 216.39.146.229
will come back with an answer of 216.39.146.229 (since 216.39.146.229 is
what's listed as goob.woozle.org's IP address).

The reason the .org domain said to go to 216.39.146.229 is because
that's what I listed as the primary authoritative name server for the
"woozle.org" domain with my host registrar (pacificroot.com). A lot of
people use networksolutions.com as their host registrar. So on
216.39.146.229, I have an authoritative name server that knows about the
woozle.org domain.  Some examples of authoritative name server software
are nsd, tinydns, and BIND.

Your recursive resolver has now obtained the mapping from
"goob.woozle.org" to 216.39.146.229, so it returns that IP address to
your web browser.  If you're running a caching resolver, then the next
time it's asked it won't bother querying the Internet again, it will
just tell you the same thing it told you last time. That can make things
a whole lot faster.

Then your browser makes a TCP connection to 216.39.146.229, on port 80
(the HTTP port).  When it connects, it sends something like this:

<pre>
  GET /~neale/foo.html
  Host: goob.woozle.org
</pre>

That's helpful, because I have a whole lot of hostnames all going to
216.39.146.229.  The web server looks at the host header and pulls up
the appropriate page for that domain.  My web server, thttpd, has an
easy go of this: it just goes into a directory called "goob.woozle.org".
Apache and other servers take a little more configuration, but in
practice aren't much more difficult to run.  This concept of many names
pointing to the same IP address is called "virtual hosting".
