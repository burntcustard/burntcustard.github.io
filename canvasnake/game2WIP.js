/*jslint plusplus: true, browser: true, devel: true, white: true*/

var canvasnakeRunning = false;

function canvasnake() {
  "use strict";
  
  // Global variables (too many!):
  var
    // Customizable variables (for bigger font etc.)
    textSize = 16, // Base font size. Large font is "textSize * 2"
    cSize = 15,    // Diameter of square cell in grid
    sf = 1,  // "Scale factor" used to scale (1x, 2x, size etc.)

    bgColor = "white",     // Colour of the background.
    tColor  = "orangered", // Colour of the text.

    fColorP = "orangered", // Plus speed food colour.
    fColorM = "green",     // Minus speed food colour.
    fColorB = "gold",      // "Banana" multi-spawning food colour.
  
    // Game state variables:
    debug          = false,        // Enable/disables console log messages.
    finalUpdate    = false,        // Turns true when all snakes are dead.
    gameOver       = false,
    redrawGameOver = false,        // Used to indicate that the game over message should be redrawn.
    gamePaused     = false,
    gameStep       = false,        // Runs one "turn" (all players move one cell) then pauses.
    gameRepeat     = false,        // Restarts the game automatically when gameover occurs.
    gameMode = "singleplayerVsAI", // Initial gamemode is 1 human player against 1 AI.
    updateInterval, // Used to set how frequently the turns occur in ms (lower number = faster).

    gameLoop, // Holds the looping function that repeats.
    canvas = document.getElementById("canvasnake"),
    ctx = canvas.getContext("2d"),
      
    board = {w: 0, h: 0},
    // current grid/board setup is 0 to 29 (inclusive), so 30x30
      
    // Touchscreen variables:
    qrCode = document.getElementById("qrCode"),
    // Get the coordinates (i.e. offset) of the element that receives touch events
    touchBox = qrCode.getBoundingClientRect(),
    touch = {x: 0, y: 0},

    highScore,  // Holds the highest score accomplished on that PC/web browers.
    snakes,     // Array of snake objects that are on the board (human player snakes and/or AI snakes).
    foodArray,  // Array of foods that are on the board
    nommedFood, // The index of the food that's been eaten in the foodArray.    
    debugSquares = [],
      
    wins = {AI1: 0, AI2: 0};
  
  

  function Snake(name, color, speed, ai, controls, direction, coords) {
    
    // General properties
    this.name = name || "player X";
    this.score = 0;
    this.dead = false;
    this.controls = controls || "none";
    this.color = color || "black";
    
    // Location & movement properties
    this.speed = speed || 200;
    this.newDirection = '';
    this.direction = direction;
    this.coords = coords;
    
    // AI-related properties
    // .ai properties are ones that human players DO NOT have, so
    // AIs cannot use (cannot "see") .ai properties of other snakes.
    this.ai = ai || {difficulty: "no AI"}; // Contains avoidance.
    this.ai.dizzy = false;
    this.ai.determined = false;
    this.ai.alone = false;
    this.blocked = {N: false, E: false, S: false, W: false};
    // Distance between head & closest food, & it's index:
    this.foodDistance = {x: 0, y: 0, total: 0, closest: 0};
    this.movesSinceNommed = 0;
    this.winning = false;
    this.extraMoves = 0;
    
  }
    
  
  
  /**
   * @returns {Boolean} Yay or nay.
   */
  function coinToss() {
    if (Math.floor((Math.random() * 2))) {
      return true;
    } else {
      return false;
    }
  }
  
  
  
  /**
   * Swaps two elements in an array around. Example:
   * myArray = [x, y, z];
   * myArray.swap(0, 2);
   * myArray === [z, y, x];
   * @param   {int} x - Index of 1st element.
   * @param   {int} y - Index of 2nd element.
   * @returns {array} - The array with the elements in the new order.
   */
  Array.prototype.swap = function (x,y) {
    var tmp = this[x];
    this[x] = this[y];
    this[y] = tmp;
    return this;
  };
  
  
  
  /**
   * Collisions detection algorithm.
   * @param   {int}   x     - X coordinate
   * @param   {int}   y     - Y coordinate
   * @param   {array} array - Array of X, Y coords. 0 or null checks for wall collisions. 
   * @returns {bool/String} - Returns true if something bad was collided with.
   *                          Returns false if nothing collided with.
   *                          Returns color of food if food was collided with.
   */
  function checkCollision(x, y, array) {
    
    // It's not an array? 0? Just checking if you've smacked a wall!
    if (!array) {
      if (x === -1 || x === board.w || y === -1 || y === board.h) { return true; }
    }
    else
    {
      var arrPos = array.length; // Array position. Pronounce like you're a pirate.

      // Inspect every element of array, starting at the end and working back:
      while (arrPos--) {
        
        // Check if array element is in the same grid cell as whatever is at the x, y coords:
        if (array[arrPos].x === x && array[arrPos].y === y) {
          
          // If we're checking if food was collided with:
          if (array === foodArray) {
            nommedFood = arrPos;
            return (array[arrPos].color);
          }
          
          // If we're checking if anything else (probably something bad!) was collided with:
          return true;
          
        }
        
      }
      
    }
    
    // If we haven't returned a value yet (because nothing was collided with), then:
    return false;
  }

  
  
  //╔══════════════════════════════╗//
  //║        ■▀                    ║//
  //║   ▄██▄█▄█▄          ╔═════╗  ║//
  //║  ██████████    ▀▄   ║     ║  ║//
  //║  █████████  ■■■■■█  ║   ■ ║  ║//
  //║  ██████████    ▄▀   ╚═════╝  ║//
  //║   ▀██▀▀██▀                   ║//
  //╚══════════════════════════════╝//
  function createFood(foods) {
    var combinedScore = 0, // Current score of all the players added together.
        snakeI, snakeJ,    // Counters to loop through snakes.
        foodColor,         // Type of food to be added.
        colorNumber,       // Random int between 1 and combinedScore.
        validFood,         // Boolean to check if the food is being created in a sensible location.
        newFood,           // Food object containing x,y coords and food type.
        failedFoodCount;   // Number of times the food was created in a stupid place.
    
    for (snakeI = 0; snakeI < snakes.length; snakeI++) {
      combinedScore = combinedScore + snakes[snakeI].score;
      //console.log("Combined score = " + combinedScore);
    }
    
    while (foods--) {
      // Default food is the "Plus speed" food:
      foodColor = fColorP;
      // If it's not the first food of the game (i.e. a player has at least one point),
      // maybe change the food being created to "Minus speed" or "Banana" food:
      if (combinedScore > 0) {
        colorNumber = (Math.ceil(Math.random() * combinedScore));
        if (colorNumber % 5 === 0) { foodColor = fColorM; }  
        if (colorNumber % 7 === 0) { foodColor = fColorB; }
        if (debug) {
          console.log("Created " + foodColor + " food with number: " + colorNumber + " at position: " + foodArray.length);
        }
      }
      
      // Place food in a random grid location on the canvas:
      do {
        validFood = true;
        newFood = {
          x: Math.floor(Math.random() * board.w),
          y: Math.floor(Math.random() * board.h),
          color: foodColor
        };
        for (snakeJ = 0; snakeJ < snakes.length; snakeJ++) {
          if (checkCollision(newFood.x, newFood.y, snakes[snakeJ].coords)) {
            if (debug) { console.log("Tried to put a food in a snake, whoops!"); }
            validFood = false;
          }
        }
        if (validFood) {  // If it's not inside a snake, check if inside another food
          if (checkCollision(newFood.x, newFood.y, foodArray)) {
            if (debug) { console.log("Tried to put a food in a food, whoops!"); }
            validFood = false;
          }
        }
        if (!validFood) { failedFoodCount++; }
        if (failedFoodCount > 99) { throw new Error("createFood(): Failed to create new food. (╯°□°）╯︵ ┻━┻"); }
      } while (!validFood);
      
      // Put the newly created food element into the array of foods:
      foodArray.push(newFood);
    }
  }

  
  
  function touched(event) {
    event.preventDefault();
    touch = {
      x: event.targetTouches[0].pageX - touchBox.left,
      y: event.targetTouches[0].pageY - touchBox.top
    };
    if (debug) { console.log("Touch input: " + touch.x + ", " + touch.y); }
  }

  // Prevent touch events:
  function noTouch(event) { event.preventDefault(); }

  
  
  /**
   * Write line(s) of text to canvas.
   * @param {int}    size   - Font size. E.g. "textSize * 2" or "16".
   * @param {String} xAlign - Horizontal positioning of the text. Possible values: |left   cen|ter    right|
   * @param {String} yAlign - Vertical positioning of the text. Possible values: "top"   -middle-   _bottom_
   * @param {String} output - The text to display. Use "<br>"s to create newlines.
   * @param {int}    x      - Horizontal location of text.
   * @param {int}    y      - Vertical location of text.
   */
  function write(size, xAlign, yAlign, output, x, y) {
    
    ctx.fillStyle = (tColor);
    ctx.font = (size + "px silkscreen");
    ctx.textAlign = (xAlign);
    ctx.textBaseline = (yAlign);
    
    var lineHeight = ctx.measureText("M").width * 1.2,
        lines = output.split("<br>"),
        l;
    
    for (l = 0; l < lines.length; l++) {
      ctx.fillText(lines[l], x, y);
      y += lineHeight;
    }
    
  }

  
  
  /**
   * Makes eating a food do stuff, changes snakes speed & score, removes old food, create
   * 3 foods if a banana food was nommed, or creates 1 food if there are no more foods left.
   * @param {Object} snake    - The hungry hungry snake.
   * @param {Char}   foodType - The type of food that's being eaten.
   */
  function eatFood(snake, foodType) {
    
    var noOfNewFoods = 0; // The amount of new foods that's going to be added.
    
    switch (foodType) {
      case 'P': snake.speed = Math.round(snake.speed - snake.speed / 8); break; // Speed up the snake.
      case 'M': snake.speed = Math.round(snake.speed + snake.speed / 4); break;  // Slow down the snake.
      case 'B': noOfNewFoods = +3; break;                                        // Add 3 foods to the board.
      default : throw new Error(
        snake.name + " tried to eat a " + foodType + " food, but doesn't really know what to do with it ¯\_(ツ)_/¯"
      );
    }
    
    // Add 1 to the snakes score (no matter what food was nommed):
    snake.score++;
    
    // Reset movesSinceNommed counter:
    snake.movesSinceNommed = 0;
    
    // Remove eaten food from the game:
    foodArray.splice(nommedFood, 1);

    // If there's no more food left on the board, and you're not banana'ing, spawn +1 food
    if ((foodArray.length === 0) && (noOfNewFoods === 0)) { noOfNewFoods++; }
    
    // Create the number of foods that was rather complicated-ly decided on:
    createFood(noOfNewFoods);
    
  }
  
  
  
  /**
   * Update AI-related variables. Includes properties that human
   * players have that the AI needs to look at.
   */
  function updateAI(snake) {
    
    var snakeHead = snake.coords[0],
        first = true,
        foodI,
        snakeI,
        enemySnakeI,
        tmpFoodDistance = {x: 0, y: 0, total: 0, closest: 0};
    
    snake.foodDistance = {x: 0, y: 0, total: 0, closest: 0}; // Clear food distance so can be recalculated

    for (foodI = 0; foodI < foodArray.length; foodI++) {
      // Distance from food
      tmpFoodDistance.x = foodArray[foodI].x - snakeHead.x;
      tmpFoodDistance.y = foodArray[foodI].y - snakeHead.y;
      tmpFoodDistance.total = Math.abs(tmpFoodDistance.x) + Math.abs(tmpFoodDistance.y);
      
      // If first food being looked at, or food is closer than previously closest food:
      if ((first) || (tmpFoodDistance.total < snake.foodDistance.total)) {
        tmpFoodDistance.closest = foodI;
        // TODO copy the value of tmpFoodDistance all at once to snake.foodDistance?
        snake.foodDistance = {
          x: tmpFoodDistance.x,
          y: tmpFoodDistance.y,
          total: tmpFoodDistance.total,
          closest: tmpFoodDistance.closest
        };
        
        // The next food looked at won't be the first being looked at. (It makes sense!)
        first = false;
      }
      
    }

    // Sets all the blocked values to false so can be recalculated:
    snake.blocked = {N: false, E: false, S: false, W: false};

    // Check if blocked by walls:
    if (checkCollision(snakeHead.x, snakeHead.y - 1, 0)) { snake.blocked.N = true; }
    if (checkCollision(snakeHead.x + 1, snakeHead.y, 0)) { snake.blocked.E = true; }
    if (checkCollision(snakeHead.x, snakeHead.y + 1, 0)) { snake.blocked.S = true; }
    if (checkCollision(snakeHead.x - 1, snakeHead.y, 0)) { snake.blocked.W = true; }

    // Check if blocked by snakes:
    for (snakeI = 0; snakeI < snakes.length; snakeI++) {
      //console.log("Checking for " + snake.name + "'s potential collision with " + snakes[snakeI].name);
      if (checkCollision(snakeHead.x, snakeHead.y - 1, snakes[snakeI].coords)) { snake.blocked.N = true; }
      if (checkCollision(snakeHead.x + 1, snakeHead.y, snakes[snakeI].coords)) { snake.blocked.E = true; }
      if (checkCollision(snakeHead.x, snakeHead.y + 1, snakes[snakeI].coords)) { snake.blocked.S = true; }
      if (checkCollision(snakeHead.x - 1, snakeHead.y, snakes[snakeI].coords)) { snake.blocked.W = true; }
    }
    
    // Update properties that only the AI needs:
    if (snake.ai !== "no AI") {
    
      // Check if snake is the last snake alive and if it's winning (higher score)
      snake.ai.alone = true;
      snake.winning = true;
      for (enemySnakeI = 0; enemySnakeI < snakes.length; enemySnakeI++) {
        if (snakes[enemySnakeI] !== snake) { // I.e. snake being looked at isn't itself.
          if (snakes[enemySnakeI].dead === false) {
            snake.ai.alone = false;
          }
          if (snakes[enemySnakeI].score >= snake.score) {
            snake.winning = false;
          }
        }
      }

      // If the snake hasn't eaten in a long time, it becomes "determined" to get to
      // the food, potentially turning off parts of it's collision avoidance.
      snake.ai.determined = (snake.movesSinceNommed > 100 ? true : false);

      // If the snake hasn't eaten in a VERY long time, it becomes "dizzy" and stops
      // being able to pick a new direction to go in (probably leading to it's death).
      snake.ai.dizzy = (snake.movesSinceNommed > 300 ? true : false);
    
    }
    
  }
  
  
  
  /**
   * Sets a snakes new direction to tell it to go towards the food whose coordinates are
   * held in snake.foodDistance (probably the closest food).
   * @param {Object} snake - The hungry hungry snake.
   */
  function goTowardsFood(snake) {
    if (snake.direction === 'N') {
      if (snake.foodDistance.x < 0) { snake.newDirection = "W"; }
      if (snake.foodDistance.x > 0) { snake.newDirection = "E"; }
      if (snake.foodDistance.y < 0) { snake.newDirection = "N"; } // Wiggling without this.
      if (snake.foodDistance.y > 0 && snake.foodDistance.x === 0) {
        if (coinToss) {
          snake.newDirection = "E";
        } else {
          snake.newDirection = "W";
        }
      }
    }
    if (snake.direction === 'W') {
      if (snake.foodDistance.y < 0) { snake.newDirection = "N"; }
      if (snake.foodDistance.y > 0) { snake.newDirection = "S"; }
      if (snake.foodDistance.x < 0) { snake.newDirection = "W"; }
      if (snake.foodDistance.x > 0 && snake.foodDistance.y === 0) {
        if (coinToss) { 
          snake.newDirection = "N";
        } else {
          snake.newDirection = "S";
        }
      }
    }
    if (snake.direction === 'S') {
      if (snake.foodDistance.x < 0) { snake.newDirection = "W"; }
      if (snake.foodDistance.x > 0) { snake.newDirection = "E"; }
      if (snake.foodDistance.y > 0) { snake.newDirection = "S"; }
      if (snake.foodDistance.y < 0 && snake.foodDistance.x === 0) {
        if (coinToss) { 
          snake.newDirection = "E";
        } else {
          snake.newDirection = "W";
        }
      }
    }
    if (snake.direction === 'E') {
      if (snake.foodDistance.y < 0) { snake.newDirection = "N"; }
      if (snake.foodDistance.y > 0) { snake.newDirection = "S"; }
      if (snake.foodDistance.x > 0) { snake.newDirection = "E"; }
      if (snake.foodDistance.x < 0 && snake.foodDistance.y === 0) {
        if (coinToss) { 
          snake.newDirection = "N";
        } else {
          snake.newDirection = "S";
        }
      }
    }
  }
  
  
  
  /**
   * Sets a snakes new direction to tell it to go towards the center of the game board.
   * @param {Object} snake - The lazy snake.
   */
  function goTowardsCenter(snake) {
    
    // Currently probably only works with nicely rounded (even) board size:
    var wMid = (board.w / 2),
        hMid = (board.h / 2);
    //console.log("Middle cell is X:" + wMid + ", Y:" + hMid);
    
    if (snake.direction === 'N') {
      if (snake.coords[0].x < wMid) { snake.newDirection = "E"; }
      if (snake.coords[0].x > wMid) { snake.newDirection = "W"; }
      if (snake.coords[0].y > hMid) { snake.newDirection = "N"; }
      if (snake.coords[0].y < hMid && snake.coords.x === wMid) {
        if (coinToss) { 
          snake.newDirection = "E";
        } else {
          snake.newDirection = "W";
        }
      }
    }
    if (snake.direction === 'E') {
      if (snake.coords[0].y > hMid) { snake.newDirection = "N"; }
      if (snake.coords[0].y < hMid) { snake.newDirection = "S"; }
      if (snake.coords[0].x < wMid) { snake.newDirection = "E"; }
      if (snake.coords[0].x > wMid && snake.coords.y === hMid) {
        if (coinToss) { 
          snake.newDirection = "N";
        } else {
          snake.newDirection = "S";
        }
      }
    }
    if (snake.direction === 'S') {
      if (snake.coords[0].x > wMid) { snake.newDirection = "W"; }
      if (snake.coords[0].x < wMid) { snake.newDirection = "E"; }
      if (snake.coords[0].y < hMid) { snake.newDirection = "S"; }
      if (snake.coords[0].y > hMid && snake.coords.x === wMid) {
        if (coinToss) {
          snake.newDirection = "W";
        } else {
          snake.newDirection = "E";
        }
      }
    }
    if (snake.direction === 'W') {
      if (snake.coords[0].y > hMid) { snake.newDirection = "N"; }
      if (snake.coords[0].y < hMid) { snake.newDirection = "S"; }
      if (snake.coords[0].x > wMid) { snake.newDirection = "W"; }
      if (snake.coords[0].x < wMid && snake.coords.y === wMid) {
        if (coinToss) { 
          snake.newDirection = "S";
        } else {
          snake.newDirection = "N";
        }
      }
    }
  }
  
  
  
  /**
   * Used to make a snake "look" around it at one cell to help determine which way to go.
   * Pushes cell it's looked at into the array debugSquares.
   * @param   {Object} snake - The obervant snake.
   * @param   {String} type  - Check for collisions with "snakes", "walls", or "" (meaning both).
   * @param   {int} x - Horizontal offset. E.g. "-1" to indicate 1 cell to the left of snakes head.
   * @param   {int} y - Vertical offset.
   * @returns {Boolean} - True if the specified snake & offsets collide with something bad.
   */
  function checkPotentialCollision(snake, type, x, y) {
    
    var xCoord = snake.coords[0].x + x,
        yCoord = snake.coords[0].y + y,
        enemySnakeI;
    
    if (debug) {
      console.log(snake.name + " looking at coords: X:" + xCoord + " Y:" + yCoord);
      debugSquares.push({x: xCoord, y: yCoord});
    }
    
    if (type === "snakes" || !type) {
      if (checkCollision(xCoord, yCoord, snake.coords)) { return true; } // Check self first
      for (enemySnakeI = 0; enemySnakeI < snakes.length; enemySnakeI++) {
        if (snakes[enemySnakeI] !== snake) { // Don't check self again
          if (checkCollision(xCoord, yCoord, snakes[enemySnakeI].coords)) { return true; }
        }
      }
    }
    
    if (type === "walls" || !type) {
      if (checkCollision(xCoord, yCoord, 0)) { return true; }
    }
    
    return false;
    
  }
  
  

  //╔═════════════════╗//
  //║            ▄▄▄  ║//
  //║  █         █ █  ║//
  //║  █▄▄▄▄ >> ▀▀ █  ║//
  //║         ▄▄█▀▀▀  ║//
  //╚═════════════════╝//
  /**
   * Detects 1 cell wide "tubes" that could potentially have dead ends (or might have them in the future
   * if a clever player tries to block the snake in). Uses the snakes new direction value and checks to
   * the left and right of where the snake will be after it's made it's next move. If there are obstacles
   * to the left AND the right then it would have entered a tube oh god no don't do that!
   * @param   {Object}  snake - The tube-avoiding snake.
   * @returns {Boolean} True if the snake was about to go into a tube.
   */
  function detectTube(snake) {
    
    var tubeLeftSide, tubeRightSide = false; // Initially assume no obstacles on left or right.
    
    switch (snake.newDirection) {
      case 'N': {
        tubeLeftSide  = checkPotentialCollision(snake, null, -1, -1);
        tubeRightSide = checkPotentialCollision(snake, null,  1, -1);
      } break;
      case 'E': {
        tubeLeftSide  = checkPotentialCollision(snake, null,  1, -1);
        tubeRightSide = checkPotentialCollision(snake, null,  1,  1);
      } break;
      case 'S': {
        tubeLeftSide  = checkPotentialCollision(snake, null,  1,  1);
        tubeRightSide = checkPotentialCollision(snake, null, -1,  1);
      } break;
      case 'W': {
        tubeLeftSide  = checkPotentialCollision(snake, null, -1,  1);
        tubeRightSide = checkPotentialCollision(snake, null, -1, -1);
      } break;
    }
    
    // If there is an obstacle on both sides:
    if (tubeLeftSide && tubeRightSide) {
      if (debug) { console.log(snake.name + " avoiding going down the rabbit hole"); }
      return true;
    }
    
  }
  
  
  
  //╔═════════════════╗//
  //║       ██        ║//
  //║       ██  Snake ║//
  //║       ██  goes: ║//
  //║   ██<<██>>  ->  ║//
  //╚═════════════════╝//
  /**
   * Determines if an AI snake should go right or left (in relation to the direction of
   * the snake, NOT the board). Takes into account:
   *  - snake.ai.avoidance.snakes, if the snake should turn away from itself and other snakes.
   *  - snake.ai.avoidance.walls,  if the snake should turn away from the nearest wall.
   * Snake avoidance is prioritised, no wall checks are done if a snake has been found to avoid.
   * This reduces the likelyhood of the AI from tangling itself up,
   * because it discourages it from getting too close to obstacles.
   * If nothing is found to avoid, or there is an obstacle an equal distance
   * from the snake on the left and the right, a direction is chosen randomly.
   * @param   {Object}  snake - The claustrophobic snake.
   * @returns {Boolean} - True if the snake should turn right, false if it should turn left.
   */
  function shouldGoRight(snake) {
    
    var tmpGoLeft = false,
        tmpGoRight = false,
        viewDistance = { x: board.w / 2, y: board.h / 2 }, // How far snakes can "see".
        iNS, iNW,
        iES, iEW, // "iES" is "index East Snake", "iEW" is "inded East Wall".
        iSS, iSW, // Used to loop through the a snakes view distance block by block,
        iWS, iWW; // looking for either a Snake or Wall to avoid.
    
    switch (snake.newDirection) {
      case 'N': {
        if (snake.ai.avoidance.snakes) {
          for (iNS = 1; iNS < viewDistance.x; iNS++) { // "iNS" is index North Snake
            if (!tmpGoRight && !tmpGoLeft) {
              tmpGoLeft  = checkPotentialCollision(snake, "snakes",  iNS, 0); // Go left if something found on right (+x coord)
              tmpGoRight = checkPotentialCollision(snake, "snakes", -iNS, 0); // Go right if something found on left (-x coord)
              if (debug && (tmpGoRight || tmpGoLeft)) { console.log("Found snake to avoid, go: " + tmpGoLeft + "," + tmpGoRight); }
            }
          }
        }
        if (snake.ai.avoidance.walls) {
          for (iNW = 1; iNW < viewDistance.x; iNW++) { // "iNW" is index North Wall
            if (!tmpGoRight && !tmpGoLeft) { // Only do this if no snakes have been found to avoid!
              tmpGoLeft  = checkPotentialCollision(snake, "walls",  iNW, 0);
              tmpGoRight = checkPotentialCollision(snake, "walls", -iNW, 0);
              if (debug && (tmpGoRight || tmpGoLeft)) { console.log("Found wall to avoid, go: " + tmpGoLeft + "," + tmpGoRight); }
            }
          }
        }
      } break;
      case 'E': {
        if (snake.ai.avoidance.snakes) {
          for (iES = 1; iES < viewDistance.y; iES++) {
            if (!tmpGoRight && !tmpGoLeft) {
              tmpGoLeft  = checkPotentialCollision(snake, "snakes", 0,  iES); // Go left if something found on right (+x coord)
              tmpGoRight = checkPotentialCollision(snake, "snakes", 0, -iES); // Go right if something found on left (-x coord)
              if (debug && (tmpGoRight || tmpGoLeft)) { console.log("Found snake to avoid, go: " + tmpGoLeft + "," + tmpGoRight); }
            }
          }
        }
        if (snake.ai.avoidance.walls) {
          for (iEW = 1; iEW < viewDistance.y; iEW++) {
            if (!tmpGoRight && !tmpGoLeft) { // Only do this if no snakes have been found to avoid!
              tmpGoLeft  = checkPotentialCollision(snake, "walls", 0,  iEW);
              tmpGoRight = checkPotentialCollision(snake, "walls", 0, -iEW);
              if (debug && (tmpGoRight || tmpGoLeft)) { console.log("Found wall to avoid, go: " + tmpGoLeft + "," + tmpGoRight); }
            }
          }
        }
      } break;
      case 'S': {
        if (snake.ai.avoidance.snakes) {
          for (iSS = 1; iSS < viewDistance.x; iSS++) {
            if (!tmpGoRight && !tmpGoLeft) {
              tmpGoLeft  = checkPotentialCollision(snake, "snakes", -iSS, 0); // Go left if something found on right (+x coord)
              tmpGoRight = checkPotentialCollision(snake, "snakes",  iSS, 0); // Go right if something found on left (-x coord)
              if (debug && (tmpGoRight || tmpGoLeft)) { console.log("Found snake to avoid, go: " + tmpGoLeft + "," + tmpGoRight); }
            }
          }
        }
        if (snake.ai.avoidance.walls) {
          for (iSW = 1; iSW < viewDistance.x; iSW++) {
            if (!tmpGoRight && !tmpGoLeft) { // Only do this if no snakes have been found to avoid!
              tmpGoLeft  = checkPotentialCollision(snake, "walls", -iSW, 0);
              tmpGoRight = checkPotentialCollision(snake, "walls",  iSW, 0);
              if (debug && (tmpGoRight || tmpGoLeft)) { console.log("Found wall to avoid, go: " + tmpGoLeft + "," + tmpGoRight); }
            }
          }
        }
      } break;
      case 'W': {
        if (snake.ai.avoidance.snakes) {
          for (iWS = 1; iWS < viewDistance.y; iWS++) {
            if (!tmpGoRight && !tmpGoLeft) {
              tmpGoLeft  = checkPotentialCollision(snake, "snakes", 0, -iWS); // Go left if something found on right (+x coord)
              tmpGoRight = checkPotentialCollision(snake, "snakes", 0,  iWS); // Go right if something found on left (-x coord)
              if (debug && (tmpGoRight || tmpGoLeft)) { console.log("Found snake to avoid, go: " + tmpGoLeft + "," + tmpGoRight); }
            }
          }
        }
        if (snake.ai.avoidance.walls) {
          for (iWW = 1; iWW < viewDistance.y; iWW++) {
            if (!tmpGoRight && !tmpGoLeft) { // Only do this if no snakes have been found to avoid!
              tmpGoLeft  = checkPotentialCollision(snake, "walls", 0, -iWW);
              tmpGoRight = checkPotentialCollision(snake, "walls", 0,  iWW);
              if (debug && (tmpGoRight || tmpGoLeft)) { console.log("Found wall to avoid, go: " + tmpGoLeft + "," + tmpGoRight); }
            }
          }
        }
      } break;
    }
    
    // Return true if going right is needed, false if left, else randomly turn right or left:
    if (tmpGoRight && !tmpGoLeft) { return true; }
    if (!tmpGoRight && tmpGoLeft) { return false; }
    return coinToss;
    
  }
  
  
  
  function avoidDirection(snake, avoid) {
    
    var goRight;
    
    if (!snake.ai.determined) {
      goRight = shouldGoRight(snake);
    } else {
      goRight = coinToss(); 
    }
    
    if (avoid === 'N') {
      if (goRight) {
        if (!snake.blocked.W) { snake.newDirection = 'W'; }
        if (!snake.blocked.S) { snake.newDirection = 'S'; }
        if (!snake.blocked.E) { snake.newDirection = 'E'; } // <-- Preferred direction
      } else {
        if (!snake.blocked.E) { snake.newDirection = 'E'; }
        if (!snake.blocked.S) { snake.newDirection = 'S'; }
        if (!snake.blocked.W) { snake.newDirection = 'W'; }
      }
      if (debug) { console.log(snake.name + " avoiding N, switched to: " + snake.newDirection); }
    }
    if (avoid === 'E') {
      if (goRight) {
        if (!snake.blocked.N) { snake.newDirection = 'N'; }
        if (!snake.blocked.W) { snake.newDirection = 'W'; }
        if (!snake.blocked.S) { snake.newDirection = 'S'; }
      } else {
        if (!snake.blocked.S) { snake.newDirection = 'S'; }
        if (!snake.blocked.W) { snake.newDirection = 'W'; }
        if (!snake.blocked.N) { snake.newDirection = 'N'; }
      }
      if (debug) { console.log(snake.name + " avoiding E, switched to: " + snake.newDirection); }
    }
    if (avoid === 'S') {
      if (goRight) {
        if (!snake.blocked.E) { snake.newDirection = 'E'; }
        if (!snake.blocked.N) { snake.newDirection = 'N'; }
        if (!snake.blocked.W) { snake.newDirection = 'W'; }
      } else {
        if (!snake.blocked.W) { snake.newDirection = 'W'; }
        if (!snake.blocked.N) { snake.newDirection = 'N'; }
        if (!snake.blocked.E) { snake.newDirection = 'E'; }
      }
      if (debug) { console.log(snake.name + " avoiding S, switched to: " + snake.newDirection); }
    }
    if (avoid === 'W') {
      if (goRight) {
        if (!snake.blocked.S) { snake.newDirection = 'S'; }
        if (!snake.blocked.E) { snake.newDirection = 'E'; }
        if (!snake.blocked.N) { snake.newDirection = 'N'; }
      } else {
        if (!snake.blocked.N) { snake.newDirection = 'N'; }
        if (!snake.blocked.E) { snake.newDirection = 'E'; }
        if (!snake.blocked.S) { snake.newDirection = 'S'; }
      }
      if (debug) { console.log(snake.name + " avoiding W, switched to: " + snake.newDirection); }
    }
    
  }

  
  
  /*
   * Determines a new direction for the AI to turn
   */
  function chooseDirection(snake) {
    
    var snakeI,
        cba; // A lazy snake Can't Be Arsed (=true) to go to the food if other snake/s are closer.

    if (!snake.ai.lazy) {
      goTowardsFood(snake);
    } else {
      // Lazy ai goes towards the center (+ shape) of the map if other snakes are closer to food
      cba = false;
      // Check if other snakes head is closer to food
      for (snakeI = 0; snakeI < snakes.length; snakeI++) {
        if (snakes[snakeI].foodDistance.total < snake.foodDistance.total) { cba = true; }
      }
      if (!cba || snake.ai.alone || foodArray.length > 1) {
        // This snake is closer than all other alive snakes to single food, or there's more than 1 food, go get!
        if (debug) { console.log(snake.name + " is NOT being lazy, going for food"); }
        goTowardsFood(snake);
      } else {
        // This snake is further away from food, just go towards middle of map.
        if (debug) { console.log(snake.name + " cba, just going to center"); }
        goTowardsCenter(snake);
      }
    }
    
    if (snake.ai.avoidance !== "none") {
      
      // Check if you gonna crash and avoid it:
      switch (snake.newDirection) {
        case 'N': if (snake.blocked.N) { avoidDirection(snake, 'N'); } break;
        case 'E': if (snake.blocked.E) { avoidDirection(snake, 'E'); } break;
        case 'S': if (snake.blocked.S) { avoidDirection(snake, 'S'); } break;
        case 'W': if (snake.blocked.W) { avoidDirection(snake, 'W'); } break;
      }
      
      // Check if you gonna go into a tube
      if (snake.ai.avoidance.tubes && !snake.ai.determined) {
        if (detectTube(snake)) {
          avoidDirection(snake, snake.newDirection);
        }
      }
      
    } else {
      if (debug) { console.log(snake.name + " isn't using ai avoidance when it probably should!"); }
    }
  }
  
  

  function updateDirection(snake) {
      
    var d = snake.direction,
        nd = snake.newDirection;
    
    // If there is a change in direction:
    if (d !== nd) {
      //console.log("updating direction of snake, old direction: " +d);
      switch (nd) {
        case 'N': if (d !== 'S') { d = 'N'; } break;
        case 'W': if (d !== 'E') { d = 'W'; } break;
        case 'S': if (d !== 'N') { d = 'S'; } break;
        case 'E': if (d !== 'W') { d = 'E'; } break;
      }
      //console.log("snakes new direction: " + d);
      snake.direction = d;
    }
    
  }
  
  
  
  /**
   * Resizes the canvasnake game.
   * TODO: Resize the rest of the page.
   */
  function reSize(value) {
    var canvasElement = document.getElementById("canvasnake");
    if (canvasElement) {
      canvasElement.width = (canvasElement.width * value);
      canvasElement.height = (canvasElement.height * value);
    }
    textSize = textSize * value;
    cSize *= value;
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 8 * value;
    ctx.shadowOffsetY = 2 * value;
    redrawGameOver = true;
  }
  
  
  
  function handleInput(input) {
    
    var snakeI;
    
    //console.log("Doing something with input");
    gameStep = false;
    switch (input) {
        
      // Game mode selection
      case "0" : gameMode = "singleplayer";      break;
      case "1" : gameMode = "singleplayerVsAI";  break;
      case "2" : gameMode = "2 player";          break;
      case "3" : gameMode = "3 player";          break;
      case "4" : gameMode = "2 AI";              break;
      case "5" : gameMode = "crazy AI";          break;
      case "6" : gameMode = "custom";            break;

      // Other
      case "SPACE" : newGame(); gamePaused = false; break;
      case "P"     : gamePaused = !gamePaused; break;
      case "+"     : gameStep = true; gamePaused = false; break;
      case "?"     : toggleDebug(debug); debug = !debug; break;
      case "R"     : gameRepeat = !gameRepeat; console.log("Game repeat: " + gameRepeat); break;
      case "]"     : if (sf < 4) { sf *= 2; reSize(2); } break;
      case "["     : if (sf > 1) { sf /= 2; reSize(0.5); } break;

    }
    
    for (snakeI = 0; snakeI < snakes.length; snakeI++) {
      if (!snakes[snakeI].dead) {
        //console.log("snake " + snakeI + " isn't dead, trying to move with " + snakes[snakeI].controls);
        if (snakes[snakeI].controls.indexOf("WASD") > -1) {
          switch (input) {
            case "W" : snakes[snakeI].newDirection = "N"; break;
            case "A" : snakes[snakeI].newDirection = "W"; break;
            case "S" : snakes[snakeI].newDirection = "S"; break;
            case "D" : snakes[snakeI].newDirection = "E"; break;
          }
        }
        if (snakes[snakeI].controls.indexOf("IJKL") > -1) {
          switch (input) {
            case "I" : snakes[snakeI].newDirection = "N"; break;
            case "J" : snakes[snakeI].newDirection = "W"; break;
            case "K" : snakes[snakeI].newDirection = "S"; break;
            case "L" : snakes[snakeI].newDirection = "E"; break;
          }
        }
        if (snakes[snakeI].controls.indexOf("arrows") > -1) {
          switch (input) {
            case "UP"   : snakes[snakeI].newDirection = "N"; break;
            case "LEFT" : snakes[snakeI].newDirection = "W"; break;
            case "DOWN" : snakes[snakeI].newDirection = "S"; break;
            case "RIGHT": snakes[snakeI].newDirection = "E"; break;
          }
        }
        if (snakes[snakeI].controls.indexOf("touch") > -1) {
          switch (input) {
            case "tUP"   : snakes[snakeI].newDirection = "N"; break;
            case "tLEFT" : snakes[snakeI].newDirection = "W"; break;
            case "tDOWN" : snakes[snakeI].newDirection = "S"; break;
            case "tRIGHT": snakes[snakeI].newDirection = "E"; break;
          }
        }
      }
    }
    
  }
  
  

  /**
   * Figures out the order of the snakes size/score wise, with the biggest snake at
   * the start of the array, through to the smallest snake at the end. If two snakes have
   * equal scores, a cointoss decides the order of those two.
   * @returns {Array of ints} Ordered set. E.g. [0,2,1].
   */
  function orderSnakes() {
    
    var snakeOrder = [], // E.g [1,0,2] if snake[1] is 1st, snake[0] is 2nd, snake[2] is 3rd.
        snakeI,
        snakeJ,
        s1, s2; // Temporarily storing the two Scores of the two snakes 
    
    // Add all of the alive snakes to a set. E.g. [0,2] if there are 3 snakes but the 2nd is dead:
    for (snakeI = 0; snakeI < snakes.length; snakeI++) {
      if (!snakes[snakeI].dead) { snakeOrder.push(snakeI); }
    }

    // Perform a bubble sort on the snakeOrder set to order from highest to lowest score:
    for (snakeI = 0; snakeI < snakeOrder.length - 1; snakeI++) {
      for (snakeJ = 0; snakeJ < snakeOrder.length - 1; snakeJ++) {

        s1 = snakes[snakeOrder[snakeJ]].score;
        s2 = snakes[snakeOrder[snakeJ+1]].score;

        // If order is wrong, or if 2 snakes have same score (maybe), flip them around.
        if (s1 < s2 || ((s1 === s2) && (coinToss()))) {
          snakeOrder.swap(snakeJ, snakeJ + 1);
        }

      }
    }
    
    // Return ordered set:
    return snakeOrder;
  }
  
  

  function mainLoop() {
    
  // - INPUT - //
    
    var input,    // Human key / touch input string.
        snakeI,   // Counter.
        snakeJ,   // Counter.
        snake,    // Current snake being examined.
        hwTouchX, // Magic number to make touch controls work.
        nx, ny,   // "Next x & y" variables for storing new location of a snakes head.
        w = canvas.width,
        h = canvas.height,
        snakeOrder = orderSnakes();

    // Clear debug squares array so they can be repopulated this turn:
    if (!gameStep) { debugSquares = []; }
    
    // Touchscreen (works on any size rectangle):
    if (touch.x > 0) {
      gamePaused = false;
      hwTouchX = (h / w) * touch.x;
      if (        touch.y <  hwTouchX     )  {
        if (      touch.y < -hwTouchX + h )  { input = "tUP";    }
        else   /* touch.y > -hwTouchX + h */ { input = "tRIGHT"; }
      } else { /* touch.y >  hwTouchX     */
        if (      touch.y > -hwTouchX + h )  { input = "tDOWN";  }
        else   /* touch.y < -hwTouchX + h */ { input = "tLEFT";  }
      }
      // If direction = "dead" (i.e. dead screen has been shown):
      if ( gameOver === true) { newGame(); }
      touch = {x:0, y:0};
      handleInput(input);
    }

    // Keyboard input:
    // document.onkeydown overwrites previously assigned handlers (i.e. old
    // document.onkeydowns) rather than creating new ones, so reassigning this every loop is fine!
    document.onkeydown = function (key) {
      switch (key.which) {
        // NWSE
        case  87: input = 'W';     break;
        case  65: input = 'A';     break;
        case  83: input = 'S';     break;
        case  68: input = 'D';     break;
        case  73: input = 'I';     break;
        case  74: input = 'J';     break;
        case  75: input = 'K';     break;
        case  76: input = 'L';     break;
        case  38: input = "UP";    break;
        case  37: input = "LEFT";  break;
        case  40: input = "DOWN";  break;
        case  39: input = "RIGHT"; break;
          
        // Game mode selection
        case  48: input = "0";     break;
        case  49: input = "1";     break;
        case  50: input = "2";     break;
        case  51: input = "3";     break;
        case  52: input = "4";     break;
        case  53: input = "5";     break;
        case  54: input = "6";     break;
        case  55: input = "7";     break;
        case  56: input = "8";     break;
        case  57: input = "9";     break;
          
        // Other
        case  32: input = "SPACE"; break;
        case  80: input = "P";     break;
        case 187: input = "+";     break;
        case 191: input = "?";     break;
        case  82: input = "R";     break;
        case 219: input = "[";     break;
        case 221: input = "]";     break;

      }
      
      if (input) {
        key.preventDefault();
        if (debug) { console.log("Keypress detected: " + input); }
        handleInput(input);
      } else {
        if (debug) { console.log("Unknown keypress detected: " + input); }
      }
      
    };
    // - END INPUT - //

      if (!gameOver || redrawGameOver) {

      // - UPDATE - //

      if (!gamePaused) {
        
        debugSquares = [];
        
        // Effectively each snake "taking it's turn".
        // The BIGGER SNAKE will update first and win in a head-on collision.
        for (snakeI = 0 ; snakeI < snakeOrder.length; snakeI++) {
          snake = snakes[snakeOrder[snakeI]];

          // If the snake has a direction (game started?)
          if ((snake.direction) && (snake.dead === false)) {
            
            if (debug) { console.log("Updating " + snake.name + "'s snake"); }
            
            // Update AI (even though it's done for both snakes at end of round?)
            updateAI(snake);

            // Pick direction for AI controlled snakes
            if ((snake.ai.difficulty !== "no AI" && snake.ai.dizzy === false) &&
                !(snake.ai.alone && snake.winning && snake.ai.suicideOnWin)) {
              chooseDirection(snake);
            }

            // Update where the snakes are going
            updateDirection(snake);

            // Put position of head in "next x & y" variables:
            nx = snake.coords[0].x;
            ny = snake.coords[0].y;

            // Move head around:
            switch (snake.direction) {
              case 'N': ny--; break;
              case 'E': nx++; break;
              case 'S': ny++; break;
              case 'W': nx--; break;
            }
            
            // Increment how many moves since the snake last nommed some food:
            snake.movesSinceNommed++;

            // Bad collisions that might kill the snake:
            // With wall:
            if ( checkCollision(nx, ny, 0) ) {
              if (debug) { console.log("Snake " + snakeI + " collided with a wall, ouch!"); }
              if (debug) { console.log(snake); }
              snake.dead = true;
            }
            else
            {
              // With self or other snakes:
              for (snakeJ = 0; snakeJ < snakes.length; snakeJ++) {
                if (checkCollision(nx, ny, snakes[snakeJ].coords)) {
                  if (debug) { console.log("Snake " + snakeI + " ran into snake " + snakeJ + ", derp."); }
                  if (debug) { console.log(snake); }
                  snake.dead = true;
                }
              }
            }

            // If the previous collision checks didn't kill the snake, check if it's colliding with food:
            if (!snake.dead) {
              switch (checkCollision(nx, ny, foodArray)) {
                case fColorP : eatFood(snake, 'P'); break;
                case fColorM : eatFood(snake, 'M'); break;
                case fColorB : eatFood(snake, 'B'); break;
                default      : snake.coords.pop(); // Remove last tail segment.
              }
              snake.coords.unshift({ x: nx, y: ny }); // New head
              if (snake.score > highScore) { localStorage.highScore = highScore = snake.score; }
            }

          }
        }
        if (gameStep) { gamePaused = true; }

        // Update the AI data (again, so that when displayed it shows correct values for the
        // games current state, rather than the games state BEFORE the last snake moved. Also
        // check if the game needs to be ended (all snakes dead):
        finalUpdate = true;
        for (snakeI = 0; snakeI < snakes.length; snakeI++) {
          
          snake = snakes[snakeI];
          
          if (!snake.dead) {
            // Do any TURN SENSITIVE (i.e. only once per turn) AI updates here.
            finalUpdate = false;
            updateAI(snake);
          }
          
        }

      }

      // - END UPDATE - //

      // - RENDER - //

      // Clear entire canvas:
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw food:
      for(var j = 0; j < foodArray.length; j++) {
        var f = foodArray[j];
        paintCell(f.color, f.x, f.y);
      }
        
      // Draw snakes:
      // Could use some sort of forEach 
      for (snakeI = 0; snakeI < snakes.length; snakeI++) {
        drawSnake(snakes[snakeI]);
      }

      // Draw scores:  
      for (snakeI = 0; snakeI < snakes.length; snakeI++) {
        write(
          textSize,
          "left",
          "bottom",
          ("Score: " +snakes[snakeI].score),
          (snakeI * 100 * sf + 4 * sf),
          canvas.height - 2 * sf
        );
      }
        
      // Draw highscore:
      write(
        textSize,
        "right",
        "bottom",
        ("Highscore: " +highScore),
        canvas.width - 5 * sf ,
        canvas.height - 2 * sf
      );

      // Draw debug squares:
      for(var iDebug = 0; iDebug < debugSquares.length; iDebug++) {
        paintSmallCell("pink", debugSquares[iDebug].x, debugSquares[iDebug].y);
      }

      // If you died this update, stop touch, start it again after 0.5s, and show dead message.
      if ((finalUpdate && !gameOver) || (redrawGameOver && gameOver)) {
        redrawGameOver = false;
        var qrContainer = document.getElementById("qrContainerHid");
        if (qrContainer) {
          qrContainer.removeEventListener("touchstart", touched);
          qrContainer.addEventListener   ("touchstart", noTouch);
          setTimeout(function() {
            qrContainer.removeEventListener("touchstart", noTouch);
            qrContainer.addEventListener   ("touchstart", touched);
          }, 500);
        }
        var winningSnake = snakes[0],
            theWinner,
            draw = false,
            theScores = "";
        if (snakes.length === 1) {
          theWinner = ("You dead, score: " + snakes[0].score);
        } else {
          // TODO: Improve > 1 player score display so it doesn't go off edges if too long

          // Figure out who won
          for (snakeI = 1; snakeI < snakes.length; snakeI++) {
            if (snakes[snakeI].score > winningSnake.score) {
              winningSnake = snakes[snakeI];
              draw = false;
            } else {
              if (snakes[snakeI].score === winningSnake.score) draw = true;
            }
          }
          
          if (!draw) {
            theWinner = (winningSnake.name + " Wins!");
          } else {
            theWinner = "Draw!";
          }
          for (snakeI = 0; snakeI < snakes.length; snakeI++) {
            theScores += (snakes[snakeI].name + ": " + snakes[snakeI].score + "<br>");
          }
        }
        theScores += ("Press space or tap to restart");
        write(textSize*2, "center", "bottom", theWinner, w/2, h/2);
        write(textSize, "center", "top", theScores, w/2, h/2);
        //updateInterval = 500;
        gameOver = true; // To make sure text only rendered once after death.
        if (snakes.length === 2) {
          if (snakes[0].score > snakes[1].score) wins.AI1++;
          if (snakes[0].score < snakes[1].score) wins.AI2++;
        }
        if (gameRepeat === true) newGame();
      }
      // - END RENDER - //

      // Print the snake properties to two big textboxes: 
      if (debug) {
        var snakeInfoLeft, snakeInfoRight;
        if (snakes[0]) document.getElementById("snakeInfoLeft").innerHTML = snakeInfo(snakes[0], gamePaused, wins);
        if (snakes[1]) document.getElementById("snakeInfoRight").innerHTML = snakeInfo(snakes[1], gamePaused, wins);
      }

      // Set game speed (will be different only if you ate something, but not worth if-ing)
      updateInterval = 0;
      for (snakeI = 0; snakeI < snakes.length; snakeI++) {
        updateInterval = updateInterval + snakes[snakeI].speed;
      }
      updateInterval = (updateInterval / snakes.length);
      clearInterval(gameLoop);
      gameLoop = setInterval(mainLoop, updateInterval);
    }
  }

  
  
  //╔═══════════════════════════════════════════════════╗//
  //║  █▄  █  █▀▀  █   █       ▄▀▀    ▄▀▄   █▄ ▄█  █▀▀  ║//
  //║  █ ▀▄█  █▀▀  █ █ █       █ ▄▄  █ ▄ █  █ ▀ █  █▀▀  ║//
  //║  █  ▀█  █▄▄   █ █        ▀▄▄▀  █   █  █   █  █▄▄  ║//
  //╚═══════════════════════════════════════════════════╝//
  function newGame() {
    
    var s, name, randomStart; // Variables for dynamic snake generation.
    
    // Clear / reset stuff
    gameOver = false;
    foodArray = [];
    snakes = [];

    // Create the first bit of food/s. Could be put in switch (gameMode) if more food is needed.
    createFood(1);

    // Create new snakes based off the game mode
    switch (gameMode) {

      /*** EXAMPLE OF A GAMEMODE ***
      case "name of game mode" :
        snakes = [            // Create array of snakes
          new Snake(
            "name string",    // Must be "AI 1" or "AI 2" for win recording.
            "color string",   // Can be any valid CSS color format. null = black.
            speed int,        // Useful for testing AI. Smaller number = slower.
            {ai parameters},  // null = {difficulty: "no AI"}.
            "AI type string",  OR  ["array", "of", "control", "strings"],
            'direction char', // The starting direction N/E/S/W. Make AWAY from body.
            [{x: int, y: int}, {x: int, y: int}] // Head coord then body coords.
          )
        ];
      break;
       *** END OF EXAMPLE ***/

      case "singleplayerVsAI" :
        snakes = [
          new Snake(
            "Player 1",
            null,
            200,
            null,
            ["arrows", "WASD", "touch"],
            'S',
            [{x: 10, y: 7}, {x: 10, y: 6}, {x: 10, y: 5}]
          ),
          new Snake(
            "AI",
            "purple",
            200,
            {avoidance: {walls: true, snakes: true, tubes: true}, lazy: false, suicideOnWin: true},
            "Normal AI",
            'S',
            [{x: 20, y: 7}, {x: 20, y: 6}, {x: 20, y: 5}]
          )
        ];
      break;
        
      case "2 player" :
        snakes = [
          new Snake(
            "Player 1",
            null,
            200,
            null,
            ["WASD"],
            'S',
            [{x: 10, y: 7}, {x: 10, y: 6}, {x: 10, y: 5}]
          ),
          new Snake(
            "Player 2",
            "purple",
            200,
            null,
            ["arrows"],
            'S',
            [{x: 20, y: 7}, {x: 20, y: 6}, {x: 20, y: 5}]
          )
        ];
      break;
      
      case "3 player" :
        snakes = [
          new Snake(
            "Black",
            null,
            200,
            null,
            ["WASD"],
            'S',
            [{x: 10, y: 7}, {x: 10, y: 6}, {x: 10, y: 5}]
          ),
          new Snake(
            "Purple",
            "purple",
            200,
            null,
            ["IJKL"],
            'S',
            [{x: 15, y: 7}, {x: 15, y: 6}, {x: 15, y: 5}]
          ),
          new Snake(
            "Blue",
            "darkBlue",
            200,
            null,
            ["arrows"],
            'S',
            [{x: 20, y: 7}, {x: 20, y: 6}, {x: 20, y: 5}]
          )
        ];
      break;
        
      case "2 AI" :
        snakes = [
          new Snake(
            "AI 1",
            null,
            20,
            {avoidance: {walls: true, snakes: true, tubes: false}, lazy: false, suicideOnWin: true},
            "Normal AI",
            'S',
            [{x: 10, y: 7}, {x: 10, y: 6}, {x: 10, y: 5}]
          ),
          new Snake(
            "AI 2",
            "purple",
            20,
            {avoidance: {walls: true, snakes: true, tubes: true}, lazy: true, suicideOnWin: true},
            "Lazy AI",
            'S',
            [{x: 20, y: 7}, {x: 20, y: 6}, {x: 20, y: 5}]
          )
        ];
      break;
        
      case "crazy AI" :
        // Crazy lots of snakes
        for (s = 1; s <= 50; s++) {
          name = ("AI " + s);
          randomStart = {x: Math.floor((Math.random() * 26) + 2), y: Math.floor((Math.random() * 26) + 2)}; 
          snakes.push(new Snake(
            name,
            '#'+(Math.random() * 0xFFFFFF << 0).toString(16),
            20,
            {avoidance: {walls: true, snakes: true, tubes: true}, lazy: false, suicideOnWin: true},
            "Normal AI",
            'S',
            [randomStart]
          ));
        }
      break;
        
      case "singleplayer" :
        snakes = [
          new Snake(
            "Player 1",
            null,
            200,
            null,
            ["arrows","WASD","touch"],
            'S',
            [{x: 10, y: 7}, {x: 10, y: 6}, {x: 10, y: 5}]
          )
        ];
      break;
    
    }
    if (typeof gameLoop !== "undefined") { clearInterval(gameLoop); }
    gameLoop = setInterval(mainLoop, 1);
  }
  
  
  
  // Paints a square slightly smaller than cSize to make a 1px border around the edge
  function paintCell(color, x, y) {
    ctx.fillStyle = color;
    ctx.fillRect(
      x * cSize + 1*sf,
      y * cSize + 1*sf,
      cSize - 2*sf,
      cSize - 2*sf);
  }
  
  
  
  // Paints a square slightly smaller than paintCell
  function paintSmallCell(color, x, y) {
    ctx.fillStyle = color;
    ctx.fillRect(
      x * cSize + 3*sf,
      y * cSize + 3*sf,
      cSize - 6*sf,
      cSize - 6*sf
    );
  }
  
  
  
  function drawTongueSection(head, offsetX, offsetY, x, y, w, h) {
    ctx.fillRect(
      ((head.x + offsetX) * cSize + x*sf),
      ((head.y + offsetY) * cSize + y*sf),
      w * sf,
      h * sf
    );
  }
  
  
  
  function drawSnake(snake) {
    // Render tongue
    if (!snake.dead) { // Only show tongue if not dead
      var head = snake.coords[0];
      ctx.fillStyle = tColor; // orangeRed
      if (snake.direction === 'N') {
        drawTongueSection( head, 0, 0,  6, -7, 3, 6);
        drawTongueSection( head, 0, 0,  4,-10, 3, 6);
        drawTongueSection( head, 0, 0,  8,-10, 3, 6);
      }
      if (snake.direction === 'E') {
        drawTongueSection( head, 1, 0,  1,  6, 6, 3);
        drawTongueSection( head, 1, 0,  4,  4, 6, 3);
        drawTongueSection( head, 1, 0,  4,  8, 6, 3);
      }
      if (snake.direction === 'S') {
        drawTongueSection( head, 0, 1,  6,  1, 3, 6);
        drawTongueSection( head, 0, 1,  4,  4, 3, 6);
        drawTongueSection( head, 0, 1,  8,  4, 3, 6);
      }
      if (snake.direction === 'W') {
        drawTongueSection( head, 0, 0, -7,  6, 6, 3);
        drawTongueSection( head, 0, 0,-10,  4, 6, 3);
        drawTongueSection( head, 0, 0,-10,  8, 6, 3);
      }
    }

    // Render snake bodies
    for (var coordsI = 0; coordsI < snake.coords.length; coordsI++) {
    //for(var i = 0; i<snakeArray.length; i++) {
      var segment = snake.coords[coordsI];
      //console.log(segment);
      //console.log("Rendering snake " + snakeI + ", segment: " + coordsI + ", at coords: " + segment.x + segment.y);
      paintCell((snake.color), segment.x, segment.y);
    }

    // Render AI heads
    if (snake.ai.difficulty !== "no AI") { // Only show fancy head if not dead and is an AI

      // White hole (would need to fill color if background not white)
      ctx.clearRect(snake.coords[0].x * cSize + 5*sf, snake.coords[0].y * cSize + 5*sf, 5*sf, 5*sf);

      // Black antenna
      ctx.fillStyle = "black";
      if (snake.direction === 'N' || snake.direction === 'S') {
        ctx.fillRect(snake.coords[0].x * cSize - 2*sf, snake.coords[0].y * cSize + 4*sf, 3*sf, 2*sf); // Up Dot
        ctx.fillRect(snake.coords[0].x * cSize - 4*sf, snake.coords[0].y * cSize + 8*sf, 5*sf, 2*sf); // Down Dot
      } else {
        ctx.fillRect(snake.coords[0].x * cSize + 4*sf, snake.coords[0].y * cSize - 2*sf, 2*sf, 3*sf); // L Dot
        ctx.fillRect(snake.coords[0].x * cSize + 8*sf, snake.coords[0].y * cSize - 4*sf, 2*sf, 5*sf); // R Dot
      }

      if (!snake.dead) {
        // Red bits: end of antenna, eye.
        ctx.fillStyle = tColor; // (orangered)
        if (snake.direction === 'N' || snake.direction === 'S') {
          ctx.fillRect(snake.coords[0].x * cSize + 6*sf, snake.coords[0].y * cSize + 4*sf, 3*sf, 7*sf); // Eye
          ctx.fillRect(snake.coords[0].x * cSize - 4*sf, snake.coords[0].y * cSize + 4*sf, 2*sf, 2*sf); // L Dot
          ctx.fillRect(snake.coords[0].x * cSize - 6*sf, snake.coords[0].y * cSize + 8*sf, 2*sf, 2*sf); // R Dot
        } else {
          ctx.fillRect(snake.coords[0].x * cSize + 4*sf, snake.coords[0].y * cSize + 6*sf, 7*sf, 3*sf); // Eye
          ctx.fillRect(snake.coords[0].x * cSize + 4*sf, snake.coords[0].y * cSize - 4*sf, 2*sf, 2*sf); // L Dot
          ctx.fillRect(snake.coords[0].x * cSize + 8*sf, snake.coords[0].y * cSize - 6*sf, 2*sf, 2*sf); // R Dot
        }
      }
      
    }
    
  }
  
  
  
  // Check if the canvas' size is set correctly:
  if (canvas.width % cSize === 0 || canvas.height % cSize === 0) {
    board.w = canvas.width / cSize;
    board.h = canvas.height / cSize;
  } else {
    throw new Error("Canvas width and height must be divisible by " + cSize + " without remainder.");
  }

  // Give the stuff being drawn on the canvas a shadow:
  ctx.shadowColor = "rgba(0,0,0,0.3)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 2;

  // Assign touch event (for touch controls) to faded QR code logo if it exists... soon.
  var qrContainer = document.getElementById("qrCode");
  setTimeout(function() {
    qrContainer.addEventListener ("touchstart", touched);
  }, 2500); // The delay is so that.. I have no fucking idea. Plz send help.
  
  
  // Assign the highscore as whatever is set in the browsers local storage:
  if (!localStorage.highScore) { highScore = 0; } else { highScore = localStorage.highScore; }
  
  // Start a new game!
  newGame();
  
}



