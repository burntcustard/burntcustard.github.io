import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import HTMLPage from './_includes/components/html-page';

const Article = ({ date, excerpt, title, url }) => (
  <article>
    <a href={url}><h3>{title}</h3></a>
    <p>{excerpt}</p>
  </article>
);

const Work = () => {
  const { collections } = useContext(EleventyContext);

  return (
    <HTMLPage>
      <h1>Work Archive V2?</h1>

      <section>
        {collections.work.map(({ url, data }) => (
          <Article
            date={data.date}
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

export default Work;
