---
title: Rock Band / Clone Hero instruments
date: 2023-13-27
draft: true
---

My project this winter break is to get our Wii copy of LEGO Rock Band some controllers again. We sold the original ones years ago because they were gigantic, so any replacements need to be small and easily stored.

## Step 1: Working Arduino controller

Before any other work, I needed to make sure I could actually interface with the software.
Currently, the "santroller" is very popular:
it requires some kind of binary desktop app to configure the firmware,
and although it's open source software, 
it's thousands of lines of code.

I had a hunch I could find something simpler,
and after a day of searching,
I discovered 
[Nicholas Angle's Work](https://www.niangames.com/articles/reverse-engineering-rockband-guitar-controllers)
doing exactly what I wanted.
Following the instructions on that page,
I was able to get my old Arduino Micro
recognized as a guitar.
By awkwardly grounding input pins with a wire,
I was able to slowly navigate the menus,
and I even managed to fail a song.

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

Total cost of parts for two controllers,
not counting 3D printed parts,
is about $40.


## Step 3: Drum controller

There are a lot of options that could work as a drum controller,
including "finger drums" like the Akai MPD218,
full drum kits like the Alesis Nitro Mesh,
drum pads like the Alesis SamplePad,
or options to build my own kit with piezos.

A few factors went into the decision:

1. We wanted something you hit with sticks.
  Hitting things with sticks requires big movements,
  which will result in funnier situations during the game.
2. We wanted something that was easy to hook up.
  The devices with MIDI output would require at least a translation device,
  the USB MIDI devices would need the translation device to plug into power.
  If possible, we want the "rock bands drums" to just plug in to the hub,
  and that's all.
3. Since nobody's built anything like this before,
  we wanted to start cheap.

I wound up buying a $26 children's 
roll up drum mat.
I'm assuming it uses piezos,
and once I rip out the controller
board, I can just wire up analog
inputs to the Arduino.

I'll update when I'm on the 
other side of this one!
