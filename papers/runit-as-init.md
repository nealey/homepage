---
title: My experiences using runit in Arch Linux
---

In around 2012,
after using busybox runit instead of sysvinit in my
[Dirtbags Tiny Linux](https://woozle.org/neale/g.cgi/ctf/dbtl)
distribution,
I decided to try it out on my laptop, too.
Here's how that went.

My older paper on specifics of the conversion
is still online: [Runit on Arch](arch-runit.html)

Motivation
==========

I wanted to see if I could get a working system without having systemd
installed at all.
Not because I hate systemd,
but because I love runit.
I am acutely aware that a lot of people have strong opinions about systemd.
Please: you don't need to share them with me.
I don't care.

Replacing init
--------------

First and most obvious was to get a getty running with my own
`/sbin/init`.
At the time,
arch had just switched over to systemd,
and had a recently-maintained systemv-init.
Copying that,
I was able to write a new init in Bourne shell.
The resulting init did the following:

* Mount and set up special filesystems (proc, sys, dev)
* Set the system clock
* Populate /dev (with `mdev -s`)
* Load drivers (by reading `modalias` files in /sys)
* Set the hostname
* Bring up the loopback network interface
* Set up cryptographic devices, if there are any
* `fsck -A`
* Remount / read-write
* Mount everything else
* Hand off to `runsvdir`

Not bad, really.


Setting up runit services
-------------------------

I won't go into this too much, it's well-documented elsewhere.
At this point, I was able to get a getty going,
but X11 wasn't recognizing the keyboard or mouse.


Making X11 work
---------------

X11 at the time wanted `udev`,
so I just ran that from init.
But, a few months later,
X was able to start without `udev`,
so I took it out and figured out the keyboard and mouse problem.

It had something to do with `evdev`;
I think `udev` provided some sort of `evdev` help to X11,
so I had to create some files in `/etc/X11/xorg.conf.d`
to disable `AutoAddDevices`.
Then the keyboard and mouse worked.

I never looked into how to get evdev working again.


Hot-plugging devices (like udev)
--------------------------------

For a while,
you could echo something into a file under `/proc`
and the kernel would run that for every uevent.
You could set that program to `mdev` from busybox,
and have a pretty well working system at that point.

Newer kernels disabled support for this legacy interface.
Now, you're supposed to monitor for Netlink events.
But that's not too tough, it turns out.
The kernel docs even have an example program to gather uevents.


Wayland
-------

All you had to do was make a group with a certain name and add yourself to it.
You also had to have write access to `/dev/dri/*` for the X11 stuff.
Wayland was actually pretty low on crazy requirements.
No consolekit or policykit or whatnottery needed.


That's all?
-----------

Yup!


Retrospective View
==================

After two years with this setup,
I'm back to Ubuntu now,
which means soon I'll have systemd.
Looking back on it, here's how it went.


It was blazing fast
-------------------

My new Ubuntu install boots a lot slower than my runit thing did.
Maybe 2-3 times slower.
Of course, it's doing way more.
This is the cost of having a general-use distribution:
you have to account for lots of cases,
and need lots more support software.
You can't rely on the machine owner to debug when,
for instance,
the console user doesn't have write access to the DRI device.


It was easy (for me)
--------------------

Runit is really nice.
I like it a lot.
For old Unix beardos like me,
having everything in Bourne shell is an attractive proposition.



It required high wizardry
-------------------------

The head guy from the Archbang distribution tried to duplicate my work once,
and failed to make everything work.
We never did sort out what he needed to change.
This was not something I'd recommend trying if you're not an expert
and/or unwilling to debug a massively broken system for weeks.


Stuff that never quite worked
-----------------------------

I had to set up a `dmix` device for ALSA,
which usually worked,
but sometimes things would get an exclusive lock on the sound hardware,
which prevented other things from making sound.

I could never get Chrome to get sound from the USB webcam I had to use at work.
It would list it as a microphone source,
and occasionally if I kept selecting every mic source over and over,
it would start working.
But it was never consistent,
and I was never able to figure out why not.

I never figured out how to get X11 to use evdev devices.


Parting thoughts
----------------

Systemd fixes a lot of really ugly hacks.
Things had become super kludgy,
and systemd cleans it all up.
I can't speak to systemd's architecture.
It was annoying at times when stuff seemed to depend on systemd,
but after looking into it,
I was always able to find another way to do it.

Bear in mind, I never tried to run Gnome or KDE.
But I don't think people who want Gnome are going to want to futz around
with writing run scripts for lid button events.

The Linux kernel does not,
to my mind,
appear to be making any huge changes for systemd.
Nothing I ran into here was out of reach for my project.

Linux can still be used in a traditionally Unixy way.
But you have got to bear in mind how un-Unixy things like X11 are.
Wayland might be better, I don't know enough to say yet.

My point is, Unix lost its roots decades ago with X11,
or maybe even before with the Berkeley socket API,
which didn't work from a shell script.
I think it would be cool if somebody tried to make Linux
look more like Plan9,
and maybe the current backlash will kick that off.
Runit is a way could do that.
Please feel free to contact me :)

