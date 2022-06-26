import { useContext, useEffect } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import HTMLPage from './_includes/components/html-page';

function Index() {
  const { collections, data, pkg } = useContext(EleventyContext);

  const script = `
    let elements = [...document.querySelectorAll('h1, header + p, header + p + p a')];

    if (!localStorage.getItem('first')) {
      localStorage.setItem('first', true);
      elements.push(document.querySelector('nav'));
    }

    elements.forEach((item, i) => {
      item.style.opacity = 0;
      item.style.transition = 'opacity 500ms';
      setTimeout(() => {
        item.style.opacity = 1;
        setTimeout(() => item.style.transition = '', 400);
      }, i * 400 + 200);
    });
  `;

  return (
    <HTMLPage>
      <header>
        <h1>{pkg.name}</h1>
      </header>

      <p>
        Hi! My name's John, aka burntcustard. I’m a senior front-end web developer at <a href="https://wearelighthouse.com/">Lighthouse London</a>, and a Computer Science (Games) graduate.
      </p>

      <p>
        <a href="https://twitter.com/burntcustard">Twitter</a>
        {' '}
        <a href="mailto:burntcustard@gmail.com">Email</a>
        {' '}
        <a href="https://github.com/burntcustard">GitHub</a>
        {' '}
        <a href="https://codepen.io/burntcustard/">CodePen</a>
      </p>

      <script children={null} dangerouslySetInnerHTML={{ __html: script }}/>
    </HTMLPage>
  )
}

export default Index;
