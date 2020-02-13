
var textBox = document.getElementById('textBox'),
    textBoxStyle = window.getComputedStyle(textBox),
    oldText = '',
    c = 0,  // Character index within a message to be (or is being) printed.
    printing = false,
    fast,
    borderStyle,
    commentStyle,
    alt,

    startMessage = 'Enter text to convert to heading.\n'       +
                   'Use /help for help and options.\n\n',

    infoMessage = 'Information\n' +
                  '───────────\n' +
                  'codeHeadings was made by @burntcustard,\n'  +
                  'because he wanted some fancy headings\n'    +
                  'for his far-too-much-text-in-one-file\n'    +
                  'JavaScript projects, and most of the big\n' +
                  'text generators on the interwebs sucked.\n',

    helpMessage = 'Commands\n' +
                  '────────\n' +
                  '/help   : Show this message.\n'             +
                  '/clear  : Clear. Ctrl+a, del works too.\n'  +
                  '/comment: Comment style: // /* or #.\n'     +
                  '/border : Headings with borders.\n'         +
                  '/fast   : Toggle slow typing effect.\n'     +
                  '/alt    : Try this if output is wonky.\n'   +
                  '/max    : Resize screen to maximum size.\n' +
                  '/min    : Resize screen to minimum size.\n' +
                  '/color x: Recolor display with color x.\n'  +
                  '/reset  : Reset everything to default.\n'   +
                  '/info   : Information about codeHeadings.\n';



/**
 * Prints a message string to the virtual console charcter by character.
 * Use '\n' within the string for newlines.
 * @param {string} text       The message to print.
 * @param {boolean} paragraph Whether or not the message is a paragraph (surrounded by newlines).
 */
function printMessage(text, paragraph) {

    var timeout = (fast === true ? 1 : 10);

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

    if (paragraph) {
        text = '\n' + text + '\n';
    }

    printing = true;
    c = 0;
    // If box isn't empty, do a (another) newline:
    if (textBox.value) {
        textBox.value += '\n';
    }
    printNextChar(); // Start printing characters.
}



function convertText(text) {
    var lines = getBigCharString(text),
        codeHeading = '';

    if (borderStyle === 'single' || borderStyle === 'double') {
        // ┌──────┐
        lines[0] += ('┌');
        for (c = 0; c < lines[2].length + 2; c++) {
            lines[0] += ('─');
        }
        lines[0] += ('┐');

        // │ TEXT │
        lines[1] = ('│ ' + lines[1] + ' │');
        lines[2] = ('│ ' + lines[2] + ' │');
        lines[3] = ('│ ' + lines[3] + ' │');

        // └──────┘
        lines[4] += ('└');
        for (c = 0; c < lines[2].length - 2; c++) {
            lines[4] += ('─');
        }
        lines[4] += ('┘');
    }
    if (borderStyle === 'double') {
        lines = lines.map(line => line.replace(/┌/g, '╔')
                                      .replace(/┐/g, '╗')
                                      .replace(/─/g, '═')
                                      .replace(/│/g, '║')
                                      .replace(/└/g, '╚')
                                      .replace(/┘/g, '╝'));
    }

    lines = lines.filter(Boolean);  // Remove empty lines.

    switch (commentStyle) {
        case '/*':
            lines = lines.map(line => ' * ' + line);
            lines.unshift('/**');
            lines.push(' */');
            break;
        case '//':
            lines = lines.map(line => '// ' + line);
            break;
        case '#':
            lines = lines.map(line => '# ' + line);
    }

    // Stick together non-empty lines:
    lines.forEach(line => {
        if (line) {
            codeHeading += line + '\n';
        }
    });

    // Replace all spaces with "U+3000 - IDEOGRAPHIC SPACE - foo　bar".
    // This is to make the output spaces same width as the block chars.
    if (alt) {
        codeHeading = codeHeading.replace(/ /g, '　');
    }

    printMessage(codeHeading + '\n');
    c = 0;
    oldText = textBox.value; // So you can't input the output you just got.
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

    commentStyle = localStorage.commentStyle ? localStorage.commentStyle : 'none';
    borderStyle = localStorage.borderStyle ? localStorage.borderStyle : 'none';
    fast = (localStorage.fast === 'true' ? true : false);
    alt = (localStorage.alt === 'true' ? true : false);

    textBox.style.padding = '8px';
    textBox.style.minWidth = '444px';
    textBox.style.minHeight = '333px';
    textBox.style.width = localStorage.w || textBoxStyle.minWidth;
    textBox.style.height = localStorage.h || textBoxStyle.minHeight;
    textBox.style.opacity = 1;
    textBox.value = '';

    textBox.style.color = localStorage.color || '#33d011';
    textBox.style.textShadow = ('0px 0px 8px black, 0px 0px 8px' + localStorage.color) || ('0px 0px 8px black, 0px 0px 8px #33d011');

    textBox.focus();
    printMessage(startMessage);
    setTimeout(function () {
        removeTransitions();
    }, 2000);
}



function save() {
    localStorage.commentStyle = commentStyle;
    localStorage.borderStyle = borderStyle;
    localStorage.fast = JSON.stringify(fast);
    localStorage.alt = JSON.stringify(alt);
    localStorage.w = textBox.style.width;
    localStorage.h = textBox.style.height;
    localStorage.color = textBox.style.color;
}



