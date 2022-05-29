import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import HTMLPage from '../components/html-page';

function Post() {
  const { content, page, data } = useContext(EleventyContext);

  return (
    <HTMLPage>
      <h1>TEST</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </HTMLPage>
  )
}

export default Post;
