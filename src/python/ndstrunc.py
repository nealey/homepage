#! /usr/bin/python

"""ndstrunc -- Trims .nds ROM files."""


import struct
import optparse
import os

parser = optparse.OptionParser(description='Trims .nds ROM files.')
parser.add_option('-d', '--dry-run',
                  action='store_false', dest='writeout', default=True,
                  help="Don't actually modify any files.")
parser.add_option('-f', '--force',
                  action='store_true', dest='force', default=False,
                  help="Force truncation even if it seems like too much.")
(options, args) = parser.parse_args()

for fn in args:
    f = file(fn, 'rb+')
    f.seek(0x80)
    (size,) = struct.unpack('<I', f.read(4))

    ondisk = os.path.getsize(fn)
    reduction = 100 - (size * 100.0 / ondisk)
    print fn

    if size == ondisk:
        print '    Already truncated.'
        continue
    # I read in some source code that wifi games need 138 extra bytes.
    # Why?  I don't understand, but I figure you can afford 256 bytes
    # extra to be on the safe side.  Compared to the size of typical ROM
    # images it's a pittance.
    size += 256
    if size >= ondisk:
        print '    Already truncated.'
        continue

    print '      On disk:', ondisk
    print '  Header says:', size
    print '   Would save: %dB (%2.0f%%)' % (ondisk-size, reduction)
    if size < (ondisk >> 2):
        if options.force:
            print '  Truncating anyway, as requested.'
        else:
            print '  Would truncate too much!!'
            continue
    if options.writeout:
        f.truncate(size)
        print '    Truncated.'



