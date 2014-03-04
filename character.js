(function () {
	var Character = function(torsoAnimation, headAnimation) {
		this.initialize(torsoAnimation, headAnimation);
	}
	var p = Character.prototype = new createjs.Container();
	
	p.torso;
	p.head;
	
	p.Container_initialize = p.initialize;
	p.initialize = function(torsoAnimation, headAnimation) {
		this.Container_initialize();
		this.torso = torsoAnimation;
		this.head = headAnimation;
		this.addChild(this.torso);
		this.addChild(this.head);
	}
 
 	p.run = function() {
		this.torso.gotoAndPlay("run");
	}
	
	p.isRunning = function() {
		return this.torso.currentAnimation === "run";
	}
	
	p.backwardRun = function() {
		this.torso.gotoAndPlay("backward_run");
	}
	
	p.isBackwardsRunning = function() {
		return this.torso.currentAnimation === "backward_run";
	}
	
	p.stand = function() {
		this.torso.gotoAndPlay("stand");
	}
	
	p.isStanding = function() {
		return this.torso.currentAnimation === "stand";
	}
	
	p.jump = function() {
		this.torso.gotoAndPlay("jump");
	}
	
	p.isJumping = function() {
		return this.torso.currentAnimation === "jump";
	}
	
	p.lookAt = function(x, y) {
		var vector = {
			x: x - (this.x + this.head.x + this.head.eyesX),
			y: y - (this.y + this.head.y + this.head.eyesY)
			};
		var rot = 57.2957795 * Math.atan2(vector.y, vector.x);
		this.head.rotation = rot;
		if (this.head.rotation > 90 || this.head.rotation < -90) {
			this.head.rotation -= 180;
			this.head.rotation *= -1;
			if (this.scaleX > 0) this.scaleX *= -1;
// 			if (this.head.scaleX > 0) this.head.scaleX *= -1;
// 			if (this.torso.scaleX > 0) this.torso.scaleX *= -1;
		} else {
			if (this.scaleX < 0) this.scaleX *= -1;
// 			if (this.head.scaleX < 0) this.head.scaleX *= -1;
// 			if (this.torso.scaleX < 0) this.torso.scaleX *= -1;
		}
		return rot;
	}
	window.Character = Character;
}());