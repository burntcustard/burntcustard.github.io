var game,
    whale,            // You are a whale
    sky,              // The background
    clouds,           // A cloud
    foods,            // The things you nom to get points
    boom,             //
    mountains,        //
    score,            // Players score
    scoreText,        //
    stateText,        //
    fullText,         //
    tutText,          //
    vSpeed = 99,      // Speed you are "falling" at
    foodSpeed = 99,   // Speed of the foods coming towards you
    betweenFoods = 99,// Space between the foods 
    timer = 0,        //
    total = 0,        //
    impact,           //
    cursors,          //
    pixelArtScale = 6,//
    gameOver = false, //
    whaleCG,
    foodsCG,
    direction;        // Which way you're going (left or right or neither)



window.onload = function() {
  // Create a 320x480 game:
  game = new Phaser.Game(540, 960, Phaser.AUTO, "");
  
  game.state.add("PlayGame", playGame);
  //game.state.add("GameOver", gameOver);
  
  // Initial state:
  game.state.start("PlayGame");
};



var playGame = function(game){};

playGame.prototype = {
  
  // Load images:
  preload: function() {
    game.load.image("sky", "sky.png");
    game.load.spritesheet("whale", "whale.png", 14, 36, 9);
    game.load.image("food", "food.png");
    game.load.image("mountain", "mountains.png"); // <-- Note the s'
    //game.load.image("gound", "ground.png");
    game.load.image("cloud1", "cloud1.png");
    game.load.spritesheet("impact", "impact.png", 40, 32);
  },
  
  create: function() {
    
    // Fullscreen testing:
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.input.onDown.add(maybeToggleFull, this);
    game.scale.onFullScreenChange.add(onChangeFullScreen, this);
    
    // Enable P2
    game.physics.startSystem(Phaser.Physics.P2JS);

    //  Turn on impact events for the world, without this we get no collision callbacks
    game.physics.p2.setImpactEvents(true);
    
    //  Create our collision groups. One for the whale, one for the foods
    whaleCG = game.physics.p2.createCollisionGroup();
    foodsCG = game.physics.p2.createCollisionGroup();
    
    //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
    //  (which we do) - what this does is adjust the bounds to use its own collision group.
    game.physics.p2.updateBoundsCollisionGroup();
    
    game.physics.p2.gravity.y = 250;
    
    cursors = game.input.keyboard.createCursorKeys();
    game.inputEnabled = true;
    
    //  Modify the world and camera bounds
    game.world.resize(9999, 40000); // Don't ask how I came up with these numbers...
    
    // Create all the things. Z-index is based on order here!
    sky = game.add.sprite(0, 0, "sky");
    sky.scale.setTo(game.world.width, 40);
    createClouds();
    foods = game.add.group();
    createStartText();
    createWhale();
    createMountains();
    
  },
  
  update: function() {

    // Left and right arrow keys. Happens twice to make 2x as sensitive.
    if (cursors.left.isDown) {
      spinWhale('l');
      spinWhale('l');
    }
    if (cursors.right.isDown) {
      spinWhale('r');
      spinWhale('r');
    }
    
    // Check if touched/clicked on left or right half of canvas
    if (game.input.activePointer.isDown) {
      if (game.input.x < game.width / 2) {
        spinWhale('l');
      } else {
        spinWhale('r');
      }
    }
    
    reduceWhaleSpin();
    
    whaleDrift();
    
    var maxVelocity = 1350;
    foods.forEach(function(aFood) {
      if (aFood.body.velocity.y > maxVelocity) {
        aFood.body.velocity.y = maxVelocity;
        //console.log('Maxvel');
      }
    });
    
    if (timer > 50) {
      addFood();
      timer = 0;
    } else {
      timer++;
    }
    
    // Update anything that's in the background "fake perspective/parallax",
    //  - Based off whale's speed. Checks if whale is "dead" in a crappy way :(
    if (whale.body.y < (game.world.height - 36 * pixelArtScale)) {
      // The higher the number here, the faster you'll fly past the things:
      clouds.y += (whale.body.velocity.y / 70);
      clouds.x += (whale.body.velocity.x / 90);
    }
      
    //console.log(whale.body.y);
    
    // GAME OVER?: (7 is 1/2 whales girth because reasons)
    if (whale.body.y >= (game.world.height - 7 * pixelArtScale)) {
      
      if (gameOver === false) {
        impact = game.add.sprite(
          (game.width / 2 - 36 * pixelArtScale),
          (game.height - 78 * pixelArtScale),
          "impact"
        );
        game.world.bringToTop(mountains); // The mountains should be in front?
        impact.fixedToCamera = true;
        impact.scale.set(pixelArtScale * 2);
        impact.smoothed = false;
        boom = impact.animations.add("boom");
        impact.animations.play("boom", 30, false); // False so no loop.
        killWhale();
        stateText.text = ("You headbutted " + score + " petunias!\nPress both <> or tap to restart");
        stateText.visible = true;
        
        game.input.onDown.addOnce(restartGame);
        
        gameOver = true;
      
      }

      // The "click to restart" handler(s):
      if (cursors.left.isDown && cursors.right.isDown) {
        restartGame();
      }
      
    }
    
  },
  
  render: function() {

    //game.debug.cameraInfo(game.camera, 32, 32);
    //game.debug.spriteCoords(whale, 32, 500);
    //game.debug.pointer(game.input.pointer1);
    
  }
  
};

