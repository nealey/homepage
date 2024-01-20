---
title: "Arduino, Big Builder, and Make"
date: 2024-01-05
tags:
  - computers
  - ci/cd
---

Last night,
I got Big Builder building Arduino sketches.

Big Builder is my Continuous Integration / Continuious Development (ci/cd)
solution for forgejo/gitea.
It's nothing revolutionary,
it's just a container with a bunch of pre-installed software,
and the gitea `act_runner` with a configuration to *not* try and use docker.
This means my builds are pretty quick,
and my network use is very low,
since I already have the tools I need to build stuff,
and don't have to download mulitple OS images every time I do a build.

## Automating embedded systems builds

Arduino, it turns out,
has been including command-line build tools for a long time now.
Since I'm using Debian's Arduino package,
I get the older, poorly-documented `arduino-builder`.
But the newer `arduino-cli` has better documentation,
that helped me understand how to use the older command.

Using `arduino-builder` lets me keep the source code structured
in a way that makes sense to amateur developers:
they can just load it up in the IDE and not worry about my automation.
But it also lets me automate builds on my forgejo server,
and use the command-line to build everything,
the way I've been doing since the 80s.

Here's what I wound up with,
to build a Leonardo image:

```sh
mkdir -p build/cache
arduino-builder \
  -build-path $(pwd)/build/ \
  -build-cache $(pwd)/build/cache/ \
  -fqbn arduino:avr:leonardo \
  -hardware /usr/share/arduino/hardware/ \
  -tools /usr/share/arduino/tools/ \
  -compile MockBand.ino
```

This results in `build/MockBand.ino.hex`,
which can then be given to `avrdude` to flash my board.
Easy!

----

For the mockband project,
I also needed to specify a custom USB VID/PID and a CPP definition.
After reading a lot of forums posts and code,
I discovered I could easily do this with `arduino-builder`,
with the `-prefs=` flag.
This allows you to override settings in `boards.txt`,
which is apparently what Arduino uses to build a gcc flags list.

Here's a trimmed-down version of what I implemented:

```sh
mkdir -p build/cache
arduino-builder \
  -build-path $(pwd)/build/ \
  -build-cache $(pwd)/build/cache/ \
  -fqbn arduino:avr:leonardo \
  -hardware /usr/share/arduino/hardware/ \
  -tools /usr/share/arduino/tools/ \
  -prefs="build.extra_flags=-DUSB_VID=0x1bad -DUSB_PID=0x0004 -DCDC_DISABLED" \
  -compile MockBand.ino
```

---

My final step was to write a `Makefile` to do all this.
Since the build step is just one (long) command,
and the `-prefs` could easily use per-target variables,
`make` was an obvious tool.
Adding a target to run `avrdude` was simple enough, too.

I no longer need the Arduino IDE at all,
but the project still works with it!

The result was a
[Makefile](https://git.woozle.org/neale/mockband/src/commit/63bd0672500631b8c47f24f041693e642ab32533/Makefile)
which can compile, flash, and package
all three variants of the build.
It's 43 lines long,
including blank lines.

