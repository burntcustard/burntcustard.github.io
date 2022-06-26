
/*global updateSSAAMenuItem, gameScale:true */



import { touched, noTouch } from './input.js';
import { snakeInfo } from './infoString.js';



/**
 * Rescale a specific canvas and it's CanvasRenderingContext2D.
 */
function reScaleCanvasAndCtx(canvas, ctx, multiplier, scale) {
    canvas.width *= multiplier;
    canvas.height *= multiplier;
    canvas.style.transform = "scale(" + 1 / scale + ")";
    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.shadowBlur = 6 * scale;
    ctx.shadowOffsetY = 2 * scale;
}



/**
 * Rescales the canvasnake game and text canvases.
 */
export function reScale(ui, value) {

    var multiplier = value / ui.scale;

    ui.scale *= multiplier;
    ui.textSize *= multiplier;
    ui.cellSize *= multiplier;

    if (ui.gameCanvas) reScaleCanvasAndCtx(ui.gameCanvas, ui.gameCtx, multiplier, ui.scale);
    if (ui.textCanvas) reScaleCanvasAndCtx(ui.textCanvas, ui.textCtx, multiplier, ui.scale);

    ui.redrawEnd = true;

    // Return the new scale in case we need to do anything else with it:
    return ui.scale;

}



/**
 * Paint a square slightly smaller than cell size (resulting
 * in a 1px transparent border around the edge of the cell).
 * @param {object}    ui    Reference to the game's ui property.
 * @param {CSS color} color (Optional) color to paint. If falsey the previously set fillStyle is used.
 * @param {number}    x     X coordinate of the top left of the square.
 * @param {number}    y     Y coordinate of the top left of the square.
 */
function paintCell(ui, color, x, y) {
    if (color) ui.ctx.fillStyle = color;
    ui.ctx.fillRect(
        x * ui.cellSize + 1 * ui.scale,
        y * ui.cellSize + 1 * ui.scale,
        ui.cellSize - 2 * ui.scale,
        ui.cellSize - 2 * ui.scale
    );
}



// Paint a square slightly smaller than paintCell
function paintSmallCell(ui, color, x, y) {
    if (color) ui.ctx.fillStyle = color;
    ui.ctx.fillRect(
        x * ui.cellSize + 3 * ui.scale,
        y * ui.cellSize + 3 * ui.scale,
        ui.cellSize - 6 * ui.scale,
        ui.cellSize - 6 * ui.scale
    );
}



