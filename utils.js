

Function.prototype.method = function (name, func) {
	this.prototype[name] = func;
	return this;
};

(function () {
	function _utils() {
	}
	_utils.prototype.vectorLength = function (x, y) {
		return Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
	}

	_utils.prototype.normalize = function (x, y) {
		var length = this.vectorLength(x,y);
		return {
			x: x / length,
			y: y / length,
		};
	}
	
	_utils.prototype.calcLineParameters = function (x1, y1, x2, y2) {
		var t = (y1-y2)/(x1-x2);
		return {
			A: t,
			B: -1,
			C: y1 - x1*(t),
		};
	}
	
	_utils.prototype.perpendicularLine = function (A, B, C, x, y) {
		return {
			A: B/A,
			B: -1,
			C: y - x * B/A,
		};
	}
	
	_utils.prototype.calcYfromLine = function (A, B, C, x) {
		return (A/-B) * x + C/-B;
	}
	
	_utils.prototype.linesIntersection = function (A1, B1, C1, A2, B2, C2) {
	    return {
	        x: (( B1*C2 - C1*B2)/(A1*B2 - B1*A2)),
	        y: ((-C1*A2 + A1*C2)/(-A1*B2 + B1*A2)),
	    };
	}
	
	_utils.prototype.distanceFromLine = function (x, y, A, B, C) {
		return Math.abs(A * x + B * y + C) / Math.sqrt(A*A + B*B);
	}

	window.Utils = new _utils();
	
}());
