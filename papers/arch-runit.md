---
title: Runit on Arch Linux
---

Last update: 26 August 2014

[The easy method, for the impatient](https://aur.archlinux.org/packages/runit-init/)

------------------------

I like how runit manages things,
especially the restarting of dead daemons. 
I was growing tired of sysvinit when systemd started making inroads,
and when Arch moved to systemd,
I figured it was a good time to make the switch.

I know a lot of people feel very passionately about systemd;
I just like runit better.
If you want to rage about systemd,
there are many online venues available for you to do so.

What's the advantage?
---------------------

Runit allows€”no, forcesâ€”you to write your own startup scripts.
You can write them in any language you want,
but Bourne shell is pretty convenient.
I think this is the biggest selling point for me.
I like doing things with specialized programs,
and I know Bourne shell pretty well,
so it's easy for me to figure out what runit is doing,
and extend it.

If a daemon dies, runit restarts it in 2 seconds.
I find that convenient,
but some prefer for things with problems to be restarted manually.

Runit wants daemons to run in the foreground.
Having written many daemons,
I like this philosophy a lot.
I never understood why the "fork twice" hack needed to be duplicated in every daemon ever;
Runit takes care of that for you.

Runit encourages things to log to stdout (or stderr),
instead of syslog or custom logging code.
Writing to stderr is also very convenient from the standpoint of the daemon's author.
It's a natural way to provide information to the user,
and all that's needed for "debugging mode" is to launch the daemon at the command line
instead of from runit.
In fact, the "log" package in Go (language) works without any modifications
in this way.
stdout from a runit service is sent to stdin on a log service,
which runit also keeps track of.
That log service can be anything you want:
`svlogd` does a pretty good job timestamping lines,
and it also rotates logs automatically without needing to stop and start the daemon.

People aren't using sysvinit anymore (alas), but
[this essay](http://busybox.net/~vda/init_vs_runsv.html)
by Denys Vlasenko is still a pretty good overview of other ways runit is neat.

Have I convinced you?
---------------------

Try out my
[runit-init AUR](https://aur.archlinux.org/packages/runit-init/)
which does everything described here,
and also contains updates for things like mdev (instead of udev)
patches to X to start without udev,
and cryptographic filesystem mounting.

---------------------------------


The Gory Details
================

Everything below here was written in February 2013.
Things have changed since then;
in particular, I have [an AUR](https://aur.archlinux.org/packages/runit-init/)
which uses busybox runit to boot your system.

I'm leaving the rest for people who want discussion about how to boot their system.
This will all still work, it's just that the AUR works better :)


Peculiarities of my setup
-------------------------

I like the runit that comes with busybox,
so I'm using that.
If you prefer Gerrit Pape's runit,
the procedure will be similar,
but there are subtle differences you will need to watch out for.
In particural,
Gerrit's `runsvdir` does not have the `-s` option:
that functionality is provided by `runit-init`.

I put my runit service directory in `/service`.
Everything else seems to be making top-level directories these days,
and, hell, it's my computer.
You can put yours wherever you want,
just change `/service` in my examples to your directory.

Ctrl-alt-del does an immediate reboot.
Once I'm more comfortable with this setup,
I may change that by writing to the approprate file in `/proc`,
but I actually like this behavior for now.


Warning
-------

If you screw this up,
you might not be able to boot your computer up anymore.
If you're using Arch,
presumably you're already comfortable administering your computer.
But messing with `init` can break things in exciting new ways.

Arch's initrd has a nice `break=postmount` kernel commandline option
to open a shell after mounting root,
which I used to recover things several times.
You might want to play with that and understand what the initrd is,
before you are put into a position where you *have* to use it and can't start a web browser.


WARNING
-------

This document is now pretty old.
It's unlikely it will work at all on a modern Arch installation.
[My AUR](https://aur.archlinux.org/packages/runit-init/)
is usually only a few days behind the latest change in Arch's packages.
I've left this here because it might help people trying similar things
with different distributions.
But if you're using Arch, I strongly recommend you start with the AUR.


Let's go
--------

The version of `busybox` packaged for Arch comes with many "applets" compiled in:
enough for us to set it all up.
Because it's statically linked,
we don't even need to worry about libc updates.
To prevent a bad `busybox` update from bringing down the entire works, 
let's make a copy.

    cp /bin/busybox /usr/local/sbin/busybox.static
    ln -s busybox.static /usr/local/sbin/runsv
    ln -s busybox.static /usr/local/sbin/runsvdir
    ln -s busybox.static /usr/local/sbin/sv


We also need to create a new `/sbin/init` to replace `systemd` (or sysvinit) and launch `runsvdir`.
Arch actually has a pretty nice init setup,
almost as though they had this use case in mind when they were designing it.
The early userspace init sets up /, pivots root, and runs /sbin/init.
At that point, we can take over, run `/etc/rc.sysinit`,
and hand off to `runsvdir`.
Putting the system initialization stuff into a shell script
was a nice move on the part of the arch folks,
and makes this almost trivial.

The other thing `init` needs to handle is being called by programs like `reboot` and `poweroff`,
which want to signal `init` by changing runlevel.
So if our new `init` is not PID 1,
we'll emulate `telinit` from sysvinit,
by checking what runlevel is being requested and sending the appropriate
signal to PID 1.

Be sure to move the old `init` to soming like `init.sysv`, 
then create a new `init` similar to this
(don't forget to `chmod +x`):


	#! /bin/sh

	PATH=/usr/bin; export PATH

	if [ $$ -ne 1 ]; then
		case $1 in
			6)
				exec kill -15 1
				;;
			0)
				exec kill -12 1
				;;
		esac

		echo "LOL: runit doesn't have run levels" 1>&2
		exit 1
	fi

	echo
	echo 'Arch Linux'
	echo 'http://www.archlinux.org/'
	echo '-----------------------------'
	echo

	echo ":: Mounting initial filesystems"
	mountpoint -q /proc || mount -t proc proc /proc -o nosuid,noexec,nodev
	mountpoint -q /sys || mount -t sysfs sys /sys -o nosuid,noexec,nodev
	mountpoint -q /run || mount -t tmpfs run /run -o mode=0755,nosuid,nodev
	mountpoint -q /dev || mount -t devtmpfs dev /dev -o mode=0755,nosuid

	mkdir -p -m0755 /run/runit /run/lock /run/lock/lvm /run/lvm /run/user /dev/pts /dev/shm
	mountpoint -q /dev/pts || mount -n -t devpts devpts /dev/pts -o mode=0620,gid=5,nosuid,noexec
	mountpoint -q /dev/shm || mount -n -t tmpfs shm /dev/shm -o mode=1777,nosuid,nodev

	mount -o remount,ro /

	echo ":: Setting up Unicode"
	for i in /dev/tty[0-9]*;do
	  unicode_start <$i
	done &

	echo ":: Setting system clock"
	hwclock --utc --hctosys

	echo ":: Enabling devices"
	touch /dev/mdev.seq
	/usr/bin/mdev -s &

	echo ":: Loading drivers"
	for i in $(seq 2); do
		find /sys -name modalias -type f -exec cat {} + | sort -u | xargs modprobe -b -a
	done 2>/dev/null

	echo ":: Bringing up network"
	ip link set up dev lo
	cat /etc/hostname >/proc/sys/kernel/hostname

	echo ":: Setting up cryptographic devices"
	grep "^[^#]" /etc/crypttab | while read name device password options; do
			case $options in
					*swap*)
						cryptsetup --key-file /dev/urandom open --type plain $device $name
						mkswap /dev/mapper/$name
						;;
					*)
						cryptsetup luksOpen $device $name < /dev/console
						;;
			esac
	done

	echo ":: Checking filesystems"
	[ -f /forcefsck ] || grep -q forcefsck /proc/cmdline && FORCEFSCK=-f
	if ! [ -f /fastboot ] && ! grep -q fastboot /proc/cmdline; then
		fsck -A -T -C -a -t noopts=_netdev $FORCEFSCK
		if [ $? -gt 1 ]; then
			sulogin
		fi
	fi

	echo ":: Mounting filesystems"
	mount -o remount,rw /
	mount -a -t "nosysfs,nonfs,nonfs4,nosmbfs,nocifs" -O no_netdev

	echo ":: Enabling swap"
	swapon -a

	echo ":: Tidying up"
	install -m0664 -o root -g utmp /dev/null /run/utmp  &
	rm -f /etc/nologin /forcefsck /forcequotacheck /fastboot &

	if grep -q 'break=init' /proc/cmdline; then
		echo 'Breaking before init, type "exit" to continue booting'
		/bin/sh
	fi

	if [ -x /etc/rc.local ]; then
		echo ":: Sourcing /etc/rc.local"
		. /etc/rc.local
	fi

	echo ":: Passing control to runit"
	echo
	exec runsvdir -P -s runit-signal /service

This does a couple things:

1. Mounts /proc, /sys, /dev, and some other directories.
2. Turns on Unicode for 9 TTYs
3. Sets the system clock from the hardware clock
4. Runs an initial mdev to populate /dev
5. Loads modules for things in /sys
6. Bring up the loopback interface
7. Initialize your cryptfs, if you have any in /etc/crypttab
8. fsck then mount everything in /etc/fstab
9. Run whatever's in /etc/rc.local
10. Start runsvdir

You may also want to install the `dash` package,
and link `/bin/sh` to that, 
if you worry (as I do) about libc breaking things
(`dash` is statically linked).


runit-signal
------------

Busybox's version of `runsvdir` has a `-s` option.
When runsvdir gets a signal,
it runs whatever was provided to `-s` with the signal number as the first argument.
Here's my `/usr/local/sbin/runit-signal`
(make sure you `chmod +x`):


    #! /bin/sh

    ##
    ## Signal handler for runit
    ##

    if [ $PPID != 1 ]; then
        echo "This program should only be invoked by PID 1."
        # The reason is that killall5 won't kill anything in the same
        # process group.  That means it won't kill your invoking shell,
        # getty, or svrun.  That in turn prevents filesystems from
        # unmounting, or even being remounted ro, since svrun (at least) has
        # a FIFO open for writes.  And if we reboot without unmounting
        # filesystems, that's bad.
    
        echo "Feel free to read $0 to learn why :)"
        exit 1
    fi
    
    waitall () {
        for i in $(seq 50); do
            # If all processes are in group 0, we're done
            awk '($5){exit 1;}' /proc/[0-9]*/stat && return 0
            usleep 200000
        done
        return 1
    }
    
    cleanup () {
        echo "Stopping services..."
        sv stop /service/*
        echo "Asking processes to exit..."
        killall5 -1
        killall5 -15
        if waitall; then
            echo "Forcing processes to exit..."
            killall5 -9
            waitall
        fi
        echo "Unmounting file systems..."
        umount -a -r
            
        # Sometimes when we reach here we still haven't been able to umount
        # everything.  Not much more we can do about that, other than flush
        # write buffers and hope for the best.
        sync
    }
    
    case $1 in
        1)                          # SIGHUP
            ;;
        15)                         # SIGTERM: reboot
            cleanup
            echo "Rebooting..."
            busybox reboot -f
            ;;
        10)                         # SIGUSR1: halt
            cleanup
            echo "Halting..."
            busybox halt -f
            ;;
        12)                         # SIGUSR2: power
            cleanup
            echo "Shutting down..."
            busybox poweroff -f
            ;;
        *)                          # Everything else
            ;;
    esac
    


Create a getty
--------------

Before we reboot, we need to make sure to create a way to log in.
The following in `/service/tty2/run` will start a getty on the second virtual console
(don't forget to `chmod +x`):

    #! /bin/sh

    pwd=$(pwd)
    TTY=${pwd##*/}
    exec agetty $TTY

You can make more than one getty by copying this to `/service/tty3/run` and so on.


Reboot!
-------

Double check you did it all right:

* You understand how to use the initrd shell you get passing the `break=postmount` boot argument
* `/sbin/init` should be an executable shell script
* At least a getty service will start from the `service` directory you set up

That's not a big checklist. 
Ready to go?
Tell the currently-running init to reboot:

    /sbin/init.sysv 6

Cross your fingers!


If it doesn't work
------------------

You can always move `/sbin/init.sysv` back to `/sbin/init` and reboot
into your old setup.
Nothing in this page will destroy the old bootup process
(other than renaming `init`, of course).


If it does work
---------------

Congratulations, you're now using runit.
You now need to write startup scripts for things you like to run,
like `dhcpcd`, `ntpd`, maybe `xdm`.
You're an Arch Linux sysadmin,
you should know what you need,
and I can't help you past here.

Hotplug events won't work, though.
For that, you need to either run udev or some other hotplug listener.


Setting up `mdev` as a hotplug listener
---------------------------------------

The `mdev` utility of busybox can replace most of what `udev` does.
You just need to have the kernel run `mdev` as the hotplug userspace thingy.

Recent precompiled kernels have removed support for `/proc/sys/kernel/hotplug`,
so it's necessary to run a userspace program to get netlink events.
Send me an email asking for `hurtplurg.c` if you'd like the one I wrote.

You'll need to configure `mdev` to set up file permissions that work for you.

Since X11 wants `udevd` for something or other,
you'll also need to tell it to use whatever the old method is.
I don't quite understand what they do,
and they've surely changed since I wrote mine.
Have fun with man pages.


Getting rid of `systemd`
------------------------

At this point you are not running anything in `systemd`.
But you still need it installed,
because a lot of things depend on libraries it's taken over.

Don't panic about this.
It's going to be okay.
You have lots of things installed that you don't strictly need.
I chose Arch over Gentoo because I like precompiled packages,
even though that means they bring in a couple things I don't need.
`systemd` is one of those things.


Have fun!
