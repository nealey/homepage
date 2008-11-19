#! /usr/bin/python

## cronit -- A lightweight (aka "lousy") anacron replacement
## Copyright (C) 2007 Neale Pickett
##
## This program is free software: you can redistribute it and/or modify
## it under the terms of the GNU General Public License as published by
## the Free Software Foundation, either version 3 of the License, or (at
## your option) any later version.
##
## This program is distributed in the hope that it will be useful, but
## WITHOUT ANY WARRANTY; without even the implied warranty of
## MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
## General Public License for more details.
##
## You should have received a copy of the GNU General Public License
## along with this program.  If not, see <http://www.gnu.org/licenses/>.

import time
import os
import popen2
import socket

basedir = os.path.expanduser('~/lib/cron')

os.chdir(os.path.expanduser('~'))

now = time.time()
periods = (('test', -1),
           ('hourly', 3600),
           ('daily', 86400),
           ('weekly', 604800),
           ('monthly', 18144000),       # more or less
           ('yearly', 2204892000))

def run_parts(dir):
    out = []
    for script in os.listdir(dir):
        if script.endswith('~') or script.startswith('.'):
            continue
        fn = os.path.join(dir, script)
        proc = popen2.Popen4(fn)
        proc.tochild.close()
        outstr = proc.fromchild.read()
        ret = proc.wait()
        if outstr or ret:
            out.append((fn, outstr, ret))
    return out

def cronit(basedir):
    for name, interval in periods:
        dir = os.path.join(basedir, name)
        if not os.path.exists(dir):
            continue
        tsfile = os.path.join(dir, '.timestamp.%s' % socket.gethostname())
        try:
            ts = int(file(tsfile).read().strip())
        except:
            ts = 0
        if ts + interval < now:
            problems = run_parts(dir)
            file(tsfile, 'w').write('%d\n' % now)
            for script, output, ret in problems:
                print '====== %s exited with code %d' % (script, ret/256)
                print output

if __name__ == '__main__':
    cronit(basedir)
