import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import HTMLPage from './_includes/components/html-page';
import { existsSync } from 'node:fs';

const Article = ({ excerpt, site, source, title, img, video, quote, index }) => (
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
      { quote && quote.text && (
        <figure>
          <blockquote>{quote.text}</blockquote>
          <figcaption>
            <div>{quote.author}</div>
            <cite>{quote.title}</cite>
          </figcaption>
        </figure>
      )}
    </div>

    <div className="screen">
      <div>
        { video ? (
          <div style={{ display: 'contents' }}>
            <span
              className="label"
              id={`video-${index}-label`}
            >
              {`Video scrolling through the ${title} website`}
            </span>
            <video
              src={video}
              loading={index ? "lazy" : null}
              width="640"
              height="auto"
              autoPlay={true}
              playsInline={true}
              disableRemotePlayback={true}
              loop={true}
              muted={true}
              aria-labelledby={`video-${index}-label`}
            />
          </div>
        ) : img ? (
          <img
            src={img}
            loading={index ? "lazy" : null}
            width="640"
            height="auto"
            alt={`Screenshot of the ${title} website`}
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
  const work = collections.work.sort((a, b) => {
    return (a.data.index ?? Infinity) - (b.data.index ?? Infinity);
  });

  return (
    <HTMLPage>
      <header>
        <h1>My Work</h1>

        <p>
          Websites I&apos;ve worked on - some as a full-stack developer, and some as a <strong><abbr title="User Experience">UX</abbr></strong>, <strong><abbr title="Cascading Style Sheets">CSS</abbr></strong>, or <strong><abbr title="accessibility">a11y</abbr></strong> specialist within a larger team.
        </p>

        <p>
          If you like what you see, please reach out to me via <a href="mailto:john@burnt.io">john@burnt.io</a>
        </p>
      </header>

      <section>
        {work.map(({ url, data }, index) => {
          const videoPath = `/assets/video/${data.page.fileSlug}.mp4`;
          const imgPath = `/assets/img/${data.page.fileSlug}.png`;

          return (
            <Article
              excerpt={data.description}
              title={data.title}
              img={existsSync(`.${imgPath}`) ? imgPath : null}
              video={existsSync(`.${videoPath}`) ? videoPath : null}
              url={url}
              key={url}
              site={data.site}
              source={data.source}
              quote={{text: data.quote, author: data.quoteAuthor, title: data.quoteTitle}}
              index={index}
            />
          );
        })}
      </section>
    </HTMLPage>
  );
};

export default Work;
