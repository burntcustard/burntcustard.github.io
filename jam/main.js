const path = require('path');
const markdown = require('marked');
const chalk = require('chalk');
const frontmatter = require('front-matter');
const addListings = require('./add-listings');
const combineTitles = require('./combine-titles');
const postdate = require('./components/post-date');
const setCurrentNav = require('./set-current-nav');
const slotParts = require('./slot-parts');
const slot = require('./slot');

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
      content.body = slot(files.templates[templatePath], 'content', content.body);
      if (content.attributes.date) {
        content.body = content.body.replace(/<post-date\/?>/g, postdate(content.attributes.date));
      }
    }
  }

  // Add the file to the files cache/map thingy
  if (filename.replace(/^_/, '') === 'index.html') {
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
    files[dirname][filename.replace(/^_/, '')] = content;
  }

  content.body = slotParts(content.body, files.parts);
  content.body = setCurrentNav(content.body, chunk.path);
  content.body = combineTitles(content.body);

  chunk.contents = Buffer.from(content.body);
  callback(null, chunk);
}
