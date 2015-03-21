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

// TODO: Clear preset when fiddling with sett
// TODO: Make preset part of URL


var tartans = {
	"Albuquerque": {
		"sett": "R4 G24 B4 G10 B36 W6 R4 W4",
		"description": "Created by Ralph Stevenson Jr and Charles Hargis in 2005 for the city's tricentennial anniversary (1706-2006).  It is similar in design to the New Mexico tartan, with a little less green, and white instead of yellow, with a thicker center band."
	},
	"Armstrong": {
		"sett": "G4 BK2 G60 BK24 B4 BK2 B2 BK2 B24 R6",
		"description": ""
	},
	"Arizona": {
		"sett": "W2 G3 R4 G28 B3 BR8",
		"description": "Based on a jpeg I found on a geocities homepage.  Surprisingly, that jpeg was the only mention I could find on the net of what the actual sett was for Arizona."
	},
	"Black Watch": {
		"sett": "B22 BK2 B2 BK2 B2 BK16 G16 BK2 G16 BK16 B16 BK2 B2 BK2 G10 BK8 DB9 BK1 DB1",
		"description": "A standard."
	},
	"Buchanan": {
		"sett": "Y8 BK2 Y8 BK2 B6 BK2 G8 B4 G8 BK2 B6 BK2 LR10 W2 LR10 BK2 B6 BK2 .",
		"description": "I typed in this one as an example of an asymmetric sett."
	},
	"Colorado": {
		"sett": "Y4 R6 (669)34 K40 G4 W6 LV6 W6 G22",
		"description": "Wikipedia lists the sett as [Y/6] R4 MB26 K32 G4 W4 Lv4 W4 [G/44]. I'm not familiar with the [Color/Count] notation, the count appears to be doubled, possibly to indicate the total count of that thread in the mirror section.\n\n[Colorado house joint resolution 97-1016](http://www.state.co.us/gov_dir/leg_dir/res/HJR1016.htm) makes this official but doesnt provide a thread count.  It speaks of \"cerulean blue\" which I approximate with the unique (669) color."
	},
	"The Hacker": {
		"sett": "G1 LG3 G3 K7",
		"description": "Created by pi-rho, an impressive hacker in his own right."
	},
	"New Mexico": {
		"sett": "R4 G24 B4 G16 B36 Y8 R4 Y4",
		"description": "Designed by Ralph Stevenson Jr, [officially recognized in 2003](nm-proc.png) by the Secretary of State.  It is similar in design to the [Albuquerque tartan](albuquerque.html).  I bought a scarf of this plaid from Mr. Stevenson; it came with a photocopy of the tartan registration and a few other documents."
	},
	"New Mexico Land Of Enchantment": {
		"sett": "LG8 LV32 R4 G32 LG32 Y4 LG4",
		"description": "This isn't official but I think it's pretty.  I just guessed at the sett pattern but I think I got pretty close.  [Kathy Lare](http://www.kathyskilts.com/) is the sole source for this fabric."
	},
	"Nevada": {
		"sett": "W4 LGR16 B4 LGR8 B8 Y4 B4 R4 B20",
		"description": "Based on a terrible gif that is apparently a part of [Nevada Revised Statute 235.130](http://leg.state.nv.us/NRS/NRS-235.html#NRS235Sec130).  Designed by Richard Zygmunt Pawlowski, approved May 8, 2001."
	},
	"Oklahoma": {
		"sett": "R4 W8 LB64 Y6 BK16",
		"description": "Based on a photo on a web page."
	},
	"Oregon": {
		"sett": "Y3 LV10 G4 LV4 G4 W2 G8 LBR24 R4 LB2 K2",
		"description": "Here you go, people of Oregon: your legislature apparently thought the best way to record your tartan was registering it with a private company."
	},
	"Neale's PJs": {
		"sett": "W7 C3 GR5 BK3 C5 BK3 C6 GR3 C5",
		"description": "This is an approximation of the pajamas I was wearing when I wrote the tartan designer.  They weren't actually a tartan.  I guess modern weavers feel they ought to show off the fact that they can do fancy tricks with their looms."
	},
	"Neale's PJs II": {
		"sett": "W3 G24 Y2 W2 G2 W2 G2 W1",
		"description": "More of my PJs.  This one is an exact copy, I can count the threads in this fabric."
	},
	"Shrek": {
		"sett": "LBR4 BR8 G16 R2 G16 BR32",
		"description": "I (Neale) created this based on Shrek's pants in a couple of frame grabs from the movie.  It appears to be different from the recently-released \"Shrek's Tartan\"."
	},
	"Texas Bluebonnet": {
		"sett": "G4 R2 B16 W2 R2 W2 LB16 W2 LB16 W2 Y1",
		"description": "Based off a jpeg at the [Texas Scottish Heritage Society](http://www.txscot.com/BB_tartan.htm#bluebonnet).  (Why did they save it as a jpeg?)  The first blue in their image was only 15 threads wide, I figured that was a typographical mistake given every subsequent blue was 16, even in the repeats.  According to the aforementioned web page, it was designed by June Prescott McRoberts, and adopted as the official state tartan on May 25, 1989."
	},
	"Utah": {
		"sett": "W1 B6 R6 B4 R6 G18 R6 W4",
		"description": "Kudos to Utah for putting the sett right into 1996's SB-13.  This is the tartan as specified by law.  The [photograph on Utah's Online Library](http://pioneer.utah.gov/utah_on_the_web/utah_symbols/tartan.html) seems to have a final white threadcount of 3."
	},
	"Washington State": {
		"sett": "W3 R6 B36 G72 LB6 BK6 Y2",
		"description": "Adopted 1991 by the spartan [RCW 1.20.110](http://apps.leg.wa.gov/rcw/default.aspx?cite=1.20.110)."
	}
}

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

