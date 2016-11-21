/*jslint white: true*/

/*global vertexLookup*/

// This is practically a json file already. But I like comments, so keeping it JS for now.


/**
 * Gets properties of a organism. Each organism "definition" MUST
 * include all 5 properties, even if hpPoints are just 0,0.
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
 *     viewDistance: 100             // (Optional) How close the player can
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
        mouth: [],
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
        mouth: [],
        ai: {
          // So that the player is less likely to "accidentally" nom
          // one of these, we make them flee if the player gets close.
          behaviour: "flee",
          viewDistance: 20
        },
        color: "rgb(112, 187, 255)"
      };
      
    case "kite-xxs":
      return {
        body: [{
          vertices: vertexLookup("kite"),
          scale: 3    
        }],
        hpPoints: [],
        maxHP: 1,
        speed: 13,
        turnRate: 30,
        mouth: [{
          vertices: vertexLookup("rightAngledTriangleMouth"),
          scale: 6,
          rotation: -45,
          offset: {x: 0, y: -16}
        }],
        ai: {
          behaviour: "aggressive",
          viewDistance: 30
        },
        difficulty: 0
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
        speed: 13,
        turnRate: 25,
        mouth: [],
        ai: {
          behaviour: "flee",
          viewDistance: 25
        },
        difficulty: 1
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
        speed: 16,
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
          viewDistance: 30
        },
        difficulty: 1,
        evolvesTo: "kite-sm"
      };
      
    case "kite-sm":
      return {
        body: [{
          vertices: vertexLookup("kite"),
          scale: 11
        }],
        hpPoints: [
          {x:  0, y:  -1, value: 1}
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
        speed: 18,
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
          viewDistance: 30
        },
        difficulty: 2,
        evolvesFrom: "kite-s",
        evolvesTo: "kite-m"
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
          viewDistance: 30
        },
        difficulty: 2
      };

    case "kite-m":
      return {
        body: [{
          vertices: vertexLookup("kite"),
          scale: 19
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
        speed: 22,
        turnRate: 30,
        mouth: [{
          vertices: vertexLookup("rightAngledTriangleMouth"),
          scale: 13,
          rotation: -45,
          x: 0,
          y: -30
        }],
        ai: {
          behaviour: "aggressive",
          viewDistance: 30
        },
        difficulty: 3,
        evolvesFrom: "kite-sm",
        evolvesTo: "kite-l"
      };

    case "kite-l":
      return {
        body: [{
          vertices: vertexLookup("kite"),
          scale: 34
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
        speed: 25,
        turnRate: 35,
        mouth: [{
          vertices: vertexLookup("rightAngledTriangleMouth"),
          scale: 13,
          rotation: -45,
          x: 0,
          y: -48
        }],
        ai: {
          behaviour: "aggressive",
          viewDistance: 30
        },
        evolvesFrom: "kite-m"
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
      
    case "snake-s":
      return {
        body: [{
          vertices: vertexLookup("line"),
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
        maxHP: 10,
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
        difficulty: 2
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
        turnRate: 20,
        chargeSpeed: 35,
        chargeTurnRate: 2,
        mouth: [{
          vertices: vertexLookup("rightAngledTriangleMouth"),
          scale: 6,
          rotation: -45,
          x: 0,
          y: -24
        }],
        ai: {
          behaviour: "aggressive",
          viewDistance: 30
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