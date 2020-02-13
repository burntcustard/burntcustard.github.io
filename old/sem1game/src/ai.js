/*jslint plusplus: true, white: true*/

/*global distanceBetweenAbs, distanceBetween, randomCoords, getOrganismProperties, rotationTo, toRadians*/




/**
 * Do all of the AI for the organisms. E.g. figure out if it should run to or away from the player.
 * @param {integer} gameWidth    Width of the game world. E.g. 99 indicates a game world of -99 to 99.
 * @param {integer} gameHeight   Height of the game world.
 * @param {object}  organism     The organism that's being told what to do.
 * @param {float}   updateAmount A multiplier to make sure that the AI does the right amount of
 *                               an action (e.g. turning), based off the time since last update.
 * @param {object}  player       The human player that the AI might be running to/from etc.
 *                               This is optional, and without it, the AI won't react to the player,
 *                               so it's not used on the background (next) level shown underneath.
 */
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
  
  // If AI has interactions with player. (Passed into this function so other levels have less AI).
  if (player &&
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
        if (organism.ai.target.player && player.hpPoints[organism.ai.hpToAttack]) {
          organism.ai.target = {
            x: player.x + player.hpPoints[organism.ai.hpToAttack].x,
            y: player.y + player.hpPoints[organism.ai.hpToAttack].y,
            player: true
          };
        }
        
      }
      
      // Rotate the organism to face towards it's target (one of the player's hpPoints!):
      organism.rotateToFace("towards", organism.ai.target);
      
      if ((organism.charges &&
           !organism.chargeCondition) || 
          
          (organism.charges &&
           organism.chargeCondition === "facing" &&
           Math.abs(rotationTo(organism, organism.ai.target)) < toRadians(3))) {
        
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
     *    3  -fleeWiggleDegrees  <- fleeWiggleFrequency,
     *    4  +fleeWiggleDegrees     i.e. the cut off point.
     *    5  +fleeWiggleDegrees
     *    6  +fleeWiggleDegrees  <- 2x fleeWiggleFrequency.
     *                              Resets to 1 after this.
     */
    
    if (flee) {
      
      fleeWiggleDegrees = 45;  // How dramatic the change in direction is.
      fleeWiggleFrequency = 3; // How frequently the change in direction happens.
      
      if (organism.ai.wiggleCounter / fleeWiggleFrequency <= 1) {
        organism.rotateToFace("away", player, -fleeWiggleDegrees);
      } else if (organism.ai.wiggleCounter / fleeWiggleFrequency > 1) {
        organism.rotateToFace("away", player, +fleeWiggleDegrees);
      }
      
      if (organism.ai.wiggleCounter >= fleeWiggleFrequency * 2) {
        organism.ai.wiggleCounter = 1;
      } else {
        organism.ai.wiggleCounter += Math.round(updateAmount / 2);
      }
      
      //console.log(organism.ai.wiggleCounter);
      
    }
    
    
    /***********************************************/
    /* NEUTRAL AI - That interacts with the player */
    /***********************************************/
    
    if (neutralAggressive && fullHP && tCounter > 99) {
      
      baseOrganism = getOrganismProperties(organism.type);
      
      organism.ai.target = randomCoords(9999, 9999);
      organism.ai.targetCounter = 0;
      // Reset the color of the organism
      organism.color = baseOrganism.color || "rgb(255, 255 ,255)";
      
    }
    
    
  } else {
    
    
    /*******************************************************/
    /* NEUTRAL AI - That DOES NOT interact with the player */
    /*******************************************************/
    
    if (!organism.ai.target || organism.ai.targetCounter > 99) {
      
      baseOrganism = getOrganismProperties(organism.type);
     
      organism.ai.target = randomCoords(9999, 9999);
      organism.ai.targetCounter = 0;

      if (!organism.deactivated) {
        organism.color = baseOrganism.color || "rgb(255, 255 ,255)";
      }
    
    } else {
    
      organism.rotateToFace("towards", organism.ai.target);
      
    }
    
  }
  

  /**********/
  /* ALL AI */
  /**********/
  
  // Some random variation is added to the targetCounter. This is
  // to try to stop ALL of the organism's target counters reaching
  // their max value at the exact same time and causing a lag spike.
  organism.ai.targetCounter += updateAmount * (1 + Math.random() * 0.1);
  
  // Slowly give an organism it's normal stats back after "charging"
  if (organism.charges) {
    
    baseOrganism = getOrganismProperties(organism.type);
    
    if (organism.maxVelocity < baseOrganism.speed / 10) {
      organism.maxVelocity += 0.01 * updateAmount;
    }
    if (organism.maxVelocity > baseOrganism.speed / 10) {
      organism.maxVelocity -= 0.01 * updateAmount;
    }
    if (organism.maxAngular < baseOrganism.turnRate / 10) {
      organism.maxAngular += 0.004 * updateAmount;
    }
    if (organism.maxAngular > baseOrganism.turnRate / 10) {
      organism.maxAngular -= 0.01 * updateAmount;
    }
    
  }
  
  organism.accelerate(updateAmount);
  
}