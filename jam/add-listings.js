const path = require('path');
const postdate = require('./components/post-date');
const slot = require('./slot');
const slotMany = require('./slot-many');
const parseH1 = require('./util/parse-h1');
const excerptHtml = (excerpt) => `<p class="excerpt">${excerpt}</p>`;

function addListings(content, files, dirname, listingTemplate) {
  let listingsContent = '';

  for (const [filename, postContent] of Object.entries(files[dirname])) {
    const name = path.basename(filename, path.extname(filename));
    const {
      date,
      title = parseH1(postContent.body) || name,
      excerpt,
    } = postContent.attributes;
    const single = slotMany(listingTemplate, {
      'post-date': date ? postdate(date) : '',
      'post-title': title,
      'post-excerpt': excerpt ? excerptHtml(excerpt) : '',
      'post-permalink': `/${dirname}/${name}`,
    })

    listingsContent += single;
  }

  return slot(content, 'listings', listingsContent);
}

module.exports = addListings;
