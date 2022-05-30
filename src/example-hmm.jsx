import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import HTMLPage from './_includes/components/html-page';

const Example = () => (
  <HTMLPage>
    <h1>Example top level page</h1>

    <section>
      test
    </section>
  </HTMLPage>
);

Example.data = {
  title: 'Example Hmmm',
  description: 'An example top level page',
};

export default Example;
