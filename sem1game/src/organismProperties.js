/*jslint white: true*/

/*global vertexLookup*/

// This is practically a json file already. But I like comments, so keeping it JS for now.


/**
 * Gets properties of an organism.
 * @param   {string} organism What kind of organism is it?
 * @returns {object} An object full of fun properties unique
 *                            to that specific type of organism.
 * @default {object} If no organism type is found with the
 *                   input string, return a "kite-s".
 *        
 * EXAMPLE:
 *    
 * return {
 *   type: "Example Organism",       // organism's name.
 *   vertices: vertexLookup("kite"), // Shape of the body.
 *   scale: 9,                       // Size of the body.
 *   hpPoints: [                      
 *     {x:  0, y:  -1, value: 1}     // Locations (offsets from center of 
 *     {x:  3, y:  -1, value: 1}     // organism), and values of HP dots
 *     {x:  6, y:  -1, value: 1}     // (0, 1, 2, or 3).
 *   ],
 *   maxHP: 1,                       // Max HP. If > organism may evolve.
 *   speed: 1,                       // Maximum speed.
 *   turnRate: 6,                    // Turn rate (*3 if player controlled).
 *   mouth: [],                      // Info about organisms mouth.
 *   ai: {                          
 *     behaviour: "flee",            // AIs behaviour. Possible values:
 *                                   // "agressive",
 *                                   // "flee",
 *                                   // "neutral", // Swims around randomly
 *     whenAttacked: "flee",         // (Optional) extra behaviour.
 *     viewDistance: 50              // (Optional) How close the player can
 *                                   // come before default "neutral"
 *                                   // changes to AIs specified behaviour.
 *   }
 * };                   
 *                   
 */
