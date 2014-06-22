var stage;
var canvas;
var gamepadText;
var player;
var ground;
var scale = (112 + 56) / 1.8;
var gravity = 8;
var right = false, left = false, up = false, mouse = false;
var mouseLocation;
var enemyCounter = 0;
var enemies = [];
var respawnInterval = 2500;

var loadQueue;
var playerGamepad = undefined;

var gameRunning = true;
var gamepadPopupShown = false;

function init() {
    this.loadQueue = new createjs.LoadQueue(false);
    this.loadQueue.on("complete", loadingComplete, this);
    this.loadQueue.loadManifest([
        {id:"torso",    	src:"res/torso_sprite_6.png"},
        {id:"head",     	src:"res/head.png"},
        {id:"sleeve",   	src:"res/sleeve.png"},
        {id:"forearm",  	src:"res/arm.png"},
        {id:"weapon",		src:"res/weapon.png"},
        {id:"muzzle",		src:"res/muzzle.png"},
        {id:"monsters",		src:"res/monsters.gif"},
        {id:"background",	src:"res/cavestagebackground.png"},
        {id:"ground",		src:"res/groundTile.png"},
    ]);
    this.loadQueue.load();
}

function loadingComplete() {
    console.log("loading complete!");
    this.canvas = document.getElementById("demoCanvas");
    //this.canvas.getContext("2d").translate(0.5, 0.5);
    this.mouseLocation = {
        x: canvas.width,
        y: canvas.height/2
    };
    this.gamepadText = document.getElementById("noGamepad");
    window.addEventListener('keydown', dokeydown, true);
    window.addEventListener('keyup', dokeyup, true);
    window.addEventListener('webkitgamepadconnected',
                      onGamepadConnect);
    window.addEventListener('webkitgamepaddisconnected',
                      onGamepadDisconnect);

    this.stage = new createjs.Stage("demoCanvas");

    var bgImage = new createjs.Bitmap(loadQueue.getResult("background"));
    bgImage.y = -400;
    bgImage.scaleX = 2.0;
    bgImage.scaleY = 2.0;
    var groundTile = new createjs.Bitmap(loadQueue.getResult("ground"));
    this.background = new Background({
        bgImage:		bgImage,
        floorTile:		groundTile,
        groundLevel: 	this.canvas.height - 20,
        sceneWidth:		this.canvas.width,
        bgSpeed:		0.3,
    });
    this.stage.addChild(this.background);

    ground = this.canvas.height - 20;
    //var groundRect = new createjs.Shape();
    //groundRect.graphics.beginFill("brown").drawRect(0, ground, this.canvas.width, 20);
    //this.stage.addChild(groundRect);

    var playerTorso = new createjs.SpriteSheet({
        images: [loadQueue.getResult("torso")],
        frames: {width: 103, height: 112, regX:45, regY:110},
        animations: {    
            run: {
             frames:[2, 3, 2, 4, 5, 4],
             next: "run",
             speed: 0.35
             },
            backward_run: {
             frames:[4, 5, 4, 2, 3, 2],
             next: "backward_run",
             speed: 0.35
             },
            step: 1,
            stand: 0,
            jump: 3,
            hit: 1,
        }
    });
    this.runAnimation = playerTorso.getAnimation("run");
    var playerHead = new createjs.Bitmap(loadQueue.getResult("head"));
    playerHead.x = 0;
    playerHead.y = -106;
    playerHead.regX = 15;
    playerHead.regY = playerHead.image.height - 4;
    playerHead.eyesX = playerHead.regX;
    playerHead.eyesY = -playerHead.image.height/2;
    var sprite = new createjs.Sprite(playerTorso, "run");

    var forearm = new createjs.Bitmap(loadQueue.getResult("forearm"));
    forearm.regX = 5;
    forearm.regY = 5;
    forearm.length = Utils.vectorLength(forearm.image.width - forearm.regX, forearm.image.height - forearm.regY);
    forearm.x = 16;
    forearm.y = 15;
    var sleeve = new createjs.Bitmap(loadQueue.getResult("sleeve"));
    sleeve.regX = 5;
    sleeve.regY = 5;
    sleeve.length = Utils.vectorLength(sleeve.image.width - sleeve.regX, sleeve.image.height - sleeve.regY);
    var armLeft = new createjs.Container();
    armLeft.addChild(forearm, sleeve);
    armLeft.x = 22;
    armLeft.y = -100;
    armLeft.length = forearm.length + sleeve.length;

    armRight = armLeft.clone(true);
    armRight.x = -22;
    armRight.y = -100;
    armRight.length = forearm.length + sleeve.length;

    var weaponImage = new createjs.Bitmap(loadQueue.getResult("weapon"));
    var weaponMuzzle = new createjs.Bitmap(loadQueue.getResult("muzzle"));

    var weaponMuzzleSprite = new createjs.SpriteSheet({
        images: [loadQueue.getResult("muzzle")],
        frames: {width: 75, height: 40, regX:10, regY:21},
        animations: {
            fire: 0
        }
    });
    var weaponMuzzle = new createjs.Sprite(weaponMuzzleSprite, "fire");
    weaponMuzzle.visible = false;
    weaponMuzzle.scaleX = -0.6;
    weaponMuzzle.scaleY =  0.6;
    weaponMuzzle.x = 0;
    weaponMuzzle.y = 15;
    weaponMuzzle.fire = function() {
        this.alpha = 1.0;
        this.visible = true;
        this.gotoAndStop("fire");
        createjs.Tween.get(this, {useTicks:true}).to({alpha:0, visible:false}, 2, createjs.Ease.circIn());
    }
    var weapon = new Weapon({
        weapon: weaponImage,
        muzzle: weaponMuzzle,
        coolDown: 100,
        reloadTime: 1500,
        maxMagSize: 30,
        ammo: 210
    });
    //weapon.addChild(weaponImage, weaponMuzzle);
    weapon.regX = 38;
    weapon.regY = 16;
    weapon.scaleY = 1.4;
    weapon.scaleX = -1.6;
    weapon.buttLength = 1.6* (weapon.weapon.image.width - weapon.regX);
    //weapon.muzzle = weaponMuzzle;
    //weapon.muzzle.visible = false;
    //this.player.weapon = weapon;

    this.player = new Player({
        torso: 		sprite,
        head: 		playerHead,
        weapon: 	weapon,
        armLeft: 	armLeft,
        armRight: 	armRight,
        world:		this,
    });
    this.player.x = 200;
    this.player.y = 0;
    this.player.velocityX = 2.5;
    this.player.velocityY = 0.0;
    this.player.jumpVelocity = 4.0;
    this.player.midAir = false;
    this.player.way = 0;
    this.player.eyesY = playerHead.eyesY;
    this.player.height = 112;

//				this.player.stand();

    this.stage.addChild(this.player);

    this.player.lookAt(0,0);

    var monsterSheet = new createjs.SpriteSheet({
        images: [loadQueue.getResult("monsters")],
        frames: [
            [0,0,16,15],
            [19,0,16,15],
            [38,0,16,15],
            [57,0,16,15],
            [76,0,16,15],
            [95,0,16,15],
            [0,40,16,15],
            [19,40,16,15],
            [38,40,16,15],
            [57,40,16,15],
            [76,40,16,15],
        ],
        animations: {
            run: {
                frames: [10],
                next: "stand",
            },
            stand: {
                frames: [1,0,10],
                next: "stand",
                speed: 0.2,
            },
            hit: {
                frames: [9],
            },
            dead: {
                frames: [9, 10],
                next: false,
                speed: 0.2,
            },
        },
    });
    var monsterSprite = new createjs.Sprite(monsterSheet, "stand");
    monsterSprite.scaleX = -2;
    monsterSprite.scaleY = 2;
    monsterSprite.regX = 8;
    monsterSprite.regY = 7.5;
    this.source_bat = new Monster({
        sprite:			monsterSprite,
        approachDist:	40,
        keepDist:		0,
        travelSpeed:	1.3,
        health:			2,
        hitBoxDiameter:	12,
        world:			this,
    });

    this.hud = new Hud({
        headImage: playerHead.clone(),
    })
    this.hud.x = 50;
    this.hud.y = this.canvas.height - 50;
    this.stage.addChild(this.hud);
    this.hud.setAmmo(this.player.weapon.currentMagazineCount, this.player.weapon.ammo);

    /*
    this.test = new createjs.Shape();
    this.test.graphics.beginFill("red").drawRect(0, 0, 2, 2);
    this.stage.addChild(this.test);
    this.begPo = {
        x:0,
        y:0,
    };

    this.test2 = new createjs.Shape();
    this.test2.graphics.beginFill("orange").drawRect(0, 0, 2, 2);
    this.stage.addChild(this.test2);
    */

    createjs.Ticker.addEventListener("tick", dotick);
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.setFPS(30);
    this.lastInterval = createjs.Ticker.getTime(true);
    this.lastTime = createjs.Ticker.getTime(true);
    this.stage.on("stagemousemove", mouseMoved);
    this.stage.on("stagemousedown", mouseDown);
    this.stage.on("stagemouseup", mouseUp);
    pause();
    showGamepadMissing();
    this.stage.update();
}

