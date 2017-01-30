/*jslint white: true, plusplus: true, vars: true*/

/*global randomCoords, Organism, selectRandomFromList, colorTransition*/



/************************/
/*      LEVEL PLAN      */
/************************/
/* 
 *     │ Food /  │ 
 *  ## │ Enemies │ Notes
 *  ───┼─────────┼──────────────────────────
 *   0 │   N/A   │ Intro level. Only nextLevels, & maybe a friend to show how to eat 'em.
 *   1 │ F F     │ One static food, one that flees from player.
 *   2 │ E E     │ Two basic enemies
 *   3 │ E F     │ One basic static food type, one basic enemy type.
 *   4 │ E E+    │ One basic enemy, one a bit more advanced.
 *   5 │ F F F+  │ Two basic foods, one a bit more advanced.
 *   6 │ E E E+  │ Three enemy types, but not too much of a clusterfuck.
 *   7 │ E E+ F  │ One basic enemy, one advanced, one food.
 *   8 │ E E E+  │ Two basic enemies, one that's very advanced.
 *   9 │ F F F*  │ Two basic foods, one special weird one.
 *  10 │ E E E   │ Three enemies. Craziness.
 *  11 │ E E F   │ Two enemies and one food.
 *  12 │ E E E   │ Three large / "mini boss" enemies.
 *  13 │ F F F+  │ Lots of delicious, tiny, swimming around food that makes it obvious a boss is coming.
 *  14 │ BOSS    │ Stupidly large enemy creature.
 *  15 │   N/A   │ Credits? Something special?
 *
 */



function generateOrganisms(organismTypes, difficulty, levelSize) {
  
  "use strict";
  
  var ratios = [],
      ratiosTotal = 0,
      difficultyCount = 0,
      organisms = [],
      newOrganism,
      coords,
      i,
      overflowCount = 0;
  
  // Generate ratios for each organism type:
  // TODO: Explain better how this works because I'm skipping writing it
  // down and going straight from fuzzy thoughts to witchcraft-code.
  while ((ratiosTotal !== organismTypes.length * 4) &&
         (overflowCount < 99)) {
    ratios = [];
    ratiosTotal = 0;
    for (i = 0; i < organismTypes.length; i++) {
      ratios.push(Math.round(Math.random() * (organismTypes.length * 4 - 1) + 0.5));
      ratiosTotal += ratios[i];
    }
    
    overflowCount++;
    // Now we have a few numbers. These specify the ratios of the organisms.
    // e.g. if it's 2:2:1 then there's be an equal number of the first two things,
    // and a half the number of the 3rd. But that doesn't add up to enough, so
    // we're going to go around the loop again. And keep going around until it does.
    // So an "accepted" amount would be 1:1:4, 2:1:3, 1:1:4, etc.
    // Note: 0's aren't generated.
  }
  
  // If we failed to get ratios, just set them all equal (all 2s):
  if (ratiosTotal !== organismTypes.length * 4) {
    ratios = [];
    for (i = 0; i < organismTypes.length; i++) {
      ratios.push(4);
    }
  }
  
  //console.log("Ratios for level " + "?" + ": " + ratios);
  
  for (i = 0; i < organismTypes.length; i++) {

    difficultyCount = 0;
    
    overflowCount = 0;

    while ((ratios[i] !== 0) &&
           (difficultyCount < (difficulty * ratios[i]) / organismTypes.length) &&
           (overflowCount < 999)) {
      
      coords = randomCoords(levelSize, levelSize);
      newOrganism = new Organism(organismTypes[i], coords.x, coords.y);
      
      //console.log(newOrganism.type);
      
      // The new organism has health, add it to the list! Why might an organism
      // not have health? It might be a food randomly generated without it!
      // Oh! If it's a tiny kite it won't have health, so lets include those too!
      if (newOrganism.getCurrentHP() || newOrganism.type === "kite-xxs") {
        
        // Set the new organisms max HP, so that it can't gain more,
        // and so it knows when it's been attacked (i.e. if HP < max):
        newOrganism.maxHP = newOrganism.getCurrentHP();
        
        organisms.push(newOrganism);
        difficultyCount += newOrganism.difficulty;
      }
      
      //console.log(difficultyCount);
      overflowCount++;
      //console.log("Added a new " + organisms.last().type + " which has a difficulty of " + organisms.last().difficulty);
      //console.log("So now difficultyCount is " + difficultyCount + " and overflowCount is " + overflowCount);
    }

  }
  
  return organisms;
  
}



