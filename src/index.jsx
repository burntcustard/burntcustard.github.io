import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import HTMLPage from './_includes/components/html-page';

function Index() {
  const { collections, data } = useContext(EleventyContext);

  return (
    <HTMLPage>
      <h1>burnt.io</h1>

      <p>
        Hi! My name's John, aka burntcustard. I’m a front-end web developer at <a href="https://wearelighthouse.com/">Lighthouse London</a>, and a Computer Science (Games) graduate.
      </p>

      <p>
        <a href="https://twitter.com/burntcustard">Twitter</a>
        {' '}
        <a href="mailto:burntcustard@gmail.com">Email</a>
        {' '}
        <a href="burntcustard.github.com">GitHub</a>
      </p>
    </HTMLPage>
  )
}

export default Index;
