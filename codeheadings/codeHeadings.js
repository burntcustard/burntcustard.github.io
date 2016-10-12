var textBox = document.getElementById('textBox'),
    oldText = '',
    c = 0,
    printing = false,
    fast,
    border,
    alt,

    startMessage = 'Enter text to convert to heading.\n'        +
                   'Use /help for help and options.\n'          +
                   '\n',

    webMessage   = '\n'                                         +
                   'Web browser support\n'                      +
                   '¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯\n'                      +
                   'codeHeadings supports most modern web\n'    +
                   'browsers on most OSs.\n'                    +
                   '\n'                                         +
                   'If output looks wonky (likely on mobile\n'  +
                   'devices), try /alt mode.\n'                 +
                   '\n'                                         +
                   'IE does not support textarea resizing, \n'  +
                   'so to change the size of the screen you\n'  +
                   'must use /min and /max commands.\n'         +
                   '\n',

    infoMessage   = '\n'                                         +
                   'Information\n'                              +
                   '¯¯¯¯¯¯¯¯¯¯¯\n'                              +
                   'codeHeadings was made by @burntcustard,\n'  +
                   'because he wanted some fancy headings for\n'+
                   'his far-too-much-text-in-one-file\n'        +
                   'JavaScript projects, and most of the big\n' +
                   'text generators on the interwebs sucked.\n' +
                   '\n',

    helpMessage   = '\n'                                        +
                   'Commands\n'                                 +
                   '¯¯¯¯¯¯¯¯\n'                                 +
                   '/help   : Show this message.\n'             +
                   '/clear  : Clear. Ctrl+a, del works too.\n'  +
                   '/border : Headings with borders.\n'         +
                   '/fast   : Toggle slow typing effect.\n'     +
                   '/alt    : Try this if output is wonky.\n'   +
                   '/max    : Resize screen to maximum size.\n' +
                   '/min    : Resize screen to minimum size.\n' +
                   '/color x: Recolor display with color x.\n'  +
                   '/reset  : Reset everything to default.\n'   +
                   '/web    : Web browser support info.\n'      +
                   '/info   : Information about codeHeadings.\n'+
                   '\n';

function printMessage(text) {

  var timeout = (fast === true ? 0 : 20);

  function printNextChar() {
    setTimeout(function () {
      textBox.value += text.charAt(c);
      c++;
      if (c < text.length && c < 999) {
        textBox.scrollTop = textBox.scrollHeight; // Scroll to bottom of textarea.
        printNextChar();
      } else {
        // Finished printing characters.
        textBox.scrollTop = textBox.scrollHeight; // Scroll to bottom of textarea.
        oldText = textBox.value;
        printing = false;
      }
    }, timeout);
  }

  printing = true;
  c = 0;
  if (textBox.value) { textBox.value += '\n'; } // If box isn't empty, do a newline.
  printNextChar(); // Start printing characters.
}

