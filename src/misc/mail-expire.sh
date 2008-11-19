#!/usr/bin/python

description = '''All Maildir++ folders are checked for old mail. Any messages older than
DAYS days than the newest message in a folder are removed.  If there is
a file named"expire" in a maildir, its contents will be used instead of
DAYS for that folder.  You can put "12345678" in the "expire" file to
set an expiration of 1413 years, which is probably longer than you will
care about the mail folder.

Specify a path in MAILDIR to check a specific Maildir.  Subfolders will
not be checked in this case.

'''

import glob
import os
import sys
import optparse

progname = sys.argv[0]
debug = 0

def expire(dirname, days):
    expire = "%s/expire" % dirname
    if os.path.exists(expire):
	days = int(open(expire).read())
    secs = long(days) * 24 * 60 * 60
    messages = glob.glob("%s/cur/*" % dirname)
    messages += glob.glob("%s/new/*" % dirname)
    if not messages:
	return
    messages = [(os.path.getmtime(m), m) for m in messages]
    messages.sort()
    latest = messages[-1][0]
    for m in messages:
	if (m[0] + secs) < latest:
            try:
                _, flags = m[1].split(',')
            except ValueError:
                continue
            if 'S' in flags:
                # Only if the mail's been seen
                if debug:
                    print m[1]
                else:
                    os.remove(m[1])

def usage(err=None):
    if err:
	print "Error: %s" % err
	print
    print __doc__ % globals()
    if err:
	sys.exit(1)
    else:
	sys.exit()

def main():
    import optparse
    global debug

    parser = optparse.OptionParser(usage='usage: %prog [options] [MAILDIR ...]',
                                   description=description)
    parser.add_option('-d', '--debug', dest='debug', action='store_true',
                      help="run in debug mode (don't do anything)")
    parser.add_option('-t', '--time', dest='days', metavar='DAYS', type='int',
                      default=90,
                      help="Mail older than DAYS days will be removed (default 90)")
    options, args = parser.parse_args()

    debug = options.debug

    if (len(args) == 0):
        base = os.path.expanduser("~/Maildir")
        files = [os.path.join(base, x) for x in os.listdir(base) if x[0] == '.']
        dirs = [f for f in files if os.path.isdir(f)]
        dirs.append(base)
    else:
        dirs = args

    for d in dirs:
        expire(d, options.days)


if __name__ == "__main__":
    main()
