Title: Converting docx to text with unzip and sed

Periodically people email me Microsoft Word files which clearly contain
only text.  Fortunately, Word is now creating OOXML `.docx` files which
contain honest to goodness UTF-8 text (and lots of XML tags).  This is a
step up from the `.doc` format which as near as I could tell needed
special libraries to penetrate.

`.docx` files are zip archives.  The archived file `word/document.xml`
contains the text of the document itself and can be extracted with
`unzip file.docx word/document.xml`.

If you just want to see the text in a .docx file, you can strip out all
XML tags of `word/document.xml`, converting the P tag to a new
paragraph.  It's surprisingly legible for every .docx file I've seen so
far.  The sed command would be `s#</w:p>#\n\n#g;s#<[^>]*>##g`.

I made a shell script called `docx2txt` which contains the unzip command
to pipe to stdout, which is read by sed running that crazy script.  It
looks like this:

    #! /bin/sh

    unzip -qc "$1" word/document.xml | sed 's#</w:p>#\n\n#g;s#<[^>]*>##g'

There are other, probably more powerful, docx to text converters on the
Internet.  The advantage of mine is simplicity, when all you want to do
is read the text and move on with your life.
