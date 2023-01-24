---
title: Starship Noise Generator
description: generate some background noise if your workspace is too quiet
scripts:
- starship.js
headers:
- <link rel="manifest" href="manifest.json">
---


<div>
  <button id="play" class="big">▶️</button>
  <span>
    🔉
    <input id="fader" type="range" min="0" max="10" step="0.01" />
    🔊
  </span>
</div>


I work in a building with no HVAC,
which means we can hear <em>everything</em> people are saying,
anywhere in the building.

This page is a low-CPU noise generator that runs entirely in JavaScript.
Once it starts,
you don’t need an Internet connection to keep it going.
You can leave it running forever, if you like.

For those interested,
it uses the new (in 2017), perfect for this application,
[Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
