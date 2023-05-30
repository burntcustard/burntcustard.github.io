import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import HTMLPage from './_includes/components/html-page';
import { existsSync } from 'node:fs';

const script = `
  const articles = document.querySelectorAll('article');

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const screen = entry.target.querySelector('.screen');
        screen.style.transform = '';
        screen.style.opacity = '';
      }
    });
  }, { threshold: 1.0, once: true });

  articles.forEach((article, index) => {
    const screen = article.querySelector('.screen');
    screen.style.transform = 'translateX(' + (index % 2 * -2 + 1) * 200 + 'px)';
    screen.style.opacity = '0';
  });

  setTimeout(() => articles.forEach(article => observer.observe(article)), 200);
`;

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

      <script dangerouslySetInnerHTML={{ __html: script }}/>
    </HTMLPage>
  );
};

export default Work;
