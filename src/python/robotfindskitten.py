#!/usr/bin/env python

"""robotfindskitten -- A zen simulation.

This is a web version of the classic text-based game.  The text-based
version is much better.  Go check it out at http://robotfindskitten.org/

"""

import cgitb; cgitb.enable()
import cgi
import whrandom
import sys

symbols = list('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"$%&\'()*+,-./:;<=>?@[\]^_`{|}~')
width = 50
height = 30

def color():
    def c():
        return whrandom.choice(('44', '88', 'cc', 'ff'))

    return c() + c() + c()

print 'Content-type: text/html'
print

def main():
    nki = []
    f = open('messages.h')
    for line in f.xreadlines():
        if line.startswith('  "'):
            line = line.strip()
            if line[-1] == ',':
                line = line[1:-2]
            else:
                line = line[1:-1]
            line = line.replace(r'\"', '"')
            nki.append(line)

    print '''<html><head>
    <title>robotfindskitten: a zen simulation</title>
    <link rel="stylesheet" type="text/css"
          href="http://woozle.org/~neale/default.css">
    <style type="text/css">
    a {
      text-decoration: none;
      cursor: default;
    }
    a:visited {
      color: #%s;
    }
    pre {
      background-color: black;
      border: solid white;
      text-align: center;
      padding: .75em;
      cursor: default;
    }
    </style>
    </head>''' % color()

    print '<html>'

    print '<h1>robotfindskitten</h1>'

    print '''
    <p>
      You are robot.  Your mission: find kitten.


      Hold the mouse cursor over an object you suspect to be kitten.
      After a few seconds, your browser will tell you what you have
      found.  Older browsers may not be able to relay what an object
      actually is, so the experience may be diminished somewhat.
    </p>

    '''


    print '<pre>'

    screen = []
    for i in range(height):
        screen.append([' '] * width)

    for i in range(30):
        x = whrandom.randrange(width)
        y = whrandom.randrange(height)

        n = whrandom.randrange(len(symbols))
        s = symbols[n]
        del symbols[n]
        s = cgi.escape(s)

        n = whrandom.randrange(len(nki))
        t = nki[n]
        del nki[n]
        t = cgi.escape(t)
        t = t.replace('"', '&quot;')

        screen[y][x] = ('<span style="color: #%s;" title="%s">%s</span>'
                        % (color(), t, s))
    # place kitten!
    screen[y][x] = '<a href="http://robotfindskitten.org" title="You found kitten!  Way to go, robot!">%s</a>' % s

    for row in screen:
        print ''.join(row)

    print '</pre>'

    print '</html>'

if __name__ == '__main__':
    main()

