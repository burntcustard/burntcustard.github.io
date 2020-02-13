"use strict";

var c,                   // Column counter
    r,                   // Row counter
    noOfPlayers = 2,
    pointsRowCounter = 1,
    additionMode = true,
    menuShown = false,
    currentWordList,
    wordList = {};        // Massive array of words (starting with specific letter)



// Scroll down 1 pixel when page is loaded, to hide URL bar on mobile:
if( window.addEventListener ){
    window.addEventListener("load",function() {
        setTimeout(function(){
            window.scrollTo(0, 0);
        }, 0);
    });
}



function loadWordList(letter) {
  var filename = ("words/" + letter.toUpperCase() + " Words.txt"),
      xmlhttp = new XMLHttpRequest(),
      fileContents;
  
  console.log("Trying to load: " + filename);
  
  xmlhttp.onreadystatechange = function () {
    //if (xmlhttp.readyState == 4 && xmlhttp.status == 200) { // TODO: Figure out how this works
      switch(letter) {
        case 'a': wordList.a = xmlhttp.responseText; break;
        case 'b': wordList.b = xmlhttp.responseText; break;
        case 'c': wordList.c = xmlhttp.responseText; break;
        case 'd': wordList.d = xmlhttp.responseText; break;
        case 'e': wordList.e = xmlhttp.responseText; break;
        case 'f': wordList.f = xmlhttp.responseText; break;
        case 'g': wordList.g = xmlhttp.responseText; break;
        case 'h': wordList.h = xmlhttp.responseText; break;
        case 'i': wordList.i = xmlhttp.responseText; break;
        case 'j': wordList.j = xmlhttp.responseText; break;
        case 'k': wordList.k = xmlhttp.responseText; break;
        case 'l': wordList.l = xmlhttp.responseText; break;
        case 'm': wordList.m = xmlhttp.responseText; break;
        case 'n': wordList.n = xmlhttp.responseText; break;
        case 'o': wordList.o = xmlhttp.responseText; break;
        case 'p': wordList.p = xmlhttp.responseText; break;
        case 'q': wordList.q = xmlhttp.responseText; break;
        case 'r': wordList.r = xmlhttp.responseText; break;
        case 's': wordList.s = xmlhttp.responseText; break;
        case 't': wordList.t = xmlhttp.responseText; break;
        case 'u': wordList.u = xmlhttp.responseText; break;
        case 'v': wordList.v = xmlhttp.responseText; break;
        case 'w': wordList.w = xmlhttp.responseText; break;
        case 'x': wordList.x = xmlhttp.responseText; break;
        case 'y': wordList.y = xmlhttp.responseText; break;
        case 'z': wordList.z = xmlhttp.responseText; break;
      }
    //}
  };
  xmlhttp.open("GET",filename,true);
  xmlhttp.send();
  
  return fileContents;
}



function loadWords() {
  wordList.a = loadWordList('a');
  wordList.b = loadWordList('b');
  wordList.c = loadWordList('c');
  wordList.d = loadWordList('d');
  wordList.e = loadWordList('e');
  wordList.f = loadWordList('f');
  wordList.g = loadWordList('g');
  wordList.h = loadWordList('h');
  wordList.i = loadWordList('i');
  wordList.j = loadWordList('j');
  wordList.k = loadWordList('k');
  wordList.l = loadWordList('l');
  wordList.m = loadWordList('m');
  wordList.n = loadWordList('n');
  wordList.o = loadWordList('o');
  wordList.p = loadWordList('p');
  wordList.q = loadWordList('q');
  wordList.r = loadWordList('r');
  wordList.s = loadWordList('s');
  wordList.t = loadWordList('t');
  wordList.u = loadWordList('u');
  wordList.v = loadWordList('v');
  wordList.w = loadWordList('w');
  wordList.x = loadWordList('x');
  wordList.y = loadWordList('y');
  wordList.z = loadWordList('z');
}



