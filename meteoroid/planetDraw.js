/* We're calling this "draw" rather than "render" because "render" kind of
 * implies that we'd be doing it after every update, whereas we will actually
 * only "draw" the scene once, when the level is started.
 */

/*jslint plusplus: true, white: true, browser: true*/

/*global SSAA*/



/**
 * Draw a horizontal line from x, y, to x+length, y.
 * @param {object} ctx    Context of the canvas to draw on.
 * @param {int}    x      X coordinate.
 * @param {int}    y      Y coordinate.
 * @param {int}    length Length in px.
 * @param {string} color  Color string in rgb(a), hex, or HTML color code.
 */
function drawHotdog(ctx, x, y, length, color) {
  
  "use strict";
  
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + length, y);
  ctx.stroke();
  
}




function drawPlanetBody(ctx, radius, thickness, noOfLines, minRadiusForHotdogs, minNoOfLinesFor3Colors, colors) {
  
  "use strict";
  
  var i,
      lineY,          // The y coordinate of the hotdog(s) on that row.
      rand,           // Random amount to give the hotdogs some length variety.
      lengthModifier, // To * the hotdog's length by to make center lines longer.
      lineLength;     // The length of each hotdog.
  
  if (radius > minRadiusForHotdogs && colors.length > 1) {
    
    // Draw the "clipping circle" to cut off the edges of
    // the hotdog lines that fall outside of the circle:
    ctx.beginPath();
    ctx.arc(radius, radius, radius - thickness / 2, 0, 2 * Math.PI);
    ctx.clip();

    // Set the soon to be drawn lines to have round ends, and the correct thickness:
    ctx.lineCap = "round";
    ctx.lineWidth = thickness;

    // For each row, draw a pair of hotdogs:
    for (i = 1; i <= noOfLines; i++) {
      lineY = thickness / 2 + (i - 1) * thickness;

      // 3 segment planet
      if (noOfLines > minNoOfLinesFor3Colors && colors.length > 2) {
        
        // Todo: Tidy this up. It's still crazy.

        rand = (Math.random() - 0.5) * radius / 5;
        lengthModifier = i - 1;
        if (lengthModifier >= noOfLines / 2) { // Over half way through
          lengthModifier = noOfLines + 1 - i;
        }
        lengthModifier /= noOfLines;
        lengthModifier *= 0.7;
        lineLength = Math.round(radius * (1 + lengthModifier) + rand);
        if (lineLength < radius) { lineLength = radius; }
        if (i % 2) { // If odd  - e.g. the first row
          drawHotdog(ctx,                     0, lineY,               radius * 2, colors[2]); // Light
          drawHotdog(ctx, radius*1.5-lineLength, lineY,               radius * 2, colors[1]); // Mid
          drawHotdog(ctx,            radius * 2, lineY, -lineLength - radius / 5, colors[0]); // Dark
        } else {     // If even - e.g. the second row
          drawHotdog(ctx,            radius * 2, lineY,              -radius * 2  , colors[0]); // Dark
          drawHotdog(ctx,                     0, lineY,           lineLength * 0.8, colors[1]); // Mid
          drawHotdog(ctx,                     0, lineY,  radius - lineLength * 0.5, colors[2]); // Light
        }

      // 2 segment planet
      } else if (radius > minRadiusForHotdogs && colors.length > 1) {

        rand = (Math.random() - 0.5) * radius / 2;
        lengthModifier = i - 1;
        if (lengthModifier >= noOfLines / 2) { // Over half way through
          lengthModifier = noOfLines + 1 - i;
        }
        lengthModifier /= noOfLines;
        lineLength = Math.round(radius * (1 + lengthModifier) + rand);
        if (lineLength < radius) { lineLength = radius; }
        if (i % 2) { // If odd  - e.g. the first row
          drawHotdog(ctx,          0, lineY,  lineLength, colors[1]);
          drawHotdog(ctx, radius * 2, lineY, -lineLength, colors[0]);
        } else {     // If even - e.g. the second row
          drawHotdog(ctx, radius * 2, lineY, -lineLength, colors[0]);
          drawHotdog(ctx,          0, lineY,  lineLength, colors[1]);
        }
        
      }
      
    }
  } else {
    // Solid color planet because it's tiny or something dun fucked up
    ctx.beginPath();
    ctx.fillStyle = colors[0];
    ctx.arc(radius, radius, radius, 0, 2 * Math.PI); 
    ctx.fill();
  }
  
}