function createStartText() {
  scoreText = game.add.text(
    16,
    16,
    'Score: 0',
    { font: '32px Arial', fill: '#fff' });
  scoreText.fixedToCamera = true;

  fullText = game.add.text(
    (game.width - 16),
    (16),
    '-Fullscreen-',
    { font: '32px Arial', fill: '#fff', align: 'right' }
  );
  fullText.fixedToCamera = true;
  fullText.anchor.x = 1;

  tutText = game.add.text(
    (game.world.width / 2),
    (game.height / 2),
    '< Arrow keys or touch >',
    { font: '30px Arial', fill: '#fff', align: 'center' }
  );
  tutText.anchor.x = 0.5;
  tutText.anchor.y = 0.5;

  score = 0;

  stateText = game.add.text(
    (game.width / 2),
    (game.height / 2),
    ' ',
    { font: '36px Arial', fill: '#fff', align: 'center' }
  );
  stateText.anchor.x = 0.5;
  stateText.anchor.y = 0.5;
  stateText.fixedToCamera = true;
  stateText.visible = false;
}

function maybeToggleFull(pointer) {

  // If you poke the top 1/8th of the screen, it goes into fullscreen mode.
  if (pointer.y < game.height / 10) {
    if (game.scale.isFullScreen) {
      game.scale.stopFullScreen();
    } else {
      game.scale.startFullScreen(false);
    }
  }

}

function onChangeFullScreen(scale) {
  if (scale.isFullScreen) {
    //onEnterFullScreen();
  } else {
    killWhale();
    game.world.resize(9999, 40000); // Don't ask how I came up with these numbers...
    game.physics.setBoundsToWorld();
    game.physics.p2.updateBoundsCollisionGroup();
    whaleCG = game.physics.p2.createCollisionGroup();
    foodsCG = game.physics.p2.createCollisionGroup();
    restartGame();
  }
}

function whaleDrift() {

  var tmpAngle,
      wAngle = whale.body.angle,
      hSpeed = 6; // The speed you go when trying to go sideways by being diagonal.
  
  // Drift left or right:
  switch (true) {
    case (whale.body.angle < 0 && whale.body.angle > -90):
      tmpAngle = wAngle+45;
      tmpAngle = 45 - Math.abs(tmpAngle);
      whale.body.moveRight(tmpAngle * hSpeed);
    break;
    case (whale.body.angle < 0 && whale.body.angle < -90):
      tmpAngle = wAngle+135;
      tmpAngle = 45 - Math.abs(tmpAngle);
      whale.body.moveLeft(tmpAngle * hSpeed);
    break;
    case (whale.body.angle > 0 && whale.body.angle < 90):
      tmpAngle = wAngle-45;
      tmpAngle = 45 - Math.abs(tmpAngle);
      whale.body.moveLeft(tmpAngle * hSpeed);
    break;
    case (whale.body.angle > 0 && whale.body.angle > 135):
      tmpAngle = wAngle-135;
      tmpAngle = 45 - Math.abs(tmpAngle);
      whale.body.moveRight(tmpAngle * hSpeed);
    break;
  }
  
  // Increase or decrease terminal velocity depending on angle:
  tmpAngle = wAngle;
  tmpAngle = Math.abs(tmpAngle);
  tmpAngle -= 90;
  tmpAngle = Math.abs(tmpAngle);
  
  var airResistance = 30; // The amount that being straight down speeds you up
  var terminalVelocity = 999 + (tmpAngle * airResistance);

  if (whale.body.velocity.y > terminalVelocity) {
    whale.body.velocity.y = terminalVelocity;
  }
  
}
    
