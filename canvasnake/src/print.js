

export function generationDetails(pop) {

    let fitnessDiff = {
        total: pop.fitness.total - pop.oldFitness.total,
        avg: pop.fitness.avg - pop.oldFitness.avg,
        worst: pop.fitness.worst - pop.oldFitness.worst,
        best: pop.fitness.best - pop.oldFitness.best
    };

    let genStr = "Gen" + (pop.genCounter.toString()).padStart(3, '0');
    let timeStr = (pop.runTime + "s").padStart(4);
    let avgStr = (pop.fitness.avg.toString()).padStart(6) + diffStr(fitnessDiff.avg).padEnd(8);
    let bestStr = (pop.fitness.best.toString()).padStart(6) + diffStr(fitnessDiff.best).padEnd(8);
    let worstStr = (pop.fitness.worst.toString()).padStart(6) + diffStr(fitnessDiff.worst).padEnd(8);
    //console.log("Gen: " + this.genCounter + timeStr + " Fitness:");
    if (pop.genCounter === 1) {
        console.log("       | Time |   Average    |     Best     |    Worst");
    }
    console.log(genStr+" | "+timeStr+" |"+ avgStr+"|"+bestStr+"|"+worstStr);

}



/**
 * Forces signing (+-) on a number, and returns
 * it as a string with surrounding brackets.
 * @param   {number} number [[Description]]
 * @returns {string} Output string with sign and brackets.
 */
function diffStr(number) {
    if(number > 0){
        return " (+" + number + ")";
    } else {
        return " ("  + number + ")";
    }
}



/**
 * Prints a population of Neural Nets fitnesses, and their mutation values
 * to console, with square brackets around those that aren't being killed off.
 * @param {object} population   The population of NNs.
 * @param {number} amountToKill The number of NNs that are about to be culled.
 */
export function fitnessList(population, amountToKill) {
    let str = "Gen" + (population.genCounter) + " fitnesses: [ ";
    let organisms = population.organisms;
    for (let i = 0; i < organisms.length; i++) {
        str += organisms[i].genome.fitness;
        if (organisms[i].genome.mutated) {
            str += 'm' + organisms[i].genome.mutated;
        }
        if (organisms[i].old) {
            str += 'o';
        }
        str += ' ';
        if (i === population.survivorNum - 1) str += "] ";
    }
    console.log(str);
}



/**
 * Prints an entire populations list of Neural Nets
 * fitnesses, and their mutation values to console.
 * @param {object} population The post-cull population of NNs.
 */
export function survivorList(population) {
    let survivorStr = "Gen" + (population.genCounter) + " survivors fitness: ";
    let organisms = population.organisms;
    for (let i = 0; i < organisms.length; i++) {
        survivorStr += organisms[i].genome.fitness;
        if (organisms[i].genome.mutated) {
            survivorStr += 'm' + organisms[i].genome.mutated;
        }
        survivorStr += ' ';
    }
    console.log(survivorStr);
}
