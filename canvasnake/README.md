# Canvasnake
A snake versus snake game, with single player, local multiplayer, player vs AI, and AI vs AI game modes. Made from scratch using vanilla JavaScript and HTML canvas. A playable (potentially outdated) version can be found here: [burnt.io/canvasnake](http://burnt.io/canvasnake/)

![Game screenshot](https://i.imgur.com/kOTDnbk.png)

The project was originally developed for a module in my 2nd year of study at Brighton University. The version that was submitted for that can be found here https://github.com/burntcustard/canvasnake/tree/v0.1.

For my final year module, CI342 Applied Intelligent Systems, the old snake game is being used as a base for further development. The plan is to replace the primitive AI currently in the game with a snake that uses genetic algorithms and deep learning to figure out how to play the game itself, with minimal user input or prior knowledge.

The old code was ~1800 lines of JavaScript in 1 file. It's being refactored using ECMAScript 2015 features, with the aim of making it more readable, and more accomodating to multiple AIs that can play against each other. **Due to it's use of ES6 modules ([import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) and [export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)) an up-to-date version of Chrome, Edge, or Firefox** (with the dom.moduleScripts.enabled flag set)**, is required to run the game.**

Other non-AI-related (and non-university-course-related) work is planned, like UI improvements, and fixing the game's QR code logo to direct properly to [burnt.io/canvasnake](http://burnt.io/canvasnake/).
