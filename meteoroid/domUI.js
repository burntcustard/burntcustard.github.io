/*jslint devel: true*/



function buttonClick(currentMenu, button, closeMenu) {
  
  "use strict";
  
  switch (button) {
    case "newGame":
      newGame();
      break;
    case "continue":
      continueGame();
      break;
    default:
      console.log("Unknown button clicked ¯\\_(ツ)_/¯");
  }
  
  if (closeMenu) {
    console.log("Closing menu " + currentMenu);
    document.getElementById(currentMenu).style.display = "none";
  }
  
}



function addClickHandler(menu, button, close) {
  
  "use strict";
  
  var buttonID = button + "Button";
  
  if (document.getElementById(buttonID)) {

    document.getElementById(buttonID).addEventListener(
      "click",
      function () { buttonClick(menu, button, close); },
      false
    );
    
  } else {
    console.log("Failed to add click handler to " + buttonID + " in the " + menu);
  }
  
}