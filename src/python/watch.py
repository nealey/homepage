#!/usr/bin/python

"""watch.py -- Web site change notification tool
Author: Neale Pickett <neale@woozle.org>
Time-stamp: <2007-09-19 15:00:43 neale>

Usage: urlwatch [-c|--config WATCHRC]

This is something you can run from a cron job to notify you of changes
to a web site.  You just set up a ~/.watchrc file, and run watcher.py
from cron.  It mails you when a page has changed.

I use this to check for new software releases on sites that just change
web pages; my wife uses it to check pages for classes she's in.

You'll want a ~/.watchrc that looks something like this:

    to: your.email.address@example.com
    http://www.example.com/path/to/some/page.html

The 'to:' line tells watch.py where to send change notification email.
You can also specify 'from:' for an address the message should come from
(defaults to whatever to: is), and 'host:' for what SMTP server to send
the message through (defaults to localhost).

When watch.py checks a URL for the first time, it will send you a
message (so you know it's working) and write some funny characters after
the URL in the .watchrc file.  This is normal--watch.py uses these
characters to remember what the page looked like the last time it
checked.

"""

import os
import urllib2 as urllib
import sha
import smtplib
import sys

host = 'localhost'
fromaddr = None
toaddr = None

rc = os.path.expanduser('~/.watchrc')

def usage(errmsg=None):
    if errmsg:
        print "error: %s" % errmsg
        print

    print globals()['__doc__']

    if errmsg:
        sys.exit(1)
    sys.exit(0)

def myhash(data):
    return sha.new(data).hexdigest()

def notify(fromaddr, toaddr, url):
    msg = """From: URL Watcher <%(from)s>
To: %(to)s
Subject: %(url)s changed

%(url)s has changed!
""" % {'from': fromaddr,
       'to':   toaddr,
       'url':  url}
    s = smtplib.SMTP(host)
    s.sendmail(fromaddr, [toaddr], msg)
    s.quit()

def watch(rcfile):
    global host, fromaddr, toaddr

    f = open(rcfile)
    outlines = []
    for line in f.xreadlines():
        if line[0] == '#':
            continue

        line = line.strip()
        if not line:
            continue

        splits = line.split(' ', 1)
        url = splits[0]
        if url == 'from:':
            fromaddr = splits[1]
        elif url == 'to:':
            toaddr = splits[1]
            if not fromaddr:
                fromaddr = toaddr
        elif url == 'mailhost:':
            host = splits[1]
        else:
            if (not fromaddr) or (not toaddr):
                raise ValueError("must set to: before any urls")
            page = urllib.urlopen(url).read()
            ph = myhash(page)

            try:
                h = splits[1]
            except IndexError:
                h = None
            if h != ph:
                notify(fromaddr, toaddr, url)
            line = '%s %s' % (url, ph)
        outlines.append(line)

    f.close()

    f = open(rcfile, 'w')
    f.write('\n'.join(outlines) + '\n')
    f.close()

if __name__ == '__main__':
    import getopt
    import sys

    opts, args = getopt.getopt(sys.argv[1:], 'c:h', ['config=', 'help'])
    for k,v in opts:
        if k in ('-c', '--config'):
            rc = v
        elif k in ('-h', '--help'):
            usage()
        else:
            usage("Unknown option: %s" % k)

    watch(rc)
