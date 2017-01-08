/*jslint vars: true, white: true, plusplus: true*/

/*global Organism, angleBetween, rotationTo, rotate, toRadians, to180, angleDiff*/



Organism.prototype.applyDrag = function (updateAmount) {
  
  "use strict";
  
  var decelerationPercent = (this.drag / 10) * updateAmount;
  
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
  
  var decelerationPercent = 8 * updateAmount;
  
  var decelerationMultiplier = (1 - (decelerationPercent / 100));
  
  this.angularVelocity *= (decelerationMultiplier);
  
  if (Math.abs(this.angularVelocity) < 0.01) {
    this.angularVelocity = 0;
  }
  
};



// There is a silly amount of duplicate code here still
Organism.prototype.rotate = function (deg, everything) {
  
  "use strict";
  
  var i, j, body, speedLine, mouth, vLength, randomRotation = 0;
  
  if (this.rotation) {
    this.rotation = to180(this.rotation);
  }
  if (this.visibleRotation) {
    this.visibleRotation = to180(this.visibleRotation);
  }
  
  // Only visually rotate somethings that's on the camera,
  // or if it's the first time it's being rotated:
  if (this.visibleRotation === this.rotation) {
    
    this.rotation += deg;
    
  }
  
  if (this.visible) {
    
    this.visibleRotation += deg;

  for (i = 0; i < this.body.length; i++) {
    //body = this.body[i];
    if (this.body[i].rotating) {
      // Add a bit of variance to the body rotation:
      randomRotation = (this.body[i].rotating / 4) + (Math.random() * (this.body[i].rotating / 2));
    }
    for (j = 0; j < this.body[i].vertices.length; j++) {
      rotate(this.body[i].vertices[j], deg + randomRotation);
    }
    
  }
  
  // Rotate the hpPoints and mouth too if the body has been rotated:
  // Note: This will be based purely on the last bodies
  // rotation, NOT an average of all bodies etc.
  if (randomRotation && this.hpPoints.length > 1) {
    for (i = 0; i < this.hpPoints.length; i++) {
      rotate(this.hpPoints[i], randomRotation);
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
  
  for (i = 0; (this.mouth) && (i < this.mouth.length); i++) {

    vLength = this.mouth[i].vertices.length;

    this.mouth[i].x = 0;
    this.mouth[i].y = 0;
    for (j = 0; j < vLength; j++) {
      rotate(this.mouth[i].vertices[j], deg + randomRotation);
      this.mouth[i].x += this.mouth[i].vertices[j].x;
      this.mouth[i].y += this.mouth[i].vertices[j].y;
    }
    this.mouth[i].x /= vLength;
    this.mouth[i].y /= vLength;

  }
  
  if (this.speedLines) {
    // TODO: Tidy this for loop.
    for (i = 0; i < this.speedLines.length; i++) {
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
  }
    
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
  
  var i;
  
  if (this.angularVelocity > this.maxAngular) {
    this.angularVelocity = this.maxAngular;
  }
  else if (this.angularVelocity < -this.maxAngular) {
    this.angularVelocity = -this.maxAngular;
  }
  
  this.applyAngularDrag(updateAmount);
  
  
  //this.angularVelocity += this.angularAcceleration;
  if (this.angularVelocity !== 0) {
    this.rotate(this.angularVelocity * updateAmount);
  }
  
  if (this.visible) {
      
    if (this.visibleRotation !== this.rotation) {
      
      this.rotate(angleDiff(this.visibleRotation, this.rotation));
      
    }
    
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
    for (i = 1; i < this.hpPoints.length; i++) {
      
      organismJustRotation = {
        x: 0,
        y: 0,
        rotation: this.rotation
      };
      
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
