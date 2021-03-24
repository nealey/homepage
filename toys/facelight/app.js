function colorTemperatureToRGB(kelvin) {
	// https://gist.github.com/paulkaplan/5184275
	
	let temp = kelvin / 100
  let red, green, blue

  if (temp <= 66) { 
    red = 255
    green = temp
    green = 99.4708025861 * Math.log(green) - 161.1195681661
    if (temp <= 19) {
      blue = 0
    } else {
      blue = temp-10
      blue = 138.5177312231 * Math.log(blue) - 305.0447927307
    }
  } else {
    red = temp - 60
    red = 329.698727446 * Math.pow(red, -0.1332047592)

		green = temp - 60
    green = 288.1221695283 * Math.pow(green, -0.0755148492)

    blue = 255
  }

  return {
    r : clamp(red,   0, 255),
    g : clamp(green, 0, 255),
    b : clamp(blue,  0, 255),
  }
}

function clamp(x, min, max) {
    if (x<min) {return min}
    if (x>max) {return max}
    return x
}

function changeTemp(e) {
  let tempIn = document.querySelector("#temp")
  let tempOut = document.querySelector("#tempOut")
  let temp
  if (!e) {
    temp = localStorage.temp || 5500
  } else if (e.target) {
    temp = Number(e.target.value)
  } else {
    temp = e
  }
	
	let color = colorTemperatureToRGB(temp)
	document.body.style.backgroundColor = "rgb(" + color.r + "," + color.g + "," + color.b + ")"
  tempOut.textContent = temp
  tempIn.value = temp
  localStorage.temp = temp
}

function init() {
	document.querySelector("#temp").addEventListener("input", changeTemp)
  changeTemp()
  if (navigator.serviceWorker) {
    navigator.serviceWorker.register("sw.js")
  }  
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init)
} else {
  init()
}
