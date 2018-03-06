
import * as food from './food.js';
import { order as orderSnakes } from './snake.js';
import * as ai from './ai.js';
import { check as checkCollision } from './collision.js';



export function updateHighScore(snake, highScores, gameMode, onlyAI) {
    if ((!snake.ai || onlyAI) &&
        (snake.score > highScores[gameMode])) {
        highScores[gameMode] = snake.score;
        localStorage.setItem("snakeHighScores", JSON.stringify({highScores}));
    }
}



export function update(game) {

    var snakeOrder = orderSnakes(game.snakes);

    game.debugSquares = [];

    // Effectively each snake "taking it's turn".
    // The BIGGER SNAKE will update first and win in a head-on collision.
    snakeOrder.forEach(function(snakeIndex) {
        let snake = game.snakes[snakeIndex];

        // If the snake has a direction (game started?)
        if ((snake.direction) && (snake.dead === false)) {
            snake.update(game);
        }
    });

    // Update the AI data (again, so that when displayed it shows correct values for the
    // games current state, rather than the games state BEFORE the last snake moved. Also
    // check if the game needs to be ended (all snakes dead):
    game.state.finalUpdate = true;

    game.snakes.forEach(function(snake) {
        if (!snake.dead) {
            // Do any TURN SENSITIVE (i.e. only once per turn) AI updates here.
            game.state.finalUpdate = false;
            snake.updateProperties(game);
        }
    });

    if (game.state.finalUpdate) {
        // Figure out who won
        game.results.winner = game.snakes[0];
        for (let snakeI = 1; snakeI < game.snakes.length; snakeI++) {
            if (game.snakes[snakeI].score > game.results.winner.score) {
                game.results.winner = game.snakes[snakeI];
                game.results.draw = false;
            } else if (game.snakes[snakeI].score === game.results.winner.score) {
                game.results.draw = true;
            }
        }
    }
}
