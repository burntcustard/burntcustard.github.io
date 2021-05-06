/**
 * Remove a tag (because it has no content it's being replaced by)
 */
function removeEmptyTag(source, tagName) {
  const deleteTagRegex = new RegExp(`( *)<${tagName}\/?>\n?`, 'g');
  return source.replace(deleteTagRegex, '');
}

module.exports = removeEmptyTag;
