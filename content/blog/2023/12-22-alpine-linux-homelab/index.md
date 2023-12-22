---
title: Alpine Linux Homelab
date: 2023-12-22
tags:
  - computers
---

A few days ago, my root filesystem crashed.

This isn't as big a deal as it would have been before containers:
because the filesystem was happy enough that docker could start,
all of my services were able to run, since they live on another filesystem.
Weird.
But still,
it needed to be repaired,
so I could run things like `git` (which had become corrupted).

A few of my pals have been using Alpine Linux for a while.
I've used similar distributions--tinycore and OpenWRT--so
I sort of knew what Alpine was about.
And I've used Alpine a whole lot in container images,
because it's just so gosh darn small.
So I dove in on that.

2 hours later, I had a whole working system,
running my containerized services just like before.
This is an absolutely bonkers fast redeployment,
and I owe a lot of that to some clever design decisions
made by the Alpine developers.

Setup
-----

I've got Alpine booting on my Raspberry Pi in "diskless" mode.
That means it loads the entire operating system into RAM.
It then mounts my 12TB btrfs array,
which has all the containerized services,
and launches podman to start them all up.

If I need to make system-wide changes,
I can just edit files in `/etc` and run
`lbu commit`, which will pick up changes and write them out 
as a tarball
to my normally read-only SD card.
This is a Big Deal when you're booting from an SD card,
because those things can't handle lots of writes.
I've also got a service running that copies the tarballs
onto the 12TB btrfs system,
so I should be able to get back online in under an hour if I lose this card.

I moved from Docker to Podman because the latter uses about half the space on the root filesystem.
That's important to me,
because the root filesystem is in RAM.


RAM Disk
--------

Running a production machine entirely from RAM may seem foolish,
especially on a Raspberry Pi.
But it's actually pretty svelte:

    Filesystem                Size      Used Available Use% Mounted on
    tmpfs                     3.8G    108.8M      3.7G   3% /

That's right, the entire host OS,
including all the junk needed for networking and podman,
takes up 108MB of the 8GB on this system.
That's just 1.35%!

I haven't checked,
but I have a sneaking suspicion that base Ubuntu uses more RAM than that,
with all the services it kicks up.


Podman
------

At my previous job,
I played around with podman a little.
It is more or less a replacement for Docker,
although it doesn't have swarm mode.

I gave it a shot in this conversion,
after being irritated that Docker itself frequently used over 10% of the CPU,
and quite a lot of RAM.

It turned out that podman not only doesn't appear to show up in the CPU usage,
but it also takes about half the space on the RAM disk as Docker did.
Running podman as root just worked out of the box:
I had to create two files in `/etc` to map my uid and gid
to get it working for my user account,
but now that's working nicely too.

I'm not using podman pods, though.
I looked into this once,
and it seemed to require learning a new schema for all kinds of things,
and maintaining hundreds of lines of YAML.
I know runit and bourne shell pretty well,
and I know how to launch individual podman containers with a shared bridge network,
so I'm just doing that.



A Beefier System
----------------

All of my services are running in containers.
At some point I realized:
why not put my login shell in a container, too?
So I did.

My work building that is in my
[toolbox repository](https://git.woozle.org/neale/toolbox),
but the summary is that I'm running a fat Alpine inside my lean host Alpine.
It still uses lbu and apk for preserving state,
but I can stretch out and install bash, vim, and even emacs.
I have a gigantic magnetic disk behind it,
I don't have to worry about storage space used by the OS in this setup.

Every time the container starts,
it reinstalls all the packages I have set up,
from the cached package repository I bind-mounted into the container from the btrfs array.
If I install new packages,
or update existing ones,
that updates the cache.

The tooling to do all this is minimal.
I encourage you to
[check out the repository](https://git.woozle.org/neale/toolbox)
if you're interested.
Most of the work is in the
[init script](https://git.woozle.org/neale/toolbox/src/branch/main/sbin/toolbox-init),
and most of the time getting *that* working correctly
was just me realizing that Alpine already had mechanisms for everything I wanted.


Runit
-----

When I managed my own (tiny) Linux distribution,
I became a fan of Dan Bernstein's "runit" init system.
Alpine was happy to let me set that up,
even providing a little `init.d` script to have their built-in openrc start runit.

Because runit uses files and filesystem pipes,
I can `sv restart /host/etc/services/foo` inside my "fat Alpine" container,
to restart the foo service *on the host OS*.
This lets me use my fat editor on service files,
and restart things without hopping onto the host OS.


Closing
-------

Moving from Ubuntu to Alpine gave me the following benefits:

* Boot time is down
* Memory use is down (I think)
* CPU use is down, and as a corrolary, so is energy use
* Absolute certainty that my system configuration is preserved in backup,
  because every time I boot, I restore the system (into RAM) from that backup
* I get to keep all my creature comforts like bash, btop, vim, emacs, and the like
* If my root filesystem ever crashes again, I can just make a new Alpine SD card,
  copy a backup tarball onto it, and I get my system back

Thanks to Nick Moffitt for blabbing about Alpine enough to get me interested,
and for providing some setup instructions (which I eventually completely undid)
to get me started quickly!
