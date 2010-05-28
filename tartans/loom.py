#! /usr/bin/python
# coding: utf-8

import re
import random

class Yarn:
    """A spool of yarn.

    Color is specified as a 3-tuple (red, green, blue) of
    saturation values ranging from 0.0 (no saturation) to
    1.0 (full saturation).

    Since we're pretending to be actual dyes here, we can fuzz it out a
    bit by not doing full screen saturation and adding a little bit of
    randomness to the color when queried.

    """

    maxval = 190
    fuzz = 0

    def __init__(self, r, g, b):
        self.rgb = (r, g, b)
        self.intrgb = [int(c * self.maxval) for c in self.rgb]

        intfuzz = int(self.fuzz * self.maxval)
        self.limits = [(max(0, c - intfuzz), min(self.maxval, c + intfuzz))
                        for c in self.intrgb]

    def __repr__(self):
        return '<Yarn %r>' % (self.rgb)

    def get_color(self):
        if self.fuzz:
            color = [random.randrange(l, h) for (l, h) in self.limits]
            return color
        else:
            return self.intrgb


class Loom:
    def __init__(self, warp):
        self.warp = warp
        self.fabric = []

    def weave(self, yarn, up=1, down=1, skip=0, repeat=0):
        offset = (len(self.fabric) / (repeat + 1)) * (skip + 1)
        harnesses = up + down
        row = []
        for i in range(len(self.warp)):
            j = (i + offset) % harnesses
            if j < down:
                row.append(self.warp[i])
            else:
                row.append(yarn)
        self.fabric.append(row)

    def plain_weave(self, yarn):
        # AKA tabby weave, taffeta weave
        self.weave(yarn)

    def twill(self, yarn, up=2, down=2):
        self.weave(yarn, up, down)

    def satin_weave(self, yarn):
        # 1/16, skip 4
        self.weave(yarn, 1, 16, 4)

    def basket_weave(self, yarn):
        # 2/2, skip 1, repeat 1
        self.weave(yarn, 2, 2, 1, 1)


class PNGLoom(Loom):
    def png(self, outf, scale=1):
        import Image
        import array

        imgstr = array.array('B')
        for fr in self.fabric:
            row = []
            for c in fr:
                for i in range(scale):
                    row.extend(c.get_color())
            for i in range(scale):
                imgstr.fromlist(row)
        x = len(fr * scale)
        y = len(self.fabric * scale)
        img = Image.fromstring('RGB', (x, y), imgstr.tostring())
        img.save(outf, 'PNG')


def ascii_test():
    print 'Plain weave'
    l = Loom('||||||||||||||||||||||||||||||||')
    for i in range(16):
        l.plain_weave('-')
    for row in l.fabric:
        print '    ', ''.join(row)

    print 'Twill'
    l = Loom('||||||||||||||||||||||||||||||||')
    for i in range(16):
        l.twill('-')
    for row in l.fabric:
        print '    ', ''.join(row)

    print '2/1 twill'
    l = Loom('||||||||||||||||||||||||||||||||')
    for i in range(16):
        l.twill('-', 2, 1)
    for row in l.fabric:
        print '    ', ''.join(row)

    print 'Satin weave'
    l = Loom('||||||||||||||||||||||||||||||||')
    for i in range(16):
        l.satin_weave('-')
    for row in l.fabric:
        print '    ', ''.join(row)

    print 'Basketweave'
    l = Loom('||||||||||||||||||||||||||||||||')
    for i in range(16):
        l.basket_weave('-')
    for row in l.fabric:
        print '    ', ''.join(row)


##
## Tartan junk
##

#
# Colors according to http://www.tartanregister.gov.uk/guidance.aspx
#
colors = {'R':   Yarn(0.50, 0.00, 0.00), # Red
          'G':   Yarn(0.00, 0.40, 0.00), # Green
          'B':   Yarn(0.00, 0.00, 0.50), # Blue
          'C':   Yarn(0.00, 0.50, 0.50), # Cyan
          'Y':   Yarn(0.80, 0.80, 0.00), # Yellow
          'P':   Yarn(0.60, 0.00, 0.60), # Purple
          'W':   Yarn(0.90, 0.90, 0.90), # White
          'K':   Yarn(0.00, 0.00, 0.00), # Black
          'BK':  Yarn(0.00, 0.00, 0.00), # Black
          'GR':  Yarn(0.50, 0.50, 0.50), # Gray
          'DB':  Yarn(0.00, 0.00, 0.30), # Dark Blue
          'LB':  Yarn(0.00, 0.40, 0.90), # Light Blue
          'LR':  Yarn(0.80, 0.00, 0.00), # Light Red
          'LG':  Yarn(0.00, 0.60, 0.00), # Light Green
          'LV':  Yarn(0.50, 0.25, 0.60), # Lavender
          'BR':  Yarn(0.60, 0.40, 0.20), # Brown
          'LGR': Yarn(0.60, 0.60, 0.60), # Light Gray
          'LBR': Yarn(0.80, 0.70, 0.50), # Light Brown
          }
sett_re = re.compile('([A-Za-z]{1,3}|\([A-Fa-f0-9]{3}\))(\d{1,3})')


def str_to_sett(s):
    """Convert an xtartan sett string into a sett tuple."""

    sett = []
    while s:
        m = sett_re.search(s)
        if not m:
            break
        cs = m.group(1)
        if cs[0] == '(' and cs[-1] == ')':
            ca = []
            for a in cs[1:-1]:
                ca.append(int(a+a, 16) / 256.0)
            y = Yarn(*ca)
        else:
            y = colors[cs]

        for i in range(int(m.group(2))):
            sett.append(y)
        s = s[m.end():]
    if not s.endswith('.'):
        o = sett[:]
        o.reverse()
        sett += o
    if len(sett) % 4:
        sett += sett
    return sett

def tartan(sett):
    l = PNGLoom(sett)
    for y in sett:
        l.twill(y)
    return l

if __name__ == '__main__':
    import sys

    for line in sys.stdin:
        if line.startswith('Sett:'):
            _, s = line.split(':', 1)
            s = s.strip()
            break
    sett = str_to_sett(s)
    l = tartan(sett)
    l.png(sys.stdout, 1)
