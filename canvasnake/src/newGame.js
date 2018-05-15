
import { spawnFood } from './food.js';
import { Snake } from './snake.js';
import { Population } from './ai/population.js';
import { NeuralNet } from './ai/neuralNet.js';
import { coinToss } from './lib/misc.js';
import * as base64 from './ai/base64.js';
import { decodeGenome } from './ai/genomeStr.js';



export default function newGame(game) {

    // Clear / reset stuff
    game.state.gameOver = false;
    game.state.firstTurn = true;
    game.state.finalUpdate = false;
    //game.state.paused = false;
    game.foodArray = [];
    game.snakes = [];
    game.results.winner = null;
    game.results.draw = false;
    game.scoresNeverNeedDrawing = false;

    // Temporary global-ish vars. TODO: Sort out.
    var population,
        randomIndex,
        organismA,
        organismB,
        organism;

    // Create the first bit of food. Put in switch (gameMode) if >1 food is needed.
    spawnFood(game);

    // Create new snakes based off the game mode
    switch (game.settings.gameMode.toLowerCase()) {

        /* === GAMEMODE EXAMPLE === //
        case "name of game mode":
            game.snakes = [
                new Snake({
                    name:       // Name of the snake (shown on end screen).
                    color:      // CSS color string (default "black").
                    direction:  // NESW starting orientation (default 'S').
                    speed:      // Game speed number. Higher = slower. (default 200).
                    controls:   // Array can include ["arrows", "IKJL", "WASD", "touch"].
                    coords:     // REQUIRED array of {x,y} of head -> tail segments.
                    ai: {       // Default ai specified with empty object {}, or options:
                        lazy,          // Don't bother to go to far food? (Default false).
                        suicideOnWin,  // Suicide when it knows it'll win? (Default true).
                        avoidance = {  // Prefer to turn away from... (default all true):
                            walls, snakes, tubes
                        }
                    }
                })
            ];
        break;
        // === END OF EXAMPLE === */

        case "single player":
            game.snakes = [
                new Snake({
                    name: "Player 1",
                    color: "black",
                    controls: ["arrows", "WASD", "touch"],
                    coords: [{x: 10, y: 7}, {x: 10, y: 6}, {x: 10, y: 5}]
                })
            ];
        break;

        case "single player vs ai":
            let neuralNetAI = new NeuralNet({genome: decodeGenome(
                "#800080|f:4681|5.12.3|-6DTm-8YwU+67cD-KALn+GclC+6JGO-CBKC+8d_k+4utz-MkZa+2DLQ+FbMl-1gr_+APJF-4tNq-6zVi+FvQz-67kL+6WgH-1RUz+XkSc+4lp9-ChSW+15Ha+5A$k-8zrj-9h0w-2ZjW+DyTP-1Vhe+5o6e-3GWF+F7yk-1k5l-DCQB-GwIe-6cmU-D5$L+6J8M+N4jo-7dAZ-2PIT-2yB8-3n2R+44FP+TBuR-4HiK+49Hy+3roB-7F29+6vG3+PVp0-5Cf5+A6ua-E9TW-CMac-AnWA+1YdV-Nerv+2f5K+53X0+AUfZ+MvHE-Fah$+Mf2z-1K5G-QSGG-0fSi+1amw+16aO+JShj+4l3I-13q8-5Tiw+8cV0+K9Na+6VP3-1R06-II70+B0hZ-9U_c-0Wa4-IFvE+7OAz+5umy+7gLk-0cU4+2Dlx+EKgg-6UnO+4qJP-0E11+AoLL+8qfj-2NIg+9qxo-3VgU+DMMf-PjQV-HJNS+4pVX+0bnX-2iky+3Vn3+3Xsw+4ySU+3jnE-22bc-0Hjp+9Svd+M0kQ+3hG9-52qW+09YB-BzPV-2sdx"
            )});
            game.snakes = [
                new Snake({
                    name: "Player 1",
                    color: "black",
                    controls: ["arrows", "WASD", "touch"],
                    coords: [{x: 10, y: 7}, {x: 10, y: 6}, {x: 10, y: 5}]
                }),
                new Snake({
                    name: "AI",
                    ai: {neuralNet: neuralNetAI},
                    color: neuralNetAI.genome.color,
                    coords: [{x: 20, y: 7}, {x: 20, y: 6}, {x: 20, y: 5}]
                })
            ];
        break;

        case "two player":
            game.snakes = [
                new Snake({
                    name: "Player 1",
                    color: "black",
                    controls: ["WASD"],
                    coords: [{x: 10, y: 7}, {x: 10, y: 6}, {x: 10, y: 5}]
                }),
                new Snake({
                    name: "Player 2",
                    color: "purple",
                    controls: ["arrows"],
                    coords: [{x: 20, y: 7}, {x: 20, y: 6}, {x: 20, y: 5}]
                })
            ];
        break;

        case "three player":
            game.snakes = [
                new Snake({
                    name: "Player 1",
                    color: "black",
                    controls: ["WASD"],
                    coords: [{x: 10, y: 7}, {x: 10, y: 6}, {x: 10, y: 5}]
                }),
                new Snake({
                    name: "Player 2",
                    color: "purple",
                    controls: ["IJKL"],
                    coords: [{x: 15, y: 7}, {x: 15, y: 6}, {x: 15, y: 5}]
                }),
                new Snake({
                    name: "Player 3",
                    color: "darkBlue",
                    controls: ["arrows"],
                    coords: [{x: 20, y: 7}, {x: 20, y: 6}, {x: 20, y: 5}]
                })
            ];
        break;

        case "ai vs ai":
            game.snakes = [
                new Snake({
                    name: "Regular AI",
                    color: "black",
                    speed: 20,
                    coords: [{x: 10, y: 7}, {x: 10, y: 6}, {x: 10, y: 5}],
                    ai: {}
                }),
                new Snake({
                    name: "Lazy AI",
                    color: "purple",
                    speed: 20,
                    coords: [{x: 20, y: 7}, {x: 20, y: 6}, {x: 20, y: 5}],
                    ai: {lazy: true}
                })
            ];
        break;

        case "crazy ai":
        // Crazy lots of snakes
            for (var s = 1; s <= 50; s++) {
                game.snakes.push(new Snake({
                    name: "AI " + s,
                    color: '#'+(Math.random() * 0xFFFFFF << 0).toString(16),
                    speed: 20,
                    coords: [{
                        x: Math.floor((Math.random() * 26) + 2),
                        y: Math.floor((Math.random() * 26) + 2)
                    }],
                    ai: {suicideOnWin: false}
                }));
            }
            game.scoresNeverNeedDrawing = true;
        break;

        case "neuroevolution ai":
            game.settings.autoRepeat = true;
            //game.settings.skipRender = true;
            game.ai = game.ai || {};
            game.ai.population = game.ai.population || new Population();
            population = game.ai.population;  // Short-er hand.

            // Two random snakes playing against each other:
            game.ai.popIndexA = game.ai.popIndexA || 1;
            game.ai.popIndexB = game.ai.popIndexB || 1;
            //game.ai.popIndexB++;
            if (game.ai.popIndexB > population.roundsPerOrganism) {
                game.ai.popIndexA++;
                game.ai.popIndexB = 1;
            }
            if (game.ai.popIndexA > population.size) {
                // Training round over
                game.ai.popIndexA = 1;
                game.ai.popIndexB = 1;
            }
            randomIndex = population.organisms.randomIndex();
            organismA = population.organisms[game.ai.popIndexA-1];
            organismB = (population.settings.roundsPerOrganism ===
                           population.settings.populationSize) ?
                population.organisms[game.ai.popIndexB-1] :
                population.organisms.random();
            // Remove any starting location bias by maybe swapping spawns:
            if (coinToss()) [organismA, organismB] = [organismB, organismA];
            organismA.roundsPlayed++;
            organismB.roundsPlayed++;
            game.snakes = [
                new Snake({
                    color: organismA.genome.color,
                    ai: {neuralNet: organismA},
                    speed: 0,
                    coords: [{x: 10, y: 7}, {x: 10, y: 6}, {x: 10, y: 5}]
                }),
                new Snake({
                    color: organismB.genome.color,
                    ai: {neuralNet: organismB},
                    speed: 0,
                    coords: [{x: 20, y: 7}, {x: 20, y: 6}, {x: 20, y: 5}]
                })
            ];
            //*/

            /*// Self-play only (rather than vs other neuroevolution snakes):
            game.ai.popIndexB = game.ai.popIndexB || 1;
            if (game.ai.popIndexB > population.size) {
                game.ai.popIndexB = 1;
            }
            game.ai.popIndexA = population.size;
            organism = population.organisms[game.ai.popIndexB-1];
            //console.log("PopIndexA-1: " + (game.ai.popIndexA-1));
            organism.roundsPlayed += 2;
            game.snakes = [
                new Snake({
                    color: organism.genome.color,
                    ai: {neuralNet: organism},
                    speed: 0,
                    coords: [{x: 10, y: 7}, {x: 10, y: 6}, {x: 10, y: 5}]
                }),
                new Snake({
                    color: organism.genome.color,
                    ai: {neuralNet: organism},
                    speed: 0,
                    coords: [{x: 20, y: 7}, {x: 20, y: 6}, {x: 20, y: 5}]
                })
            ];
            */// End self play

            game.ai.popIndexB++;
            game.scoresNeverNeedDrawing = true;
        break;

        case "old ai vs new ai":
            // TODO: Fancy genome string input etc.
            game.ai = game.ai || {};
            game.ai.neuralNet = game.ai.neuralNet ||
                                new NeuralNet({genome: decodeGenome(
                                    prompt("Input encoded Genome string:")
                                )});
            game.snakes = [
                new Snake({
                    name: "Old AI",
                    ai: {avoidance: {tubes: false}},
                    color: "black",
                    speed: 20,
                    coords: [{x: 10, y: 7}, {x: 10, y: 6}, {x: 10, y: 5}]
                }),
                new Snake({
                    name: game.ai.neuralNet.genome.name || "NeuralNet AI",
                    ai: {neuralNet: game.ai.neuralNet},
                    color: game.ai.neuralNet.genome.color,
                    speed: 20,
                    coords: [{x: 20, y: 7}, {x: 20, y: 6}, {x: 20, y: 5}]
                })
            ];

        break;


        case "neuroevolution ai 2":
            game.settings.autoRepeat = true;
            game.ai = game.ai || {};
            game.ai.population = game.ai.population || new Population();
            population = game.ai.population;  // Short-er hand.
            game.ai.popIndexB = game.ai.popIndexB || 1;
            if (game.ai.popIndexB > population.size) {
                game.ai.popIndexB = 1;
            }
            if (game.ai.popIndexB === population.size) {
                game.ai.popIndexA = population.size;
            } else {
                game.ai.popIndexA = 0;
            }
            organism = population.organisms[game.ai.popIndexB-1];
            //console.log("PopIndexA-1: " + (game.ai.popIndexA-1));
            organism.roundsPlayed++;
            game.snakes = [
                new Snake({
                    color: organism.genome.color,
                    ai: {neuralNet: organism},
                    speed: 0,
                    coords: [{x: 10, y: 7}, {x: 10, y: 6}, {x: 10, y: 5}]
                }),
                new Snake({
                    name: "Old AI",
                    ai: {avoidance: {tubes: false}},
                    color: "black",
                    speed: 0,
                    coords: [{x: 20, y: 7}, {x: 20, y: 6}, {x: 20, y: 5}]
                })
            ];
            // Remove any starting location bias by maybe swapping spawns:
            if (coinToss()) {
                [game.snakes[0].coords, game.snakes[1].coords] =
                [game.snakes[1].coords, game.snakes[0].coords];
            }
            game.ai.popIndexB++;
            game.scoresNeverNeedDrawing = true;
        break;

        default: console.error(
            "There is no \"" + game.settings.gameMode + "\" game mode"
        );

    }

    game.state.onlyAI = true;
    game.snakes.forEach(function(snake) {
       if (!snake.ai) {
           game.state.onlyAI = false;
       }
    });

    if (game.highScores[game.settings.gameMode] === undefined) {
        game.highScores[game.settings.gameMode] = 0;
        localStorage.setItem("snakeHighScores", JSON.stringify(game.highScores));
    }

    game.mainLoopFunc();
}