function switchWordList(letter) {
  var tmpWordList;
  switch (letter) {
    case 'a': tmpWordList = wordList.a; break;
    case 'b': tmpWordList = wordList.b; break;
    case 'c': tmpWordList = wordList.c; break;
    case 'd': tmpWordList = wordList.d; break;
    case 'e': tmpWordList = wordList.e; break;
    case 'f': tmpWordList = wordList.f; break;
    case 'g': tmpWordList = wordList.g; break;
    case 'h': tmpWordList = wordList.h; break;
    case 'i': tmpWordList = wordList.i; break;
    case 'j': tmpWordList = wordList.j; break;
    case 'k': tmpWordList = wordList.k; break;
    case 'l': tmpWordList = wordList.l; break;
    case 'm': tmpWordList = wordList.m; break;
    case 'n': tmpWordList = wordList.n; break;
    case 'o': tmpWordList = wordList.o; break;
    case 'p': tmpWordList = wordList.p; break;
    case 'q': tmpWordList = wordList.q; break;
    case 'r': tmpWordList = wordList.r; break;
    case 's': tmpWordList = wordList.s; break;
    case 't': tmpWordList = wordList.t; break;
    case 'u': tmpWordList = wordList.u; break;
    case 'v': tmpWordList = wordList.v; break;
    case 'w': tmpWordList = wordList.w; break;
    case 'x': tmpWordList = wordList.x; break;
    case 'y': tmpWordList = wordList.y; break;
    case 'z': tmpWordList = wordList.z; break;
  }
  tmpWordList = (tmpWordList.split('\n'));
  return (tmpWordList);
}



function menuClick(btn) {
  if (menuShown) {
    document.querySelector(".menu").classList.remove("menuShown");
    btn.classList.remove("menuBtnClicked");
    btn.setAttribute("title", "Menu");
  } else {
    document.querySelector(".menu").classList.add("menuShown");
    btn.classList.add("menuBtnClicked");
    btn.setAttribute("title", "Back");
  }
  menuShown = !menuShown;
}



function isInt(argument) {
  if (argument) {
    return argument == ~~argument;
  } else {
    return false;
  }
}



// Super speedy way of removing all child elements from parent
function clearChildren(parent) {
  var child;
  // Assignment is intended, when assignment cannot happen (no more children), the loop exists:
  while(child = parent.firstChild)
    parent.removeChild(child);
}



function addInputBox(parent, r) {
  
  // Create new input box element:
  var newPointsInput = document.createElement('input');

  // If first row of points input boxes, add the placeholder text:
  if (r === 1) {
    newPointsInput.setAttribute("Placeholder", "Score");
  }

  // Give even row numbers different background color:
  if (r % 2 === 0) {
    newPointsInput.setAttribute("Style", "background-color: aliceBlue");
  }
  
  newPointsInput.setAttribute("onBlur", "addPoints(this); maybeAddPointsBoxes();");
  newPointsInput.setAttribute("type", "number");
  
  document.querySelector(parent).appendChild(newPointsInput);
  
}



function addPointsBoxes(playerNo) {
  
  var newPointsInput,
      pointsList;
  
  // If a player number has been specified, add new COLUMN of points boxes:
  if (playerNo) {

    for (r = 1; r <= pointsRowCounter; r++) {
      addInputBox(".points > li:nth-child(" + r + ")", r);
    }
  }
  else
  // No player number specified, add new ROW of points boxes:
  {
    // Add new list element (i.e. new row) to contain the input boxes:
    document.querySelector(".points").appendChild(document.createElement('li'));
    pointsRowCounter++;
    
    for (c = 1; c <= noOfPlayers; c++) {
      addInputBox(".points > li:nth-child(" + pointsRowCounter + ")", pointsRowCounter);
    }
  }
}



function maybeAddPointsBoxes() {
  
  var inputBox,
      empties = false;

  // Check if there are any empty boxes:
  for (c = noOfPlayers; c > 0; c--) {
    for (r = pointsRowCounter; r > 0; r--) {
      inputBox = (".points > li:nth-child(" + r + ") > input:nth-child(" + c + ")");
      if (document.querySelector(inputBox).value === '') {
        empties = true;
      }
    }
  }

  // If no empty boxes, add some more:
  if (empties === false) {
    addPointsBoxes();
  }
}



function clearScores() {
  
  // Clear players names:
  for (c = noOfPlayers; c > 0; c--) {
    document.querySelector(".names > li > input:nth-child(" + c + ")").value = ''; 
  }
  
  // Remove all points boxes:
  clearChildren(document.querySelector(".points"));
  pointsRowCounter = 0;
  
  // Add back first two points boxes:
  addPointsBoxes();
  
}