function createNewEnemy() {
    var newEnemy = this.source_bat.naive_clone();
    newEnemy.x = 0;
    newEnemy.y = 0;
    newEnemy.velocityX = 0;
    newEnemy.velocityY = 0;
    newEnemy.stand();
    return newEnemy;
}

function getPlayerPosition() {
    return { 
        stand: {x: player.x, y: player.y },
        torso: null,
        head: {
            x: this.player.x + this.player.head.x + this.player.head.eyesX,
            y: this.player.y + this.player.head.y + this.player.head.eyesY
        },
        weapon: null,
    };
}

function dotick(event) {
    if (!this.gameRunning)
        return;
    if (!createjs.Ticker.getPaused()) {
        handleInput();
        var sec = event.delta/1000;
        if (player.y < ground) {
            player.velocityY += gravity * sec;
            player.midAir = true;
        } else {
            player.midAir = false;
        }

        if (player.velocityY > 0.00001 || player.velocityY < -0.00001) {
            player.y += scale * player.velocityY * sec;
            if (player.y > ground) {
                player.y = ground;
                player.velocityY = 0;
            }
            if (!player.isJumping())
                player.jump();
        }
        /*
        player.way = 0;
        if(right)
            player.way += 1;
        if(left)
            player.way -= 1;
        */
        dx = scale * player.velocityX * player.way * sec;
        //player.x += scale * player.velocityX * player.way * sec;
        if (player.x > 7 * canvas.width / 8 && dx > 0.0) {
            this.background.move(-dx);
            for (var i = 0; i < enemies.length; ++i)
                enemies[i].x -= dx;
        } else if (player.x > 70 || dx > 0.0)
            player.x += dx;

        if (!player.midAir) {
            if (!player.isRunning()) {
                if (player.way != 0)
                    player.run();
            }
            if (player.way == 0 && !player.isStanding()) {
                player.stand();
            }
        }

        var respawn = false;
        if (createjs.Ticker.getTime(true) - this.lastInterval > respawnInterval) {
            respawn = true;
            this.lastInterval = createjs.Ticker.getTime(true);
        }
        if (createjs.Ticker.getTime(true) - this.lastTime > 5000 && respawnInterval > 300) {
            respawnInterval -= 100;
            this.lastTime = createjs.Ticker.getTime(true);
            console.log("speed up");
        }
        var aliveCnt = 0;
        for (var i = 0; i < enemies.length; ++i) {
            var curEnemy = enemies[i];
            //console.log(curEnemy);
            if (!curEnemy.parent) {
                //console.log("no parent " + i);
                if (respawn) {
                    //console.log("respawn");
                    this.stage.addChild(curEnemy);
                    if (Math.random() < 0.5)
                        curEnemy.x = -10;
                    else
                        curEnemy.x = this.canvas.width + 10;
                    curEnemy.y = Math.random() * this.canvas.height/2 + 25;
                    curEnemy.velocityX = 0;
                    curEnemy.velocityY = 0;
                    curEnemy.stand();
                    respawn = false;
                } else {
                    continue;
                }
            }
            if (curEnemy.isDead()) {
                curEnemy.velocityY += gravity * sec;
                curEnemy.y += scale * curEnemy.velocityY * sec;
                if (curEnemy.y > this.canvas.height) {
                    this.stage.removeChild(curEnemy);
                }
                continue;
            }
            curEnemy.calcAI();
            if (curEnemy.velocityX != 0) {
                curEnemy.x += scale * curEnemy.velocityX * sec;
                curEnemy.y += scale * curEnemy.velocityY * sec;
            }
            aliveCnt++;
        }
        if (respawn) {
            console.log("spawn");
            var newEnemy = this.createNewEnemy();
            enemies.push(newEnemy);
            if (Math.random() < 0.5)
                newEnemy.x = -10;
            else
                newEnemy.x = this.canvas.width + 10;
            newEnemy.y = Math.random() * this.canvas.height/2 + 25;
            this.stage.addChild(newEnemy);
            aliveCnt++;
            respawn = false;
        }
        if (aliveCnt > 15)
            this.gameLost();
        /*
        if (!enemy.removed) {
            if (enemy.isDead()) {
                enemy.velocityY += gravity * sec;
                enemy.y += scale * enemy.velocityY * sec;
                if (enemy.y > this.canvas.height) {
                    this.stage.removeChild(enemy);
                    enemy.removed = true;
                }
            } else {
                enemy.calcAI();
                if (enemy.velocityX != 0) {
                    enemy.x += scale * enemy.velocityX * sec;
                }
            }
        }
        */

        /*
            this.test.x = this.begPo.x;
            this.test.y = this.begPo.y;
            this.test2.x = this.begEnd.x;
            this.test2.y = this.begEnd.y;
            */
        this.stage.update();
    }
}

