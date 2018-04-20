
/**
 * Returns a random hex color string. E.g. "#f9da05".
 * @returns {string} Hex color string.
 */
export function randomColor() {
    return '#'+(Math.random() * 0xFFFFFF << 0).toString(16);
}

/**
 * Returns a hex color string which is an average of multiple input colors.
 * @param   {Array}  colors Array of hex color strings.
 * @returns {string} Hex color string.
 */
export function combineColors(colors) {
    var output = "#";
    for(var i = 1; i < 6; i += 2) {
        let ints = [];
        colors.forEach(color => {
            ints.push(parseInt(color.substring(i, i + 2), 16));
        });
        let hex = Math.trunc(ints.avg()).toString(16);
        output = output + ('0' + hex).slice(-2);
    }
    return output;
}
