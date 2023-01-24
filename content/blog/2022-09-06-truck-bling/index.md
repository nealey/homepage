---
title: Truck bling
date: "2022-09-06T12:11:00-0600"
---

Yesterday,
one of $CHILD's friends from dance drove up so I could help her bling out her truck.
We used WS2811 LED strings with adhesive backing.
I flashed a Seeeduino Xiao with CircuitPython,
set up an example program,
and let the two of them go nuts writing light animations.

Then we went out and stuck the stuff to the truck,
reinforcing it with zip ties for when the adhesive inevitably loses its grip.
The moms braided some wire into 3-connector cables,
the friend soldered a bunch of stuff together,
and we plugged it in.
It friggin' worked!

{{<video src="truck-bling.m4v" text="Pickup truck with color-changing ground effects">}}

The really cool part, at least for me,
is that now she can hang out with her laptop in the cabin,
reprogramming her ground effects to do whatever she wants.
Like, with a Chromebook, even.
Or a mobile phone.
CircuitPython is crazy inefficient,
but it made this stuff so easy.

Phase 2 is going to be getting a Bluetooth Adafruit chip,
setting it up to pair to their phones,
and then letting them control the color and pattern with a cell phone app.
Then we'll be able to relocate the chip under the hood by the 12V battery,
and route wires in a better way.
