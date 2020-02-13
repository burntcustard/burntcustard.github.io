
import { NeuralNet } from './neuralNet.js';
import { Genome } from './genome.js';
import { combineColors } from '../lib/color.js';



/**
 * Returns a child Neural Network created by crossing over (choosing
 * genetic material from) an array of one or more parents, and potentially
 * mutates the child depending on its parent's population's mutation rate.
 * @param   {Array} parents One or more parent Neural Networks.
 * @returns {object} Child Neural Network.
 */
export function crossover(parents) {

    var childWeights = new Float32Array(parents[0].genome.weights.length);

    /*
    // Pick random NEURONS from parents & use the weights for the child genome
    var numNeurons = parents[0].neurons.length;
    for (let i = 0; i < numNeurons; i++) {
        let parent = parents[Math.floor(Math.random() * parents.length)];
        let neuron = parent.neurons[i];
        let genomeLoc = neuron.genomeLocation;
        for (let j = genomeLoc; j < genomeLoc + neuron.weights.length; j++) {
            childWeights[j] = parent.genome.weights[j];
        }
    }
    */
    // Pick random individual weights from the parents
    for (let i = 0; i < parents[0].genome.weights.length; i++) {
        let parent = parents[Math.floor(Math.random() * parents.length)];
        childWeights[i] = parent.genome.weights[i];
    }

    var genome = new Genome({
        topology: parents[0].genome.topology,
        weights: childWeights
    });

    //var child = new NeuralNet(
    //    {genome: genome, population: parents[0].population}
    //);

    if (genome.mutate()) {
        // Genome was mutated
    } else {
        // Non-mutant organisms are the average color of their parents:
        let parentColors = [];
        parents.forEach(parent => {
            parentColors.push(parent.genome.color);
        });
        genome.color = combineColors(parentColors);
    }

    return new NeuralNet({genome: genome, population: parents[0].population});
    //return child;

}
