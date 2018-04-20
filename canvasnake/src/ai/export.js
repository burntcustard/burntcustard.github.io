
import { encodeGenome } from './genomeStr.js';


/**
 * If the game has a collection of data about a population
 * then download it as a Comma Separated Values file.
 */
export function downloadCSV() {
    if (!window.game.ai ||
        !window.game.ai.population ||
        !window.game.ai.population.csv) {
        return;
    }
    let csvContent = "data:text/csv;charset=utf-8,";
    window.game.ai.population.csv.forEach(row => {
        csvContent += row.join(",") + "\r\n";
    });
    let encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
}



/**
 * Adds population performance data to the populations csv object.
 * @param {object} population [[Description]]
 */
export function update(population) {
    if (!population.csv) {
        population.csv = [
            Object.keys(population.settings),
            // Add population setting values with commas replaced with periods:
            Object.values(population.settings).map(
                value => value.toString().replace(/,/g, '.')
            ),
            [],
            ["generation", "average", "best", "worst", "total", "runTime"]
        ];
        population.csv[0].length += 3;
        population.csv[1].length += 3;
        population.csv[0][population.csv[0].length-2] = "Last-round best:";
        population.csv[1][population.csv[1].length-2] = "Population best:";
    }
    var bestGenomeRecent = encodeGenome(population.bestGenomeCurrent).replace(/#/, 'c:');
    var bestGenomeEver = encodeGenome(population.bestGenomeEver).replace(/#/, 'c:');
    population.csv[0][population.csv[0].length-1] = bestGenomeRecent;
    population.csv[1][population.csv[1].length-1] = bestGenomeEver;
    population.csv.push([
        population.genCounter,
        population.fitness.avg,
        population.fitness.best,
        population.fitness.worst,
        population.fitness.total,
        population.runTime
    ]);
}
