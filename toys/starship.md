---
title: Starship Noise Generator
---

<div>
<input id="fader" type="range" min="0" max="10" step="0.01"> Gain
</div>

I work in a building with no HVAC,
which means we can hear *everything* people are saying,
anywhere in the building.

This page is a low-CPU noise generator that runs entirely in JavaScript.
Once it starts,
you don't need an Internet connection to keep it going.
You can leave it running forever, if you like.

For those interested,
it uses the new (in 2017) and seriously powerful
[Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API).

<script>
      function whiteNoise(audioCtx) {
        var bufferSize = 17 * audioCtx.sampleRate,
        noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate),
        output = noiseBuffer.getChannelData(0);
        for (var i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        var whiteNoise = audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        whiteNoise.start(0);
        return whiteNoise;
      }
      
      function bandpassFilter(audioCtx, freq, gain) {
        var filt = audioCtx.createBiquadFilter();
        filt.type = "bandpass";
        filt.frequency.value = freq;
        filt.gain.value = gain;
        return filt;
      }
      function boop() {
        var audioCtx = new window.AudioContext();
        var synth = whiteNoise(audioCtx);
        var filterA = bandpassFilter(audioCtx, 100, 20);
        var filterB = bandpassFilter(audioCtx, 50, 20);
        var gainA = audioCtx.createGain();
        whiteNoise(audioCtx).connect(filterA);
        filterA.connect(filterB);
        filterB.connect(gainA);
        gainA.connect(audioCtx.destination);
        
        function setFade() {
          var faderPos = document.querySelector("#fader").value;
          gainA.gain.value = faderPos;
        }
        setFade();
        document.querySelector("#fader").addEventListener("input", setFade);
      }
      
  
      window.addEventListener("load", boop);
</script>
