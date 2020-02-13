/*jslint white: true*/

/*global selectRandomFromList*/


/**
 * Returns a color object containing an array of body colors, a glow color, a
 * ring (like an outline) color, and an integer describing the width of the ring.
 * @param   {string} colorName A specific color/type of planet to lookup. If none
 *                             is specified, a "standard" color will be returned.
 * @returns {object}   [[Description]]
 */
function colorLookup(colorName) {

  "use strict";
  
  switch (colorName) {
      
    case "magenta":
      return {
        body: [
          "rgb(255, 33, 124)",
          "rgb(236, 0, 123)"
        ],
        glow: "rgba(255, 33, 123, 0.4)"
      };
      
    case "magentaLarge":
      return {
        body: [
          "rgb(255, 33, 124)",
          "rgb(236, 0, 123)",
          "rgb(211, 0, 121)"
        ],
        glow: "rgba(155, 50, 123, 0.9)",
        ring: "rgba(240, 200, 255, 0.1)",
        ringWidth: 15
      };
      
    case "cyan":
      return {
        body: [
          "rgb(44, 255, 224)",
          "rgb(0, 220, 210)",
          "rgb(19, 194, 211)"
        ],
        glow: "rgba(0, 225, 214, 0.4)"
      };
      
    case "cyanLarge":
      return {
        body: [
          "rgb(44, 253, 224)",
          "rgb(0, 220, 210)",
          "rgb(19, 194, 211)"
        ],
        glow: "rgba(150, 155, 155, 0.3)",
        ring: "rgba(44, 253, 224, 0.1)",
        ringWidth: 30
      };
      
    case "orange":
      return {
        body: [
          "rgb(255, 162, 131)",
          "rgb(255, 120, 120)",
          "rgb(238, 85, 115)"
        ],
        glow: "rgba(255, 120, 120, 0.4)"
      };
      
    case "yellow":
      return {
        body: [
          "rgb(255, 214, 136)",
          "rgb(255, 177, 133)"
        ],
        glow: "rgba(255, 214, 136, 0.4)"
      };
      
    case "dark":
      return { 
        body: [
          "rgb(72, 60, 106)",
          "rgb(62, 51, 94)"
        ],
        glow: "rgba(44, 253, 224, 0.6)",
        ring: "rgb(44, 253, 224)",
        ringWidth: 2
      };
      
    case "wormhole":
      return { 
        body: [
          "rgb(0,0,0)" // Yeah wormholes are black like black holes... for now.
        ],
        glow: "rgba(0,0,0,0)" // So to not have a glow you have to set to 0. Um.
      };
      
    case "blackhole":
      return {
        body: [
          "rgb(0,0,0)"
        ],
        glow: "rgba(0,0,0,1)",
        ring: "rgba(255, 255, 255, 0.1)",
        ringWidth: 1
      };
      
    default:
      // Return a one of the "standard" colors:
      return colorLookup(selectRandomFromList(
        ["magenta", "cyan", "orange", "yellow"]
      ));
      
  }
  
}