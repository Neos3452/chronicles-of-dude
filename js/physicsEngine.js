(function () {

function PhysicsEngine(gravityForce = -10.0, worldScale = 1.0) {
	this.gravity = gravityForce;
	this.worldScale = 1.0;
	this.gravityDirection = {
		x:  0.0,
		y: -1.0
	};
}

PhysicsEngine.BoundsType = {
	circle 		: 	"circle",
	rectangle 	: 	"rectangle",
	line		:	"line",
}

if (Object.freeze)
	Object.freeze(PhysicsEngine.BoundsType);

var p = PhysicsEngine.prototype;

p.createPhysicsProperties(object)
{
	if (object._hasPhysicsProperties)
		return;
	if (typeof object.weight === 'undefined')
		object.weight = 1.0;
	if (typeof object.boundsType === 'undefined')
		object.boundsType = BoundsType.rectangle;
		
	if (typeof object.linearSpeed === 'undefined')
		object.linearSpeed = 0.0;
	if (typeof object.linearDamping === 'undefined')
		object.linearDamping = 0.2;
		
	if (typeof object.angularSpeed === 'undefined')
		object.angularSpeed = 0.0;
	if (typeof object.angularDamping === 'undefined')
		object.angularDamping = 0.1;
		
	if (typeof object.applyGravity === 'undefined')
		object.applyGravity = false;
		
	if (typeof object.x === 'undefined')
		object.x = 0.0;
	if (typeof object.y === 'undefined')
		object.y = 0.0;
		
	if (typeof object.direction === 'undefined')
		object.direction = {
			x: 1.0,
			y: 1.0
		};	
		
	switch (object.boundsType) {
		case this.BoundsType.line:
			if (typeof object.boundsLength === 'undefined') {
				if (typeof object.width !== 'undefined')
					object.boundsLength = object.width;
				else if (typeof object.height !== 'undefined')
					object.boundsLength = object.height;
				else
					object.boundsLength = 1.0;
			}
		case this.BoundsType.circle:
			if (typeof object.boundsRadius === 'undefined') {
				if (typeof object.width !== 'undefined')
					object.boundsRadius = object.width;
				else if (typeof object.height !== 'undefined')
					object.boundsRadius = object.height;
				else
					object.boundsRadius = 1.0;
			}
		default: // case this.BoundsType.rectangle: OR unknown type
			if (typeof object.boundsWidth === 'undefined') {
				if (typeof object.width !== 'undefined')
					object.boundsWidth = object.width;
				else if (typeof object.height !== 'undefined')
					object.boundsWidth = object.height;
				else
					object.boundsWidth = 1.0;
			}
			if (typeof object.boundsHeight === 'undefined') {
				if (typeof object.height !== 'undefined')
					object.boundsHeight = object.height;
				else if (typeof object.width !== 'undefined')
					object.boundsHeight = object.width;
				else
					object.boundsHeight = 1.0;
			}
			object.boundsType = BoundsType.rectangle;
	}
	object._hasPhysicsProperties = true;	
}

void applyForce(timeDelta, object, direction, force)
{
	
}

void applyGravity(timeDelta, object)
{

}

void calcVelocity(timeDelta, object)
{

}

void calcPosition(timeDelta, object)
{
	
}

window.PhysicsEngine = PhysicsEngine;

} () );