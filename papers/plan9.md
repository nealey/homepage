---
title: Making Unix a little more Plan9-like
---

I'm not really interested in defending anything.
I tried out plan9port and liked it,
but I have to live in Unix land.
Here's how I set that up.

A Warning
--------

The suckless community,
and some of the plan9 communities,
are dominated by jackasses.
I hope that's strong enough wording to impress the severity.
Don't go into IRC for help.
Stay off the suckless email list.
The software is great,
the people who write it are well-spoken and well-reasoned,
but for some reason the fandom is horrible to everyone.

xterm
-----

9term has some really cool ideas.
But Unix has a long history of using graphical terminals,
and lots of stuff needs VT220 compatibility.
xterm is a good compromise.

You can make the xterm scroll bar (and all other Athena scrollbars) prettier
with this in your X resources:

	*Scrollbar.thickness: 10
	*Scrollbar.thumb: None
	*Scrollbar.foreground: gray80
	*Scrollbar.background: gray50
	*Scrollbar.borderWidth: 3
	*ScrollBarBorder: 0

This will swap the left and right mouse buttons,
to work like acme and 9term:

	*Scrollbar.translations: #override\
		<Btn1Down>: StartScroll(Backward) \n\
		<Btn3Down>: StartScroll(Forward) \n\
		<BtnUp>: NotifyScroll(Proportional) EndScroll()

A side note:
if xrdb is never run and your root window doesn't have a
`RESOURCE_MANAGER` property set,
libXaw will read `$HOME/.Xdefaults`.
This is supposedly deprecated,
but Xaw is so ancient it will probably never be removed.


9wm
----

I'm now maintaining the 9wm window manager.
If you like rio you should give it a whirl,
there are some differences you might prefer.
https://github.com/9wm/9wm


sshfs
-----

As a non-root user,
you can mount remote file systems locally with `sshfs`.
It's probably as close as Unix is going to get for a while,
and it's not awful.


lm
--

The plan9 `lm` command is great:
it's like `apropos` or `man -k` but it outputs lines you can
copy and paste into a prompt to pull up the page.
Here's a script to do the same thing with Unix:

	#! /bin/sh
	apropos -l "$@" | sed 's/\(.*\) (\(.*\)) * - /man \2 \1 # /'


xdg-open
--------

This is the current Linux notion of how to do things like the plumber.
Just about every modern program calls out to it to open files,
and it uses whichever one is first in your path,
so you can make a little script to do what you want and
avoid having to configure all the weirdo files in ~/.config

	#! /bin/sh
	case "$1" in
		*://*)
			exec web "$1"
			;;
		*.pdf)
			exec my-pdf-viewer "$1"
			;;
	esac


mon
---

Russ Cox uses a program called `mon`
to watch files and run them whenever they change.
This is pretty handy for iterative debugging,
you don't have to keep re-running your program every time you
save/compile.

Here's a start at one.
It can be improved.

	#! /bin/sh
	while true; do
		gonow=
		stat=$(stat --format=%Y.%Z.%s $1)
		if [ "$stat" != "${laststat:-$stat}" ]; then
			laststat=$stat
			gonow=yes
		fi

		if [ -n "$gonow" ]; then
			echo "[[=== start ===]]"
			$@
			echo "[[=== done ===]]"
		fi
		laststat=$stat
		sleep 1
	done


