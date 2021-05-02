const path = require('path');
const markdown = require('marked');
const chalk = require('chalk');
const frontmatter = require('front-matter');
const addListings = require('./add-listings');
const combineTitles = require('./combine-titles');
const postdate = require('./postdate');
const setCurrentNav = require('./set-current-nav');
const slotParts = require('./slot-parts');

/**
 * Slot new HTML content into a main HTML string.
 * @param  {[type]} html    [description]
 * @param  {[type]} content [description]
 * @return {[type]}         [description]
 */
function slotContent(html, content) {
  const regex = /( *)(?:<content\/?>)/g;
  const replacer = (match, indent) => {
    return content.replace(/^/gm, indent);
  };

  return html.replace(regex, replacer);
}

/**
 * Named after jamstack, this does (or calls) all the fun part replacement,
 * markdown to HTML, slotting content into templates, etc.
 * @param  {[type]}   chunk     [description]
 * @param  {[type]}   encoding  [description]
 * @param  {Function} callback  [description]
 * @param  {[type]}   templates [description]
 * @return {[type]}             [description]
 */
module.exports = function (chunk, encoding, callback, files) {
  let content = frontmatter(chunk.contents.toString());
  let dirname = path.basename(chunk.dirname);
  let filename = path.basename(chunk.basename);

  // If the file is markdown
  if (path.extname(chunk.path) === '.md') {
    // Convert it to HTML
    content.body = markdown(content.body, { smartypants: true });

    // If it's in a folder with a template, slot the content in the template
    let templatePath = `src/${dirname}/template.html`;

    if (templatePath in files.templates) {
      content.body = slotContent(files.templates[templatePath], content.body);
      content.body = content.body.replace(/<post-date\/?>/g, postdate(content.attributes.date));
    }
  }

  // Add the file to the files cache/map thingy
  //console.log(remove_(filename));
  if (remove_(filename) === 'index.html') {
    let listingPath = `src/${dirname}/listing.html`;

    if (listingPath in files.listings) {
      content.body = addListings(
        content.body,
        files,
        dirname,
        files.listings[listingPath]
      );
    }
  } else {
    if (!files[dirname]) {
      files[dirname] = {};
    }
    files[dirname][remove_(filename)] = content;
  }

  content.body = slotParts(content.body, files.parts);
  content.body = setCurrentNav(content.body, chunk.path);
  content.body = combineTitles(content.body);

  chunk.contents = Buffer.from(content.body);
  callback(null, chunk);
}

function remove_(string) {
  return string.replace(/^_/, '').replace(/\/_/, '/');
}
