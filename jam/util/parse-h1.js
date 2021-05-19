function parseH1(content) {
  const match = content.match(/(?<=<h1[^>]+>)([^<]+)(?=<\/h1>)/);
  return match && match[0];
}

module.exports = parseH1;
