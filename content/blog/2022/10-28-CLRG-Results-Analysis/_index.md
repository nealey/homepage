---
title: CLRG Results Analysis
date: 2022-10-28T10:45:00-0600
tags:
  - clrg
---

# Our Findings

Here's a summary of what the team I've been working with has found:

## It's clearly widespread throughout the organization

It's more than 12 people.
It's more than 24 people.
It's probably more than 48 people.
Every data set we found had some pretty clear weirdness,
and that was just looking at numbers.
Once we tied names back in to weirdness,
we were like, "oh, yeah, we had a feeling this person was up to something."

Unless there are some *major* changes made,
we're still going to have corruption in CLRG.
(Spoiler alert: there will not me major changes made.)
That's just the world you're in with CLRG,
and most other subjectively-judged competitive events.

I hope any new families getting involved understand this:
In order to get into the upper tiers,
the way you compete becomes more about politics than dancing.
And by "politics" I mean corruption.

That's not to say the dancers at the upper levels aren't excellent dancers: to
recall at a national event, you have to be an excellent dancer. But you might
also be an excellent dancer and not recall, because your parents/coach/teacher
aren't playing the corruption game as well as somebody else's
parents/coach/teacher.

## The top 11 places are bizarre

We knew this from [previous analysis](/blog/2022-10-09-CLRG-Scoring.html):
the top 11 places are scored totally differently than places 12-50.
And places 51-100 are placed separately.

Any large event is actually three separate competitions,
and it's very very difficult to break out if any judge places you in one of these categories:

| Placing | Comment |
| ---- | ---- |
| 1st - 11th | Strange exponential points category |
| 12th - 50th | Scoring here works the way you assumed it would |
| 51st - 100th | Everybody's fighting for a fraction of one point |

Please note that this is just my hot take!
You should play with the
[scoring tool](/blog/2022-10-09-CLRG-Scoring.html) I made
to get a feel for how this all works. It's weird!
And it's difficult enough to explain accurately by someone trying to.
I'm not trying to in this section.


# I won't publish any more tools

I started writing a thing to highlight weirdness in CLRG rankings.
You'd give it a ranking sheet,
and it would highlight what weirdness it found,
with an explanation about why it looks weird and what it might mean.

But I gave up after a day's work.
Here's why:

## I don't have the right to copy data

The results of competitions is owned by various companies. It seems to be a
different company depending on who gets the contract to provide the scoring
software for a particular event. In any case, none of them provide a license
that allows me to redistribute their data. That means I can't host any scores on
this web site: you have to get it from the company that owns it.

## The data is distributed as PDF files

Adobe Acrobat (or whatever they call it now) actually has an "export as XML"
function that does a good job turning PDF files back into something like a
spreadsheet.

In order for any tool I make to be generally useful, I would also need to
provide instructions on doing that Acrobat export, probably with an accompanying
video and multiple screen shots. I don't even run Windows or Mac OS, to say
nothing of being notoriously bad at this sort of instructional page / video.

## It's not clear anybody really cares

Reading the "voy forums", it's clear that the main thing people are getting out
of this is righteous indignation. I don't think a post full of math would really
appeal to the people there.

I'm in touch with a couple of reporters covering this story, but I don't think
the math angle is going to be very interesting to their readership either.

That means I'd need to go and try to figure out who *does* care. I found a small
group of people who care, and this group has already loaded some data into a
spreadsheet and done a manual analysis.

After finding mathematical evidence supporting what we already knew (this whole
process is corrupt), what then? I guess I just go on with my life.

I can already just go on with my life, I don't have to put in a bunch of work first.

# Parting thoughts

My kid is a high school senior.
She has a lot of things to look forward to in her immediate future that aren't Irish Dance,
and is winding down her involvement,
so our family is sort of meh about this whole thing.
If she were in elementary or middle school,
I would probably be howling right now and pressing hard to pull her out.

But maybe there's some value to still doing all this,
even though it's corrupt and she's never going to get a top ranking.
She still wants to compete for some reason,
and practicing has helped her develop a work ethic that will help her later.
In addition,
she's made friends through this;
she's learned how to care for others and talk to new people;
she's learned how to teach;
and she's gained a strong sense of self.
Those are all good things that didn't depend on fair judging.

The other day I was talking with a woman who runs an after-school program for
black kids who are interested in science and technology. I mentioned that the
winning papers at the statewide computer science contest never seem to integrate
the social justice aspects she's asking her kids to focus on. We kicked that
idea around a while, and wound up convincing each other that the work is worth
doing even if the judging is biased against it. I think the same thing might be
true here.

# Do you care?

Are you a regular reader of my blog? (HA HA HA) Do you care about mathematical
analysis of this stuff? Are you willing to jump through some technical hoops in
order to look at things without running afoul of copyright law? Get in touch
with me and let me know there's actually an audience!

All of the code I wrote is checked in to git for this blog page.
So you don't even need to contact me,
you can just take the scraping code and go nuts.
It uses a standard API for scraped data from two different sources,
does some smarts to determine missing data,
and should be pretty simple to interface with.
If you need help getting the XML data into it,
I'd be glad to help you with that.

Here are the files:

* [Feisworx report scraping code](feisworx.mjs)
* [Feis Results report scraping code](feisresults.mjs)
* [Code to guess placing given award points, used by feisresults.mjs](awardpoints.mjs)
* [JSDoc documentation of some global data structures](types.mjs)
* [Some stub code to populate an HTML page with data](dataset.mjs)
