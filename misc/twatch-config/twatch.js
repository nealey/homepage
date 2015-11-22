  function getQueryParam(variable, defaultValue) {
    var query = location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (pair[0] === variable) {
        return decodeURIComponent(pair[1]);
      }
    }
    return defaultValue || false;
  }

function submit() {
    var form = document.getElementById("main-form");
    var inputs = form.getElementsByTagName("input");
    var return_to = getQueryParam('return_to', 'pebblejs://close#');

    var options = {};

    console.log("Submitting");
    for (var i = 0; i < inputs.length; i += 1) {
	var input = inputs[i];
	var k = input.name;
	var t = input.type;
	var v;

	if (t == "checkbox") {
	    v = input.checked;
	} else if (t == "text") {
	    v = Number(input.value);
	} else {
	    continue;
	}

	localStorage[k] = v;
	options[k] = v;
    }

    document.location = return_to + encodeURIComponent(JSON.stringify(options));
}

function restore() {
    var form = document.getElementById("main-form");
    var inputs = form.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i += 1) {
	var input = inputs[i];
	var k = input.name;
	var t = input.type;
	var v = localStorage[k];
	console.log(k);
	if (v != undefined) {
	    if (t == "checkbox") {
		input.checked = (v=="true")?true:false;
	    } else if (k.slice(0, 6) == "color-") {
		var val = ("000000" + Number(v).toString(16)).slice(-6);
		var hex = "0x" + val;
		var color = "#" + val;

		var $valueDisplay = $(input).parent().find('.value');
		$valueDisplay.css('background', color);
		$(input).val(hex);
	    }
	}
    }
}


function init() {
    var submit_btn = document.getElementById("submit");
    submit_btn.addEventListener("click", submit);
    restore();
    console.log("Initialized");
}
window.addEventListener("load", init);
