const path = require('path');

function setCurrentNav(html, pagePath) {
  const filename = path.basename(pagePath, path.extname(pagePath));
  const dirname = path.basename(path.dirname(pagePath));

  if (dirname === 'pages' && filename === 'index') {
    return html.replace('href="/"', '$& aria-current="page"');
  }

  const regex = new RegExp(`href="\/(${filename}|${dirname})"`);
  return html.replace(regex, '$& aria-current="page"');
}

module.exports = setCurrentNav;
