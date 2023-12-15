---
title: Windows Customizations
date: 2023-12-15
tags:
  - computers
  - windows
---

Since I started at PNNL in summer 2023,
I've been using Windows as my primary OS.
It's going okay.

The previous time I tried to use Windows was 1993,
and it's gotten a lot better since then.
I'd say it's about as stable as Linux now,
with about the same number of annoying quirks.

I figured it might be helpful for me to keep a running list of things I've changed,
so when I get a new OS install,
I can sort of quickly get back up to speed.


WSL2
----

Step 1 is to set up WSL2.
I prefer WSL2 to WSL1 because filesystem access is so much faster.
It basically runs the same way as Linux on ChromeOS:
as a virtual machine with a translation daemon.

I had to install 
[wsl-vpnkit](https://github.com/sakai135/wsl-vpnkit)
in order to work with the Cisco AnyConnect VPN client.

I think WSL2 uses something like Google's sommellier,
to translate Linux stuff like filesystems, X11, and Wayland,
into Windows.
It crashes a lot,
which can make Linux slow to a crawl,
or become unresponsive.
You have to kill the translation layer in an admin powershell
with

    taskkill /f /im wslservice.exe

Then you have to relaunch WSL2.


Terminal
--------

Windows comes with two terminals:
Windows Console,
and Terminal.
Terminal is better.
It's actually better than a lot of Linux terminals:
it even supports
[OSC 52](https://github.com/theimpostor/osc),
which few Linux terminals currently support
(OSC 52 is the reason I was using foot).

The default bell sounds for a long time, and is too noisy for me.
You can change the bell by editing `BellSound` in the terminal's
[settings.json](terminal/settings.json).

I also set the terminal to automatically close on exit.
Debian had set up a `.bash_logout` that ran something which failed,
meaning bash always exited with an error code,
and the terminal wouldn't close right away.
Removing `.bash_logout` fixed this.


Git / Bash
---

You're going to want to install git.
In addition to providing git,
it also installs bash and a few other ported tools.
This makes `ls` act normally.
I think it also installs ssh,
but I'm not positive.


Visual Studio Code
------

These days I'm using Visual Studio Code.
It effectively blurs the difference between Linux and Windows,
at least while you're editing.

You tell VS Code to use bash by default,
with "Select Default Profile" in the little + launcher thing at the console.


Vim
----

I also use vim,
though.
I had to edit the system path to include the path to the vim binaries.
I still don't understand how to tell powershell to run an executable by path,
but whatever.
Now I can just `vim file` and it works.


Go
---

The Windows build of Go has been compiling my code with no changes whatsoever.
Pretty cool.



