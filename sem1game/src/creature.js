/*jslint plusplus: true, white: true*/

/*global Phaser: false, colorToInt: false, getCreatureProperties: false*/



Phaser.Sprite.prototype.drawBody = function (game) {
  
  "use strict";
  
  var shapeGraphic = game.add.graphics(0, 0);

  // Bug with PixiJS means to draw polygon the 1st set
  // of points must be repeated at the end of array:
  this.vertexPoints.push(this.vertexPoints[0]);

  // Set the thickness, color, and transparency of lines:
  // TODO: Set transparency on level and/or animation.
  shapeGraphic.lineStyle(2, this.color, 1);

  // Draw the shape:
  shapeGraphic.drawPolygon(this.vertexPoints);

  // Phaser/PixiJS thinks things start pointing
  // right, so make the shape point right:
  shapeGraphic.rotation += 1.57079633;

  //shapeGraphic = shapeGraphic.generateTexture();
  
  // Add the shape as a child of the sprite, so it moves with it etc.
  this.addChild(shapeGraphic);

  //shapeGraphic.destroy();
  
  // Now that the graphic has been drawn, remove the
  // extra vertex point that was used for drawing:
  this.vertexPoints.pop();
  
};



// Draws the mouth of the creature.
// TODO: Mouths with multiple shapes (not just left and right).
// TODO: Think about animating...
Phaser.Sprite.prototype.drawMouth = function (game) {

  "use strict";
  
  var mouthGraphic, i, j;
  
  for (i = 0; i < this.mouth.length; i++) {
    
    for (j = 0; j < this.mouth[i].vertices.length; j++) {
      this.mouth[i].vertices[j] = this.mouth[i].vertices[j] * this.mouth[i].scale;
    }
    
    this.mouth[i].vertexPoints = this.mouth[i].vertices.toPoints();
    
    mouthGraphic = game.add.graphics(-this.mouth[i].offset.y, 0);
                                     
    mouthGraphic.lineStyle(2, this.color, 1);
    
    mouthGraphic.drawPolygon(this.mouth[i].vertexPoints);
    
    mouthGraphic.pivot.x = (mouthGraphic.getBounds().height/2)-2;
    mouthGraphic.pivot.y = (mouthGraphic.getBounds().width/2)-2;
    
    mouthGraphic.angle = (this.mouth[i].rotation);
    
    this.addChild(mouthGraphic);
  
  }
  
};



Phaser.Sprite.prototype.drawHP = function (game) {
  
  "use strict";
  
  var i, hpGraphic;
  
  // Remove any old HP points that might exist:
  // TODO: Make this less stupidly hacky.
  for (i = this.children.length; i >= 2; i--) {
    this.removeChild(this.children[i]);
  }
  
  for (i = 0; i < this.hpPoints.length; i++) {
    hpGraphic = game.add.graphics(
      // This is flipped/mirrored to fit weird default rotation:
      -this.hpPoints[i].y,
      -this.hpPoints[i].x
    );

    // Draw different value or "levels" of HP per point:
    switch (this.hpPoints[i].value) {

      case 0: // ○
        hpGraphic.lineStyle(2, this.color, 1);
        hpGraphic.drawCircle(0, 0, 9);
      break;

      case 1: // ●
        hpGraphic.beginFill(this.color, 1);
        hpGraphic.drawCircle(0, 0, 9);
      break;

      case 2: // ◉
        hpGraphic.lineStyle(2, this.color, 1);
        hpGraphic.drawCircle(0, 0, 11);
        hpGraphic.beginFill(this.color, 1);
        hpGraphic.drawCircle(0, 0, 4);
      break;

      case 3: // ◉ with another outline
        hpGraphic.lineStyle(2, this.color, 1);
        hpGraphic.drawCircle(0, 0, 15);
        hpGraphic.lineStyle(2, this.color, 1);
        hpGraphic.drawCircle(0, 0, 9);
        hpGraphic.beginFill(this.color, 1);
        hpGraphic.drawCircle(0, 0, 3);
      break;

    }
    
    this.addChild(hpGraphic);
    
  }
  
};



Phaser.Sprite.prototype.setCreature = function (game, creature, color, ai) {
  
  "use strict";

  var i, largestVertex = 0, centroid;
  
  // Replace creature string with an object full of
  // variables unique to that type of creature:
  creature = (JSON.parse(JSON.stringify(
    getCreatureProperties(creature)
  )));
  
  // Rescale the vertices and find the biggest (furthest from centre):
  for (i = 0; i < creature.vertices.length; i++) {
    creature.vertices[i] = creature.vertices[i] * creature.scale;
    if (creature.vertices[i] > largestVertex) {
      largestVertex = creature.vertices[i];
    }
  }
  
  this.size = largestVertex;
  
  //console.log(this.size);
  
  // Convert the array of x and y coords into an array of
  // Phaser Point objects (that have x and y coords).
  // This also copies the original array so we don't break it.
  this.vertexPoints = creature.vertices.toPoints();
  
  // Find the center of the shape:
  centroid = Phaser.Point.centroid(this.vertexPoints);
  
  // Realign the vertices to be around the center:
  for (i = 0; i < this.vertexPoints.length; i++) {
    this.vertexPoints[i].x -= centroid.x;
    this.vertexPoints[i].y -= centroid.y;
  }
  
  game.physics.arcade.enable(this);
  
  // Don't draw the creature if it's not in the camera. This
  // is a relitively expensive operation to perform, so it needs
  // more testing! Also Phaser's way of doing it could be improved!
  //this.autoCull = true;
  
  this.color = colorToInt(color);
  this.hpPoints = creature.hpPoints;
  this.mouth = creature.mouth;
  this.ai = creature.ai || false;
  if (this.ai) {
    this.ai.viewDistance = creature.ai.viewDistance * 10; 
  }
  this.body.maxVelocity.set(creature.speed * 10);
  this.body.maxAngular = (creature.turnRate * 10);
  
  // Draw the creature for the first time. Phaser/PixiJS
  // keep this displayed so it doesn't need to be
  // called again unless something changes.
  this.drawBody(game);
  this.drawMouth(game);
  this.drawHP(game);
  
  // Stats that apply to all creatures (may change to
  // be unique to each creature type eventually):
  
  // Basic x/y drag. An extra drag is applied in the update
  // section. TODO: Combine the two in a nice way.
  this.body.drag.set(180);
  
  // Drag to stop the spinning AHH I'm, so dizzy
  this.body.angularDrag = 999;

};



// This is currently only designed to work with the "kite" creature.
// HP gained is always added to the hpPoint with the lowest value,
// starting at the beginning of the hpPoints list. Snake and other
// creatures HP will probably have to work differently.
// TODO: Check if the max HP value is reached and evolve creature.
Phaser.Sprite.prototype.addHP = function (game) {
  
  "use strict";
  
  var i, added = false;
  
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
  
  this.drawHP(game);
  
}