function gameLost() {
    console.log("Lost...");
    this.gameRunning = false;
    var endPopup = new createjs.Container();
    var background = new createjs.Shape();
    background.graphics.beginLinearGradientFill(["#e9967a", "#ff7f50"], [0,1], 0, -100, 0, 100).drawRoundRect(-200,-50,400,100,25);
    endPopup.addChild(background);

    var endString = "Game Over\nYour score is " + this.enemyCounter;
    var text = new createjs.Text(endString, "22px Arial", "#ffffff");
    text.x = 0;
    text.y = - text.getMeasuredHeight()/2;
    text.textAlign = "center";

    endPopup.x = this.canvas.width/2;
    endPopup.y = this.canvas.height/2;
    endPopup.addChild(text);
    this.stage.addChild(endPopup);
    this.stage.update();
}

function handleInput() {
    var jump = up, speed = 0.0, lookX = mouseLocation.x, lookY = mouseLocation.y, shoot = mouse;
    if (left) speed += -1.0;
    if (right) speed += 1.0;
    up = false;
    if(playerGamepad) {
        speed = playerGamepad.axes[0];
        jump = (playerGamepad.buttons[0] > 0.5);
        var lookup = playerGamepad.axes[1];
        runAnimation.speed = 0.3 * Math.abs(speed) + 0.10;
        lookX = player.x + player.scaleX * 100  + 1000 * speed;
        lookY = player.y - player.height + 1000 * lookup;

        mouse = playerGamepad.buttons[1] > 0.5;
    }
    player.way = speed;
    player.lookAt(lookX, lookY);
    if (jump && !player.midAir) {
        player.velocityY = -4.0;
    }
    if (mouse)
        player.shoot(createjs.Ticker.getTime());
}

