// 80orbust.js
// a grade is {0:{value: 0.6, label: "Assignment 1", weight: 1, 
// 		subgrades:{value: 0.5, label: "Question 1", weight: 1, id: 0}},
// 				1:{value: 0.8, label: "Assignment 2", weight: 2}}
// a threshold is {label: "OK", value:0.6, color:"#009900"}

function graphDisplay(header, containingElement, gA) {
	console.log(gA);
	this.element = document.createElement('div');
	this.element.style.display = 'relative';

	this.header = header;
	this.headerElement = document.createElement('span');
	this.headerElement.textContent = header;
	this.headerElement.className = "graphHeader";
	this.element.appendChild(this.headerElement);

	this.thresholds = {}

	this.graph = new graph(this.element, gA[0], gA[1], gA[2], gA[3], gA[4]);

	containingElement.appendChild(this.element);

	this.thresholdContainer = document.createElement('div');
	this.thresholdContainer.style.position = "absolute";
	this.thresholdContainer.style.width = this.graph.element.clientWidth + "px";
	console.log(this.graph.element.clientWidth);
	this.thresholdContainer.style.height = this.graph.barHeight + "px";
	console.log(this.graph.barHeight);
	this.thresholdContainer.style.left = 0;
	this.thresholdContainer.style.zIndex = "-10";

	this.thresholds = new Array();

}

graphDisplay.prototype.newThresholds = function(name, thresholdArray, overhang){
	this.thresholds[name] = {array: thresholdArray, 'overhang': overhang};
}

graphDisplay.prototype.addThresholds = function(name){

	for (var i in this.thresholds[name]['array']) {
		// var element = document.createElement("div");
		// element.style.position = "absolute";
		// element.style.height = "1px";
		// element.style.width = (this.element.clientWidth + 50) + "px";
		// element.style.right = "0";
		// element.style.bottom = thresholdArray[i]["value"] * this.barHeight;
		// element.style.backgroundColor = thresholdArray[i]["color"];
		// this.thresholdElements[i] = element;
		// this.thresholdContainer.appendChild(element);
		this.thresholds.push(new threshold(this.graph.barHeight, this.graph.element.clientWidth + this.thresholds[name]['overhang'], this.thresholds[name]['array'][i]["label"], this.thresholds[name]['array'][i]["color"], this.thresholds[name]['array'][i]["value"], this.thresholds[name]['overhang'], this.thresholdContainer));
	}

	this.graph.element.appendChild(this.thresholdContainer);
}

function graph(containingElement, grades, barHeight, barWidth, averageLabel, addBarMode){
	this.containingElement = containingElement;
	this.element = document.createElement('div');
	this.element.style.display = "flex";
	this.element.style.position = "relative";
	this.element.style.alignItems = "flex-end";
	this.element.style.justifyContent = "center";
	this.grades = grades;

	this.barHeight = barHeight;
	this.barWidth = barWidth;

	this.graphBars = {};
	this.addBars(addBarMode, grades, barHeight, barWidth, averageLabel);

	this.transitionCount = 0;

	this.subgraphs = {};

	this.containingElement.appendChild(this.element);
}

graph.prototype.addBars = function(mode, grades, barHeight, barWidth, averageLabel){
	var average = 0;
	var totalWeight = 0;

	for (i in grades){
		average += (grades[i]["value"] * grades[i]["weight"]);
		totalWeight += grades[i]["weight"];
	}

	average = average / totalWeight;

	switch(mode) {
		case "noAverageTransition":
			this.averageBar = new graphBar(average, average, this.barHeight, this.barWidth * 1.5, averageLabel, 0, this);
			this.averageBar.element.style.margin = "0 2em 0 1em";
			this.element.appendChild(this.averageBar.element);
			// for (var i = 0; i < grades.length; ++i) {
			for (var i in grades){
				var gB = new graphBar(0, grades[i]["value"], this.barHeight, this.barWidth, grades[i]["label"], grades[i]["weight"], this, i);
				this.element.appendChild(gB.element);
				this.graphBars[i] = gB;
			}
			break;

		default:
			this.averageBar = new graphBar(0, average, this.barHeight, this.barWidth * 1.5, averageLabel, 0, this);
			this.averageBar.element.style.margin = "0 2em 0 1em";
			this.element.appendChild(this.averageBar.element);
			// for (var i = 0; i < grades.length; ++i) {
			for (var i in grades) {
				var gB = new graphBar(0, grades[i]["value"], this.barHeight, this.barWidth, grades[i]["label"], grades[i]["weight"], this, i);
				this.element.appendChild(gB.element);
				this.graphBars[i] = gB;
			}
			break;
	}
}

graph.prototype.reportTransitionFinish = function() {
	this.transitionCount += 1;
	console.log(this.transitionCount);
	console.log(this.numOfTransitions);
	if (this.transitionCount == this.numOfTransitions) this.finishTransitionOut();
}

