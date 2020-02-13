function initializeCanvases() {
  
  "use strict";
  
  planetCanvas    = document.getElementById("planetCanvas");
  meteorCanvas    = document.getElementById("meteorCanvas");
  uiStaticCanvas  = document.getElementById("uiCanvasStatic");
  uiDynamicCanvas = document.getElementById("uiCanvasDynamic");
  planetCtx    = planetCanvas.getContext("2d");
  meteorCtx    = meteorCanvas.getContext("2d");
  uiStaticCtx  = uiStaticCanvas.getContext( "2d");
  uiDynamicCtx = uiDynamicCanvas.getContext("2d");
  
}



function initialize(SSAA) {
  
  "use strict";
  
  document.getElementById("versionPanel").innerHTML = "v" + versionNumber;
  
  initializeCanvases();
  
  resizeGame(SSAA);
  
  window.addEventListener("resize", function() { resizeGame(SSAA) });
  
  document.getElementById("mainMenu").style.display = "block";
  
  addClickHandler("mainMenu", "newGame", true);
  addClickHandler("mainMenu", "continue", true);
  addClickHandler("mainMenu", "highscore", true);
  addClickHandler("mainMenu", "settings", true);
  addClickHandler("mainMenu", "credits", true);
  
  // TODO: Create/draw "first" or "a" set of planets already? As like a background?
  
}