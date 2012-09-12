#! /bin/sh

cd /home/neale/lib/images/chumby

echo Content-type: image/jpeg
echo

fn=$(ls *.jpg | shuf | head -n1)

# Guess at scale based on file size
s=$(du "$fn" | cut -d'	' -f1)
if [ $s -lt 100 ]; then
    scale=1/1
elif [ $s -lt 1000 ]; then
    scale=1/2
elif [ $s -lt 10000 ]; then
    scale=1/4
else
    scale=1/8
fi

djpeg -scale $scale "$fn" | pnmscale -xysize 320 240 | cjpeg

