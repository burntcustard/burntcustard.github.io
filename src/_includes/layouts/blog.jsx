import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import HTMLPage from '../components/html-page';

const Post = () => {
  const { content, title, date } = useContext(EleventyContext);

  return (
    <HTMLPage>
      <header>
        <h1>{title}</h1>
        {date && (
          <time>{date.toLocaleDateString()}</time>
        )}
      </header>

      <div className="content" dangerouslySetInnerHTML={{ __html: content }} />
    </HTMLPage>
  )
}

export default Post;
