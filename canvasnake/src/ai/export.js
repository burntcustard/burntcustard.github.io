
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
        population.csv = [];
        Object.keys(population.settings).forEach(key => {
            population.csv.push([
                key,
                population.settings[key].toString().replace(/,/g, '.')
            ]);
        });
        population.csv.push(["Last-round best:"]);
        population.csv.push(["Population best:"]);
        population.csv.push([]);
        population.csv.push([
            ["generation", "average", "best", "worst", "total", "runTime"]
        ]);
    }
    var bestGenomeRecent = encodeGenome(
        population.bestGenomeCurrent
    ).replace(/#/, 'c:');
    var bestGenomeEver = encodeGenome(
        population.bestGenomeEver
    ).replace(/#/, 'c:');
    // TODO: Un-number-hardcode these two, get place in array from the two keys.
    population.csv[8][1] = bestGenomeRecent;
    population.csv[9][1] = bestGenomeEver;
    population.csv.push([
        population.genCounter,
        population.fitness.avg,
        population.fitness.best,
        population.fitness.worst,
        population.fitness.total,
        population.runTime
    ]);
}
