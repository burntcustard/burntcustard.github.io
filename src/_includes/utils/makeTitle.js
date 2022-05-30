const getPostType = (pageUrl) => {
  const splitUrl = pageUrl.split('/');

  if (['blog', 'work'].includes(splitUrl[1])) {
    return splitUrl[1].replace(/^./, s => s.toUpperCase());
  }
}

const makeTitle = ({ pageUrl, postTitle }) =>
  ['burnt.io', getPostType(pageUrl), postTitle].filter(Boolean).join(' - ');

export default makeTitle;
