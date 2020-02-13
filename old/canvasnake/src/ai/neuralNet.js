
import { settings } from './settings.js';
import { Neuron } from './neuron.js';
import { Genome } from './genome.js';
import * as func from './functions.js';
import '../lib/array.js';



// Not to be confused with _P_layer huehue. TODO: Documentation
// Holds a bunch of neurons
function Layer({
    name,
    inputs,
    numNeurons,
    inputsPerNeuron = 0,  // 0 means no WEIGHTED inputs per Neuron.
    genomeWeights,
    cWeight,
    numWeights,
    activationFunc = func.softsign
}) {
    this.name = name;
    this.inputs = inputs;
    let layerWeights = genomeWeights.slice(cWeight.i, cWeight.i + numWeights);
    let weightsPerNeuron = inputsPerNeuron + 1;
    for (let i = 0; i < numNeurons * weightsPerNeuron; i += weightsPerNeuron) {
        let neuronWeights = layerWeights.slice(i, i + inputsPerNeuron + 1);
        let genomeLocation = cWeight.i + i;
        this.push(new Neuron(neuronWeights, genomeLocation, activationFunc));
    }
    this.outputs = new Float32Array(numNeurons);
    cWeight.i += numWeights;  // Update current weight index for the next layer.
}
Layer.prototype = Array.prototype;



export function NeuralNet({
    genome,
    topology,
    weights,
    population
} = {}) {

    if (((genome && genome.topology) && topology) &&
        genome.topology !== topology) {
        console.warn(
            "NeuralNet created with non-matching genome/parameter topologies."
        );
    }

    if (genome && genome.topology) {
        this.topology = topology = genome.topology;
    } else if (topology) {
        this.topology = topology;
    } else {
        throw new Error("No topology specified for NeuralNet.");
    }

    this.genome = genome = genome || new Genome({
        topology: this.topology,
        weights: weights
    });

    this.population = population;
    this.roundsPlayed = 0;
    this.layers = [];
    this.inputs = new Float32Array(topology[0]);

    var currentWeight = {i: 0};

    this.layers.push(new Layer({
        name: "Input",
        inputs: this.inputs,
        numNeurons: topology[0],
        genomeWeights: genome.weights,
        cWeight: currentWeight,
        numWeights: topology[0],
        activationFunc: null  // No activation function for the input layer.
    }));

    for (let i = 1; i < topology.length - 1; i++) {
        this.layers.push(new Layer({
            name: "Hidden" + i,
            inputs: this.layers[i-1].outputs,
            numNeurons: topology[i],
            inputsPerNeuron: topology[i-1],
            genomeWeights: genome.weights,
            cWeight: currentWeight,
            numWeights: topology[i] * (topology[i-1] + 1)
        }));
    }

    this.layers.push(new Layer({
        name: "Output",
        inputs: this.layers.last().outputs,
        numNeurons: topology[topology.length-1],
        inputsPerNeuron: topology[topology.length-2],
        genomeWeights: genome.weights,
        cWeight: currentWeight,
        numWeights: topology.last() * (topology[topology.length-2] + 1),
        activationFunc: func.ReLU
    }));

    this.outputs = this.layers.last().outputs;

    // Create a one dimensional array version of the list of neurons, which
    // contains references to (not copies of) all the neurons in the layers:
    var i = 0;
    this.neurons = [];
    for (let l = 0; l < this.layers.length; l++) {
        for (let n = 0; n < this.layers[l].length; n++) {
            this.neurons[i++] = this.layers[l][n];
        }
    }

    if (settings.debug) {
        // Warn if there are any left over weights:
        if (currentWeight.i < genome.weights.length) {
            console.warn("Unused genome weights:");
            for (let i = currentWeight.i; i < genome.weights.length; i++) {
                console.log(genome.weights[i]);
            }
        }
        // Warn if there weren't enough weights:
        if (currentWeight > genome.weights.length) {
            let numNeeded = currentWeight - genome.weights.length;
            console.warn("Needed " + numNeeded + " more genome weights");
        }
    }

}



/**
 * Calculate the outputs from a set of inputs.
 * @param {[[Type]]} inputs [[Description]]
 */
NeuralNet.prototype.update = function(inputs) {

    try {
        this.inputs.set(inputs);
    } catch(error) {
        throw new Error("NeuralNet number of inputs / topology mismatch");
    }

    var onInputLayer = true;

    this.layers.forEach(layer => {
        layer.forEach(function(neuron, i) {
            if (onInputLayer) {
                // In the input layer, each neuron gets just 1 input:
                layer.outputs[i] = neuron.activate(layer.inputs.slice(
                        neuron.inputs.length * i,
                        neuron.inputs.length * (i + 1)
                ));
            } else {
                // In the following layers, each neuron receives
                // every output from the previous layer:
                layer.outputs[i] = neuron.activate(layer.inputs);
            }
        });
        onInputLayer = false;
    });
};


/*
NeuralNet.prototype.encode = function() {
    return encode(this);
};
*/
