/*jslint debug: true, white: true*/

var game = {
  
  // Width and height (more like radius actually) of the "game board":
  width: 2000,
  height: 2000,
  
  // Width, height, & coords of the top-left corner of the "camera":
  camera: {
    width: 300,
    height: 533,
    x: 0,
    y: 0
  },
  
  // An array of strings defining which keyboard keys are pressed:
  keys: [],
  
  // A bunch of levels:
  levels: [],
  
  // The level the player is currently on:
  currentLevel: 0
  
};

var cursors;
var debug = false;
var debugCounter = 0; // Stop the debug update so frequently

var player;

var canvas;
var ctx;
var glCanvas;
var texture;

var time, oldTime, deltaTime = 0;

window.onload = function () {

canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');

function resizeCanvas() {
  
  // Set the size of the canvas:
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Set the size of the "camera":
  // TODO: Think about zooming.
  game.camera.width = canvas.width;
  game.camera.height = canvas.height;
  
}
  
window.addEventListener('resize', resizeCanvas, false);

resizeCanvas();



function create() {
  
  // Get/generate info about all the levels:
  game.levels = generateLevels();
  
  game.player = new Organism("kite-m", 0, 0);
  
  game.player.assignPlayerProperties();
    
  // Player is now organism[0]. The original and the best.
  game.levels[0].organisms.unshift(game.player);
  
  initCamera(game.camera, game.player);
  
}



function startGame() {
  // Game should start when the page loads automagically,
  // and may not need restarting...
} 
  
addWebGLCanvas();
  
create();
  
function main(tFrame) {
  game.stopMain = window.requestAnimationFrame( main );

  update(game, tFrame);
  render(tFrame, ctx, game, time, deltaTime);
}

main();

  
};