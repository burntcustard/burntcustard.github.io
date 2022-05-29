import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import HTMLPage from './_includes/components/html-page';

function Index() {
  const { collections, data } = useContext(EleventyContext);

  return (
    <HTMLPage>
      <h1>Homepage</h1>
    </HTMLPage>
  )
}

export default Index;
