/**
 * Loosely based on the helper functions from:
 * http://codeflow.org/entries/2010/aug/28/integration-by-example-euler-vs-verlet-vs-runge-kutta/
 *
 * Uses jslint settings:
 *   - "sloppy: true" to get rid of "use strict" warnings. We don't
 *     REALLY need it because these are very short, simple functions.
 *   - "white: true" to get rid of whitespace warnings, this is just
 *     so the variables can be lined up nicely.
 */

// Get rid of "use strict" and whitespace warnings:
/*jslint sloppy: true, white: true*/



var Vec = function (x, y) {
    
  "use strict";
  
  this.type = 'Vector';
  this.x = x;
  this.y = y;
  
};



Vec.prototype = {
  
  reset: function () {
    this.x = 0;
    this.y = 0;
  },
  
  isub: function (other) {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  },
  
  sub: function (other) {
    return new Vec(
      this.x - other.x,
      this.y - other.y
    );
  },
  
  iadd: function (other) {
    this.x += other.x;
    this.y += other.y;
    return this;
  },
  
  add: function (other) {
    return new Vec(
      this.x + other.x,
      this.y + other.y
    );
  },

  imul: function (scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  },
  
  mul: function (scalar) {
    return new Vec(
      this.x * scalar,
      this.y * scalar
    );
  },
  
  idiv: function (scalar) {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  },
  
  div: function (scalar) {
    return new Vec(
      this.x / scalar,
      this.y / scalar
    );
  },

  normalized: function () {
    var x = this.x,
        y = this.y,
        length = Math.sqrt(x * x + y * y);
    return new Vec(x / length, y / length);
  },
  
  normalize: function () {
    var x = this.x,
        y = this.y,
        length = Math.sqrt(x * x + y * y);
    this.x /= length;
    this.y /= length;
    return this;
  },

  length: function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  },

  distance: function (other) {
    var x = this.x - other.x,
        y = this.y - other.y;
    return Math.sqrt(x * x + y * y);
  },

  copy: function () {
    return new Vec(this.x, this.y);
  }
  
};