function addPlayer() {
  
  var newInputBox;
  
  if (noOfPlayers < 4) {
    noOfPlayers++;
    newInputBox = document.createElement('input');
    newInputBox.setAttribute("placeholder", ("Player " + noOfPlayers));
    document.querySelector(".names > li").appendChild(newInputBox);
    addPointsBoxes(noOfPlayers);
  }
  else
  {
    // Error?
  }
  
  if (noOfPlayers === 4) {
    document.getElementById("addPlayer").classList.add("greyed");
  }
  
  if (noOfPlayers > 1) {
    document.getElementById("removePlayer").classList.remove("greyed");
  }
  
}



function removePlayer(p) {
  
  if (noOfPlayers > 1) {
    if (!p) { p = noOfPlayers; }
    document.querySelector(".names > li > input:nth-child(" + p + ")").remove();
    for (r = pointsRowCounter; r > 0; r--) {
      document.querySelector(".points > li:nth-child(" + r + ") > input:nth-child(" + p + ")").remove(); 
    }
    noOfPlayers--;
  }
  else
  {
    // Error?
  }
  
  if (noOfPlayers <= 1) {
    document.getElementById("removePlayer").classList.add("greyed");
  }
  
  if (noOfPlayers < 4) {
    document.getElementById("addPlayer").classList.remove("greyed");
  }
  
}



function maybeRemovePlayer() {
  var p,
      option;
  
  if (noOfPlayers === 1) {
    // Remove scoreboard? When there is only 1, set "remove player" option to "hide scoreboard"
  }
  if (noOfPlayers > 1) {
    p = noOfPlayers;
    // Remove all the options from options list:
    clearChildren(document.querySelector(".menu"));
    
    // Add "options" title back
    option = document.createElement('li');
    option.innerHTML = "OPTIONS";
    document.querySelector(".menu").appendChild(option);
  }
}



function addPoints(activeInput, focusedC, focusedR) {

  var activeInputValue = activeInput.value,
      oldInputBox,
      oldInputBoxValue,
      tmpInputBox;

  // If not told where the box is, figure it out:
  if (!focusedC || !focusedR) {
    for (c = noOfPlayers; c > 0; c--) {
      for (r = pointsRowCounter; r > 0; r--) {
        tmpInputBox = (".points > li:nth-child(" + r + ") > input:nth-child(" + c + ")");
        if (document.querySelector(tmpInputBox) === activeInput) {
          focusedC = c;
          focusedR = r;
        }
      }
    }
  }
  
  if (additionMode && pointsRowCounter > 1 && isInt(activeInputValue)) {
    activeInputValue = parseInt(activeInputValue);
    
    // Go through every score for that player (oldest to most recent):
    for (r = 1; r < focusedR; r++) { // Note "<" not <=", i.e. doesn't check currently focused.
      tmpInputBox = (".points > li:nth-child(" + r + ") > input:nth-child(" + focusedC + ")");
      if (isInt(document.querySelector(tmpInputBox).value)) {
        oldInputBox = tmpInputBox;
      }
    }
    
    // If we found an old input box with a number in:
    if (oldInputBox) {
      oldInputBoxValue = parseInt(document.querySelector(oldInputBox).value);
      activeInput.value = (oldInputBoxValue + activeInputValue);
    }
    
  }
  
}



