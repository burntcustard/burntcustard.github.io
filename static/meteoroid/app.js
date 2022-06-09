/*jslint white: true, browser: true, devel: true*/

/*global initialize, generateLevel, drawPlanets, inputs, update, render, Meteor, inputStart, inputMove, inputRelease, gameLoop, renderInput, drawDynamicUI*/


var versionNumber = 0.1;

var Game = {};

// Variables to hold canvas info:
var planetCanvas,
    meteorCanvas,
    uiStaticCanvas,
    uiDynamicCanvas,
    planetCtx,
    meteorCtx,
    uiStaticCtx,
    uiDynamicCtx,
    
    // A "base unit" variable which is kinda a unit of distance measurement.
    // It's 0.1% of the length of the game if it were a square, or for
    // example 0.05% of the length of the game if the game was twice as 
    // wide as it were tall. Todo: explain this better.
    baseUnit,
    
    // Level variables:
    levels,
    currentLevel,
    
    // Input variables:
    input = {
      active: false,
      visible: false,
      start: {x: 0, y: 0},
      end  : {x: 0, y: 0}
    },

    // Time/step variables
    oldTime = 0,
    deltaTime = 0;

// Super Sampling Anti Aliasing. Renders canvas(es) at x times the size
// of the view (i.e. 2x1080p=2160p), reducing "fuzziness" caused by
// canvases shitty anti-aliasing, but at significant performance cost.
var SSAA = 1;



document.addEventListener("DOMContentLoaded", function(event) {
  initialize(SSAA);
});




function startLevel(levelNumber) {
  
  var meteor = new Meteor();
  
  // Generate the level:
  levels.push(generateLevel(
    levelNumber,
    planetCanvas.width,
    planetCanvas.height
  ));
  
  // Set the game's current level to the new level:
  currentLevel = levelNumber;
  
  // Erase old and draw the new level:
  planetCtx.clearRect(0, 0, planetCanvas.width, planetCanvas.height);
  drawPlanets(planetCtx, levels[currentLevel].planets);
  
  // Add a meteor for the player to control (it'll be hidden initially):
  levels[currentLevel].meteor = meteor;
  
  gameLoop();
  
}



function newGame() {
  
  "use strict";
  
  levels = [];
  
  // Draw the static UI:
  drawStaticUI(uiStaticCtx, uiStaticCanvas.width, uiStaticCanvas.height);
  
  // Add event listeners so the meteor canvas can be clicked/dragged on:
  // Todo: separate this into something in the input file?
  meteorCanvas.addEventListener("mousedown", function(event) {
    inputStart(event, input);
  });
  meteorCanvas.addEventListener("mousemove", function(event) {
    inputMove(event, input);
  });
  meteorCanvas.addEventListener("mouseup", function(event) {
    inputRelease(event, input);
  });
  /*
  meteorCanvas.addEventListener("touchstart", function(event) {
    inputStart(event, input);
  });
  meteorCanvas.addEventListener("touchmove", function(event) {
    inputMove(event, input);
  });
  meteorCanvas.addEventListener("touchend", function(event) {
    inputRelease(event, input);
  });
  */
  
  startLevel(0);
  
}



function render() {
  
  "use strict";
  
  meteorCtx.clearRect(0, 0, meteorCanvas.width, meteorCanvas.height);
  
  renderInput(meteorCtx);
  
  levels[currentLevel].meteor.draw(meteorCtx);
  
  uiDynamicCtx.clearRect(0, 0, uiDynamicCanvas.width, uiDynamicCanvas.height);
  
  drawDynamicUI(
    uiDynamicCtx,
    uiDynamicCanvas.width,
    uiDynamicCanvas.height,
    levels[currentLevel]
  );
  
}



/**
 * Main loop
 * @param {[[Type]]} tFrame requestAnimationFrame's timestamp.
 */
function gameLoop(tFrame) {
  
  "use strict";
  
  Game.stopMain = window.requestAnimationFrame(gameLoop);
  
  //inputs();       // Doesn't do anything unless player is pressing something.
  update(tFrame); // Update meteor's location, velocity etc.
  render();       // Render
}