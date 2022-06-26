
import { unAbs } from '../lib/misc.js';



function sigmoid(t) {
    return 1 / (1 + Math.exp(-t));
}

function tanh(t) {
    return (Math.exp(t) - Math.exp(-t)) / (Math.exp(t) + Math.exp(-t));
}

export function ReLU(t) {
    return Math.max(0, t);
}

export function softsign(t) {
    return t / (1 + Math.abs(t));
}

export function doubleSoftsign(t) {
    return 2 * (t / (1 + Math.abs(t)));
}

/**
 * Returns a number clamped between min and max values (inclusive).
 * @param   {number} number   [[Description]]
 * @param   {number} min = -1 [[Description]]
 * @param   {number} max = +1 [[Description]]
 * @returns {number} [[Description]]
 */
export function clamp(number, min = -1, max = 1) {
    if (number < min) {
        return min;
    }
    if (number > max) {
        return max;
    }
    return number;
}



/**
 * Returns a floating-point, pseudo-random number in
 * the range [0,1], that is likely to be around 0.
 *
 * TODO: Link to graphs on CodePen or somewhere.
 * TODO: Performance tests cause this is funky and maybe slow.
 *
 * @param   {number} pullTo0 = 3 Integer that determines how likely the
 *                               generated number is to be near 0.
 * @returns {number} Pseudo-random weighted number.
 */
export function randomWeightedLow(pullTo0 = 3) {
    return Math.min(...[...Array(pullTo0)].map(() => Math.random()));
}

/**
 * Returns a floating-point, pseudo-random number,
 * in the range [-1,1], that is likely to be around 0.
 *
 * @returns {number} Pseudo-random number that is intended
 *                   to be used as a neuron weight value.
 */
export function randomWeight() {
    return unAbs(randomWeightedLow());
}

