var width = 0,
    height = 0,
    imgWidth = 120,
    imgHeight = 120;

var force = d3.layout.force()
    .charge(-999)
    .linkDistance(120)
    .size([width, height])
    .linkDistance(function(d) {
      if (d.size) {
        if (d.size instanceof Array) {
          return (d.size[0] * 15);
        } else {
          return (d.size * 15);
        }
      } else {
        return 90; // Default length of a linking line is 90 pixels.
      }
    });

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("display", "block");

var defs = svg.append("defs");

  defs.append("pattern")
    .attr("id", "face")
    .attr('patternUnits', 'userSpaceOnUse')
    .attr("width", imgWidth)
    .attr("height", imgHeight)
    .attr("x", - imgWidth / 2)  // Center the image in the pattern.
    .attr("y", - imgHeight / 2)
    .append("image")
      .attr("xlink:href", "aboutMap/face.png")
      .attr("width", imgWidth)
      .attr("height", imgHeight);

window.onresize = resizeSVG;

function resizeSVG() {
  console.log("Resizing SVG");
  width = window.innerWidth;
  height = window.innerHeight;
  svg.attr("width", width)
     .attr("height", height);
  force.size([width, height]).resume();
}

window.onload = function() {
  resizeSVG(); 
}

d3.json("aboutMap/aboutMe.json", function(error, json) {
  if (error) throw error;

  force
      .nodes(json.nodes)
      .links(json.links)
      .start();

  var link = svg.selectAll(".link")
      .data(json.links)
    .enter().append("line")
      .attr("class", "links")
      .style("stroke", function(d) { return d.color })
      .style("stroke-width", function(d) {
        if (d.size) { 
          if (d.size instanceof Array) {
            return (d.size[1] / 2);
          } else {
            return (d.size / 2);
          }
        } // Else use that which is set in .links.
          // If none is set there either, then there are no visual links!
      });

  var node = svg.selectAll(".node")
    .data(json.nodes)
    .enter().append("g")
      .attr("class", "node")
      .call(force.drag);
  
  node.append("circle")
    .attr("class", "nodes")
    .attr("r", function(d) { return d.size || 10 })
    .style("fill", function(d) { return d.color });
  
  node.append("text")
    .attr("dx", 0)
    .attr("dy", ".35em")
    .attr("font-size", function(d) { return d.size * 2.2; })
    .text(function(d) { 
      //console.log(d.text);
      if (d.text instanceof Array) {
        return d.text[0]; 
      } else {
        return d.text;
      }
    });
  
  node.append("text")
    .attr("dx", 12)
    .attr("dy", "1.55em")
    .attr("font-size", function(d) { return d.size * 2.2; })
    .text(function(d) { if (d.text instanceof Array) { return d.text[1]; } });
  
  node.append("text")
    .attr("dx", 12)
    .attr("dy", "2.75em")
    .attr("font-size", function(d) { return d.size * 2.2; })
    .text(function(d) { if (d.text instanceof Array) { return d.text[2]; } });
  
  // Select just the first node, and give it an image 'n' stuff:
  svg.select(".node").select("circle")
    .attr("class", "centerNode")
    .style("fill", "url(#face)")
    //.style("filter", "url(#shadow)")
    .attr("r", imgHeight / 2)
    .attr("x", - imgWidth / 2)
    .attr("y", - imgHeight / 2)
    .attr("width", imgWidth)
    .attr("height", imgHeight);
  
  
  
  // Find icon nodes, remove their text, and give them icons:
  
  // Create array of text elements:
  var texts = d3.selectAll(".node").select("text");
  texts = texts[0];
  //console.log(texts)
  
  function createIcon(i, img) {

    // Add image:
    d3.select(texts[i].parentNode)
      .append("a")
        .attr("width", 64)
        .attr("height", 64)
        .attr("xlink:href", texts[i].textContent)
        .append("image")
          .attr("xlink:href", img)
          .attr("x", -32)
          .attr("y", -32)
          .attr("width", 64)
          .attr("height", 64);
    
    // Remove old dot and remove the link from appearing as text:
    d3.select(texts[i].parentNode).select("circle").remove();
    d3.select(texts[i].parentNode).select("text").text("");
    
  }
  
  for(var i = 0; i < texts.length; i++) {
    switch (true) {
      case (texts[i].textContent.indexOf("github") >= 0): 
        createIcon(i, "aboutMap/icons/github.png");
        break;
      case (texts[i].textContent.indexOf("facebook") >= 0): 
        createIcon(i, "aboutMap/icons/facebook.png");
        break;
      case (texts[i].textContent.indexOf("twitter") >= 0): 
        createIcon(i, "aboutMap/icons/twitter.png");
        break;
      case (texts[i].textContent.indexOf("codepen") >= 0): 
        createIcon(i, "aboutMap/icons/codepen.png");
        break;
    }
  }
  
  

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    // Align text label left or right:
    d3.selectAll("text").attr("dx", function(d) { 
        var parentX = d.x;
        if (parentX < (width / 2)) {
          return (- this.getBBox().width - 12);
        } else {
          return 12;
        }
      });

  });
});
