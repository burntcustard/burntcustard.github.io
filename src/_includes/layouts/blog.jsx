import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import HTMLPage from '../components/html-page';

const Post = () => {
  const { content, page, title, date } = useContext(EleventyContext);

  console.log(useContext(EleventyContext));

  return (
    <HTMLPage>
      <header>
        <h1>{title}</h1>
        {date && (
          <time>{date.toLocaleDateString()}</time>
        )}
      </header>

      <div dangerouslySetInnerHTML={{ __html: content }} />
    </HTMLPage>
  )
}

export default Post;
