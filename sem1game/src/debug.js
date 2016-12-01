/*jslint white: true, vars: true*/

/*global getNumberOfVisible: false */

function drawDebug(game, time, deltaTime) {
  
  "use strict";
  
  var camX = Math.round(game.camera.x),
      camY = Math.round(game.camera.y),
      camW = game.camera.width,
      camH = game.camera.height;

  var debugInfo = (
    "Render time (ms): " + (window.performance.now() - time).toFixed(3) + "<br>" +
    "\"Max\" render FPS: " + Math.round(1 / ((window.performance.now() - time)) * 1000 ) + "<br>" +
    "DeltaTime (ish) : " + (deltaTime).toFixed(2) + "<br>" +
    "Updates/s (ish) : " + ((1 / deltaTime) * 1000).toFixed(2) + "<br>" +
    "<br>" +
    "Level: " + game.currentLevel + "<br>" +    
    "<br>" +
    "Organisms:" + "<br>" +
    "  On screen: " + (getNumberOfVisible(game.levels[game.currentLevel].organisms) +                   
                       getNumberOfVisible(game.levels[game.currentLevel + 1].organisms)) + "<br>" +
    "  Total:     " + (game.levels[game.currentLevel].organisms.length +
                       game.levels[game.currentLevel + 1].organisms.length) + "<br>" +
    "<br>" +
    "Player: " + "<br>" +
    "  Rotation: " + Math.round(game.player.rotation) + "<br>" +
    "  Coords  : " + Math.round(game.player.x) + ", " + Math.round(game.player.y) + "<br>" +
    "  Velocity: " + game.player.velocity.x.toFixed(2) + ", " + game.player.velocity.y.toFixed(2) + "<br>" + 
    "  Speed   : " + game.player.speed.toFixed(2) + "<br>" + 
    "  Size    : " + game.player.size.toFixed(2) + "<br>" + 
    "<br>" +
    "Game: "  + "<br>" +
    "   "     + (-game.width)  +   ",   "  + ( game.width ) + ",<br>" +
    "  "      + (-game.height) +  "┌────┐" + (-game.height) +  "<br>" +
    "       " +                   "│    │" +                   "<br>" +
    "  "      + ( game.height) + ",└────┘" + ( game.height) + ",<br>" +
    "   "     + (-game.width)  +   "    "  + ( game.width ) +  "<br>" +
    "<br>" +
    "Camera: " + "<br>" +
    "  Width:  " + game.camera.width + "<br>" +
    "  Height: " + game.camera.height + "<br>" +
    "  Deadzone: " + game.camera.deadzone + "%<br>" +
    "  Coords: " + "<br>" +
    "  "     + (camX)        +  ",       " + (camX + camW) + ",<br>" +
    "  "     + (camY)        +  "        " + (camY)        +  "<br>" +
    "       " +                  "┌────┐" +                  "<br>" +
    "       " +                  "│    │" +                  "<br>" +
    "       " +                  "└────┘" +                  "<br>" +
    "  "      + (camX)        + ",       " + (camX + camW) + ",<br>" +
    "  "      + (camY + camH) + "        "  + (camY + camH) +  "<br>" +
    "<br>" +
    "Input: " + JSON.stringify(game.keys) + "<br>"
  );
  
  // Replace spaces with something that'll actually be shown:
  debugInfo = debugInfo.replace(/ /g, '&nbsp;');

  // Get the info onto the page:
  document.getElementById("debug").innerHTML = debugInfo;
  
}



function toggleDebug() {
  
  "use strict";

  if (debug) {
    debug = false;
    document.getElementById("debug").style.display = "none";
  } else {
    debug = true;
    document.getElementById("debug").style.display = "block";
  }

}