
/**
 * A collection of methods that extend the built-in Array object.
 * The methods are also given to different types of TypedArray.
 *
 * Care must be taken to ensure there are no conflicts with external library
 * properties, or future JavaScript updates that introduce similar properties.
 */



/**
 * Swap two elements in an array in place and return the array.
 *
 * Example:
 * myArray = [x, y, z];
 * myArray.swap(0, 2);
 * myArray === [z, y, x];
 *
 * @param   {int} a Index of element A.
 * @param   {int} b Index of element B.
 * @returns {array} The array with A and B swapped.
 */
Array.prototype.swap = function (a, b) {
    [this[a], this[b]] = [this[b], this[a]];
    return this;
};

/**
 * Return a random element from an array.
 * @returns {[[Type]]} [[Description]]
 */
Array.prototype.random = function() {
    return this[Math.trunc(Math.random() * this.length)];
};

Array.prototype.randomIndex = function() {
    return Math.trunc(Math.random() * this.length);
};

Array.prototype.last = function() {
    return this[this.length - 1];
};

/**
 * Return all the values of an array added together.
 * @returns {number, string} [[Description]]
 */
Array.prototype.sum = function() {
  return this.reduce((accumulator, current) => accumulator + current);
};

/**
 * Return the average of all of the values in an array.
 * @returns {number} [[Description]]
 */
Array.prototype.avg = function () {
  return this.sum() / this.length;
};

/**
 * Shuffles the elements of an array in place and returns the array.
 *
 * Uses a modern adaptation of the Fisher-Yates shuffle algorithm.
 */
Array.prototype.shuffle = function() {
    var i, j;
    for (i = this.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        [this[i], this[j]] = [this[j], this[i]];
    }
    return this;
};

/**
 * Returns the index of the array element with the highest numerical value.
 * @returns {number} Index number.
 */
Array.prototype.maxIndex = function() {
    return this.indexOf(Math.max(...this));
};

/**
 * Returns the index of the array element with the lowest numerical value.
 * @returns {number} Index number.
 */
Array.prototype.minIndex = function() {
    return this.indexOf(Math.min(...this));
};

// (Optional) typed arrays to give all of the custom array methods to:
var typedArrayTypes = [
    //Int8Array,
    //Uint8Array,
    //Uint8ClampedArray,
    //Int16Array,
    //Uint16Array,
    //Int32Array,
    //Uint32Array,
    Float32Array,
    //Float64Array
];

typedArrayTypes.forEach(typedArrayType => {
    Object.keys(Array.prototype).forEach(property => {
        if (!typedArrayType.prototype.hasOwnProperty(property)) {
            typedArrayType.prototype[property] = Array.prototype[property];
        }
    });
});
