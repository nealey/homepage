---
title: "Podcast RSS Generator"
date: 2024-09-02
tags:
  - computers
  - featurephone
---

I wanted to play some audiobooks on my light phone,
so I made a bourne shell script to generate an RSS feed.
I was surprised that I couldn't find any prior work to do this.

Put all your .mp3 files in a directory,
then add [build.sh](build.sh)
and `config.sh` with your settings:

```sh
title="My Audiobook"
description="An audiobook I like"
url="https://example.com/ebooks/mine"
```

The script
will create `rss.xml` in the directory where you dropped it.

It uses `ffprobe` from ffmpeg to figure out each track's title.
All my tracks have ID3 tags,
so it may fail if yours don't.

It can deal with spaces in filenames,
but not double-quotes.
`&` and `<` might cause problems too.
Anyway, it's good enough for me.

---

Here's the script inline:

```sh
#! /bin/sh

set -e

cd $(dirname $0)
. config.sh

out="rss.xml"
exec 1>$out
echo "Writing to $out" 1>&2

cat <<EOF
<?xml version="1.0" encoding="utf-8"?>
<rss xmlns:atom="http://www.w3.org/2005/Atom" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" version="2.0">
  <channel>
    <title>$title</title>
    <link>$url</link>
    <language>en</language>
    <description>$description</description>
    <atom:link href="$url/$out" rel="self" type="application/rss+xml" />
EOF

if [ -f cover.jpg ]; then
  cat <<EOF
    <image>
      <url>$url/cover.jpg</url>
      <title>$title</title>
      <link>$url</link>
    </image>
EOF
fi

for fn in *.mp3; do
  echo "- $fn" 1>&2

  ffprobe -loglevel quiet -show_entries format -output_format json "$fn" > format.json
  title=$(cat format.json | jq -r '.format.tags.title')
  duration=$(cat format.json | jq -r '.format.duration | tonumber | ceil')
  #bps=$(cat format.json | jq -r '.format.bit_rate')
  #kbps=$(($bps / 1000))
  rm format.json
  guid=$(sha1sum "$fn" | awk '{print $1}')
  size=$(stat -c %s "$fn")
  mtime=$(date -R -d @$(stat -c %Y "$fn"))
  ufn=$(echo $fn | tr ' ' '+')

  cat <<EOF
    <item>
      <title>$title</title>
      <pubDate>$mtime</pubDate>
      <itunes:duration>$duration</itunes:duration>
      <enclosure url="$url/$ufn" type="audio/mpeg" length="$size" />
      <guid isPermaLink="false">$guid</guid>
    </item>
EOF
done

cat <<EOF
  </channel>
</rss>
EOF
```