function drawPlanetGlow(ctx, color, radius, circleSize) {
  
  "use strict";
  
  // Set shadow properties:
  ctx.shadowColor = color;
  ctx.shadowBlur = radius;
  
  // Draw a circle that's a little bit smaller than the planet.
  // This is what actually gets the glow applied to it, and it has
  // to be some sort of color, because a transparent circle would mean
  // no glow. So we use the standard purple background color.
  ctx.fillStyle = "rgb(70, 60, 99)";
  ctx.beginPath();
  ctx.arc(0, 0, circleSize - 2, 0, 2 * Math.PI); // -2px so it's "underneath".
  ctx.fill();
  
  ctx.shadowBlur = 0; // Turn the glowyness back off.
  
}



function drawPlanetRing(ctx, circleSize, radius, thickness, ringWidth, color) {
  
  "use strict";
  
  // The thickness of the circle(s) around le planet:
  var ringThickness = circleSize + ((radius / 55) + (thickness / 9) * ringWidth);
  
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, 0, ringThickness, 0, 2 * Math.PI);
  ctx.fill();
  
}



function drawPlanet(ctx, planet) {
  
  "use strict";
  
  var x = planet.x,
      y = planet.y,
      radius = planet.radius,
      colors = planet.colors,
      thickness = 1,
      noOfLines = Math.round((Math.random() + 1) * Math.sqrt(radius)),
      minRadiusForHotdogs = 12 * SSAA,
      minNoOfLinesFor3Colors = 18,
      circleSize,
      offscreenData,
  
      // New canvas element for creating the planet on:
      newPlanetCanvas = document.createElement('canvas'),
      newPlanetCtx = newPlanetCanvas.getContext("2d");
  
  if (radius > minRadiusForHotdogs) {
  
    // So that everything lines up "pixel perfectly", the radius of the planet
    // might be changed to fit the number of hotdogs in it. E.g. a radius 7
    // planet that's supposed to have 3 hotdogs in, would be round((7*2)/3) = 4
    // thickness, then have it's radius adjusted to 6 because (4*3)/2 = 6.

    // Set the thickness of the "hotdogs" (lines):
    thickness = Math.round(radius * 2 / noOfLines);

    // Adjust the intended radius of the planet, so that it's a multiple of
    // the thickness of the hotdogs.
    radius = (thickness * noOfLines) / 2;
    
  }
  
  newPlanetCanvas.width  = radius * 2;
  newPlanetCanvas.height = radius * 2;
  
  drawPlanetBody(
    newPlanetCtx,
    radius,
    thickness,
    noOfLines,
    minRadiusForHotdogs,
    minNoOfLinesFor3Colors,
    colors.body
  );
  
  /*
  // Crazy wormhole testing.
  // I plan(et lol) to do fun swirling stuff in the wormholes, like this:
  // http://geekofficedog.blogspot.co.uk/2013/04/hello-swirl-swirl-effect-tutorial-in.html
  if (planet.type === "wormhole") {
    console.log("Drawin' a wormhole");
    
    var image = canvas,
        sx    = 0,
        sy    = (canvasHeight - canvasWidth) / 2,
      sWidth  = canvasWidth,
      sHeight = canvasWidth, // Because it's a square
        dx    = thickness / 2,
        dy    = thickness / 2,
      dWidth  = radius * 2 - thickness / 2,
      dHeight = radius * 2 - thickness / 2;
    
    planetCtx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  }
  */
  
  circleSize = radius - thickness / 2;
  
  // Get planet onto main canvas:
  offscreenData = newPlanetCtx.getImageData(0, 0, radius * 2, radius * 2);
  ctx.translate(x, y);
  
  // Glow - a circle behind the planet with shadow:
  if (colors.glow) {
    drawPlanetGlow(
      ctx,
      colors.glow,
      radius,
      circleSize
    );
  }
  
  // Ring(s) - like planet outlines:
  // (Basically yet another circle behind the planet)
  if (colors.ring) {
    drawPlanetRing(
      ctx,
      circleSize,
      radius,
      thickness,
      colors.ringWidth,
      colors.ring
    );
  }
  
  // Get the planet body we previously drew and stick it onto main planet canvas:
  ctx.rotate(-28 * (Math.PI/180));
  // Draw the planet centered (because the center is at x radius and y radius, kinda):
  ctx.drawImage(newPlanetCanvas, -radius, -radius);
  ctx.rotate( 28 * (Math.PI/180));
  ctx.translate(-x, -y);
  
}



function drawPlanets(ctx, planets) {
  
  "use strict";
  
  var i;
  
  for (i = 0; i < planets.length; i++) {
    drawPlanet(ctx, planets[i]);
  }
  
}