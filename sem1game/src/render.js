/*jslint plusplus: true, white: true*/

/*global debug, settings, renderShader*/




/**
 * Draw the organisms onto the canvas. TODO: Split into
 * the 3 body/hp/mouths sections, and animate, and look
 * into performance improvements some more :)
 * THIS IS GETTING CRAZY TODO: MAKE LESS CRAZY LONG
 */
function renderOrganisms(ctx, organisms, camera) {
  
  "use strict";
  
  var organism, coloredOrganisms = [], i, body, speedLine, v, vertex, j, hp, mouth, x, y, color, colorAlreadyAdded = false, c;
  
  ctx.lineWidth = 2;
  ctx.shadowBlur = 0;
  
  // Make color lists, i.e. lists of organisms with different colors.
  // Like... a white organism list, an orange organism list, etc.
  
  for (i = 0; i < organisms.length; i++) {
    colorAlreadyAdded = false;
    for (j = 0; j < coloredOrganisms.length; j++) {
      if (organisms[i].color === coloredOrganisms[j].color) {
        colorAlreadyAdded = true;
        coloredOrganisms[j].organisms.push(organisms[i]);
      }
    }
    if (colorAlreadyAdded === false) {
      coloredOrganisms.push({
        color: organisms[i].color,
        organisms: [organisms[i]]
      });
    }
  }
  
  if (coloredOrganisms.length > settings.maxColor.value) { 
    coloredOrganisms = [{
      color: "white",
      organisms: organisms
    }];
  }
  
  for (c = coloredOrganisms.length - 1; c >= 0; c--) {
  
    ctx.strokeStyle = coloredOrganisms[c].color;
    ctx.fillStyle = coloredOrganisms[c].color;
    ctx.shadowColor = coloredOrganisms[c].color;

    // Begin drawing some lines:
    ctx.beginPath();

    // Reverse through, so that the player (the first organism) is drawn last, on top.
    // TODO: Split up into different colour sections, with ctx.strokeStyle.
    for (i = coloredOrganisms[c].organisms.length - 1; i >= 0; i--) {

      organism = coloredOrganisms[c].organisms[i];

      if (organism.visible && organism.alive) {

        for (j = 0; j < organism.body.length; j++) {

          body = organism.body[j];
          
          ctx.moveTo(
            organism.x + (body.vertices[body.vertices.length - 1].x) - camera.x,
            organism.y + (body.vertices[body.vertices.length - 1].y) - camera.y
          );            

          for (v = 0; v < body.vertices.length; v++) {
            vertex = body.vertices[v];
            ctx.lineTo(
              organism.x + vertex.x - camera.x,
              organism.y + vertex.y - camera.y
            );
          }

        }
        
        // Render the lines between the hpPoints on snakes:
        
        for (j = 0; organism.tail && j < organism.hpPoints.length - 1; j++) {
          
          ctx.moveTo(
            organism.x + organism.hpPoints[j].x - camera.x,
            organism.y + organism.hpPoints[j].y - camera.y
          );
          
          ctx.lineTo(
            organism.x + organism.hpPoints[j + 1].x - camera.x,
            organism.y + organism.hpPoints[j + 1].y - camera.y
          );
          
        }
        
        // Render the speedy moving fast / input pressed lines:
        
        for (j = 0; (organism.speedLines) &&
                    (organism.showSpeedLines) &&
                    (j < organism.speedLines.length); j++) {

          speedLine = organism.speedLines[j];

          ctx.moveTo(
            organism.x + (speedLine[0].x) - camera.x,
            organism.y + (speedLine[0].y) - camera.y
          );

          for (v = 1; v < speedLine.length; v++) {
            vertex = speedLine[v];
            ctx.lineTo(
              organism.x + vertex.x - camera.x,
              organism.y + vertex.y - camera.y
            );
          }

        }

      }

    }

    ctx.stroke();


    // Draw the HP dots:
    // Performance could be increased by doing ALL the fills/strokes at once,
    // like how the lines of the body of the organisms are done.

    for (i = coloredOrganisms[c].organisms.length - 1; i >= 0; i--) {

      organism = coloredOrganisms[c].organisms[i];

      if (organism.visible && organism.alive) {

        for (j = 0; j < organism.hpPoints.length; j++) {

          hp = organism.hpPoints[j];

          x = organism.x - camera.x + hp.x;
          y = organism.y - camera.y + hp.y;

          switch (hp.value) {

            case 0: // ○
              ctx.beginPath();
              ctx.arc(x, y, 4, 0, 2 * Math.PI);
              ctx.stroke();
            break;

            case 1: // ●
              ctx.beginPath();
              ctx.arc(x, y, 4, 0, 2 * Math.PI);
              ctx.fill();
            break;

            case 2: // ◉
              ctx.beginPath();
              ctx.arc(x, y, 3.5, 0, 2 * Math.PI);
              ctx.fill();
              ctx.beginPath();
              ctx.arc(x, y, 5.5, 0, 2 * Math.PI);
              ctx.stroke();           
            break;

            case 3: // ◉ with another outline
              ctx.beginPath();
              ctx.arc(x, y, 3, 0, 2 * Math.PI);
              ctx.fill();
              ctx.beginPath();
              ctx.arc(x, y, 5, 0, 2 * Math.PI);
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(x, y, 8, 0, 2 * Math.PI);
              ctx.stroke();  
            break;

          }

        }

      }

    }

    // Draw mouths:

    ctx.beginPath();

    for (i = coloredOrganisms[c].organisms.length - 1; i >= 0; i--) {

      organism = coloredOrganisms[c].organisms[i];

      if (organism.visible && organism.alive && organism.mouth) {

        for (j = 0; j < organism.mouth.length; j++) {

          mouth = organism.mouth[j];

          ctx.moveTo(
            organism.x + (mouth.vertices[0].x) - camera.x,
            organism.y + (mouth.vertices[0].y) - camera.y
          );

          for (v = 1; v < mouth.vertices.length; v++) {
            vertex = mouth.vertices[v];
            ctx.lineTo(
              organism.x + vertex.x - camera.x,
              organism.y + vertex.y - camera.y
            );
          }

        }

      }

    }

    ctx.stroke();

    // Draw debug mouth hitbox:

    if (debug) {

      ctx.fillStyle = "rgba(255, 0, 0, 0.4)";

      for (i = coloredOrganisms[c].organisms.length - 1; i >= 0; i--) {

        organism = coloredOrganisms[c].organisms[i];

        if (organism.visible && organism.alive) {

          for (j = 0; j < organism.mouth.length; j++) {

            mouth = organism.mouth[j];

            x = organism.x + (mouth.x) - camera.x;
            y = organism.y + (mouth.y) - camera.y;

            ctx.beginPath();
            ctx.arc(x, y, organism.mouth[j].size, 0, 2 * Math.PI);
            ctx.fill();

          }

        }

      }

    }
    
  }
  
}



