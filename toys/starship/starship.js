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

function init() {
  var audioCtx = new window.AudioContext();
  var synth = whiteNoise(audioCtx);
  var filterA = bandpassFilter(audioCtx, 100, 20);
  var filterB = bandpassFilter(audioCtx, 50, 20);
  var gainA = audioCtx.createGain();

  whiteNoise(audioCtx).connect(filterA);
  filterA.connect(filterB);
  filterB.connect(gainA);
  gainA.connect(audioCtx.destination);
  audioCtx.suspend();
  
  function setFade() {
    var faderPos = document.querySelector("#fader").value;
    gainA.gain.value = faderPos;
  }
  document.querySelector("#fader").addEventListener("input", setFade);
  setFade();

  let play = document.querySelector("#play");
  play.addEventListener("click", e => {
    if (audioCtx.state == "running") {
      audioCtx.suspend();
      play.textContent = "▶️️";
    } else {
      audioCtx.resume();
      play.textContent = "⏸️";
    }
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
