
// Graphics settings. webGL is set to false automatically if
// displaying a webGL canvas fails, and then most of the other's aren't used.
// "high" is the value set to when fancy graphics are turned on, and "low is
// the value set to when fancy graphics are off (or when webGL fails to load)
// The "value" is the current setting.

var settings = {
  
  webGL: {
    desc: "Applies various webGL effects.",
    high: true,
    low : false,
    value: true
  },
  
  dusty: {
    desc: "How \"dusty\" the screen is.",
    high: 0.4,
    low : 0,
    value: 0.4
  },
  
  bulge:  {
    desc: "Curvature or \"bulgeness\" of the screen",
    high: 0.3,
    low : 0,
    value: 0.3
  },
  
  vFade: {
    desc: "Strength of vignette fade. 0 = No fade. 1 = Very dark around edges.",
    high: 0.3,
    low : 0,
    value: 0.3
  },
  
  vibrance: {
    desc: "Can be used to make the colors more vibrant.",
    high: 0,
    low : 0,
    value: 0
  },
  
  maxColor: {
    desc: "The max number of colors to display. If reached, all organisms go white.",
    high: 9,
    low : 6,
    value: 9
  },
  
  glowy: {
    desc: "If some objects e.g. as the map lines, have a colored glow / shadow.",
    high: true,
    low : false,
    value: true
  }
  
};