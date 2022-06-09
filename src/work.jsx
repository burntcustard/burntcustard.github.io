import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import HTMLPage from './_includes/components/html-page';

const Article = ({ date, excerpt, title, url, img }) => (
  <article>
    <a href={url}><h3>{title}</h3></a>
    {img && (
      <img
      src={`/assets/img/${img}.png`}
      loading="lazy"
      />
    )}
    <p>{excerpt}</p>
  </article>
);

const Work = () => {
  const { collections } = useContext(EleventyContext);

  return (
    <HTMLPage>
      <header>
        <h1>My Work</h1>
      </header>

      <section>
        {collections.work.map(({ url, data }) => {
          console.log(data);
          return (
            <Article
              excerpt={data.description}
              title={data.title}
              img={data.page.fileSlug}
              url={url}
              key={url}
            />
          );
        })}
      </section>
    </HTMLPage>
  );
};

export default Work;
