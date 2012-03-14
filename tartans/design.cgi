#! /usr/bin/python

import cgitb; cgitb.enable()
import loom
import cgi
import urllib
import os
import sys

os.chdir(os.path.dirname(sys.argv[0]))

f = cgi.FieldStorage()

s = f.getfirst('sett')
if s:
    print('Content-type: image/png')
    print('')
    sett = loom.str_to_sett(s)
    l = loom.tartan(sett)
    l.png(sys.stdout)
else:
    t = f.getfirst('t', 'Unknown')
    s = f.getfirst('s')

    if not t or not s:
        # Default to Black Watch
        t = 'Black Watch'
        s = ('B22 BK2 B2 BK2 B2 BK16 G16 BK2 G16 BK16 B16 BK2 B2 '
             'BK2 G10 BK8 DB9 BK1 DB1')
    s_ = s.replace(' ', '').replace('\n', '')

    print('Content-type: text/html')
    print('')
    sys.stdout.flush()
    content = ('Name: %s\nSett: %s\n' % (t, s))
    png = 'design.cgi?sett=%s' % urllib.quote(s_)
    cvt = os.popen('./tartantomdwn %s tartan.m4 | ../mdwntohtml ../template.m4' % (png,),
                   'w')
    cvt.write(content)
    cvt.close()
