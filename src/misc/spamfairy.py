#! /usr/bin/python

import os
import glob
import time
from sets import Set

bogosity = {'U': "Unsure",
            'S': "Spam",
            'H': "Ham"}

def classification(filename):
    f = file(filename)
    for l in f:
        if l.startswith('X-Bogosity: '):
            return l[12]
        elif not l.strip():
            return None

def reclassify(oldtype, newtype, filenames):
    cmd = 'bogofilter -b -v'
    t = oldtype + newtype
    if t == 'SH':
        cmd += ' -Sn'
    elif t == 'HS':
        cmd += ' -Ns'
    elif t == 'UH':
        cmd += ' -n'
    elif t == 'US':
        cmd += ' -s'
    else:
        raise ValueError('Unable to reclassify %s' % t)

    cmd += ' 2>/dev/null'

    # Reclassify them
    f = os.popen(cmd, 'w')
    for fn in filenames:
        f.write('%s\n' % fn)
    ret = f.close()
    if ret:
        raise IOError("bogofilter puked on %s (%r)" % (fn, ret))

    # Add new bogosity header
    for fn in filenames:
        base, filename = os.path.split(fn)
        folder, _ = os.path.split(base)
        tmpfn = os.path.join(folder, 'tmp', filename)

        inf = file(fn)
        outf = file(tmpfn, 'w')

        headered = False
        for l in inf:
            if l.startswith('X-Bogosity: '):
                l = (('X-Bogosity: %s (Reclassified), was ' % bogosity[newtype])
                     + l[12:])
                headered = True
            elif not l.strip() and not headered:
                l = (('X-Bogosity: %s (Reclassified)\n' % bogosity[newtype]))
                headered = True
            outf.write(l)
        os.rename(tmpfn, fn)

def visit(path, folder_type):
    # Read in list of already-processed files
    visited = os.path.join(path, 'spamfairy-visited')
    oldfiles = Set()
    try:
        f = file(visited)
        for l in f:
            oldfiles.add(l.strip())
        f.close()
    except IOError:
        pass

    if folder_type == 'S':
        subdirs = ('cur', 'new')
    else:
        subdirs = ('cur',)

    for sd in subdirs:
        # Read in list of current files in the directory
        root = os.path.join(path, sd)
        files = Set(os.listdir(root))

        # We only consider the difference
        todo = files - oldfiles

        # Check new messages for reclassification
        reclass = {}                        # {oldtype: [filenames]}
        for fn in todo:
            fn = os.path.join(root, fn)
            c = classification(fn)
            if not c:
                continue
            if c != folder_type:
                l = reclass.setdefault(c, [])
                l.append(fn)

        # Reclassify anything that needs it
        for c, filenames in reclass.iteritems():
            try:
                reclassify(c, folder_type, filenames)
            except ValueError:
                pass

    # Write out new list of processed files
    new_visited = "%s.%d" % (visited, os.getpid())
    f = file(new_visited, 'w')
    for fn in files:
        f.write('%s\n' % fn)
    f.close()
    os.rename(new_visited, visited)


def get_folder_type(path):
    """Auto-detect type of a maildir.

    You can have the following files in your maildir:
        spamfairy-ignore : skip this folder entirely
        spamfairy-spam   : treat this folder as spam
        spamfairy-ham    : treat this folder as ham

    Otherwise, check the name of the folder:
        Trash      : skip
        Drafts     : skip
        Sent       : skip
        Unsure     : skip
        Junk.maybe : skip
        Junk       : spam

    Otherwise, treat it as a ham folder.

    Return values are None for skip, 'S' for spam, 'H' for ham

    """

    path = os.path.realpath(path)
    _, folder = os.path.split(path)
    folder = folder.lower()
    if os.path.exists(os.path.join(path, 'spamfairy-ignore')):
        return None
    elif os.path.exists(os.path.join(path, 'spamfairy-ham')):
        return 'H'
    elif os.path.exists(os.path.join(path, 'spamfairy-spam')):
        return 'S'
    elif folder in ('.sent', '.drafts', '.trash', '.unsure', '.junk.maybe'):
        return None
    elif folder in ('.junk', '.spam'):
        return 'S'
    else:
        return 'H'


def sprinkle(folders):
    """Sprinkle magic spamfairy dust on the given folders"""

    if not folders:
        maildir = os.path.expanduser(os.path.join('~', 'Maildir'))
        folders = [maildir]
        folders += glob.glob(os.path.join(maildir, '.??*'))

        # Only do maildirs
        folders = filter(lambda d: os.path.isdir(os.path.join(d, 'cur')),
                         folders)

    for path in folders:
        folder_type = get_folder_type(path)
        if not folder_type:
            continue
        visit(path, folder_type)

def compact(wordlist):
    """Compact bogofilter database"""
    otime = os.path.getmtime(wordlist)
    now = time.time()
    if now - otime > 60*60*24*11:
        new = '%s.new' % wordlist
        ret = os.system('bogoutil -d %s | bogoutil -l %s' % (wordlist, new))
        if not ret:
            os.rename(new, wordlist)

if __name__ == '__main__':
    import sys

    wordlist = os.path.expanduser(os.path.join('~', '.bogofilter', 'wordlist.db'))
    if os.path.exists(wordlist):
        sprinkle(sys.argv[1:])
        compact(wordlist)
