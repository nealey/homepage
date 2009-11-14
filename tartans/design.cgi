#! /usr/bin/python

import cgitb; cgitb.enable()
import htmltmpl
import loom
import re
import sys
import cgi
import os
import rfc822
import urllib
import cStringIO as StringIO

var_re = re.compile('\$(\w+|{\w+})')
def fill_template(tmpl, **keywds):
    def repl(match):
        var = match.group(0)[1:]
        var = var.strip('{}')
        return keywds[var]
    return var_re.sub(repl, tmpl)


def serve(s, c_t):
    o = ('Content-type: %s\r\nContent-length: %d\r\n\r\n%s' %
         (c_t, len(s), s))
    sys.stdout.write(o)

f = cgi.FieldStorage()

s = f.getfirst('sett')
if s:
    sett = loom.str_to_sett(s)
    l = loom.tartan(sett)
    p = StringIO.StringIO()
    l.png(p)

    serve(p.getvalue(), 'image/png')
else:
    manager = htmltmpl.TemplateManager(precompile=0)
    tmpl = manager.prepare('/home/neale/lib/wiki/templates/page.tmpl')
    processor = htmltmpl.TemplateProcessor(html_escape=False)

    t = os.environ.get('PATH_INFO', '').strip('/')
    if not t:
        t = f.getfirst('t', 'Unknown')
    s = f.getfirst('s')
    if t and not s:
        try:
            m = rfc822.Message(file('%s.tartan' % t))
            t = m.get('Title', t)
            s = m.get('Sett')
        except IOError:
            pass

    if not t or not s:
        # Default to Black Watch
        t = 'Black Watch'
        s = ('B22 BK2 B2 BK2 B2 BK16 G16 BK2 G16 BK16 B16 BK2 B2'
             'BK2 G10 BK8 DB9 BK1 DB1')
    s_st = s.replace(' ', '')
    s_st = s_st.replace('\n' ,'')

    content = '''
    <ul style="background: white; float: right;">
      <li><a href="design.cgi?sett=%(sett_compressed)s">image only</a></li>
      <li><a href="/~neale/tartans">More tartans</a></li>
    </ul>

    <h2>woozle.org tartan designer</h2>
    <form action="design" style="padding: 10px;">
      <input name="t" value="%(tartan)s" />
      <textarea name="s" rows="3" cols="40">%(sett)s</textarea> <br />
      <input type="submit" value="Generate" />
    </form>

    <div style="background: url(design.cgi?sett=%(sett_compressed)s);
                height: 400px;
                border: solid black 40px;">
    </div>
    ''' % {'tartan': t,
           'sett': s,
           'sett_compressed': urllib.quote(s_st)}

    processor.set('title', t)
    processor.set('content', content)
    page = processor.process(tmpl)

    serve(page, 'text/html')
