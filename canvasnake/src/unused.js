
/**
 * Old, broken, and/or unused canvasnake code that might be useful again one day
 * goes here. It is not loaded by index.html so don't worry too much about it.
 * /



/* This has been replaced by a similar function within ai.chooseDirection. */

/**
 * Performs a query function comparing one snake to all of the other snakes.
 * Useful for comparing properties of a single snake against all the others.
 *
 * @param   {Array}    snakes The list of all snakes.
 * @param   {function} query  The query to perform and return the results from.
 * @param   {object}   snake  The snake that shouldn't check itself.
 * @returns {[[Type]]} Returns whatever the query function returns.
 */
function anyOtherSnake(snakes, query, snake) {
    for (var i = 0; i < snakes.length-1; i++) {
        if (snakes[i] !== snake) {
            return query(snakes[i], snake);
        }
    }
}



/* This was replaced by the following arrow function in ai.chooseDirection */
/* anyOtherSnake((other, self) => other.foodDist.total < self.foodDist.total)); */

/**
 * Returns true if snakeA's head is closer to snakeA's closest food, than
 * snakeB's head to snakeB's closest food, otherwise returns false.
 * @param   {object}   snakeA Snake
 * @param   {object}   snakeB Snake
 * @returns {boolean}
 */
function closerToFood(snakeA, snakeB) {
    return snakeA.foodDist.total < snakeB.foodDist.total;
}
