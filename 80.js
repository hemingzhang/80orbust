// 80orbust.js
// a grade is {value: 0.6, label: "Assignment 1"}
// a threshold is {label: "OK", value:0.6, color:"#009900"}


function graph(containingElement, grades, barHeight, barWidth, averageLabel){
	this.containingElement = containingElement;
	this.element = document.createElement('div');
	this.element.style.display = "flex";
	this.element.style.position = "relative";
	this.element.style.alignItems = "flex-end";
	this.element.style.justifyContent = "center";

	this.barHeight = barHeight;
	this.barWidth = barWidth;

	var average = 0;

	for (i in grades) average += grades[i]["value"];

	average = average / grades.length;

	this.averageBar = new graphBar(average, this.barHeight, this.barWidth * 1.5, averageLabel);
	this.averageBar.element.style.margin = "0 2em 0 1em";
	this.element.appendChild(this.averageBar.element);
	this.graphBars = [];
	for (var i = 0; i < grades.length; ++i) {
		var gB = new graphBar(grades[i]["value"], this.barHeight, this.barWidth, grades[i]["label"]);
		this.element.appendChild(gB.element);
		this.graphBars.push(gB);
	}

	this.containingElement.appendChild(this.element);

	this.thresholdContainer = document.createElement('div');
	this.thresholdContainer.style.position = "absolute";
	this.thresholdContainer.style.width = this.element.clientWidth + "px";
	console.log(this.element.clientWidth);
	this.thresholdContainer.style.height = this.barHeight + "px";
	this.thresholdContainer.style.left = 0;
	this.thresholdContainer.style.zIndex = "-10";

	this.thresholds = new Array();

}

function threshold(barHeight, width, label, color, value, overhang, containingElement){
	this.barHeight = barHeight;
	this.width = width;
	this.label = label;
	this.color = color;
	this.value = value;
	this.containingElement = containingElement;

	this.lineElement = document.createElement("div");
	this.lineElement.style.position = "absolute";
	this.lineElement.style.height = "1px";
	this.lineElement.style.width = width + "px";
	this.lineElement.style.right = "0";
	this.lineElement.style.bottom = (this.value * this.barHeight) + "px";
	// this.lineElement.style.zIndex = "-3";
	this.lineElement.style.backgroundColor = this.color;

	this.labelElement = document.createElement('span');
	this.labelElement.className = "lineLabel";
	this.labelElement.innerText = this.label;
	this.labelElement.style.position = "absolute";
	this.labelElement.style.left = (-1 * overhang) + "px";
	this.labelElement.style.bottom = (this.value * this.barHeight) + "px";
	this.labelElement.style.color = this.color;

	this.containingElement.appendChild(this.lineElement);
	this.containingElement.appendChild(this.labelElement);

}

graph.prototype.addThresholds = function(thresholdArray, overhang){

	for (i in thresholdArray) {
		// var element = document.createElement("div");
		// element.style.position = "absolute";
		// element.style.height = "1px";
		// element.style.width = (this.element.clientWidth + 50) + "px";
		// element.style.right = "0";
		// element.style.bottom = thresholdArray[i]["value"] * this.barHeight;
		// element.style.backgroundColor = thresholdArray[i]["color"];
		// this.thresholdElements[i] = element;
		// this.thresholdContainer.appendChild(element);
		this.thresholds.push(new threshold(this.barHeight, this.element.clientWidth + overhang, thresholdArray[i]["label"], thresholdArray[i]["color"], thresholdArray[i]["value"], overhang, this.thresholdContainer));
	}

	this.element.appendChild(this.thresholdContainer);
}

