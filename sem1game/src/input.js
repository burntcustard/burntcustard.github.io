/*jslint white: true, browser: true*/

/*global game: false, toggleDebug, pause, canvas*/



/***************/
/* TOUCH INPUT */
/***************/


function touchInput(event) {
  
  "use strict";
  
  event.preventDefault();
  
  game.touch = {
    active: true,
    x: event.targetTouches[0].pageX * (game.camera.width  / window.innerWidth ),
    y: event.targetTouches[0].pageY * (game.camera.height / window.innerHeight)
  };
  
  // console.log(game.touch);
  
}


function touchStop(event) {
  
  "use strict";
  
  event.preventDefault();
  
  game.touch.active = false;
  
}



/******************/
/* KEYBOARD INPUT */
/******************/


/**
 * If specified key is not found in the array of keys that
 * are already held down (pressed), then add it to that array.
 */
function keyDown(key) {
  
  "use strict";
  
  if (game.keys.indexOf(key) === -1) {
    game.keys.push(key);
  }
  
}


/**
 * Key presses
 */
document.onkeydown = function (key) {
  
  "use strict";
  
  //console.log(key.which); // Used to check key.which numbers.
  
  switch (key.which) {
    case  87: keyDown('w'); break;
    case  65: keyDown('a'); break;
    case  83: keyDown('s'); break;
    case  68: keyDown('d'); break;
    case  38: keyDown('▲'); break;
    case  37: keyDown('◀'); break;
    case  40: keyDown('▼'); break;
    case  39: keyDown('▶'); break;
    case  32: keyDown('␣'); break;
    case 191: toggleDebug('?'); break;
    case  19: pause('pause|break'); break;
    case  80: pause('p'); break;
  }
  
};


/**
 * Key releases
 */
document.onkeyup = function (key) {
  
  "use strict";
  
  switch (key.which) {
    case  87: game.keys.splice(game.keys.indexOf('w'), 1); break;
    case  65: game.keys.splice(game.keys.indexOf('a'), 1); break;
    case  83: game.keys.splice(game.keys.indexOf('s'), 1); break;
    case  68: game.keys.splice(game.keys.indexOf('d'), 1); break;
    case  38: game.keys.splice(game.keys.indexOf('▲'), 1); break;
    case  37: game.keys.splice(game.keys.indexOf('◀'), 1); break;
    case  40: game.keys.splice(game.keys.indexOf('▼'), 1); break;
    case  39: game.keys.splice(game.keys.indexOf('▶'), 1); break;
    case 191: game.keys.splice(game.keys.indexOf('?'), 1); break;
    case  32: game.keys.splice(game.keys.indexOf('␣'), 1); break;
  }
  
};




