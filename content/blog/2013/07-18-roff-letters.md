---
title: Writing formal letters with roff's "mm" package
date: 2013-07-18
section: computing
aliases:
  - /papers/roff-letters
---

I like using roff for quick things like letters and memos,
because it's already on every system,
works the same everywhere,
and lets me focus on content instead of presentation.
Because it uses plain text files for input,
I can use my favorite text editor to create roff documents.
LaTeX, for reasons unknown, encourages me to endlessly twiddle the formatting.


How to run roff
--------------------

If you have a file called "letter.mm",
this will create "letter.ps":

	groff -k -mm < letter.mm > letter.ps
	
The `-k` option tells groff that your input is UTF-8.

Your computer probably knows how to display PostScript if you double-click the file.
I use the `gv` program from the command line.


The Document
-------------------

	.IA "Theodore Geisel" "Director of Illustration"
	Hat Cat Heavy Industries
	800 NW Jiboo Rd
	Springfield, MO 17528
	.IE
	.WA "Neale Pickett" "Head Snark"
	12423 Worrin Ave
	Tres Brazos, NM 87923
	.WE
	.LO SA
	.LT
	.P
	I found your advertisement in "Obscure Sports Quarterly".
	I am writing to request a copy of your pamphlet,
	"50 Ways to Sink A Bat".
	.P
	Please, if possible,
	wrap the pamphlet in a leaf of lettuce or cabbage.
	If it is not too much to ask,
	could you also kiss the envelope before it is mailed?
	I have found that mail fairies prefer kissed envelopes
	and want to make sure your pamphlet arrives
	as quickly as possible.
	.FC
	.SG

You should copy and paste this into a file called `letter.mm`,
and run roff on it,
to see what the output looks like.


What This All Means
------------------------

In roff, any line beginning with a period is a command.

The file begins with `.IA`,
the command for "addressee".
It takes two arguments:
name (Theodore Geisel) and title (Director of Illustration).
This is followed by the address.
The end of the address is denoted by `.IE`.

Next up, the author's information.
This takes the same format as addressee,
using the `.WA` and `.WE` commands.

`.LO SA` tells roff that we'd like a salutation to open the letter.
The mm package uses "To whom it may concern:" by default,
but you can specify whatever you'd prefer as an argument:

	.LO SA "Dear folks,"

`.LT` means this is a letter.

`.P` tells roff to start a new paragraph.
And then we have the actual text of the first paragraph.
Hopefully this part is self-explanatory!

`.FC` prints a closing.
This will be "Yours very truly," unless you specify an argument:

	.FC "Sincerely,"

`.SG` leaves some space for a signature,
then prints your name and title.


More Information
---------------------

`man groff_mm` describes the entire macro package.
When I need more control over formatting,
I switch to Google Drive or LibreOffice.
