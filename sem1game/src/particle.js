/*jslint white: true */



/**
 * Particle constructor. Particles are drawn in relation to their parent,
 * in terms of coordinates and colour.
 */
var Particle = function (parent, offset, color, x, y, xVel, yVel, lifeTime) {
  
  "use strict";
  
  // Passing in a reference to the parent object, rather than just values.
  // This way when the parent moves, the particles will too.
  this.parent = parent;
  
  // This is another reference to another object, to offset
  // the coordinates a bit more. E.g. an hpPoint.
  this.offset = offset;
  
  // If the parent has a color, we'll use that, otherwise, use
  // the one backup secified, otherwise just make it white:
  this.color = parent.color || color || "rgb(255, 255, 255)";
  
  this.x = x || 0;
  this.y = y || 0;
  
  this.velocity = {
    x: xVel || 0,
    y: yVel || 0
  };
  
  this.lifeTime = lifeTime || 99;
  
};
Particle.prototype.constructor = Particle;



/**
 * Creates a burst of 8 particles around a parent
 *
 * @param {object} particles A reference to the LEVEL the particles are going into.
 * @param {object} parent    A reference to the organism the particles are coming from.
 * @param {object} offset    {x, y} offset from the center of the parent.
 * @param {string} color     HTML color code (rgb, hex, etc.) of the particles.
 * @param {float}  velocity  The speed the particles should go. In arbitrary units.
 *                           "velocity" should technically be "speed" as there's no
 *                           direction. BUT when the particles are created, we use
 *                           this variable in a way that shoves a direction in. Kind of.
 * @param {int}    lifetime  How long the particle should stay around for. In ms. I think.
 *
 *
 *  8  1  2
 *   \ | /
 * 7 ─ p ─ 3
 *   / | \
 *  6  5  4
 */
function createParticleBurst(particles, parent, offset, color, velocity, lifetime) {
  
  "use strict";
  
  var v = velocity,
      d = 0.7071;   // Could use 1 / Math.sqrt(2). But this is close enough.
  
  // So that the game's current level can be passed in (rather than the
  // games current level .particles... which is longer), here we take
  // the reference to the current level, and pick out the particles list:
  particles = particles.particles;
  
  offset = offset || {x: 0, y: 0};
  
  particles.push(new Particle(parent, offset, color, 0, 0,      0,     -v, lifetime));
  particles.push(new Particle(parent, offset, color, 0, 0, d *  v, d * -v, lifetime));
  particles.push(new Particle(parent, offset, color, 0, 0,      v,      0, lifetime));
  particles.push(new Particle(parent, offset, color, 0, 0, d *  v, d *  v, lifetime));
  particles.push(new Particle(parent, offset, color, 0, 0,      0,      v, lifetime));
  particles.push(new Particle(parent, offset, color, 0, 0, d * -v, d *  v, lifetime));
  particles.push(new Particle(parent, offset, color, 0, 0,     -v,      0, lifetime));
  particles.push(new Particle(parent, offset, color, 0, 0, d * -v, d * -v, lifetime));
  
}