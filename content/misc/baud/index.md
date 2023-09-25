---
title: baud.c
---

[baud.c](baud.c) is a program to simulate going through a modem.
It reads stdin, and prints it to stdout at the provided baud rate (bits per second).

If you'd like to see what life was like when I got my first modem, try

    cat file | ./baud.c 110 40

Run that for a few hours, then try

    cat file | ./baud.c 1200 20

And you will understand how mind-blowingly fast 1200 baud modems were at the time.

---

This is the second or third time I've written this code.
I'm putting it on my web site so I don't have to write it again.
