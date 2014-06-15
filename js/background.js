(function () {
	var Background = function(backgroundAssets) {
		this.initialize(backgroundAssets);
	}
	var p = Background.prototype = new createjs.Container();
	
	p.bgImage;
	p.floorTile;
	
	p.Container_initialize = p.initialize;
	p.initialize = function(backgroundAssets) {
		this.Container_initialize();
		this.bgImage = backgroundAssets.bgImage;
		this.realBgWidth = this.bgImage.image.width * Math.abs(this.bgImage.scaleX);
		this.bgImage2 = this.bgImage.clone();
		this.bgImage2.scaleX *= -1;
		//this.bgImage2.x -= this.realBgWidth;
		this.addChild(this.bgImage);
		this.addChild(this.bgImage2);
		this.bgSpeed = backgroundAssets.bgSpeed;
		this.groundLevel = backgroundAssets.groundLevel;
		this.sceneWidth = backgroundAssets.sceneWidth;
		var floorTile = backgroundAssets.floorTile;
		floorTile.x = 0;
		floorTile.y = this.groundLevel;
		var tiles = Math.ceil(this.sceneWidth/floorTile.image.width) + 1;
		this.floorTiles = [];
		this.floorTiles.push(floorTile);
		this.addChild(floorTile);
		this.lastTile = floorTile;
		for (var i = 1; i != tiles; ++i) {
			var newTile = floorTile.clone();
			newTile.x = this.lastTile.x + floorTile.image.width - 0.5;
			this.floorTiles.push(newTile);
			this.addChild(newTile);
			this.lastTile = newTile;
		}
	}
	
	p.move = function(x) {
		var tileToWarp = null;
		for (var i = 0; i != this.floorTiles.length; ++i) {
			var tile = this.floorTiles[i];
			tile.x += x;
			if (tile.x < 0 - tile.image.width) {
				tileToWarp = tile;
			}
		}
		if (tileToWarp) {
			tileToWarp.x = this.lastTile.x + tileToWarp.image.width - 0.5;
			this.lastTile = tileToWarp;
		}
		this.bgImage.x += x * this.bgSpeed;
		this.bgImage2.x += x * this.bgSpeed;
		if(this.bgImage.x + this.realBgWidth < 0)
			this.bgImage.x = this.bgImage2.x -1;
		if(this.bgImage2.x < 0)
			this.bgImage2.x = this.bgImage.x + (2 * this.realBgWidth -1);
	}
	
	window.Background = Background;
}());