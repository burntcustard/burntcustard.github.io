/*jslint plusplus: true, white: true*/

/*global getOrganismProperties*/



var Organism = function (organismType, x, y) {
  
  "use strict";
  
  var organism, i, j, k, m, tmpVertex, body, largestVertex = 0;
  
  // If coordinates aren't supplied, get random ones:
  // disabled because this is a bad idea without knowing how big the level is?
  //x = x || randomCoords().x;
  //y = y || randomCoords().y;
 
  // Get object full of variables
  // unique to this type of organism:
  organism = (JSON.parse(JSON.stringify(
    getOrganismProperties(organismType)
  )));
  
  this.x = x;
  this.y = y;
  
  this.maxHP = organism.maxHP;
  
  this.hpPoints = organism.hpPoints;
  for (i = 0; i < this.hpPoints.length; i++) {
    this.hpPoints[i].x = organism.hpPoints[i].x || 0;
    this.hpPoints[i].y = organism.hpPoints[i].y || 0;
  }
  
  // Setting vertices witchcraft. TODO: Seperate this into it's own
  // function and write a ton of comments because a lot is going on here.
  
  this.body = [];
  
  for (j = 0; j < organism.body.length; j++) {
    
    this.body.push({
      vertices: [],
      scale: organism.body[j].scale
    });
    
    if (organism.body[j].rotating) {
      // This is a good one. The check returns false if the property
      // doesn't exist, or if it's 0, because then it's not needed!
      // The first bodies rotation is randomly either clockwise,
      // or anticlockwise, and then the following are opposites.
      if (j === 0) {
        this.body[j].rotating = unAbs(organism.body[j].rotating);
      } else {
        this.body[j].rotating = oppositeTo(organism.body[j].rotating, this.body[j - 1].rotating);
      }
    }
    
    body = organism.body[j];
   
    for (i = 0; i < organism.body[j].vertices.length; i++) {
      switch (i % 2) {
        case 0:
          tmpVertex = organism.body[j].vertices[i];
          break;
        case 1:
          this.body[j].vertices.push({
            x: tmpVertex * organism.body[j].scale,
            y: organism.body[j].vertices[i] * body.scale
          });
          break;
      }
      if (body.vertices[i] > largestVertex) {
        largestVertex = organism.body[j].vertices[i];
      }
    }
    this.size = largestVertex * organism.body[j].scale;

    this.body[j].center = {x: 0, y: 0};
    
    // The body of the organism is like a real body and not just a line
    // (lines only have two vertices):
    if (this.body[j].vertices.length > 2) {
      for (i = 0; i < this.body[j].vertices.length; i++) {
        this.body[j].center.x += this.body[j].vertices[i].x;
        this.body[j].center.y += this.body[j].vertices[i].y;
      }
      this.body[j].center.x /= this.body[j].vertices.length;
      this.body[j].center.y /= this.body[j].vertices.length;
      // Recenter the bodies vertices around the.. center? TODO: EXPLAIN!
      for (i = 0; i < this.body[j].vertices.length; i++) {
        this.body[j].vertices[i].x -= this.body[j].center.x;
        this.body[j].vertices[i].y -= this.body[j].center.y;
      }
    }
    
    // If the body is literally just a line, set the
    // center of the body to the second point in the line:
    // Does this even need to be done?... TODO: Figure out.
    if (this.body[j].vertices.length === 2) {
      for (i = 0; i < this.body[j].vertices.length; i++) {
        // Moving it a few extra pixels to be out of the hpPoint is
        // hacky and not exact right now.
        this.body[j].vertices[i].y = -this.body[j].vertices[i].y - this.hpPoints[0].value * 2;
      }

    }
    
  }
  
  this.type = organismType; // "type" is NOT a reserved word. Don't panic.
  
  // Tail stuff (must be done after body is set up):
  
  if (organism.tail) {
    this.initTail();
  }
    
  
  this.speedLines = organism.speedLines || 0;
  
  this.difficulty = organism.difficulty || 0;
  this.color = organism.color || "rgb(255,255,255)";
  this.speed = 0;
  this.lastAte = 0;
  this.acceleration = {x: 0, y: 0};
  this.velocity = {x: 0, y: 0}; // Velocity (X & Y speeds, actually);
  this.angularAcceleration = 0;
  this.angularVelocity = 0;
  this.rotation = 0;           // Rotation from upwards, going clockwise, in degrees.
  this.ai = organism.ai || false;
  if (this.ai) {
    this.ai.viewDistance = organism.ai.viewDistance * 10;
    this.ai.wiggleCounter = 0;
  }
  this.maxVelocity = organism.speed / 10;
  this.maxAngular = organism.turnRate / 10;
  if (organism.chargeSpeed || organism.chargeTurnRate) {
    this.charges = true;
  }
  
  this.initMouth();
  
  this.alive = true;
  this.visible = true;
  
};
Organism.prototype.constructor = Organism;



