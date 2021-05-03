/**
 * Return a new string, based off a source, with a <tagName> replaced by a
 * replacement, with correct indentation.
 * @param  {String} source      The source i.e. haystack i.e. original content
 * @param  {String} tagName     The <tag> that gets removed and replaced
 * @param  {String} replacement The string to replace the <tag> with
 * @return {String}
 */
function slot(source, tagName, replacement) {
  const regex = new RegExp(`( *)(?:<${tagName}\/?>)`, 'g');
  const replacer = (match, indent) => {
    return replacement.replace(/^/gm, indent);
  };

  return source.replace(regex, replacer);
}

module.exports = slot;
