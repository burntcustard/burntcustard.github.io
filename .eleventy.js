const reactSSRPlugin = require('eleventy-plugin-react-ssr');

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(reactSSRPlugin);

  eleventyConfig.setBrowserSyncConfig({
    files: 'dist/assets/css/style.css',
  });

  eleventyConfig.addPassthroughCopy('assets/img');
  eleventyConfig.addPassthroughCopy('assets/js/main.js');
  eleventyConfig.addPassthroughCopy({'static': '/'});

  return {
    dir: {
      output: 'dist',
    },
  };
};
