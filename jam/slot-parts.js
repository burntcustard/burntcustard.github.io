const chalk = require('chalk');

/**
 * Slot or 'import' HTML files into other HTML files, respecting indentation.
 *
 * Use via:
 * <part src="filename-of-part"/> (no dir or extensions)
 * in HTML files. Self-closing HTML forward slash is optional.
 *
 * Parts CAN import other parts, but too much recursion could get slow.
 * @param  {[type]} html [description]
 * @return {[type]}      [description]
 */
function slotParts(html, parts) {
  const regex = /( *)(?:<part src=")([a-zA-Z./-]*)(?:"\/?>)/g;
  const replacer = (match, indent, filename) => {
    let filepath = `src/parts/${filename}.html`;

    if (!(filepath in parts)) {
      let error = `Failed to include part: ${filepath}`;
      console.error(chalk.red(error));
      return `<pre>${error}</pre>`;
    }

    let part = parts[filepath];

    if (part.includes('<part src="')) {
      part = slotParts(part, parts);
    }

    // Return the part, with the same indentation as the tag it's replacing
    return part.replace(/^/gm, indent);
  };

  return html.replace(regex, replacer);
}

module.exports = slotParts;