Organism.prototype.initTail = function() {

  "use strict";
 
  var i, organism = getOrganismProperties(this.type);
  
  this.tail = organism.tail;

  this.tail.segments = [];
  
  for (i = 0; i < this.hpPoints.length; i++) {

    //var segmentVertices = organism.tail.segments;

    this.tail.segments.push({
      x: 0,
      y: this.tail.distanceBetweenSegments * i,
      rotation: 0
    });

    //if (this.tail.hpPointsOnTail) {
    //  if (this.hpPoints[i]) {
    this.hpPoints[i].y = this.tail.segments[i].y;
    //  }
    //}

  }

  
}
  

// Mouthy stuff (this is gonna be crazy for now):
Organism.prototype.initMouth = function() {
  
  "use strict";
  
  var m, i, j, tmpVertex, largestVertex, organism = getOrganismProperties(this.type);
  
  this.mouth = [];
  
  for (m = 0; m < organism.mouth.length; m++) {
  
    this.mouth.push({});
    this.mouth[m].vertices = [];
    largestVertex = 0;
  
    for (i = 0; i < organism.mouth[m].vertices.length; i++) {
      switch (i % 2) {
        case 0:
          tmpVertex = organism.mouth[m].vertices[i];
          break;
        case 1:
          this.mouth[m].vertices.push({
            x: tmpVertex * organism.mouth[m].scale,
            y: organism.mouth[m].vertices[i] * organism.mouth[m].scale
          });
          break;
      }
    }
    
    for (i = 0; i < this.mouth[m].vertices.length; i++) {
      if (this.mouth[m].vertices[i].x + this.mouth[m].vertices[i].y > largestVertex) {
        this.mouth[m].size = (this.mouth[m].vertices[i].x + this.mouth[m].vertices[i].y) / 2;
      } 
    }
    
    this.mouth[m].center = {x: 0, y: 0};
    for (j = 0; j < this.mouth[m].vertices.length; j++) {
      this.mouth[m].center.x += this.mouth[m].vertices[j].x;
      this.mouth[m].center.y += this.mouth[m].vertices[j].y;
    }
    this.mouth[m].center.x /= this.mouth[m].vertices.length;
    this.mouth[m].center.y /= this.mouth[m].vertices.length;
    for (j = 0; j < this.mouth[m].vertices.length; j++) {
      this.mouth[m].vertices[j].x -= this.mouth[m].center.x;
      this.mouth[m].vertices[j].y -= this.mouth[m].center.y;
    }
    
    for (i = 0; i < this.mouth[m].vertices.length; i++) {
      if (organism.mouth[m].rotation) {
        rotate(this.mouth[m].vertices[i], organism.mouth[m].rotation);
      }
      this.mouth[m].vertices[i].x += organism.mouth[m].x;
      this.mouth[m].vertices[i].y += organism.mouth[m].y;
    }
    
  }
  
};



Organism.prototype.getCurrentHP = function() {
  
  "use strict";
  
  var i, hpCount = 0;
  
  for (i = 0; i < this.hpPoints.length; i++) {
    hpCount += this.hpPoints[i].value;
    // "valueOf" is a reserved word, but "value" isn't. We're getting away with it!
  }
  
  return hpCount;
  
};



