#! /usr/bin/env python

## htmlpp -- Python HTML/CSS pretty-printer
##
## Thanks to ActiveState's ASPN (which rules, thanks guys) for leading
## me to this idea.  AFAIK, they got the idea from MoinMoin.
##
## This is a part of epy: http://woozle.org/~neale/src/epy/

from __future__ import generators
import cgi
import sys
import keyword
import token
import tokenize

def prettyprint(fd):
    """Pretty print code into HTML/CSS.

    This returns a generator, which generates tokens to be printed to
    some HTML document.  You'll need to define a style sheet to get the
    colors you like.

    """

    end = (0, 0)
    last = (None,) * 5
    for tok in tokenize.generate_tokens(fd.readline):
        start = tok[2]
        if start[1] != end[1]:
            if start[0] != end[0]:
                # What to do here?  Punt.
                yield '\n<strong>prettyprint punting: %s %s</strong>\n' % (tok, end)
            else:
                yield tok[4][end[1]:start[1]]
        end = tok[3]
        if end[1] == len(tok[4]):
            # Prevent punting on newlines
            end = (end[0] + 1, 0)
        if tok[0] == token.NAME:
            if keyword.iskeyword(tok[1]):
                style = 'KEYWORD'
            elif last[1] in ('class', 'def'):
                style = 'FUNCTION'
            else:
                style = 'NAME'
        else:
            style = token.tok_name.get(tok[0])
        s = tok[1].expandtabs()
        txt = cgi.escape(s)
        if style:
            last = tok
            yield ('<span class="%s">%s</span>'
                   % (style, txt))
        else:
            yield s

def pp_fd(f, out=sys.stdout):
    """Pretty print a file object."""

    for item in prettyprint(f):
        out.write(item)

def pp_file(filename, out=sys.stdout):
    """Pretty print a filename.

    Open and pretty-print python source in filename.  Output goes to out
    (default, sys.stdout).

    """

    pp_fd(open(filename), out)

def pp_string(string, out=sys.stdout):
    """Pretty print a string."""

    import cStringIO as StringIO

    f = StringIO.StringIO(string)
    pp_fd(f, out)

if __name__ == "__main__":
    import sys

    print '''<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
  "http://www.w3.org/TR/html4/strict.dtd">
<html>
  <head>
    <title>Bee-yoo-ti-ful source code</title>
    <link rel="stylesheet" type="text/css"
      href="http://woozle.org/~neale/default.css">
  </head>
  <body>'''
    print '<pre>'
    # write colorized version to stdout
    for item in prettyprint(sys.stdin):
        sys.stdout.write(item)
    print '</pre></body></html>'