function graphBar(grade, height, width, label) {
	this.grade = grade;
	this.label = label;

	this.barElement = document.createElement('div');
	this.percentElement = document.createElement('span');
	this.labelElement = document.createElement('span');

	this.barElement.className = "bar";
	this.percentElement.className = "percent";
	this.labelElement.className = "label";

	this.barElement.style.width = width + "px";
	this.barElement.style.position = "relative";

	this.element = document.createElement('span');
	this.element.style.margin = "0 1em";
	// this.element.style.display="inline";
	this.maxBarHeight = height;
	// this.barElement.style.height = (this.maxBarHeight * grade).toString() + "px";
	// this.percentElement.innerText = (this.grade * 100).toFixed(2).toString() + "%";

	this.setGrade(this.grade);

	this.labelElement.innerText = this.label;
	this.element.appendChild(this.barElement);
	this.element.appendChild(this.percentElement);
	this.element.appendChild(document.createElement('br'));
	this.element.appendChild(this.labelElement);
	this.duration = 1000;
}

graphBar.prototype.setGrade = function(grade) {
	this.grade = grade;
	this.barElement.style.height = (this.maxBarHeight * grade).toString() + "px";
	this.barElement.style.marginTop = (this.maxBarHeight * (1 - grade)).toString() + "px";
	var newGrade = (this.grade * 100).toFixed(2);
	if (newGrade == "100.00") newGrade = "100";
	this.percentElement.innerText = newGrade + "%";
}

function getStepFrames(oldGrade, newGrade, duration) {
	// for now
	return [0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,newGrade];
}

graphBar.prototype.tweenGrade = function(grade) {
	var oldGrade = this.grade;
	var newGrade = grade;
	var frames = getStepFrames(oldGrade, newGrade, this.duration);
	var f = (function(){
		if(frames.length > 0) {
			var i = frames.splice(0,1);
			this.setGrade(i);
			requestAnimationFrame(f);
		}
	}).bind(this);
	f();
}

function deCasteljau(controlPoints, t){
	// controlPoints is in the format [[x0, y0], [x1, y1], .. ,[xn, yn]], 0 <= t <=1

	if (controlPoints.length == 1) return controlPoints[0];

	if (controlPoints.length <= 0) {
		console.log("what the fuck");
		return;
	}

	var order = controlPoints.length - 1;
	var derivedPoints = [];
	for (var i = 0; i < order; ++i) {
		derivedPoints[i] = linearInterpolate(controlPoints[i][0],
			controlPoints[i+1][0], controlPoints[i][1],
			controlPoints[i+1][1], t);
	}
	return deCasteljau(derivedPoints, t);
}

function linearInterpolate(x1,x2,y1,y2,t) {
	return [(1-t)*x1 + t*x2, (1-t)*y1 + t*y2];
}

function waitForWebfonts(fonts, callback) {
    var loadedFonts = 0;
    for(var i = 0, l = fonts.length; i < l; ++i) {
        (function(font) {
            var node = document.createElement('span');
            // Characters that vary significantly among different fonts
            node.innerHTML = 'giItT1WQy@!-/#';
            // Visible - so we can measure it - but not on the screen
            node.style.position      = 'absolute';
            node.style.left          = '-10000px';
            node.style.top           = '-10000px';
            // Large font size makes even subtle changes obvious
            node.style.fontSize      = '300px';
            // Reset any font properties
            node.style.fontFamily    = 'sans-serif';
            node.style.fontVariant   = 'normal';
            node.style.fontStyle     = 'normal';
            node.style.fontWeight    = 'normal';
            node.style.letterSpacing = '0';
            document.body.appendChild(node);

            // Remember width with no applied web font
            var width = node.offsetWidth;

            node.style.fontFamily = font;

            var interval;
            function checkFont() {
                // Compare current width with original width
                if(node && node.offsetWidth != width) {
                    ++loadedFonts;
                    node.parentNode.removeChild(node);
                    node = null;
                }

                // If all fonts have been loaded
                if(loadedFonts >= fonts.length) {
                    if(interval) {
                        clearInterval(interval);
                    }
                    if(loadedFonts == fonts.length) {
                        callback();
                        return true;
                    }
                }
            };

            if(!checkFont()) {
                interval = setInterval(checkFont, 50);
            }
        })(fonts[i]);
    }
};