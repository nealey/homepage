// © 2015 Neale Pickett <neale@woozle.org>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// The software is provided "as is", without warranty of any kind, express or
// implied, including but not limited to the warranties of merchantability,
// fitness for a particular purpose and noninfringement. In no event shall the
// authors or copyright holders be liable for any claim, damages or other
// liability, whether in an action of contract, tort or otherwise, arising from,
// out of or in connection with the software or the use or other dealings in
// the software.
//

var maxSaturation = 200;

function Yarn(r, g, b) {
	var rgb = [Math.round(r*maxSaturation), Math.round(g*maxSaturation), Math.round(b*maxSaturation)]
	return "rgb(" + rgb.join(",") + ")"
}

var colors = {
	"R":   Yarn(0.50, 0.00, 0.00), // Red
	"G":   Yarn(0.00, 0.40, 0.00), // Green
	"B":   Yarn(0.00, 0.00, 0.50), // Blue
	"C":   Yarn(0.00, 0.50, 0.50), // Cyan
	"Y":   Yarn(0.80, 0.80, 0.00), // Yellow
	"P":   Yarn(0.60, 0.00, 0.60), // Purple
	"W":   Yarn(0.90, 0.90, 0.90), // White
	"K":   Yarn(0.00, 0.00, 0.00), // Black
	"BK":  Yarn(0.00, 0.00, 0.00), // Black
	"GR":  Yarn(0.50, 0.50, 0.50), // Gray
	"DB":  Yarn(0.00, 0.00, 0.30), // Dark Blue
	"LB":  Yarn(0.00, 0.40, 0.90), // Light Blue
	"LR":  Yarn(0.80, 0.00, 0.00), // Light Red
	"LG":  Yarn(0.00, 0.60, 0.00), // Light Green
	"LV":  Yarn(0.50, 0.25, 0.60), // Lavender
	"BR":  Yarn(0.60, 0.40, 0.20), // Brown
	"LGR": Yarn(0.60, 0.60, 0.60), // Light Gray
	"LBR": Yarn(0.80, 0.70, 0.50), // Light Brown
	"": ""
}

function Loom(ctx, warp, threadwidth) {
	var width = ctx.canvas.width;
	var height = ctx.canvas.height;

	ctx.lineWidth = Number(threadwidth || 2);

	// Draw the weft
	for (var x = 0; x < width; ) {
		for (var i in warp) {
			ctx.strokeStyle = warp[i];
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, height);
			ctx.stroke();

			x += ctx.lineWidth;
			if (x > width) {
				break;
			}
		}
	}
	this.nrows = 0;

	this.weave = function(yarn, up, down, skip, repeat) {
		up = up || 1
		down = down || 1
		skip = skip || 0
		repeat = repeat || 0

		ctx.strokeStyle = yarn;

		var offset = (this.nrows / (repeat + 1)) * (skip + 1);
		var harness = up + down;
		var row = [];
		for (var i = 0; i*ctx.lineWidth < width; i += 1) {
			var ox = (i + offset) % harness
			if (ox < up) {
				ctx.beginPath();
				ctx.moveTo(i*ctx.lineWidth, this.nrows*ctx.lineWidth);
				ctx.lineTo((i+1)*ctx.lineWidth, this.nrows*ctx.lineWidth);
				ctx.stroke();
			}
		}

		this.nrows += 1;
	}

	this.plainWeave = function(yarn) {
		this.weave(yarn);
	}

	this.twill = function(yarn, width) {
		this.weave(yarn, width || 2, width || 2);
	}

	this.satinWeave = function(yarn) {
		// 1/16, skip 4
		this.weave(yarn, 1, 16, 4);
	}

	this.basketWeave = function(yarn) {
		// 2/2, skip 1, repeat 1
		this.weave(yarn, 2, 2, 1, 1);
	}

	this.plaid = function() {
		for (var i = 0; i*ctx.lineWidth < height; i += 1) {
			var j = i % warp.length;
			this.twill(warp[j]);
		}
	}
}

var sett_re = /([A-Za-z]{1,3}|\([A-Fa-f0-9]{3}\))(\d{1,3})/;

function settOfString(str) {
	var sett = []
	
	while (str.length > 0) {
		var result = sett_re.exec(str);
		if (result == null) {
			break
		}

		var color;
		var cs = result[1];
		if (cs[0] == "(") {
			color = "#" + cs.substr(1, cs.length-2);
		} else {
			color = colors[cs];
		}

		for (var i = 0; i < result[2]; i += 1) {
			sett.push(color);
		}

		str = str.substr(result[0].length + result.index);
	}

	if (str[str.length - 1] != ".") {
		var ttes = sett.concat();
		ttes.reverse();
		sett = sett.concat(ttes);
	}

	if (sett.length % 4 != 0) {
		sett = sett.concat(sett);
	}

	return sett;
}

function weave(pattern, width) {
	var canvas = document.getElementById("loom");
	var ctx = canvas.getContext("2d");

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	var sett = settOfString(pattern);
	var l = new Loom(ctx, sett, width);
	l.plaid();
}

function update(reset) {
	var settInput = document.getElementById("sett");
	var thickInput = document.getElementById("thick");
	weave(settInput.value, thick.value);

	if (reset) {
		var s = encodeURIComponent(settInput.value).replace(/%20/g, "+");
		window.location.hash = "s=" + s + "&w=" + thickInput.value;

		document.getElementById("preset").value = "Presets:";
		document.getElementById("desc").innerText = "";
	}
}

function preset() {
	var presetName = document.getElementById("preset").value;
	var tartan = tartans[presetName];

	if (! tartan) {
		presetName = "New Mexico Land Of Enchantment";
		tartan = tartans[presetName];
		document.getElementById("preset").value = presetName;
	}

	document.getElementById("sett").value = tartan["sett"];
	document.getElementById("desc").innerText = tartan["description"];
	window.location.hash = "p=" + encodeURIComponent(presetName).replace(/%20/g, "+");
	update();
}

// Build up query string
var qs = {};
if (window.location.hash) {
	parts = window.location.hash.substr(1).split("&");
	for (var i in parts) {
		var p = parts[i].split("=", 2);
		if (p.length == 1) {
			qs[p[0]] = "";
		} else {
			qs[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
		}
	}
}

function init() {
	document.getElementById("sett").addEventListener("input", update);
	document.getElementById("thick").addEventListener("input", update);


	if (qs["s"]) {
		document.getElementById("sett").value = qs["s"];
	}
	if (qs["w"]) {
		document.getElementById("thick").value = qs["w"];
	}

	var presetName = qs["p"];
	var presetInput = document.getElementById("preset")
	presetInput.addEventListener("change", preset);
	for (var name in tartans) {
		var opt = document.createElement("option");
		opt.text = name;
		if (name == presetName) {
			opt.selected = true;
		}
		presetInput.appendChild(opt);
	}

	preset();
}
window.addEventListener("load", init);

