import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import HTMLPage from './_includes/components/html-page';
import { existsSync } from 'node:fs';

const Article = ({ date, excerpt, title, url, img }) => (
  <article className="work-listing">
    <div>
      <h2>{title}</h2>
      <p dangerouslySetInnerHTML={{ __html: excerpt }}/>
    </div>

      <div className="screen">
        <div className="screen__inner">
          {img ? (
            <img
              src={img}
              loading="lazy"
              width="640px"
              height="auto"
            />
          ) : (
            <small>Screenshot coming soon</small>
          )}
        </div>
      </div>
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
