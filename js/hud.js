(function () {
    var Hud = function(hudAssets) {
		this.initialize(hudAssets);
	}
	var p = Hud.prototype = new createjs.Container();
	
	p.bgImage = null;
	p.floorTile = null;
	
	p.Container_initialize = p.initialize;
	p.initialize = function(hudAssets) {
		this.Container_initialize();
		this.background = new createjs.Shape();
		this.background.graphics.beginLinearGradientFill(["#e9967a", "#ff7f50"], [0,1], 0, 0, 0, 40).drawRoundRect(0,0,250,40,10);
		this.addChild(this.background);
		
		this.headImage = hudAssets.headImage;
		this.headImage.scaleX = 1.3;
		this.headImage.scaleY = 1.3;
        this.headImage.rotation = -20;
		this.headImage.x = 10;
		this.headImage.y = 45;
		this.addChild(this.headImage);
		
		this.ammoText = new createjs.Text("0/0", "18px Arial", "#ffffff");
		this.ammoText.x = 80;
		this.ammoText.y = 20;
		this.ammoText.textBaseline = "middle";
		this.ammoText.textAlign = "center";	
		this.addChild(this.ammoText);
		
		this.scoreText = new createjs.Text("Score: 0", "18px Arial", "#ffffff");
		this.scoreText.x = 180;
		this.scoreText.y = 20;
		this.scoreText.textBaseline = "middle";
		this.scoreText.textAlign = "center";	
		this.addChild(this.scoreText);
	}
	
	p.setAmmo = function(mag, all) {
	    this.ammoText.text = "" + mag + "/" + all;
	}
	
	p.setScore = function(score) {
	    this.scoreText.text = "Score: " + score;
	}
	
	window.Hud = Hud;
}());
