
/**
 * Returns true if a string is a valid name, i.e. only contains alphanumerical
 * characters, spaces, or underscores. Otherwise returns false.
 * 
 * Specifically: [0..9], [a..z], [A..Z], ' ', '_'.
 * 
 * @param   {string} string Input string to test.
 * @returns {boolean}
 */
export function isName(string) {
    return /^[\w\s]+$/.test(string);
}



/**
* @returns {Boolean} Yay or nay.
*/
export function coinToss() {
    return (Math.floor(Math.random() * 2)) ? true : false;
}



/**
 * Randomly returns either a + or - version of a number.
 * I.e. the opposite of Math.abs().
 * @returns {number}
 */
export function unAbs(number) {
    return number * (coinToss() ? -1 : 1);
}


/**
 * Convert from [0,1] to [-1,1], or a similar
 * positive-only to doubled, equidistant from 0 range.
 * @param   {number} input [[Description]]
 * @param   {number} min   [[Description]]
 * @param   {number} max   [[Description]]
 * @returns {number} [[Description]]
 */
export function toRange(input, min, max) {
    if (Math.abs(min) !== Math.abs(max)) {
        throw new RangeError(
            "Output range min and max must be equidistant from 0"
        );
    }
    return (input * max * 2) - min;
}



/**
 * Check if something is even.
 *
 * Potential input types and what is evaluated:
 *     number  : Its parity (unless NaN).
 *     string  : If parsable to a number, that number's parity.
 *             : If not parsable to a number, the parity of the string's length.
 *     Array   : The parity of its length.
 *     object  : The parity of the number of it's enumerable own properties.
 *     boolean : Treated as 1 and 0, so returns false for true, and true for false.
 *     null    : Returns true as null is similar to 0.
 *
 * @throws  {TypeError} The input cannot be NaN.
 * @param   {number|string|Array|object} arg
 * @returns {boolean} true if even, false if odd.
 */
export function isEven(arg) {

    if (Array.isArray(arg)) {
        return arg.length % 2 === 0;
    }

    let number = Math.abs(arg);
    if (typeof number === "number" && !Number.isNaN(number)) {
        return number % 2 === 0;
    }

    if (typeof arg === "string") {
        return arg.length % 2 === 0;
    }

    if (typeof arg === "object") {
        return Object.keys(arg).length % 2 === 0;
    }

    if (isNaN(arg)) {
        throw new TypeError("Input cannot be NaN");
    }

}

/**
 * Check if something is odd.
 *
 * Potential input types and what is evaluated:
 *     number  : Its parity (unless NaN).
 *     string  : If parsable to a number, that number's parity.
 *             : If not parsable to a number, the parity of the string's length.
 *     Array   : The parity of its length.
 *     object  : The parity of the number of it's enumerable own properties.
 *     boolean : Treated as 1 and 0, so returns true for true, and false for false.
 *     null    : Returns false as null is similar to 0.
 *
 * @throws  {TypeError} The input cannot be NaN.
 * @param   {number|string|Array|object} arg
 * @returns {boolean} true if odd, false if even.
 */
export function isOdd(arg) {

    if (Array.isArray(arg)) {
        return arg.length % 2 === 1;
    }

    let number = Math.abs(arg);
    if (typeof number === "number" && !Number.isNaN(number)) {
        return number % 2 === 1;
    }

    if (typeof arg === "string") {
        return arg.length % 2 === 1;
    }

    if (typeof arg === "object") {
        return Object.keys(arg).length % 2 === 1;
    }

    if (isNaN(arg)) {
        throw new TypeError("Input cannot be NaN");
    }

}
