const path = require('path');
const postdate = require('./components/post-date');
const slot = require('./slot');

function addListings(content, files, dirname, listingTemplate) {
  const posts = files[dirname];
  let listingsContent = '';

  for (const [filename, postContent] of Object.entries(posts)) {
    const name = path.basename(filename, path.extname(filename));
    let single = listingTemplate;
    let {
      date,
      title = postContent.body.match(/(?<=<h1[^>]+>)([^<]+)(?=<\/h1>)/)[0] || name,
      excerpt
    } = postContent.attributes;

    const excerptElement = () => `<p class="excerpt">${excerpt}</p>`;

    single = slot(single, 'post-date', date ? postdate(date) : null);
    single = slot(single, 'post-title', title);
    single = slot(single, 'post-excerpt', excerpt ? excerptElement() : null);
    single = slot(single, 'post-permalink', `/${dirname}/${name}`);

    listingsContent += single;
  }

  return slot(content, 'listings', listingsContent);
}

module.exports = addListings;
