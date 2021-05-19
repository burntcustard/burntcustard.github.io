const removeEmptyTag = require('./remove-empty-tag');

/**
 * Return a new string, based off a source, with a <tagName> replaced by a
 * replacement, with correct indentation.
 * @param  {String} source      The source i.e. haystack i.e. original content
 * @param  {String} tagName     The <tag> that gets removed and replaced
 * @param  {String} replacement The string to replace the <tag> with
 * @return {String}
 */
function slot(source, tagName, replacement) {
  if (!replacement) {
    return removeEmptyTag(source, tagName);
  }

  const replaceIndentAndTagRegex = new RegExp(`( *)(?:<${tagName}/?>)`, 'g');

  const replacer = (match, tagIndent) => {
    const minIndentWidth = replacement
      .split('\n')
      .reduce((minIndentWidth, currentLine, i) => {
        const indentWidth = currentLine.search(/\S|$/);

        if (i === 0 || indentWidth < minIndentWidth) {
          return indentWidth;
        }

        return minIndentWidth;
      }, 0);

    const indentationRegex = new RegExp(`(?<=^)\\s{${minIndentWidth}}`, 'gm');

    return replacement.replace(indentationRegex, tagIndent);
  };

  return source.replace(replaceIndentAndTagRegex, replacer);
}

module.exports = slot;
