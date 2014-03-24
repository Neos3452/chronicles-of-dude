

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

	window.Utils = new _utils();
	
}());