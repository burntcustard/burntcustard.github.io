/*global Phaser: false*/

/**
 * [[Description]]
 * @param {number} cameraWidth  The width of the camera in px.
 * @param {number} cameraHeight The height of the camera in px.
 * @param {object} sprite       The sprite to follow (probably the player).
 * @param {object} game         Reference to the Phaser game object.
 */

function initCamera(cameraWidth, cameraHeight, sprite, game) {
  
  "use strict";
  
  game.camera.x = -(cameraWidth  / 2);
  game.camera.y = -(cameraHeight / 2);
  
  game.camera.follow(sprite, Phaser.Camera.FOLLOW_TOPDOWN);
  
  // The deadzone is a Rectangle that defines the
  // limits at which the camera will start to scroll.
  // TODO: Try the following with an ellipses.
  
  // Size of the border around the free-movement area:
  var border = cameraWidth / 6;
  
  game.camera.deadzone = new Phaser.Rectangle(
    border, // space between LEFT of screen & free-movement area.
    border, // space between TOP of screen & free-movement area.
    cameraWidth - border * 2, // WIDTH of free-movement area.
    cameraHeight - border * 2 // HEIGHT of free-movement area.
  );
  
}