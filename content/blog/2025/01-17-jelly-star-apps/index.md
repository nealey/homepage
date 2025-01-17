---
title: "Jelly Star apps"
date: 2025-01-17
tags:
  - jellystar
---

Someone emailed me asking for my take on specific apps on their Jelly Star phone,
which never gets OS updates.
It can be bewildering to understand what the attack avenues are,
and how those can manifest in specific apps,
so I'm happy to provide my hot take on things as a security professional.

Please bear in mind that these are my opinions,
and other security professionals may have other opinions!
In particular, my colleagues never truly reached a consensus about Signal.


## Spotify

The most likely attack vectors here would be through album/podcast
art, or through exploits in the audio playback libraries. I don't know
if Spotify re-encodes everything, but they're a big enough company
that I'd wager they do. I think your exposure here is minimal.

If by chance you use your Spotify login to access any other web sites
or apps, bear in mind that someone on your phone could also get to
those apps, too, by pulling your authentication token from the phone.


## Google

This "pull authentication token from phone" attack also means
any Google Drive files you have with the login you gave your phone
could be pulled, as well as your Gmail history.

Having a separate Google account exclusively for your vulnerable phone
would be wise.


## Pocket Casts

I removed this one from my phone when I realized the app pulls podcast
images straight out of the RSS feed. What that means is that a podcast
host that had been compromised could contain an image that triggers a
local exploit on your phone, and provide a path in.

I (reluctantly) began using YouTube music for podcasts. I think you
could use Spotify for the same purpose. The interface isn't my
favorite, but after a week or so I found I didn't care any more.


## Todoist

I don't know much about this app. The attack surface I would consider is:

* Does it have ads? If so, remove; that's an attack vector and the NSA
  is even asking people now to remove apps with ads.
* Does it pull images from the Internet? That's an attack vector.
* Does it use the same login as other apps (like Facebook, Google,
  etc?) If so, it gets complicated: let me know and we can dive into
  this. If not, you're good.
* Is there anything on the app or uploaded to the cloud that you
  wouldn't want to show to someone who meant you harm?


## Signal

I've had long discussions with my friends and colleagues about this
one. The majority opinion was that most people think of Signal as a
secure messaging platform. Installing it on a phone you think may be
compromised at any moment shatters the trust that your associates have
placed in you. 

It may be possible to tell every single person you communicate with
that your device has been taken over by spies, and have them remember
that at all times, but I decided to just use the Signal desktop app
and remove it from my phone.

This means I can't get to Signal on the go, which sort of
sucks. People have to send me SMS for that. But that was the situation
when I had a dumbphone, too, and it wasn't so bad.

Having gone through a dumbphone phase probably made this situation a
lot more tolerable to me. I got used to not using the phone for heavy
conversations: those happen on my laptop. But if you're moving from a
smartphone directly to a Jelly Star (or other vulnerable device),
this is going to be a pain point.

## Meet

I also use this to talk to my father and daughter. I feel like as long
as you remember Meet is not a secure connection (because someone with
access to your phone could be monitoring), you're okay. If you need to
exchange banking information, use Meet from your desktop PC, ideally
from a different Google account than you've logged into your phone.

In practice, most of my Meet calls happen from the laptop or desktop
anyway. This is going to vary per person, and everybody's going to
have to make their own informed decision. Ask yourself how you feel
about having malevolent strangers spy on your meet calls. Maybe you
don't want to be using Meet on your phone.

# Closing Thoughts

Once again, these are my hot takes based on the knowledge I have and
my career as a security professional. Other security professionals
might have different takes, and I'd like to hear from them!

I would welcome some sort of general dialog about how to safely use a
vulnerable Internet-connected consumer device. Right now, the advice
available seems to be "only use a phone that gets updates". To many
folks, that advice will read as "have more money to spend": it's not
helpful at all.

As always, I welcome emails about this or anything else on my web
site! And if a discussion does crop up, I'd appreciate somebody
pointing me at it: I avoid most social media these days.
