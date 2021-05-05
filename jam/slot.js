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
    const regex = new RegExp(`( *)<${tagName}\/?>\n`, 'g');
    return source.replace(regex, '');
  }

  const indentAndTagRegex = new RegExp(`( *)(?:<${tagName}\/?>)`, 'g');

  // Remove blank lines at start and end of replacement
  replacement = replacement.replace(/^\n|\n\s*$/g, '');

  const replacer = (match, indent) => {
    const minIndentation = replacement
      .split('\n')
      .reduce((acc, curr, i) => {
        const lineSpaceCharCount = curr.search(/\S|$/);
        if (i === 0 || (0 < lineSpaceCharCount && lineSpaceCharCount < acc)) {
          return lineSpaceCharCount;
        }
        return acc;
      }, 0);
    const indentationRegex = new RegExp(`(?<=^)\\s{${minIndentation}}`, 'gm');
    return replacement.replace(indentationRegex, indent);
  };

  return source.replace(indentAndTagRegex, replacer);
}

module.exports = slot;
