/*jslint plusplus: true*/

/*global distanceBetweenAbs, distanceBetween, randomCoords*/



// Player is optional.. so if AI is being run for a background layer
// then it doesn't do stuff like run from the player.
function doAI(gameWidth, gameHeight, organism, updateAmount, player) {

  "use strict";
  
  var i, hpToAttack;
      
      // The number of attempts an AI will make trying to "guess"
      // if a player's hpPoint contains HP. If it runs out of attempts,
      // the AI will just try again next update.
  var hpPointPickingAttempts = 6;
  
  var fleeWiggleDegrees = 45;
  
  var fleeWiggleFrequency = 4;

  if (player && // If AI has interactions with player
      organism.ai.viewDistance &&
      distanceBetweenAbs(organism, player) < organism.ai.viewDistance) {
    // AI is in range of the player, do something!
    if (organism.ai.behaviour === "aggressive") {
      
      // If the organism doesn't have a target, or the target isn't the player,
      // or it's had the same target for a while (maybe an empty hpPoint?):
      if (!organism.ai.target || !organism.ai.target.player || organism.ai.targetCounter > 99) {
        for (i = 0; i < hpPointPickingAttempts; i++) {
          hpToAttack = Math.floor(Math.random() * player.hpPoints.length);
          if (player.hpPoints[hpToAttack].value > 0) {
            organism.ai.target = {
              x: player.x + player.hpPoints[hpToAttack].x,
              y: player.y + player.hpPoints[hpToAttack].y,
              player: true
            };
          }
        }
        organism.ai.targetCounter = 0;
        organism.color = "rgb(255, 50, 35)"; // Angry red colour
      }
      
      organism.rotateToFace("towards", organism.ai.target);

      if (organism.charges && Math.abs(rotationTo(organism, organism.ai.target)) < 0.05) {
        organism.maxVelocity = getOrganismProperties(organism.type).chargeSpeed / 10 || organism.maxVelocity;
        organism.maxAngular = getOrganismProperties(organism.type).chargeTurnRate / 10 || organism.maxAngular;
      }
      
    } else if (organism.ai.behaviour === "flee") {
      if (organism.ai.wiggleCounter / fleeWiggleFrequency < 1) {
        organism.rotateToFace("away", player, -fleeWiggleDegrees);
      } else if (organism.ai.wiggleCounter / fleeWiggleFrequency >= 1) {
        organism.rotateToFace("away", player, +fleeWiggleDegrees);
      }
      if (organism.ai.wiggleCounter === fleeWiggleFrequency * 2) {
        organism.ai.wiggleCounter = 0;
      } else {
        organism.ai.wiggleCounter++;
      }
    }
  } else {
    // Make the AI move somewhere random?
    if (!organism.ai.target || organism.ai.targetCounter > 99) {
      //console.log("Came up with random coords " + randomCoords.x + ", " + randomCoords.y);
      organism.ai.target = randomCoords(gameWidth * 8 - gameWidth * 4, gameHeight * 8 - gameHeight * 4);
      organism.ai.targetCounter = 0;
      // Reset the color of the organism
      organism.color = getOrganismProperties(organism.type).color || "rgb(255, 255 ,255)";
      organism.maxAngular = getOrganismProperties(organism.type).turnRate / 10 || organism.maxAngular;
    } else {
      
    }
    organism.rotateToFace("towards", organism.ai.target);
  }
  
  organism.ai.targetCounter++;
  
  // Slowly give an organism it's normal stats back after "charging"
  if (organism.charges) {
    if (organism.maxVelocity > getOrganismProperties(organism.type).speed / 10) {
      organism.maxVelocity -= 0.01 * updateAmount;
    }
    if (organism.maxAngular < getOrganismProperties(organism.type).turnRate / 10) {
      organism.maxAngular += 0.004 * updateAmount;
    }
  }
  
  organism.accelerate(updateAmount);
  
}