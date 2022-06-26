/*jslint devel: true*/



function inputStart(event, input) {
  
  "use strict";
  
  var meteor = levels[currentLevel].meteor,
      x, y;
  
  if (event && event.x && event.y) {
    
    x = event.clientX;
    y = event.clientY;
    
    if (!meteor.alive) {
      input.start.x = x;
      input.start.y = y;
      meteor.velocity.x = 0;
      meteor.velocity.y = 0;
      meteor.position.x = x;
      meteor.position.y = y;
      input.active = true;
      meteor.visible = true;
    }
    
  }
  
  console.log("mousedown at " + x + "," + y);
  
}



function inputMove(event, input) {
  
  "use strict";
  
  if (input.active) {
    
    // Update the end point of the input line:
    input.end.x = event.clientX;
    input.end.y = event.clientY;
    
    // This is here because we only want the input line to
    // be drawn after the player has started "dragging".
    input.visible = true;
    
  }
  
}



function inputRelease(event, input) {
  
  "use strict";
  
  var meteor = levels[currentLevel].meteor;
  
  if (input.active && !meteor.alive) {
    
    // Update coordinates:
    input.end.x = event.clientX;
    input.end.y = event.clientY;
    
    // Set meteor's velocity:
    meteor.velocity.x = (input.start.x - input.end.x) / 9;
    meteor.velocity.y = (input.start.y - input.end.y) / 9;
    
    // End the input:
    input.active = false;
    input.visible = false;
    
    // Set the meteor to alive:
    meteor.alive = true;
    
    // Start sim?
    levels[currentLevel].progress = 0;
    levels[currentLevel].complete = false;
    
  }
  
}



function renderInput(ctx) {
  
  "use strict";
  
  if (input.visible) {
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineCap = "round";
    ctx.lineWidth = 3; // Todo make this vmin-related.
    ctx.moveTo(input.start.x, input.start.y);
    ctx.lineTo(input.end.x, input.end.y);
    ctx.stroke();
  }
  
}