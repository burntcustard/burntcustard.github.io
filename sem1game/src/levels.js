/*jslint white: true, plusplus: true, vars: true*/

/*global randomCoords, Organism, selectRandomFromList*/



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
  while ((ratiosTotal !== organismTypes.length * 2) &&
         (overflowCount < 99)) {
    ratios = [];
    ratiosTotal = 0;
    for (i = 0; i < organismTypes.length; i++) {
      ratios.push(Math.floor(Math.random() * organismTypes.length * 2 + 0.5));
      ratiosTotal += ratios[i];
    }
    
    overflowCount++;
    // Now we have a few numbers. These specify the ratios of the organisms.
    // e.g. if it's 2:2:1 then there's be an equal number of the first two things,
    // and a half the number of the 3rd. But that doesn't add up to enough, so
    // we're going to go around the loop again. And keep going around until it does.
    // So an "accepted" amount would be 1:1:4, 2:1:3, 0:0:6, etc.
  }
  
  // If we failed to get ratios, just set them all equal (all 2s):
  if (ratios.length === 0) {
    for (i = 0; i < organismTypes.length; i++) {
      ratios.push(2);
    }
  }
  
  //console.log(ratios);
  
  for (i = 0; i < organismTypes.length; i++) {

    difficultyCount = 0;
    
    overflowCount = 0;

    while ((ratios[i] !== 0) &&
           (difficultyCount < difficulty * ratios[i]) &&
           (overflowCount < 999)) {
      coords = randomCoords(levelSize, levelSize);
      newOrganism = new Organism(organismTypes[i], coords.x, coords.y);
      organisms.push(newOrganism);
      difficultyCount += organisms.last().difficulty;
      overflowCount++;
      //console.log("Added a new " + organisms.last().type + " which has a difficulty of " + organisms.last().difficulty);
      //console.log("So now difficultyCount is " + difficultyCount + " and overflowCount is " + overflowCount);
    }

  }
  
  return organisms;
  
}



function getOrganismsFor(levelNumber, levelSize) {
  
  "use strict";
  
  var potentialOrganismTypes = [],
      actualOrganismTypes = [],
      coords,
      organism,
      organisms = [],
      i,
      difficultyMultiplier,
      difficulty,
      numberOfLevelUpOrganisms = 20,   // These last two can be modified per level for special reasons.
      numberOfLevelDownOrganisms = 16; // Also... these variable names... so long.
  
  // The number defines the difficulty curve. I.e. the lower
  // this number, the more linear the level difficulty is. If
  // it's really high, the levels will get crazy difficult, crazy fast.
  // OR DOES IT I'M NOT SURE?
  difficultyMultiplier = 9;
  
  difficulty = 40 + Math.floor(levelNumber * levelNumber / 5) * difficultyMultiplier;
  
  //console.log("level " + levelNumber + " difficulty: " + difficulty);
  
  switch (levelNumber) {
      
    case 1:
      
      // 1st list of organisms that can be randomly selected from:
      potentialOrganismTypes.push("kite-xs");
      potentialOrganismTypes.push("kite-xs");
      
      actualOrganismTypes.push(selectRandomFromList(potentialOrganismTypes));
      
      // Clear the potential organisms list.
      // This might need to be changed to .length = 0 to clear properly.
      potentialOrganismTypes = [];
      
      // 2nd list of organisms that can be ranomly selected from:
      potentialOrganismTypes.push("kite-xs");
      potentialOrganismTypes.push("kite-xs");
      
      actualOrganismTypes.push(selectRandomFromList(potentialOrganismTypes));
      
      break;
      
    case 2:
      
      potentialOrganismTypes.push("vortexHowler-s");
      potentialOrganismTypes.push("snake-s");
      actualOrganismTypes.push(selectRandomFromList(potentialOrganismTypes));
      potentialOrganismTypes = [];
      potentialOrganismTypes.push("kite-s");
      potentialOrganismTypes.push("snake-s");
      actualOrganismTypes.push(selectRandomFromList(potentialOrganismTypes));
      
      break;
      
    case 3:
      
      potentialOrganismTypes.push("kite-s-bigMouth");
      potentialOrganismTypes.push("vortexHowler-s");
      potentialOrganismTypes.push("kite-m");
      potentialOrganismTypes.push("snake-s");
      potentialOrganismTypes.push("rocket-m");
      actualOrganismTypes.push(selectRandomFromList(potentialOrganismTypes));
      potentialOrganismTypes = [];
      potentialOrganismTypes.push("kite-s-bigMouth");
      potentialOrganismTypes.push("vortexHowler-s");
      potentialOrganismTypes.push("kite-m");
      potentialOrganismTypes.push("snake-s");
      potentialOrganismTypes.push("rocket-m");
      actualOrganismTypes.push(selectRandomFromList(potentialOrganismTypes));
      potentialOrganismTypes = [];
      potentialOrganismTypes.push("kite-s-bigMouth");
      potentialOrganismTypes.push("vortexHowler-s");
      potentialOrganismTypes.push("kite-s");
      potentialOrganismTypes.push("kite-m");
      potentialOrganismTypes.push("snake-s");
      potentialOrganismTypes.push("rocket-m");
      actualOrganismTypes.push(selectRandomFromList(potentialOrganismTypes));
      
      break; 
        
    case 14: // BOSS LEVEL!
      
      numberOfLevelUpOrganisms = 0;
      numberOfLevelDownOrganisms = 10;
      
      potentialOrganismTypes.push("kite-boss");
      potentialOrganismTypes.push("snake-boss");
      // TODO: Add all the other bosses.
      // TODO: Think about extra organisms to support the bosses
      
      break;
      
    default:
      
      // The default is to flood the map with tiny kites tehehehe
      
      actualOrganismTypes.push("kite-xxs");
    
  }
  
  organisms = generateOrganisms(actualOrganismTypes, difficulty, levelSize);
     
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
      
  return organisms;
  
}



function generateLevelProperties(levelNumber, oldLevel) {
  
  "use strict";
  
  // Still TODO: Figure out if the teleporty level things need to
  // be closer to the center of the level for er some reason.
  // Or maybe they need to be not too close to the previous level ones?
  
  var newLevel = {};
  
  // TODO: Modify these a bit so different levels have different colors
  newLevel.bgColor = oldLevel.bgColor;
  newLevel.lineColor = oldLevel.lineColor;
  
  // The levels get bigger! I think this is a good idea!
  //newLevel.size = oldLevel.size + levelNumber * 10;
  // Okay back to 2000x2000 for now.
  newLevel.size = oldLevel.size;
  
  newLevel.organisms = getOrganismsFor(levelNumber, newLevel.size);
  
  return newLevel;
  
}


function generateLevels() {
  
  "use strict";
  
  var levels = [], newLevel = {}, i, coords;
  
  newLevel.bgColor   = "rgb( 36,  36,  36)";
  newLevel.lineColor = "rgb( 96, 255, 255)";
  newLevel.size = 2000;
  newLevel.organisms = [];
  
  for (i = 0; i < 35; i++) {
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