function getOrganismsFor(levelNumber, levelSize) {
  
  "use strict";
  
  var organismTypes = [],
      coords,
      organism,
      organisms = [],
      i,
      difficultyMultiplier,
      difficulty,
      numberOfLevelUpOrganisms = 26,   // These last two can be modified per level for... reasons.
      numberOfLevelDownOrganisms = 20; // Also... these variable names... so long.
  
  difficulty = 99 + Math.floor(levelNumber * levelNumber);
  
  //console.log("level " + levelNumber + " difficulty: " + difficulty);
  
  switch (levelNumber) {
      
    case 1:
      
      organismTypes = [
        "kite-xs", "food-xs", "food-xs"
      ];
      
      break;
      
    case 2:
      
      organismTypes = [
        "vortexHowler-s", "kite-s"
      ];
      
      break;
      
    case 3:
      
      organismTypes.push(selectRandomFromList([
        "kite-s", "vortexHowler-s", "owl-s"
      ]));
      
      organismTypes.push(selectRandomFromList([
        "banana-xxs", "kite-xs"
      ]));
      
      break;
      
    case 4:
      
      organismTypes.push(selectRandomFromList([
        "kite-s", "vortexHowler-s", "owl-s"
      ]));

      organismTypes.push(selectRandomFromList([
        "banana-s", "kite-sm", "snake-s"
      ]));
      
      break;
      
    case 5:
      
      organismTypes = [
        "banana-xxs", "foox-xs", "food-s", "food-s"
      ];
      
      break;
        
    case 14: // BOSS LEVEL!
      
      numberOfLevelUpOrganisms = 0;
      numberOfLevelDownOrganisms = 10;
      
      organismTypes.push("kite-boss");
      organismTypes.push("snake-boss");
      // TODO: Add all the other bosses.
      // TODO: Think about extra organisms to support the bosses
      
      break;
      
    default:
      
      // The default is to flood the map with tiny kites tehehehe
      // TODO: Figure out why broken?
      organismTypes.push("kite-xxs");
    
  }
  
  organisms = generateOrganisms(organismTypes, difficulty, levelSize);
     
  // The thing to nom to get to the next level:
  for (i = 0; i < numberOfLevelUpOrganisms; i++) {
    coords = randomCoords(levelSize);
    organisms.push(new Organism(
      "levelUp",
      coords.x,
      coords.y
    ));
  }
  
  // The thing to nom to get to the previous level:
  for (i = 0; i < numberOfLevelDownOrganisms; i++) {
    coords = randomCoords(levelSize);
    organisms.push(new Organism(
      "levelDown",
      coords.x,
      coords.y
    ));
  }
  
  // Rotate all the new organisms by a random amount. The "true"
  // forces the rotation event if they're not on the camera.
  for (i = 0; i < organisms.length; i++) {
    organisms[i].rotate(Math.floor(Math.random() * 360), true);
  }
      
  return organisms;
  
}



function generateLevelProperties(levelNumber, oldLevel) {
  
  "use strict";
  
  // Still TODO: Figure out if the teleporty level things need to
  // be closer to the center of the level for er some reason.
  // Or maybe they need to be not too close to the previous level ones?
  
  var newLevel = {};
  
  // TODO: Modify these a bit so different levels have different colors
  newLevel.bgColor = colorTransition(oldLevel.bgColor, "rgb(29, 11, 36)", 2);
  newLevel.lineColor = colorTransition(oldLevel.lineColor, "rgb(176, 66, 255)", 12);
  
  newLevel.particles = [];
  
  // The levels get bigger! I think this is a good idea!
  //newLevel.size = oldLevel.size + levelNumber * 10;
  // Okay maybe not! Back to 2000x2000 for now.
  newLevel.size = oldLevel.size;
  
  newLevel.organisms = getOrganismsFor(levelNumber, newLevel.size);
  
  return newLevel;
  
}


function generateLevels() {
  
  "use strict";
  
  var levels = [], newLevel = {}, i, coords;
  
  newLevel.bgColor   = "rgb( 36,  38,  37)";
  newLevel.lineColor = "rgb( 96, 255, 255)";
  newLevel.size = 2000;
  newLevel.particles = [];
  newLevel.organisms = [];
  
  for (i = 0; i < 40; i++) {
    coords = randomCoords(newLevel.size, newLevel.size);
    newLevel.organisms.push(new Organism(
      "levelUp",
      coords.x,
      coords.y
    ));
  }
  
  levels.push(newLevel);
  
  // There are gonna be 14 levels I think? But there could be infinite?...
  for (i = 1; i < 14; i++) {
    
    newLevel = generateLevelProperties(i, levels[i-1]);
    
    levels.push(newLevel);
    
  }
  
  return levels;
  
}