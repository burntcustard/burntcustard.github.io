/*jslint plusplus: true, white: true*/

/*global distanceBetweenAbs, distanceBetween, randomCoords, getOrganismProperties, rotationTo*/



// Player is optional.. so if AI is being run for a background layer
// then it doesn't do stuff like run from the player.
function doAI(gameWidth, gameHeight, organism, updateAmount, player) {

  "use strict";
  
  var i,
      hpPointPickingAttempts,
      fleeWiggleDegrees,
      fleeWiggleFrequency,
      baseOrganism,
      viewDist,
      attacked,
      fullHP,
      inRange,
      tCounter,
      aggressive,
      neutralAggressive,
      flee,
      neutralFlee;

  if (player && // If AI has interactions with player. (Passed into this function so other levels have less AI).
      organism.ai.viewDistance && // If the organism can see.
      organism.ai.behaviour && // If organism has some specified behaviour towards the player.
      distanceBetweenAbs(organism, player) < organism.ai.viewDistance) { // If player within view distance.
    
    // Set up generic AI variables:
    viewDist = organism.ai.viewDistance;
    attacked = organism.getCurrentHP() < organism.maxHP ? true : false;
    fullHP   = organism.getCurrentHP() === organism.maxHP ? true : false;
    inRange  = distanceBetweenAbs(organism, player) < organism.ai.viewDistance ? true : false;
    tCounter = organism.ai.targetCounter || 0;
    
    // Set up behavioural AI variables:
    aggressive        = organism.ai.behaviour === "aggressive"         ? true : false;
    neutralAggressive = organism.ai.behaviour === "neutral-aggressive" ? true : false;
    flee              = organism.ai.behaviour === "flee"               ? true : false;
    neutralFlee       = organism.ai.behaviour === "neutral-flee"       ? true : false;
    
    
    /*****************/
    /* AGGRESSIVE AI */
    /*****************/
    
    if (aggressive || (neutralAggressive && attacked)) {
      
      // If the organism doesn't have a target, or the target isn't the player,
      // or it's had the same target for a while (maybe an empty hpPoint?):
      if (!organism.ai.target || !organism.ai.target.player || tCounter > 99) {
        
        // The number of attempts an AI will make trying to "guess" if a player's hpPoint
        // contains HP. If it runs out of attempts, the AI will try again next update.
        // This does mean that aggressive AI may acquire targets slower at low FPS.
        hpPointPickingAttempts = 6;
        
        for (i = 0; i < hpPointPickingAttempts; i++) {
          organism.ai.hpToAttack = Math.floor(Math.random() * player.hpPoints.length);
          if (player.hpPoints[organism.ai.hpToAttack].value > 0) {
            organism.ai.target = {
              x: player.x + player.hpPoints[organism.ai.hpToAttack].x,
              y: player.y + player.hpPoints[organism.ai.hpToAttack].y,
              player: true
            };
          }
        }
        
        organism.ai.targetCounter = 0;
        organism.color = "rgb(255, 50, 35)"; // Angry red colour
        
      } else {
        
        // Update the target location, in case the player has moved etc.
        // This has to be done because we're using values rather than references for the target :(
        if (organism.ai.target.player) {
          organism.ai.target = {
            x: player.x + player.hpPoints[organism.ai.hpToAttack].x,
            y: player.y + player.hpPoints[organism.ai.hpToAttack].y,
            player: true
          };
        }
        
      }
      
      // Rotate the organism to face towards it's target (one of the player's hpPoints!):
      organism.rotateToFace("towards", organism.ai.target);

      // If the organism can "charge", and it's facing at it's target (within
      // 0.1 radians), set it's maximum velocities to it's charging values:
      if (organism.charges && Math.abs(rotationTo(organism, organism.ai.target)) < 0.1) {
        baseOrganism = getOrganismProperties(organism.type);
        organism.maxVelocity = baseOrganism.chargeSpeed / 10 || organism.maxVelocity;
        organism.maxAngular = baseOrganism.chargeTurnRate / 10 || organism.maxAngular;
      }
      
    }
    
    
    /**************/
    /* FLEEING AI */
    /**************/

    /* Wiggle wiggle
     *              
     *   -  v  +   
     *     / \     
     *     \ /     
     *      V      
     *
     * counter
     *    1  -fleeWiggleDegrees
     *    2  -fleeWiggleDegrees
     *    3  -fleeWiggleDegrees
     *    4  -fleeWiggleDegrees  <- fleeWiggleFrequency,
     *    5  +fleeWiggleDegrees     i.e. the cut off point.
     *    6  +fleeWiggleDegrees
     *    7  +fleeWiggleDegrees
     *    8  +fleeWiggleDegrees  <- 2x fleeWiggleFrequency.
     *                              Resets to 1 after this.
     */
    
    if (flee) {
      
      fleeWiggleDegrees = 45;  // How dramatic the change in direction is.
      fleeWiggleFrequency = 4; // How frequently the change in direction happens.
      
      if (organism.ai.wiggleCounter / fleeWiggleFrequency <= 1) {
        organism.rotateToFace("away", player, -fleeWiggleDegrees);
      } else if (organism.ai.wiggleCounter / fleeWiggleFrequency > 1) {
        organism.rotateToFace("away", player, +fleeWiggleDegrees);
      }
      
      if (organism.ai.wiggleCounter >= fleeWiggleFrequency * 2) {
        organism.ai.wiggleCounter = 1;
      } else {
        organism.ai.wiggleCounter += Math.round(updateAmount);
      }
      
    }
    
    
    /***********************************************/
    /* NEUTRAL AI - That interacts with the player */
    /***********************************************/
    
    if (neutralAggressive && fullHP && tCounter > 99) {
      
      organism.ai.target = randomCoords(gameWidth * 8 - gameWidth * 4, gameHeight * 8 - gameHeight * 4);
      organism.ai.targetCounter = 0;
      // Reset the color of the organism
      organism.color = getOrganismProperties(organism.type).color || "rgb(255, 255 ,255)";
      organism.maxAngular = getOrganismProperties(organism.type).turnRate / 10 || organism.maxAngular;
      
    }
    
    
  } else {
    
    
    /*******************************************************/
    /* NEUTRAL AI - That DOES NOT interact with the player */
    /*******************************************************/
    
    if (!organism.ai.target || organism.ai.targetCounter > 99) {
     
      organism.ai.target = randomCoords(gameWidth * 8 - gameWidth * 4, gameHeight * 8 - gameHeight * 4);
      organism.ai.targetCounter = 0;

      organism.color = getOrganismProperties(organism.type).color || "rgb(255, 255 ,255)";
      organism.maxAngular = getOrganismProperties(organism.type).turnRate / 10 || organism.maxAngular;
    
    } else {
    
      organism.rotateToFace("towards", organism.ai.target);
      
    }
    
  }
  

  /**********/
  /* ALL AI */
  /**********/
  
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