

/**
 * Creates a nicely formatted string containing info about a snake. Uses <br> for newlines.
 * @param   {Object} s          - The interesting snake.
 * @param   {bool}   gamePaused - Is the game paused? (Added at end of string).
 * @param   {Object} wins       - How many wins the snake has had since new game started.
 * @returns {String} - A long string containing info about the snake.
 */
export function snakeInfo(s, gamePaused, wins) {

  var infoString = "",
      controlsText = s.controls.toString();

  controlsText = controlsText.replace("arrows", "&#9650;&#9658;&#9660;&#9668;");
  infoString += ("<span style='color: " + s.color + "'>");
  infoString += (s.name + " <br>");
  for (var i = 0; i < s.name.length; i++) infoString += ("&#175;"); infoString += ("<br>");
  infoString += ("Score: " + s.score + "<br>");
  if (s.name === "AI 1") infoString += ("Wins: " + wins.AI1 + "<br>");
  if (s.name === "AI 2") infoString += ("Wins: " + wins.AI2 + "<br>");
  infoString += ("Dead: " + s.dead + "<br>");
  infoString += ("Controls: " + controlsText + "<br>");
  infoString += ("Speed: " + s.speed + "<br>");
  infoString += ("Direction: " + s.direction + "<br>");
  infoString += ("Head coords: " + s.coords[0].x + "," + s.coords[0].y + "<br>");
  infoString += ("<br>");
  infoString += ("AI DATA <br>");
  infoString += ("&#175;&#175;&#175;&#175;&#175;&#175;&#175; <br>"); // Underline
  infoString += ("Blocked: ");
  if ( s.blocked.N) infoString += (" <span style='color:red; font-weight: bold;'> N </span> ");
  if (!s.blocked.N) infoString += (" N");
  if ( s.blocked.E) infoString += (" <span style='color:red; font-weight: bold;'> E </span> ");
  if (!s.blocked.E) infoString += (" E");
  if ( s.blocked.S) infoString += (" <span style='color:red; font-weight: bold;'> S </span> ");
  if (!s.blocked.S) infoString += (" S");
  if ( s.blocked.W) infoString += (" <span style='color:red; font-weight: bold;'> W </span> <br>");
  if (!s.blocked.W) infoString += (" W <br>");
  infoString += ("Closest food: <br>");
  infoString += (" &nbsp; Index   : " + s.foodDistance.closest + "<br>");
  infoString += (" &nbsp; Distance: " + s.foodDistance.x + "," + s.foodDistance.y + "<br>");
  infoString += (" &nbsp; Total   : " + s.foodDistance.total + "<br>");
  infoString += ("Moves since nommed: " + s.movesSinceNommed + "<br>");
  if (s.ai.difficulty !== "no AI") {
    infoString += ("AI avoidance: <br>");
    infoString += (" &nbsp; Walls : " + s.ai.avoidance.walls + "<br>");
    infoString += (" &nbsp; Snakes: " + s.ai.avoidance.snakes + "<br>");
    infoString += (" &nbsp; Tubes : " + s.ai.avoidance.tubes + "<br>");
    infoString += ("Lazy: " + s.ai.lazy + "<br>");
    infoString += ("SuicideOnWin: " + s.ai.suicideOnWin + "<br>");
    infoString += ("Determined: " + s.ai.determined + "<br>");
    infoString += ("Dizzy: " + s.ai.dizzy + "<br>");
    infoString += ("Alone: " + s.ai.alone + "<br>");
    infoString += ("Winning: " + s.winning + "<br>");
  }
  if (gamePaused) infoString += ("GAME PAUSED");
  infoString += ("</span>");

  return infoString;
}

