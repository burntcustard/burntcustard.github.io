const path = require('path');
const postdate = require('./components/post-date');
const slot = require('./slot');
const h1Regex = /(?<=<h1[^>]+>)([^<]+)(?=<\/h1>)/;
const excerptHtml = (excerpt) => `<p class="excerpt">${excerpt}</p>`;

function addListings(content, files, dirname, listingTemplate) {
  let listingsContent = '';

  for (const [filename, postContent] of Object.entries(files[dirname])) {
    const name = path.basename(filename, path.extname(filename));
    let single = listingTemplate;
    let {
      date,
      title = postContent.body.match(h1Regex)[0] || name,
      excerpt
    } = postContent.attributes;

    single = slot(single, 'post-date', date ? postdate(date) : '');
    single = slot(single, 'post-title', title);
    single = slot(single, 'post-excerpt', excerpt ? excerptHtml(excerpt) : '');
    single = slot(single, 'post-permalink', `/${dirname}/${name}`);

    listingsContent += single;
  }

  return slot(content, 'listings', listingsContent);
}

module.exports = addListings;