function convertText(text) {
  var line = ['', '', '', '', ''],
      codeHeading = '';

  for (c = 0; c < text.length; c++) {
    switch (text.charAt(c).toUpperCase()) {
      case 'A':
        line[1] += '  ▄▀▄  ';
        line[2] += ' █ ▄ █ ';
        line[3] += ' █   █ ';
      break;
      case 'B':
        line[1] += ' █▀▀▄ ';
        line[2] += ' █▀▀▄ ';
        line[3] += ' █▄▄▀ ';
      break;
      case 'C':
        line[1] += ' ▄▀▀ ';
        line[2] += ' █   ';
        line[3] += ' ▀▄▄ ';
      break;
      case 'D':
        line[1] += ' █▀▀▄ ';
        line[2] += ' █  █ ';
        line[3] += ' █▄▄▀ ';
      break;
      case 'E':
        line[1] += ' █▀▀ ';
        line[2] += ' █▀▀ ';
        line[3] += ' █▄▄ ';
      break;
      case 'F':
        line[1] += ' █▀▀ ';
        line[2] += ' █▄  ';
        line[3] += ' █   ';
      break;
      case 'G':
        line[1] += ' ▄▀▀  ';
        line[2] += ' █ ▄▄ ';
        line[3] += ' ▀▄▄▀ ';
      break;
      case 'H':
        line[1] += ' █  █ ';
        line[2] += ' █▀▀█ ';
        line[3] += ' █  █ ';
      break;
      case 'I':
        line[1] += ' ▀█▀ ';
        line[2] += '  █  ';
        line[3] += ' ▄█▄ ';
      break;
      case 'J':
        line[1] += ' ▀▀█ ';
        line[2] += '   █ ';
        line[3] += ' ▄▄▀ ';
      break;
      case 'K':
        line[1] += ' █  ▄ ';
        line[2] += ' █▄▀  ';
        line[3] += ' █ ▀▄ ';
      break;
      case 'L':
        line[1] += ' █   ';
        line[2] += ' █   ';
        line[3] += ' █▄▄ ';
      break;
      case 'M':
        line[1] += ' █▄ ▄█ ';
        line[2] += ' █ ▀ █ ';
        line[3] += ' █   █ ';
      break;
      case 'N':
        line[1] += ' █▄  █ ';
        line[2] += ' █ ▀▄█ ';
        line[3] += ' █  ▀█ ';
      break;
      case 'O':
        line[1] += ' ▄▀▀▄ ';
        line[2] += ' █  █ ';
        line[3] += ' ▀▄▄▀ ';
      break;
      case 'P':
        line[1] += ' █▀▄ ';
        line[2] += ' █▄▀ ';
        line[3] += ' █   ';
      break;
      case 'Q':
        line[1] += ' ▄▀▀▄ ';
        line[2] += ' █  █ ';
        line[3] += '  ▀█▄ ';
      break;
      case 'R':
        line[1] += ' █▀▀▄ ';
        line[2] += ' █▄▄▀ ';
        line[3] += ' █  █ ';
      break;
      case 'S':
        line[1] += ' ▄▀▀ ';
        line[2] += ' ▀■▄ ';
        line[3] += ' ▄▄▀ ';
      break;
      case 'T':
        line[1] += ' ▀█▀ ';
        line[2] += '  █  ';
        line[3] += '  █  ';
      break;
      case 'U':
        line[1] += ' █  █ ';
        line[2] += ' █  █ ';
        line[3] += ' ▀▄▄▀ ';
      break;
      case 'V':
        line[1] += ' █   █ ';
        line[2] += ' █   █ ';
        line[3] += '  ▀▄▀  ';
      break;
      case 'W':
        line[1] += ' █   █ ';
        line[2] += ' █ █ █ ';
        line[3] += '  █ █  ';
      break;
      case 'X':
        line[1] += ' █   █ ';
        line[2] += '  ▀▄▀  ';
        line[3] += ' ▄▀ ▀▄ ';
      break;
      case 'Y':
        line[1] += ' █   █ ';
        line[2] += '  ▀▄▀  ';
        line[3] += '   █   ';
      break;
      case 'Z':
        line[1] += ' ▀▀▀█▀ ';
        line[2] += '   █   ';
        line[3] += ' ▄█▄▄▄ ';
      break;
      case '0':
        line[1] += ' ▄▀▀▄ ';
        line[2] += ' █  █ ';
        line[3] += ' ▀▄▄▀ ';
      break;
      case '1':
        line[1] += ' ▄█  ';
        line[2] += '  █  ';
        line[3] += ' ▄█▄ ';
      break;
      case '2':
        line[1] += ' ▄▀▀▄ ';
        line[2] += '   █  ';
        line[3] += ' ▄█▄▄ ';
      break;
      case '3':
        line[1] += ' ▄▀▀▄ ';
        line[2] += '   █  ';
        line[3] += ' ▀▄▄▀ ';
      break;
      case '4':
        line[1] += ' ▄    ';
        line[2] += ' █ ▄  ';
        line[3] += ' ▀▀█▀ ';
      break;
      case '5':
        line[1] += ' █▀▀▀ ';
        line[2] += ' ▀▀▀█ ';
        line[3] += ' ▄▄▄▀ ';
      break;
      case '6':
        line[1] += ' ▄▀▀  ';
        line[2] += ' █▀▀▄ ';
        line[3] += ' ▀▄▄▀ ';
      break;
      case '7':
        line[1] += ' ▀▀▀█ ';
        line[2] += '   █  ';
        line[3] += '  █   ';
      break;
      case '8':
        line[1] += ' ▄▀▀▄ ';
        line[2] += ' ▄▀▀▄ ';
        line[3] += ' ▀▄▄▀ ';
      break;
      case '9':
        line[1] += ' ▄▀▄ ';
        line[2] += ' ▀▄█ ';
        line[3] += '   █ ';
      break;
      case ' ':
        line[1] += '     ';
        line[2] += '     ';
        line[3] += '     ';
      break;
    }
  }
  if (border === true)  {

    // ╔══════╗
    line[0] += ('╔');
    for (c = 0; c < line[2].length + 2; c++) {
      line[0] += ('═');
    }
    line[0] += ('╗');

    // ║ TEXT ║
    line[1] = ('║ ' + line[1] + ' ║');
    line[2] = ('║ ' + line[2] + ' ║');
    line[3] = ('║ ' + line[3] + ' ║');

    // ╚══════╝
    line[4] += ('╚');
    for (c = 0; c < line[2].length - 2; c++) {
      line[4] += ('═');
    }
    line[4] += ('╝');
  }

  // Stick together non-empty lines:
  for (var lineNo = 0; lineNo < line.length; lineNo++) {
    if (line[lineNo]) { codeHeading += line[lineNo] + '\n'; }
  }
  
  // Replace all of the spaces with "U+3000 - IDEOGRAPHIC SPACE - foo　bar".
  // This is to make the output spaces same width as the block chars.
  if (alt) { codeHeading = codeHeading.replace(/ /g, '　'); }

  printMessage(codeHeading);
  c = 0;
  oldText = textBox.value; // Makes it so you can't input the output you just got.
}

function removeTransitions() {
  textBox.classList.add('noTransitions');
  textBox.style.overflowY = 'auto';
  textBox.style.overflow = 'auto';
}

