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
put this script in it,
and make a `config.sh`:

```sh
title="My Audiobook"
description="An audiobook I like"
url="https://example.com/ebooks/mine"
```

The script:
[build.sh](build.sh).
It will create `rss.xml` in that directory.

It uses `ffprobe` from ffmpeg to figure out each track's title.
All my tracks have ID3 tags,
so it may fail if yours don't.

It can deal with spaces in filenames,
but not double-quotes.
`&` and `<` might cause problems too.
Anyway, it's good enough for me.
