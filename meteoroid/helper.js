/**
 * Give it an array, and it'll return a random element from that array.
 */
function selectRandomFromList(potentials) {
  
  "use strict";
  
  return potentials[Math.floor(Math.random() * potentials.length)];
  
}



/**
 * Converts an update amount to it's equivalent amount of time in seconds.
 * 
 * E.g. an updateAmount of 1.0001 is converted to 0.0166683333 seconds.
 * This level of abstraction may seem crazy, but it helps my brain out.
 * 
 * @param   {float} updateAmount An amount of times to perform updates.
 * @returns {float} An amount of time in seconds.
 */
function updatesToSeconds(updateAmount) {
  "use strict";
  return updateAmount / 60;
}