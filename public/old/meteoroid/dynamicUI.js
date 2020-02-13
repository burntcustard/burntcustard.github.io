


function drawDynamicUI(ctx, width, height, level) {
  
  "use strict";
  
  var uiShadowColor = "rgba(0, 0, 0, 0.1)",
      barWidth = 40, // % the width of the screen.
      barXStart = (100 - barWidth) / 2,
      barXEnd = barXStart + levels[currentLevel].progress * 5,
      vw = width  / 100,
      vh = height / 100,
      vmin = (vw < vh) ? vw : vh,
      uiHeight = 7 * vmin;
  
  if (levels[currentLevel].complete) {
    ctx.strokeStyle = colorLookup("cyan").body[0];
  } else {
    ctx.strokeStyle = colorLookup("cyan").body[1];
  }
  
  ctx.beginPath();
  ctx.lineWidth = 2 * vmin;
  ctx.lineCap = "round";
  ctx.shadowColor = uiShadowColor;
  ctx.moveTo(barXStart * vw, uiHeight / 2);
  ctx.lineTo(barXEnd   * vw, uiHeight / 2);
  ctx.stroke();
  
}