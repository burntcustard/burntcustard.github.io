/*jslint white: true, plusplus: true, devel: true*/

/*global debug: false*/



/**
 * Returns the last element of an array.
 */
if (!Array.prototype.last) {
  Array.prototype.last = function () {
    "use strict"; // This "use strict" is a bit ridiculous...
    return this[this.length - 1];
  };
}



/**
 * Give it an array, and it'll return a random element from that array.
 */
function selectRandomFromList(potentials) {
  
  "use strict";
  
  return potentials[Math.floor(Math.random() * potentials.length)];
  
}



/**
 * Convert degrees to radians.
 */
function toRadians(degrees) {
  
  "use strict";
  
  return degrees * (Math.PI / 180);
  
}



/**
 * Convert radians to degrees.
 */
function toDegrees(radians) {
  
  "use strict";
  
  return radians * (180 / Math.PI);
  
}



/**
 * Convert an angle from [-180 to 180], to the range [0 to 360].
 */
function to360(angle) {
  
  "use strict";
  
  if (angle < 0) {
    angle += 360;
  }
  
  return angle;
  
}



/**
 * Convert an angle from [0 to 360], to the range [-180 to 180].
 */
function to180(angle) {
  
  "use strict";
  
  if (angle > 180) {
    angle -= 360;
  }
  
  else if (angle < -180) {
    angle += 360;
  }
  
  return angle;
  
}



/*
 * Returns an object with an X and Y coordinate, randomly
 * selected within the confines of the specified width and height (x2 - itself).
 * E.g. with a width and height of 100:
 *    -100,        +100,
 *  -100 ┌─────────┐ -100
 *       │         │
 *       │   0,0   │
 *       │         │
 *  -100,└─────────┘ +100,
 *    +100         +100
 */
function randomCoords(maxWidth, maxHeight) {
  
  "use strict";
  
  // If max height not specified, just use width again.
  maxHeight = maxHeight || maxWidth;

  return {
    x: Math.floor((Math.random() * maxWidth  * 2) - maxWidth ),
    y: Math.floor((Math.random() * maxHeight * 2) - maxHeight)
  };

}



/**
 * Get the distance between two objects that have x and y coords
 *  - as a vector.
 * 
 * Example, distance between A -> B = {x: 3, y: -1}
 *  ┌─────┐
 *  │    B│
 *  │A    │
 *  └─────┘
 */
function distanceBetween(objA, objB) {

  "use strict";
  
  if ((objA.x !== undefined) &&
      (objB.x !== undefined) &&
      (objA.y !== undefined) &&
      (objB.y !== undefined)) {

    return {
      x: objB.x - objA.x,
      y: objB.y - objA.y
    };

  } else {

    if (debug) {
      console.log("Error: Tried to find distance between objects that don't have x and y coordinates!");
    }

  }

}



/**
 * Get the distance between two objects that have x and y coords
 *  - as a positive integer.
 *  
 *  Example, distance between A -> B = 3
 *  ┌─────┐
 *  │    B│
 *  │A    │
 *  └─────┘
 */
function distanceBetweenAbs(objA, objB) {
  
  "use strict";
  
  var d = distanceBetween(objA, objB),
      x = Math.abs(d.x),
      y = Math.abs(d.y);
  
  return (Math.sqrt(x * x + y * y));
  
}



/**
 * Get angle in radians between two objects that have x and y coords.
 * 
 * This function regards pointing EAST as 0 rotation.
 * 
 * Example, angle between A -> B = 60deg (but er actually in radians)
 *  ┌─────┐
 *  │    B│
 *  │A    │
 *  └─────┘
 */
function angleBetween(objA, objB) {

  "use strict";
  
  if ((objA.x !== undefined) &&
      (objB.x !== undefined) &&
      (objA.y !== undefined) &&
      (objB.y !== undefined)) {

    return Math.atan2(objB.y - objA.y, objB.x - objA.x);

  } else {

    if (debug) {
      console.log("Error: Tried to find angle between objects that don't have x and y coordinates!");
    }
    
    return false;

  }

}



