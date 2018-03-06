
import { spawnFood } from './food.js';
import { Snake } from './snake.js';



export default function newGame(game) {

    // Clear / reset stuff
    game.state.gameOver = false;
    game.state.firstTurn = true;
    //game.state.paused = false;
    game.foodArray = [];
    game.snakes = [];
    game.results.winner = null;
    game.results.draw = false;
    game.scoresNeverNeedDrawing = false;

    // Create the first bit of food/s. Could be put in switch (gameMode) if more food is needed.
    spawnFood(game);

    // Create new snakes based off the game mode
    switch (game.settings.gameMode.toLowerCase()) {

        /* === GAMEMODE EXAMPLE === //
        case "name of game mode" :
            snakes = [                // Create array of snakes
                new Snake(
                    "name string",    // Must be "AI 1" or "AI 2" for win recording.
                    "color string",   // Can be any valid CSS color format, or null = black.
                    speed int,        // Useful for testing AI. Smaller number = slower.
                    {ai parameters},  // null = {difficulty: "no AI"}.
                    "AI type string",  OR  ["array", "of", "control", "strings"],
                    'direction char', // The starting direction N/E/S/W. Make AWAY from body.
                    [{x: int, y: int}, {x: int, y: int}] // Head coord then body coords.
                )
            ];
        break;
        // === END OF EXAMPLE === */

        case "single player" :
            game.snakes = [
                new Snake(
                    "Player 1",
                    null,
                    200,
                    null,
                    ["arrows","WASD","touch"],
                    'S',
                    [{x: 10, y: 7}, {x: 10, y: 6}, {x: 10, y: 5}]
                )
            ];
        break;

        case "single player vs ai" :
            game.snakes = [
                new Snake(
                    "Player 1",
                    null,
                    200,
                    null,
                    ["arrows", "WASD", "touch"],
                    'S',
                    [{x: 10, y: 7}, {x: 10, y: 6}, {x: 10, y: 5}]
                ),
                new Snake(
                    "AI",
                    "purple",
                    200,
                    {avoidance: {walls: true, snakes: true, tubes: true}, lazy: false, suicideOnWin: true},
                    null,
                    'S',
                    [{x: 20, y: 7}, {x: 20, y: 6}, {x: 20, y: 5}]
                )
            ];
        break;

        case "two player" :
            game.snakes = [
                new Snake(
                    "Player 1",
                    null,
                    200,
                    null,
                    ["WASD"],
                    'S',
                    [{x: 10, y: 7}, {x: 10, y: 6}, {x: 10, y: 5}]
                ),
                new Snake(
                    "Player 2",
                    "purple",
                    200,
                    null,
                    ["arrows"],
                    'S',
                    [{x: 20, y: 7}, {x: 20, y: 6}, {x: 20, y: 5}]
                )
            ];
        break;

        case "three player" :
            game.snakes = [
                new Snake(
                    "Black",
                    null,
                    200,
                    null,
                    ["WASD"],
                    'S',
                    [{x: 10, y: 7}, {x: 10, y: 6}, {x: 10, y: 5}]
                ),
                new Snake(
                    "Purple",
                    "purple",
                    200,
                    null,
                    ["IJKL"],
                    'S',
                    [{x: 15, y: 7}, {x: 15, y: 6}, {x: 15, y: 5}]
                ),
                new Snake(
                    "Blue",
                    "darkBlue",
                    200,
                    null,
                    ["arrows"],
                    'S',
                    [{x: 20, y: 7}, {x: 20, y: 6}, {x: 20, y: 5}]
                )
            ];
        break;

        case "ai vs ai" :
            game.snakes = [
                new Snake(
                    "Regular AI",
                    null,
                    20,
                    {avoidance: {walls: true, snakes: true, tubes: true}, lazy: false, suicideOnWin: true},
                    null,
                    'S',
                    [{x: 10, y: 7}, {x: 10, y: 6}, {x: 10, y: 5}]
                ),
                new Snake(
                    "Lazy AI",
                    "purple",
                    20,
                    {avoidance: {walls: true, snakes: true, tubes: true}, lazy: true, suicideOnWin: true},
                    null,
                    'S',
                    [{x: 20, y: 7}, {x: 20, y: 6}, {x: 20, y: 5}]
                )
            ];
        break;

        case "crazy ai" :
        // Crazy lots of snakes
            for (var s = 1; s <= 40; s++) {
                game.snakes.push(new Snake(
                    "AI " + s,
                    '#'+(Math.random() * 0xFFFFFF << 0).toString(16),
                    20,
                    {avoidance: {walls: true, snakes: true, tubes: true}, lazy: false, suicideOnWin: false},
                    null,
                    'S',
                    [{
                        x: Math.floor((Math.random() * 26) + 2),
                        y: Math.floor((Math.random() * 26) + 2)
                    }]
                ));
            }
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

    if (typeof game.gameLoop !== "undefined") {
        clearInterval(game.gameLoop);
    }
    game.gameLoop = setInterval(game.mainLoopFunc, 1);

}
