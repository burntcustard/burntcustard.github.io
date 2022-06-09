
/**
 * Old, broken, and/or unused canvasnake code that might be useful again one day
 * goes here. It is not loaded by index.html so don't worry too much about it.
 */



function bin2dec(number) {
    return number.split('').reverse().reduce(function(x, y, i) {
        return (y === '1') ? x + Math.pow(2, i) : x;
    }, 0);
}



/**
 * Create a child from the genomes of one or more parents.
 * @param {Array} parents [[Description]]
 */
export function crossoverOld(parents) {

    // For every weight of the child, randomly pick one of the parents weights:
    // Uses Float32s with no conversions to/from doubles so should be fast.
    var genomeLength = parents[0].genome.weights.length;
    var childWeights = new Float32Array(genomeLength);
    var crossoverPoints = new Uint8Array(2 + Math.ceil(Math.random() * 3));

    // [0] is the start, [1] is the end. [2...] are middle points
    crossoverPoints[1] = genomeLength-1;
    for (let i = 2; i < crossoverPoints.length; i++) {
        crossoverPoints[i] = Math.ceil(Math.random() * genomeLength -1);
    }
    crossoverPoints.sort((a, b) => a - b);

    // Start w/random parent
    let parentCounter = Math.floor(Math.random() * parents.length);
    for (let i = 0; i < crossoverPoints.length; i++) {
        for (let j = crossoverPoints[i]; j < crossoverPoints[i+1]; j++) {
            childWeights[j] = parents[parentCounter].genome.weights[j];
        }
        if ((parentCounter += 1) === parents.length) parentCounter = 0;
    }

    ///*
    var genome = new Genome(
        parents[0].numInputs,
        parents[0].numHiddenLayers,
        parents[0].neuronsPerLayer,
        parents[0].numOutputs,
        childWeights
    );
    //*/
    /*
    var child = new NeuralNet({
        genome: new Genome(
            parents[0].numInputs,
            parents[0].numHiddenLayers,
            parents[0].neuronsPerLayer,
            parents[0].numOutputs,
            childWeights
        ),
        population: parents[0].population
    });
    */

    // Maybe mutate the child genome based off the population's mutation rate:
    if (Math.random() < parents[0].population.mutationRate) {
        //let oldWeights = genome.weights.slice();
        genome.mutate();
        // TODO: Replace with mutating the worst neuron from the parents?
        // Mutate a random neuron on layer 1 (hiddenLayer0):
        //child.mutateRandomNonInputNeuron();
        //child.mutateRandomWeight();
        //child.mutatePoorPerfNeuron();
        /*
        let newWeights = genome.weights.slice();
        let numWeightsChanged = 0;
        console.log("Number of weights in snek: " + oldWeights.length);
        for (let i = 0; i < oldWeights.length; i++) {
            if (oldWeights[i] !== newWeights[i]) {
                console.log("Weight changed (old/new):");
                console.log(oldWeights[i]);
                console.log(newWeights[i]);
                numWeightsChanged++;
            }
        }
        console.log("Number of weights mutated: " + numWeightsChanged);
        //*/
    } else {
        // Non-mutant organism are the average color of their parents:
        let parentColors = [];
        parents.forEach(parent => {
            parentColors.push(parent.genome.color);
        });
        genome.color = combineColors(parentColors);
    }

    //return child;
    // Create new organism (i.e. child neural network)
    return new NeuralNet({genome: genome, population: parents[0].population});
}



/**
 * Old way of choosing which snakes to crossover.
 * Used the best snake in every pair resulting in  very similar offspring.
 *
 * Gets the population back up to it's initial size by breeding
 * the best snake by other (randomly selected) remaining snakes.
 */
Population.prototype.breed = function() {

    var newChromosomes = [];

    for (let i = 0; i < this.size - this.chromosomes.length; i++) {
        newChromosomes.push(crossover([
            this.chromosomes[0],
            this.chromosomes.random()
        ]));
    }

    newChromosomes.forEach(newChromosome => {
        this.chromosomes.push(newChromosome);
    });

};




