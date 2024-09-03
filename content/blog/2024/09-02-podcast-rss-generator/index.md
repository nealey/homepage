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

The script: [build.sh](build.sh)
