---
title: Rock Band / Clone Hero instruments
date: 2023-13-27
draft: true
---

My project this winter break is to get our Wii copy of LEGO Rock Band some controllers again. We sold the original ones years ago because they were gigantic, so any replacements need to be small and easily stored.

## Step one: Working Arduino controller

Before any other work, I needed to make sure I could actually interface with the software.
There's one really popular project
right now, 
with published source code,
but it requires some binary desktop app to configure the firmware.
I had a hunch I could find something simpler,
and after a day of searching,
I discovered 
[Nicholas Angle's Work](https://www.niangames.com/articles/reverse-engineering-rockband-guitar-controllers)
doing exactly what I wanted.
Following the instructions on that page,
I was able to get my old Arduino Micro
recognized as a guitar,
and utterly fail a level as
I attempted to ground the right pins
with a bit of wire
to register button presses.

I used an old 4-port USB hub
I had lying around,
to make sure that would work too.
It did: it appears there's nothing
special about the one that came with
the controllers originally.

Yay!
I have a working controller!


## Step 2: Guitars

There are a number of options for
3D printed guitars.
I chose 
[Vlad the Inhaler's MiniCaster](https://www.printables.com/model/479046-minicaster-mini-clone-heromidi-controller),
which looks like a nice easy job
without needing to order a PCB.

I did need to order some switches,
new microcontrollers,
and some tilt switches.
I already had M3 screws,
which are used all the time in
3D printed builds.


## Drum controller

The first decision to make was
finger drumming vs hitting things
with sticks: we decided sticks
would be more fun.

The second decision was
MIDI vs destructive conversion.
Conversion looked cheaper and easier,
so we went that way.

I wound up buying a $26 children's 
roll up drum mat.
I'm assuming it uses piezos,
and once I rip out the controller
board, I can just wire up analog
inputs to the Arduino.

I'll update when I'm on the 
other side of this one!
