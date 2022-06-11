import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import HTMLPage from './_includes/components/html-page';
import { existsSync } from 'node:fs';

const Article = ({ date, excerpt, title, url, img }) => (
  <article>
    <a href={url}><h3>{title}</h3></a>
    {img && (
      <div class="screen">
        <img
          src={img}
          loading="lazy"
        />
      </div>
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
          const imgPath = `/assets/img/${data.page.fileSlug}.png`;

          return (
            <Article
              excerpt={data.description}
              title={data.title}
              img={existsSync(`.${imgPath}`) ? imgPath : null}
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
