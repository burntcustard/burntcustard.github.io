/*jslint white: true, plusplus: true*/

// JLint is reporting an "Empty block" that contains an if statement.
// So not only is it not completely empty, but there is no evidence to
// suggest that empty blocks break code anyway - which is why this check
// is being completely removed from JSHint in the near future:
// http://jshint.com/docs/options/

// "variable: true" indicates that the variable is writable (i.e. NOT read only).
// TODO: Remove some of these. Too many! Some could be passed as parameters!
/*global distanceBetweenAbs, doAI, debug: true, cameraFollow, infiniteCamera, getOrganismProperties, settings, createParticleBurst, Organism, game, evenFrame: true, deltaTime: true, oldTime: true, rotationTo, toRadians, audioBleep*/



function changeLevel(game, toLevel) {
  
  "use strict";
  
  var i,
      organism,
      newLevelNo = game.currentLevel + toLevel;
  
  // Change the current level to the new level, if it exists:
  if ((newLevelNo >= 0) && (newLevelNo < game.levels.length)) {
    
    // Reset the colour of all organisms on the current level
    // (some of them might be angry red!)
    for (i = 0; i < game.levels[game.currentLevel].organisms; i++) {
      organism = game.levels[game.currentLevel].organisms[i];
      organism.color = getOrganismProperties(organism.type);
    }

    // Remove player from current level:
    game.levels[game.currentLevel].organisms.shift();

    // Change the current level number to the new level number:
    game.currentLevel += toLevel;

    // If the next level doesn't have an organisms array, it's gonna need one!
    if (!game.levels[game.currentLevel].organisms) {
      game.levels[game.currentLevel].organisms = [];
    }

    // Add player to start of organisms array on the new level:
    game.levels[game.currentLevel].organisms.unshift(game.player);
    
  }
  
  // else { TODO: Some error about there not being another level }
  
}



function checkForNoms(organism, player) {
  
  "use strict";
  
  var i, m, playerMouth, organismHP, organismMouth, playerHP, stopEating = false;

  // Both checks could be combined... maybe. But for now we're doing them sepatately:
  
  // Do the player eating the organism's HP check first:

  for (m = 0; m < player.mouth.length && !stopEating; m++) {

    for (i = 0; i < organism.hpPoints.length && player.mouth[m].lastAte <= 0; i++) {

      playerMouth = {
        x: player.x + player.mouth[m].x,
        y: player.y + player.mouth[m].y
      };

      organismHP = {
        x: organism.x + organism.hpPoints[i].x,
        y: organism.y + organism.hpPoints[i].y
      };

      if (player.mouth[m].lastAte <= 0 &&
          organism.hpPoints[i].value > 0 &&
          distanceBetweenAbs(playerMouth, organismHP) < player.mouth[m].size * 1.3) {
        
        // Yep, we're cheating slightly & pretending the players mouth is 1.3 times it's actual size.

        player.mouth[m].lastAte = 40;

        player.moveMouth(-40, m);
        
        // Play the test nom sound:
        audioBleep.play();

        switch (organism.type) {

          // Be careful with the level ups and downs. If a level down is eaten
          // on level 0, bad things could happen...

          case "levelUp"   : changeLevel(game, +1); stopEating = true; break;

          case "levelDown" : changeLevel(game, -1); stopEating = true; break;

          default :

            if (player.getCurrentHP() < player.maxHP) {
              // Top up the players HP
              player.addHP();
            } else if (player.levelCap < game.currentLevel && player.evolvesTo) {
              // No HP dots to upgrade... evolve!
              player.evolve();
            } else {
              // Can't evolve? Poop out the HP!
              game.levels[game.currentLevel].organisms.push(
                new Organism(
                  "food-xxs",
                  organism.x + organism.hpPoints[i].x,
                  organism.y + organism.hpPoints[i].y)
              );
              game.levels[game.currentLevel].organisms.last().velocity.x = organism.velocity.x;
              game.levels[game.currentLevel].organisms.last().velocity.y = organism.velocity.y;
            }
            
            if (organism.tail && i === organism.hpPoints.length - 1) {
              organism.hpPoints.pop();
            } else {
              organism.hpPoints[i].value--;
            }

            // If it has no HP and it's not the tiny kite:
            if (organism.getCurrentHP() === 0) {
              organism.alive = false;
            }

            break;

        }

      } 
      
    } // Finished going through all organism's HP points.
    
  } // Finished going through all the player's mouths to see if they've eaten anything.

  
  // Do the organism nomming the player's HP second:
  
  for (m = 0; (organism.mouth) && m < organism.mouth.length; m++) {

    for (i = 0; (i < player.hpPoints.length) &&
                (organism.mouth[m] && organism.mouth[m].lastAte <= 0); i++) {

      organismMouth = {
        x: organism.x + organism.mouth[m].x,
        y: organism.y + organism.mouth[m].y
      };

      playerHP = {
        x: player.x + player.hpPoints[i].x,
        y: player.y + player.hpPoints[i].y
      };

      if (player.hpPoints[i].value > 0 &&
          distanceBetweenAbs(organismMouth, playerHP) < organism.mouth[m].size) {

        // This value could be per-organism, letting some eat quicker.
        organism.mouth[m].lastAte = 40;

        organism.moveMouth(-40, m);
        
        if (organism.getCurrentHP() < organism.maxHP) {
          organism.addHP();
        }

        player.hpPoints[i].value--;

        //console.log(player.hpPoints);
        //console.log(player.getCurrentHP());

        if (player.getCurrentHP() === 0) {
          // You dead. Well not really.
          
          // Try to shrink the player down to what it evolved from:
          player.devolve();
          
          // If the devolution was successful and the player is now too
          // small to be on the current level, go back to previous level:
          if (player.getCurrentHP() > 0 &&
              game.player.evolveCount < game.currentLevel - 2) {
            changeLevel(game, -1);
          }
          // If the devolution failed and the player still has 0hp:
          if (player.getCurrentHP() === 0) {
            // Go back to level 0:
            changeLevel(game, -game.currentLevel);
          }
        }

      }

    }

  }
  
}



