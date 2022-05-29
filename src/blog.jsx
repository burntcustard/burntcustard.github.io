import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import HTMLPage from './_includes/components/html-page';

const Article = ({ date, excerpt, title, url }) => (
  <article>
    <h3><a href={url}>{title}</a></h3>
    <p>{excerpt}</p>
  </article>
);

const Index = () => {
  const { collections, data } = useContext(EleventyContext);

  return (
    <HTMLPage>
      <h1>Blog Archive V2?</h1>

      <section>
        {collections.posts.map(({ url, data }) => (
          <Article
            date={data.date}
            excerpt={data.description}
            title={data.title}
            url={url}
            key={data.title}
          />
        ))}
      </section>
    </HTMLPage>
  );
};

export default Index;