graph.prototype.initiateTransitionOut = function(barId){
	this.numOfTransitions = Object.keys(this.graphBars).length + 1;
	this.transitionCount = 0;
	this.currentTransitionBarId = barId;
	//determine how far to move the new averageBar
	var xDelta = this.averageBar.element.offsetLeft - this.graphBars[barId].element.offsetLeft;

	for(i in this.graphBars) {
		if(i != barId) this.graphBars[i].fadeOut();
	}
	this.averageBar.fadeOut();

	this.graphBars[barId].moveHorizontal(xDelta, this.barWidth * 1.5);

}

graph.prototype.finishTransitionOut = function() {
	console.log(';e;');
	if (this.subgraphs[this.currentTransitionBarId] == undefined){
		console.log(this.grades[this.currentTransitionBarId]['subgrades']);
		this.subgraphs[this.currentTransitionBarId] = new graph(this.containingElement, this.grades[this.currentTransitionBarId]['subgrades'],this.barHeight, this.barWidth, this.averageLabel);
	}
	else this.subgraphs[this.currentTransitionBarId].element.style.display = "relative";
	this.currentTransitionBarId = undefined;
	this.element.style.display = 'none';
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

function graphBar(initialGrade, grade, height, width, label, weight, graph, id) {
	this.grade = grade;
	this.label = label;
	this.weight = weight;
	this.graph = graph;
	this.id = id;

	this.barElement = document.createElement('div');
	this.percentElement = document.createElement('span');
	this.labelElement = document.createElement('span');

	this.barElement.className = "bar";
	this.percentElement.className = "percent";
	this.labelElement.className = "label";

	this.barElement.style.width = width + "px";
	this.barElement.style.position = "relative";

	this.element = document.createElement('span');
	this.element.className = "graphBar";
	this.element.style.margin = "0 1em";
	// this.element.style.display="inline";
	this.maxBarHeight = height;
	// this.barElement.style.height = (this.maxBarHeight * grade).toString() + "px";
	// this.percentElement.innerText = (this.grade * 100).toFixed(2).toString() + "%";

	this.handleEvent = function(e) {
		switch(e.type) {
			case 'transitionend':
				this.element.removeEventListener('transitionend', this, false);
				this.element.removeEventListener('webkitTransitionEnd', this, false);
				this.graph.reportTransitionFinish();
				break;
			case 'webkitTransitionEnd':
				this.element.removeEventListener('transitionend', this, false);
				this.element.removeEventListener('webkitTransitionEnd', this, false);
				this.graph.reportTransitionFinish();
				break;
			case 'click':
				this.element.removeEventListener('click', this, false);
				this.graph.initiateTransitionOut(this.id);
				break;
		}
	}

	this.setGrade(initialGrade);

	this.labelElement.innerText = this.label;
	this.element.appendChild(this.barElement);
	this.element.appendChild(this.percentElement);
	this.element.appendChild(document.createElement('br'));
	this.element.appendChild(this.labelElement);

	this.element.style.left = '0';

	this.element.addEventListener('click', this, false);

	this.duration = 1500;
	this.tweenGrade(grade);
}

graphBar.prototype.setGrade = function(grade) {
	this.grade = grade;
	this.barElement.style.height = (this.maxBarHeight * grade).toString() + "px";
	this.barElement.style.marginTop = (this.maxBarHeight * (1 - grade)).toString() + "px";
	var newGrade = (this.grade * 100).toFixed(2);
	if (newGrade == "100.00") newGrade = "100";
	this.percentElement.innerText = newGrade + "%";
}

graphBar.prototype.tweenGrade = function(grade) {
	var oldGrade = this.grade;
	var newGrade = grade;
	var frames = getStepFrames(oldGrade, newGrade, this.duration * 0.06);
	// console.log(frames);
	var f = (function(){
		if(frames.length > 0) {
			var i = frames.splice(0,1)[0];
			// console.log(this.grade);
			// console.log(i);
			this.setGrade(i);
			requestAnimationFrame(f);
		}
	}).bind(this);
	f();
}

graphBar.prototype.fadeOut = function(){
	this.element.style.opacity = '0';
	this.element.addEventListener("transitionend", this, false);
	this.element.addEventListener("webkitTransitionEnd", this, false);
}

graphBar.prototype.moveHorizontal = function(px, barWidth) {
	console.log(px);
	this.element.style.position = 'relative';
	this.element.style.left = px + "px";
	this.barElement.style.width = barWidth + "px";
	this.element.addEventListener("transitionend", this, false);
	this.element.addEventListener("webkitTransitionEnd", this, false);
}

function getStepFrames(oldGrade, newGrade, frames) {
	// for now
	// return [0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,newGrade];
	var d = awfulBezierApproximation(0.3, 0.4, 0.5, 1, Math.floor(frames * 1.5));
	var f = normalizePoints(d, frames);
	var r = [];
	var delta = newGrade - oldGrade;
	for(var i = 0; i < f.length; ++i) r[i] = (f[i][1]) * delta + oldGrade;
	return r;
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