document.onkeydown = function (key) {
  
  var empties = false,
      focused = {type: false, c: 0, r: 0},
      activeInput,
      activeInputValue,
      inputWord,
      oldInputWord,
      inputBox,
      inputBoxValue,
      oldInputBox,
      oldInputBoxValue,
      tmpInputBox,
      newWord,
      invalidChars = /[^a-z]/,
      invalidNumbers = /[^0-9]/,
      handled = false;
  
  activeInput = document.activeElement;

  // Word finder input box:
  if (activeInput === document.getElementById("wordInput")) {
    handled = true;

    // Input value before character from keypress added:
    oldInputWord = activeInput.value;

    // setTimeout with 0ms delay means that key entered is read correctly.
    // I.e. when 'c' pressed [abc] rather than [ab] read.
    setTimeout( function() {

      // Grab the word from the input box and clean it up:
      inputWord = activeInput.value.toLowerCase();
      inputWord = inputWord.replace(invalidChars, '');
      document.activeElement.value = inputWord;

      // If the users keypress actually added of removed a character:
      if (inputWord !== oldInputWord) {

        var inputLength = inputWord.length;

        // Remove all of the words from the list of words under the word input box:
        clearChildren(document.getElementById("wordList"));

        // If there's only 1 char, switch the word list to the one for that letter:
        if (inputLength === 1) {
          currentWordList = switchWordList(inputWord);
        }

        if (inputLength > 1) {

          var subWord; // Little section of word from word list e.g. "zeb"ra

          // Check dictionary for matching words and add 'em to the page:
          for (var i = 0; i < currentWordList.length; i++) { // For every word in word list (lots!)
            subWord = currentWordList[i].substr(0, inputLength);
            if (inputWord === subWord) {
              newWord = document.createElement('li');
              newWord.innerHTML = currentWordList[i];
              newWord.setAttribute("title", 'Define: "' + currentWordList[i] + '"');
              
              // Function declaration could be avoided somehow?
              newWord.onclick = function() {
                window.open("https://www.google.com/?#q=define:" + this.innerHTML.replace("<br>", ''));
              };
              
              document.getElementById("wordList").appendChild(newWord);
            }
          }

          // If there were no matching words print sad message :(
          if (document.getElementById("wordList").children.length === 0) {
            newWord = document.createElement('li');
            newWord.innerHTML = ("Word not found :(");
            newWord.setAttribute("title", 'Try searching the web for "' + inputWord + '"');
            document.getElementById("wordList").appendChild(newWord);
          }

        }

      }

    }, 0);

  }

  // Player names boxes:
  if (!handled) {

    for (c = 1; c <= noOfPlayers; c++) {
      inputBox = ( ".names > li > input:nth-child(" + c + ")");
      if (document.querySelector(inputBox) === document.activeElement) {
        focused.c = c;
        handled = true;
      }
    }

    // Go the the correct next input box if enter or tab pressed:
    if (focused.c && (key.which === 13 || key.which === 9)) {

      // Don't do the default thing. Tab would probably go to the correct
      // "next" element, but might want to do some validation or something:
      key.preventDefault();

      // Figure out which input box (which Column) the active element is in:
      for (c = 1; c <= noOfPlayers; c++) {
        inputBox = ( ".names > li > input:nth-child(" + c + ")");
        if (document.querySelector(inputBox) === document.activeElement) {
          focused.c = c;
        }
      }

      if (focused.c === noOfPlayers) {
        // Jump to first points input box:
        inputBox = (".points > li > input");
      } else {
        // Jump to next player name box:
        inputBox = (".names > li > input:nth-child(" + (focused.c + 1) + ")");
      }

    // Do the actual jumpy jump:
    document.querySelector(inputBox).focus();

    }

  }

  // Points boxes:
  if (!handled) {
    
    // Figure out which Column and Row the active element is in:
    for (c = noOfPlayers; c > 0; c--) {
      for (r = pointsRowCounter; r > 0; r--) {
        inputBox = (".points > li:nth-child(" + r + ") > input:nth-child(" + c + ")");
        if (document.querySelector(inputBox) === document.activeElement) {
          focused.c = c;
          focused.r = r;
        }
      }
    }
    
    if (focused.r && (key.which === 13 || key.which === 9)) { // <-- CHANGE THIS IS STILL TOO
      key.preventDefault();
    }

    if (focused.r) setTimeout( function() { // <-- CHANGE THIS IS SILLY

      // Grab what should be a number from the points box and clean it up:
      activeInputValue = activeInput.value;
      if (activeInputValue && activeInputValue !== '-') {
        activeInputValue = activeInputValue.replace(invalidNumbers, '');
        document.activeElement.value = activeInputValue;
      }

      // Go the the correct next input box if enter or tab pressed:
      if (key.which === 13 || key.which === 9) {
        key.preventDefault();

        // Perform automagical addition. THIS IS NOW DONE BY ONBLUR()
        //addPoints(activeInput, focused.c, focused.r);

        // Done by onblur, but also needs to be done on keypress
        maybeAddPointsBoxes();

        // Figure out which points input box should have focus next:
        if (focused.c == noOfPlayers) {
          focused.r++; focused.c = 1;
        } else {
          focused.c++;
        }

        // Focus on next input box:
        inputBox = (".points > li:nth-child(" + focused.r + ") > input:nth-child(" + focused.c + ")");
        if (document.querySelector(inputBox)) {
          document.querySelector(inputBox).focus();
        }

      }

    }, 0);

  }

};



window.onload = function() { loadWords(); };