/**
 * Update the locations, statuses, etc. of the organisms.
 * TODO: Think about adding an "update/render next level" graphics setting.
 */
function updateOrganisms(game, updateAmount) {
  
  "use strict";
  
  var i, m, organism;
  
  // Update everthing on the current game level:
  
  for (i = 0; i < game.levels[game.currentLevel].organisms.length; i++) {
    
    organism = game.levels[game.currentLevel].organisms[i];
    
    // If:
    //  - Even frame (AI is updated ever other update frame)
    //  - and the organism isn't the player
    //  - and the organism is alive
    //  - and organism has AI of some sort:
    if (evenFrame && i !== 0 && organism.alive && organism.ai) {
      
      doAI(game.width, game.height, organism, updateAmount * 2, game.player);
      
    }
  
    // Check if the organism is nomming the player, or being nommed itself:
    // Also had "is kind of near the player" check here too, but it didn't actually
    // help performance, and that distance became unreliable with snakes.
    if (i !== 0 &&          // Isn't the player
        organism.visible && // Is on the camera
        organism.alive) {   // Is Alive

      checkForNoms(organism, game.player);
      
    }
    
    
    ////////////////////////////////////////////////
    // LevelUp organism activation & deactivation //
    ////////////////////////////////////////////////
    // - This should really only be triggered when the player evolves
    //   or de-evolves, but it's simpler code wise to do it all here.
    
    if (!evenFrame && organism.visible && organism.type === "levelUp") {
      
      // If the player's too small (evolution counter is too low):
      if (game.player.evolveCount < game.currentLevel - 1) {
        
        // If the organism hasn't already been deactivated:
        if (!organism.deactivated) {
          organism.deactivated = true;
          organism.color = game.levels[game.currentLevel].lineColor;
          organism.hpPoints[0].value = 0;
          //console.log("deactivating levelups");
        }
        
      // If the player's evolved enough to progress (evolution counter high enough):
      } else {
        
        // if the organism was previously deactivated:
        if (organism.deactivated) {
          organism.deactivated = false;
          organism.color = getOrganismProperties(organism.type).color;
          organism.hpPoints[0].value = 1;
        }
        
      }
    }
      
    for (m = 0; (organism.mouth) && (m < organism.mouth.length); m++) {
      if (organism.mouth[m].lastAte && organism.mouth[m].lastAte > 0) {
        organism.mouth[m].lastAte -= updateAmount;
        // Check if it can eat again:
        if (organism.mouth[m].lastAte !== undefined && organism.mouth[m].lastAte <= 0) {
          organism.moveMouth(40, m);
        }
      }
    }
    
    // Actually move the thing:
    organism.move(updateAmount);
    
    // Set the organism to invisible if it's off the edge of the camera
    organism.cull(game.camera);
    
    organism.teleportIfOverEdge(game.width, game.height);
 
  }
    
  // Update everything on the next game level:
  // - But try to do less work here, because it can't be interacted with!
  
  for (i = 0; (game.levels[game.currentLevel+1]) && 
       (i < game.levels[game.currentLevel+1].organisms.length); i++) {
    
    organism = game.levels[game.currentLevel+1].organisms[i];
    
    // If:
    //  - Odd frame (AI is updated ever other update frame)
    //  - and the organism is alive
    //  - and organism has AI of some sort:
    if (!evenFrame && organism.alive && organism.ai) {
      
      doAI(game.width, game.height, organism, updateAmount * 2);
      
    }
    
    for (m = 0; (organism.mouth) && (m < organism.mouth.length); m++) {
      if (organism.mouth[m].lastAte && organism.mouth[m].lastAte > 0) {
        organism.mouth[m].lastAte -= updateAmount;
        // Check if it can eat again:
        if (organism.mouth[m].lastAte !== undefined && organism.mouth[m].lastAte <= 0) {
          organism.moveMouth(40, m);
        }
      }
    }

    // Actually move the thing:
    organism.move(updateAmount);
    
    // Set the organism to invisible if it's off the edge of the camera
    organism.cull(game.camera);
    
    organism.teleportIfOverEdge(game.width, game.height);
 
  }
  
}



