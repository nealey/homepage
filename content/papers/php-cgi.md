---
title: Running PHP as a CGI
description: Tricking PHP into behaving properly outside of Apache
section: computing
---

I'm the author of the
[eris HTTPd](https://github.com/nealey/eris),
a small web server intended for use on embedded Linux devices with low RAM and low storage.
I've used other web servers (boa, mathopd, thttpd, etc.) for years,
and this problem has been present for as long as I can remember.
A [recent gripe post about PHP](https://eev.ee/blog/2012/04/09/php-a-fractal-of-bad-design/)
inspired me to document it.

The Situation
-------------

Let's say I'm using something that isn't Apache,
and I need to run some PHP code.
PHP comes with a CGI variant,
so I'll use that:

    #! /usr/bin/php-cgi
    <?php phpinfo(); ?>

When run from the command-line, this does exactly what I expect.
Superb!
When I try it from a browser, though, I get:

    Unable to load the webpage because the server sent no data.

Well that's puzzling.
So I do my standard thing,
wrapping it with something to dump stderr to stdout.

    #! /bin/sh
    echo "Content-type: text/plain"
    echo
    exec foo.php.cgi 2>&1

Now I get this (reformatted for narrow displays):

    <b>Security Alert!</b> The PHP CGI cannot
    be accessed directly.

    <p>This PHP CGI binary was compiled with
    force-cgi-redirect enabled.  This means
    that a page will only be served up if the
    REDIRECT_STATUS CGI variable is set, e.g.
    via an Apache Action directive.</p>
    <p>For more information as to <i>why</i>
    this behaviour exists, see the
    <a href="http://php.net/security.cgi-bin">manual
    page for CGI security</a>.</p>
    <p>For more information about changing this
    behaviour or re-enabling this webserver,
    consult the installation file that came with
    this distribution, or visit 
    <a href="http://php.net/install.windows">the
    manual page</a>.</p>

It's writing out HTML, sort of: I mean, the first paragraph doesn't have `P` tags, but whatever.
So clearly they intend me to see it from a browser.
I mean, the interpreter binary is called `php-cgi`, after all.
And yet, they're not actually writing out a CGI header,
so the web server thinks it's a broken script and dies.
So maybe they meant me to view this from the command-line;
except the only way to get this error is to run it as CGI.

Anyway.

PHP is asking me to set the `REDIRECT_STATUS` variable,
and telling me that this is somehow a security concern.
It's interesting how Python, Perl, and Lua don't think the lack of this variable is a security problem.

A quick Google search tells me this is a non-standard CGI variable that Apache sets.
But I'm not using Apache, otherwise I'd just use mod_php.
Why are you making me set this, PHP?

What I thought would fix it
---------------------------

Okay, whatever.

    #! /bin/sh
    echo "Content-type: text/plain"
    echo
    REDIRECT_STATUS=1 export REDIRECT_STATUS
    exec foo.php.cgi 2>&1

Now I get this:

    Status: 404 Not Found
    X-Powered-By: PHP/5.3.3-7+squeeze15
    Content-type: text/html

    No input file specified.

However, it continues to run just fine from the command-line.

404 means "file not found".
Which is very strange, because clearly the file *was* found,
given that PHP has sent its "X-Powered-By" header.
If it couldn't find the file, it wouldn't have known enough to start php-cgi.
And, remember, this all works fine from the command line.
Not to mention Python, Perl, Lua, and even the lowly Awk and Bourne shell,
have no trouble finding their input file when run as a CGI with the shebang (`#! /path/to/binary`)
as the first line.

What actually fixed it
----------------------

After nearly a full day trying to chase this cryptic message down in web searches,
I landed on a PHP bug open since 2004:
[PHP CGI depends on non-standard SCRIPT_FILENAME](https://bugs.php.net/bug.php?id=28227).
Included in the comments on this ancient but still unresolved bug is a now-broken link to
a wrapper
which proports to fix the problem.

So the ultimate fix to make `php-cgi` actually run like a CGI is to wrap it
with a second CGI that convinces PHP that I really meant it:

    #! /bin/sh
    REDIRECT_STATUS=1 export REDIRECT_STATUS
    SCRIPT_FILENAME=$(pwd)/foo.php.cgi export SCRIPT_FILENAME
    exec $SCRIPT_FILENAME 2>&1

If I have multiple PHP CGIs,
I must wrap each one.
Or just give up and install Apache,
which is, I'm sure,
the path taken by most system administrators who haven't written their own web server.

Why does PHP do this?
---------------------

I have skimmed [the URL that they asked me to](https://php.net/manual/en/security.cgi-bin.attacks.php).
They list two points:

1. "Interpreters open and execute the file specified as the first argument on the command line." This is true, it's how shebangs work (a file `script.sh` beginning with `#!/bin/sh` is magically transformed to `["/bin/sh", "script.sh"]`). It's how Python and Perl launch. I don't get the exploit path here, unless there's some horrible way to misconfigure Apache to do the wrong thing with scripts.

2. If you put the php interpreter under your web server's document root (where files are served from), and then use it to load up php scripts using the `PATH_INFO` environment variable *which is specified by the end user*, then PHP will dutifully serve up every document on your machine.

   If you don't get it, (I didn't either), what they mean is that
   some sysadmins honestly want the following URL to work:

        http://yourhost/cgi-bin/php-cgi/var/www/yourhost-root/scripts/mything.php

  This is such a terrible way to do things that it took me half an hour to even understand what they were describing. It's analagous to putting your shell in `/var/www/cgi-bin` and then asking the browser (which, remember, the end user can make do whatever they please) to pass the path to your shell script in as part of the URL.


These are both just awful, terrible,
hideous ways to set up a web server.
But apparently people do it anyway,
and apparently the PHP developers felt like it was their job
to allow this setup and still try to prevent
some of the security nightmares it entails.
Their solution: introduce dependencies on two Apache-specific
environment variables,
and one of them (`REDIRECT_STATUS`)
isn't even checked further than "is this set to anything at all".

And that, dear reader, is why you must fake out PHP
in order to get it to behave like every other CGI ever written.

