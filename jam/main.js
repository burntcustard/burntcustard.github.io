const path = require('path');
const markdown = require('marked');
const chalk = require('chalk');
const frontmatter = require('front-matter');
const addListings = require('./add-listings');
const combineTitles = require('./combine-titles');
const postdate = require('./components/post-date');
const setCurrentNav = require('./set-current-nav');
const slotParts = require('./slot-parts');
const slotMany = require('./slot-many');

function slotPostIntoTemplate(content, template) {
  const { date, title } = content.attributes;

  return slotMany(template, {
    'content': content.body,
    'post-date': date ? postdate(date) : '',
    'post-title': title,
  });
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
  const content = frontmatter(chunk.contents.toString());
  const dirname = path.basename(chunk.dirname);
  const filename = path.basename(chunk.basename);
  const templatePath = `src/${dirname}/template.html`;
  const listingPath = `src/${dirname}/listing.html`;

  if (path.extname(chunk.path) === '.md') {
    content.body = markdown(content.body, { smartypants: true });

    if (templatePath in files.templates) {
      content.body = slotPostIntoTemplate(content, files.templates[templatePath]);
    }
  }

  // Add the file to the files cache/map thingy
  if (/^_?index.html/.test(filename)) {
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
