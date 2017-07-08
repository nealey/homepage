Title: dwm hacks

I seem to have trouble keeping my attention on the task at hand if there
are little things flashing in the corner of the screen, or even changing
color (like, "you have new email").  The less I have on the screen, the
more productive I seem to be.  It is for this reason that I've been
using "tiling" window managers since about 2003.

I've been using [dwm](http://dwm.suckless.org/) since a friend
introduced me to it around 2008.  What I like most about dwm, aside from
helping me stay focused on the task at hand, is that it gets out of my
way.  There are no buttons to click, and no windows to drag around or
resize.  In fact, I hardly ever use the mouse anymore, outside of my web
browser.

* [My config.h](config.h) contains a few features I've added, like
  restarting dwm, multimedia buttons, and
  [xss](http://woozle.org/~neale/src/xss.html) integration (3 lines of
  code).
* [My status program](http://woozle.org/~neale/g.cgi/status)
  is responsible for having DWM show the
  current time, load average, battery charge, and wifi status.  It
  gracefully handles machines that lack one or more of these features.
* [My button script](dwm-button.sh) is invoked when a multimedia button
  is pressed, and handles screen brightness, volume, external monitors,
  and more.
