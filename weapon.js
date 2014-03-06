(function () {
	var Weapon = function(weaponAssets) {
		this.initialize(weaponAssets);
	}
	var p = Weapon.prototype = new createjs.Container();
	
	p.weapon;
	p.muzzle;
	
	p.Container_initialize = p.initialize;
	p.initialize = function(weaponAssets) {
		this.Container_initialize();
		this.weapon = weaponAssets.weapon;
		this.muzzle = weaponAssets.muzzle;
		
		this._nextTimeShot = 0; // in milisec
		this.coolDownTime = weaponAssets.coolDown; // in milisec
		this.reloadTime = weaponAssets.reloadTime; // in milisec
		this.maxMagazineSize = weaponAssets.maxMagSize;
		this.ammo = weaponAssets.ammo;
		this.currentMagazineCount = this.ammo > this.maxMagazineSize ? this.maxMagazineSize : this.ammo;
		
		this.addChild(this.muzzle);
		this.addChild(this.weapon);
	}
	
	p.shoot = function(currentTime) {
		if (this._nextTimeShot < currentTime && this.currentMagazineCount) {
			this.muzzle.fire();
			this._lastTimeShot = currentTime;
			--this.ammo;
			--this.currentMagazineCount
			if (this.currentMagazineCount == 0) {
				this.reload()
				this._nextTimeShot = currentTime + this.reloadTime;
			} else {
				this._nextTimeShot = currentTime + this.coolDownTime;
			}
		}
	}
	
	p.reload = function() {
		if (this.ammo > 0) {
			this.currentMagazineCount = this.ammo > this.maxMagazineSize ? this.maxMagazineSize : this.ammo;
		}
	}
	
	window.Weapon = Weapon;
}());