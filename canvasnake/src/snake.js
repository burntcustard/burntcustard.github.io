
import { coinToss } from './lib/misc.js';
import * as ai from './ai.js';
import * as oldAI from './ai-old.js';
import * as newAI from './ai-new.js';
import { Obstacle } from './collision.js';
import { check as checkCollision } from './collision.js';
import { updateHighScore } from './update.js';



/**
 * Constructs a new snake. See newGame.js for explanation and examples of how to use.
 */
export function Snake({
    name = "Player X",
    color = "black",
    direction = 'S',
    speed = 200,
    controls,
    coords,
    ai
}) {

    // Assign the optional parameters that have default values to the snake:
    Object.assign(this, {name, color, speed, direction});

    // If controls were specified then give them to the snake:
    if (controls) this.controls = controls;

    // Coordinates for the snake MUST have been specified!
    this.coords = coords || console.error(
        "Coordinates must be specified for " + this.name
    );

    // Give the snake AI properties if an 'ai' parameter object passed in:
    if (ai) {
        if (ai.neuralNet) {
            let {suicideOnWin = true} = ai;
            Object.assign(ai, {suicideOnWin});
            //ai.chromosome.roundsPlayed++;
        } else {
            let {lazy = false, suicideOnWin = true, avoidance = {}} = ai;
            Object.assign(ai, {lazy, suicideOnWin, avoidance});
            let {walls = true, snakes = true, tubes = true} = ai.avoidance;
            Object.assign(ai.avoidance, {walls, snakes, tubes});
        }
        this.ai = ai;
    }

    this.head = this.coords[0]; // Reference to the head coordinates for easy access.
    this.score = 0;
    this.dead = false;
    this.blocked = {N: false, E: false, S: false, W: false};
    this.foodDist = {x: 0, y: 0, total: 0, oldTotal: 0, closest: 0};
    this.centerDistance = {x: 0, y: 0, total: 0};
    this.movesSinceNommed = 0;
    this.winning = false;

}



/**
 * Updates the snakes direction to match it's new direction.
 * Disallows the snake from going back on itself.
 */
Snake.prototype.updateDirection = function() {

    var d = this.direction;

    // If there is a change in direction:
    if (this.newDirection) {
        //console.log("Updating direction of snake, old direction: " +d);
        switch (this.newDirection) {
            case 'N': if (d !== 'S') { this.direction = 'N'; } break;
            case 'W': if (d !== 'E') { this.direction = 'W'; } break;
            case 'S': if (d !== 'N') { this.direction = 'S'; } break;
            case 'E': if (d !== 'W') { this.direction = 'E'; } break;
        }
        //console.log("Snakes new direction: " + d);
    }

};



/**
 * Updates the snakes foodDistance object, which contains the coordinates of the
 * closest food in relation to the snakes head (X & Y), it's Manhattan distance
 * from the snakes head (total), and a reference to that food object (closest).
 * @param {Array} foods Reference to the array of food(s) on the game board.
 */
Snake.prototype.updateFoodDistance = function(foods) {

    var tmp = {};

    this.foodDist.oldTotal = this.foodDist.total;

    this.foodDist.x = 0;
    this.foodDist.y = 0;
    this.foodDist.total = 0;

    foods.forEach((food) => {

        // Distance from food
        tmp.x = food.x - this.head.x;
        tmp.y = food.y - this.head.y;
        tmp.total = Math.abs(tmp.x) + Math.abs(tmp.y);

        // If first food being looked at, or food is closer than previously closest food:
        if (!this.foodDist.total || tmp.total < this.foodDist.total) {
            this.foodDist.x = tmp.x;
            this.foodDist.y = tmp.y;
            this.foodDist.total = tmp.total;
            this.foodDist.closests = food;
        }

    });

};



// Currently probably only works with nicely rounded (even) board size:
Snake.prototype.updateCenterDistance = function(board) {

    var x = (board.w / 2) - this.head.x,
        y = (board.h / 2) - this.head.y,
        total = Math.abs(x) + Math.abs(y);

    this.centerDistance = {x: x, y: y, total: total};

};



/**
 * Updates the snakes blocked object to specify types of obstacles
 * (if there are any) that are in cells adjacent to the snakes head.
 * @param {object} board  Reference to the game board being played on.
 * @param {Array}  snakes Reference to the array of snakes in the game.
 */
