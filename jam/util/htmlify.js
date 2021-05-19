const removeWrappingEmptyLines = (r) => r.replace(/^\n|\n\s*$/g, '');

function htmlify(str) {
  return removeWrappingEmptyLines(str);
}

module.exports = htmlify;
