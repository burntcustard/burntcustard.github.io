
import {check as checkCollision} from './collision.js';



function Food(game) {

    this.foodArray = game.foodArray;
    this.isFood = true;

    var validFood,
        failedFoodCount = 0;

    // Place food in a random grid location on the game board:
    do {
        validFood = true;
        this.x = Math.floor(Math.random() * game.board.w);
        this.y = Math.floor(Math.random() * game.board.h);
        for (var snakeJ = 0; snakeJ < game.snakes.length; snakeJ++) {
            if (checkCollision(this.x, this.y, game.snakes[snakeJ].coords)) {
                if (game.settings.debug) { console.log("Tried to put food in a snake, whoops!"); }
                validFood = false;
            }
        }
        if (validFood) {  // If it's not inside a snake, check if inside another food
            if (checkCollision(this.x, this.y, game.foodArray)) {
                if (game.settings.debug) { console.log("Tried to put food in a food, whoops!"); }
                validFood = false;
            }
        }
        if (!validFood) { failedFoodCount++; }
        if (failedFoodCount > 99) { throw new Error("Failed to create new food. (╯°□°）╯︵ ┻━┻"); }
    } while (!validFood);

    game.foodArray.push(this);

}

Food.prototype.getEatenBy = function(snake) {

    // Add 1 to the snakes score (no matter what food was nommed):
    snake.score++;

    // Reset movesSinceNommed counter:
    snake.movesSinceNommed = 0;

    // Remove eaten food from the game:
    this.foodArray.splice(this.foodArray.indexOf(this), 1);

};



function PlusFood(game) {
    Food.call(this, game);
    this.name = "Plus Food";
    this.color = "orangered";
    this.getEatenBy = function(snake) {
        snake.speed = Math.round(snake.speed - snake.speed / 8);
        Food.prototype.getEatenBy.call(this, snake);
        if (game.foodArray.length === 0) {
            spawnFood(game);
        }
    };
}



function MinusFood(game) {
    Food.call(this, game);
    this.name = "Minus Food";
    this.color = "#32d52b";
    this.getEatenBy = function(snake) {
        snake.speed = Math.round(snake.speed + snake.speed / 4);
        Food.prototype.getEatenBy.call(this, snake);
        if (game.foodArray.length === 0) {
            spawnFood(game);
        }
    };
}



function BananaFood(game) {
    Food.call(this, game);
    this.name = "Banana Food";
    this.color = "gold";
    this.getEatenBy = function(snake) {
        Food.prototype.getEatenBy.call(this, snake);
        spawnFood(game);
        spawnFood(game);
        spawnFood(game);
    };
}



/**
 * Returns all of the current snakes scores added together. Used in determining
 * how far the game has progressed and therefore which food type to spawn.
 * @param   {Array} snakes Array of snakes whose scores to combine.
 * @returns {number} Combined score.
 */
function getCombinedScore(snakes) {

    var combinedScore = 0;

    snakes.forEach(snake => {
        combinedScore += snake.score;
    });

    return combinedScore;
}



// ╔══════════════════════════════╗ //
// ║        ■▀                    ║ //
// ║   ▄██▄█▄█▄          ╔═════╗  ║ //
// ║  ██████████    ▀▄   ║     ║  ║ //
// ║  █████████  ■■■■■█  ║   ■ ║  ║ //
// ║  ██████████    ▄▀   ╚═════╝  ║ //
// ║   ▀██▀▀██▀                   ║ //
// ╚══════════════════════════════╝ //
/**
 * Decides what food to spawn based on the snakes scores, then spawns it.
 * @param {object} game Reference to the game object.
 */
export function spawnFood(game) {

    var combinedScore = getCombinedScore(game.snakes),
        foodNumber,
        newFood;

    // If it's not the first food of the game (i.e. a player has at least one point),
    // maybe change the food being created to "Minus speed" or "Banana" food:
    if (combinedScore > 0) {
        foodNumber = (Math.ceil(Math.random() * combinedScore));
        if (foodNumber % 5 === 0) { newFood = new MinusFood(game); }
        if (foodNumber % 7 === 0) { newFood = new BananaFood(game); }
    }
    // If the fancy-food spawning wasn't successful, spawn the default "Plus speed" food:
    if (!newFood) {
        newFood = new PlusFood(game);
    }

    if (game.settings.debug) {
        console.log("Created " + newFood.name + " with number: " + foodNumber + " at position: " + newFood.x + "," + newFood.y);
    }

}