function drawSnake(ui, snake) {

    var cSize = ui.cellSize,
        sf = ui.scale,
        head = snake.coords[0];

    // Render tongue if the snake is not dead:
    if (!snake.dead) {

        ui.ctx.fillStyle = ui.textColor;  // Probably orangeRed

        let drawTongueSection = function(ui, head, offsetX, offsetY, x, y, w, h) {
            ui.ctx.fillRect(
                ((head.x + offsetX) * ui.cellSize + x * ui.scale),
                ((head.y + offsetY) * ui.cellSize + y * ui.scale),
                w * ui.scale,
                h * ui.scale
            );
        };

        switch (snake.direction) {
            case 'N':
            drawTongueSection(ui, head, 0, 0,  6, -7, 3, 6);
            drawTongueSection(ui, head, 0, 0,  4,-10, 3, 6);
            drawTongueSection(ui, head, 0, 0,  8,-10, 3, 6);
            break;
            case 'E':
            drawTongueSection(ui, head, 1, 0,  1,  6, 6, 3);
            drawTongueSection(ui, head, 1, 0,  4,  4, 6, 3);
            drawTongueSection(ui, head, 1, 0,  4,  8, 6, 3);
            break;
            case 'S':
            drawTongueSection(ui, head, 0, 1,  6,  1, 3, 6);
            drawTongueSection(ui, head, 0, 1,  4,  4, 3, 6);
            drawTongueSection(ui, head, 0, 1,  8,  4, 3, 6);
            break;
            case 'W':
            drawTongueSection(ui, head, 0, 0, -7,  6, 6, 3);
            drawTongueSection(ui, head, 0, 0,-10,  4, 6, 3);
            drawTongueSection(ui, head, 0, 0,-10,  8, 6, 3);
            break;
        }

    }

    // Render snake bodies:
    ui.ctx.fillStyle = snake.color;
    snake.coords.forEach(function(segment){
        paintCell(ui, null, segment.x, segment.y);
    });

    // Render AI snake extra head bits that show while the AI is alive or dead:
    if (snake.ai) {

        // White hole (would need to fill color if the background was not white)
        ui.ctx.clearRect(head.x * cSize + 5*sf, head.y * cSize + 5*sf, 5*sf, 5*sf);

        // Black antenna
        ui.ctx.fillStyle = "black";
        if (snake.direction === 'N' || snake.direction === 'S') {
            ui.ctx.fillRect(head.x * cSize - 2*sf, head.y * cSize + 4*sf, 3*sf, 2*sf); // Up Dot
            ui.ctx.fillRect(head.x * cSize - 4*sf, head.y * cSize + 8*sf, 5*sf, 2*sf); // Down Dot
        } else {
            ui.ctx.fillRect(head.x * cSize + 4*sf, head.y * cSize - 2*sf, 2*sf, 3*sf); // L Dot
            ui.ctx.fillRect(head.x * cSize + 8*sf, head.y * cSize - 4*sf, 2*sf, 5*sf); // R Dot
        }
    }

    // Render AI snake extra head bits that are red and only show while the AI is alive:
    if (snake.ai && !snake.dead) {
        ui.ctx.fillStyle = ui.textColor;
        if (snake.direction === 'N' || snake.direction === 'S') {
            ui.ctx.fillRect(head.x * cSize + 6*sf, head.y * cSize + 4*sf, 3*sf, 7*sf); // Eye
            ui.ctx.fillRect(head.x * cSize - 4*sf, head.y * cSize + 4*sf, 2*sf, 2*sf); // L Dot
            ui.ctx.fillRect(head.x * cSize - 6*sf, head.y * cSize + 8*sf, 2*sf, 2*sf); // R Dot
        } else {
            ui.ctx.fillRect(head.x * cSize + 4*sf, head.y * cSize + 6*sf, 7*sf, 3*sf); // Eye
            ui.ctx.fillRect(head.x * cSize + 4*sf, head.y * cSize - 4*sf, 2*sf, 2*sf); // L Dot
            ui.ctx.fillRect(head.x * cSize + 8*sf, head.y * cSize - 6*sf, 2*sf, 2*sf); // R Dot
        }
    }

}



/**
 * Write line(s) of text to canvas.
 * @param {Reference} ctx    - A reference to a CanvasRenderingContext2D to write text to.
 * @param {int}       size   - Font size. E.g. "textSize * 2" or "16".
 * @param {CSS color} color  - The color for the text.
 * @param {String}    xAlign - Horizontal positioning of the text. Possible values: |left   cen|ter    right|
 * @param {String}    yAlign - Vertical positioning of the text. Possible values: "top"   -middle-   _bottom_
 * @param {String}    text   - The text to display. Use "<br>"s to create newlines.
 * @param {int}       x      - Horizontal location of text.
 * @param {int}       y      - Vertical location of text.
 */
function write(ctx, size, color, xAlign, yAlign, text, x, y) {

    ctx.fillStyle = (color || "black");
    ctx.font = (size + "px silkscreen");
    ctx.textAlign = (xAlign);
    ctx.textBaseline = (yAlign);

    var lineHeight = ctx.measureText("M").width * 1.3,
        lines = text.split("<br>");

    lines.forEach(function(line) {
        ctx.fillText(line, x, y);
        y+= lineHeight;
    });

}



export function drawScores(ui, snakes, highScore, onlyAI) {

    // If UI doesn't exist properly yet then we can't do anything:
    if (ui === undefined || ui.clear === undefined) {
        return;
    }
    
    ui.clear(ui.textCtx);

    // Draw scores:
    for (var snakeI = 0; snakeI < snakes.length; snakeI++) {
        write(
            ui.textCtx,
            ui.textSize,
            ui.textColor,
            "left",
            "bottom",
            ("Score: " + snakes[snakeI].score),
            (snakeI * 100 * ui.scale + 4 * ui.scale),
            ui.textCanvas.height - 2 * ui.scale
        );
    }

    // Draw highscore:
    if (highScore === undefined) {
        highScore = 0;
    }
    let highScoreText = "HighScore: " + highScore;
    if (onlyAI) highScoreText = "AI " + highScoreText;
    write(
        ui.textCtx,
        ui.textSize,
        ui.textColor,
        "right",
        "bottom",
        highScoreText,
        ui.canvas.width - 5 * ui.scale,
        ui.canvas.height - 2 * ui.scale
    );

}



