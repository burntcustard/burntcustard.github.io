
import * as food from './food.js';
import { order as orderSnakes } from './snake.js';
import * as ai from './ai.js';
import { check as checkCollision } from './collision.js';



export function updateHighScore(snake, highScores, gameMode, onlyAI) {
    if ((!snake.ai || onlyAI) &&
        (snake.score > highScores[gameMode])) {
        highScores[gameMode] = snake.score;
        localStorage.setItem("snakeHighScores", JSON.stringify(highScores));
    }
}



export function update(game) {

    var snakeOrder = orderSnakes(game.snakes);

    // Last round was the last update. The game is now over, and
    // we don't need to update again, so return (exit function):
    if (game.state.finalUpdate) {
        game.state.gameOver = true;
        return;
    }

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
            //snake.updateProperties(game);
        }
    });

    // Game's over. Figure out who won of if it was a draw:
    // Game is over (but state.gameOver isn't set until update is called again)
    // Figure out who won and stuff:
    if (game.state.finalUpdate) {
        game.results.winner = game.snakes[0];
        for (let snakeI = 1; snakeI < game.snakes.length; snakeI++) {
            if (game.snakes[snakeI].score > game.results.winner.score) {
                game.results.winner = game.snakes[snakeI];
                game.results.draw = false;
            } else if (game.snakes[snakeI].score === game.results.winner.score) {
                game.results.draw = true;
            }
        }
        // Update NeuralNet AIs, and their population:
        if (game.ai && game.ai.population) {
            // Update the fitnesses on end-of-round (e.g. points for winning):
            game.snakes.forEach(snake => {
                if (snake.ai && snake.ai.neuralNet) {
                    snake.updateFitness(game.results);
                }
            });
            // A fought B-1, (because before this gets printed B gets incremented).
            //console.log("A: " + game.ai.popIndexA + " | B: " + game.ai.popIndexB);
            if (game.ai.popIndexA === game.ai.population.size &&
                game.ai.popIndexB > game.ai.population.roundsPerOrganism) {
                game.ai.population.refresh();
            }
        }
    }

}
