

function update(tFrame) {
  
  "use strict";
  
  deltaTime = tFrame - oldTime;
  oldTime = tFrame;
  
  var updateAmount = deltaTime / (1 / 60 * 1000),
      level = levels[currentLevel],
      meteor = level.meteor,
      maxProgress = 8.0; // In milliseconds? So each round is 8s?
  
  // Update the position of the meteor:
  if (meteor.alive && meteor.update(updateAmount)) {
    
    level.progress += updatesToSeconds(updateAmount);
    
    if (level.progress >= maxProgress) {
      level.complete = true;
      level.progress = maxProgress;
      //Game.stopMain;
      cancelAnimationFrame(Game.stopMain);
      startLevel(currentLevel+1);
    }
    
  } else {
    if (!level.complete && level.progress > 0) {
      level.progress = 0;
    }
  }
  
}