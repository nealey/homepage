---
title: The Year 2038 problem
date: 2023-03-09
published: false
---

In the year 2038,
old Unix code is going to run out of bits to store time.
This is going to be a really big problem,
and I'm hoping I can surf it into retirement.

The Y2K Bug
===========

Back in the 1990s there was this increasing panic about the
"Y2K problem".
These days it seems to be remembered as sort of a joke,
like "ha ha remember how freaked out they tried to make us?
And it wound up being a whole lot of nothing."
A bunch of people,
including me,
worked their assses off to make sure nothing bad happened.

The problem was that a lot of systems written in the 1960s to the 1980s
stored the year as a 2-digit number.
You got the full year by adding 1900 to that stored number.
This made total sense,
because most people were used to writing the year as,
like, "63" or "89".
I was taught in school to use "mm/dd/yy" format on anything needing a date.

So when it became increasingly clear that "add 1900" wasn't going to work
when the year became "00",
a whole lot of people had to go dig through a whole lot of old programs,
and patch them in various ways to deal with 2000 and beyond.

Here are a few of the main techniques I saw,
in order from "patching it up with chewing gum" to
"fix that will work forever":

* If the number is 60-99, add 1900. Otherwise add 2000.
  This works only if you're storing dates after 1960,
  and is going to stop working in 2060.
  I guess at this point everyone involved in the 1999 fix
  will probably be dead, so it'll be someone else's problem.
* Alter things to store years with more than two numbers.
  So the year 2000 is stored as 100 (1900 + 100 = 2000).
  It's weird when you look at the raw data,
  but it might mean you can keep using the rest of the program,
  which means you're able to get the fix in quickly.
* Store time as a `time_t`, which counts the number of seconds
  since January 1, 1970 in Coordinated Universal Time (UTC).
  I'll talk about the problem with this below.
* Store the year as a 4-digit number,
  which will keep working for another 8000 years,
  and also allows you to store dates going back to the beginning
  of most governments on Earth.

When January 1, 2000 rolled around,
there were still a couple of problems.
I remember one payroll company was dating checks wrong,
I think an insurance company had some sort of issue they patched pretty quickly,
but for the most part,
everything kept running along smoothly,
and all the people like me who had stayed up all night in the data center
waiting for some big emergency
breathed a big sigh of relief and went to bed.


The Year 2038 Problem
=====================

That third example of a fix uses the Unix `time_t`,
which is a 32-bit signed integer.

Bits?
-----

Bits are talked about a lot with computers,
but hardly ever explained.
Here's a really brief introduction
based on my years of experience teaching binary to high school students.

Let's start by talking about decimal, though.

| # of digits | how many muffins you can count | number of different values |
| ---- | ---- | ---- |
| 1 | 0 - 9 | 10 |
| 2 | 0 - 99 | 100 |
| 3 | 0 - 999 | 1000 |
| 4 | 0 - 9999 | 10000 |

Get it?
Now let's talk about binary:

| # of bits | how many muffins you can count | number of different values |
| ---- | ---- |
| 1 | 0 - 1 | 2 |
| 2 | 0 - 3 | 4 |
| 3 | 0 - 7 | 8 |
| 4 | 0 - 15 | 16 |
| 5 | 0 - 31 | 32 |
| 6 | 0 - 63 | 64 |
| 7 | 0 - 127 | 128 |
| 8 | 0 - 255 | 256 |

See the pattern?
Every time you add a bit,
you get twice as many values.
Let's extend that table:

| # of bits | how many muffins you can count | number of different values |
| ---- | ---- |
| 1 | 0 - 1 | 2 |
| 2 | 0 - 3 | 4 |
| 3 | 0 - 7 | 8 |
| 4 | 0 - 15 | 16 |
| 5 | 0 - 31 | 32 |
| 6 | 0 - 63 | 64 |
| 7 | 0 - 127 | 128 |
| 8 | 0 - 255 | 256 |
| ⋮ | ⋮ | ⋮ | ⋮ |
| 30 | 0 - 1073741823 | 1073741824 |
| 31 | 0 - 2147483647 | 2147483648 |
| 32 | 0 - 4294967297 | 4294967296 |