export function drawEndScreen(ui, snakes, results) {

    var winningSnake = results.winner,
        winnerText = "",
        draw = false,
        theScores = "";
    
    if (snakes.length === 1) {
        winnerText = ("You dead, score: " + snakes[0].score);
        
    } else {
        if (!results.draw) {
            winnerText = (winningSnake.name + " Wins!");
        } else {
            winnerText = "Draw!";
        }
        for (let i = 0; i < snakes.length && i < 10; i++) {
            theScores += (snakes[i].name + ": " + snakes[i].score + "<br>");
        }
    }
    theScores += ("Press space or tap to restart");
    write(
        ui.textCtx,
        ui.textSize * 2,
        ui.textColor,
        "center",
        "bottom",
        winnerText,
        ui.canvas.width / 2,
        ui.canvas.height / 2
    );
    write(
        ui.textCtx,
        ui.textSize,
        ui.textColor,
        "center",
        "top",
        theScores,
        ui.canvas.width / 2,
        ui.canvas.height / 2
    );

}



export function render(game, forceTextRender) {

    var ui = game.ui;

    // Clear entire game canvas:
    ui.clear(ui.gameCtx);

    // If it's the first turn of the game (and therefore the first render pass):
    if (game.state.firstTurn || forceTextRender) {
        ui.clear(ui.textCtx);  // Clear the old scores and/or end screen.
        if (!game.scoresNeverNeedDrawing) game.scoresNeedDrawing = true;
    }

    // Draw food:
    for(var j = 0; j < game.foodArray.length; j++) {
        var f = game.foodArray[j];
        paintCell(ui, f.color, f.x, f.y);
    }

    game.snakes.forEach(function(snake) {
        drawSnake(game.ui, snake);
    });

    // Draw debug squares:
    for (var iDebug = 0; iDebug < game.debugSquares.length; iDebug++) {
        paintSmallCell(game.ui, "pink", game.debugSquares[iDebug].x, game.debugSquares[iDebug].y);
    }

    // Draw scores:
    if (!game.scoresNeverNeedDrawing && game.scoresNeedDrawing) {
        drawScores(
            game.ui,
            game.snakes,
            game.highScores[game.settings.gameMode],
            game.state.onlyAI
        );
        game.scoresNeedDrawing = false;
    }

    // If you died this update, stop touch, start it again after 0.5s, and show dead message.
    if (game.results.winner && (game.state.finalUpdate && !game.state.gameOver) || (ui.redrawEnd && game.state.gameOver)) {
        ui.redrawEnd = false;
        var qrContainer = document.getElementById("qr-container-hidden");
        if (qrContainer) {
            qrContainer.removeEventListener("touchstart", touched);
            qrContainer.addEventListener   ("touchstart", noTouch);
            setTimeout(function() {
                qrContainer.removeEventListener("touchstart", noTouch);
                qrContainer.addEventListener   ("touchstart", touched);
            }, 500);
        }
        if (!game.settings.autoRepeat) {
            drawEndScreen(game.ui, game.snakes, game.results);
        }
        //updateInterval = 500;
        game.state.gameOver = true; // To make sure text only rendered once after death.

        if (game.snakes.length === 2) {
            if (game.snakes[0].score > game.snakes[1].score) game.wins.AI1++;
            if (game.snakes[0].score < game.snakes[1].score) game.wins.AI2++;
        }

      }

      /*
      // Print the snake properties to two big textboxes:
      var snakeInfoLeft = document.getElementById("snakeInfoLeft");
      var snakeInfoRight = document.getElementById("snakeInfoRight");
      if (game.settings.debug) {
          if (game.snakes[0] && snakeInfoLeft) {
              snakeInfoLeft.innerHTML = snakeInfo(game.snakes[0], game.state.paused, game.wins);
          }
          if (game.snakes[1] && snakeInfoRight) {
              snakeInfoRight.innerHTML = snakeInfo(game.snakes[1], game.state.paused, game.wins);
          }
      }
      */
}



export function toggleDebug(settings) {

    /*
    var infoBoxLeft = document.getElementById("snakeInfoLeft");
    var infoBoxRight = document.getElementById("snakeInfoRight");

    if (settings.debug) {
        infoBoxLeft.style.display = "none";
        infoBoxRight.style.display = "none";
    } else {
        infoBoxLeft.style.display = "inline-block";
        infoBoxRight.style.display = "inline-block";
    }
    */
    settings.debug = !settings.debug;

    console.log("Debug: " + settings.debug);

}
