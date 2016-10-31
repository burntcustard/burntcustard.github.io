
function vertexLookup(shape) {
  
  "use strict";
  
  switch (shape) {

  // Kite shaped. Like a kite.
  case "kite":
    return [
      1, 0,
      2, 1,
      1, 3,
      0, 1
    ];

  // ◻
  case "square":
    return [
      0, 0,
      1, 0,
      1, 1,
      0, 1
    ];

  // △
  case "equilateralTriangle":
    return [
      4, 0,
      0, 7,
      8, 7
    ]; // Close enough (<1% away from being equilateral)

  // ◺
  case "rightAngledTriangleShort":
    return [
      0, 0,
      1, 1,
      0, 1
    ];
      
  // ◺ But missing half the hypotenuse. So not a closed shape.
  case "rightAngledTriangleMouth2":
    return [
      0, 2,
      0, 0,
      1, 1
    ];
      
  // L shape with even length lines
  case "rightAngledTriangleMouth":
    return [
      0, 0,
      0, 1,
      1, 1
    ];
      
  // ◺ but taller
  case "rightAngledTriangleTall":
    return [
      0, 0,
      1, 2,
      0, 2
    ];

  // ⬠
  case "pentagon":
    return [
      // TODO: pentagon vertices
    ];

  // ⬡
  case "hexagon":
    return [
      // TODO: hexagon vertices
    ];

  default:
    return [];

  }

}