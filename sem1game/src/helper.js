/*jslint white: true, plusplus: true, devel: true*/

/*global debug: false*/


/* 
 * Returns the last element of an array.
 */
if (!Array.prototype.last) {
  Array.prototype.last = function () {
    "use strict"; // This "use strict" is a bit ridiculous...
    return this[this.length - 1];
  };
}



function selectRandomFromList(potentials) {
  
  "use strict";
  
  // Math.abs is potentially unnecessary, but without it, sometimes the
  // random number generation will return '-0' rather than '0'...

  return potentials[Math.abs(Math.round(Math.random() * potentials.length - 0.5))];
  
}



/*
 * Returns an object with an X and Y coordinate, randomly
 * selected within the confines of the specified width and height.
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


/*
 * Get the distance between two objects that have x and y coords
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



function distanceBetweenAbs(objA, objB) {
  
  "use strict";
  
  var d = distanceBetween(objA, objB),
      x = Math.abs(d.x),
      y = Math.abs(d.y);
  
  return (Math.sqrt(x * x + y * y));
  
}



/**
 * Get angle between two objects that have x and y coords
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



function rotationTo(obj, target) {
  
  "use strict";
  
  var deltaRad = obj.rotation * (Math.PI / 180),
      semicircle = Math.PI; // π radians is a semicircle!
  
  deltaRad -= angleBetween(obj, target) + semicircle / 2;
  
  // This fixes "weird" deltaMouseRad values that get spat out
  // sometimes. These weird values are abnormally high (~5rad ~340deg)
  // and are converted to their "opposite", e.g. 340eg -> -20deg.
  if (deltaRad > semicircle) {
    deltaRad -= semicircle * 2;
  } else if (deltaRad < -(semicircle)) {
    deltaRad += semicircle * 2;
  }
  
  return deltaRad;
  
}



/**
 * Does the opposite of Math.abs().
 * I.e. takes a number and randomly returns either the positive or negative of it.
 */
function unAbs(number) {
  
  "use strict";
  
  return number * (Math.random() < 0.5 ? -1 : 1);
  
}



/**
 * Makes sure that the inputNumber has the opposite (positive or
 * negative) sign to the numberToBeOppositeTo, and return the inputNumber.
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
 * Feed me the thing to rotate (any object with x & y coords), and the degrees to rotate it by.
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

    obj.x = nwX;
    obj.y = nwY;

  // ¯\_(ツ)_/¯
  } else {
    
    if (debug) {
      console.log("Error: Tried to rotate an object that doesn't have x & y coords!");
    }
    
  }

}



function toRadians(degrees) {
  
  "use strict";
  
  return degrees * (Math.PI / 180);
  
}



function toDegrees (radians) {
  
  "use strict";
  
  return radians * (180 / Math.PI);
  
}