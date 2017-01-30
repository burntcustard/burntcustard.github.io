/*jslint white: true*/

/*global Vec*/



/**
 * Keep on object on the screen by "bouncing" it off the edges.
 * @param {object}   object The thing to keep on screen. Probably the
 *                          meteor. "object" IS NOT a reserved word!
 *                          "Object" IS a reserved word! We can get away
 *                          with it if we're careful!
 *                          The object MUST have radius, position,
 *                          and velocity properties.
 * @param {float} width  Width of the canvas we're keeping the object on.
 * @param {float} height Height of the canvas we're keeping the object on.
 */
function keepOnScreen(object, width, height) {
  
  "use strict";
  
  // Todo: pass the width and height in rather than using globals. Maybe.
  
  if (object.position.x >= width - object.radius) {
    object.position.x = width - object.radius;
    object.velocity.x = -object.velocity.x;
  }
  else if (object.position.x <= object.radius) {
    object.position.x = object.radius;
    object.velocity.x = -object.velocity.x;
  }
  else if (object.position.y >= height - object.radius) {
    object.position.y = height - object.radius;
    object.velocity.y = -object.velocity.y;
  }
  else if (object.position.y <= object.radius) {
    object.position.y = object.radius;
    object.velocity.y = -object.velocity.y;
  }
  
}



function gravForce(mass1, mass2, distance) {
  
  "use strict";
  
  // Gravitational constant. Increase to make things more "gravity-ey":
  var G = 0.0006,
      distanceMulti = 1.2;
  
  distance = (distance / baseUnit) * distanceMulti;
  
  // Newton's law of universal gravitation, basically...
  return (G * ((mass1 * mass2) / (distance * distance)));
  
}



// Find a meteors acceleration due to the gravitational pull of a planet.
// Uses Euler algorithm, based off:
// http://codeflow.org/entries/2010/aug/28/integration-by-example-euler-vs-verlet-vs-runge-kutta/
// Todo: Explain better, including that we're using area/mass interchangably.
function gravAcceleration(planet, meteor) {
  
  "use strict";
  
  var planetPosition = new Vec(planet.x, planet.y),
      direction = planetPosition.sub(meteor.position),
      distance = direction.length(),
      // These only get calculated if the planet/meteor aren't colliding:
      normal,
      force;
  
  if (distance < planet.radius + meteor.radius) {
    // meteor crashed! :O
    return false;
  } else {
    normal = direction.normalized();
    force = gravForce(planet.mass, meteor.mass, distance);
    return normal.mul(force);
  }
  
}



/**
 * Stops an object from travelling past it's maximum speed,
 * or past a generic max speed value if it doesn't have one.
 * @param {object} speedyObject The potentially speeding object.
 */
function applyMaxSpeed(speedyObject) {
  
  "use strict";
  
  var maximumSpeed = speedyObject.maxSpeed || 9,
      currentSpeed = speedyObject.velocity.length();
  
  if (currentSpeed > maximumSpeed) {
    speedyObject.velocity.imul(maximumSpeed / currentSpeed);
  }
  
}