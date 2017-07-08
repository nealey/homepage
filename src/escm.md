Title: escm: a scheme preprocessor

This is my port of [eguile](http://woozle.org/~neale/src/eguile) to
gauche scheme.  It uses regular expressions and as a result is faster
and easier to read.  It's so tiny, in fact, that I don't feel compelled
to write much about it.

eguile looks like PHP, but with Scheme instead of Perl.  If you're the
sort of person that would enjoy something like this, you probably don't
need any further description.

I use eguile along with a couple handy procedures and some makefiles to
generate my entire web space, and a few non-profit web sites I maintain.
I'd be happy to share the site-building stuff with anybody who asks, but
I'm not going to package it up until someone's interested.


Downloading it
--------------

You can download a [tarball of the latest version in git](http://woozle.org/~neale/g.cgi/escm/snapshot/escm-master.tar.gz), or check it out yourself:

    git clone http://woozle.org/~neale/repos/escm


Reference
---------

Easy squeezy:

<dl>
  <dt>&lt;?scm scheme-code ?&gt;</dt>
  <dd>Evaluates scheme-code, discarding value of the last expression</dd>

  <dt>&lt;?scm:d scheme-code ?&gt;</dt>
  <dd>Evaluates scheme-code, displaying the value of the last expression</dd>
</dl>

For example:

    <?scm (define (square x) (* x x)) ?>
    2 squared is <?scm:d (square 2) ?>

renders as:

    2 squared is 4


Related stuff
------------------------

* [escm 1.1](http://practical-scheme.net/vault/escm.html) by Shiro
  Kawai, author of gauche, was my inspiration.
* [eguile](http://woozle.org/~neale/src/eguile) is Guile-only
