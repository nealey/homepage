---
date: "2004-10-27T00:00:00Z"
title: Debian on Digimatrix
---

Introduction
------------

We have a Digimatrix hooked up to our high-definition television.  We
use it for a number of things:

* Watching DVDs
* Playing music from OGG and MP3 files
* Recording and playing back television shows
* Storing pictures and movies from our digital camera
* Hosting our pictures and movies, along with those of our friends, 
  on a web server
* Playing Super Nintendo video games
* Occasional desktop tasks

MythTV and Freevo vs. KDE
-------------------------

This sounds like a MythTV box, right?  I tried MythTV, and Freevo, and
while I was impressed with how pretty they were, I just couldn't get
them working quite right.

[MythTV](http://www.mythtv.org/) gave a blank screen trying to watch or
record TV, with no useful error messages, and try as I might I just
couldn't figure out what the problem was.  After spending three days on
it I gave up.

[Freevo](http://freevo.sourceforge.net/) had its own problems; I don't
remember exactly what they were now.  I do remember feeling like Freevo
was held together with bailing wire and chewing gum, while MythTV had a
much more polished and easy-to-use feel to it.

Neither of them worked well out of the box with the Digimatrix remote
control.

In the end, I decided it'd be easier for everybody if we just used KDE.
It lets me bind actions to the key sequences the remote control sends
out, and for most TV-type activities the remote does enough to move
around in [Xine](http://xinehq.de/) and
[Konqueror](http://www.konqueror.org/).  The
[x2x](http://x2x.dottedmag.net/) program allows us to use our laptops to
control things over the wireless network, when the remote doesn't
suffice.  The Unix `at` utility and a little shell script lets us
schedule TV recordings with more ease than a VCR.

Best of all, there's no meta-information filed away in some obscure
database layout.  Everything is a file somewhere and can be manipulated
with Konqueror or the shell.

This turns out to be a very workable setup.


### Installing the base system

I had to install the testing (etch) installation CD for it to have a
driver for the SiS 900 10/100 network card.  Installation went smoothly
enough.  Everything is detected at boot time except:

* LED Panel and front panel buttons (including volume)
* Infrared receiver
* 802.11b card ([Ralink rt2400 chipset](http://rt2x00.serialmonkey.com/)).
  While I've gotten the rt2400 drivers to work, the card won't seem to 
  associate with my WAP until some other device does it first.  This is
  so inconvenient that I've run a long CAT-5 cable under the house so I
  can use the 10/100 ethernet port.


I installed the following additional packages to help me administer the
machine:

<pre>
# apt-get install less zile screen ssh strace sudo ntp ntpdate
</pre>


Web server
--------------

Waldorf needed to run a web server to host photo albums.

<pre>
# apt-get install mathopd stunnel4 php4-cgi rssh
# apt-get install netpbm jhead exiftran libjpeg-mmx-progs libjpeg-progs
</pre>

I won't detail my web server configuration here, since that's unique to me.

X
----

<pre>
# apt-get install x-window-system
</pre>

To my surprise this brought in x.org.  I run an HDTV over DVI, so to get
full screen, I had to change the configuration as follows:

<pre>
Section "Device"
        Identifier      "Generic Video Card"
        Driver          "sis"
        Option          "ForceCRT1Type" "DVI-D"
EndSection

Section "Monitor"
        Identifier      "Generic Monitor"
        Option          "DPMS"
        HorizSync       30-65
        VertRefresh     30-60
        ModeLine "720p" 74.160 1280 1352 1392 1648 697 725 730 750 
EndSection
</pre>

I also had to add "720p" to the `Modes` of the `Display` subsection of
`Screen`.

You may notice I only have 697 pixels vertically.  That's because my TV
puts about 23 lines in the "overscan", preventing me from seeing my KDE
toolbar.  I haven't yet found a way to recenter the screen, this just
chops off the bottom.  As a hack, I put empty KDE toolbars on the top,
left, and right borders.  This keeps windows inside the viewable area.


### KDE

I like KDE.  I've tried MythTV and Freevo and found it's just easier to
run KDE and occasionally use a mouse and keyboard.  The only thing we
don't get is a snazzy interface to recording TV shows, but we don't tend
to want to do that very often.  I may work on a web interface to XML-TV
listings later on.

<pre>
# apt-get install kde kdm
</pre>

I don't know if this is typical or not, but Debian's KDE went on without
asking me a single question.  Kudos to the packagers.


### Sound

<pre>
# apt-get install alsa-base alsa-utils
</pre>

We use the Digimatrix's S/PDIF output (isn't it lame that it comes out
the front?).  I know from a previous installation that if you just use
the defaults, you need to reboot between playing 2-channel audio and
using Xine's pass-through option to play a 7.1-channel DVD.  I'm sure it
has something to do with the sound card resetting something or other.
The solution seems to be having ALSA multiplex audio, and while I don't
get why this works, work it does.

I put the following into `/etc/asound.conf`:

<pre>
pcm.asus-hw {
    type hw
    card 0
}

pcm.!default {
    type plug
    slave.pcm "asus"
}

pcm.asus {
    type dmix
    ipc_key 1234
    slave {
        pcm "hw:0,0"
        period_time 0
        period_size 1024
        buffer_size 4096
        rate 48000
    }
}

ctl.asus-hw {
    type hw
    card 0
}
</pre>

### A decent desktop

At this point I was able to browse the web and play music using KDE's
"JuK":http://developer.kde.org/~wheeler/juk.html, so I took a break to
dance around the living room with my 1-year-old daughter as ABBA sang to
us.


### Playing DVDs

I like kaffeine, mostly because it's part of KDE and I'm a purist.  It
can play all sorts of movies and even has a nice startup screen that
allows you to type in numbers for various actions (play from playlist,
play DVD, etc.).

<pre>
# apt-get install kaffeine
</pre>



### DVD drive speed ###

Linux does not use DMA on IDE devices when it boots up, you have to turn
that on yourself.  I'm not sure what the reason is for this, probably
compatibility with some ancient thing that blows up if you attempt DMA.
In any case, turning on DMA will allows your DVD drive to keep up with
the data on the DVD.

<pre>
# apt-get install hdparm
</pre>

To turn on DMA, I put the following at the end of `/etc/hdparm.conf`.
While I was at it, I turned ot DMA for the hard drive too.

<pre>
/dev/dvd {
	dma = on
}

/dev/hda {
	dma = on
}
</pre>


### Try a DVD ###

At this point I was able to watch DVDs, so I did.  I watched the first
DVD of the first season of Buffy, which turned out to be a terrible idea
since it's pretty dark and not very high quality.  I played around with
the gamma settings in the KDE configuration tool, and set my gamma at
1.25.  Then I adjusted the brightness, contrast, and saturation of
Kaffeine, and got what I think is a pretty nice-looking configuration.



### The remote control

What good is a home theater system if you have to get up off your butt
to press buttons?  This is America, man!  I want to be able to eat
cheez-doodles and watch porn all night without having my feet hit the
floor, ever.

### The keyboard thingy ###

My Digimatrix came with this IR receiver thingy that goes in between the
keyboard and the keyboard port on the Digimatrix.  It synthesizes
keypresses in response to your remote.  Pretty slick!  This is good
enough for most things, and for a long time I just bound remote
keystrokes to do certain things in KDE applications, and to certain
actions in Xine.

### lirc ###

lirc is the Linux Infra-Red Control system.  It provides a standard
interface to various IR recievers and remote controls, and supplies
events to whatever wants to listen to it.  KDE has a module to listen to
it, so I figured I'd give it a go.

    # apt-get install kdelirc

Unfortunately, lirc 0.7 (the version in debian testing and unstable)
does not compile on Linux 2.6.12 and newer, so I had to install from
source code.


