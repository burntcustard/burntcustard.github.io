var CAMERAWIDTH = 900;
var CAMERAHEIGHT = 600;
var GAMEWIDTH = CAMERAWIDTH * 4;
var GAMEHEIGHT = CAMERAHEIGHT * 4;
var cursors;
var debug = true;

// Functions that may end up in a "helper function file" of sorts:
function fixRotation(rotation) {  return rotation + 1.57079633; }

if (!Array.prototype.last) {
  Array.prototype.last = function() {
    return this[this.length - 1];
  };
}

if (!Array.prototype.toPoints) {
  Array.prototype.toPoints = function() {
    var pointsArray = [];
    var tmpPoint = {x: 0, y: 0};
    for (var i = 0; i < this.length; i += 2) {
      tmpPoint.x = this[i];
      tmpPoint.y = this[i + 1];
      pointsArray.push(JSON.parse(JSON.stringify(tmpPoint)));
    }
    return pointsArray;
  }
}


function randomCoords() {
  return {
    x: (Math.random() * GAMEWIDTH) - (GAMEWIDTH/2),
    y: (Math.random() * GAMEHEIGHT) - (GAMEHEIGHT/2)
  };
}


// TODO: Have different graphics settings:
//       "high" (WebGL), "low" (canvas), auto (probably WebGL).
var game = new Phaser.Game(CAMERAWIDTH, CAMERAHEIGHT, Phaser.CANVAS, 'phaser', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

function preload() {

}

function create() {

  //  Add some controls to play the game with
  cursors = game.input.keyboard.createCursorKeys();
  
  game.world.setBounds(
    -(parseInt(GAMEWIDTH / 2)),
    -(parseInt(GAMEHEIGHT / 2)),
    GAMEWIDTH,
    GAMEHEIGHT
  );
  
  
  // Map stuffs.
  var mapLineVertical = game.add.graphics(-GAMEWIDTH, -GAMEHEIGHT);
  mapLineVertical.lineStyle(2, colorToInt("#606"), 0.5);
  for (var i = -GAMEWIDTH; i < GAMEWIDTH * 2; i += 80) {
    mapLineVertical.moveTo(i, -(GAMEHEIGHT));
    mapLineVertical.lineTo(i,  (GAMEHEIGHT * 2));
  }
  
  var mapLineHorizontal = game.add.graphics(-GAMEWIDTH, -GAMEHEIGHT);
  mapLineHorizontal.lineStyle(2, colorToInt("#666"), 0.5);
  for (var i = -GAMEHEIGHT; i < GAMEHEIGHT * 2; i += 80) {
    mapLineHorizontal.moveTo(-(GAMEWIDTH), i);
    mapLineHorizontal.lineTo( (GAMEWIDTH * 2), i);
  }
  
  // Performance testing:
  // TODO?
  
  // Enable physics.
  // TODO: Investigate other Phaser physics or making a new one.
  game.physics.startSystem(Phaser.Physics.ARCADE);  
  
  player = game.add.sprite(0, 0);
  
  player.setCreature(game, "kite-l", "#0f1");
  
  // Set the player's maximum rotation speed higher so
  // controlling the creature is a bit more responsive:
  player.body.maxAngular *= 2;

  initCamera(CAMERAWIDTH, CAMERAHEIGHT, player, game);
  
  creatures = new Phaser.SpriteBatch(game);
  
  for (var i = 0; i < 29; i++) {
    
    creatures.create(randomCoords().x, randomCoords().y);
    creatures.children.last().setCreature(game, "kite-xs", "#f60");
    
    creatures.create(randomCoords().x, randomCoords().y);
    creatures.children.last().setCreature(game, "kite-s", "#f60");
    
  }
  
}



function startGame() {
  // Game should start when the page loads automagically,
  // and may not need restarting...
}



function update() {
  
  if (game.input.activePointer.withinGame) {
    
    // Mouse pointer and touch input movement
    
    var distanceFromPointer = Math.floor(game.physics.arcade.distanceToPointer(player));
    
    if (distanceFromPointer > 30) {
      player.move(game, "accelerate", "towards", "pointer");
    } else {
      player.move(game, "", "towards", "pointer");
    }
    
  } else {
    
    // Keyboard up/down/left/right input:
    if (cursors.left.isDown) {
      player.body.angularVelocity -= 99;
    }
    if (cursors.right.isDown) {
      player.body.angularVelocity += 99;
    }
    if (cursors.up.isDown) {
      player.move(game, "accelerate");
    } else {
      player.move();
    }
    
  }
  
  
  // AI testing AND OCCLUSION CULLING SNEAKED IN
  
  // Size seems correct, but maybe not measured from center of sprite?
  
  for (var i = 0; i < creatures.children.length; i++) {
    var creature = creatures.children[i];
    var s = creature.size * 2;
    if (creature.visible) {
      if (creature.x < game.camera.x - s ||
          creature.y < game.camera.y - s ||
          creature.x > game.camera.x + game.camera.width + s ||
          creature.y > game.camera.y + game.camera.height + s) {
        creature.visible = false;
      } 
    } else if (creature.alive &&
               creature.x > game.camera.x - s &&
               creature.y > game.camera.y - s &&
               creature.x < game.camera.x + game.camera.width + s &&
               creature.y < game.camera.y + game.camera.height + s) {
      creature.visible = true;  
    }

    if (creature.ai) {
      var distanceToPlayer = game.physics.arcade.distanceBetween(creature, player);
      if (creature.ai.viewDistance && distanceToPlayer < creature.ai.viewDistance + creature.size) {
        // Player is in range of the player, do something!
        if (creature.ai.behaviour === "aggressive") {
          creature.move(game, "accelerate", "towards", player);
        } else if (creature.ai.behaviour === "flee") {
          creature.move(game, "accelerate", "away", player);
        }
      } else {
        // Make the AI move somewhere random?
        if (!creature.ai.target || creature.ai.targetCount > 80) {
          //console.log("Came up with random coords " + randomCoords.x + ", " + randomCoords.y);
          creature.ai.target = randomCoords();
          creature.ai.targetCount = 0;
        } else {
          creature.ai.targetCount++;
        }
        creature.move(game, "accelerate", "towards", creature.ai.target);
      }
    }
  }
  
  // Dodgy WIP collision checking:
  
  for (var i = 0; i < creatures.children.length; i++) {
    var creature = creatures.children[i];
    
    // Check if enemy x/y is at around the same place as player mouth
    var x = player.children[1].worldPosition.x;
    var y = player.children[1].worldPosition.y;
    var distanceBetweenMouthAndHP = Phaser.Math.distance(x, y, creature.worldPosition.x, creature.worldPosition.y);
    if(distanceBetweenMouthAndHP && distanceBetweenMouthAndHP < 15) {
      //console.log("Something dead at: " + Math.round(creature.worldPosition.x) + ", " + Math.round(creature.worldPosition.y));
      //console.log("While the player was at: " + Math.round(player.worldPosition.x) + ", " + Math.round(player.worldPosition.y));
      //console.log("While the player's mouth was at: " + player.children[1].worldPosition.x + ", " + player.children[1].worldPosition.y);
      //creature.alive = false;
      //creature.visible = false;
      creature.destroy();
      var deathGraphic = game.add.graphics(creature.x, creature.y);
      deathGraphic.beginFill(colorToInt("#f00"), 1);
      deathGraphic.drawCircle(0, 0, 4);
      player.addHP(game);
    }
    
    // Each of the players HP dots check against enemy mouths
    if (creature.mouth[0] && creature.lastAte == null || game.time.elapsedSecondsSince(creature.lastAte) >= 1) {
      for (var j = 2; j < player.children.length; j++) {
        if (player.hpPoints[j-2] && player.hpPoints[j-2].value > 0) {
          var xHP = player.children[j].worldPosition.x;
          var yHP = player.children[j].worldPosition.y;
          var distanceBetweenHPandMouth = Phaser.Math.distance(xHP, yHP, creature.worldPosition.x, creature.worldPosition.y);
          if(distanceBetweenHPandMouth && distanceBetweenHPandMouth < 15) {
            player.hpPoints[j-2].value--;
            player.drawHP(game);
            creature.lastAte = game.time.time;
          }
        }
      }
    }
  }
  
  
  // TODO: Gamepad input
  
}

function render() {

  if (debug === true) {
    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.pointer(this.game.input.activePointer);
    game.debug.bodyInfo(player, 32, 480);
  }
  
}