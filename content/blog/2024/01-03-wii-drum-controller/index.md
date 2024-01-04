---
title: Wii drum controller
date: 2024-01-03
tags:
  - rockband
---

The Rock Band controllers (guitars and drum kit)
are working very well on LEGO Rock Band and Clone Hero.
But I'm a completionist,
so I'm not resting yet:
the cymbals don't work on Rock Band 3!

Here's what I've found out so far about the Wii Rock Band drum kit.
This is
based on 
the Clone Hero wiki,
[a forums post](https://discourse.zynthian.org/t/rockband-drums-joystick-as-a-drum-controller/2475/3),
and the
[rbdrum2midi](https://github.com/rbdrum2midi/rbdrum2midi/blob/master/src/rbkit.c)
software.
That last one was an exciting find:
someone coded up how to read the controller.
I may be able to use this program to test my controller code,
instead of having to keep restarting games on the Wii!


Rock Band 1 Drums
-----------------

VID: 0x1bad  
PID: 0x0005

This works very similarly to the guitar code.
The pads work the same as the non-solo buttons,
kick drum is the orange pad.
d-pad is sent as axis 2.
That's it!

I have these working as I write this,
2024-01-03.


Rock Band 2/3 Drums
-------------------

VID: 0x1bad  
PID: 0x3110?

These are velocity-sensitive,
but Amazon reviews claim they work with Rock Band 1.
So either RB1 will recognize PID 0x3110 as a drum controller,
the drums show up with two PIDs somehow,
or I have bad information.

rbdrum2midi makes it look like 
both PIDs use the same interface.
I think it may be likely that 0x0005 sends velocity information!

It does specify bit 3 of byte 1 in the HID report
is the cymbal flag,
which lines up with what Clone Hero says (button 10),
and is what I'm sending.
The two kick drum bits rbdrum2midi reads
also align with what I'm sending.
But rbdrum2midi isn't going to read any of my pad hits,
because it's looking for velocity values.

Maybe RB3 needs velocity >0 for cymbal hits.

I'll try sending 0x7f
in the reserved bytes for pads.
These bytes seem to be ordered differently than the bits.
rbdrum2midi lists the order as:

* byte 11: yellow
* byte 12: red
* byte 13: green
* byte 14: blue
