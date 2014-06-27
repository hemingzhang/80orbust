//awfulmath.js

function normalizePoints(points, steps) {
	//take {steps} samples with uniform interval along the x dimension from points,
	//interpolating linearly
	var normalized = [];
	var c = 0;
	var lx = 0; // x, y values of the first point
	var ly = 0;
	var ux = points[c][0];
	var uy = points[c][1];
	for(var i = 0; i < steps; ++i) {
		while ((i + 1)/steps > ux) {
			++c;
			lx = ux;
			ly = uy;
			ux = points[c][0];
			uy = points[c][1];
		}
		normalized[i] = linearInterpolate(lx, ux, ly, uy, (((i+1)/steps-lx) / (ux-lx)));
	}
	return normalized;
}

function awfulBezierApproximation(x1, x2, y1, y2, steps){
	var points = [];
	for (var i = 0; i < steps; ++i) {
		points[i] = deCasteljau([[0,0],[x1,y1],[x2,y2],[1,1]], 1/steps * (i + 1));
	}
	return points;
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

function plotPoints(points, element, xScale, yScale, color) {
	element.style.position = 'relative';
	for(var i = 0; i < points.length; ++i) {
		var point = document.createElement('div');
		point.style.position = 'absolute';
		point.style.backgroundColor = color;
		point.style.width = point.style.height = '2px';
		point.style.left = (points[i][0] * xScale) + 'px';
		point.style.bottom = (points[i][1] * yScale) + 'px';
		element.appendChild(point);
	}
}