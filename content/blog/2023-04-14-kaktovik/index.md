---
date: 2023-04-14
title: Kaktovik numerals
scripts:
    - kaktovik.mjs
draft: true
---

I just saw a Scientific American article about the recent inclusion in Unicode of the
[Kaktovik Numerals](https://en.wikipedia.org/wiki/Kaktovik_numerals),
a base-20 counting system invented in 1990 by schoolchildren in northern Alaska.

Let's do some counting!

<div class="flex wrap counter" data-min="0" data-max="19">
    <div>
        <h3 class="justify-center">Apple-inator</h3>
        <button class="add" data-amount="-1">- 🍏</button>
        <button class="add" data-amount="+1">+ 🍏</button>
    </div>
    <div>
        <h3 class="justify-center">Apples</h3>
        <div class="apples"></div>
    </div>
</div>

Seems pretty easy, right?
I had it group apples in rows, so it's easier to visually see how many apples you have.

Let's use 🍊 instead of 🍏🍏🍏🍏🍏,
to make it even easier to see how many rows we have.

<div class="flex wrap counter" data-min="0" data-max="19">
    <div>
        <h3 class="justify-center">Apple-inator</h3>
        <button class="add" data-amount="-1">- 🍏</button>
        <button class="add" data-amount="+1">+ 🍏</button>
    </div>
    <div>
        <h3 class="justify-center">Fruit</h3>
        <div class="fruit"></div>
    </div>
    <div>
        <h3 class="justify-center">Apples</h3>
        <div class="apples"></div>
    </div>
</div>

---

<div class="flex wrap counter" data-min="0" data-max="19">
    <div>
        <h3 class="justify-center">Apple-inator</h3>
        <button class="add" data-amount="-1">- 🍏</button>
        <button class="add" data-amount="+1">+ 🍏</button>
    </div>
    <div>
        <h3 class="justify-center">Kaktovik</h3>
        <div class="kaktovik justify-left"></div>
    </div>
    <div>
        <h3 class="justify-center">Fruit</h3>
        <div class="fruit"></div>
    </div>
    <div>
        <h3 class="justify-center">Apples</h3>
        <div class="apples"></div>
    </div>
    <div>
        <h3 class="justify-center">Arabic</h3>
        <div class="arabic justify-right"></div>
    </div>
</div>

Can you see how 
the number of left-and-right lines is the number of complete rows of apples,
and the number of up-and-down lines is the number of apples left?