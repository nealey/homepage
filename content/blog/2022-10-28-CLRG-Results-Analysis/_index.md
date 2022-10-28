---
title: CLRG Results Analysis
date: 2022-10-28T10:45:00-0600
---

# Our Findings

Here's a summary of what the team I've been working with has found:

## It's clearly widespread throughout the organization

It's more than 12 people.
It's more than 24 people.
It's probably more than 48 people.
Every data set we found had some pretty clear weirdness,
and that was before we looked at the judges we were finding weirdness with.
Once we tied names back in,
we were like, "oh, yeah, that's what we thought all along."

So unless there are some *major* changes made,
we're still going to have corruption in CLRG.
That's just the world you're in.
I hope any new families getting involved understand this.
In order to get into the upper tiers,
the way you compete becomes more about politics than dancing.
And by "politics" I mean Machiavellian politics.

# Why I'm Not Publishing Any More Tools

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

* [feisworx.mjs](Feisworx report scraping code)
* [feisresults.mjs](Feis Results report scraping code)
* [awardpoints.mjs](Code to guess placing given award points, used by feisresults.mjs)
* [types.mjs](JSDoc documentation of some global data structures)
* [dataset.mjs](Some stub code to populate an HTML page with data)
