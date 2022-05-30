const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
const eleventyReactSSRPlugin = require('eleventy-plugin-react-ssr');

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(eleventyReactSSRPlugin);

  return {
    dir: {
      input: 'src',
      output: 'dist',
    },
  };
};
