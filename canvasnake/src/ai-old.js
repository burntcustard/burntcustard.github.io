
import { check as checkCollision } from './collision.js';
import { coinToss } from './lib/misc.js';



function getDirectionTo(currentDirection, targetDistX, targetDistY) {

    var newDirection;

    switch (currentDirection) {

        case 'N':
            if (targetDistX < 0) { newDirection = 'W'; }
            if (targetDistX > 0) { newDirection = 'E'; }
            if (targetDistY < 0) { newDirection = 'N'; }  // Wiggling without this.
            if (targetDistY > 0 && targetDistX === 0) {
                newDirection = coinToss() ? 'W' : 'E';  // Order doesn't matter.
            }
        break;

        case 'E':
            if (targetDistY > 0) { newDirection = 'S'; }
            if (targetDistY < 0) { newDirection = 'N'; }
            if (targetDistX > 0) { newDirection = 'E'; }
            if (targetDistX < 0 && targetDistX === 0) {
                newDirection = coinToss() ? 'S' : 'N';
            }
        break;

        case 'S':
            if (targetDistX > 0) { newDirection = 'E'; }
            if (targetDistX < 0) { newDirection = 'W'; }
            if (targetDistY > 0) { newDirection = 'S'; }
            if (targetDistY < 0 && targetDistX === 0) {
                newDirection = coinToss() ? 'E' : 'W';
            }
        break;

        case 'W':
            if (targetDistY < 0) { newDirection = 'N'; }
            if (targetDistY > 0) { newDirection = 'S'; }
            if (targetDistX < 0) { newDirection = 'W'; }
            if (targetDistX > 0 && targetDistX === 0) {
                newDirection = coinToss() ? 'N' : 'S';
            }
        break;

    }

    return newDirection;

}



/**
* Sets a snakes new direction to tell it to go towards the food whose coordinates are
* held in snake.foodDist (probably the closest food).
* @param {Object} snake - The hungry hungry snake.
*/
function goTowardsFood(snake) {

    snake.newDirection = getDirectionTo(
        snake.direction,
        snake.foodDist.x,
        snake.foodDist.y
    );

}



/**
 * Sets a snakes new direction to tell it to go towards the center of the game board.
 * @param {Object} snake - The lazy snake.
 */
function goTowardsCenter(snake, board) {

    snake.newDirection = getDirectionTo(
        snake.direction,
        snake.centerDistance.x,
        snake.centerDistance.y
    );

}



