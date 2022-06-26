
var canvasnakeRunning = false;



function removeQr(event) {
    event.preventDefault();
    var qrContainer = document.getElementById("qr-container");
    //console.log("Hiding QR container because It's being poked");
    qrContainer.removeEventListener("touchstart", removeQr, false);
    qrContainer.removeEventListener("click", removeQr, false);
    qrContainer.setAttribute("id", "qr-container-hidden");
    if (!canvasnakeRunning) {
        canvasnakeRunning = true;
        window.canvasnake();
    } else if (window.game && window.game.state.gameOver) {
        window.game.newGame(window.game);
    }

}



// Start game when the page loads and...
// Show the QR code when the link in the tab is clicked
function init() {
    var qrContainerHidden = document.getElementById("qr-container-hidden");
    if (qrContainerHidden) qrContainerHidden.setAttribute("id", "qr-container");
    var qrContainer = document.getElementById("qr-container");
    if (qrContainer) qrContainer.addEventListener("touchstart", removeQr);
    if (qrContainer) qrContainer.addEventListener("click", removeQr);
}



function shareScore() {
    var score = window.game.highScores[window.game.settings.gameMode] || 0,
        twitterURL = "https://twitter.com/home/?status=",
        whoScored = window.game.state.onlyAI ? "The AI" : "I",
        tweetScore = " scored " + score + " at burnt.io/canvasnake!";
    window.open(twitterURL + whoScored + tweetScore, "_blank");
}



function clearHighScores() {

    var game = window.game;

    if (game.highScores) {
        game.highScores = {};
    }

    if (game.settings.gameMode) {
        game.highScores[game.settings.gameMode] = 0;
    }

    if (game.ui && game.ui.clear) {
        game.ui.drawScores(
            game.ui,
            game.snakes,
            0,
            game.state.onlyAI
        );
        if (game.state.gameOver === true) {
            game.ui.drawEndScreen(
                game.ui,
                game.snakes,
                game.results
            );
        }
    }

    localStorage.setItem("snakeHighScores", JSON.stringify(game.highScores));
}



function togglePause() {
    var text;
    if (!window.game.state.paused) {
        window.game.state.paused = true;
        text = "<span>Unpause</span>";
    } else {
        window.game.state.paused = false;
        text = "<span>Pause</span>";
    }
    document.getElementById("pause").innerHTML = text;
}



function toggleAbout() {
    document.getElementById("about-popout").classList.toggle("hidden");
}



function toggleMenu() {
    document.getElementById("slider-menu").classList.toggle("collapsed");
}



function updateSSAAMenuItem(value) {

    let text = "<span>SSAA:</span> " + value;

    if (value === 1) {
        text += "<small>default</small>";
    }

    document.getElementById("SSAA").innerHTML = text;

}



function incrementSSAA() {
    window.game.settings.ssaa.increment();
}



function toggleAutoRepeat() {
    let s = window.game.settings;
    s.autoRepeat = !s.autoRepeat;
    let text = "<span>Auto-repeat:</span> " + s.autoRepeat;
    document.getElementById("autoRepeat").innerHTML = text;
}



function setGameMode(gameMode) {
    window.game.settings.gameMode = gameMode;
    if (window.game.state.running) {
        window.game.newGame(window.game);
    }
}



/**
 * Selects a game mode specified by the argument. This function updates the UI,
 * and then calls setGameMode() to set it as the new game mode. The argument
 * could be a specific string of the desired game mode, or a string or number
 * value equating to +1 or -1 to increment or decrement the current game mode.
 */
function selectGameMode(gameMode) {

    /**
     * Searches through the options collection looking for an element with an
     * innerHTML that matches the query string. If none is found, no value is
     * returned (undefined). Note that this is NOT case sensitive.
     *
     * @param   {HTMLCollection} collection
     * @param   {String}         query
     * @returns {Element object} A reference to an HTML element.
     */
    function getElementByOptionStr(collection, query) {
        for (var i = 0; i < collection.length; i++) {
            if (collection[i].innerHTML.toLowerCase() === query.toLowerCase()) {
                return collection[i];
            }
        }
    }

    var gameModeButton = document.getElementById("gamemode"),
        options = gameModeButton.parentNode.getElementsByClassName("option"),
        selected = gameModeButton.parentNode.getElementsByClassName("selected")[0],
        index = [].indexOf.call(options, selected),
        gameModeStr = "";

    // Un-highlight the previously selected UI option (if there is one)
    if (selected) selected.classList.remove("selected");

    // Incrementing or decrementing game mode
    if (gameMode == 1 || gameMode == -1) {
        let gameModeInt = parseInt(gameMode, 10);
        if (index + gameModeInt > options.length-1) {
            selected = options[0];
        } else if (index + gameModeInt < 0) {
            selected = options[options.length-1];
        } else {
            selected = options[index + gameModeInt];
        }
        gameModeStr = selected.innerHTML;

    // Setting game mode to specific string
    } else {
        selected = getElementByOptionStr(options, gameMode);
        if (!selected) console.warn("There is no \"" + gameMode + "\" game mode UI option");
        gameModeStr = gameMode;
    }

    // Highlight the newly selected UI option (if there is one)
    if (selected) selected.classList.add("selected");

    // Turn auto-repeat off if it was on:
    if (window.game.settings.autoRepeat) {
        window.game.settings.autoRepeat = false;
    }

    setGameMode(gameModeStr);

}



window.onload = function() { init(); };
