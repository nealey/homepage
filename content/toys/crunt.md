---
title: Crunt
---

<span id="crunt">
</span>
<b>CRUNT</b><a href="http://www.subgenius.com/bigfist/bulldada/X0033_RAELIAN.TXT.html">!</a>

<script>
function crunt() {
  if (Math.random() < 0.5) {
    return "CRUNT";
  } else {
    return "crunt";
  }
}

function init() {
  var p = document.getElementById("crunt");
  var out = [];
  var crunts = Math.floor(Math.random() * 300) + 200;
  var babies = crunts * 3 / 4;
  
  for (var i = 0; i < crunts; i += 1) {
    out.push(crunt());
  }
  for (var i = 0; i < babies; i += 1) {
    out.push("crunt");
  }
  p.textContent = out.join(" ");
}
window.addEventListener("load", init);
</script>
