
import { SSAA } from './ssaa.js';
import * as input from './input.js';
import newGame from './newGame.js';
import { render, reScale, drawScores, drawEndScreen } from './view.js';
import { update } from './update.js';
import { snakeInfo as snakeInfo } from './infoString.js';



window.reScaleGame = reScale;



// Todo: Figure out how to do everything without making game a global variable eesh.
window.game = {

    settings: {
        debug: false,        // Enable/disables console log messages.
        autoRepeat:  false,  // Restarts the game automatically when gameover occurs.
        ssaa: SSAA,          // Supersampling anti-aliasing.
        gameMode: "Single player vs AI" // Initial gamemode is 1 human player against 1 AI.
    },

    state: {
        finalUpdate: false,  // Becomes true when all snakes are dead.
        gameOver:    false,
        running:     false,
        paused:      false
    },

    ui: {
        textSize: 16,  // Base font size. Large font is "textSize * 2"
        cellSize: 15,  // Diameter of square cell in grid in pixels
        scale: 1,      // "Scale factor" used to scale (1x, 2x, size etc.)
        bgColor: "white",
        textColor: "orangered",
        redrawEnd: false,  // Used to indicate that the game over message should be redrawn.
        drawScores: drawScores,
        drawEndScreen: drawEndScreen
    },

    results: {
        winner: null,
        draw: false
    },

    // Other stuff. TODO: Cleanup into catagories if needed
    step: false,  // Runs one "turn" (all players move one cell) then pauses.
    updateInterval: 0, // How frequently the turns occur in ms (lower number = faster).
    board: {w: 0, h: 0}, // Current grid/board setup is 0 to 29 (inclusive), so 30x30

    // Holds the highest score accomplished on that PC/web browers.
    highScores: {},

    snakes: [],  // Array of snake objects that are on the board (human player snakes and/or AI snakes).
    foodArray: [],   // Array of foods that are on the board
    debugSquares: [],

    gameLoop: null,

    wins: {AI1: 0, AI2: 0},

    newGame: newGame

};



window.canvasnake = function() {

    // Global-ish variables (too many?):
    var game = window.game;

    // Set references to canvases and canvases contexts:
    // (Plain canvas and ctx are references to gameCanvas and gameCtx)
    game.ui.gameCanvas = game.ui.canvas = document.getElementById("gameCanvas");
    game.ui.gameCtx = game.ui.ctx = game.ui.gameCanvas.getContext("2d");
    game.ui.textCanvas = document.getElementById("textCanvas");
    game.ui.textCtx = game.ui.textCanvas.getContext("2d");

    // "Shortcuts" for clearing the canvases (currently assumes any canvases are the same size)
    game.ui.clear = function(ctx) {
        ctx.clearRect(0, 0, game.ui.canvas.width, game.ui.canvas.height);
    };

    // Intialize localstorage/highscores:
    // Uncomment this to fix (reset) localStorage if it got messed up:
    //localStorage.setItem("snakeHighScores", null);
    game.highScores = JSON.parse(localStorage.getItem("snakeHighScores"));
    if (!game.highScores) {
        game.highScores = {};
    }

    // This actually creates a listener function which then does something with any inputs that are detected:
    input.get(game, document, game.ui.canvas);  // TODO: Figure out if whole document has to be used?)

    game.mainLoopFunc = function mainLoop() {

        // Clear debug squares array so they can be repopulated this turn:
        if (!game.step) { game.debugSquares = []; }

        if (!game.state.gameOver || game.ui.redrawEnd) {

            if (!game.state.paused || game.step) {
                update(game);
                if (!game.settings.skipRender) render(game);
                game.step = false;
            }

            // We need to render at least once even if not updating
            if (game.state.paused && game.state.firstTurn) {
                render(game);
            }

            // It's no longer the first turn:
            if (game.state.firstTurn) game.state.firstTurn = false;

            if (game.state.gameOver && game.settings.autoRepeat === true) {
                newGame(game);
            } else {
                if (game.state.paused) {
                    game.updateInterval = 100;
                } else {
                    game.updateInterval = 0;
                    game.snakes.forEach(snake => {
                        game.updateInterval += snake.speed;
                    });
                    game.updateInterval /= game.snakes.length;
                }
                clearInterval(game.gameLoop);
                game.gameLoop = setInterval(game.mainLoopFunc, game.updateInterval);
            }
        }
    };

    game.state.running = true;

    // Check if the canvas' size is set correctly:
    if (game.ui.canvas.width % game.ui.cellSize === 0 || game.ui.canvas.height % game.ui.cellSize === 0) {
        game.board.w = game.ui.canvas.width / game.ui.cellSize;
        game.board.h = game.ui.canvas.height / game.ui.cellSize;
    } else {
        throw new Error("Canvas width and height must be divisible by " + game.ui.cellSize + " without remainder.");
    }

    game.settings.ssaa.set();

    // Assign touch event (for touch controls) to faded QR code logo if it exists... soon.
    var qrContainer = document.getElementById("qrCode");
    setTimeout(function() {
        qrContainer.addEventListener ("touchstart", input.touched);
    }, 999); // The delay is so that.. I have no fucking idea. Plz send help.

    // Start a new game!
    newGame(game);

};
