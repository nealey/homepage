---
title: Big Builder
date: 2023-11-29
tags:
  - computers
---

I finally set up CI/CD with Forgejo/Gitea.
But I did it my way.

My way means:

* I can't run "gitea actions".
  These are actually node.js programs that get checked out on demand
  from somewhere (github probably).
  I don't like that model.
* I can't spawn docker containers in my swarm from CI/CD.
* I have to prebuild an environment with any build tools I want.

That's the way I like it.
If you think that sounds nice,
go check out
[Big Bulder](https://git.woozle.org/neale/big-builder)