function playerShoot(A, B, C, shootPoint, way) {
/*
    var t = new createjs.Shape();
    t.graphics.beginFill("red").drawRect(0, 0, 2, 2);
    t.y = 70;
    t.x = (B*t.y + C) / -A;
    this.stage.addChild(t);
*/	

    //console.log(t.x +"," + t.y);
    for (var i = 0; i < enemies.length; ++i) {
        var curEnemy = enemies[i];
        if (curEnemy.checkColision(A, B, C, shootPoint, way)) {
            //console.log("enemy " + i + " is hit");
            curEnemy.dead();
            this.enemyCounter++;
        }
    }
    this.hud.setAmmo(this.player.weapon.currentMagazineCount, this.player.weapon.ammo);
    this.hud.setScore(this.enemyCounter);
}

function dokeydown(event) {
    if (event.keyCode == 37) {
        left = true;
    } else if (event.keyCode == 39) {
        right = true;
    } else if (event.keyCode == 38) {
        up = true;
    }
    return false;
}

function dokeyup(event) {
    if (event.keyCode == 37) {
        left = false;
    } else if (event.keyCode == 39) {
        right = false;
    } else if (event.keyCode == 67 && this.gamepadPopupShown) {
        resume();
        hideGamepadMissing();
    }
    return false;
}

function mouseMoved(event) {
    mouseLocation.x = event.stageX;
    mouseLocation.y = event.stageY;
}

function mouseDown(event) {
    mouse = true;
}

function mouseUp(event) {
    mouse = false;
}

function pause() {
    createjs.Ticker.setPaused(true);
}

function resume() {
    createjs.Ticker.setPaused(false)
}

function showGamepadMissing() {
    if (!this.gamepadPopup) {
        this.gamepadPopup = new createjs.Container();
        var background = new createjs.Shape();
        background.graphics.beginLinearGradientFill(["#e9967a", "#ff7f50"], [0,1], 0, -100, 0, 100).drawRoundRect(-200,-50,400,100,25);
        this.gamepadPopup.addChild(background);

        var text = new createjs.Text("No gamepad connected\nPress \'c\' to use keyboard.", "22px Arial", "#ffffff");
        text.x = 0;
        text.y = - text.getMeasuredHeight()/2;
        text.textAlign = "center";

        this.gamepadPopup.x = this.canvas.width/2;
        this.gamepadPopup.y = this.canvas.height/2;
        this.gamepadPopup.addChild(text);
    }
    this.gamepadPopupShown = true;
    this.stage.addChild(this.gamepadPopup);
}

function hideGamepadMissing() {
    this.gamepadPopupShown = false;
    this.stage.removeChild(this.gamepadPopup);
}

function onGamepadConnect(event) {
    if (event.gamepad.index === 0) {
        playerGamepad = event.gamepad;
        resume();
        hideGamepadMissing();
        //gamepadText.style.visibility = "hidden";
        //canvas.style.visibility = "visible";
    }
}

function onGamepadDisconnect(event) {
    if (event.gamepad.index === 0) {
        playerGamepad = undefined;
        pause();
        showGamepadMissing();
        //gamepadText.style.visibility = "visible";
        //canvas.style.visibility = "hidden";
    }
}