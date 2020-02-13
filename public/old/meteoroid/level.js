/*global generatePlanets*/



/**
 * Generates a game level.
 * 
 * Early testing suggests that this is plenty fast enough to generate
 * a level within 16ms - so no need for "loading screens" because of
 * this function (but actually rendering the planets might be slow).
 * 
 * @param   {int} levelNo The level number of the level being generated.
 * @param   {int} width   The width of the level.
 * @param   {int} height  The height of the level.
 * @returns {object} The freshly generated level.
 */
function generateLevel(levelNo, width, height) {
  
  "use strict";
  
  var level = {};
  
  level.width = width;
  level.height = height;
  
  // Figure out how many planets are going to be in the level:
  // Todo: randomness.
  level.noOfPlanets = Math.round(levelNo * 0.2 + 1);
  
  // How much % of the level's area will be covered in planets.
  level.planetsPercent = levelNo / 9 + 2;
  
  // Pixel area of the game world:
  level.worldArea = width * height;
  
  // Pixel area to cover in planets:
  level.planetArea = (level.worldArea / 100) * level.planetsPercent;
  
  level.planets = generatePlanets(level);
  
  level.progress = 0;
  
  level.complete = false;
  
  return level;
  
}