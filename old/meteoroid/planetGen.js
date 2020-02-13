/*jslint white: true, plusplus: true*/

/*global selectRandomFromList, colorLookup*/



/**
 * Planet constructor.
 * @param {int}   x      X coordinate.
 * @param {int}   y      Y coordinate.
 * @param {float} ratio  The ratio of the areas of planets. E.g. if there's
 *                       2 planets, one big, one small, the ratios might be
 *                       0.75 and 0.25 - meaning that the smaller one will
 *                       cover an area 1/3 the size of the larger one.
 *                       The sum of all the of the planets ratios will be 1.
 * @param {int}   radius Radius of the planet.
 * @param {bool} type  Is the planet some fancy/special type? Optional.
 */
var Planet = function (x, y, ratio, radius, type) {
  
  "use strict";
  
  this.x = x;
  this.y = y;
  this.ratio = ratio;
  this.radius = radius;
  this.mass = Math.PI * (radius / baseUnit) * (radius / baseUnit);
  this.type = type || false;
  
};
Planet.prototype.constructor = Planet;



/**
 * Generates an array of ratios for a group of planets to have.
 * @param   {int}   noOfPlanets Number of planets.
 * @returns {array of ints}
 */
function generatePlanetRatios(noOfPlanets) {
  
  "use strict";
  
  // We gon' generate some numbers that "aren't random" as explained here:
  // (i.e. the "incorrect behaviour" displayed is actually what we want)
  // http://stackoverflow.com/questions/8064629/random-numbers-that-add-to-100-matlab/8068956#8068956
  
  var i,
      ratios = [],
      not0 = 0.001,  // Added to random number to prevent 0.
      sum = 0;
  
  // Create some random numbers between just above 0 to just above 1:
  for (i = 0; i < noOfPlanets; i++) {
    ratios.push(Math.random() + not0);
    sum += ratios[i];
  }
  
  // Divide each number by the sum, so that if they were to all be added
  // together, it would equal 1 (ish). It's easier to think about this
  // like they're percentages, e.g. planet x's number is 0.4, so it will
  // be about 40% of the total area covered by the planets.
  for (i = 0; i < noOfPlanets; i++) {
    ratios[i] /= sum;
  }
  
  // Sort the radiuses so that they're largest to smallest:
  ratios.sort(function(a, b) {
    return b - a;
  });
  
  return ratios;
  
}



/**
 * Generate an array of objects with random(ish) x, y coordinates.
 * 
 * Coordinates are between 0 and width or height values.
 * 
 * These favour the center of the scene, but only slightly.
 * Distribution curve like this: /\
 * 
 * @param   {int} numberOf Number of objects to generate.
 * @param   {int} width    Width of the area containing the coords.
 * @param   {int} height   Height of the area containing the coords.
 * @returns {array of objects} Object array with x, y properties.
 */
function generateCoords(numberOf, width, height) {
  
  "use strict";
  
  var i,
      coords = [];
  
  for (i = 0; i < numberOf; i++) {
    
    coords.push({
      x: Math.round((Math.random() * width ) / 2 +
                    (Math.random() * width ) / 2),
      y: Math.round((Math.random() * height) / 2 +
                    (Math.random() * height) / 2)
    });
    
  }
  
  return coords;
    
}



function colorizePlanets(planetsPercent, planets) {
  
  "use strict";
  
  var i,
      potentialColors = [],
      colorRatios = [],
      color = "";
  
  // Loop through all planets that aren't a fancy type:
  for (i = 0; i < planets.length && !planets.type; i++) {
    
    potentialColors = [];
    
    // Add colors to the list of potential colours, based on
    // how much of the planets is "allowed" to be that color,
    // and based on if the last color assigned wasn't that color.
    // Todo: Explain this better...
    if (planets[i].ratio < 0.2 && color !== "yellow") {
      potentialColors.push("yellow");
    }
    if (planets[i].ratio < 0.3 && color !== "orange") {
      potentialColors.push("orange");
    }
    if (planets[i].ratio < 0.9 && color !== "cyan") {
      potentialColors.push("cyan");
    }
    if (planets[i].ratio <= 1 && color !== "magenta") {
      potentialColors.push("magenta");
    }
    
    color = selectRandomFromList(potentialColors);
    
    colorRatios.push({
      color: color,
      value: planets[i].ratio
    });
    
    planets[i].colors = colorLookup(color);
    
  }
  
}



/**
 * Generate an array of planets.
 * @param   {object}   level The level that the planets are being made for.
 * @returns {array of objects}
 */
function generatePlanets(level) {
  
  "use strict";
  
  var planets = [],
      i,
      ratios = generatePlanetRatios(level.noOfPlanets),
      coords = generateCoords(level.noOfPlanets, level.width, level.height),
      radius = [],
      type;
  
  for (i = 0; i < level.noOfPlanets; i++) {
    
    type = false;
    
    // Convert the area ratios to radiuses:
    radius[i] = ratios[i] * level.planetArea * Math.PI;
    radius[i] = Math.sqrt(radius[i]) / Math.PI;
    radius[i] = Math.round(radius[i]);
    
    // Todo: determine if planet is a special fancy type here?
    
    planets.push(new Planet(
      coords[i].x,
      coords[i].y,
      ratios[i],
      radius[i],
      type
    ));
    
  }
  
  colorizePlanets(level.planetsPercent, planets);
  
  return planets;
  
}