NeuralNet.prototype.updateGenome = function(neuronIndex) {
    var neuron = this.neurons[neuronIndex];
    var loc = neuron.genomeLocation;
    for (let i = loc, j = 0; i < loc + neuron.weights.length; i++, j++) {
        this.genome.weights[i] = neuron.weights[j];
    }
};

NeuralNet.prototype.mutateNeuron = function(neuronIndex) {
    var neuron = this.neurons[neuronIndex];
    for (let i = 0; i < neuron.weights.length; i++) {
        neuron.weights[i] = func.randomWeight();
        //neuron.weights[i] = Math.random() * 2 - 1;
    }
    this.genome.mutated = neuronIndex;
    this.updateGenome(neuronIndex);
};

NeuralNet.prototype.mutateRandomNeuron = function() {
    this.mutateNeuron(this.neurons.randomIndex());
};




/**
 * Get the weights from a specific neuron in the net
 * @param {[[Type]]} index [[Description]]
 */
NeuralNet.prototype.getWeights = function(layerIndex, neuronIndex) {
    return this.layer[layerIndex][neuronIndex].weights;
};

NeuralNet.prototype.setWeights = function(layerIndex, neuronIndex, weights) {
    this.layer[layerIndex][neuronIndex].weights = weights;
};

/*
NeuralNet.prototype.mutateNeuron = function(layerIndex, neuronIndex) {
    var neuron = this.layers[layerIndex][neuronIndex];
    for (let i = 0; i < neuron.weights.length; i++) {
        neuron.weights[i] = func.randomWeight();
    }
    this.genome.mutated = true;
    this.updateGenome(layerIndex, neuronIndex);
};
*/

/**
 * Gets an array of
 * @returns {[[Type]]} [[Description]]
 */
NeuralNet.prototype.getNeuronPerfs = function() {
    var perfs = new Float32Array(this.neurons.length);
    for (let i = 0; i < this.layers[0].length; i++) {
        perfs[i] = NaN;
    }
    for (let i = this.layers[0].length; i < this.neurons.length; i++) {
        perfs[i] = this.neurons[i].maxOutputRng;
    }
    console.log(this.layers[1]);
    console.log(perfs);
    return perfs;
};

NeuralNet.prototype.giveNeuronsRanks = function() {

    // Start with list of neurons, each with OutputRng

    //console.log("Giving neurons ranks");

    // Give each neuron a neuron index number
    for (let i = 0; i < this.neurons.length; i++) {
        this.neurons[i].nIndex = i;
    }

    // Sort neurons by outputRng
    this.neurons.sort((a, b) => b.maxOutputRng - a.maxOutputRng);

    // Give each neuron outputRng rank number
    for (let i = 0; i < this.neurons.length; i++) {
        this.neurons[i].rank = i;
    }

    // Sort neurons by old neuron index number
    this.neurons.sort((a, b) => b.nIndex - a.nIndex);

    // End with list of neurons, each one with a ranking from 0-neurons.length
    //for (let i = 0; i < this.neurons.length; i++) {
    //    console.log("Rank: " + this.neurons[i].rank + ": " + this.neurons[i].maxOutputRng);
    //}

    //console.log("------");

};

NeuralNet.prototype.mutateRandomWeight = function() {
    let numberToMutate = 1 + (Math.random() * 3);
    for (let i = 0; i < numberToMutate; i++) {
        let weightIndex = this.genome.weights.randomIndex();
        this.genome.weights[weightIndex] = func.randomWeight();
    }
    this.genome.mutated = true;
    this.genome.color = lib.randomColor();
};

NeuralNet.prototype.mutateRandomNonInputNeuron = function() {
    var nonInputNeuronsLength = this.neurons.length - this.layers[0].length;
    var index = Math.floor(Math.random() * (nonInputNeuronsLength));
    index += this.neurons.length - nonInputNeuronsLength;
    this.mutateNeuron(index);
};

NeuralNet.prototype.mutatePoorPerfNeuron = function() {
    var neuronPerfs = this.getNeuronPerfs();
    var neuronIndex = neuronPerfs.indexOf(Math.min(...neuronPerfs));
    this.mutateNeuron(neuronIndex);
};

