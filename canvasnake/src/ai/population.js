
import * as csv from './export.js';
import * as print from '../print.js';
import { NeuralNet } from './neuralNet.js';
import { Genome } from './genome.js';
import { settings } from './settings.js';
import { crossover } from './crossover.js';



export function Population({
    populationSize = settings.populationSize,
    topology = settings.topology
} = {}) {

    // Reference to the ai-nn settings global variable:
    this.settings = settings;

    // Number of organisms within the population
    this.size = populationSize;

    this.cullRatio = settings.cullRatio;

    // Number of organisms that get culled between rounds:
    this.cullNum = Math.round(this.size * this.cullRatio);

    // Number of organisms that should survive the cull:
    this.survivorNum = this.size - this.cullNum;

    // A bunch of neural nets:
    this.organisms = [];

    // Copies of the best genomes in the population:
    this.bestGenomeCurrent = {fitness: 0};
    this.bestGenomeEver = {fitness: 0};

    this.roundsPerOrganism = settings.roundsPerOrganism;

    this.fitness = {
        total: 0,
        best: 0,
        avg: 0,
        worst: 0
    };

    // Probability that a organisms weights will mutate
    this.mutationRate = settings.mutationRate;

    // Generation counter
    this.genCounter = 0;

    for (let i = 0; i < populationSize; i++) {
        this.organisms.push(new NeuralNet({
            topology: topology,
            population: this
        }));
    }

    this.creationTime = performance.now();

}

Population.prototype.getMutants = function() {
    var mutantList = [];
    this.organisms.forEach(organism => {
        if (organism.genome.mutant) {
            mutantList.push(organism);
        }
    });
    return mutantList;
};


/**
 * Updates the fitness properties of the population and sorts the organisms
 * from best to worst.
 */
Population.prototype.updateFitness = function() {

    this.fitness.total = 0;

    this.organisms.forEach(o => {
        o.genome.fitness = Math.round(o.genome.fitness / o.roundsPlayed);
        this.fitness.total += o.genome.fitness;
    });

    // Sort the organisms by fitness from highest to lowest:
    this.organisms.sort((a, b) => b.genome.fitness - a.genome.fitness);

    this.fitness.best = this.organisms[0].genome.fitness;
    this.fitness.worst = this.organisms[this.size-1].genome.fitness;
    this.fitness.avg = Math.round(this.fitness.total / this.size);

};



/**
 * Kill off x amount [0,1] of the worst performing snakes,
 * and set the 'old' property of remaining snakes to true.
 *
 * Also used as as the function to optionally print details
 * of the previous generations fitness values to console.
 *
 * @param {number} ratio = settings.cullRatio Ratio of population to cull.
 */
Population.prototype.cull = function(ratio = settings.cullRatio) {
    //print.fitnessList(this, this.cullNum);
    this.organisms.splice(this.survivorNum);
    this.organisms.forEach(organism => {
        organism.old = true;
    });
    //print.survivorList(this);
};



/**
 * Gets the population back up to it's initial size by breeding the
 * remaining organisms. Uses a type of fitness proportionate selection.
 */
Population.prototype.breed = function(parentsPerChild = 2) {

    // Exponent to modify the chance of a different
    // fitness parent being selected over another:
    var exp = 1;

    // The inverse of the sum of the fitness of all non-culled organisms:
    let invTotalFitness = 1 / (this.organisms.reduce(
        (acc, cur) => acc + Math.pow(cur.genome.fitness, exp), 0
    ));
    //console.log("invTotalFitness: " + invTotalFitness);

    // For every gap in the population caused by culling:
    for (let i = 0; i < this.cullNum; i++) {

        // Select some parents:
        let parents = [];

        // Fitness proportional selection
        for (let j = 0; parents.length < parentsPerChild; j++) {
            // Overflow j to stay only selecting survivors:
            if (j === this.survivorNum) j = 0;
            let fitness = Math.pow(this.organisms[j].genome.fitness, exp);
            //console.log("Fitness: " + fitness + ", invTotalFitness * fitness: " + invTotalFitness * fitness);
            if (Math.random() < invTotalFitness * fitness) {
                if (parents.length < 1) {
                    //console.log("Breeding parent " + j + " with");
                } else {
                    //console.log("parent " + j);
                }
                parents.push(this.organisms[j]);
            }
        }

        /*// Random selection:
        parents.push(this.organisms[0]);
        parents.push(this.organisms.random());
        */
        /*// Best + random selection:
        parents.push(this.organisms[0]);
        parents.push(this.organisms.random());
        */
        // Crossover parents and add child to the population:
        this.organisms.push(crossover(parents));
    }

};



/**
 * Resets the per-round values of snakes that are 'old',
 * i.e. have ramained from the previous generation.
 */
Population.prototype.resetOrganisms = function() {
    // Reset the fitness of the remaining organisms:
    this.organisms.forEach(organism => {
        if (organism.old) {
            organism.genome.fitness = 0;
            organism.roundsPlayed = 0;
        }
    });
};



/**
 * Update the populations current best genome property,
 * and the best ever genome if the current best is better.
 */
Population.prototype.updateBests = function() {
    let best = this.organisms[0].genome.save(this);
    this.bestGenomeCurrent = best;
    if (best.fitness > this.bestGenomeEver.fitness) {
        this.bestGenomeEver = best;
    }
};



/**
 * Refreshes a population at the end of a round.
 *
 * Updates population properties, it's members fitnesses,
 * culls badly performing members and breeds new ones, etc.
 */
Population.prototype.refresh = function() {

    // Increment generation counter (so the the following is "gen1+")
    this.genCounter++;

    // Figure out new fitness values
    this.oldFitness = JSON.parse(JSON.stringify(this.fitness));

    // Calculate and order genome and population fitnesses:
    this.updateFitness();

    // Save the best organism for future shenanigans:
    this.updateBests();

    // Figure out how long the round took (in milliseconds)
    if (this.runTime === undefined) {
        this.endTime = performance.now();
        this.runTime = this.endTime - this.creationTime;
    } else {
        this.runTime = performance.now() - this.endTime;
        this.endTime = performance.now();
    }
    this.runTime = Math.round(this.runTime / 1000);  // ms to s.

    // Update data that could be exported:
    csv.update(this);

    // Print a line to the console with info about the last generation:
    print.generationDetails(this);

    // Kill some organisms, breed replacements, reset values of old ones:
    this.cull();
    this.breed();
    this.resetOrganisms();
};
