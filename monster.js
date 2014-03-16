(function () {
	var Monster = function(monsterAssets) {
		this.initialize(monsterAssets);
	}
	var p = Monster.prototype = new createjs.Container();
	
	p.sprite;
	
	p.Container_initialize = p.initialize;
	p.initialize = function(monsterAssets) {
		this.Container_initialize();
		this.sprite = monsterAssets.sprite;
		
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
	
	p.attack = function() {
		this.torso.gotoAndPlay("attack");
	}
	
	p.isAttacking = function() {
		return this.torso.currentAnimation === "attack";
	}
	
	p.hit = function() {
		this.torso.gotoAndPlay("hit");
	}
	
	p.isBeingHit = function() {
		return this.torso.currentAnimation === "hit";
	}
	
	p.lookAt = function(x, y) {
		if (x < this.x) {
			x += 2*(this.x - x);
			if (this.scaleX > 0) this.scaleX *= -1;
		} else {
			if (this.scaleX < 0) this.scaleX *= -1;
		}
	}
	
	window.Monster = Monster;
}());