function updateParticles(game, updateAmount) {
  
  "use strict";
  
  var i, particle;
  
  for (i = game.levels[game.currentLevel].particles.length - 1; i >= 0 ; i--) {
    
    particle = game.levels[game.currentLevel].particles[i];
    
    particle.xOld = particle.x;
    particle.yOld = particle.y;
    
    particle.x += particle.velocity.x * updateAmount;
    particle.y += particle.velocity.y * updateAmount;
    
    particle.lifeTime -= updateAmount;
    
    // Remove particle if too old:
    if (particle.lifeTime <= 0) {
      game.levels[game.currentLevel].particles.splice(i, 1);
    }
    
  }
  
}



function update(game, tFrame) {
  
  "use strict";
  
  deltaTime = tFrame - oldTime;
  oldTime = tFrame;
  
  var i,
      updateAmount = deltaTime / (1/60 * 1000),
      organism,
      touchWorldPosition;
  
  evenFrame = evenFrame ? false : true;
  
  // Magic line of code which neither JSLint, nor myself understand anymore:
  if (!(updateAmount > 0) || updateAmount < 1) { updateAmount = 1; }
  
  if (game.touch.active) {
    
    touchWorldPosition = {
      x: game.touch.x + game.camera.x,
      y: game.touch.y + game.camera.y
    };
    
    // If the player isn't already facing towards the touch point, make it!
    if (Math.abs(rotationTo(game.player, touchWorldPosition)) > toRadians(1)) {
      game.player.rotateToFace("away", touchWorldPosition);
    }
    
    game.player.accelerate(updateAmount);
    game.player.showSpeedLines = true;
  } else {
    game.player.showSpeedLines = false;
  }
  
  /*
  if (game.input.activePointer.withinGame) {
    
    // Mouse pointer and touch input movement
    
    var distanceFromPointer = Math.floor(game.physics.arcade.distanceToPointer(player));
    
    if (distanceFromPointer > player.size/2) {
      player.move(game, "accelerate", "towards", "pointer");
    } else {
      player.move(game, "", "towards", "pointer");
    }
    
  } else {
    */
    
    // Keyboard input:
    if (game.keys.indexOf('◀') >= 0 || game.keys.indexOf('a') >= 0) {
      game.player.angularVelocity -= 0.5 * updateAmount;
    }
    if (game.keys.indexOf('▶') >= 0 || game.keys.indexOf('d') >= 0) {
      game.player.angularVelocity += 0.5 * updateAmount;
    }
    if (game.keys.indexOf('▲') >= 0 || game.keys.indexOf('w') >= 0) {
      game.player.accelerate(updateAmount);
      game.player.showSpeedLines = true;
    } else {
      game.player.showSpeedLines = false;
    }
  
    // Space key for debugging.. or if I want to add an ability thing:
    if (game.keys.indexOf('␣') >=0) {
      game.keys.splice(game.keys.indexOf('␣'), 1);
      //settings.glowy.value = !settings.glowy.value;
      //settings.webGL.value = false;
      //console.log("space pressed");
      createParticleBurst(game.levels[game.currentLevel], game.player, game.player.color, 2, 29);
    }

  updateOrganisms(game, updateAmount);
  
  updateParticles(game, updateAmount);
  
  // Make the camera follow the player:
  cameraFollow(game.camera, game.player);
  
  // Make the camera and every-fucking-thing-else do a crazy jump
  // if the player gets somewhat near the edge of the game world:
  infiniteCamera(game, game.player);
  
  // TODO: Gamepad input
  
}