/*jslint vars: true, white: true, plusplus: true*/

/*global Organism, angleBetween, rotationTo*/



Organism.prototype.applyDrag = function (updateAmount) {
  
  "use strict";
  
  var decelerationPercent = 1.1 * updateAmount;
  
  var decelerationMultiplier = (1 - (decelerationPercent / 100));
  
  this.velocity.x *= (decelerationMultiplier);
  this.velocity.y *= (decelerationMultiplier);
  
  // If the organism is nearly not moving, make it not moving.
  if (Math.abs(this.velocity.x) < 0.01) {
    this.velocity.x = 0;
  }
  if (Math.abs(this.velocity.y) < 0.01) {
    this.velocity.y = 0;
  }
  
};



Organism.prototype.applyAngularDrag = function (updateAmount) {
 
  "use strict";
  
  var decelerationPercent = 9 * updateAmount;
  
  var decelerationMultiplier = (1 - (decelerationPercent / 100));
  
  this.angularVelocity *= (decelerationMultiplier);
  
  if (Math.abs(this.angularVelocity) < 0.01) {
    this.angularVelocity = 0;
  }
  
};



// There is a silly amount of duplicate code here still
Organism.prototype.rotate = function (deg, everything) {
  
  "use strict";
  
  this.rotation += deg;
  
  if (this.rotation > 180) {
    this.rotation -= 360;
  }
  
  if (this.rotation < -180) {
    this.rotation += 360;
  }
  
  var i, j, body, speedLine, v, hp, mouth, newX, newY, randomRotation = 0;
  
  for (i = 0; i < this.body.length; i++) {
    body = this.body[i];
    if (body.rotating) {
      // Add a bit of variance to the body rotation:
      randomRotation = (body.rotating / 4) + (Math.random() * (body.rotating / 2));
    }
    for (j = 0; j < body.vertices.length; j++) {
      rotate(body.vertices[j], deg + randomRotation);
    }
  }
  
  // If the thing doesn't have a tail
  if (this.tail === undefined || everything) {
    for (i = 0; i < this.hpPoints.length; i++) {
      rotate(this.hpPoints[i], deg);
    }
  }
  /*
  if (this.tail || everything) {
    for (i = 0; i < this.hpPoints.length; i++) {
      rotate(this.hpPoints[i], deg);
    }   
  }
  */
  for (i = 0; i < this.mouth.length; i++) {
    mouth = this.mouth[i];
    mouth.x = 0;
    mouth.y = 0;
    for (j = 0; j < mouth.vertices.length; j++) {
      rotate(mouth.vertices[j], deg);
      mouth.x += mouth.vertices[j].x;
      mouth.y += mouth.vertices[j].y;
    }
    mouth.x /= mouth.vertices.length;
    mouth.y /= mouth.vertices.length;
  }
  
  // TODO: Tidy this for loop.
  for (i = 0; (this.speedLines) &&
              (i < this.speedLines.length); i++) {
    speedLine = this.speedLines[i];
    speedLine.x = 0;
    speedLine.y = 0;
    for (j = 0; j < speedLine.length; j++) {
      rotate(speedLine[j], deg);
      speedLine.x += speedLine[j].x;
      speedLine.y += speedLine[j].y;
    }
    speedLine.x /= speedLine.length;
    speedLine.y /= speedLine.length;
  }
  
};



Organism.prototype.rotateToFace = function (relation, target, extraRotation) {
 
  "use strict";
  
  var deltaRad = rotationTo(this, target);
  
  // Point away rather than to the target?
  if (relation === "away") {
    if (deltaRad > 0) {
      deltaRad -= Math.PI;
    } else {
      deltaRad += Math.PI;
    }
  }
  
  if (extraRotation) {
    deltaRad += toRadians(extraRotation);
  }
  
  // Make the sprite turn around:
  this.angularVelocity = -this.maxAngular * deltaRad;
  
};



