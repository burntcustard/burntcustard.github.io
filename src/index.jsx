import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import HTMLPage from './_includes/components/html-page';

function Index() {
  const { collections, data, pkg } = useContext(EleventyContext);

  return (
    <HTMLPage>
      <h1>{pkg.name}</h1>

      <p>
        Hi! My name's John, aka burntcustard. I’m a front-end web developer at <a href="https://wearelighthouse.com/">Lighthouse London</a>, and a Computer Science (Games) graduate.
      </p>

      <p>
        <a href="https://twitter.com/burntcustard">Twitter</a>
        {' '}
        <a href="mailto:burntcustard@gmail.com">Email</a>
        {' '}
        <a href="https://github.com/burntcustard">GitHub</a>
      </p>
    </HTMLPage>
  )
}

export default Index;
