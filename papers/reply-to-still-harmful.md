---
title: '"Reply-To" Munging Still Considered Harmful.  Really.'
---

An Earnest Plea to People Still Having This Debate
--------------------------------------------------

A long time ago, Chip Rosenthal wrote a fine document entitled
['Reply-To' Munging Considered
Harmful](http://www.unicom.com/pw/reply-to-harmful.html).  It details the
problems caused by `Reply-To` munging.  Chip's essay basically points
out that:

* Munging only helps people with broken mail clients.
* Munging can catch people by surprise, since in every other email
  they've gotten with multiple recipients, when they hit "reply" it goes
  only to the sender.
* Munging totally breaks things for people who want replies to go to a
  different address than the one they sent the mail from.


In 2000 (or maybe earlier), Simon Hill wrote a response called [Reply-To
Munging Considered
Useful](http://www.metasystema.net/essays/reply-to.mhtml), which is
frequently offered as a rebuttal to Chip's document in online debates.
Simon's response boils down to the following:

* Munging encourages list discussion.
* RFC 822 seems to indicate it's okay.
* Munging makes things easier on broken mail clients.


People still using these two documents to debate the issue are wasting
everybody's time.  The issue was definitively settled in 2001, and Chip
won.


The IETF settles things
-----------------------

The IETF (Internet Engineering Task Force) writes the standards
documents for the Internet.  Such a document, called an RFC (Request For
Comments), attempts to unambiguously lay out in English the way things
are supposed to take place.  They are deliberated intensely, sometimes
for years, and every paragraph is scrutinized by scores of experts.
Still, problems do crop up with RFCs over time, be they from
ambiguities, new technologies, or flat out mistakes.  If problems are
big enough or numerous enough, the IETF will issue a new RFC to correct
the deficiencies of an older one.  This new document is said to
_obsolete_ the old one.

Both Chip's and Simon's documents refer to RFC 822, "Standard For The
Format Of ARPA Internet Text Messages", issued way back in 1982, before
most of us even knew what a computer network was.  Indeed, RFC 822
doesn't say anything about whether or not mailing lists can or should
set the `Reply-To` header field.  Chip interpreted it one way, and Simon
another.

In April of 2001, the IETF issued af new document, [RFC
2822](http://www.ietf.org/rfc/rfc2822.txt), which obsoletes RFC 822.  In
this new RFC, the author addresses the `Reply-To` header field in a few
places, but the most relevant to this discussion is the following in
section 3.6.2 "Originator fields":

> When the "Reply-To:" field is present, it indicates the mailbox(es) to
> which the author of the message suggests that replies be sent.

Your list software is not "the author of the message", so it must not
set or in any way meddle with the `Reply-To` header field.  That field
exists for the author and the author alone.  If your list munges it, you
are violating the standard.

These standards are not written flippantly, they are carefully crafted
in such a way as to ensure everything on the Internet works as smoothly
as possible.  Do the Internet a service and leave `Reply-To` alone.


How to specify where to post list messages
------------------------------------------

[RFC 2369](http://www.ietf.org/rfc/rfc2369.txt) specifies, in section
3.4, the `List-Post` header field:

> The List-Post field describes the method for posting to the list.
> This is typically the address of the list, but MAY be a moderator, or
> potentially some other form of submission. For the special case of a
> list that does not allow posting (e.g., an announcements list), the
> List-Post field may contain the special value "NO".

Modern mail list software sets this header field, or provides some
mechanism for the administrator to set it.

Mail clients are beginning to act on it too.  The KMail program Simon
references uses the presence of this header field to make the "reply"
action send to the list and the list only, and provides a "reply to
author" action that will always send to the message's author whether
it's a list or not.  "Reply to author" honors the `Reply-To` field.
This is exactly the convenient behavior Simon claims to want in his
"considered useful" essay, and it can all be done using standard behavior.


Getting two copies of the same email
------------------------------------

Some people complain that they'll get two copies of the same email.
Since they're on the list, their first copy is the one sent to them by
the list.  When the responder hit "reply all", it also put their email
address in the recipient list, so they get a second copy directly.

Fortunately, there's already a technical solution to this.  Since all
mail clients put a unique `Message-ID` header field on their email, a
mail reader has only to compare the `Message-ID` of a message to
previously-recieved messages.  If it's the same, then the second message
is a duplicate and can be safely ignored.

If your mail reader doesn't do this, that's too bad, but it's not an
excuse to violate Internet standards and surprise people with
inconsistent behavior, just to prevent you from having to delete a few
emails.  Anyone who gets any spam at all knows how to delete email.


It's What People Want
---------------------

I can't tell you how many `Reply-To` munging lists I've been on where
someone (or multiple people) send private messages to the list by
accident.  "But I hit reply, not reply to all!"  I've even been bitten
by this, right after a message to the list chiding people for sending
private messages to the list!

People want their mail client to be consistent.  When they hit "reply"
they want it to go to the person who wrote the message.  When they hit
"reply to all", they want it to also go to everyone who received it.
Most people understand this by now, since it's how their mail reader has
worked for every email they've ever gotten.  Your list shouldn't be any
different.

Sure, mistakes are going to happen, maybe on your list, maybe with an
email with multiple recipients.  It's not your job as a list owner to
make sure people can't make mistakes with their software.  If the job
belongs to anybody other the user, it'd be the author of the mail
client.  Your job is to make sure your mail list follows Internet
standards, and as a result works consistently for the user.


Summary
-------

Some people want to munge `Reply-To` header fields. They believe it
makes reply-to-list easier, and it encourages more list traffic.  It
really does neither, and not only is it a poor idea but it's forbidden
by Internet standards.

The IETF has spoken, and if you violate their standard and munge your
`Reply-To` header fields you're just creating problems for everybody.

-----

References
----------

* ['Reply-To' Munging Considered
  Harmful](http://www.unicom.com/pw/reply-to-harmful.html)
* [Reply-To Munging Considered
  Useful](http://www.metasystema.net/essays/reply-to.mhtml)
* [RFC 822](http://www.ietf.org/rfc/rfc822.txt): _STANDARD FOR THE FORMAT
  OF ARPA INTERNET TEXT MESSAGES_
* [RFC 2822](http://www.ietf.org/rfc/rfc2822.txt): _Internet Message
  Format_
* [RFC 2369](http://www.ietf.org/rfc/rfc2369.txt): _The Use of URLs as
  Meta-Syntax for Core Mail List Commands and their Transport through
  Message Header Fields_