function reset(options) {
  if (options === 'all') {
    localStorage.clear();
  }
  
  border = (localStorage.border === 'true' ? true : false);
  fast = (localStorage.fast === 'true' ? true : false);
  alt = (localStorage.alt === 'true' ? true : false);
  
  textBox.style.padding = '8px';
  textBox.style.height = localStorage.h || '333px';
  textBox.style.width = localStorage.w || '444px';
  textBox.style.minHeight = '333px';
  textBox.style.minWidth = '444px';
  textBox.style.opacity = 1;
  textBox.value = '';
  
  textBox.style.color = localStorage.color || '#33d011';
  textBox.style.textShadow = ('0px 0px 8px black, 0px 0px 8px' + localStorage.color) || ('0px 0px 8px black, 0px 0px 8px #33d011');

  textBox.focus();
  printMessage(startMessage);
  setTimeout(function() { removeTransitions(); }, 2000);
}

function toggleFast() {
  fast = (fast !== true ? true : false);
  printMessage('Fast typing: ' + fast + '.\n\n');
}

function toggleAlt() {
  alt = (alt !== true ? true : false);
  printMessage('Alternate spacing: ' + alt + '.\n\n');
}

function save() {
  localStorage.border = JSON.stringify(border);
  localStorage.fast = JSON.stringify(fast);
  localStorage.alt = JSON.stringify(alt);
  localStorage.h = (textBox.style.height != 333 ? textBox.style.height : '333px');
  localStorage.w = (textBox.style.width != 444 ? textBox.style.width : '444px');
  localStorage.color = textBox.style.color;
}

function toggleBorder() {
  border = (border !== true ? true : false);
  printMessage('Bordered headings: ' + border + '.\n\n');
}

function max() {
  textBox.style.height = 'calc(100% - 40px)';
  textBox.style.width = 'calc(100% - 40px)';
  printMessage('');
}

function min() {
  textBox.style.height = '333px';
  textBox.style.width = '444px';
  printMessage('');
  textBox.scrollTop = textBox.scrollHeight; // Scroll to bottom of textarea.
}

function color(colorInput) {
  var newColor,
      oldColor = textBox.style.color;
  
  if (colorInput === 'reset' || colorInput === 'default') {
    colorInput = 'rgb(51, 208, 17)'; 
  }
  
  if (colorInput !== '') {
    textBox.style.color = (colorInput);
    textBox.style.textShadow = ('0px 0px 8px black, ' + '0px 0px 8px ' + colorInput);
    newColor = textBox.style.color;
  }
  if ((newColor !== oldColor) && (colorInput !== '')) {
    printMessage('Changed from ' + oldColor + ' to ' + colorInput.replace(/\s+/g,'') + '.\n\n');
  } else {
    printMessage(
      'Color not changed.\n' +
      'Use HTML color names, hex, or RGB values.\n' +
      '\n'
    )
  }
}

function enter(text) {
  // handle help messages and stuff
  if (text.charAt(0) === '-') {
    
    // Command name is the text input without the special command symbol:
    var command = text.replace('-','');
    
    // Is the command one of these (only check 1st 6 chars)?
    switch (command.substr(0,6).toUpperCase()) {
      case 'HELP'   : printMessage(helpMessage); break;
      case 'CLEAR'  : textBox.value = '';        break;
      case 'BORDER' : toggleBorder();            break;
      case 'FAST'   : toggleFast();              break;
      case 'ALT'    : toggleAlt();               break;
      case 'MAX'    : max();                     break;
      case 'MIN'    : min();                     break;
      case 'COLOR ' : color(command.slice(6));   break;
      case 'COLOR'  : printMessage('Try "/color yellow" or "/color reset"\n\n'); break;
      case 'RESET'  : reset('all');              break;
      case 'WEB'    : printMessage(webMessage);  break;
      case 'INFO'   : printMessage(infoMessage); break;
      default       : printMessage('Unknown command. Enter /help for list.\n\n');
    }
    
    text.replace(command, '');
  }
  
  // Check if the text input is too long:
  if (text !== '' && text.charAt(0) !== '-') {
    if (text.length <= 16) {
      convertText(text);
    } else {
      printMessage('16 char max length exceeded, try again.\n');
    }
  }
  
  text = text.replace('-','');
}

document.onkeypress = function (key) {
  if (printing) {
    key.preventDefault();                           // Don't allow typing while printing.
  }
  if (key.which === 13 && !printing) {
    key.preventDefault();                           // Don't actually go down a line.
    var text = textBox.value,                       // Text is all the text in text area.
        newText = text.replace(oldText, '');        // New text is all the text minus old text.
    newText = newText.replace(/(\r\n|\n|\r)/gm,''); // Remove newlines.
    newText = newText.replace('/', '-');            // Replace useful special chars with -.
    newText = newText.replace(/[^A-Z a-z 0-9 # ( ) , -]+/g,''); // Remove any useless chars.
    oldText = text;
    enter(newText);
  }
};

window.onload = function() { reset(); };

window.onbeforeunload = function() { save(); };