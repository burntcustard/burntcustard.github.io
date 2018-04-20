
/**
 * Converts a cardinal direction to a relative direction.
 *
 * For example if a food object is on the right of the game board
 * and the snake is on the left, travelling towards the food, the
 * cardinal direction's x value is swapped with the y.
 *
 * For example if a an obstacle is to the East of a snake which is travelling
 * North, the cardinal directions East (E) property is converted to Right (R).
 *
 * @param {string} snakeDirection A snakes direction string.
 * @param {object} input          An object with either:
 *                                 - x and y properties
 *                                 - N,E,S,W properties
 * @returns {object} The input converted to a relative direction object.
 */
export function cardinalToRelative(snakeDirection, input) {

    if (snakeDirection === undefined) {
        throw new TypeError(
            "snakeDirection was not a valid cardinal direction string."
        );
    }

    // Cardinal x, y coordinates -> Relative x, y coordinates
    if (input.x !== undefined && input.y !== undefined) {
        let {x, y} = input;
        switch (snakeDirection) {
            case 'N': return({x:  y, y:  x});
            case 'E': return({x: -x, y:  y});
            case 'S': return({x: -y, y: -x});
            case 'W': return({x:  x, y: -y});
        }
    }

    // Cardinal North, East, South, West -> Relative Front, Right, Back, Left
    else if (input.N !== undefined) {
        let {N, E, S, W} = input;
        switch (snakeDirection) {
            case 'N': return({F: N, R: E, B: S, L: W});
            case 'E': return({F: E, R: S, B: W, L: N});
            case 'S': return({F: S, R: W, B: N, L: E});
            case 'W': return({F: W, R: N, B: E, L: S});
        }
    }

}


export function cardinalToRelativeCoord(snakeDirection, coords) {
    var h = 30,
        w = 30;
    // Cardinal x, y coordinates -> Relative x, y coordinates
    if (coords.x !== undefined && coords.y !== undefined) {
        let {x, y} = coords;
        switch (snakeDirection) {
            case 'N': return({x:   y, y:   x});
            case 'E': return({x: w-x, y:   y});
            case 'S': return({x: h-y, y: w-x});
            case 'W': return({x:   x, y: h-y});
        }
    }
}


/**
 * Converts a relative direction string (F,R,B,L) to a cardinal direction
 * string (N,E,S,W), based off a snake's cardinal direction property.
 *
 * @param   {string} snakeDirection [[Description]]
 * @param   {string} direction      [[Description]]
 * @returns {string} [[Description]]
 */
export function relativeToCardinal(snakeDirection, direction) {

    if (typeof(direction) === "string") {

        switch (snakeDirection) {
            case 'N':
                switch (direction) {
                    case 'F': return 'N';
                    case 'R': return 'E';
                    case 'B': return 'S';
                    case 'L': return 'W';
                }
            break;
            case 'E':
                switch (direction) {
                    case 'F': return 'E';
                    case 'R': return 'S';
                    case 'B': return 'W';
                    case 'L': return 'N';
                }
            break;
            case 'S':
                switch (direction) {
                    case 'F': return 'S';
                    case 'R': return 'W';
                    case 'B': return 'N';
                    case 'L': return 'E';
                }
            break;
            case 'W':
                switch (direction) {
                    case 'F': return 'W';
                    case 'R': return 'N';
                    case 'B': return 'E';
                    case 'L': return 'S';
                }
            break;
        }

    }

    // If nothing was converted:
    throw new TypeError("Input was not a valid relative direction string.");

}



export function cardinalToRelative2DArray(snakeDirection, board) {

    function transpose(arr) {
        return arr[0].map((_, c) => arr.map(r => r[c]));
    }

    function rotate(arr) {
        return transpose(arr).map(r => r.reverse());
    }

    function reverse(arr) {
        return arr.map(r => r.reverse()).reverse();
    }

    //console.log(snakeDirection);

    switch (snakeDirection) {
        case 'N': return board;
        case 'E': return rotate(board);
        case 'S': return reverse(board);
        case 'W': return rotate(reverse(board));
        default: throw new TypeError(
            "snakeDirection was not a valid cardinal direction string."
        );
    }

}