/**
* Used to make a snake "look" around it at one cell to help determine which way to go.
* Pushes cell it's looked at into the array debugSquares.
* @param   {Object}  snake - The observant snake.
* @param   {String}  type  - Check for collisions with "snake"s, "wall"s, or a falsey value meaning both.
* @param   {int}     x     - Horizontal offset. E.g. "-1" to indicate 1 cell to the left of snakes head.
* @param   {int}     y     - Vertical offset.
* @returns {Boolean} - True if the specified snake & offsets collide with something bad.
*/
function checkPotentialCollision(snake, target, x, y, game) {

    var xCoord = snake.coords[0].x + x,
        yCoord = snake.coords[0].y + y;

    if (game.settings.debug) {
        //console.log(snake.name + " looking at coords: X:" + xCoord + " Y:" + yCoord);
        game.debugSquares.push({x: xCoord, y: yCoord});
    }

    if (target === "snake" || !target) {

        let collidesWithSelf = function() {
            return checkCollision(xCoord, yCoord, snake.coords);
        };

        let collidesWithOthers = function() {
            for (var i = 0; i < game.snakes.length; i++) {
                if (game.snakes[i] !== snake &&
                    checkCollision(xCoord, yCoord, game.snakes[i].coords)) {
                    return true;
                }
            }
        };

        if (collidesWithSelf() || collidesWithOthers()) {
            return true;
        }

    }

    if (target === "wall" || !target) {
        if (checkCollision(xCoord, yCoord, game.board)) { return true; }
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
function detectTube(snake, game) {

    // Boolean variables representing obstacles (snakes or walls) in the grid cells to the left and
    // right (in relation to the snake's direction) of the location the snake is about to move into:
    var obstacleL,
        obstacleR;

    switch (snake.newDirection || snake.direction) {
        case 'N':
            obstacleL = checkPotentialCollision(snake, null, -1, -1, game);
            obstacleR = checkPotentialCollision(snake, null,  1, -1, game);
        break;
        case 'E':
            obstacleL = checkPotentialCollision(snake, null,  1, -1, game);
            obstacleR = checkPotentialCollision(snake, null,  1,  1, game);
        break;
        case 'S':
            obstacleL = checkPotentialCollision(snake, null,  1,  1, game);
            obstacleR = checkPotentialCollision(snake, null, -1,  1, game);
        break;
        case 'W':
            obstacleL = checkPotentialCollision(snake, null, -1,  1, game);
            obstacleR = checkPotentialCollision(snake, null, -1, -1, game);
        break;
    }

    // Return true is there is an obstacle on both sides:
    return (obstacleL && obstacleR);

}



/**
 * Make the snake look left and right for an obstacle (a target obstacle).
 *
 * @param   {object} snake  The snake that's looking around.
 * @param   {string} target "snakes" or "walls". // TODO: Add food etc?
 *
 * @param   {number} x      If x is  1, then East is left and West is right.
 *                          If x is -1, then West is left and East is right.
 *                          If x is  0, then we're not looking along the X axis.
 *
 * @param   {number} y      If y is  1, then North is left and South is right.
 *                          If y is -1, then South is left and North is right.
 *                          If y is  0, then we're not looking along the Y axis.
 * @param   {object} game   Reference to the game object.
 *
 * @returns {object} An object with two booleans indicating if anything
 *                   was found to the .left and/or .right of the snake.
 */
function lookLeftAndRight(snake, target, x, y, game) {

    if (Math.abs(x) + Math.abs(y) > 1) {
        throw new Error("Can't look left/right on X and Y axis at the same time!");
    }

    // How far snakes can "see". If x is 0 then we're looking North/South not East/West.
    var viewDistance = (x === 0 ? game.board.h / 2 : game.board.w / 2);

    // Is there something to the snakes:
    var left = false,
        right = false;

    for (var i = 1; i < viewDistance; i++) {
        if (!left && !right) {
            left  = checkPotentialCollision(snake, target, -i * x,  i * y, game);
            right = checkPotentialCollision(snake, target,  i * x, -i * y, game);
            if (game.settings.debug && (left || right)) {
                console.log(
                    snake.name + " found a " + target + " to avoid on the: " + left + "," + right
                );
            }
        }
    }
    return {left: left, right: right};

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
 *
 * Snake avoidance is prioritised, no wall checks are done if a snake has been found to avoid.
 * This reduces the likelyhood of the AI from tangling itself up,
 * because it discourages it from getting too close to obstacles.
 * If nothing is found to avoid, or there is an obstacle an equal distance
 * from the snake on the left and the right, a direction is chosen randomly.
 *
 * A potential concern is that the two 'let' statements create new objects and may get
 * called multiple times within a game tick. That can't be fun for the garbage collector.
 *
 * @param   {Object}  snake The claustrophobic snake.
 * @param   {Object}  game  Reference to the game object.
 * @returns {Boolean} True if the snake should turn right, false if it should turn left.
 */
function shouldGoRight(snake, game) {

    var shouldGo = { left: false, right: false };

    var directionMap = [
        {direction: 'N', x:  1, y:  0},
        {direction: 'E', x:  0, y: -1},
        {direction: 'S', x: -1, y:  0},
        {direction: 'W', x:  0, y:  1},
    ];

    directionMap.forEach(map => {
        if ((snake.newDirection || snake.direction) === map.direction) {
            if (snake.ai.avoidance.snakes) {
                let snakeOnThe = lookLeftAndRight(snake, "snake", map.x, map.y, game);
                // Should go left if there's a snake on the right,
                // and should go right if there's a snake on the left:
                shouldGo = { left: snakeOnThe.right, right: snakeOnThe.left };
            }
            // Only check for walls if no snakes have been found to avoid:
            if (snake.ai.avoidance.walls && !shouldGo.left && !shouldGo.right) {
                let wallOnThe = lookLeftAndRight(snake, "wall", map.x, map.y, game);
                shouldGo = { left: wallOnThe.right, right: wallOnThe.left };
            }
        }
    });

    // Return true if going right is needed, false if left, otherwise randomly decide:
    if (!shouldGo.left && shouldGo.right) { return true; }
    if (!shouldGo.right && shouldGo.left) { return false; }
    return coinToss;

}



function avoidDirection(snake, avoid, game) {

    function ifNotBlockedGo(direction) {
        if (!snake.blocked[direction]) {
            snake.newDirection = direction;
        }
    }

    var tryToGoRight;

    if (!snake.ai.determined) {
        tryToGoRight = shouldGoRight(snake, game);
    } else {
        tryToGoRight = coinToss();
    }

    var avoidMap = [
        { avoiding: 'N', priority: ['W', 'S', 'E'] },
        { avoiding: 'E', priority: ['N', 'W', 'S'] },
        { avoiding: 'S', priority: ['E', 'N', 'W'] },
        { avoiding: 'W', priority: ['S', 'E', 'N'] },
    ];

    avoidMap.forEach(direction => {
        if (direction.avoiding === avoid) {
            if (tryToGoRight) {
                ifNotBlockedGo(direction.priority[0]);  // Attempt no.1 is least priority.
                ifNotBlockedGo(direction.priority[1]);  // Attempt no.2 overwrites previous.
                ifNotBlockedGo(direction.priority[2]);  // Attempt no.3 is preferred direction.
            } else {
                ifNotBlockedGo(direction.priority[2]);
                ifNotBlockedGo(direction.priority[1]);
                ifNotBlockedGo(direction.priority[0]);
            }
            if (game.settings.debug) {
                console.log(snake.name + " avoiding " + direction.avoiding + ", switched to: " + snake.newDirection);
            }
        }
    });

}



/**
  * Potentially determines a new direction for the AI to turn ('N','E','S','W').
  * If there is a new direction, it sets it as the snake's newDirection property.
  */
export function chooseDirection(snake, game) {

    function anyOtherSnake(query) {
        for (var i = 0; i < game.snakes.length-1; i++) {
            if (game.snakes[i] !== snake) {
                return query(game.snakes[i], snake);
            }
        }
    }

    if (!snake.ai.lazy) {
        goTowardsFood(snake);

    } else {

        // A lazy snake Can't Be Arsed (cba=true) to go to food if another snake is closer.
        // Lazy ai goes towards the center (+ shape) of the map if it cba to go for food.
        snake.ai.cba = anyOtherSnake((other, self) => other.foodDist.total < self.foodDist.total);

        if (!snake.ai.cba || snake.ai.alone || game.foodArray.length > 1) {
            if (game.settings.debug) {
                console.log(snake.name + " is NOT being lazy, and is going for food");
            }
            goTowardsFood(snake);
        } else {
            if (game.settings.debug) {
                console.log(snake.name + " cba, and is just going to center");
            }
            goTowardsCenter(snake, game.board);
        }

    }

    if (snake.ai.avoidance !== "none") {

        // Check if you gonna crash and avoid it. Uses the snakes current direction
        // if there is no new direction (i.e. if newDirection is falsey).
        switch (snake.newDirection || snake.direction) {
            case 'N': if (snake.blocked.N) avoidDirection(snake, 'N', game); break;
            case 'E': if (snake.blocked.E) avoidDirection(snake, 'E', game); break;
            case 'S': if (snake.blocked.S) avoidDirection(snake, 'S', game); break;
            case 'W': if (snake.blocked.W) avoidDirection(snake, 'W', game); break;
        }

        // Check if the snake is gonna go into a tube
        if (snake.ai.avoidance.tubes && !snake.ai.determined) {
            if (detectTube(snake, game)) {
                avoidDirection(snake, snake.newDirection, game);
            }
        }

    }

}
