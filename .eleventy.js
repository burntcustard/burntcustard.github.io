const reactSSRPlugin = require('eleventy-plugin-react-ssr');

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(reactSSRPlugin);

  return {
    dir: {
      input: 'src',
      output: 'dist',
    },
  };
};