function getOrganismProperties(organism) {
  
  "use strict";
  
  switch (organism) {
      
    case "levelUp":
      return {
        body: [
          {
            vertices: vertexLookup("fatStar"),
            scale: 3,
            rotating: 2
          },
          {
            vertices: vertexLookup("star"),
            scale: 7,
            rotating: -1
          }
        ],
        hpPoints: [
          {value: 1}
        ],
        maxHP: 1,
        speed: 2,
        turnRate: 3,
        ai: {
          // So that the player is less likely to "accidentally" nom
          // one of these, we make them flee if the player gets close.
          behaviour: "flee",
          viewDistance: 20
        },
        color: "rgb(255, 105, 180)"
      };
      
    case "levelDown":
      return {
        body: [
          {
            vertices: vertexLookup("equilateralTriangle"),
            scale: 3,
            rotating: 2
          },
          {
            vertices: vertexLookup("equilateralTriangle"),
            scale: 3.5,
            rotating: -1
          }
        ],
        hpPoints: [
          {value: 1}
        ],
        maxHP: 1,
        speed: 2,
        turnRate: 3,
        ai: {
          // So that the player is less likely to "accidentally" nom
          // one of these, we make them flee if the player gets close.
          behaviour: "flee",
          viewDistance: 20
        },
        color: "rgb(112, 187, 255)"
      };
      
    // ●
    // Single dot of HP
    case "food-xxs":
      return {
        body: [],
        hpPoints: [{
          x: 0, y: 0, value: 1
        }],
        drag: 2,
        speed: 99,
        difficulty: 1
    };
      
    // ◉-◉
    // Pair of HP, with random HP values between 0 and 2.
    case "food-xs":
      return {
        body: [
          {
            vertices: vertexLookup("lineV"),
            scale: 15,
            rotating: Math.round(Math.random()) * 0.3 + 0.3
          }
        ],
        hpPoints: [
          {x: 0, y: -10, value: Math.floor(Math.random() * 2)},
          {x: 0, y:  11, value: Math.floor(Math.random() * 2)}
        ],
        maxHP: 1,
        speed: 1,
        turnRate: 1,
        ai: {},
        difficulty: 1
      };
      
    // ◉-◉-◉
    // Triplet of HP, with random HP values between 0 and 3.
    case "food-s":
      return {
        body: [
          {
            vertices: vertexLookup("lineV"),
            scale: 20,
            rotating: Math.round(Math.random()) * 0.3 + 0.3
          },
          {
            vertices: vertexLookup("lineD"),
            scale: 14,
            x: 17,
            y: 46
          }
        ],
        hpPoints: [
          {x:  0, y: -13, value: Math.floor(Math.random() * 3)},
          {x:  0, y:  13, value: Math.floor(Math.random() * 3)},
          {x: 18, y:  32, value: Math.floor(Math.random() * 3)}
        ],
        maxHP: 1,
        speed: 1,
        turnRate: 1,
        ai: {},
        difficulty: 3
      };
      
    // TODO: "food-m" variants
      
    case "kite-xxs":
      return {
        body: [{
          vertices: vertexLookup("kite"),
          scale: 3    
        }],
        speed: 6,
        turnRate: 30,
        ai: {
          behaviour: "flee",
          viewDistance: 30
        }
      };
       
    case "kite-xs":
      return {
        body: [{
          vertices: vertexLookup("kite"),
          scale: 8
        }],
        hpPoints: [
          {x:  0, y:  -1, value: 1}
        ],
        maxHP: 1,
        speed: 12,
        turnRate: 25,
        ai: {
          behaviour: "flee",
          viewDistance: 20
        },
        difficulty: 2
      };
      
    case "kite-s":
      return {
        body: [{
          vertices: vertexLookup("kite"),
          scale: 9
        }],
        hpPoints: [
          {x:  0, y:  -1, value: 1}
        ],
        speedLines: [
          [
            {x: -5, y: 16},
            {x: -5, y: 24}
          ],
          [
            {x: 0, y: 22},
            {x: 0, y: 30}
          ],
          [
            {x:  5, y: 16},
            {x:  5, y: 24}
          ]
        ],
        maxHP: 1,
        speed: 14,
        maxSpeed: 20,
        turnRate: 25,
        mouth: [{
          vertices: vertexLookup("rightAngledTriangleMouth"),
          scale: 6,
          rotation: -45,
          x: 0,
          y: -14
        }],
        ai: {
          behaviour: "aggressive",
          viewDistance: 22
        },
        difficulty: 2,
        evolvesTo: "kite-sm"
      };
      
    case "kite-sm":
      return {
        body: [{
          vertices: vertexLookup("kite"),
          scale: 11
        }],
        hpPoints: [
          {x:  0, y:  -1, value: 2}
        ],
        speedLines: [
          [
            {x: -6, y: 18},
            {x: -6, y: 26}
          ],
          [
            {x: 0, y: 24},
            {x: 0, y: 32}
          ],
          [
            {x:  6, y: 18},
            {x:  6, y: 26}
          ]
        ],
        maxHP: 2,
        speed: 16,
        turnRate: 25,
        mouth: [{
          vertices: vertexLookup("rightAngledTriangleMouth"),
          scale: 9,
          rotation: -45,
          x: 0,
          y: -18
        }],
        ai: {
          behaviour: "aggressive",
          viewDistance: 24
        },
        difficulty: 4,
        evolvesFrom: "kite-s",
        evolvesTo: "kite-m",
        levelCap: 1
      };
      
    case "kite-s-bigMouth":
      return {
        body: [{
          vertices: vertexLookup("kite"),
          scale: 9
        }],
        hpPoints: [
          {x:  0, y:  -1, value: 1}
        ],
        maxHP: 1,
        speed: 18,
        turnRate: 25,
        mouth: [{
          vertices: vertexLookup("rightAngledTriangleMouth"),
          scale: 14,
          rotation: -45,
          x: 0,
          y: -18
        }],
        ai: {
          behaviour: "aggressive",
          viewDistance: 24
        },
        difficulty: 5
      };

    case "kite-m":
      return {
        body: [{
          vertices: vertexLookup("kite"),
          scale: 18
        }],
        hpPoints: [
          {x: -7, y: -3, value: 1},
          {x:  7, y: -3, value: 1}
        ],
        speedLines: [
          [
            {x: -8, y: 30},
            {x: -8, y: 40}
          ],
          [
            {x: 0, y: 40},
            {x: 0, y: 50}
          ],
          [
            {x:  8, y: 30},
            {x:  8, y: 40}
          ]
        ],
        maxHP: 4,
        speed: 20,
        turnRate: 30,
        mouth: [{
          vertices: vertexLookup("rightAngledTriangleMouth"),
          scale: 12,
          rotation: -45,
          x: 0,
          y: -28
        }],
        ai: {
          behaviour: "aggressive",
          viewDistance: 26
        },
        difficulty: 6,
        evolvesFrom: "kite-sm",
        evolvesTo: "kite-l",
        levelCap: 2
      };

    case "kite-l":
      return {
        body: [{
          vertices: vertexLookup("kite"),
          scale: 33
        }],
        hpPoints: [
          {x: -21, y: - 6, value: 2},
          {x: - 8, y: -13, value: 2},
          {x: - 8, y:   2, value: 2},
          {x:  21, y: - 6, value: 2},
          {x:   8, y: -13, value: 2},
          {x:   8, y:   2, value: 2}
        ],
        speedLines: [
          [
            {x: -9, y: 55},
            {x: -9, y: 65}
          ],
          [
            {x: 0, y: 68},
            {x: 0, y: 78}
          ],
          [
            {x:  9, y: 55},
            {x:  9, y: 65}
          ]
        ],
        maxHP: 12,
        speed: 22,
        turnRate: 35,
        mouth: [{
          vertices: vertexLookup("rightAngledTriangleMouth"),
          scale: 14,
          rotation: -45,
          x: 0,
          y: -48
        }],
        ai: {
          behaviour: "aggressive",
          viewDistance: 30
        },
        difficulty: 7,
        evolvesFrom: "kite-m",
        evolvesTo: "kite-xl",
        levelCap: 3
      };
      
    case "kite-xl":
      return {
        body: [{
          vertices: vertexLookup("kite"),
          scale: 42
        }],
        hpPoints: [
          {x: -27, y: - 8, value: 3},
          {x: -10, y: -18, value: 3},
          {x: -10, y:   2, value: 3},
          {x:  27, y: - 8, value: 3},
          {x:  10, y: -18, value: 3},
          {x:  10, y:   2, value: 3}
        ],
        speedLines: [
          [
            {x: -9, y: 55},
            {x: -9, y: 65}
          ],
          [
            {x: 0, y: 68},
            {x: 0, y: 78}
          ],
          [
            {x:  9, y: 55},
            {x:  9, y: 65}
          ]
        ],
        maxHP: 18,
        speed: 24,
        turnRate: 35,
        mouth: [{
          vertices: vertexLookup("rightAngledTriangleMouth"),
          scale: 20,
          rotation: -45,
          x: 0,
          y: -62
        }],
        ai: {
          behaviour: "aggressive",
          viewDistance: 30
        },
        difficulty: 9,
        evolvesFrom: "kite-l"
      };

    // This is going to be the kite "boss" organism. It needs some
    // sort of special ability, but I dunno what yet.
    case "kite-b":
      return {
        body: [{
          vertices: vertexLookup("kite"),
          scale: 56
        }],
        hpPoints: [
          {x: -21, y: - 6, value: 3},
          {x: - 8, y: -13, value: 3},
          {x: - 8, y:   2, value: 3},
          {x:  21, y: - 6, value: 3},
          {x:   8, y: -13, value: 3},
          {x:   8, y:   2, value: 3}
        ],
        // This organism can't evolve further, but it's max HP
        // should still be set so that the hpPoints don't
        // end up with an "undisplayably high" value.
        maxHP: 23,
        speed: 6
      };
      
    case "triangle":
      return {
        body: [
          {
            vertices: vertexLookup("equilateralTriangle"),
            scale: 9,
            x: 0,
            y: 0,
            rotating: 0
          },
          {
            vertices: vertexLookup("equilateralTriangle"),
            scale: 10,
            x: 0,
            y: 0,
            rotating: -3
          },
          {
            vertices: vertexLookup("equilateralTriangle"),
            scale: 8,
            rotating: 3
          }
        ],
        hpPoints: [
          {x: 0, y: -14, value: 1},
          {x: -13, y: 7, value: 1},
          {x:  13, y: 7, value: 1}
        ],
        maxHP: 3,
        speed: 6,
        turnRate: 9,
        mouth: [{
          vertices: vertexLookup("equilateralTriangleMouth"),
          scale: 2,
          rotation: 60,
          x: 2,
          y: -1
        }],
        ai: {
          behaviour: "neutral-aggressive",
          viewDistance: 30
        },
        difficulty: 9
      };
      
    case "banana-xxs":
      return {
        body: [{
          vertices: vertexLookup("banana-s"),
          scale: 9
        }],
        hpPoints: [
          {x: -5, y: -6, value: 1},
          {x:  5, y: -6, value: 1}
        ],
        maxHP: 2,
        speed: 12,
        turnRate: 13,
        mouth: [],
        ai: {
          behaviour: "flee",
          viewDistance: 30
        },
        difficulty: 2,
        evolvesTo: "banana-xs"
      };
      
    case "banana-xs":
      return {
        body: [{
          vertices: vertexLookup("banana-s"),
          scale: 9
        }],
        hpPoints: [
          {x: -5, y: -6, value: 1},
          {x:  5, y: -6, value: 1}
        ],
        maxHP: 2,
        speed: 14,
        turnRate: 20,
        mouth: [{
          vertices: vertexLookup("rightAngledTriangleMouth"),
          scale: 8,
          rotation: -45,
          x: 0,
          y: -21
        }],
        ai: {
          behaviour: "flee",
          viewDistance: 30
        },
        difficulty: 5,
        evolvesTo: "banana-s"
      };
      
    case "banana-s":
      return {
        body: [{
          vertices: vertexLookup("banana-s"),
          scale: 12
        }],
        hpPoints: [
          {x: -8, y: -7.5, value: 1},
          {x:  8, y: -7.5, value: 1}
        ],
        maxHP: 4,
        speed: 16,
        turnRate: 20,
        mouth: [{
          vertices: vertexLookup("rightAngledTriangleMouth"),
          scale: 10,
          rotation: -45,
          x: 0,
          y: -27
        }],
        ai: {
          behaviour: "aggressive",
          viewDistance: 30
        },
        difficulty: 6,
        evolvesFrom: "banana-xs",
        evolvesTo: "banana-sm"
      };
      
    case "banana-sm":
      return {
        body: [{
          vertices: vertexLookup("banana-s"),
          scale: 12
        }],
        hpPoints: [
          {x: -8, y: -7.5, value: 1},
          {x:  8, y: -7.5, value: 1}
        ],
        maxHP: 4,
        speed: 24,
        turnRate: 20,
        mouth: [{
          vertices: vertexLookup("bucketMouth"),
          scale: 2,
          x: 0,
          y: -29
        }],
        ai: {
          behaviour: "aggressive",
          viewDistance: 30
        },
        difficulty: 7,
        evolvesFrom: "banana-s",
        evolvesTo: "banana-m"
      };
      
    // Plan here is to have a "split evolution" from the banana-small,
    // to a super speedy mysterious "long banana"
    case "longBanana-m":
      return {
        body: [{
          vertices: vertexLookup("longBanana-s"),
          scale: 12
        }],
        hpPoints: [
          {x: -8, y: -11, value: 1},
          {x:  8, y: -11, value: 1}
        ],
        maxHP: 4,
        speed: 25,
        turnRate: 20,
        mouth: [{
          vertices: vertexLookup("rightAngledTriangleMouth"),
          scale: 10,
          rotation: -45,
          x: 0,
          y: -27
        }],
        ai: {
          behaviour: "aggressive",
          viewDistance: 30
        },
        difficulty: 8,
        evolvesTo: "longBanana-l"
      };
      
    case "banana-m":
      return {
        body: [
          {
            vertices: vertexLookup("banana-s"),
            scale: 16
          },
          {
            vertices: vertexLookup("rightAngledTriangleShort"),
            scale: 9,
            rotation: -109,
            x: -34,
            y: 120
          },
          {
            vertices: vertexLookup("rightAngledTriangleShortInverted"),
            scale: 9,
            rotation: 109,
            x: 34,
            y: 120
          }
        ],
        hpPoints: [
          {x: -10, y: -10, value: 1},
          {x:  10, y: -10, value: 1}
        ],
        maxHP: 6,
        speed: 24,
        turnRate: 20,
        mouth: [{
          vertices: vertexLookup("bucketMouth"),
          scale: 3,
          x: 0,
          y: -37
        }],
        ai: {
          behaviour: "aggressive",
          viewDistance: 30
        },
        difficulty: 8,
        evolvesFrom: "banana-sm",
        evolvesTo: "banana-l"
      };
      
    case "longBanana-l":
      return {
        body: [{
          vertices: vertexLookup("longBanana-l"),
          scale: 13
        }],
        hpPoints: [
          {x: -15, y: -12, value: 2},
          {x:  15, y: -12, value: 2},
          {x:   0, y: - 1, value: 2},
          {x:   0, y:  17, value: 2}
        ],
        maxHP: 8,
        speed: 40,
        turnRate: 15,
        drag: 33,
        mouth: [
          {
            vertices: vertexLookup("rightAngledTriangleMouth"),
            scale: 4,
            rotation: -45,
            y: -37
          },
          {
            vertices: vertexLookup("rightAngledTriangleMouth"),
            scale: 7,
            rotation: -45,
            y: -34
          },
          {
            vertices: vertexLookup("rightAngledTriangleMouth"),
            scale: 11,
            rotation: -45,
            y: -31
          }
        ],
        ai: {
          behaviour: "aggressive",
          viewDistance: 99
        },
        difficulty: 9
      };
      
    case "banana-l":
      return {
        body: [
          {
            vertices: vertexLookup("banana-l"),
            scale: 11
          },
          {
            vertices: vertexLookup("diamond"),
            scale: 12,
            x: 0,
            y: -97
          },
          {
            vertices: vertexLookup("rightAngledTriangleShort"),
            scale: 14,
            rotation: -108,
            x: -44,
            y: 199
          },
          {
            vertices: vertexLookup("rightAngledTriangleShortInverted"),
            scale: 14,
            rotation: 108,
            x: 44,
            y: 199
          }
        ],
        hpPoints: [
          {x: -58, y: -15, value: 1},
          {x: -30, y: -15, value: 1},
          {x: -44, y: -22, value: 1},
          {x: -44, y:  -8, value: 1},
          {x:  58, y: -15, value: 1},
          {x:  30, y: -15, value: 1},
          {x:  44, y: -22, value: 1},
          {x:  44, y:  -8, value: 1}
        ],
        maxHP: 16,
        speed: 24,
        turnRate: 18,
        mouth: [{
          vertices: vertexLookup("bucketMouth"),
          scale: 4,
          x: 0,
          y: -48
        }],
        ai: {
          behaviour: "aggressive",
          viewDistance: 30
        },
        difficulty: 9,
        evolvesFrom: "banana-m",
        evolvesTo: "banana-xl"
      };
      
    case "banana-xl":
      return {
        body: [
          {
            vertices: vertexLookup("banana-l"),
            scale: 14
          },
          {
            vertices: vertexLookup("diamond"),
            scale: 15,
            x: 0,
            y: -123
          },
          {
            vertices: vertexLookup("rightAngledTriangleShort"),
            scale: 19,
            rotation: -108,
            x: -55,
            y: 255
          },
          {
            vertices: vertexLookup("rightAngledTriangleShortInverted"),
            scale: 19,
            rotation: 108,
            x: 55,
            y: 255
          }
        ],
        hpPoints: [
          {x: -74, y: -19.5, value: 2},
          {x: -38, y: -19.5, value: 2},
          {x: -56, y: -29.5, value: 2},
          {x: -56, y:  -9.5, value: 2},
          {x:  74, y: -19.5, value: 2},
          {x:  38, y: -19.5, value: 2},
          {x:  56, y: -29.5, value: 2},
          {x:  56, y:  -9.5, value: 2}
        ],
        maxHP: 24,
        speed: 24,
        turnRate: 16,
        mouth: [
          {
            vertices: vertexLookup("bucketMouth"),
            scale: 5,
            x: 0,
            y: -60
          },
          {
            vertices: vertexLookup("rightAngledTriangleMouth"),
            scale: 9,
            rotation: -45,
            x: -56,
            y: -49
          },
          {
            vertices: vertexLookup("rightAngledTriangleMouth"),
            scale: 9,
            rotation: -45,
            x: 56,
            y: -49
          }
        ],
        ai: {
          behaviour: "aggressive",
          viewDistance: 30
        },
        difficulty: 9,
        evolvesFrom: "banana-l"
      };
      
    case "owl-s":
      return {
        body: [{
          vertices: vertexLookup("owl-s"),
          scale: 9
        }],
        hpPoints: [
          {x: -14, y: -1, value: 1},
          {x:  14, y: -1, value: 1}
        ],
        maxHP: 4,
        speed: 4,
        turnRate: 2,
        chargeSpeed: 7,
        chargeTurnRate: 38,
        mouth: [{
          vertices: vertexLookup("rightAngledTriangleMouth"),
          scale: 18,
          rotation: -45,
          x: 0,
          y: -15
        }],
        ai: {
          behaviour: "aggressive",
          viewDistance: 7
        },
        difficulty: 4
      };
      
    case "snake-s":
      return {
        body: [{
          vertices: vertexLookup("lineV"),
          scale: 10
        }],
        tail: {
          maxLength: 5,
          distanceBetweenSegments: 15
        },
        hpPoints: [
          {value: 1},
          {value: 1},
          {value: 1}
        ],
        maxHP: 5,
        speed: 16,
        turnRate: 20,
        mouth: [{
          vertices: vertexLookup("bucketMouth"),
          scale: 3,
          x: 0,
          y: -20
        }],
        ai: {
          behaviour: "aggressive",
          viewDistance: 25
        },
        difficulty: 5
      };
      
    case "vortexHowler-s":
      return {
        body: [{
          vertices: vertexLookup("vortexHowler"),
          scale: 2
        }],
        hpPoints: [
          {x:  0, y:  -11, value: 1}
        ],
        maxHP: 1,
        speed: 6,
        turnRate: 25,
        chargeSpeed: 40,
        chargeTurnRate: 3,
        chargeCondition: "facing",
        mouth: [{
          vertices: vertexLookup("rightAngledTriangleMouth"),
          scale: 6,
          rotation: -45,
          x: 0,
          y: -24
        }],
        ai: {
          behaviour: "aggressive",
          viewDistance: 32
        },
        difficulty: 2
      };
      
    case "rocket-m":
      return {
        body: [{
          vertices: vertexLookup("rocket"),
          scale: 9
        }],
        hpPoints: [
          {x: 0, y: -17, value: 2},
          {x: 0, y: - 4, value: 2}
        ],
        maxHP: 4,
        speed: 25,
        turnRate: 20,
        mouth: [{
          vertices: vertexLookup("rightAngledTriangleMouth"),
          scale: 6,
          rotation: -45,
          x: 0,
          y: -44
        }],
        ai: {
          behaviour: "aggressive",
          viewDistance: 30
        },
        difficulty: 4
      };

    // If no organism is found with the specified
    // name, just return a kite-s organism:
    default:
      return getOrganismProperties("kite-xs");

  }

}