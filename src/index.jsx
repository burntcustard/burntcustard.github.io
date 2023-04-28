import { useContext, useEffect } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import HTMLPage from './_includes/components/html-page';

function Index() {
  const { collections, data, pkg } = useContext(EleventyContext);

  return (
    <HTMLPage>
      <header>
        <h1 data-fadein-delay="300">{pkg.name}</h1>
      </header>

      <p data-fadein-delay="500">
        Hi! My name's John, aka burntcustard. I’m a senior front-end web developer at <a href="https://wearelighthouse.com/">Lighthouse London</a>, and a Computer Science (Games) graduate.
      </p>

      <p>
        <a
          href="https://twitter.com/burntcustard"
          rel="noreferrer"
          data-fadein-delay="500"
        >
          Twitter
        </a>
        {' '}
        <a
          href="mailto:burntcustard@gmail.com"
          rel="noreferrer"
          data-fadein-delay="300"
        >
          Email
        </a>
        {' '}
        <a
          href="https://github.com/burntcustard"
          rel="noreferrer"
          data-fadein-delay="300"
        >
          GitHub
        </a>
        {' '}
        <a
          href="https://codepen.io/burntcustard/"
          rel="noreferrer"
          data-fadein-delay="300"
        >
          CodePen
        </a>
      </p>
    </HTMLPage>
  )
}

export default Index;
