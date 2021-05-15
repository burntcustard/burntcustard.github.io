const slot = require('./slot');

function slotMany(source, contents) {
  return Object.entries(contents).reduce((accumulator, current) => {
    const [tagName, replacement] = current;
    return slot(accumulator, tagName, replacement);
  }, source);
}

module.exports = slotMany;
