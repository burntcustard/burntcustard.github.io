import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import HTMLPage from './_includes/components/html-page';
import { existsSync } from 'node:fs';

const Article = ({ excerpt, site, source, title, img, index }) => (
  <article className="work-listing">
    <div>
      <h2>{title}</h2>
      { excerpt && (
        <p dangerouslySetInnerHTML={{ __html: excerpt }}/>
      )}
      { site && (
        <p dangerouslySetInnerHTML={{ __html: site }}/>
      )}
      { source && (
        <p dangerouslySetInnerHTML={{ __html: source }}/>
      )}
    </div>

    <div className="screen">
      <div>
        {img ? (
          <img
            src={img}
            loading={index ? "lazy" : null}
            width="640px"
            height="auto"
            alt={`Screenshot of ${title} website`}
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
        {collections.work.map(({ url, data }, index) => {
          const imgPath = `/assets/img/${data.page.fileSlug}.png`;

          return (
            <Article
              excerpt={data.description}
              title={data.title}
              img={existsSync(`.${imgPath}`) ? imgPath : null}
              url={url}
              key={url}
              site={data.site}
              source={data.source}
              index={index}
            />
          );
        })}
      </section>
    </HTMLPage>
  );
};

export default Work;
