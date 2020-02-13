function drawStaticUI(ctx, width, height) {
  
  "use strict";
  
  var uiColor = "rgb(0, 220, 210)",
      uiShadowColor = "rgba(0, 0, 0, 0.4)",
      vw = width  / 100,
      vh = height / 100,
      vmin = (vw < vh) ? vw : vh,
      uiHeight = 7 * vmin,
      corner = 3 * vmin;

  // Top UI holding trapezoid. Close enough for now.
  
  ctx.shadowColor = uiShadowColor;
  
  ctx.fillStyle = "rgba(190, 190, 190, 0.5)";
  ctx.lineJoin = "round";
  ctx.shadowBlur = 0.1 * vmin;
  ctx.shadowOffsetY = 0.5 * vmin;
  ctx.beginPath();
  ctx.moveTo(20 * vw, 0);
  ctx.arcTo(25 * vw, uiHeight, 25 * vw + 3 * corner, uiHeight, corner);
  ctx.lineTo(75 * vw - 3 * corner, uiHeight);
  ctx.arcTo(75 * vw, uiHeight, 80 * vw, 0, corner);
  ctx.lineTo(80 * vw, 0);
  ctx.closePath();
  ctx.fill();
  
  ctx.lineCap = "round";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.shadowBlur = 0.1 * vmin;
  ctx.shadowOffsetY = 0.5 * vmin;
  ctx.lineWidth = 2 * vmin;
  ctx.beginPath();
  ctx.moveTo(30 * vw, uiHeight / 2);
  ctx.lineTo(70 * vw, uiHeight / 2);
  ctx.stroke();
  
}