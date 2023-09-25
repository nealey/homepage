---
title: baud.c
---

[baud.c](baud.c) is a program to simulate going through a modem.
It reads stdin, and prints it to stdout at the provided baud rate (bits per second).


Building
--------

Download [baud.c](baud.c). Change to that directory, and type

    make baud

That will generate a file named `baud` in whatever directory you're in.
If you like,
you can put it in `~/bin` or `~/.local/bin` or `/usr/games/bin` or
wherever you prefer.


Running
-------

If you'd like to see what life was like when I got my first modem, try

    cat file | ./baud 110 40

Run that for a few hours, then try

    cat file | ./baud 1200 20

And you will understand how mind-blowingly fast 1200 baud modems were at the time.

    frotz zork1.zip | ./baud 4800

Gives Zork a retro vibe,
without being so slow that it's aggravating.
I don't think more than a dozen or so people every played Zork over a modem link,
but whatever.


Why
---

Every 10 years or so, somebody asks me for this program.
I don't know why.

The other day it happened again, and I couldn't find it soon enough,
so I just wrote it again from scratch.
I'm putting it on my web site so I don't have to write it again.

