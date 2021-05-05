const path = require('path');
const postdate = require('./components/post-date');
const slot = require('./slot');

function addListings(content, files, dirname, listingTemplate) {
  const posts = files[dirname];
  let listingsContent = '';

  for (const [filename, postContent] of Object.entries(posts)) {
    let { date, title, excerpt } = postContent.attributes;
    let single = listingTemplate;
    const name = path.basename(filename, path.extname(filename));

    function makeTitle() {
      const h1Match = postContent.body.match(/(?<=<h1[^>]+>)([^<]+)(?=<\/h1>)/);
      return postContent.attributes.title || h1Match && h1Match[0] || name;
    }

    function makeExcerpt() {
      return `<p class="excerpt">${excerpt}</p>`;
    }

    if (date !== undefined) {
      single = single.replace(/<post-date\/?>/g, postdate(date));
    }

    if (title !== undefined) {
      single = single.replace(/<post-title\/?>/g, makeTitle());
    }

    if (excerpt !== undefined) {
      single = single.replace(/<post-excerpt\/?>/g, makeExcerpt());
    }

    single = single.replace(/<post-permalink\/?>/g, `/${dirname}/${name}`);

    // Add the listing to the listings... list
    listingsContent += single;
  }

  return slot(content, 'listings', listingsContent);
}

module.exports = addListings;
