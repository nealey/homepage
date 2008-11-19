#! /bin/sh

frm="$1"
ext="$2"
base="${HOME}/.gourmet"

num="`echo $ext | sed -n 's/^\([0-9]*\)-.*/\1/p'`"

if [ -z "$num" ]; then
    # No number; not a gourmet address
    exec cat
fi

if ! [ -d "$base" ]; then
    mkdir "$base"
fi

if [ -f "$base/$ext" ]; then
    num="`cat $base/$ext`"
fi

left=`expr "$num" - 1`
echo $left > "$base/$ext"

if [ "$num" -gt 0 ]; then
    exec awk "
{
  if (! p && /^Subject: /) {
    sub(\"^Subject: \", \"Subject: <$ext: $left left> \");
    p = 1;
  }
  print;
}"
fi

# Must have sent too many, return permanent failure code
echo "Address has self-destructed." 1>&2
exit 69
