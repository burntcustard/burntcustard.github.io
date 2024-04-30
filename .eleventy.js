const reactSSRPlugin = require('eleventy-plugin-react-ssr');
const anchorsPlugin = require('@orchidjs/eleventy-plugin-ids');

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(reactSSRPlugin);
  eleventyConfig.addPlugin(anchorsPlugin);

  eleventyConfig.setBrowserSyncConfig({
    files: [
      'dist/assets/css/style.css',
      'dist/assets/js/main.js',
    ],
  });

  eleventyConfig.addShortcode("codepen_js", () => {
    return `<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>`;
  });

  eleventyConfig.addShortcode("codepen", (url, config = '') => {
    const {
      height = 256,
      theme = 'dark',
      tabs = 'result',
      preview = false,
      editable = false,
    } = Object.fromEntries(config.split(';').map(c => c.split(':')));

    const [,,, user,, slug] = url.split('/');

    return `<p
      data-height="${height}"
      data-theme-id="${theme}"
      data-slug-hash="${slug}"
      data-default-tab="${tabs}"
      data-user="${user}"
      data-preview="${preview}"
      data-editable="${editable}"
      class="codepen"
      style="height:${height}px"
    >
      See the <a href="https://codepen.io/${user}/pen/${slug}/">demo on CodePen</a>
    </p>`;
  });

  eleventyConfig.addPassthroughCopy('assets/img');
  eleventyConfig.addPassthroughCopy('assets/video');
  eleventyConfig.addPassthroughCopy({'static': '/'});

  return {
    dir: {
      output: 'dist',
    },
  };
};
