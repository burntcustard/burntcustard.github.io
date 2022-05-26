import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';

import Header from '../components/header';

function Post() {
  const { content, page, data } = useContext(EleventyContext);

  return (
    <html>
      <Header/>

      <div dangerouslySetInnerHTML={{ __html: content }} />
    </html>
  )
}

export default Post;
