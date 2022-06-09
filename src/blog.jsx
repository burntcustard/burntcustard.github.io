import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import HTMLPage from './_includes/components/html-page';

const Article = ({ date, excerpt, title, url }) => (
  <article className="listing">
    <a href={url}>
      <div>
        <h2>{title ?? 'Untitled'}</h2>
        <svg
          width="30px"
          height="30px"
          viewBox="0 0 10 10"
          aria-hidden="true"
        >
          <path fill="none" stroke="currentColor" d="M2 5l6 0M5 2l3 3 l-3 3"/>
        </svg>
      </div>
      <time>{date.toLocaleDateString()}</time>
    </a>
    <p>{excerpt}</p>
  </article>
);

const Blog = () => {
  const { collections } = useContext(EleventyContext);

  return (
    <HTMLPage>
      <h1>Blog</h1>

      <section>
        {collections.posts.map(({ url, date, data }) => (
          <Article
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
