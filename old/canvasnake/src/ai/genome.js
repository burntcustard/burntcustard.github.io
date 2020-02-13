
import { randomColor } from '../lib/color.js';
import { unAbs } from '../lib/misc.js';
import { settings } from './settings.js';
import { randomWeight, randomWeightedLow, clamp } from './functions.js';
import { encodeGenome } from './genomeStr.js';



/**
 * [[Description]]
 * @param {[[Type]]} topology [[Description]]
 * @param {[[Type]]} weights  [[Description]]
 */
export function Genome({topology, weights, color, name} = {}) {

    this.fitness = 0;
    if (name) this.name = name;
    this.color = color || randomColor();
    this.topology = topology || settings.topology;
    if (weights) {
        this.weights = weights;
    } else {
        // Weights haven't been specified so randomly generate some:
        let numOfWeights = this.topology[0]; // A weight for each input neuron bias.
        for (let i = 1; i < this.topology.length; i++) {
            numOfWeights += this.topology[i] * (this.topology[i-1] + 1);
        }
        // Make array of x length that's all initialized to 0 (super speedy):
        this.weights = new Float32Array(numOfWeights);
        if (settings.startWeight) {
            for (let i = 0; i < this.weights.length; i++) {
                this.weights[i] = settings.startWeight();
            }
        }
    }

    // Keep a record of the original "base" weights that the genome started
    // with. After a lot of mutating, this.weights should be quite different!
    this.baseWeights = this.weights.slice();
}



Genome.prototype.getMutatedWeights = function() {
    var mutatedWeights = [];
    for (let i = 0; i < this.weights.length; i++) {
        let weight = this.weights[i].toFixed(3).toString().padStart(6),
            baseWeight = this.baseWeights[i].toFixed(3).toString().padStart(6);
        if (weight !== baseWeight) {
            mutatedWeights.push(
                (i + " ").padStart(5) + weight + " -> " + baseWeight
            );
        }
    }
    return mutatedWeights;
};



/**
 * Mutates a neural network's genome (i.e. mutates an organism).
 * A random weight in the genome is chosen to mutate, and then a
 * replacement weight value is chosen. The mutation amount
 * @param {number} amount   How much the original weight value should
 *                          change. 0 meaning no change, 1 meaning the
 *                          old value is replaced with the new, 0.5
 *                          meaning that the replacement will be half
 *                          way in between the old and new values.
 * @param {number} tendancy How likely it is a particular weight will be mutated.
 *                          E.g. 0.1 means on average, 1 in every 10 will mutate.
 */
Genome.prototype.mutate = function(
    //amountToMutate = settings.mutationAmount,
    //numberToMutate = settings.mutationNumber,
    //tendancy = settings.mutationTendancy,
    weightRates = {
        new: 0.8,
        max: 0,
        min: 0,
        pos: 0,
        neg: 0,
        flip: 0.2,
        zero: 0,
        rand: 0
    },
    weightFuncs = [
        function() { return settings.newWeight(); },
        function() { return +1; },
        function() { return -1; },
        function(weight) { return weight + randomWeightedLow(9); },
        function(weight) { return weight - randomWeightedLow(9); },
        function(weight) { return -weight; },
        function() { return 0; },
        function() { return unAbs(Math.random()); }
    ]
) {

    // Need to do  [x x x - - x - -]
    // rather than [- x - - x - x -]
    // or          [- - - x x x - -] ?

    this.mutated = settings.mutationAmount();

    if (!this.mutated) {
        return false;
    }

    var threshold = new Float32Array(Object.keys(weightRates).length);
    Object.keys(weightRates).forEach(function(key, rateIndex) {
        for (let i = rateIndex; i < threshold.length; i++) {
            threshold[i] += weightRates[key];
        }
    });

    let i = this.weights.randomIndex(),
        newWeight = 0;
    for (let j = 0; j < this.mutated; j++) {
        if (++i === this.weights.length) i = 0;  // Increment/overflow.
        let chance = Math.random();
        for (let k = 0; k < threshold.length; k++) {
            if (chance < threshold[k]) {
                newWeight = weightFuncs[k](this.weights[i]);
                break;
            }
        }
        //console.log("Weight " + (i+1) + " of " + this.weights.length + " mutated: " + this.weights[i] + " → " + newWeight);
        this.weights[i] = clamp(newWeight);
    }

    this.color = randomColor();
    return this.mutated;

};



/**
 * Returns a copy of the genome with some bits removed, some
 * added, making it suitable for analysing and/or recreating.
 * @param   {object} population The population the genome belongs to.
 * @returns {object} Modified copy of the genome.
 */
Genome.prototype.save = function(population) {

    // A copy of the genome:
    let genome = JSON.parse(JSON.stringify(this));

    // Convert weights back into a Float32Array because JSON breaks it:
    genome.weights = new Float32Array(this.weights);

    // Add the generation counter:
    if (population) genome.created = "gen" + population.genCounter;

    // Remove unnecessary properties:
    delete genome.baseWeights;

    return genome;
};



Genome.prototype.encode = function() {
    return encodeGenome(this);
};