Snake.prototype.updateBlocked = function(board, snakes) {

    // To start off with we assume the cells are no blocked:
    this.blocked = {N: false, E: false, S: false, W: false};

    var x = this.head.x,
        y = this.head.y;

    // Check if blocked by walls:
    if (checkCollision(x    , y - 1, board)) this.blocked.N = Obstacle.WALL;
    if (checkCollision(x + 1, y    , board)) this.blocked.E = Obstacle.WALL;
    if (checkCollision(x    , y + 1, board)) this.blocked.S = Obstacle.WALL;
    if (checkCollision(x - 1, y    , board)) this.blocked.W = Obstacle.WALL;

    // Check if blocked by snakes (including itself):
    snakes.forEach((snake) => {
        let blockedBy = (this === snake) ? Obstacle.SELF : Obstacle.ENEMY;
        if (checkCollision(x    , y - 1, snake.coords)) { this.blocked.N = blockedBy; }
        if (checkCollision(x + 1, y    , snake.coords)) { this.blocked.E = blockedBy; }
        if (checkCollision(x    , y + 1, snake.coords)) { this.blocked.S = blockedBy; }
        if (checkCollision(x - 1, y    , snake.coords)) { this.blocked.W = blockedBy; }
    });

};



Snake.prototype.updateProperties = function(game) {

    this.updateFoodDistance(game.foodArray);
    this.updateCenterDistance(game.board);
    this.updateBlocked(game.board, game.snakes);

    if (this.ai) {
        ai.updateAIProperties(this, game);
    }

};



Snake.prototype.update = function(game) {

    var nx, ny;

    this.updateProperties(game);

    // Pick direction for AI controlled snakes
    if ((this.ai && this.ai.dizzy === false) &&
        !(this.ai.alone && this.winning && this.ai.suicideOnWin)) {
        if (this.ai.neuralNet) {
            newAI.chooseDirection(this, game);
        } else {
            oldAI.chooseDirection(this, game);
        }
    }

    // Update which way the snake is going:
    this.updateDirection();

    //console.log(this.blocked);

    if (this.blocked[this.direction]) {
        this.dead = true;
        if (game.settings.debug) {
            console.log(this.name + " crashed into " + this.blocked[this.direction]);
        }
        return;  // Don't need to update anything else so return out.
    }

    // Assign position of head to "next x" and "next y" variables:
    nx = this.head.x;
    ny = this.head.y;

    // Move head around:
    switch (this.direction) {
        case 'N': ny--; break;
        case 'E': nx++; break;
        case 'S': ny++; break;
        case 'W': nx--; break;
    }

    var foodNommed = checkCollision(nx, ny, game.foodArray);
    if (foodNommed) {
        foodNommed.getEatenBy(this);
        if (!this.highScoreDisabled) {
            updateHighScore(this, game.highScores, game.settings.gameMode, game.state.onlyAI);
        }
        game.scoresNeedDrawing = true;
    } else {
        // Increment how many moves since the snake last nommed some food:
        this.movesSinceNommed++;
        // Remove last tail segment:
        this.coords.pop();
    }

    // Add a new item into the coords array for the new head. this.head remains pointing
    // to the old head, now residing in coords[1], so that's updated to point to coords[0].
    this.coords.unshift({ x: nx, y: ny });
    this.head = this.coords[0];
};



/**
* Figures out the order of the snakes size/score wise, with the biggest snake at
* the start of the array, through to the smallest snake at the end. If two snakes have
* equal scores, a cointoss decides the order of those two.
* @returns {Array of ints} Ordered set. E.g. [0,2,1].
*/
export function order(snakes) {

    var snakeOrder = [], // E.g [1,0,2] if snake[1] is 1st, snake[0] is 2nd, snake[2] is 3rd.
        snakeI, snakeJ,  // Indexes.
        score1, score2;  // Temporary stores of the scores of the two snakes.

    // Add all of the alive snakes to a set. E.g. [0,2] if there are 3 snakes but the 2nd is dead:
    for (snakeI = 0; snakeI < snakes.length; snakeI++) {
        if (!snakes[snakeI].dead) { snakeOrder.push(snakeI); }
    }

    // Perform a bubble sort on the snakeOrder set to order from highest to lowest score:
    for (snakeI = 0; snakeI < snakeOrder.length - 1; snakeI++) {
      for (snakeJ = 0; snakeJ < snakeOrder.length - 1; snakeJ++) {

        score1 = snakes[snakeOrder[snakeJ]].score;
        score2 = snakes[snakeOrder[snakeJ+1]].score;

        // If order is wrong, or if 2 snakes have same score (maybe), flip them around.
        if (score1 < score2 || ((score1 === score2) && (coinToss()))) {
          snakeOrder.swap(snakeJ, snakeJ + 1);
        }

      }
    }

    // Return ordered set:
    return snakeOrder;
}
