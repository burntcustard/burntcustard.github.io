/*jslint debug: true, white: true*/

var game = {};

var cursors;
var debug = false;
var debugCounter = 0; // Stop the debug update so frequently

var player;

var canvas;
var ctx;
var glCanvas;
var texture;

var time, oldTime, deltaTime = 0;

var evenFrame;

// Zoom might be based off a setting, scroll wheel input,
// level number, etc. For now it's just stuck as 1.
var zoom = 1;


function create() {
  
  var coords;

  game = {
  
    // Width and height (more like radius actually) of the "game board":
    width: 2000,
    height: 2000,

    // Width, height, & coords of the top-left corner of the "camera":
    camera: {
      width: canvas.width,
      height: canvas.height,
      x: 0,
      y: 0
    },

    // An array of strings defining which keyboard keys are pressed:
    keys: [],
    
    // A touch object with screen-based x & y coords:
    touch: {
      active: false,
      x: 0,
      y: 0
    },
    
    // A bunch of levels:
    levels: [],

    // The level the player is currently on:
    currentLevel: 0,

    paused: false
  
  };
  
  // Line width for EVERYTHING is 2. Apart from the map lines,
  // but gets reset to 2 after those are drawn anyway:
  ctx.lineWidth = 2;

  // Get/generate info about all the levels:
  game.levels = generateLevels();

  // Make a player:
  game.player = new Organism("banana-xl", 0, 0);
  game.player.assignPlayerProperties();

  // Player is now organism[0]. The original and the best.
  game.levels[0].organisms.unshift(game.player);

  // Initialise the camera and make it follow the player:
  initCamera(game.camera, game.player);
  
  // Make sure there's a levelUp on the screen when the game starts.
  // This is done here because it needs to be done after
  // everything else has already been set up (mainly the camera).
  coords = randomCoords(
    (game.camera.width  / 2) - game.camera.deadzone,
    (game.camera.height / 2) - game.camera.deadzone
  );
  
  game.levels[0].organisms.push(new Organism(
    "levelUp",
    coords.x,
    coords.y
  ));

}



function main(tFrame) {
  
  // If the game was paused):
  if (game.paused) {
    oldTime = tFrame;
    game.paused = false;
  }
  
  game.stopMain = window.requestAnimationFrame(main);

  update(game, tFrame);
  render(tFrame, ctx, game, time, deltaTime);
  
}



function pause() {
  
  if (game.paused) {
    // Start looping again:
    main();
  } else {
    // Cancel the game loop:
    window.cancelAnimationFrame(game.stopMain);
    // Game was running, now it's paused:
    game.paused = true;
  }
  
}



function resizeCanvas() {
  
  var aspectRatio =  window.innerWidth / window.innerHeight;
  
  console.log("Aspect ratio: " + aspectRatio);

  if (window.innerHeight > window.innerWidth) {
    canvas.height = 640 * zoom;
    canvas.width = canvas.height * aspectRatio;
  } else {
    canvas.width = 640 * zoom;
    canvas.height = canvas.width / aspectRatio;
  }
  
  //canvas.width = window.innerWidth;
  //canvas.height = window.innerHeight;
  
  if (game && game.camera) {
    game.camera.width = canvas.width;
    game.camera.height = canvas.height
  }

}



window.onload = function () {
  
  "use strict";

  // Set up canvas(es):
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  resizeCanvas();

  // Set up WebGL (if supported):
  if (settings.webGL.value) {
    if (addWebGLCanvas()) {
      glCanvas.addEventListener('touchstart' , touchInput, false);
      glCanvas.addEventListener('touchmove'  , touchInput, false);
      glCanvas.addEventListener('touchcancel', touchStop , false);
      glCanvas.addEventListener('touchend'   , touchStop , false);
    } else {
      canvas.addEventListener('touchstart' , touchInput, false);
      canvas.addEventListener('touchmove'  , touchInput, false);
      canvas.addEventListener('touchcancel', touchStop , false);
      canvas.addEventListener('touchend'   , touchStop , false);
    }
  }
  
  // Add event listeners (the input ones should be in the input file!):
  window.addEventListener('resize', resizeCanvas, false);



  // Create a new game:
  create();

  // Start the game:
  main();

};