Organism.prototype.applySpeedLimit = function () {
  
  "use strict";
  
  // Super fun diagonal-shouldn't-be-faster-than-X/Y movement:
  // TODO: Improve performance (parsing floats to ints?)
 
  if (this.velocity.x !== 0 || this.velocity.y !== 0) {
    
    // a^2 + b^2 = c^2. TODO: Test if Math.pow() is actually slower
    var pyth = (this.velocity.x * this.velocity.x) +
               (this.velocity.y * this.velocity.y);
    
    this.speed = Math.sqrt(pyth);
    
    if (this.speed > this.maxVelocity) {
      var multiplier = (this.maxVelocity / this.speed);
      this.velocity.x *= multiplier;
      this.velocity.y *= multiplier;
    }
    
  }
  
};



Organism.prototype.accelerate = function (updateAmount) {
  
  "use strict";
  
  // The speed of acceleration. I.e. how fast does it 0-60mph? Should be between 0 and 1.
  var accelerationAmount = 0.1;
  
  var rad = (this.rotation-90) * Math.PI / 180;
  
  this.acceleration.x += accelerationAmount * updateAmount * Math.cos(rad);
  this.acceleration.y += accelerationAmount * updateAmount * Math.sin(rad);
  
};



Organism.prototype.move = function (updateAmount) {
  
  "use strict";
  
  //console.log(deltaTime);
  
  /* Moving slowly after eating is temporarily disabled!
  // If the creature at recently, it can only move slowly!
  if (this.lastAte && game.time.elapsedSecondsSince(this.lastAte) < 2) {
    acceleration = 120;
  } else {
    acceleration = 1400;
  }
  */
  
  /*
  if (relation && target) {
    this.rotateTowards(relation, target);
  }
  */
  
  if (this.angularVelocity > this.maxAngular) {
    this.angularVelocity = this.maxAngular;
  }
  if (this.angularVelocity < -this.maxAngular) {
    this.angularVelocity = -this.maxAngular;
  }
  
  this.applyAngularDrag(updateAmount);
  
  //console.log("this.angularVelocity " + this.angularVelocity);
  
  //this.angularVelocity += this.angularAcceleration;
  if (this.angularVelocity !== 0) {
    this.rotate(this.angularVelocity * updateAmount);
  }
  
  
  this.velocity.x += this.acceleration.x;
  this.velocity.y += this.acceleration.y;
  
  this.applySpeedLimit();
  
  this.x += (this.velocity.x * updateAmount);
  this.y += (this.velocity.y * updateAmount);
  
  this.applyDrag(updateAmount);
  
  
  // Snakey stuff:
  
  var rotationFromBodyToHp = 0,
      rotationFromHpToBody = 0,
      organismJustRotation;
  
  if (this.tail) {
    for (var i = 1; i < this.hpPoints.length; i++) {
      
      organismJustRotation = {
        x: 0,
        y: 0,
        rotation: this.rotation
      }
      
      rotationFromBodyToHp = rotationTo(organismJustRotation, this.hpPoints[i]);
      
      if (rotationFromBodyToHp > Math.PI * 2) {
        rotationFromBodyToHp -= Math.PI * 2;
      } 
      
      if (rotationFromBodyToHp < -Math.PI * 2) {
        rotationFromBodyToHp += Math.PI * 2;
      } 
      
      rotationFromHpToBody = rotationFromBodyToHp + Math.PI;
      
      if (rotationFromHpToBody > Math.PI) {
        rotationFromHpToBody -= Math.PI * 2;
      }

      if (Math.abs(rotationFromHpToBody) > 0.1) {
        
        // TODO: Un-witchcraft this
        // Aim to divide by 1 MAXIMUM
        //var multiplier
        rotate(this.hpPoints[i], (rotationFromHpToBody / ((i + 1) / 2)) * ((1 + this.speed / 2) * (1 + Math.abs(this.angularVelocity))));
      }
      
    }   
  }
  
  
  
  // Reset sprite's acceleration (left over from previous moves?):
  this.acceleration.x = 0;
  this.acceleration.y = 0;
  this.angularAcceleration = 0;

};
