#! /bin/sh

cd /home/neale/lib/images/chumby

echo Content-type: image/jpeg
echo
fn=$(ls *.jpg | shuf | head -n1)
cat $fn
