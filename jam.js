const path = require('path');
const markdown = require('marked');
const chalk = require('chalk');
const frontmatter = require('front-matter');

/**
 * Slot or 'import' HTML files into other HTML files, respecting indentation.
 *
 * Use via:
 * <part src="filename-of-part"/> (no dir or extensions)
 * in HTML files. Self-closing HTML forward slash is optional.
 *
 * Parts CAN import other parts, but too much recursion could get slow.
 * @param  {[type]} html [description]
 * @return {[type]}      [description]
 */
function slotParts(html, parts) {
  const regex = /( *)(?:<part src=")([a-zA-Z./-]*)(?:"\/?>)/g;
  const replacer = (match, indent, filename) => {
    let filepath = `src/parts/${filename}.html`
    if (!(filepath in parts)) {
      let error = `Failed to include part: ${filepath}`;
      console.error(chalk.red(error));
      return `<pre>${error}</pre>`;
    }

    let part = parts[filepath];

    // Part importing recursion
    if (part.includes('<part src="')) {
      part = slotParts(part, parts);
    }

    // Return withe part, with the same indentation as the tag it's replacing
    return part.replace(/^/gm, indent);
  };

  return html.replace(regex, replacer);
}

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

function slotListings(html, content) {
  const regex = /( *)(?:<listings\/?>)/g;
  const replacer = (match, indent) => {
    return content.replace(/^/gm, indent);
  };

  return html.replace(regex, replacer);
}

function setCurrentNav(html, pagePath) {
  const filename = path.basename(pagePath, path.extname(pagePath));
  const dirname = path.basename(path.dirname(pagePath));

  if (dirname === 'pages' && filename === 'index') {
    return html.replace('href="/"', '$& aria-current="page"');
  }

  const regex = new RegExp(`href="\/(${filename}|${dirname})"`);
  return html.replace(regex, '$& aria-current="page"');
}

function combineTitles(html, separator = ' - ') {
  // Used to get all the title elements from an HTML snippet
  const titleElementsRegex = /(<title>[^<]+<\/title>)/g;

  // Used to pull the title text out of a title tag
  const titleTextRegex = /(?:<title>)([^<]+)(?:<\/title)/;

  // Get all the title elements including <title> tags and indentation
  const titleElements = html.match(titleElementsRegex);

  // If there's no titles, or there's only one, don't modify
  if (!titleElements || titleElements.length === 1) {
    return html;
  }

  const titleTexts = [];

  for (i = titleElements.length - 1; i >= 0; i--) {
    titleTexts.unshift(titleElements[i].match(titleTextRegex)[1]);

    // If the title element is the first, original, hopefully in <head>, one
    if (i === 0) {
      // Replace it with all the title tags combined
      let fullTitle = titleTexts.join(separator);
      html = html.replace(titleElements[i], `<title>${fullTitle}</title>`);
    } else {
      // Otherwise remove it!
      // Get the full title line, with indentation and newline at the end. Also
      // Include 0 or 1 single empty lines (can have spaces) after title line
      html = html.replace(new RegExp(` *${titleElements[i]}( *\\n)*`), '');
    }
  }

  return html;
}

function postdate(date) {
  const suffix = (n) => [,'st','nd','rd'][n/10%10^1&&n%10] || 'th';
  const customizeDate = (localeDate) => {
    return localeDate
      .toString()
      .split(' ')
      .map((segment, i) => i === 0 ? segment + suffix(segment) : segment)
      .join(' ')
  }

  return date ? (
    `<time datetime="${date.toISOString().split('T')[0]}">
      ${customizeDate(date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }))}
    </time>`
  ) : '';
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
