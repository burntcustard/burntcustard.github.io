/*jslint white: true*/

/*global vertexLookup: false*/



/**
 * Gets properties of a creature. Each creature "definition" MUST
 * include all 5 properties, even if hpPoints are just 0,0.
 * @param   {string} creature What kind of creature is it?
 * @returns {object} An object full of fun properties unique
 *                            to that specific type of creature.
 * @default {object} If no creature type is found with the
 *                   input string, return a "kite-s".
 *        
 * EXAMPLE:
 *    
 * return {
 *   type: "Example Creature",       // Creature's name.
 *   vertices: vertexLookup("kite"), // Shape of the body.
 *   scale: 9,                       // Size of the body.
 *   hpPoints: [                      
 *     {x:  0, y:  -1, value: 1}     // Locations (offsets from center of 
 *     {x:  3, y:  -1, value: 1}     // creautre), and values of HP dots
 *     {x:  6, y:  -1, value: 1}     // (0, 1, 2, or 3).
 *   ],
 *   maxHP: 1,                       // Max HP. If > creature may evolve.
 *   speed: 1,                       // Maximum speed.
 *   turnRate: 6,                    // Turn rate (*3 if player controlled).
 *   mouth: [],                      // Info about creatures mouth.
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
function getCreatureProperties(creature) {
  
  "use strict";
  
  switch (creature) {
       
    case "kite-xs":
      return {
        type: "kite-xs",
        vertices: vertexLookup("kite"),
        scale: 9,
        hpPoints: [
          {x:  0, y:  -1, value: 1}
        ],
        maxHP: 1,
        speed: 10,
        turnRate: 25,
        mouth: [],
        ai: {
          behaviour: "flee",
          viewDistance: 30
        }
      };
      
    case "kite-s":
      return {
        type: "kite-s",
        vertices: vertexLookup("kite"),
        scale: 9,
        hpPoints: [
          {x:  0, y:  -1, value: 1}
        ],
        maxHP: 1,
        speed: 12,
        turnRate: 30,
        mouth: [{
          vertices: vertexLookup("rightAngledTriangleMouth"),
          scale: 6,
          rotation: 45,
          offset: {x: 0, y: -16}
        }],
        ai: {
          behaviour: "aggressive",
          viewDistance: 30
        }
      };

    case "kite-m":
      return {
        type: "kite-m",
        vertices: vertexLookup("kite"),
        scale: 19,
        hpPoints: [
          {x: -7, y: -3, value: 1},
          {x:  7, y: -3, value: 1}
        ],
        maxHP: 4,
        speed: 20,
        turnRate: 35,
        mouth: [{
          vertices: vertexLookup("rightAngledTriangleMouth"),
          scale: 9,
          rotation: 45,
          offset: {x: 0, y: -30}
        }],
        ai: {
          behaviour: "aggressive",
          viewDistance: 30
        }
      };

    case "kite-l":
      return {
        type: "kite-l",
        vertices: vertexLookup("kite"),
        scale: 34,
        hpPoints: [
          {x: -21, y: - 6, value: 2},
          {x: - 8, y: -13, value: 2},
          {x: - 8, y:   2, value: 2},
          {x:  21, y: - 6, value: 2},
          {x:   8, y: -13, value: 2},
          {x:   8, y:   2, value: 2}
        ],
        // Starts with 6 from all the dots, then gets another 6,
        // Then it gets a boosty tail upgrade or something.
        // When it gets to 14, it'll "evolve" into a "kite-b"
        maxHP: 13,
        speed: 25,
        turnRate: 35,
        mouth: [{
          vertices: vertexLookup("rightAngledTriangleMouth"),
          scale: 11,
          rotation: 45,
          offset: {x: 0, y: -50}
        }],
        ai: {
          behaviour: "aggressive",
          viewDistance: 30
        }
      };

    // This is going to be the kite "boss" creature. It needs some
    // sort of special ability, but I dunno what yet.
    case "kite-b":
      return {
        type: "kite-b",
        vertices: vertexLookup("kite"),
        scale: 56,
        hpPoints: [
          {x: -21, y: - 6, value: 3},
          {x: - 8, y: -13, value: 3},
          {x: - 8, y:   2, value: 3},
          {x:  21, y: - 6, value: 3},
          {x:   8, y: -13, value: 3},
          {x:   8, y:   2, value: 3}
        ],
        // This creature can't evolve further, but it's max HP
        // should still be set so that the hpPoints don't
        // end up with an "undisplayably high" value.
        maxHP: 23,
        speed: 6
      };
      
    case "snake-s":
      return {
        type: "snake-s",
        vertices: vertexLookup("snake"),
        scale: 9,
        hpPoints: [
          {x:  0, y:  -1, value: 1}
        ],
        maxHP: 3,
        maxSpeed: 1
      };

    case "snake-m":
      return {
        type: "snake-m",
        vertices: vertexLookup("snake"),
        scale: 19,
        hpPoints: [
          {x: -7, y: -3, value: 1},
          {x:  7, y: -3, value: 1}
        ],
        // Starts with 2 HP.
        // When it gets a 3rd HP, it should grow a mouth! So the
        // total is 2 to start + 1 for the mouth + 2, = 5.
        // When it gets to 6, it'll "evolve" into a "kite-l".
        maxHP: 5,
        speed: 3
      };

    case "snake-l":
      return {
        type: "snake-l",
        vertices: vertexLookup("snake"),
        scale: 34,
        hpPoints: [
          {x: -21, y: - 6, value: 2},
          {x: - 8, y: -13, value: 2},
          {x: - 8, y:   2, value: 2},
          {x:  21, y: - 6, value: 2},
          {x:   8, y: -13, value: 2},
          {x:   8, y:   2, value: 2}
        ],
        // Starts with 6 from all the dots, then gets another 6,
        // Then it gets a boosty tail upgrade or something.
        // When it gets to 14, it'll "evolve" into a "kite-b"
        maxHP: 13,
        speed: 4
      };

    // This is going to be the kite "boss" creature. It needs some
    // sort of special ability, but I dunno what yet.
    case "snake-b":
      return {
        type: "snake-b",
        vertices: vertexLookup("snake"),
        scale: 56,
        hpPoints: [
          {x: -21, y: - 6, value: 3},
          {x: - 8, y: -13, value: 3},
          {x: - 8, y:   2, value: 3},
          {x:  21, y: - 6, value: 3},
          {x:   8, y: -13, value: 3},
          {x:   8, y:   2, value: 3}
        ],
        // This creature can't evolve further, but it's max HP
        // should still be set so that the hpPoints don't
        // end up with an "undisplayably high" value.
        maxHP: 23,
        speed: 6
      };

    // If no creature is found with the specified
    // name, just return a kite-s creature:
    default:
      return getCreatureProperties("kite-xs");

  }

}