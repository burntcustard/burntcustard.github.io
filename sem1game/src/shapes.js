
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
      
  // |
  case "lineV":
    return [
      0, 0,
      0, 1
    ];
      
  // ─
  case "lineH":
    return [
      0, 0,
      1, 0
    ];
      
  // /
  case "lineD":
    return [
      0, 0,
      1, 1
    ];

  //   /\ 
  // <    >
  //   \/
  case "star":
    return [
      3, 0,
      4, 2,
      6, 3,
      4, 4,
      3, 6,
      2, 4,
      0, 3,
      2, 2
    ];
      
  //   /\ 
  // <    >
  //   \/
  // - But rotated 45 degrees and nearly double the size
  case "fatStar":
    return [
      0, 0,
      4, 1,
      8, 0,
      7, 4,
      8, 8,
      4, 7,
      0, 8,
      1, 4
    ];
      
  // <••>
  //  \/
  case "banana-s":
    return [
      2, 0,
      4, 1,
      3, 2,
      2, 5,
      1, 2,
      0, 1
    ];
      
  // It's not a penis FFS.
  // <••>
  //  ||
  //  \/
  case "longBanana-s":
    return [
      2, 0,
      4, 1,
      3, 2,
      2, 7,
      1, 2,
      0, 1
    ];
      
  //   /\ 
  // <•  •>
  //  \  /
  //   ||
  //   \/
  case "longBanana-l":
    return [
      3, 0,
      4, 1,
      6, 2,
      5, 3,
      4, 5,
      3, 10,
      2, 5,
      1, 3,
      0, 2,
      2, 1
    ];
  
  //   /\ 
  // <•  •>
  //  \  /
  //   \/
  case "banana-l":
    return [
      8, 3,
      12, 1,
      16, 3,
      10, 5,
      8, 12,
      6, 5,
      0, 3,
      4, 1
    ];
      
  // <>
  case "diamond":
    return [
      2, 0,
      4, 1,
      2, 2,
      0, 1
    ];
      
  // Kinda like an owl face shape
  case "owl-s":
    return [
      3, 1,
      5, 0,
      6, 2,
      5, 3,
      3, 2,
      1, 3,
      0, 2,
      1, 0
    ];
      
  // Rocket shaped. Kinda.
  case "rocket":
    return [
      2, 0,
      4, 5,
      3, 6,
      2, 5,
      1, 6,
      0, 5
    ];
      
  // >-<=> google.co.uk/search?tbm=isch&q=vortex+howler
  case "vortexHowler":
    return [
      3, 10,
      0,  7,
      0,  3,
      3,  0,
      6,  3,
      6,  7,
      3, 10,
      3, 15,
      6, 19,
      3, 18,
      0, 19,
      3, 15
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
      
  // △ - But in "mouth form", i.e. with an extra verticey to complete the shape.
  case "equilateralTriangleMouth":
    return [
      4, 0,
      0, 7,
      8, 7,
      4, 0
    ];

  // ◺
  case "rightAngledTriangleShort":
    return [
      0, 0,
      1, 1,
      0, 1
    ];
      
  // ◺
  case "rightAngledTriangleShortInverted":
    return [
      1, 0,
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

  // \_,_/ kinda shape - argh this is >10 pixels wide so formatting is wonky :(
  case "bucketMouth":
    return [
      0, 0,
      2, 3,
      7, 5,
      12, 3,
      14, 0
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