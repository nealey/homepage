---
title: The 3-minute HTML tutorial
---

As computer formats go, HTML is easy and logical.  It's all just text
that you can edit with any basic text editor, like gedit under Gnome, or
notepad in Windows.  Let's start out with an example.  Say you have a
sentence, and you want one word in it to be bold.  That sentence would
look like this:

    Guess which word is <b>bold</b>?

As you may have guessed, the bold word in that sentence is "bold", in
between `<b>` and `</b>` tags.  The sentence will show up like so:

> Guess which word is <b>bold</b>?

You now know HTML, the rest is just learning the names of the tags.

---

Here's a slightly larger example:

    <title>My first web page</title>
    <h1>Welcome</h1>
    <p>
      Welcome to my <b>first ever</b> web page!
      It features:
    </p>
    <ul>
      <li>A title!</li>
      <li>A header!</li>
      <li>A paragraph!</li>
      <li>An unordered list!</li>
    </ul>

What you end up with in the end is something like this:

> <div style="background: #ddd; border: solid black 3px;">
>   <div style="background: #00A; color: white; width: 100%;">
>     My first web page - WoozWeb Browser
>   </div>
>   <h1 style="text-align: left;">Welcome</h1>
>   <p>
>      Welcome to my <b>first ever</b> web page!
>      It features:
>   </p>
>   <ul>
>     <li>A title!</li>
>     <li>A header!</li>
>     <li>A paragraph!</li>
>     <li>An unordered list!</li>
>   </ul>
> </div>

The part inside the `<title>` and the `</title>` is the title of your
page: that's what goes in the window frame at the very top of your web
browser window, above the menus and everything else.

The stuff in between `<h1>` and `</h1>` is a "level-1 header".  That
means that it's the biggest header you can get.  There are also h2, h3,
h4, h5, and h6 headers, with h6 being the smallest.

The stuff inside `<p>` and `</p>` is a paragraph.  Since HTML treats
spaces the same as line breaks, you need to use paragraph tags around
each paragraph.  Inside the example paragraph is our old friend bold.

Then, there's `<ul>` and `</ul>`, an
"unordered list" (as opposed to an ordered list, which would have a
number by each item).  Inside the list are four "list items", enclosed
in `<li>` and `</li>`.

----

Now, for inline images:

    <p>
      This is an
      <img src="https://woozle.org/neale/face.png"
           alt="face"></img> image, and
      <a href="http://woozle.org/">this</a> is a link.
    </p>

Which will show up like this:

>  <p>This is an <img src="https://woozle.org/neale/face.png"
>  alt="face" /> image, and
>  <a href="http://woozle.org/">this</a> is a link.

The example above has an image tag, with two "attributes", "src" and
"alt".  The "src" attribute in an `<img>` tag gives the URL to a
picture, and the "alt" attribute is the text that's displayed to people
who can't see images (blind users, folks without graphics capabilities,
or if there's a problem on your web server).  The "alt" attribue is
required, but you can set it to `""` if there's nothing appropriate for
alternate text.

Lastly, the link, enclosed inside of `<a>` and `</a>`.  The "href"
attribute gives the URL that the browser will go to if you click the
link.

---

That's it for basic HTML, and it should be enough to get you started
writing your own pages.  So go write something!  The best way to learn
it is to try stuff out and see what it does.  For more neat HTML tags,
check out [HTML 3.2 by
Examples](http://www.cs.tut.fi/~jkorpela/HTML3.2/), which is what I used
to learn HTML.
