import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import HTMLPage from './_includes/components/html-page';
import Listing from './_includes/components/listing';

const Blog = () => {
  const { collections } = useContext(EleventyContext);

  return (
    <HTMLPage>
      <header>
        <h1>Blog</h1>
      </header>

      <section>
        {collections.posts.reverse().map(({ url, date, data }) => (
          <Listing
            date={date}
            excerpt={data.description}
            title={data.title}
            url={url}
            key={url}
          />
        ))}
      </section>
    </HTMLPage>
  );
};

export default Blog;
