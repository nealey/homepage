// jshint asi:true

var words

function addWords(wl) {
  words = wl.split("\n")
  let re = document.querySelector("#regexp")
  re.value = ""
  re.disabled = false
  re.focus()
  re.dispatchEvent(new Event("input"))
}

function regexInput(e) {
  let re = new RegExp(e.target.value, "u")
  let matches = document.querySelector("#matches")
  
  while (matches.firstChild) {
    matches.firstChild.remove()
  }
  
  let nmatches = 0
  for (let word of words) {
    if (word.match(re)) {
      let li = matches.appendChild(document.createElement("li"))
      li.textContent = word

      nmatches += 1
      if (nmatches > 50) {
        li.textContent = "…"
        break
      }
    }
  }
}

function anchorToggle(e) {
  let re = document.querySelector("#regexp")
  let val = re.value.replace(/^\^|\$$/g, "")
  if (val == re.value) {
    val = "^" + val + "$"
  }
  re.value = val
  re.focus()
  re.dispatchEvent(new Event("input"))
}

function init(e) {
  fetch("words.txt")
  .then(r => r.text())
  .then(addWords)
  
  document.querySelector("#regexp").addEventListener("input", regexInput)
  document.querySelector("#anchor").addEventListener("click", anchorToggle)
}

window.addEventListener("load", init)