function isNone(string) {
    if (typeof string !== 'string') {
        return false;
    }
    switch (string.toUpperCase()) {
        case 'NONE':
        case 'UNDEFINED':
        case 'RESET':
        case 'FALSE': return true;
        default: return false;
    }
}



function changeCommentStyle(style) {
    var newCommentStyle = '';
    switch (style) {
        case '//': newCommentStyle = '//'; break;
        case '/*': newCommentStyle = '/*'; break;
        case '#': newCommentStyle = '#'; break;
        default: if (isNone(style)) newCommentStyle = 'none';
    }
    if (newCommentStyle) {
        commentStyle = newCommentStyle;
        printMessage('Comment style: ' + commentStyle + '\n\n');
    } else {
        printMessage('Invalid style, use \'//\' \'/*\' \'#\' or \'none\'\n\n');
    }
}



function toggledSetting(setting, boolStr) {
    if (boolStr !== undefined) {
        if (boolStr === 'true') {
            return true;
        } else if (boolStr === 'false') {
            return false;
        } else {
            return setting;
        }
    } else {
        return !setting;
    }
}



function toggleFast(boolStr) {
    fast = toggledSetting(fast, boolStr);
    printMessage('Fast typing: ' + fast + '\n\n');
}



function toggleAlt(boolStr) {
    alt = toggledSetting(alt, boolStr);
    printMessage('Alternate spacing: ' + alt + '\n\n');
}



function toggleBorder(borderStr) {

    var borderStyles = ['none', 'single', 'double'],
        borderStyleIndex,
        newBorderStyle;

    switch (borderStr) {
        case 'single': newBorderStyle = 'single'; break;
        case 'double': newBorderStyle = 'double'; break;
        default: if (isNone(borderStr)) newBorderStyle = 'none';
    }

    if (!newBorderStyle) {
        borderStyleIndex = borderStyles.indexOf(borderStyle);
        if (++borderStyleIndex === borderStyles.length) {
            borderStyleIndex = 0;
        }
        newBorderStyle = borderStyles[borderStyleIndex];
    }

    borderStyle = newBorderStyle;
    printMessage('Bordered headings: ' + borderStyle + '\n\n');
}



function max() {
    textBox.style.width = textBoxStyle.maxWidth;
    textBox.style.height = textBoxStyle.maxHeight;
    printMessage('');
}



function min() {
    textBox.style.width = textBoxStyle.minWidth;
    textBox.style.height = textBoxStyle.minHeight;
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
        printMessage('Changed from ' + oldColor + ' → ' + colorInput.replace(/\s+/g, '') + '\n\n');
    } else {
        printMessage(
            'Color not changed.\n' +
            'Use HTML color names, hex, or RGB values.\n' +
            '\n'
        );
    }
}



function enter(text) {
    // handle help messages and stuff
    if (text.charAt(0) === '/') {

        // Command is the text input without the command symbol & before the 1st space character:
        var command = text.replace('/', '').split(' ');

        // Is the command one of these?
        switch (command[0].toUpperCase()) {
            case 'HELP':
                printMessage(helpMessage, true);
                break;
            case 'CLEAR':
                textBox.value = '';
                break;
            case 'COMMENT':
            case 'COMMENTS':
                if (command[1]) {
                    changeCommentStyle(command[1]);
                } else {
                    printMessage('Try "/comment" then: //, /*, #, or none\n\n');
                }
                break;
            case 'BORDER':
            case 'BORDERS':
                toggleBorder(command[1]);
                break;
            case 'FAST':
                toggleFast(command[1]);
                break;
            case 'ALT':
                toggleAlt(command[1]);
                break;
            case 'MAX':
                max();
                break;
            case 'MIN':
                min();
                break;
            case 'COLOR':
            case 'COLOUR':
                if (command[1]) {
                    color(command[1]);
                } else {
                    printMessage('Try "/color yellow" or "/color reset"\n\n');
                }
                break;
            case 'RESET':
                reset('all');
                break;
            case 'INFO':
                printMessage(infoMessage, true);
                break;
            default:
                printMessage('Unknown command. Enter /help for list.\n\n');
        }

        text.replace(command, '');
    }

    // Check if the text input is too long:
    if (text !== '' && text.charAt(0) !== '/') {
        if (text.length <= 16) {
            convertText(text);
        } else {
            printMessage('16 char max length exceeded, try again.\n');
        }
    }

    text = text.replace('/', '');
}



document.onkeypress = function (key) {
    if (printing) {
        key.preventDefault(); // Don't allow typing while printing.
    }
    if (key.which === 13 && !printing) {
        key.preventDefault(); // Don't actually go down a line.
        var text = textBox.value, // Text is all the text in text area.
            newText = text.replace(oldText, ''); // New text is all the text minus old text.
        newText = newText.replace(/(\r\n|\n|\r)/gm, ''); // Remove newlines.
        //newText = newText.replace(/[^A-Z a-z 0-9 # ( ) , -]+/g, ''); // Remove any useless chars.
        oldText = text;
        enter(newText);
    }
};



window.onload = function () {
    reset();
};



window.onbeforeunload = function () {
    save();
};
