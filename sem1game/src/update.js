/*jslint white: true, plusplus: true*/

// JLint is reporting an "Empty block" that contains an if statement.
// So not only is it not completely empty, but there is no evidence to
// suggest that empty blocks break code anyway - which is why this check
// is being completely removed from JSHint in the near future:
// http://jshint.com/docs/options/

// "variable: true" here indicates that the variable is writable (i.e. NOT read only).
// TODO: Remove some of these. Too many! Some could be passed as parameters!
/*global distanceBetweenAbs, doAI, debug: true, cameraFollow, infiniteCamera, getOrganismProperties, settings*/



function changeLevel(game, toLevel) {
  
  "use strict";
  
  var i, organism;
  
  // Reset the colour of all organisms on the current level
  // (some of them might be angry red!)
  for (i = 0; i < game.levels[game.currentLevel].organisms; i++) {
    organism = game.levels[game.currentLevel].organisms[i];
    organism.color = getOrganismProperties(organism.type);
  }
  
  game.levels[game.currentLevel].organisms.shift();
  game.currentLevel += toLevel;
  game.levels[game.currentLevel].organisms.unshift(game.player);
  
}



function checkForNoms(organism, player) {
  
  "use strict";
  
  var i, playerMouth, organismHP, organismMouth, playerHP;

  // Both checks could be combined... maybe. But for now we're doing them sepatately:
  
  // Do the player eating the organism's HP check first:

  for (i = 0; i < organism.hpPoints.length && player.mouth[0] && player.lastAte <= 0; i++) {

    playerMouth = {
      x: player.x + player.mouth[0].x,
      y: player.y + player.mouth[0].y
    };

    organismHP = {
      x: organism.x + organism.hpPoints[i].x,
      y: organism.y + organism.hpPoints[i].y
    };

    if ((distanceBetweenAbs(playerMouth, organismHP) < player.mouth[0].size) &&
        (organism.hpPoints[i].value > 0) &&
        (player.lastAte <= 0)) {

      //console.log(player.lastAte);
      //console.log("Nomming");
      player.lastAte = 40;
      
      //console.log("Trying to close a mouth?")
      player.moveMouth(-26);
      
      switch (organism.type) {
          
        // Be careful with the level ups and downs. If a level down is eaten
        // on level 0, bad things could happen...
          
        case "levelUp"   : changeLevel(game, +1); break;
          
        case "levelDown" : changeLevel(game, -1); break;
          
        default :
            
          if (organism.tail && i === organism.hpPoints.length) {
            organism.hpPoints.pop();
          } else {
            organism.hpPoints[i].value--;
          }

          if (organism.getCurrentHP() === 0) {
            organism.alive = false;
          }

          if (player.getCurrentHP() < player.maxHP) {
            // Top up the players HP
            player.addHP();
          } else if (player.levelCap < game.currentLevel) {
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
          
          break;
          
      }

    }

  }

  // Do the organism nomming the player's HP second:
    
  for (i = 0; (i < player.hpPoints.length) &&
              (organism.mouth[0] && organism.lastAte <= 0); i++) {

    organismMouth = {
      x: organism.x + organism.mouth[0].x,
      y: organism.y + organism.mouth[0].y
    };

    playerHP = {
      x: player.x + player.hpPoints[i].x,
      y: player.y + player.hpPoints[i].y
    };

    if (player.hpPoints[i].value > 0 &&
        distanceBetweenAbs(organismMouth, playerHP) < player.mouth[0].size) {

      organism.lastAte = 40; // This value could be per-organism, letting some eat quicker.
      
      organism.moveMouth(-26);

      if (organism.getCurrentHP() < organism.maxHP) {
        organism.addHP();
      }

      player.hpPoints[i].value--;
      
      //console.log(player.hpPoints);
      //console.log(player.getCurrentHP());
      
      if (player.getCurrentHP() === 0) {
        // You dead. Well not really.
        //console.log("Trying to devolve");
        player.devolve();
        changeLevel(game, -1);
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
  
  var i, organism, distanceToPlayer;
  
  // Update everthing on the current game level:
  
  for (i = 0; i < game.levels[game.currentLevel].organisms.length; i++) {
    
    organism = game.levels[game.currentLevel].organisms[i];
    
    // If not the player, and the organism is alive, and organism has AI of some sort:
    if (i !== 0 && organism.alive && organism.ai) {
      
      doAI(game.width, game.height, organism, updateAmount, game.player); // TODO: This needs a better name!
      
    }
  
    // Check if the organism is nomming the player, or being nommed itself:
    // Also had "is kind of near the player" check here too, but it didn't actually
    // help performance, and that distance became unreliable with snakes.
    if (i !== 0 &&          // Isn't the player
        organism.visible && // Is on the camera
        organism.alive) {   // Is Alive

      checkForNoms(organism, game.player);
      
    }
      
    if (organism.lastAte && organism.lastAte >= 0) {
      organism.lastAte -= updateAmount;
      // Check if it can eat again:
      if (organism.lastAte && organism.lastAte < 0) {
        organism.moveMouth(26);
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
  
  for (i = 0; i < game.levels[game.currentLevel+1].organisms.length; i++) {
    
    organism = game.levels[game.currentLevel+1].organisms[i];
    
    // If not the player, and the organism is alive, and organism has AI of some sort:
    if (i !== 0 && organism.alive && organism.ai) {
      
      doAI(game.width, game.height, organism, updateAmount); // TODO: This needs a better name!
      
    }
    
    if (organism.lastAte && organism.lastAte >= 0) {
      organism.lastAte -= updateAmount;
      // Check if it can eat again:
      if (organism.lastAte && organism.lastAte < 0) {
        organism.moveMouth(26);
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
      updateAmount = parseFloat(deltaTime) / (1/60 * 1000),
      organism;
  
  // This is a magic line of code which neither JSLint, nor myself understand anymore:
  if (!(updateAmount > 0) || updateAmount < 1) { updateAmount = 1; }
  
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
    if (game.keys.indexOf('◀') >= 0) {
      game.player.angularVelocity -= 0.5 * updateAmount;
    }
    if (game.keys.indexOf('▶') >= 0) {
      game.player.angularVelocity += 0.5 * updateAmount;
    }
    if (game.keys.indexOf('▲') >= 0) {
      game.player.accelerate(updateAmount);
      game.player.showSpeedLines = true;
    } else {
      game.player.showSpeedLines = false;
    }
  
    // Space key for debugging.. or if I want to add an ability thing:
    if (game.keys.indexOf('␣') >=0) {
      game.keys.splice(game.keys.indexOf('␣'), 1);
      //game.player.moveMouth(-26);
      //settings.glowy.value = !settings.glowy.value;
      //settings.webGL.value = false;
      //console.log("space pressed");
      createParticleBurst(game.levels[game.currentLevel], game.player, game.player.color, 2, 29);
    }
  
    if (debug) {
      if (game.keys.indexOf('?') >= 0) {
        debug = false;
        document.getElementById("debug").style.display = "none";
        game.keys.splice(game.keys.indexOf('?'), 1);
      }
    } else {
      if (game.keys.indexOf('?') >= 0) {
        debug = true;
        document.getElementById("debug").style.display = "block";
        game.keys.splice(game.keys.indexOf('?'), 1);
      }
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