
import { NeuralNet } from './neuralNet.js';

/**
 * Float32Array:
 *     BYTES_PER_ELEMENT: 4 (Rather than 8 for normal JS numbers).
 *
 *
 *
 *
 */


// The length of the fractional part to use for the floats:
const floatPrecision = 7;

const digitStr =
//  0       8       16      24      32      40      48      56     63
//  v       v       v       v       v       v       v       v      v
   "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$_";



function floatFractionToBinary(number) {

    // Example starting weight number:
    // 0.7853981852531433

    // Only work with positive integers:
    number = Math.abs(number);

    // Loose some precision to save complexity (also converts to string):
    number = number.toFixed(floatPrecision);
    // "0.7853982"

    // Make sure it's not too big, and
    // Chop the integer part (0) and the decimal point out:
    if (number >= 1) {
        number = 9999999;  // 0.9999999 but pre-parsed/sliced.
    } else {
        number = parseInt(number.slice(2));
    }
    // 785392

    // Convert from integer to binary-string:
    number = parseInt(number).toString(2);
    // "11101111101011110011110"

    // Make sure the padding/character count is correct:
    number = number.padStart(24,'0');
    // "011101111101011110011110"

    return number;
}



/**
 * Converts a weight from a single Float32 in the range
 * [-1,1] (inclusive) to a cusome base64-ish encoded string.
 * @param {number} weight [[Description]]
 */
export function weightToBase64(weight) {

    if (weight < -1 || weight > 1) {
        throw new RangeError("Weight must be in the range [-1,1]");
    }

    var binaryString = floatFractionToBinary(weight);
    var fixedLength = 24;  // Should === binaryString.length
    var base64Str = "";

    for (let i = 0; i < 4; i++) {
        let digitStrIndex = 0;
        for (let j = 0; j < 6; j++) {
            if (binaryString[fixedLength-1-j-(i*6)] === '1') {
                digitStrIndex += Math.pow(2, j);
            }
        }
        base64Str = digitStr[digitStrIndex] + base64Str;
    }

    let sign = weight < 0 ? '-' : '+';
    return sign + base64Str;
}



export function base64ToWeight(base64) {

    var numLength = 5,  // Length of the numbers part of the base64 string.
        weightStr = "",
        weightInt = 0,
        weight = new Float32Array(1);

    for (let i = 0; i < numLength - 1; i++) {
        let base64Index = digitStr.indexOf(base64[numLength - 1 - i]);
        let base64Value = base64Index * Math.pow(64, i);
        weightInt += base64Value;
    }

    // Pad the left to get digits in the right places:
    weightStr = weightInt.toString(10).padStart(floatPrecision, '0');

    let sign = base64[0] === '-' ? "-0." : "+0.";
    weight[0] = sign + weightStr;  // Automagic String -> Float32 parsing.
    return weight[0];
}



/**
 * Test to check if conversions to/from base64 work.
 * TODO: Disable depending on the AI debug setting?
 */
window.testBase64Conversions = function() {
    var testWeight = Math.random() * 2 - 1;
    console.log("Test weight: " + testWeight);
    var base64 = weightToBase64(testWeight);
    console.log("  Converted to base64: " + base64);
    var float32 = base64ToWeight(base64);
    console.log("  Converted back to float32: " + float32);
};
