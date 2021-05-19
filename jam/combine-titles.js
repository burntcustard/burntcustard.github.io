function combineTitles(html, separator = ' - ') {
  // Used to get all the title elements from an HTML snippet
  const titleElementsRegex = /(<title>[^<]+<\/title>)/g;

  // Used to pull the title text out of a title tag
  const titleTextRegex = /(?:<title>)([^<]+)(?:<\/title)/;

  // Get all the title elements including <title> tags and indentation
  const titleElements = html.match(titleElementsRegex);

  // If there's no titles, or there's only one, don't modify
  if (!titleElements || titleElements.length === 1) {
    return html;
  }

  const titleTexts = [];

  for (let i = titleElements.length - 1; i >= 0; i--) {
    titleTexts.unshift(titleElements[i].match(titleTextRegex)[1]);

    // If the title element is the first, original, hopefully in <head>, one
    if (i === 0) {
      // Replace it with all the title tags combined
      let fullTitle = titleTexts.join(separator);
      html = html.replace(titleElements[i], `<title>${fullTitle}</title>`);
    } else {
      // Otherwise remove it!
      // Get the full title line, with indentation and newline at the end. Also
      // Include 0 or 1 single empty lines (can have spaces) after title line
      html = html.replace(new RegExp(` *${titleElements[i]}( *\\n)*`), '');
    }
  }

  return html;
}

module.exports = combineTitles;
