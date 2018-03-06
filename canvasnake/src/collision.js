


export const Obstacle = Object.freeze({
    WALL: "a wall",
    SELF: "itself",
    ENEMY: "another snake"
});



/**
   * Collisions detection algorithm.
   * @param   {int}   x      - X coordinate
   * @param   {int}   y      - Y coordinate
   * @param   {array} target - Array of X, Y coords. Or game.board for wall collisions.
   * @returns {bool/String}  - Returns true if something bad was collided with.
   *                           Returns false if nothing collided with.
   *                           Returns reference to a food if food was collided with.
   */
export function check(x, y, target) {

    // The target has a width and height? We're checking if you've smacked a wall!
    if (target.w && target.h) {
        if (x === -1 || x === target.w || y === -1 || y === target.h) { return true; }
    }
    else
    {
        var tIndex = target.length;  // Targets index

        // Inspect every element of array, starting at the end and working back:
        while (tIndex--) {

            // Check if array element is in the same grid cell as whatever is at the x, y coords:
            if (target[tIndex].x === x && target[tIndex].y === y) {

                // If we're checking if food was collided with:
                if (target[tIndex].isFood) {
                    //nommedFood = tIndex;
                    return (target[tIndex]);
                }

                // If we're checking if anything else (probably something bad!) was collided with:
                return true;

            }

        }

    }

    // If we haven't returned a value yet (because nothing was collided with), then:
    return false;
}
