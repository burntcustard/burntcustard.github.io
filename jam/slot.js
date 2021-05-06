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

  const removeWrappingBlankLines = (r) => r.replace(/^\n|\n\s*$/g, '');

  replacement = removeWrappingBlankLines(replacement);

  const replacer = (match, indent) => {
    const minIndentation = replacement
      .split('\n')
      .reduce((acc, curr, i) => {
        const lineSpaceCharCount = curr.search(/\S|$/);
        if (i === 0 || lineSpaceCharCount < acc) {
          return lineSpaceCharCount;
        }
        return acc;
      }, 0);
    const indentationRegex = new RegExp(`(?<=^)\\s{${minIndentation}}`, 'gm');
    return replacement.replace(indentationRegex, indent);
  };

  const replaceIndentAndTagRegex = new RegExp(`( *)(?:<${tagName}\/?>)`, 'g');

  return source.replace(replaceIndentAndTagRegex, replacer);
}

module.exports = slot;
