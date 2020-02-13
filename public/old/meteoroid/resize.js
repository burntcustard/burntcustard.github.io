/*global planetCanvas, meteorCanvas, uiStaticCanvas, uiDynamicCanvas*/



/**
 * Resizes a canvas to the height and width of the window,
 * times a certain, optional, super-sampling amount.
 */
function resizeCanvas(canvas, SSAA) {
  
  "use strict";
  
  var scale = SSAA || 1;
  
  canvas.width  = window.innerWidth  * scale;
  canvas.height = window.innerHeight * scale;
  
}



/**
 * Resizes the canvases
 */
function resizeGame(SSAA) {
  
  "use strict";
  
  console.log("Resizing");
  
  // Canvases resized with SSAA passed in are rendered larger for better qualiteeee
  resizeCanvas(planetCanvas, SSAA);
  resizeCanvas(meteorCanvas);
  resizeCanvas(uiStaticCanvas, SSAA);
  resizeCanvas(uiDynamicCanvas);
  
  baseUnit = Math.sqrt(meteorCanvas.width * meteorCanvas.height) / 1000;
  
  console.log("baseUNit: " + baseUnit);
  
}