function update(e) {
	var settInput = document.getElementById("sett");
	var thickInput = document.getElementById("thick");
	weave(settInput.value, thick.value);

	var s = encodeURIComponent(settInput.value).replace(/%20/g, "+");
	window.location.hash = "s=" + s + "&w=" + thickInput.value;

}

var tartans = {
	"Albuquerque": {
		"sett": "R4 G24 B4 G10 B36 W6 R4 W4",
		"description": "Created by Ralph Stevenson Jr and Charles Hargis in 2005 for the city's tricentennial anniversary (1706-2006).  It is similar in design to the New Mexico tartan, with a little less green, and white instead of yellow, with a thicker center band."
	},
	"Armstrong": {
		"sett": "G4 BK2 G60 BK24 B4 BK2 B2 BK2 B24 R6",
		"description": ""
	},
	"Arizona": {
		"sett": "W2 G3 R4 G28 B3 BR8",
		"description": "Based on a jpeg I found on a geocities homepage.  Surprisingly, that jpeg was the only mention I could find on the net of what the actual sett was for Arizona."
	},
	"Black Watch": {
		"sett": "B22 BK2 B2 BK2 B2 BK16 G16 BK2 G16 BK16 B16 BK2 B2 BK2 G10 BK8 DB9 BK1 DB1",
		"description": "A standard."
	},
	"Buchanan": {
		"sett": "Y8 BK2 Y8 BK2 B6 BK2 G8 B4 G8 BK2 B6 BK2 LR10 W2 LR10 BK2 B6 BK2 .",
		"description": "I typed in this one as an example of an asymmetric sett."
	},
	"Colorado": {
		"sett": "Y4 R6 (669)34 K40 G4 W6 LV6 W6 G22",
		"description": "Wikipedia lists the sett as [Y/6] R4 MB26 K32 G4 W4 Lv4 W4 [G/44]. I'm not familiar with the [Color/Count] notation, the count appears to be doubled, possibly to indicate the total count of that thread in the mirror section.\n\n[Colorado house joint resolution 97-1016](http://www.state.co.us/gov_dir/leg_dir/res/HJR1016.htm) makes this official but doesnt provide a thread count.  It speaks of \"cerulean blue\" which I approximate with the unique (669) color."
	},
	"The Hacker": {
		"sett": "G1 LG3 G3 K7",
		"description": "Created by pi-rho, an impressive hacker in his own right."
	},
	"New Mexico": {
		"sett": "R4 G24 B4 G16 B36 Y8 R4 Y4",
		"description": "Designed by Ralph Stevenson Jr, [officially recognized in 2003](nm-proc.png) by the Secretary of State.  It is similar in design to the [Albuquerque tartan](albuquerque.html).  I bought a scarf of this plaid from Mr. Stevenson; it came with a photocopy of the tartan registration and a few other documents."
	},
	"New Mexico Land Of Enchantment": {
		"sett": "LG8 LV32 R4 G32 LG32 Y4 LG4",
		"description": "This isn't official but I think it's pretty.  I just guessed at the sett pattern but I think I got pretty close.  [Kathy Lare](http://www.kathyskilts.com/) is the sole source for this fabric."
	},
	"Nevada": {
		"sett": "W4 LGR16 B4 LGR8 B8 Y4 B4 R4 B20",
		"description": "Based on a terrible gif that is apparently a part of [Nevada Revised Statute 235.130](http://leg.state.nv.us/NRS/NRS-235.html#NRS235Sec130).  Designed by Richard Zygmunt Pawlowski, approved May 8, 2001."
	},
	"Oklahoma": {
		"sett": "R4 W8 LB64 Y6 BK16",
		"description": "Based on a photo on a web page."
	},
	"Oregon": {
		"sett": "Y3 LV10 G4 LV4 G4 W2 G8 LBR24 R4 LB2 K2",
		"description": "Here you go, people of Oregon: your legislature apparently thought the best way to record your tartan was registering it with a private company."
	},
	"Neale's PJs": {
		"sett": "W7 C3 GR5 BK3 C5 BK3 C6 GR3 C5",
		"description": "This is an approximation of the pajamas I was wearing when I wrote the tartan designer.  They weren't actually a tartan.  I guess modern weavers feel they ought to show off the fact that they can do fancy tricks with their looms."
	},
	"Neale's PJs II": {
		"sett": "W3 G24 Y2 W2 G2 W2 G2 W1",
		"description": "More of my PJs.  This one is an exact copy, I can count the threads in this fabric."
	},
	"Shrek": {
		"sett": "LBR4 BR8 G16 R2 G16 BR32",
		"description": "I (Neale) created this based on Shrek's pants in a couple of frame grabs from the movie.  It appears to be different from the recently-released \"Shrek's Tartan\"."
	},
	"Texas Bluebonnet": {
		"sett": "G4 R2 B16 W2 R2 W2 LB16 W2 LB16 W2 Y1",
		"description": "Based off a jpeg at the [Texas Scottish Heritage Society](http://www.txscot.com/BB_tartan.htm#bluebonnet).  (Why did they save it as a jpeg?)  The first blue in their image was only 15 threads wide, I figured that was a typographical mistake given every subsequent blue was 16, even in the repeats.  According to the aforementioned web page, it was designed by June Prescott McRoberts, and adopted as the official state tartan on May 25, 1989."
	},
	"Utah": {
		"sett": "W1 B6 R6 B4 R6 G18 R6 W4",
		"description": "Kudos to Utah for putting the sett right into 1996's SB-13.  This is the tartan as specified by law.  The [photograph on Utah's Online Library](http://pioneer.utah.gov/utah_on_the_web/utah_symbols/tartan.html) seems to have a final white threadcount of 3."
	},
	"Washington State": {
		"sett": "W3 R6 B36 G72 LB6 BK6 Y2",
		"description": "Adopted 1991 by the spartan [RCW 1.20.110](http://apps.leg.wa.gov/rcw/default.aspx?cite=1.20.110)."
	}
}

function preset() {
	var presetName = document.getElementById("preset").value;
	var tartan = tartans[presetName];

	if (! tartan) {
		tartan = tartans["Black Watch"];
	}

	document.getElementById("sett").value = tartan["sett"];
	document.getElementById("desc").innerText = tartan["description"];
	update();
}

var qs = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.hash.split('&'));

function init() {
	document.getElementById("sett").addEventListener("input", update);
	document.getElementById("thick").addEventListener("input", update);


	if (qs["s"]) {
		document.getElementById("sett").value = qs["s"];
	}
	if (qs["w"]) {
		document.getElementById("thick").value = qs["w"];
	}

	var presetInput = document.getElementById("preset")
	presetInput.addEventListener("change", preset);
	for (var name in tartans) {
		var opt = document.createElement("option");
		opt.value = name;
		opt.text = name;
		presetInput.appendChild(opt);
	}

	preset();
}
window.addEventListener("load", init);

