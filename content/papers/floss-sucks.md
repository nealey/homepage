---
title: FLOSS Development Sucks
section: computing
---

This Article Is A Work In Progress
====================

I'm not even sure where I'm going with this.
Maybe I just needed to vent.
I think there might be advice in here somewhere,
but right now I'm tired of feeling pissed off,
so I'm just going to save this and move on with my day.

------------

This morning I thought I'd mention to a couple old colleagues
that I was still working on our codebase,
and I was considering splitting it off into something new
because it was looking like it might diverge pretty significantly.

I've been on this IRC channel for about a month.
There have been a sum total of 5 lines pasted,
all of them saying "hello" and "help" before anybody answered.
5+ years ago,
it was just me, the author of the package,
and another guy (the author of ratpoison),
mostly just shooting the breeze about bicycles.
The author had mentioned several times that the package was basically out of his hands,
once it got merged into emacs.

I've submitted a couple patches in the past,
and they've been accepted upstream.

So I tossed this out there expecting, if anything, a multi-day turnaround,
hopefully from the author:

> 08:32 neale> hello  
> 08:32 neale> I think I'm going to have to fork rcirc :(  
> 08:33 neale> I'm making too many changes and I don't have time to get them merged into emacs.

And then went back to work.

> 08:44 ams> what changes are you doing?

Whoa, somebody responded!

> 09:09 neale> I added a notion of "network" so you could have and distinguish multiple connections to the same server  
> 09:09 neale> umm...  

At this point I struggle to do a diff against the upstream source,
to see what else I've done.
I definitely wasn't expecting this right away,
I figured I'd maybe put things up on github or something.

> 09:11 ams> you can already do that afaik  
> 09:11 [neale raises an eyebrow]

Who is this person?
I read over the code pretty thoroughly before I added this in,
I think I would have noticed if anything resembling my changes had existed already.

Back do the diff, it looks like all my prior changes have actually been merged upstream,
after five years or so!
That's a pleasant surprise!

> 09:12 ams> but if you cannot .. that doesn't seem like a hard thing to merge  
> 09:12 neale> I'm going to have to figure out a way to hack in support for channel passwords  
> 09:12 neale> that's going to probably need to break syntax  
> 09:12 ams> break syntax? of what?  
> 09:13 ams> you are being incoherent.  
> 09:13 neale> next on the list is I need a way to have channels default to lowpri/ignore when created, so, probably going to tack that on to rcirc-server-alist

This happens sometimes on IRC.
While I was writing that long line, they posted two more.
I see I should now answer their other questions.
But now they're insulting me?
Who *is* this person?
Are they just wasting my time because they like arguing?

> 09:13 neale> of /join  
> 09:13 neale> right now /join takes a space-separated list of channels, I'll probably need to bring that in line with how other clients handle multiple channels with a single join (or more likely change it to space-separated)  
> 09:14 neale> sorry, change it to comma-separated

I'm getting flustered here.
I wasn't expecting to need to defend my changes.

> 09:14 ams> why?  
> 09:14 ams> setting default priority should be trivial, and no need to change rcirc-server-alist  

This didn't even register with me until I started writing this paper.
I told them I needed channels to start with a certain priority,
so I was going to add that to the list of channels to connect to at startup.
They referred me to the mechanism to set a global default.

> 09:14 neale> ams: see, this is what I was saying about not having time to merge upstream :)  
> 09:15 neale> but it's good to know that there's somebody alive in here :)

Yeah, I think this person isn't going to help.
It's pretty typical that you have to do a sales pitch,
over and over,
to get your changes accepted.
And I don't have time for that.
I've already wasted enough time just trying to convince this one person
that there was even a need for the work I've done so far.

> 09:15 ams> you just said you haven't even written it ..   
> 09:15 ams> there is nothing to merge.  
> 09:15 neale> LOL okay

Still feeling this person is just trying to waste my time and get me into an argument.
I probably should have just stopped here, but...

> 09:15 ams> and half of the things you mention can already be done  
> 09:15 neale> maybe you could write up how to do those things then, because it certainly wasn't obvious from the code :)

If this person had been paying attention,
a full 20% of last month's channel traffic had been requesting this exact feature.

> 09:17 ams> i don't see the use for multiple connections to the same host on the same port, most networks prohibit that.  
> 09:17 neale> hahaha, excellent  
> 09:17 ams> you can already connect to multiple hosts though with different port numbers  
> 09:17 neale> Stop Wanting That!

Now I'm mad!
They're not even interested in why I would want the feature I coded up.
They just want to tell me I'm wrong.
This is the point at which I completely gave up,
and was just saying words out of anger.

I don't do well when I'm like this,
but I know some people who are *excellent* in this situation,
like my friend Nick.
Sometimes I wish I were better,
because people like this,
I feel,
need to be put in their place,
and stop being hostile to everybody.

> 09:17 ams> simply specify a different port  
> 09:17 ams> ok, you are trolling.  i'll go back to doing something else.  
> 09:18 neale> I'm trolling, eh?  
> 09:19 neale> Man, look, I'm coming in with a need, you're telling me that a) it already does what I want, b) I don't actually have changes, and c) there's no need for me want what I said

I'm still trying to (angrily) convince them
that this is a horrible way to treat people they don't even know.

> 09:19 ams> no, i didn't say that at all. now you are just spouting lies.  
> 09:19 ams> 17:19 /ignore neale  
> 09:19 neale> Who's trolling? Anyway what happened to rcy and sabetts? They were friendly :(  
> 09:20 neale> Wow, infuriating.

But it's a lost cause.

----

This is pretty frequently how things go.
I wish I'd saved the 20-minute argument I had to endure
to convince some plan9 people
that some users might want a their three-button mouse to have a scroll wheel.
They eventually accepted that,
yes,
some users might actually want that,
and what was the mouse I'd found that does this?

This is not okay.
The community is selecting for people who are good at arguing.
We should not require every code contributor
to champion their code's worth
by besting the local troll in combat.
Even though I envy Nick's level-headedness during empassioned debate,
that skill has no correlation to the ability to make useful code contributions.

In the troll's defense,
this is just human nature.
Say there's this group of men discussing mortise and tenon joints,
and you have a better technique.
The way things work in FLOSS, currently,
is that you must step into this group an tell them they're doing it wrong.
It takes an extraordinary individual to *not* tell you to fuck off.
And you know that,
which is why your social instincts are screaming at you to be very uncomfortable.
So when the "fuck off" happens,
you've steeled yourself for it,
and then you get a slap fight.

There has got to be a better way.
