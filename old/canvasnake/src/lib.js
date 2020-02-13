

/**
* Swaps two elements in an array around. Example:
* myArray = [x, y, z];
* myArray.swap(0, 2);
* myArray === [z, y, x];
* @param   {int} x - Index of 1st element.
* @param   {int} y - Index of 2nd element.
* @returns {array} - The array with the elements in the new order.
*/
Array.prototype.swap = function (x, y) {
    var tmp = this[x];
    this[x] = this[y];
    this[y] = tmp;
    return this;
};



/**
* @returns {Boolean} Yay or nay.
*/
export function coinToss() {
    if (Math.floor((Math.random() * 2))) {
        return true;
    } else {
        return false;
    }
}
