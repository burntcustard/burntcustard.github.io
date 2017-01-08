/*jslint debug: true, white: true, browser: true*/

/*global generateLevels, Organism, initCamera, randomCoords, update, render, settings, addWebGLCanvas, touchInput, touchStop, Audio*/



// Game object to hold the many, many game related variables.
// Ideally this would NOT be a global variable, however it is
// right now, mostly for convenience.
var game = {};

// Is debug info visible, and how many frames since it was last updated:
var debug = false;
var debugCounter = 0; // Stop the debug update so frequently

// Canvas related variables:
var canvas;   // The base canvas.
var ctx;      // Context of the base canvas.
var glCanvas; // The WebGL canvas
var texture;  // Contains the base canvas as an image. kind of. See shader.js

// Variables to hold all of the sounds used.
// Currently only one test sound from https://www.soundjay.com/beep-sounds-1.html
// TODO: Implement different sounds for different actions, as well as music... so er not much.
// Doesn't seem to work on mobiles. It would be good to do audio "properly" with the Web Audio API,
// which would even allow sounds to be "made" rather than using lots of seperate mp3s.
var audioBleep = new Audio('audio/beep.mp3');

// Time variables to keep track of how long each update takes:
var time, oldTime, deltaTime = 0;

// A bool which toggles every time requestAnimationFrame is called.
// Because the browser will try to run the game at 60FPS, this lets
// some actions/updates occur 30 times a second rather than 60.
var evenFrame;

// Zoom might be based off a setting, scroll wheel input,
// level number, etc. For now it's just stuck as 1.
var zoom = 1;



function create() {
  
  "use strict";
  
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

    // The current level being viewed, and
    // probably the level the player is currently on:
    currentLevel: 0,

    paused: false
  
  };
  
  // Line width for EVERYTHING is 2. Apart from the map lines,
  // but gets reset to 2 after those are drawn anyway:
  ctx.lineWidth = 2;

  // Get/generate info about all the levels:
  game.levels = generateLevels();

  // Make a player:
  game.player = new Organism("kite-s", 0, 0);
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
  
  "use strict";
  
  // If the game was paused):
  if (game.paused) {
    oldTime = tFrame;
    game.paused = false;
  }
  
  game.stopMain = window.requestAnimationFrame(main);

  update(game, tFrame);
  render(tFrame, ctx, game, time, deltaTime);
  
}


/**
 * Toggles if the game is pauseed or not.
 */
function pause() {
  
  "use strict";
  
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


/**
 * Resizes the canvas to fit the size of the window.
 */
function resizeCanvas() {
  
  "use strict";
  
  var aspectRatio =  window.innerWidth / window.innerHeight;
  
  if (window.innerHeight > window.innerWidth) {
    canvas.width = 600 * zoom;
    canvas.height = Math.ceil(canvas.width / aspectRatio);
  } else {
    canvas.height = 600 * zoom;
    canvas.width = Math.ceil(canvas.height * aspectRatio);
  }
  
  if (game && game.camera) {
    game.camera.width = canvas.width;
    game.camera.height = canvas.height;
  }

}



window.onload = function () {
  
  "use strict";

  // Set up canvas(es):
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  resizeCanvas();

  // If the graphics settings say WebGL should be on:
  if (settings.webGL.value) {
    
    // Try to initialise the WebGL canvas, and if successfull, add the
    // touch event listeners to it. Otherwise, add them to the base canvas:
    // TODO: Make an "addEventListeners" function to tidy this up.
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
  
  // Resize the canvas if the window is resized:
  window.addEventListener('resize', resizeCanvas, false);

  // Create a new game:
  create();

  // Start the game:
  main();

};