function spinWhale(e) {
  var maxRPM = 8;
  if (e === 'l') {
    if (whale.body.angularVelocity > -maxRPM) { whale.body.angularVelocity-=0.1; }
  } else {
    if (whale.body.angularVelocity < +maxRPM) { whale.body.angularVelocity+=0.1; }
  }
}

function reduceWhaleSpin() {
  var damping = 0.02;
  if (whale.body.angularVelocity > 0) {
    whale.body.angularVelocity-=damping;
  }
  if (whale.body.angularVelocity < 0) {
    whale.body.angularVelocity+=damping;
  }
}

function addFood() {
  var food = foods.create(
    (Math.random() * game.width * 2) + whale.body.x - game.width,
    whale.body.y + game.height * 2,
    "food"
  );
  food.scale.set(pixelArtScale);
  food.smoothed = false;
  game.physics.p2.enable(food);
  
  //  Tell the food to use the foodCollisionGroup 
  food.body.setCollisionGroup(foodsCG);

  //  If you don't set this they'll not collide with anything.
  //  The first parameter is either an array or a single collision group.
  food.body.collides([foodsCG, whaleCG]);
  
  food.lifespan = 20000;
  food.angle = game.rnd.angle();
  food.body.angularVelocity = Math.random()*8;
  //food.body.velocity.y = 120;
  //console.log("New food created at: " + food.body.x + "," + food.body.y);
}

function collectFood(body1, body2) {
  body2.sprite.kill();
  score++;
  scoreText.text = 'Score: ' + score;
}

function restartGame() {

  //  A new level starts
  console.log("Restarting the game");
  
  score = 0; // Reset the score;
  scoreText.text = "Score: 0";
    
  // Remove all of the foods:
  foods.removeAll();

  // Put the clouds back up in the sky (yes, this is a thing):
  clouds.removeAll();
  createClouds();
  
  // Make a new whale for the player to control:
  createWhale();

  // Put the mountains back on top of everything:
  game.world.bringToTop(mountains);

  // Hides game over text:
  stateText.visible = false;
  
  gameOver = false;

}

function createMountains() {
  mountains = game.add.group();
  for (i = 0; i < game.world.width; i+=100*pixelArtScale) {
    var mountain = mountains.create(
      i,
      game.world.height - 100 * pixelArtScale,
      "mountain"
    );
    mountain.scale.set(pixelArtScale);
    mountain.smoothed = false;
  }
}

function createClouds() {
  // Temporary cloud testing until I've got a better way to do it (TODO):
  clouds = game.add.group();
  // The number here is the number of clouds placed vertically:
  for (i = 0; i < game.world.width; i+=(80*pixelArtScale)) {
    var cloud = clouds.create(
      i,
      (game.world.height / 8), // Clouds are 1/x of way down the game world.
      "cloud1"                 //  - but remember they "parallax" down further!
    );
    cloud.scale.set(pixelArtScale);
    cloud.smoothed = false;
  }
  for (i = (30 * pixelArtScale); i < game.world.width; i+=(80 * pixelArtScale)) {
    var cloud = clouds.create(
      i,
      (game.world.height / 8.5), // Clouds are 1/x of way down the game world.
      "cloud1"                 //  - but remember they "parallax" down further!
    );
    cloud.scale.set(pixelArtScale);
    cloud.smoothed = false;
  }
}

function createWhale() {
  whale = game.add.sprite(game.world.width / 2, 150, "whale");
  whale.scale.set(pixelArtScale);
  whale.smoothed = false;
  var wiggle = whale.animations.add("wiggle");
  whale.animations.play("wiggle", 30, true);
  whale.anchor.set(0.5);
  game.physics.p2.enable(whale);
  whale.body.collideWorldBounds = true;
  game.camera.follow(whale);
  whale.body.velocity.y = 200;
  whale.body.createBodyCallback(foods, collectFood, this);

  //  Tell the whale to use the whaleCollisionGroup 
  whale.body.setCollisionGroup(whaleCG);

  //  If you don't set this they'll not collide with anything.
  //  The first parameter is either an array or a single collision group.
  whale.body.collides(foodsCG, collectFood, this);
}

function killWhale() {
  game.camera.follow(); // Unlock camera, can't kill the old whale without this
  whale.kill(); // Kill old whale - could use destroy coz this doesn't completely remove?
}