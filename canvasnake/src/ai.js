
export function updateAIProperties(snake, game) {

    // Check if snake is the last snake alive and if it's winning (higher score)
    snake.ai.alone = true;
    snake.winning = true;
    game.snakes.forEach(function(otherSnake) {
        if (otherSnake !== snake) {
            if (otherSnake.dead === false) {
                snake.ai.alone = false;
            }
            if (otherSnake.score >= snake.score) {
                snake.winning = false;
            }
        }
    });

    // If the snake hasn't eaten in a long time, it becomes "determined" to get to
    // the food, potentially turning off parts of it's collision avoidance.
    snake.ai.determined = (snake.movesSinceNommed > 50 ? true : false);

    // If the snake hasn't eaten in a VERY long time, it becomes "dizzy" and stops
    // being able to pick a new direction to go in (probably leading to it's death).
    snake.ai.dizzy = (snake.movesSinceNommed > 100 ? true : false);

}