/**
 * Creates a nicely formatted string containing info about a snake. Uses <br> for newlines.
 * @param   {Object} s          - The interesting snake.          
 * @param   {bool}   gamePaused - Is the game paused? (Added at end of string).
 * @param   {Object} wins       - How many wins the snake has had since new game started.
 * @returns {String} - A long string containing info about the snake.
 */
function snakeInfo(s, gamePaused, wins) {
  
  var infoString = "",
      controlsText = s.controls.toString();
  
  controlsText = controlsText.replace("arrows", "&#9650;&#9658;&#9660;&#9668;");
  infoString += ("<span style='color: " + s.color + "'>");
  infoString += (s.name + " <br>");
  for (var i = 0; i < s.name.length; i++) infoString += ("&#175;"); infoString += ("<br>");
  infoString += ("Score: " + s.score + "<br>");
  if (s.name === "AI 1") infoString += ("Wins: " + wins.AI1 + "<br>");
  if (s.name === "AI 2") infoString += ("Wins: " + wins.AI2 + "<br>");
  infoString += ("Dead: " + s.dead + "<br>");
  infoString += ("Controls: " + controlsText + "<br>");
  infoString += ("Speed: " + s.speed + "<br>");
  infoString += ("Direction: " + s.direction + "<br>");
  infoString += ("Head coords: " + s.coords[0].x + "," + s.coords[0].y + "<br>");
  infoString += ("<br>");
  infoString += ("AI DATA <br>");
  infoString += ("&#175;&#175;&#175;&#175;&#175;&#175;&#175; <br>"); // Underline
  infoString += ("Blocked: ");
  if ( s.blocked.N) infoString += (" <span style='color:red; font-weight: bold;'> N </span> ");
  if (!s.blocked.N) infoString += (" N");
  if ( s.blocked.E) infoString += (" <span style='color:red; font-weight: bold;'> E </span> ");
  if (!s.blocked.E) infoString += (" E");
  if ( s.blocked.S) infoString += (" <span style='color:red; font-weight: bold;'> S </span> ");
  if (!s.blocked.S) infoString += (" S");
  if ( s.blocked.W) infoString += (" <span style='color:red; font-weight: bold;'> W </span> <br>");
  if (!s.blocked.W) infoString += (" W <br>");
  infoString += ("Closest food: <br>");
  infoString += (" &nbsp; Index   : " + s.foodDistance.closest + "<br>");
  infoString += (" &nbsp; Distance: " + s.foodDistance.x + "," + s.foodDistance.y + "<br>");
  infoString += (" &nbsp; Total   : " + s.foodDistance.total + "<br>");
  infoString += ("Moves since nommed: " + s.movesSinceNommed + "<br>");
  if (s.ai.difficulty !== "no AI") {
    infoString += ("AI avoidance: <br>");
    infoString += (" &nbsp; Walls : " + s.ai.avoidance.walls + "<br>");
    infoString += (" &nbsp; Snakes: " + s.ai.avoidance.snakes + "<br>");
    infoString += (" &nbsp; Tubes : " + s.ai.avoidance.tubes + "<br>");
    infoString += ("Lazy: " + s.ai.lazy + "<br>");
    infoString += ("SuicideOnWin: " + s.ai.suicideOnWin + "<br>");
    infoString += ("Determined: " + s.ai.determined + "<br>");
    infoString += ("Dizzy: " + s.ai.dizzy + "<br>");
    infoString += ("Alone: " + s.ai.alone + "<br>");
    infoString += ("Winning: " + s.winning + "<br>");
  }
  if (gamePaused) infoString += ("GAME PAUSED");
  infoString += ("</span>");
  
  return infoString;
}