/*
NeuralNet.prototype.updateGenome = function(layerIndex, neuronIndex) {
    if (layerIndex !== undefined && neuronIndex !== undefined) {
        let neuron = this.layers[layerIndex][neuronIndex];
        let loc = neuron.genomeLocation;
        for (let i = loc, j = 0; i < loc + neuron.weights.length; i++, j++) {
            this.genome.weights[i] = neuron.weights[j];
        }
    }
};
*/



// Crossover function old way of picking weights:
    var parentWeights = new Float32Array(parents.length);

    for (let i = 0; i < genomeLength; i++) {
        for (let j = 0; j < parents.length; j++) {
            parentWeights[j] = parents[j].genome.weights[i];
        }
        childWeights[i] = parentWeights.random();
    }
//*/



export function crossoverGoodNeuronsTest(parents) {

    var genomeLength = parents[0].genome.weights.length;
    var numNeurons = parents[0].neurons.length;
    var childWeights = new Float32Array(genomeLength);

    //var parentsNeuronPerfs = [];

    console.log(parents);

    for (let i = 0; i < parents.length; i++) {
        parents[i].giveNeuronsRanks();
    }

    let p = Math.floor(Math.random() * parents.length);  // Parent index
    for (let i = 0; i < numNeurons; i++) {
        let neuron = parents[p].neurons[i];

        // If the neuron isn't an input, and is a bad one (bottom half worst ish),
        // start looking at the next parent
        if (i > parents[0].inputs.length - 1 &&
            (Math.random() * numNeurons) + numNeurons/2 < neuron.rank) {
            if ((p += 1) === parents.length) p = 0;  // Increment p
            console.log("Crossing over to p" + p + " cos of n w/ rank: " + neuron.rank + " for neuron " + i);
        }

        // Go through each weight of the neuron and give it to the child
        let genomeLoc = neuron.genomeLocation;
        for (let j = genomeLoc; j < genomeLoc + neuron.weights.length; j++) {
            childWeights[j] = parents[p].genome.weights[j];
        }

    }

    var child = new NeuralNet({
        genome: new Genome(
            parents[0].numInputs,
            parents[0].numHiddenLayers,
            parents[0].neuronsPerLayer,
            parents[0].numOutputs,
            childWeights
        ),
        population: parents[0].population
    });

    // Maybe mutate the child genome based off the population's mutation rate:
    if (Math.random() < parents[0].population.mutationRate) {

        //child.mutateRandomNonInputNeuron();

    } else {
        // Non-mutant chromosomes are the average color of their parents:
        let parentColors = [];
        parents.forEach(parent => {
            parentColors.push(parent.genome.color);
        });
        child.genome.color = combineColors(parentColors);
    }

    return child;

}



/* This has been replaced by a similar function within ai.chooseDirection. */

/**
 * Performs a query function comparing one snake to all of the other snakes.
 * Useful for comparing properties of a single snake against all the others.
 *
 * @param   {Array}    snakes The list of all snakes.
 * @param   {function} query  The query to perform and return the results from.
 * @param   {object}   snake  The snake that shouldn't check itself.
 * @returns {[[Type]]} Returns whatever the query function returns.
 */
function anyOtherSnake(snakes, query, snake) {
    for (var i = 0; i < snakes.length-1; i++) {
        if (snakes[i] !== snake) {
            return query(snakes[i], snake);
        }
    }
}



/* This was replaced by the following arrow function in ai.chooseDirection */
/* anyOtherSnake((other, self) => other.foodDist.total < self.foodDist.total)); */

/**
 * Returns true if snakeA's head is closer to snakeA's closest food, than
 * snakeB's head to snakeB's closest food, otherwise returns false.
 * @param   {object}   snakeA Snake
 * @param   {object}   snakeB Snake
 * @returns {boolean}
 */
function closerToFood(snakeA, snakeB) {
    return snakeA.foodDist.total < snakeB.foodDist.total;
}
