const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
const eleventyReactSSRPlugin = require('eleventy-plugin-react-ssr');

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(eleventyReactSSRPlugin);
  eleventyConfig.addCollection(
    'posts',
    (collectionApi) => collectionApi.getFilteredByGlob('src/blog/*.md')
  );

  return {
    dir: {
      input: 'src',
      output: 'dist',
    },
  };
};
