const reactSSRPlugin = require('eleventy-plugin-react-ssr');
const anchorsPlugin = require('@orchidjs/eleventy-plugin-ids');
const codepenEmbed = require('@kevingimbel/eleventy-plugin-codepen');

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(reactSSRPlugin);
  eleventyConfig.addPlugin(anchorsPlugin);
  eleventyConfig.addPlugin(codepenEmbed);

  eleventyConfig.setBrowserSyncConfig({
    files: [
      'dist/assets/css/style.css',
      'dist/assets/js/main.js',
    ],
  });

  eleventyConfig.addPassthroughCopy('assets/img');
  eleventyConfig.addPassthroughCopy({'static': '/'});

  return {
    dir: {
      output: 'dist',
    },
  };
};
