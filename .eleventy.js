const reactSSRPlugin = require('eleventy-plugin-react-ssr');

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(reactSSRPlugin);

  eleventyConfig.setBrowserSyncConfig({
    files: 'dist/assets/css/style.css',
  });

  eleventyConfig.addPassthroughCopy('src/assets/js/main.js');

  return {
    dir: {
      output: 'dist',
    },
  };
};
