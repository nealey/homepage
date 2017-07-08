Title: Working with plan9port

Since I enjoy trying new things,
I'm giving Plan 9 from Userspace a try in 2013.
Here are my notes.
I hope to turn this into a proper essay at some point.

My initial impression is that Plan 9 is what Unix would have been,
if Unix had been able to stick to its "small programs that do one thing well"
and "everything is a file" philosophy.
Instead, we got things like the Berkeley Socket API,
and the X windowing system,
which while unquestionably useful,
were sort of foreign design concepts placed on top of Unix.

Worst Support Community Ever
---------------------------

The Plan 9 user community
I keep coming into contact with is without exaggeration the
most hostile and combative group of people
I have ever encountered in my 20 years of computing.
I'm sure there are helpful and friendly people associated with Plan 9,
but they are not making easy-to-find web pages,
hanging out on IRC,
or commenting on public fora.
It's not worth delving further into this,
just be aware that if you want to try anything related to Plan 9,
plan to work out problems on your own.
Asking for help will get you nothing but insulted.


Installing
--------

Since I use Arch Linux,
installation was as simple as typing "pacman -S plan9port".
When I went to put it on my Ubuntu machine at work,
I had merely to untar a single file into /opt/plan9 and run "make".
Installation was easy.

plan9port comes with a "9" program that prepends /opt/plan9 to the path,
which you could copy into your normal path somewhere and not need to modify any additional paths.
I actually like having it in my path,
but I put it at the end,
since it provides a few binaries with the same name but different usage than standard Unix.


File Systems
------------

Plan 9 makes a big deal about file systems,
and Unix doesn't have that kind of functionality in it.
A lot of my work involves using ssh to get to various different computers,
and it's my understanding that a Plan 9 network hardly ever needs a "remote shell".
I've begun using sshfs a lot,
and I have to admit it's actually pretty nice.
Previously I'd been able to use "tramp-mode" in emacs to get to files on remote machines,
but sshfs lets me do this from the shell (and everything else) too.



The Mouse
----------

Everything here relies pretty heavily on the mouse for everything other than character input.
Coming as I am from dwm, emacs, and vim,
this was quite a shock.
Interestingly, I adjusted to it in under a day,
and now I find myself grumbling when I have to use vi,
using a Manhattan algorithm to move the cursor to a specific point that I'm looking right at.
I think the mouse may actually be relieving me of some of a fair amount of mental busy-work,
and I've noticed I'm using it more in places where I'd previously complained about having to.

Acme and 9term use "mouse chording".
You have to hold button 1 then click button 2 to cut text, for instance.
Hold 1 then click 3 to paste.
I went digging and found an old 3-button mouse (with no scroll wheel)
and started using it at work.
It was actually kind of nice having a real middle button,
even in normal Unix programs like xterm and chromium.

At home I acquired a "Microsoft Explorer Touch" mouse,
which is a brand new wireless mouse with a trackpad on the middle button
for scrolling up/down and left/right.
It's a bit heavier than I'm used to and makes my pinky finger tired,
but for the image editing software I use,
having a scroll wheel is handy.


Scroll Bars
--------

The scroll bars in Acme and 9term work very similarly to the Athena or Tk scroll bars,
which I've always liked.
In fact, I like Acme's scroll bar behavior so much,
I worked out how to make xterm's scroll bar work the same way
with a .Xresources entry:

	! Make Athena scrollbars more like Plan9 scrollbars
	*Scrollbar.translations: #override\
		<Btn1Down>: StartScroll(Backward) \n\
		<Btn3Down>: StartScroll(Forward) \n\
		<BtnUp>: NotifyScroll(Proportional) EndScroll()


Acme
----

Acme is really interesting in a number of ways.
It hardly does anything at all out of the box,
other than a rudimentary file navigator,
and allowing you to edit text files.
Editing text files is most of what I do in my job as a programmer,
so I was pretty skeptical that this was going to work out.
I ought to have a gigantic text editor with complex functionality,
right?

As it turns out,
because I'm also pretty quick at writing software,
I didn't really need that much complexity in my editor.
I just needed an easy way to run programs on parts of my text.
Acme lets you pipe text through anything you want.
You type "|program" somewhere (probably the blue bar for the buffer),
highlight the text you want to work on,
then middle-click "|program".

So if I want to word-wrap,
I can put "|fmt" in the blue bar and middle-click it when I need it.
If I want to reindent a section of C code,
I cat put "|indent".
I wrote a program called "→" that inserts tabs at the beginning of each line of input,
and another program called "←" that removes one leading tab.
This is actually really nice,
because I don't need to remember any Acme-specific editing commands,
I can just use the Unix commands I'd use at the shell.

Acme also exposes a file-system interface to manipulate windows.
So you can use it like Emacs,
making applications that use it for the interface,
but you can write your application in whatever language you prefer
and just interact with the display through manipulating files.
I haven't done much with this yet,
but I plan to.

Acme seems hopelessly lost when confronted with a filename or directory
with a space in it.


Rio
---

Rio is name of the Window Manager that comes with plan9port.
It seems to be an emulation of Plan 9's windowing system.
It feels almost unusable,
but I'm going to give it my standard 2 week trial.

After a few days with Rio and Acme,
I went and got a bigger monitor.
I'd been using a 15-inch monitor for years,
but now suddenly I want something larger.

I miss dwm's keybindings.
But I do actually sort of like needing to use the mouse for everything.
dwm was causing me to type into the wrong window, somehow.

I've had to install a new (graphical) music player.
It's not the end of the world.

I think it's funny how Plan 9 is what it took to make me comfortable with using
graphical programs.



Feb 20
-------

One of the things I missed about dwm was the little status bar.
I'd written a clever little
[status program](http://woozle.org/~neale/g.cgi/status)
to monitor various things (time, battery, load average)
and run a shell script periodically to do more expensive things like
checking my IMAP boxes.
Last night I rediscovered the
[dzen2](https://github.com/robm/dzen)
program,
which reads stdin and displays it in a little text window.
I added a `printf` to my status program and now I've got that functionality back.

Yesterday I also realized I could remove the graphical music thing I'd installed,
and go back to mpd.
I can put some commands in the very top bar in acme:
v-, v+, toggle, next, prev
right-clicking will send to the plumber,
which I now have configured to change volume and control mpd.

