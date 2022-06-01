const reactSSRPlugin = require('eleventy-plugin-react-ssr');

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(reactSSRPlugin);

  eleventyConfig.setBrowserSyncConfig({
    files: 'dist/assets/css/style.css',
  });

  return {
    dir: {
      output: 'dist',
    },
  };
};
