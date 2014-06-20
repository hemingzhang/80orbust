// 80orbust.js
// grade is in [0, 1]

function graph(containingElement, grades){
	this.containingElement = containingElement;
	this.element = document.createElement('div');
	this.graphBars = [];
	for (i in grades) {
		var gB = new graphBar(grades[i]);
		this.element.appendChild(gB.element);
		this.graphBars.push(gB);
	}
	this.containingElement.appendChild(this.element);
}

function graphBar(grade) {
	this.grade = grade;
	this.barElement = document.createElement('div');
	this.percentElement = document.createElement('div');
	this.barElement.className = "bar";
	this.percentElement.className = "percent";
	this.element = document.createElement('div');
	this.maxBarHeight = 100;
	this.barElement.style.height = (this.maxBarHeight * grade).toString() + "px";
	this.percentElement.innerText = (this.grade * 100).toFixed(2).toString() + "%";
	this.element.appendChild(this.barElement);
	this.element.appendChild(this.percentElement);
	this.duration = 1000;
}

graphBar.prototype.setGrade = function(grade) {
	this.grade = grade;
	this.barElement.style.height = (this.maxBarHeight * grade).toString() + "px";
	this.percentElement.innerText = (this.grade * 100).toFixed(2).toString() + "%";
}

function getStepFrames(oldGrade, newGrade, duration) {
	// for now
	return [newGrade];
}

graphBar.prototype.tweenGrade = function(grade) {
	var oldGrade = this.grade;
	var newGrade = grade;
	var frames = getStepFrames(oldGrade, newGrade, this.duration);
	for (var i = 0; i < frames.length; ++i) {
		this.barElement.style.height = frames[i] * this.maxBarHeight + "px";
	}
}