/*jslint vars: true*/

/*global Phaser: false*/

// Stops the swinging back and forth, and slows the creatures
// down a little bit more than just the standard Phaser drag.
Phaser.Sprite.prototype.applyExtraDrag = function () {
  
  "use strict";
  
  var decelerationPercent = 5;
  
  var decelerationMultiplier = (1 - (decelerationPercent / 100));
  
  this.body.velocity.x *= decelerationMultiplier;
  this.body.velocity.y *= decelerationMultiplier;
  
};



Phaser.Sprite.prototype.applyExtraAngularDrag = function () {
 
  "use strict";
  
  var decelerationPercent = 10;
  
  var decelerationMultiplier = (1 - (decelerationPercent / 100));
  
  this.body.angularVelocity *= decelerationMultiplier;
  
};



Phaser.Sprite.prototype.rotateTowards = function (game, relation, target) {
 
  "use strict";
  
  var deltaMouseRad = this.rotation;
  var semicircle = Math.PI; // π radians is a semicircle!

  // Based off http://jsfiddle.net/wvaJ3/1/

  // TODO: Figure out what causes the crazy wiggling away
  // from pointer sometimes when pointer is almost exactly behind.

  // TODO: Make this work with any variable, not just
  // pointer - e.g. turning enemy x/y to player x/y.

  // The difference between the rotation of the sprite
  // and the pointer location / target, in radians.
  if (target === "pointer") {
    deltaMouseRad -= game.physics.arcade.angleToPointer(this);
  } else {
    // Better hope the target is a sprite! TODO: Handle errors.
    deltaMouseRad -= this.game.math.angleBetween(this.x, this.y, target.x, target.y);
  }

  // This fixes "weird" deltaMouseRad values that get spat out
  // sometimes. These weird values are abnormally high (~5rad ~340deg)
  // and are converted to their "opposite", e.g. 340eg -> -20deg.
  if (deltaMouseRad > (semicircle)) {
    deltaMouseRad -= semicircle * 2;
  } else if (deltaMouseRad < -(semicircle)) {
    deltaMouseRad += semicircle * 2;
  }

  // Point away rather than to the target:
  if (relation === "away") {
    if (deltaMouseRad > 0) {
      deltaMouseRad -= semicircle;
    } else {
      deltaMouseRad += semicircle;
    }
  }

  // Make the sprite turn around:
  this.body.angularVelocity = -this.body.maxAngular * deltaMouseRad;

};



Phaser.Sprite.prototype.applySpeedLimit = function () {
  
  "use strict";
  
  // Super fun diagonal-shouldn't-be-faster-than-X/Y movement:
  // TODO: Improve performance (parsing floats to ints?)
 
  if (this.body.velocity.x !== 0 || this.body.velocity.y !== 0) {
    
    // a^2 + b^2 = c^2. TODO: Test if Math.pow() is actually slower
    var pyth = ((this.body.velocity.x * this.body.velocity.x) +
               (this.body.velocity.y * this.body.velocity.y));
    
    //var magnitude = (pyth > 0 ? Math.sqrt(pyth) : -Math.sqrt(pyth));
    var magnitude = Math.sqrt(pyth);
    
    if (magnitude > this.body.maxVelocity.x) {
      var multiplier = (this.body.maxVelocity.x / magnitude); // x = y
      this.body.velocity.x *= multiplier;
      this.body.velocity.y *= multiplier;
    }
    
  }
  
};



Phaser.Sprite.prototype.move = function (game, accelerate, relation, target) {
  
  "use strict";
  
  var acceleration = 1400;
  
  // Reset sprite's acceleration (left over from previous changes?):
  this.body.acceleration.set(0);
  
  if (game && relation && target) {
    this.rotateTowards(game, relation, target);
  }
  
  if (accelerate) {
    game.physics.arcade.accelerationFromRotation(
      this.rotation,         // In the direction the sprite's facing.
      acceleration,          // This amount of acceleration.
      this.body.acceleration // Applied to the sprite's acceleration.
    );
  }
  
  this.applySpeedLimit();
  this.applyExtraDrag();
  this.applyExtraAngularDrag();
  
};
