
function avg(arrayInput) {
  var total = 0;
  for(i = 0; i < 3; i++) { 
    total = total + arrayInput[i];
  }
  //console.log("Total: " + total + ". Average: " + total/3);
  return (total/3);
}

// Colour picking off a canvas based off http://stackoverflow.com/questions/26414770/getting-the-rgb-values-for-a-css-html-named-color-in-javascript

function getColorValues(colorText) {
  var canvas = document.createElement("canvas");
  canvas.id = "colorCanvas";
  canvas.width = 1;
  canvas.height = 1;
  ctx = canvas.getContext("2d");
  ctx.fillStyle = colorText;
  ctx.fillRect(0, 0, 1, 1);
  var colorValues = ctx.getImageData(0, 0, 1, 1).data
  return colorValues;
}

function getRGB(colorText) {
  var values = getColorValues(colorText);
  return ("rgb(" + values[0] + "," + values[1] + "," + values[2] + ")");
}

function toHex(dec) {
  var value = dec.toString(16);
  return (("00" + value.toUpperCase()).slice(-2));
}

function getHEX(colorText) {
  var values = getColorValues(colorText);
  return ("#" + toHex(values[0]) + toHex(values[1]) + toHex(values[2]));
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function addColor() {

  var colorText = document.getElementById("textInput").value;
  var newBox = document.createElement("div");
  var paraRGB = document.createElement("p");
  var paraHEX = document.createElement("p");
  var colorContainer = document.getElementById("container");
  
  newBox.className = 'colorBox ' + colorText;
  newBox.style.backgroundColor = colorText;
  
  if (newBox.style.backgroundColor) {

    //insertAfter(newBox, colorContainer.firstChild.nextSibling);
    
    colorContainer.firstChild.nextSibling.parentNode.insertBefore(newBox, colorContainer.firstChild.nextSibling.nextSibling);

    var rgbValue = getRGB(colorText);
    var hexValue = getHEX(colorText);

    console.log("rgb is " + rgbValue + " and le hex is " + hexValue);

    var node = document.createTextNode(rgbValue);
    paraRGB.appendChild(node);
    var node = document.createTextNode(hexValue);
    paraHEX.appendChild(node);    

    newBox.appendChild(paraRGB);
    newBox.appendChild(paraHEX);
    
    if (avg(getColorValues(colorText)) > 128) {
      newBox.style.color = "black";
    } else {
      newBox.style.color = "white";
    }

    console.log(newBox);
  } else{
    console.log("You dun fucked up")
  }
  
  document.getElementById("textInput").value = "";
  document.getElementById("textInput").focus();
  
  return false;
}

function keyDown() {
  setTimeout (function() {
    var currentText = document.getElementById("textInput").value;
    var plusButton = document.getElementById("plusButton");
    plusButton.style.backgroundColor = currentText;
    if (plusButton.style.backgroundColor.replace(/\s+/g, '') !== currentText.replace(/\s+/g, '') && plusButton.style.backgroundColor.replace(/\s+/g, '') !== getRGB(currentText)) {
      plusButton.style.backgroundColor = "grey";
    }
  }, 0);
  return;
}

//window.onload = function() { reset(); };

//window.onbeforeunload = function() { save(); };