#! /usr/bin/python

import sys
import Image
import re
import array

colors = {'R': '\x88\x00\x00',          # Red
          'G': '\x00\x44\x00',          # Green
          'B': '\x00\x00\x44',          # Blue
          'C': '\x00\x44\x44',          # Cyan
          'Y': '\x99\x99\x00',          # Yellow
          'P': '\x99\x00\x99',          # Purple (?!)
          'W': '\x99\x99\x99',          # White
          'K': '\x00\x00\x00',          # Black
          'BK': '\x00\x00\x00',         # Black
          'GR': '\x44\x44\x44',         # Gray
          'DB': '\x00\x00\x55',         # Dark Blue
          'LB': '\x00\x44\x99',         # Light Blue
          'LR': '\x99\x00\x00',         # Light Red
          'LG': '\x00\x99\x00',         # Light Green
          'LV': '\x88\x44\x99',         # Lavender
          'BR': '\x55\x44\x00',         # Brown
          'LGR': '\x99\x99\x99',        # Light Gray
          'LBR': '\x66\x66\x00',        # Light Brown
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
            ca = array.array('B')
            for a in cs[1:-1]:
                ca.append(int(a+a, 16))
            c = ca.tostring()
        else:
            c = colors[cs]
        n = int(m.group(2))
        sett.append((c, n))
        s = s[m.end():]
    if not s.endswith('.'):
        o = sett[:]
        o.reverse()
        sett += o
    return sett



class Loom:
    """Simulates a simple loom with only one weft color per row.

    This probably does a simplistic weave too, I don't know enough about
    weaving to say for sure.  But I can imagine more complicated ways of
    doing it.

    """

    def __init__(self, warp):
        self.warp = warp
        self.cloth = []
        self.row = 0

    def weave(self, weft):
        out = []
        for i in range(len(self.warp)):
            if (i + self.row) % 2 == 0:
                out.append(weft)
            else:
                out.append(self.warp[i])

        self.cloth.append(out)
        self.row += 1


class Tartan:
    def __init__(self, sett):
        # Weave a whole pattern suitable for tiling.  In other words, it
        # does the mirroring for you.

        if type(sett) == type(''):
            sett = str_to_sett(sett)

        warp = []
        for c,n in sett:
            warp += [c]*n

        if False:
            # Offset it to the center of the first dealie
            o = sett[0][1] / 2
            warp += warp[:o]
            del warp[:o]

        self.loom = Loom(warp)
        for w in warp:
            self.loom.weave(w)

        rgbs = [''.join(x) for x in self.loom.cloth]
        imgstr = ''.join(rgbs)
        self.img = Image.fromstring('RGB',
                                    (len(self.loom.cloth[1]),
                                     len(self.loom.cloth)),
                                    imgstr)

    def png(self, fd):
        self.img.save(fd, 'PNG')

if __name__ == '__main__':
    sett = sys.argv[1]
    t = Tartan(sett)
    t.png(sys.stdout)