function removeQr(event) {
  event.preventDefault();
  var qrContainer = document.getElementById("qrContainer");
  //console.log("Hiding QR container because It's being poked");
  qrContainer.removeEventListener("touchstart", removeQr, false);
  qrContainer.removeEventListener("click", removeQr, false);
  qrContainer.setAttribute("id", "qrContainerHid");
  if (!canvasnakeRunning) {
    canvasnakeRunning = true;
    canvasnake();
  }
}



// Start game when the page loads and...
// Show the QR code when the link in the tab is clicked
function init() {
  var qrContainerHid = document.getElementById("qrContainerHid");
  if (qrContainerHid) qrContainerHid.setAttribute("id", "qrContainer");
  var qrContainer = document.getElementById("qrContainer");
  if (qrContainer) qrContainer.addEventListener("touchstart", removeQr);
  if (qrContainer) qrContainer.addEventListener("click", removeQr);
}



function shareScore() {
  var twitter = "https://twitter.com/home/?status=";
  //https://twitter.com/share?url=https%3A%2F%2Fdev.twitter.com%2Fweb%2Ftweet-button
  var tweetScore = "I scored "+localStorage.highScore+" at tiny.cc/canvasnake!";
  window.open(twitter+tweetScore,"_blank");
}



function toggleInfo() {
  var infoBox = document.getElementById("sliderInfoBox");
  if (infoBox) {
    infoBox.setAttribute("id", "sliderInfoBoxShow");
  } else {
    infoBox = document.getElementById("sliderInfoBoxShow");
    infoBox.setAttribute("id", "sliderInfoBox");
  }
}



function toggleDebug(debug) {
  var infoBoxLeft = document.getElementById("snakeInfoLeft");
  var infoBoxRight = document.getElementById("snakeInfoRight");

  if (debug) {
    infoBoxLeft.style.display = "none";
    infoBoxRight.style.display = "none";
  } else {
    infoBoxLeft.style.display = "inline-block";
    infoBoxRight.style.display = "inline-block";
  }
  
}



window.onload = function() { init(); };
