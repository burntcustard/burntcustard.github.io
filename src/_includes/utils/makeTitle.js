import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';

const getPostType = (pageUrl) => {
  const splitUrl = pageUrl.split('/');

  if (['play', 'blog', 'work'].includes(splitUrl[1])) {
    return splitUrl[1].replace(/^./, s => s.toUpperCase());
  }
}

const combine = (titleParts) => titleParts.filter(Boolean).join(' - ');

const makeTitle = ({ pageUrl, postTitle }) => {
  const { pkg } = useContext(EleventyContext);

  return combine([pkg.name, getPostType(pageUrl), postTitle]);
}

export default makeTitle;
