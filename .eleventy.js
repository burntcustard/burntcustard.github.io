const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
const eleventyReactSSRPlugin = require('eleventy-plugin-react-ssr');

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(eleventyReactSSRPlugin);

  eleventyConfig.addCollection(
    'posts',
    (collectionApi) => collectionApi.getFilteredByGlob('src/blog/*.md')
  );

  eleventyConfig.addCollection(
    'work',
    (collectionApi) => collectionApi.getFilteredByGlob('src/work/*.md')
  );

  return {
    dir: {
      input: 'src',
      output: 'dist',
    },
  };
};
