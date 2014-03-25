(function () {
	var Monster = function(monsterAssets) {
		this.initialize(monsterAssets);
	}
	var p = Monster.prototype = new createjs.Container();
	
	p.Container_initialize = p.initialize;
	p.initialize = function(monsterAssets) {
		this.Container_initialize();
		this.sprite = monsterAssets.sprite;
		this.approachDist = monsterAssets.approachDist;
		this.keepDist = monsterAssets.keepDist;
		this.travelSpeed = monsterAssets.travelSpeed;
		this.health = monsterAssets.health;
		this.world = monsterAssets.world;
		this.hitBoxDiameter = monsterAssets.hitBoxDiameter;
		this.addChild(this.sprite);
	}
 
 	p.run = function() {
		this.sprite.gotoAndPlay("run");
	}
	
	p.isRunning = function() {
		return this.sprite.currentAnimation === "run";
	}
	
	p.backwardRun = function() {
		this.sprite.gotoAndPlay("backward_run");
	}
	
	p.isBackwardsRunning = function() {
		return this.sprite.currentAnimation === "backward_run";
	}
	
	p.stand = function() {
		this.sprite.gotoAndPlay("stand");
	}
	
	p.isStanding = function() {
		return this.sprite.currentAnimation === "stand";
	}
	
	p.jump = function() {
		this.sprite.gotoAndPlay("jump");
	}
	
	p.isJumping = function() {
		return this.sprite.currentAnimation === "jump";
	}
	
	p.attack = function() {
		this.sprite.gotoAndPlay("attack");
	}
	
	p.isAttacking = function() {
		return this.sprite.currentAnimation === "attack";
	}
	
	p.hit = function() {
		this.sprite.gotoAndPlay("hit");
	}
	
	p.isBeingHit = function() {
		return this.sprite.currentAnimation === "hit";
	}
	
	p.dead = function() {
		this.sprite.gotoAndPlay("dead");
	}
	
	p.isDead = function() {
		return this.sprite.currentAnimation === "dead";
	}
	
	p.calcAI = function() {
		var playerPos = this.world.getPlayerPosition();
		//console.log(this.x +","+ this.y);
		this.lookAt(playerPos.x, playerPos.y);
		var distance = Utils.vectorLength(this.x - playerPos.x, 0);
		var direction = this.x > playerPos.x ? -1 : 1;
		//this.run();
		if (distance < this.keepDist) {
			this.velocityX = -1 * direction * this.travelSpeed;
		} else if (distance > this.approachDist) {
			this.velocityX = direction * this.travelSpeed;
		} else {
			this.velocityX = 0;
		}
		//console.log(distance+"("+this.keepDist+","+this.approachDist+")" + " " +this.velocityX);
	}
	
	p.lookAt = function(x, y) {
		if (x < this.x) {
			x += 2*(this.x - x);
			if (this.scaleX > 0) this.scaleX *= -1;
		} else {
			if (this.scaleX < 0) this.scaleX *= -1;
		}
	}
	
	p.checkColision = function(A, B, C, shootPoint, way) {
	/*
		console.log(Math.abs(A * (this.x + this.regX) + B * (this.y + this.regY) + C) 
							/ Math.sqrt(A*A + B*B));
							*/
		if (this.hitBoxDiameter > Utils.distanceFromLine(this.x, this.y, A, B, C)) {
		    //console.log(this.x + "," +this.y);
			var l = Utils.perpendicularLine(A, B, C, this.x, this.y);
			//console.log(A/-B + " " + C/-B);
			//console.log(l.A + " " + l.B + " " + l.C);
			//var val = Utils.calcYfromLine(l.A, l.B, l.C, this.x);
			//console.log(val + " " + shootPoint.y + " " +way);
			//console.log(way ? shootPoint.y < val : shootPoint.y > val);
			var point = Utils.linesIntersection(A, B, C, l.A, l.B, l.C);
			//this.world.begPo = point;
			//console.log(point.x + "," + point.y + " | " + shootPoint.x);
			return way == 1 ? point.x > shootPoint.x : point.x < shootPoint.x;
		}
		return false;
		
	}
	
	window.Monster = Monster;
	
	/*
	var FlyingMonster = function(monsterAssets) {
		this.initialize(monsterAssets);
	}
	var p = FlyingMonster.prototype = new Monster();
	
	p.Container_initialize = p.initialize;
	p.initialize = function(monsterAssets) {
		this.Container_initialize();
		this.sprite = monsterAssets.sprite;
		this.approachDist = monsterAssets.approachDist;
		this.keepDist = monsterAssets.keepDist;
		this.travelSpeed = monsterAssets.travelSpeed;
		this.health = monsterAssets.health;
		this.world = monsterAssets.world;
	}
	*/
	
}());
