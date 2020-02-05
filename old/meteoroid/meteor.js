/*jslint plusplus: true*/

/*global Vec, levels, currentLevel, applyMaxSpeed, gravAcceleration, keepOnScreen*/



var Meteor = function (x, y) {
  
  "use strict";
  
  this.visible = false; // Starts off invisible.
  this.position = new Vec(x, y);
  this.velocity = new Vec(0, 0);
  this.radius = 15 * baseUnit;
  this.mass = Math.PI * (this.radius / baseUnit) * (this.radius / baseUnit);
  this.maxSpeed = 15 * baseUnit;
  
};
Meteor.prototype.constructor = Meteor;



// Todo: Make drawing the meteor pretty, and correctly scaled?
Meteor.prototype.draw = function (ctx) {
  
  "use strict";
  
  if (this.visible) {
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }
  
};



Meteor.prototype.kill = function () {
  
  "use strict";
  
  this.visible = false;
  this.velocity.reset();
  
};



/**
 * Kills the meteor, setting appropriate properties to false or 0.
 */
Meteor.prototype.kill = function () {
  
  "use strict";
  
  this.alive = false;
  this.visible = false;
  this.velocity.reset();
  
};



Meteor.prototype.update = function (updateAmount) {
  
  "use strict";
  
  var i, k,
      planet,
      acceleration,
      // Times to repeat acceleration calculation to increase stability:
      steps = 8,
      // Inverse of steps:
      invSteps = 1 / steps,
      // The "overall" speed of the meteor (and basically the game):
      meteorSpeed = 1;
  
  //console.log("Updating meteor " + currentLevel);

  // Go through all the planets and add some velocity from the gravitational
  // pull from each one. If the calculation to figure out how much velocity
  // to add fails, it's because the meteor is inside that planet!
  for (i = 0; this.alive && i < levels[currentLevel].planets.length; i++) {

    planet = levels[currentLevel].planets[i];
    
    for (k = 0; this.alive && k < steps; k++) {
      
      // Fuck off JSLint I know what I'm doing (assignment AND expression).
      // (Wrapped in extra parenthesis so JSHint stops complaining at least)
      if ((acceleration = gravAcceleration(planet, this))) {
        this.velocity.iadd(acceleration.mul(invSteps));
      } else {
        // The acceleration calculation failed because
        // the meteroid has crashed into the planet oh no!
        this.kill();
        return false;
      }
      
    }

  }

  // If the meteor didn't crash:
  if (this.alive) {
    
    applyMaxSpeed(this);
    this.position.iadd(this.velocity.mul(updateAmount * meteorSpeed));
    keepOnScreen(this, meteorCanvas.width, meteorCanvas.height);
    
    return true;

  }
 
};