/**
 * How many degrees open do you want to close the mouth (each side)? Minus means close, plus means open.
 */
Organism.prototype.moveMouth = function(deg) {
  
  "use strict";
  
  var m, i, xy;
  
  // We're cheating and just re-initialising the mouth if it's supposed to be re-opening.
  // I think rounding errors are screwing up doing it "properly" :(
  if (deg > 0) {
    this.initMouth();
    for (i = 0; i < this.mouth[0].vertices.length; i++) {
      rotate(this.mouth[0].vertices[i], +this.rotation);
    }
    return;
  }
  
  for (m = 0; m < this.mouth.length; m++) {
    
    for (i = 0; i < this.mouth[m].vertices.length; i++) {
      rotate(this.mouth[m].vertices[i], -this.rotation);
    }
    
    rotate(this.mouth[m], -this.rotation); // Rotate the mouth's x and y;
    
    for (i = 0; i < this.mouth[m].vertices.length; i++) {
      this.mouth[m].vertices[i].y -= -Math.abs(this.mouth[m].y) + (this.mouth[m].size / 2);
    }
    
    // Rotate 1st half (not including middle point) clockwise:
    for (i = 0; i < Math.floor((this.mouth[m].vertices.length) / 2); i++) {
      rotate(this.mouth[m].vertices[i], -deg);
    }

    // Rotate 2nd half (not including middle point) anticlockwise:
    for (i = this.mouth[m].vertices.length - 1; i >= Math.ceil(this.mouth[m].vertices.length / 2); i--) {
      rotate(this.mouth[m].vertices[i], +deg);
    }
    
    for (i = 0; i < this.mouth[m].vertices.length; i++) {
      //this.mouth[m].vertices[i].x += organism.mouth[m].x;
      this.mouth[m].vertices[i].y += -Math.abs(this.mouth[m].y) + (this.mouth[m].size / 2);
    }
    
    rotate(this.mouth[m], +this.rotation); // Rotate the mouth's x and y;
    
    for (i = 0; i < this.mouth[m].vertices.length; i++) {
      rotate(this.mouth[m].vertices[i], +this.rotation);
    }
    //*/
    
  }

};



/**
 * Viewing frustum culling, i.e. if the
 * organism is off the camera, don't draw it.
 * TODO: Check if this actually helps performance.
 */
Organism.prototype.cull = function(camera) {
  
  "use strict";
  
  var s = this.size;
  
  if (this.visible) {
    if (this.x < camera.x - s ||
        this.y < camera.y - s ||
        this.x > camera.x + camera.width + s ||
        this.y > camera.y + camera.height + s) {
      this.visible = false;
    } 
  } else if (this.alive &&
             this.x > camera.x - s &&
             this.y > camera.y - s &&
             this.x < camera.x + camera.width + s &&
             this.y < camera.y + camera.height + s) {
    this.visible = true;  
  }
  
};



/**
 * Teleports the organism to the opposite edge
 * of the game world if it falls off/over the side.
 * Note: takes into account HOW FAR off the edge it is.
 */
Organism.prototype.teleportIfOverEdge = function(gameWidth, gameHeight) {
  
  "use strict";
  
  var w = gameWidth,
      h = gameHeight;
  
  if (this.x > w) {
    this.x -= w * 2;
  }
  if (this.x < -w) {
    this.x += w * 2;
  }
  if (this.y > h) {
    this.y -= h * 2;
  }
  if (this.y < -h) {
    this.y += h * 2;
  }
  
};



