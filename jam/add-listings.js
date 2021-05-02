const path = require('path');
const postdate = require('./postdate');

function slotListings(html, content) {
  const regex = /( *)(?:<listings\/?>)/g;
  const replacer = (match, indent) => {
    return content.replace(/^/gm, indent);
  };

  return html.replace(regex, replacer);
}

function addListings(content, files, dirname, listingTemplate) {
  const posts = files[dirname];
  let listingsContent = '';

  for (const [filename, postContent] of Object.entries(posts)) {
    let single = listingTemplate;
    const name = path.basename(filename, path.extname(filename));

    function title() {
      const h1Match = postContent.body.match(/(?<=<h1[^>]+>)([^<]+)(?=<\/h1>)/);
      return postContent.attributes.title || h1Match && h1Match[0] || name;
    }

    function excerpt() {
      return `<p class="excerpt">${postContent.attributes.excerpt || ''}</p>`;
    }

    // Add the listing to the listings... list
    listingsContent += single
      .replace(/<post-title\/?>/g, title())
      .replace(/<post-permalink\/?>/g, `/${dirname}/${name}`)
      .replace(/<post-date\/?>/g, postdate(postContent.attributes.date))
      .replace(/<post-excerpt\/?>/g, excerpt());;
  }

  // Return the content but with <listings/> replaced with listingsContent
  return slotListings(content, listingsContent);
}

module.exports = addListings;
