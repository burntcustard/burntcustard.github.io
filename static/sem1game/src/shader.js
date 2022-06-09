/*jslint plusplus: true*/

/*global canvas: false, glCanvas: true, texture: true, fx, settings: false*/

//var hueCounter = 0; // Unused crazy hue shifting effect variable.



/**
 * Try to create a WebGL canvas. If WebGL isn't supported, this will return false,
 * and we won't try to do any of the fancy WebGL shader effects when rendering.
 * WebGL variable can be set to false before this is run to disable WebGL on slow
 * computers or if people want to see what it's like with WebGL off. Although...
 * I haven't actually implemented a way to go from being "on" to "off" yet.
 * And it doesn't actually improve performance THAT much.
 */
function addWebGLCanvas() {
  
  "use strict";

  var i;
  
  try {
    glCanvas = fx.canvas();
  } catch (e) {
    // WebGL canvas creation failed... set to low graphics :(
    for (i = 0; i < settings.length; i++) {
      settings[i].value = settings[i].low;
    }
    return false;
  }

  // Tell glfx to use the original canvas as a source image:
  texture = glCanvas.texture(canvas);

  // Hide the original canvas and put the WebGL Canvas in its place:
  canvas.parentNode.insertBefore(glCanvas, canvas);
  canvas.style.display = "none";
  
  return true;

}



function removeWebGlCanvas() {
  
  "use strict";
  
  // Hide WebGL canvas:
  glCanvas.style.display = "none";
  
  // Un-hide the source canvas:
  canvas.style.display = "block";
  
}



function renderShader(camera) {
  
  "use strict";
  
  // If you imagine a ball pressing the rear of the screen, this variable is
  // like the size of that ball. So if the multiplier at the end is small, it's
  // like a ping pong ball, and if it's large, it's like a basketball.
  var bulgeSize, bulgeAmount;
  
  // Load the latest frame from the default 2D canvas:
  texture.loadContentsOf(canvas);
  
  glCanvas.draw(texture);
  
  // Make the colours more vibrant (makes desaturated colors more saturated):
  if (settings.vibrance.value) {
    glCanvas.vibrance(settings.vibrance.value);
  }
  
  // Apply a tiny amount of slightly flickery static (like an image) noise:
  if (settings.dusty.value) {
    glCanvas.noise(Math.random() * (settings.dusty.value / 9) + (settings.dusty.value / 9));
  }
  
  /*
  // Crazy colour testing. In this instance it would be really good to have multiple
  // canvases, so different things could get their colours messed up. OR, draw some stuff,
  // apply effect, then draw other stuff that won't have silly colours, then do another glfx render...
  // To make this work there's a global hueCounter variable at the top of this file that needs uncommenting.
  glCanvas.hueSaturation(hueCounter, 0.5);
    hueCounter +=0.01;
  if(hueCounter > 1){
    hueCounter = -1;
  }
  */
  
  // Apply a CRT-like round-bulging-screen effect:
  if (settings.bulge.value) {
    bulgeSize = ((camera.width + camera.height) / 2) * (0.7 + (settings.bulge.value / 2));
    bulgeAmount = settings.bulge.value / 2;
    glCanvas.bulgePinch(camera.width / 2, camera.height / 2, bulgeSize, bulgeAmount);
  }
  
  // Apply a vignette fade around the edges of the screen:
  if (settings.vFade.value) {
    // First value is the spread/blur amount. 0 meaining very fuzzy, 1 meaning a hard edge.
    // Second value is the distance from edges of the screen.
    glCanvas.vignette(settings.vFade.value / 2, settings.vFade.value / 2 + 0.4);
  }
  
  // Unused extra settings that could be played with:
  // .colorHalftone(hw, hh, Math.random() * 0.01 + 0.4, 3)
  // .hexagonalPixelate(hw, hh, 1.5) // Applies a wiggly hexagonal distortion
  // .triangleBlur(1) // Blurs everything a little bit
  
  glCanvas.update();
  
}