function renderMapLines(ctx, camera, lineColor) {
  
  "use strict";
  
  var i,
      lineSpace = 80; // The space between the lines in px.
  
  // Map lines. This effectively an overlay... so it might not change
  // if the camera was zoomed in or out (if/when that's implemented?)
  // TODO: Figure out why these jump when the edge of the world is reached :(
  
  // Maybe something like this. But not this.
  // lineSpace += ((camera.width % 80) / Math.floor(camera.width/80));
  
  // Colour and style of the lines:
  ctx.lineWidth = 1; // Lines are much brighter at only slightly larger line width.
  ctx.strokeStyle = lineColor;
  
  if (settings.glowy.value) {
    ctx.shadowColor = lineColor;
    ctx.shadowBlur = 9;
  }
  
  ctx.beginPath();
  // | Vertical lines
  for (i = -(camera.x % lineSpace); i < camera.width; i += lineSpace) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, camera.height);
  }
  // ─ Horizontal lines
  for (i = -(camera.y % lineSpace); i < camera.height; i += lineSpace) {
    ctx.moveTo(0, i);
    ctx.lineTo(camera.width, i);
  }
  ctx.stroke();
  
}



function renderParticles(ctx, particles, camera) {
  
  "use strict";
  
  var i, j, particle, xDiff, yDiff, colorAlreadyAdded, coloredParticles = [];
  
  // Make color lists, i.e. lists of particles with different colors.
  // Like... a white particle list, an orange particle list, etc.
  
  for (i = 0; i < particles.length; i++) {
    colorAlreadyAdded = false;
    for (j = 0; j < coloredParticles.length; j++) {
      if (particles[i].color === coloredParticles[j].color) {
        colorAlreadyAdded = true;
        coloredParticles[j].particles.push(particles[i]);
      }
    }
    if (colorAlreadyAdded === false) {
      coloredParticles.push({
        color: particles[i].color,
        particles: [particles[i]]
      });
    }
  }
  
  ctx.lineWidth = 2;
  
  
  for (i = coloredParticles.length - 1; i >= 0; i--) {
  
    ctx.strokeStyle = coloredParticles[i].color;

    ctx.beginPath();
  
    for (j = coloredParticles[i].particles.length - 1; j >= 0; j--) {

      particle = coloredParticles[i].particles[j];

      xDiff = particle.x - particle.xOld;
      yDiff = particle.y - particle.yOld;

      ctx.moveTo(
        particle.parent.x + particle.offset.x + particle.xOld - game.camera.x,
        particle.parent.y + particle.offset.y + particle.yOld - game.camera.y
      );
      ctx.lineTo(
        particle.parent.x + particle.offset.x + particle.x + xDiff * 2 - game.camera.x,
        particle.parent.y + particle.offset.y + particle.y + yDiff * 2 - game.camera.y
      );

    }
    
    ctx.stroke();
    
  }
  
}



function render(tFrame, ctx, game, time, deltaTime) {
  
  "use strict";
  
  time = window.performance.now();
  
  // Background color:
  ctx.fillStyle = game.levels[game.currentLevel].bgColor;
  ctx.fillRect(0, 0, game.camera.width, game.camera.height);
  
  // Draw organisms on the next level, faded out 80%:
  ctx.globalAlpha = 0.2;
  renderOrganisms(ctx, game.levels[game.currentLevel + 1].organisms, game.camera);
  ctx.globalAlpha = 1; // Set the fade back to normal for the rest of the drawing.
  
  renderMapLines(
    ctx,
    game.camera,
    game.levels[game.currentLevel].lineColor
  );
  
  // Draw organisms on this level (including the player):
  renderOrganisms(ctx, game.levels[game.currentLevel].organisms, game.camera);

  // Draw particles
  renderParticles(ctx, game.levels[game.currentLevel].particles, game.camera);
  
  if (settings.webGL.value) {
    renderShader(game.camera);
  }

  if (debug === true) {
    
    debugCounter++;
    
    if (debugCounter > 12) {
      
      debugCounter = 0;
      drawDebug(game, time, deltaTime);
      
    }
    
  }
  
}
