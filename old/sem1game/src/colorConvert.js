/*jslint white: true, devel: true*/



// It looks like non of this is needed now that I've moved away from Phaser,
// Unless I really want to keep being able to do shorthand hex colors...


  
"use strict";



function hexToInt(hexString) {
  
  // Remove the # at the start of hex color string:
  hexString = hexString.replace('#', '');
  
  // If hex color is short form, e.g. "f60",
  // convert to long form, e.g. "ff6600":
  if (hexString.length === 3) {
    hexString = (
      hexString.charAt(0) +
      hexString.charAt(0) +
      hexString.charAt(1) +
      hexString.charAt(1) +
      hexString.charAt(2) +
      hexString.charAt(2)
    );
  }
  
  return parseInt(hexString, 16);
}



function rgbToInt(rgbString) {
  
  // Remove any spaces in rgb color string:
  rgbString = rgbString.replace(/\s+/g, '');
  
  // Split rgb color into array of 3 strings containing only
  // numerical digits, then convert to base 10 ints and multiply:
  var rgb = rgbString.match(/(\d+),(\d+),(\d+)/),
      r   = parseInt(rgb[1], 10) * 256 * 256,
       g  = parseInt(rgb[2], 10) * 256,
        b = parseInt(rgb[3], 10);
  
  return (r + g + b);
}



function colorToInt(colorString) {

  if (colorString.charAt(0) === '#') {

    return hexToInt(colorString);

  } else if (colorString.substr(0, 3).toLowerCase() === "rgb") {

    return rgbToInt(colorString);

  } else {

    if (debug) {
      console.log("Error converting color: " + colorString);
    }

    // Return default color of white (i.e. max value):
    return 16777215;
  }

}