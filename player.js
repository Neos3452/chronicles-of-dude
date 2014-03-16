(function () {
	var Player = function(playerAssets) {
		this.initialize(playerAssets);
	}
	var p = Player.prototype = new createjs.Container();
	
	p.torso;
	p.head;
	p.weapon;
	p.armLeft;
	p.armRight;
	
	p.Container_initialize = p.initialize;
	p.initialize = function(playerAssets) {
		this.Container_initialize();
		this.torso = playerAssets.torso;
		this.head = playerAssets.head;
		this.weapon = playerAssets.weapon;
		this.armLeft = {
			all: playerAssets.armLeft,
			forearm: playerAssets.armLeft.getChildAt(0),
			sleeve: playerAssets.armLeft.getChildAt(1)
		};
		this.armRight = {
			all: playerAssets.armRight,
			forearm: playerAssets.armRight.getChildAt(0),
			sleeve: playerAssets.armRight.getChildAt(1)
		};
		this.addChild(this.torso);
		this.addChild(this.armLeft.all);
		this.addChild(this.head);
		this.addChild(this.weapon);
		this.addChild(this.armRight.all);
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
		
		var vector = {
			x: x - (this.x + this.head.x + this.head.eyesX),
			y: y - (this.y + this.head.y + this.head.eyesY)
			};
		var rot = 57.2957795 * Math.atan2(vector.y, vector.x);
		this.head.rotation = rot;
		
		var F1 = {
			x: this.x + this.armLeft.all.x,
			y: this.y + this.armLeft.all.y,
		};
		var F2 = {
			x: this.x + this.armRight.all.x,
			y: this.y + this.armRight.all.y,
		};
		
		var a = Math.abs(F1.x - F2.x);
		var b = 2 * Math.sqrt(Math.pow(this.armLeft.all.length, 2) - Math.pow(a/2,2));
		a = a + 2 * (this.armLeft.all.length - a);
		var elipseCenter = {
			x: 0,
			y: 0
		}
		elipseCenter.x = F1.x - (F1.x - F2.x)/2;
		elipseCenter.y = F1.y - (F1.y - F2.y)/2;
		var direction = {
			x: x - elipseCenter.x,
			y: y - elipseCenter.y
		};
		var l = Utils.vectorLength(direction.x, direction.y);
		direction.x /= l;
		direction.y /= l;
		var rot = Math.atan2(direction.y, direction.x);
		var elipseX = a/2 * Math.cos(rot);
		var elipseY = b/2 * Math.sin(rot);
		var leftRot = 57.2957795 * Math.atan2(elipseCenter.y + elipseY - F1.y, elipseCenter.x + elipseX - F1.x);
		var rigthRot = 57.2957795 * Math.atan2(elipseCenter.y + elipseY - F2.y, elipseCenter.x + elipseX - F2.x);

		this.armLeft.all.rotation = -45 + leftRot;
		this.armRight.all.rotation = -45 + rigthRot;
		var point = this.armLeft.forearm.localToLocal(25, 27, this);
		this.weapon.x = point.x;
		this.weapon.y = point.y;
		var rotOther = 57.2957795 * Math.atan2(point.y - this.armRight.all.y, point.x - this.armRight.all.x);
		this.weapon.rotation = rotOther;
		
		
		var holdPointArm = this.weapon.localToLocal(42, 22, this.armRight.all);

		var holdDistance = Utils.vectorLength(holdPointArm.x, holdPointArm.y);

		var elbowRot = 57.2957795 * Math.acos(-((Math.pow(holdDistance, 2) - Math.pow(this.armLeft.sleeve.length-5, 2) - Math.pow(this.armLeft.forearm.length-17, 2))/(2*(this.armLeft.sleeve.length-5)*(this.armLeft.forearm.length-17))));
		if (isNaN(elbowRot))
			elbowRot = 180;
		var shoulderRot = 57.2957795 * Math.acos(-((-Math.pow(holdDistance, 2) + Math.pow(this.armLeft.sleeve.length-5, 2) - Math.pow(this.armLeft.forearm.length-17, 2))/(2*(holdDistance)*(this.armLeft.forearm.length-17))));
		if (isNaN(shoulderRot))
			shoulderRot = 0;
		this.armRight.all.rotation += shoulderRot;
		this.armRight.forearm.rotation	= -(180-elbowRot);			    
				
	}
	
	p.shoot = function (currentTime) {
		this.weapon.shoot(currentTime);
	}
	
	window.Player = Player;
}());