/**
 * Finds the center of an object that has x, y, width, and height properties.
 * Returns an object with x and y coordinates.
 */
function getCenter(obj) {
  
  "use strict";
  
  // If it's a thing with a width and height:
  if ((obj.x      !== undefined) &&
      (obj.y      !== undefined) &&
      (obj.width  !== undefined) &&
      (obj.height !== undefined)) {
  
    return {
      x: obj.x + (obj.width  / 2),
      y: obj.y + (obj.height / 2)
    };
    
  // Maybe it's an array of things with x/y coords?
  } else if (obj[0].x) {
    
    var xTotal, yTotal, i = 0;
    
    for (i = 0; i < obj.length; i++) {
      xTotal += obj[i].x;
      yTotal += obj[i].y;
    }
    
    return {
      x: xTotal / obj.length,
      y: yTotal / obj.length
    };
    
  // ¯\_(ツ)_/¯
  } else {
    
    if (debug) {
      console.log("Error: Tried to find center of an object that doesn't have the required properties!");
    }
    
  }
  
}



/**
 * Returns the number of objects in an array with a truthy visible property.
 */
function getNumberOfVisible(objs) {
  
  "use strict";
  
  var i, visibleCount = 0;
  
  for (i = 0; i < objs.length; i++) {
    if (objs[i].visible) {
      visibleCount++;
    }
  }
  
  return visibleCount;
  
}



// TODO: Rewrite this so that it is either properly in radians, or degrees.
function rotationTo(obj, target) {
  
  "use strict";
  
  var organismAngle = toRadians(obj.rotation),
      rightAngle = Math.PI / 2, // Basically 90 degrees in radians. 
      angleTo = angleBetween(obj, target),
      deltaRad = 0,
      sign = -1;
  
  /*
  if (obj == game.player) {
    console.log("obj: " + Math.round(obj.x) + ", " + Math.round(obj.y));
    console.log("target: " + Math.round(target.x) + ", " + Math.round(target.y));
    console.log("diff: " + Math.round(target.x - obj.x) + ", " + Math.round(target.y - obj.y));
    console.log("angleTo: " + Math.round(toDegrees(angleTo)) + " <--");
    console.log("--------");
  }
  */
    
  // Convert angleBetween's dodgy "pointing EAST is 0",
  // to pointing NORTH (forwards) is 0:
  angleTo += rightAngle;
  if (angleTo >= Math.PI) {
    angleTo -= toRadians(360);
  }
  
  // Convert to er not be negative (i.e. 0 - 360, not -180 to 180):
  //angleTo += Math.PI;
  //organismAngle += Math.PI;
  
  deltaRad = angleTo - organismAngle;
  
  
  if (deltaRad >= Math.PI) {
    deltaRad -= Math.PI * 2;
  }
  else if (deltaRad <= -Math.PI) {
    deltaRad += Math.PI * 2;
  }
  /*
  deltaRad = Math.abs(organismAngle - angleTo);
  
  if ((angleTo - organismAngle >= 0) && (angleTo - organismAngle <= Math.PI) ||
      (angleTo - organismAngle <= -Math.PI) && (angleTo - organismAngle >= -Math.PI*2)) {
    sign = 1;
  }
  
  if (deltaRad > Math.PI) {
    deltaRad = (Math.PI * 2) - deltaRad;
  }
  */
  
  // I think the problem is with angleBetween() !

  /*
  // This fixes "weird" deltaMouseRad values that get spat out
  // sometimes. These weird values are abnormally high (~5rad ~340deg)
  // and are converted to their "opposite", e.g. 340eg -> -20deg.
  if (deltaRad > toRadians(180)) {
    //if (obj == game.player) console.log(toDegrees(deltaRad).toFixed(1));
    deltaRad -= toRadians(360);
  } else if (deltaRad < -(toRadians(180))) {
    //if (obj == game.player) console.log(toDegrees(deltaRad).toFixed(1));
    deltaRad += toRadians(360);
  }
  */

  return -deltaRad;
  
}



