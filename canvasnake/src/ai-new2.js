
/**
 * Similar to new-ai.js, except the plan is to input an entire grid
 * representing the game board (i.e. w*h neural network inputs.)
 *
 * The inputs will be 1 if the grid cell is a food, 0 if the cell contains
 * nothing, and gradually increasing threat level will be a negative number,
 * e.g. -1 for an enemy snakes head (or wall?), and 0.9 for the enemy snakes
 * 1st body, 0.8 for the 2nd, etc.
 *
 * ai-new.js snakes seem to max out at about 2000-2500 fitness, but hopefully
 * ai-new2.js snakes can reach >9000 fitness, albeit with a lot more training.
 */



import { Snake } from './snake.js';
import { relativeToCardinal, cardinalToRelative, cardinalToRelativeCoord, cardinalToRelative2DArray } from './ai/relCard.js';



function getInputs(self, game) {

    var inputs = [];

    var w = game.board.w,
        h = game.board.h;

    // Create "game board" type array with an array element for every cell:
    //var cardinalBoardArray = new Float32Array(game.board.w * game.board.h);
    //var relativeBoardArray = new Float32Array(game.board.w * game.board.h);

    var cardinalBoardArray = [];
    for (let row = 0; row < h; row++) {
        cardinalBoardArray[row] = [];
        for (let column = 0; column < w; column++) {
            cardinalBoardArray[row].push(0);
        }
    }

    //console.log(cardinalBoardArray);

    var flatBoardArray = [];

    game.snakes.forEach(snake => {
        snake.coords.forEach((body, i) => {
            if (i > 0 || snake !== self) {  // Don't use own head.
                cardinalBoardArray[body.y][body.x] = - 1 / (i + 1);
            }
        });
    });

    game.foodArray.forEach(food => {
        cardinalBoardArray[food.y][food.x] = 1;
    });

    // Convert to relative and flatten the 2D board array:
    flatBoardArray = [].concat(
        ...cardinalToRelative2DArray(self.direction, cardinalBoardArray)
    );

    // Add the board array to the inputs:
    flatBoardArray.forEach(cell => {
        inputs.push(cell);
    });

    var head = cardinalToRelativeCoord(self.direction, self.head);
    inputs.push((1 / w) * head.x);
    inputs.push((1 / h) * head.y);

    return inputs;
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

    //if (newDirection === 'F') genome.fitness++;

    //console.log("Output: " + output);

    snake.newDirection = relativeToCardinal(snake.direction, newDirection);

    // Reward for just staying alive:
    genome.fitness++;

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



Snake.prototype.printBoardView = function() {
    var w = 30,
        h = 30;
    let inputs = this.ai.neuralNet.layers[0].reduce(function(acc, cur) {
        acc.push(cur.inputs[0]);
        return acc;
    }, []);

    for (let r = 0; r < w; r++) {
        console.log(r.toString().padStart(2, ' ') + ':' +
            inputs.slice(r * h, r * h + w).reduce(function(acc, cur) {
                return acc += cur.toFixed(1).padStart(4, ' ');
            }, '')
        );
    }
};

