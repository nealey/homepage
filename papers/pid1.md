---
title: Futzing with PID 1
---

I've been working with somebody who,
I think,
is the lead person behind a Linux Distribution.
We've been discussing how to change PID 1,
and I've begun to realize I know a lot about this.

I'll be discussing Arch Linux because that's what I use,
but most distributions follow a very similar pattern.


What PID 1 Needs To Do
====================

In Arch Linux,
there's an early userspace PID 1 which does some preliminaries such as
mounting and pivoting /,
enabling the keyboard and graphics card,
and a few other things.

When the main PID 1 starts,
it needs to do the following at a minimum:

* Mount /tmp, /proc, /sys, /run, /dev
* Create some temporary directories
* Set the system clock
* Populate some of /dev
* Load modules
* Set the hostname
* fsck /
* never exit

You might be thinking to yourself that this could all be done in a shell script.
As a matter of fact,
that is exactly how I do it on my computer.
My `/sbin/init` is a Bourne shell script.
Yours could be, too.


Never Exit
--------------------

That last step is kind of interesting.
If PID 1 ever exits,
the kernel panics and basically halts.
So you want your PID 1 to stay running forever,
even after something has powered down or rebooted the computer.

Because of this requirement,
it's typical to have PID 1 manage
keeping important programs (daemons) running.
There are all sorts of approaches to this,
ranging from systemd at the heavy end,
doing all sorts of things like managing hardware and communicating over dbus;
to runit at the light end,
managing only the starting and stopping of supervisors,
which themselves manage the daemons.

Incidentally,
the threat of kernel panic and immediate halting
is why some people
(myself included)
feel PID1 should be very simple and easy to check for bugs.


How Runit Manages Daemons
==================

I use runit as my daemon manager.
Specifically, the runit from busybox, 
but Gerrit Pape's runit is almost identical as far as this article is concerned.

Runit starts off as a program called `runsvdir`,
which is what my `/sbin/init` hands off to with
`exec runsvdir /var/service`.
`runsvdir` has a fairly simple job:
start a new `runsv` process for each subdirectory of `/var/service`.
If a `runsv` process dies, restart it.

runsv
-------

`runsv`, in turn, runs the `run` script in the subdirectory.
When `run` exits, it runs `finish`, waits a few seconds,
and runs `run` again, until the end of time.

If there is a `log` directory,
its `run` and `finish` scripts are handled the same way,
except that stdout from the parent's `run` is piped to
stdin on the log's `run`.

This simple approach makes it pretty easy to keep services alive,
provided they can stay in the foreground.
For example, here's the `run` script I use for `sshd`:

	#! /bin/sh
	exec 2>&1
	exec /usr/bin/sshd -D -e
	
That redirects stderr to stdout, for the logger.
Then it runs sshd in the foreground (the "no daemon" mode),
and logs to stderr (now stdout).

There are a few wrinkles to what `runsv` does.
If the file `down` exists,
it doesn't try to start `run`.
And there's an `sv` program for communicating with `runsv`.

sv
----

The `sv` program communicates with an instance of `runsv`
through some magic pipes in the `supervise` directory.
`sv` has a few common commands,
and a few obscure ones.
I'll go over the common ones.

`sv status foo` asks runsv what the current status of the `foo` service is.
It will tell you what state it's trying to maintain,
what state it's actually in,
and how long it's been in that state.
It also reports back about the log service for that directory,
if there is one.

`sv up foo` tells runsv to strive to have the `foo` service up.
That means it will run the `run` script as detailed above.

`sv -v up foo` is just like `sv up`,
except the `-v` causes `sv` to wait until the service is confirmed up.
It will wait up to 7 seconds (you can set the time with `-w`)
for the service to be in the `running` state,
and will also run the `check` script in the service directory,
if there is one,
to perform any additional checks on the service actually working.
It returns 0 if the service is up and `check` passes,
and non-0 in any other case,
so this is the command you want to use in a `run` script
to make sure a dependency has started.

`sv down foo` tells runsv to strive to have the `foo` service down.
(`runsv` will try to kill it.)

`sv check foo` will check if the desired state is the actual state.
This means if you asked for `foo` to be up,
it will return 0 if and only if it's up.
But it also means that if you asked for `foo` to be down,
it will return 0 if and only if it's down.
There's a good chance you actually want `sv -v up foo` instead.
I never use `sv check`, personally,
but I'm listing it here because it seems to confuse people.

There are more `sv` commands,
but these are the ones I use most frequently.

Important Services
===============

The init steps above will get your machine booted,
but it might not be very useful.
For instance,
you might like to be able to log in.
You'll want to run a `getty` for that,
and maybe something like `xdm` or `gdm` to log in to X11.

Kernel Uevents
-------------------

The Linux kernel sends out something called a "uevent"
whenever the hardware configuration changes.
For instance, when a new USB device is plugged in.
The usual program to handle these is called `udev`,
which is now part of `systemd`.
Busybox comes with one called `mdev` that does a lot of what `udev` provides.

I'll detail that here at some point.
