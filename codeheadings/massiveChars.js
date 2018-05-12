/**
 * Converts a string into a block of big characters.
 * @param   {string}   text
 * @returns {Array} 5 lines (first & last empty) of ASCII block chars.
 */
function getBigCharString(text) {
    
    var lines = ['', '', '', '', ''];

    for (let c = 0; c < text.length; c++) {
        switch (text.charAt(c).toUpperCase()) {
            case 'A':
                lines[1] += '  ▄▀▄  ';
                lines[2] += ' █ ▄ █ ';
                lines[3] += ' █   █ ';
                break;
            case 'B':
                lines[1] += ' █▀▀▄ ';
                lines[2] += ' █▀▀▄ ';
                lines[3] += ' █▄▄▀ ';
                break;
            case 'C':
                lines[1] += ' ▄▀▀ ';
                lines[2] += ' █   ';
                lines[3] += ' ▀▄▄ ';
                break;
            case 'D':
                lines[1] += ' █▀▀▄ ';
                lines[2] += ' █  █ ';
                lines[3] += ' █▄▄▀ ';
                break;
            case 'E':
                lines[1] += ' █▀▀ ';
                lines[2] += ' █▀▀ ';
                lines[3] += ' █▄▄ ';
                break;
            case 'F':
                lines[1] += ' █▀▀ ';
                lines[2] += ' █▄  ';
                lines[3] += ' █   ';
                break;
            case 'G':
                lines[1] += ' ▄▀▀  ';
                lines[2] += ' █ ▄▄ ';
                lines[3] += ' ▀▄▄▀ ';
                break;
            case 'H':
                lines[1] += ' █  █ ';
                lines[2] += ' █▀▀█ ';
                lines[3] += ' █  █ ';
                break;
            case 'I':
                lines[1] += ' ▀█▀ ';
                lines[2] += '  █  ';
                lines[3] += ' ▄█▄ ';
                break;
            case 'J':
                lines[1] += ' ▀▀█ ';
                lines[2] += '   █ ';
                lines[3] += ' ▄▄▀ ';
                break;
            case 'K':
                lines[1] += ' █  ▄ ';
                lines[2] += ' █▄▀  ';
                lines[3] += ' █ ▀▄ ';
                break;
            case 'L':
                lines[1] += ' █   ';
                lines[2] += ' █   ';
                lines[3] += ' █▄▄ ';
                break;
            case 'M':
                lines[1] += ' █▄ ▄█ ';
                lines[2] += ' █ ▀ █ ';
                lines[3] += ' █   █ ';
                break;
            case 'N':
                lines[1] += ' █▄  █ ';
                lines[2] += ' █ ▀▄█ ';
                lines[3] += ' █  ▀█ ';
                break;
            case 'O':
                lines[1] += ' ▄▀▀▄ ';
                lines[2] += ' █  █ ';
                lines[3] += ' ▀▄▄▀ ';
                break;
            case 'P':
                lines[1] += ' █▀▄ ';
                lines[2] += ' █▄▀ ';
                lines[3] += ' █   ';
                break;
            case 'Q':
                lines[1] += ' ▄▀▀▄ ';
                lines[2] += ' █  █ ';
                lines[3] += '  ▀█▄ ';
                break;
            case 'R':
                lines[1] += ' █▀▀▄ ';
                lines[2] += ' █▄▄▀ ';
                lines[3] += ' █  █ ';
                break;
            case 'S':
                lines[1] += ' ▄▀▀ ';
                lines[2] += ' ▀■▄ ';
                lines[3] += ' ▄▄▀ ';
                break;
            case 'T':
                lines[1] += ' ▀█▀ ';
                lines[2] += '  █  ';
                lines[3] += '  █  ';
                break;
            case 'U':
                lines[1] += ' █  █ ';
                lines[2] += ' █  █ ';
                lines[3] += ' ▀▄▄▀ ';
                break;
            case 'V':
                lines[1] += ' █   █ ';
                lines[2] += ' █   █ ';
                lines[3] += '  ▀▄▀  ';
                break;
            case 'W':
                lines[1] += ' █   █ ';
                lines[2] += ' █ █ █ ';
                lines[3] += '  █ █  ';
                break;
            case 'X':
                lines[1] += ' ▀▄ ▄▀ ';
                lines[2] += '   █   ';
                lines[3] += ' ▄▀ ▀▄ ';
                break;
            case 'Y':
                lines[1] += ' █   █ ';
                lines[2] += '  ▀▄▀  ';
                lines[3] += '   █   ';
                break;
            case 'Z':
                lines[1] += ' ▀▀▀█▀ ';
                lines[2] += '   █   ';
                lines[3] += ' ▄█▄▄▄ ';
                break;
            case '0':
                lines[1] += ' ▄▀▀▄ ';
                lines[2] += ' █  █ ';
                lines[3] += ' ▀▄▄▀ ';
                break;
            case '1':
                lines[1] += ' ▄█  ';
                lines[2] += '  █  ';
                lines[3] += ' ▄█▄ ';
                break;
            case '2':
                lines[1] += ' ▄▀▀▄ ';
                lines[2] += '   █  ';
                lines[3] += ' ▄█▄▄ ';
                break;
            case '3':
                lines[1] += ' ▄▀▀▄ ';
                lines[2] += '   █  ';
                lines[3] += ' ▀▄▄▀ ';
                break;
            case '4':
                lines[1] += ' ▄    ';
                lines[2] += ' █ ▄  ';
                lines[3] += ' ▀▀█▀ ';
                break;
            case '5':
                lines[1] += ' █▀▀▀ ';
                lines[2] += ' ▀▀▀█ ';
                lines[3] += ' ▄▄▄▀ ';
                break;
            case '6':
                lines[1] += ' ▄▀▀  ';
                lines[2] += ' █▀▀▄ ';
                lines[3] += ' ▀▄▄▀ ';
                break;
            case '7':
                lines[1] += ' ▀▀▀█ ';
                lines[2] += '   █  ';
                lines[3] += '  █   ';
                break;
            case '8':
                lines[1] += ' ▄▀▀▄ ';
                lines[2] += ' ▄▀▀▄ ';
                lines[3] += ' ▀▄▄▀ ';
                break;
            case '9':
                lines[1] += ' ▄▀▄ ';
                lines[2] += ' ▀▄█ ';
                lines[3] += '   █ ';
                break;
            case ' ':
                lines[1] += '   ';
                lines[2] += '   ';
                lines[3] += '   ';
                break;
            case '!':
                lines[1] += ' █ ';
                lines[2] += ' █ ';
                lines[3] += ' ▄ ';
                break;
            case '.':
                lines[1] += ' ';
                lines[2] += ' ';
                lines[3] += '▄';
                break;
            case '+':
                lines[1] += '     ';
                lines[2] += ' ▄█▄ ';
                lines[3] += '  ▀  ';
                break;
            case '-':
                lines[1] += '     ';
                lines[2] += ' ▄▄▄ ';
                lines[3] += '     ';
                break;
            case '*':
                lines[1] += '     ';
                lines[2] += ' ▀▄▀ ';
                lines[3] += ' ▀ ▀ ';
                break;
            case '/': if (text.charAt(c+1) !== '/') break;
                lines[1] += '  ▄  ';
                lines[2] += ' ▄▄▄ ';
                lines[3] += '  ▄  ';
                break;
            case '=':
                lines[1] += '     ';
                lines[2] += ' ▀▀▀ ';
                lines[3] += ' ▀▀▀ ';
                break;
            case '(':
                lines[1] += ' ▄▀ ';
                lines[2] += ' █  ';
                lines[3] += ' ▀▄ ';
                break;
            case ')':
                lines[1] += ' ▀▄ ';
                lines[2] += '  █ ';
                lines[3] += ' ▄▀ ';
                break;
            case '[':
                lines[1] += ' █▀ ';
                lines[2] += ' █  ';
                lines[3] += ' █▄ ';
                break;
            case ']':
                lines[1] += ' ▀█ ';
                lines[2] += '  █ ';
                lines[3] += ' ▄█ ';
                break;
            case '?':
                lines[1] += ' ▄▀▄ ';
                lines[2] += '  ▄▀ ';
                lines[3] += '  ▄  ';
                break;
            case '_':
                lines[1] += '     ';
                lines[2] += '     ';
                lines[3] += ' ▄▄▄ ';
                break;
            case '^':
                lines[1] += ' ▄▀▄ ';
                lines[2] += '     ';
                lines[3] += '     ';
                break;
        }
    }
    
    return lines;
}