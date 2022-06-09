const reactSSRPlugin = require('eleventy-plugin-react-ssr');

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(reactSSRPlugin);

  eleventyConfig.setBrowserSyncConfig({
    files: 'dist/assets/css/style.css',
  });

  eleventyConfig.addPassthroughCopy('assets/js/main.js', 'dist/assets/js');
  eleventyConfig.addPassthroughCopy('static', '/');

  return {
    dir: {
      output: 'dist',
    },
  };
};
