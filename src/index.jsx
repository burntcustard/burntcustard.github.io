import { useContext, useEffect } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import HTMLPage from './_includes/components/html-page';

function Index() {
  const { collections, data, pkg } = useContext(EleventyContext);

  const script = `
    let elements = [...document.querySelectorAll('h1, header + p, header + p + p a')];

    if (!localStorage.getItem('first')) {
      localStorage.setItem('first', true);
      const nav = document.querySelector('nav');
      nav.dataset.fadeinDelay = 500;
      elements.push(nav);
    }

    let runningTotalDelay = 0;

    elements.forEach((element, i) => {
      runningTotalDelay += parseInt(element.dataset.fadeinDelay);
      element.style.opacity = 0;
      element.style.transition = 'opacity 500ms';

      setTimeout(() => {
        element.style.opacity = 1;
        setTimeout(() => element.style.transition = '', 400);
      }, runningTotalDelay);
    });
  `;

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
          data-fadein-delay="500"
        >
          Twitter
        </a>
        {' '}
        <a
          href="mailto:burntcustard@gmail.com"
          data-fadein-delay="300"
        >
          Email
        </a>
        {' '}
        <a
          href="https://github.com/burntcustard"
          data-fadein-delay="300"
        >
          GitHub
        </a>
        {' '}
        <a
          href="https://codepen.io/burntcustard/"
          data-fadein-delay="300"
        >
          CodePen
        </a>
      </p>

      <script children={null} dangerouslySetInnerHTML={{ __html: script }}/>
    </HTMLPage>
  )
}

export default Index;
