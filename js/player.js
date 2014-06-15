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
		this.world = playerAssets.world;
		this.playerAttributes = playerAssets.playerAttributes;
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
			var realX = x;
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
		
		var mousePos = this.globalToLocal(realX,y);
		var direction = {
			x: mousePos.x - this.armRight.all.x,
			y: mousePos.y - this.armRight.all.y,
		};
		direction = Utils.normalize(direction.x, direction.y);
		var weaponPoint = {
			x: this.armRight.all.x + direction.x * this.weapon.buttLength,
			y: this.armRight.all.y + direction.y * this.weapon.buttLength,
		};
		this.weapon.x = weaponPoint.x;
		this.weapon.y = weaponPoint.y;
		this.weapon.rotation = 57.2957795 * Math.atan2(direction.y, direction.x);
		
		var holdPointArm = this.weapon.localToLocal(42, 22, this.armRight.all);
		var holdDistance = Utils.vectorLength(holdPointArm.x, holdPointArm.y);

		var elbowRot = 57.2957795 * Math.acos(-((Math.pow(holdDistance, 2) - Math.pow(this.armLeft.sleeve.length-5, 2)
						 - Math.pow(this.armLeft.forearm.length-17, 2))/(2*(this.armLeft.sleeve.length-5)*(this.armLeft.forearm.length-17))));
		if (isNaN(elbowRot))
			elbowRot = 180;
		var shoulderRot = 57.2957795 * Math.acos(-((-Math.pow(holdDistance, 2) + Math.pow(this.armLeft.sleeve.length-5, 2)
						 - Math.pow(this.armLeft.forearm.length-17, 2))/(2*(holdDistance)*(this.armLeft.forearm.length-17))));
		if (isNaN(shoulderRot))
			shoulderRot = 0;
		this.armRight.all.rotation = this.weapon.rotation + shoulderRot - 45;
		this.armRight.forearm.rotation	= -(180-elbowRot);
		
		holdPointArm = this.weapon.localToLocal(28, 16, this.armLeft.all);
		var holdPoint = this.weapon.localToLocal(28, 16, this);
		holdDistance = Utils.vectorLength(holdPointArm.x, holdPointArm.y);

		elbowRot = 57.2957795 * Math.acos(-((Math.pow(holdDistance, 2) - Math.pow(this.armLeft.sleeve.length-5, 2)
					 - Math.pow(this.armLeft.forearm.length-17, 2))/(2*(this.armLeft.sleeve.length-5)*(this.armLeft.forearm.length-17))));
		if (isNaN(elbowRot))
			elbowRot = 180;
		shoulderRot = 57.2957795 * Math.acos(-((-Math.pow(holdDistance, 2) + Math.pow(this.armLeft.sleeve.length-5, 2) - Math.pow(this.armLeft.forearm.length-17, 2))/(2*(holdDistance)*(this.armLeft.forearm.length-17))));
		var shoulderRotReg = 57.2957795 * Math.atan2(holdPoint.y - this.armLeft.all.y, holdPoint.x - this.armLeft.all.x);
		if (isNaN(shoulderRot))
			shoulderRot = 0;
		this.armLeft.all.rotation = shoulderRotReg-45 + shoulderRot;
		this.armLeft.forearm.rotation	= -(180-elbowRot);
		
	    this._globPoint = this.localToGlobal(this.armRight.all.x, this.armRight.all.y);
	    /*
		this.world.begPo = {
			x: this._globPoint.x,
			y: this._globPoint.y,
		};
		*/
		this.world.begEnd = {
			x: realX,
			y: y,
		};
		
		this._lineParam = Utils.calcLineParameters(this._globPoint.x, this._globPoint.y, realX, y);
		
		/*
		var tempA = globPoint.y - y;
		var tempB = globPoint.x - realX;
		this._lineParam = {
			A: tempA,
			B: tempB,
			C: (-y * tempB) + (-realX * tempA),
		};
		*/
	}
	
	p.shoot = function (currentTime) {
		if (this.weapon.shoot(currentTime))
			this.world.playerShoot(this._lineParam.A, this._lineParam.B, this._lineParam.C, this._globPoint, this.scaleX>0?1:-1);
	}
	
	window.Player = Player;
}());