/**
 * Does the opposite of Math.abs().
 * I.e. takes a number and randomly returns either the + or - of it.
 */
function unAbs(number) {
  
  "use strict";
  
  return number * (Math.random() < 0.5 ? -1 : 1);
  
}



/**
 * Returns the input number, with a positive or negative sign
 * which is the opposite to that of numberToBeOppositeTo.
 */
function oppositeTo(inputNumber, numberToBeOppositeTo) {
  
  "use strict";
  
  if (numberToBeOppositeTo > 0) {
    return -(Math.abs(inputNumber));
  } else {
    return Math.abs(inputNumber);
  }
  
}



/**
 * Feed me the point to rotate (any object with x & y coords), and the degrees to rotate it by.
 */
function rotate(obj, deg) {
  
  "use strict";

  if ((obj.x !== undefined) &&
      (obj.y !== undefined)) {

    var rad = deg * Math.PI / 180,
        cos = Math.cos(rad),
        sin = Math.sin(rad),
        nwX = cos * obj.x - sin * obj.y,
        nwY = cos * obj.y + sin * obj.x;

    // Set the objects new x and y coordinates:
    obj.x = nwX;
    obj.y = nwY;

  } else {
    
    if (debug) {
      console.log("Error: Tried to rotate an object that doesn't have x & y coords!");
    }
    
  }

}



function angleDiff(angle1, angle2) {
  
   "use strict";
  
  angle1 = to360(angle1);
  angle2 = to360(angle2);
  
  return to180(angle2 - angle1);
  
}



/**
 * Transition from one color to another, by the intendedChange amount.
 * E.g: colorTransition("rgb(250,15,40)", "rgb(255,10,10)", 10)
 * Will return: "rgb(255,10,30)"
 * The initial color is "pushed through grey" to reach the target color.
 * This is okay-ish for us, as it'll make the middle levels a bit
 * "boring", but the start and end will be exciting / vibrant.
 */
function colorTransition(initialColor, targetColor, intendedChange) {
  
  "use strict";
  
  // Currently assuming that the color string is rgb().
  initialColor = initialColor.replace(/\s+/g, '');
  targetColor = targetColor.replace(/\s+/g, '');
  
  // Turn color strings into RGB arrays.
  // .match() returns all the numbers as the first
  // element in the array, so we splice that out.
  // Splice is fast. https://jsperf.com/splice-vs-splice
  initialColor = initialColor.match(/(\d+),(\d+),(\d+)/).splice(1,4);
  targetColor = targetColor.match(/(\d+),(\d+),(\d+)/).splice(1,4);
  
  var i,
      difference,
      actualChange,
      output = [
        parseInt(initialColor[0], 10),
        parseInt(initialColor[1], 10),
        parseInt(initialColor[2], 10)
      ];
  
  // Cycle through 0/1/2, i.e. r/g/b:
  for (i = 0; i < 3; i++) {
    
    // Get the difference between the initial colour and target color:
    difference = Math.abs(targetColor[i] - output[i]);
    
    // If the difference is < the intended change, then only change by that amount:
    actualChange = difference < intendedChange ? difference : intendedChange;
    
    // Right hand side is integer, so string on left is converted for comparison:
    if (targetColor[i] > output[i]) {
      output[i] += actualChange;
    } 
    else if (targetColor[i] < output[i]) {
      output[i] -= actualChange;
    }
    
    // Keep the values between 0-255:
    output[i] = output[i] > 255 ? 255 : output[i];
    output[i] = output[i] <   0 ?   0 : output[i];
    
  }
  
  return ("rgb(" + output[0] + "," + output[1] + "," + output[2] + ")");
  
}