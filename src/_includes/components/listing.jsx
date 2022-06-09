const Listing = ({ date, excerpt, title, url }) => (
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

      {date && (
        <time>{date.toLocaleDateString()}</time>
      )}
    </a>

    {excerpt && (
      <p dangerouslySetInnerHTML={{ __html: excerpt }}/>
    )}
  </article>
);

export default Listing;