// This is currently only designed to work with the "kite" organism.
// HP gained is always added to the hpPoint with the lowest value,
// starting at the beginning of the hpPoints list. Snake and other
// organisms HP will probably have to work differently.
// TODO: Check if the max HP value is reached and evolve organism.
Organism.prototype.addHP = function () {
  
  "use strict";
  
  var i, 
      added = false,
      rotation = this.rotation;
  
  // If HP hasn't been added and it's a snakey snake
  if (this.tail && this.hpPoints.length < this.tail.maxLength) {
    this.rotate(-rotation, true);
    this.hpPoints.push({x: 0, y: 0, value: 1});
    this.initTail();
    this.rotate(rotation, true);
    added = true;
  }
  
  // These are done separately so that you don't end up with
  // one big HP and lots of "empties".
  
  for (i = 0; i < this.hpPoints.length; i++) {
    if (!added && this.hpPoints[i].value === 0) {
      this.hpPoints[i].value++;
      added = true;
    }
  }
  
  if (!added) {
    for (i = 0; i < this.hpPoints.length; i++) {
      if (!added && this.hpPoints[i].value === 1) {
        this.hpPoints[i].value++;
        added = true;
      }
    }
  }
  
  if (!added) {
    for (i = 0; i < this.hpPoints.length; i++) {
      if (!added && this.hpPoints[i].value === 2) {
        this.hpPoints[i].value++;
        added = true;
      }
    }
  }
  
};



/**
 * Evolve one type of organism into another.
 * TODO: A fancy not at all complicated animation.
 */
Organism.prototype.evolve = function () {
  
  "use strict";
  
  var organismType = getOrganismProperties(this.type);
  
  // If the organism can evolve into something else:
  if (organismType.evolvesTo) {

    var newOrganism = new Organism(organismType.evolvesTo, this.x, this.y);
    
    // Rotating probably doesn't work, might need to convert to/from radians/degrees
    newOrganism.rotate(this.rotation);
    
    // Make sure the organism keeps it's current velocities:
    // These aren't copied over usually, because they're not defined
    // in the constuctor when the organism is first created.
    newOrganism.velocity.x = this.velocity.x;
    newOrganism.velocity.y = this.velocity.y;
    newOrganism.angularVelocity = this.angularVelocity;

    // Replace the current organisms properties with those from the new (evolved) organism:
    for (var i in this) {
      delete this[i];
    }
    for (var i in newOrganism) {
      this[i] = newOrganism[i];
    }
    
    // Make sure all of the new creature's HP points start at 1:
    for (var i in this.hpPoints) {
      this.hpPoints[i].value = 1;
    }
    
    // Assign player-only properties
    if (this === game.player) {
      this.assignPlayerProperties();
    }
    
  }
  
};



Organism.prototype.assignPlayerProperties = function () {
  this.color = "rgb(255, 159, 0)";
  this.maxAngular *= 2;
  this.maxSpeed *= 2;
  delete this.ai;
}



// Primitive, regress... I don't like these words. So I'm using devolve even though it's
// not entirely grammatically correct, and is dangerously close to just "evolve".
// This could almost certainly be combined with the evolve function into
// something shorter... but possibly not as nice to use as .evolve() and .devolve().
Organism.prototype.devolve = function () {
  
  "use strict";
  
  var organismType = getOrganismProperties(this.type);
  
  // If the organism can evolve into something else:
  if (organismType.evolvesFrom) {

    var newOrganism = new Organism(organismType.evolvesFrom, this.x, this.y);
    
    // Rotating probably doesn't work, might need to convert to/from radians/degrees
    newOrganism.rotate(this.rotation);
    
    // Make sure the organism keeps it's current velocities:
    // These aren't copied over usually, because they're not defined
    // in the constuctor when the organism is first created.
    newOrganism.velocity.x = this.velocity.x;
    newOrganism.velocity.y = this.velocity.y;
    newOrganism.angularVelocity = this.angularVelocity;

    // Replace the current organisms properties with those from the new (evolved) organism:
    for (var i in this) {
      delete this[i];
    }
    for (var i in newOrganism) {
      this[i] = newOrganism[i];
    }
    
    // Make sure all of the new creature's HP points start at 1:
    for (var i in this.hpPoints) {
      this.hpPoints[i].value = 1;
    }
    
    // Assign player-only properties
    if (this === game.player) {
      this.assignPlayerProperties();
    }
    
  }
  
};
