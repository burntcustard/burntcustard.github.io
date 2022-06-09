
import { Snake } from './snake.js';
import { softsign } from './ai/functions.js';
import { cardinalToRelative, relativeToCardinal } from './ai/relCard.js';



function getInputs(snake, game) {

    var inputs = [];

    var closestFood = cardinalToRelative(
        snake.direction,
        {x: snake.foodDist.x, y: snake.foodDist.y}
    );
    inputs.push(softsign(closestFood.x));
    inputs.push(softsign(closestFood.y));

    /* // Separate L/R/F/B food inputs
    if (closestFood.x > 0) {
        inputs.push(0);
        inputs.push(Math.min(1 / Math.abs(closestFood.x), 1));
    } else {
        inputs.push(Math.min(1 / Math.abs(closestFood.x), 1));
        inputs.push(0);
    }
    if (closestFood.y > 0) {
        inputs.push(0);
        inputs.push(Math.min(1 / Math.abs(closestFood.y), 1));
    } else {
        inputs.push(Math.min(1 / Math.abs(closestFood.y), 1));
        inputs.push(0);
    }
    */
    game.snakes.forEach(otherSnake => {
        if (snake !== otherSnake) {
            /*
            let enemySnakeHead = cardinalToRelative(
                snake.direction,
                {x: otherSnake.head.x, y: otherSnake.head.y}
            );
            inputs.push(enemySnakeHead.x);
            inputs.push(enemySnakeHead.y);

            let closestFoodToEnemy = cardinalToRelative(
                snake.direction,
                {x: snake.foodDist.x, y: snake.foodDist.y}
            );
            inputs.push(closestFoodToEnemy.x);
            inputs.push(closestFoodToEnemy.y);
            */
        }
    });

    /*
    var distanceToWall = cardinalToRelative(snake.direction, {
        x: game.board.w - snake.head.x,
        y: game.board.h - snake.head.y
    });
    inputs.push(distanceToWall.x);
    inputs.push(distanceToWall.y);
    */

    var blocked = cardinalToRelative(snake.direction, snake.blocked);
    inputs.push(!!blocked.F | 0); // 8 - 4
    inputs.push(!!blocked.R | 0);
    inputs.push(!!blocked.L | 0);

    return new Float32Array(inputs);

}



export function chooseDirection(snake, game) {

    snake.ai.neuralNet.update(getInputs(snake, game));

    var outputs = snake.ai.neuralNet.outputs;
    var newDirection = snake.newDirection = null;
    var genome = snake.ai.neuralNet.genome;
    if (snake.turnCounter === undefined) { snake.turnCounter = 0; }

    // Get the index of the highest of the Forward/Right/Left outputs
    // output is 0 if all the outputs are 0 (or identical).
    var output = outputs.indexOf(Math.max(...outputs));
    switch (output) {
        case 0: newDirection = 'F'; break;
        case 1: newDirection = 'R'; break;
        case 2: newDirection = 'L'; break;
    }

    snake.newDirection = relativeToCardinal(snake.direction, newDirection);

    // Reward for just staying alive:
    //genome.fitness++;

    // Reward for going towards/away from food:
    if (snake.foodDist && snake.foodDist.oldTotal) {
        if (snake.foodDist.total < snake.foodDist.oldTotal) {
            genome.fitness += 3;
        } else {
            genome.fitness -= 3;
        }
    }

}



Snake.prototype.updateFitness = function(results) {

    var genome = this.ai.neuralNet.genome;

    // Reward for eating any foods:
    genome.fitness += this.score * 20;

    // Reward for winning (and getting at least 1 food):
    if (this === results.winner) genome.fitness += 50;

};
