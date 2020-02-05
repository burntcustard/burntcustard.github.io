/*jslint plusplus: true, vars: true*/

/*global distanceBetween: false, getCenter: false*/



/**
 * Initializes the camera.
 */
function initCamera(camera, followee) {
  
  "use strict";
  
  // Set the ceter of the camera on the thing the camera should follow.
  // - But we're not actually setting it to follow that thing here,
  // to do that, cameraFollow() must be called in the game's update().
  camera.x = followee.x - (camera.width  / 2);
  camera.y = followee.y - (camera.height / 2);
  
  // Size of the "no go" deadzone area around the edges of the camera,
  // defined as a percentage of the average of the camera view.
  // E.g. a border of 10% of a 200px x 50px camera, will be:
  // Avg of 200 and 50 = 125. 10% of 125 = 12.5, rounded to an int is
  // 13px, so there will be a 13px deadzone on the edges of the camera.
  camera.deadzone = 30;//%
  
  // The smoothness of the camera in "pixels to jump". I.e if set to 2,
  // the camera will pan in 2px increments, if set to lower, the camera
  // will move more smoothly, but the performance cost will be higher.
  camera.smoothness = 0.125; //px
  
}



/**
 * Moves the camera so that it "follows"
 * the "followee" (probably the player).
 * !WARNING! distanceFromCenter MUST be recalculated
 * within the while loops, or they'll never end!
 */
function cameraFollow(camera, followee) {
  
  "use strict";
  
  // Border/deadzone size is calculated here rather than when the camera
  // is initialized, just in case the camera width or height have changed:
  var border = Math.round(
    camera.deadzone / 100 * ((camera.width + camera.height) / 2)
  );
  
  // 🍳 - Not actually number of frying pans, but size of the steps the camera
  // pans/jumps while trying to keep up with the followee. The shorthand
  // here checks if camera.smoothness is greater than 0, and if it's not, it
  // sets panAmount to 0.1. Because 0 would be bad. The camera wouldn't move!
  var panAmount = (camera.smoothness > 0 ? camera.smoothness : 0.01);
  
  var distanceFromCenter = distanceBetween(getCenter(camera), followee);
  
  //  ┌─────┐ 
  //  │ cam │f
  //  └─────┘
  while (distanceFromCenter.x > (camera.width / 2) - border) {
    camera.x += panAmount;
    distanceFromCenter = distanceBetween(getCenter(camera), followee);
  }
  
  //  ┌─────┐ 
  // f│ cam │
  //  └─────┘
  while (distanceFromCenter.x < -(camera.width / 2) + border) {
    camera.x -= panAmount;
    distanceFromCenter = distanceBetween(getCenter(camera), followee);
  }
  
  //  ┌─────┐ 
  //  │ cam │
  //  └─────┘
  //     f
  while (distanceFromCenter.y > (camera.height / 2) - border) {
    camera.y += panAmount;
    distanceFromCenter = distanceBetween(getCenter(camera), followee);
  }
  
  //     f
  //  ┌─────┐ 
  //  │ cam │
  //  └─────┘
  while (distanceFromCenter.y < -(camera.height / 2) + border) {
    camera.y -= panAmount;
    distanceFromCenter = distanceBetween(getCenter(camera), followee);
  }
  
}

/**
 * Voodoo magic that makes the world seem to go on forever,
 * by jumping everything in the game when the followee gets
 * near the edge of the game world. TODO: Explain this better.
 */
function infiniteCamera(game, followee) {
  
  "use strict";
  
  var border = Math.round(
    game.camera.deadzone / 100 * ((game.camera.width + game.camera.height) / 2)
  );
  
  var i, organism;
  
  //  ┌────┐ 
  //  │game│f
  //  └────┘
  if (followee.x > game.width - border) {
    for (i = 0; i < game.levels[game.currentLevel + 1].organisms.length; i++) {
      organism = game.levels[game.currentLevel + 1].organisms[i];
      organism.x -= game.width * 2 - game.camera.width;
    }
    for (i = 0; i < game.levels[game.currentLevel].organisms.length; i++) {
      organism = game.levels[game.currentLevel].organisms[i];
      organism.x -= game.width * 2 - game.camera.width;
    }
    game.camera.x -= game.width * 2 - game.camera.width;
  }
  
  //  ┌────┐ 
  // f│game│
  //  └────┘
  if (followee.x < -game.width + border) {
    for (i = 0; i < game.levels[game.currentLevel + 1].organisms.length; i++) {
      organism = game.levels[game.currentLevel + 1].organisms[i];
      organism.x += game.width * 2 - game.camera.width;
    }
    for (i = 0; i < game.levels[game.currentLevel].organisms.length; i++) {
      organism = game.levels[game.currentLevel].organisms[i];
      organism.x += game.width * 2 - game.camera.width;
    }
    game.camera.x += game.width * 2 - game.camera.width;
  }
  
  //  ┌────┐ 
  //  │game│
  //  └────┘
  //    f
  if (followee.y > game.height - border) {
    for (i = 0; i < game.levels[game.currentLevel + 1].organisms.length; i++) {
      organism = game.levels[game.currentLevel + 1].organisms[i];
      organism.y -= game.height * 2 - game.camera.height;
    }
    for (i = 0; i < game.levels[game.currentLevel].organisms.length; i++) {
      organism = game.levels[game.currentLevel].organisms[i];
      organism.y -= game.height * 2 - game.camera.height;
    }
    game.camera.y -= game.height * 2 - game.camera.height;
  }
  
  //    f
  //  ┌────┐ 
  //  │game│
  //  └────┘
  if (followee.y < -game.height + border) {
    for (i = 0; i < game.levels[game.currentLevel + 1].organisms.length; i++) {
      organism = game.levels[game.currentLevel + 1].organisms[i];
      organism.y += game.height * 2 - game.camera.height;
    }
    for (i = 0; i < game.levels[game.currentLevel].organisms.length; i++) {
      organism = game.levels[game.currentLevel].organisms[i];
      organism.y += game.height * 2 - game.camera.height;
    }
    game.camera.y += game.height * 2 - game.camera.height;
  }
  
}