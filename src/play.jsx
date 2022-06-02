import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import HTMLPage from './_includes/components/html-page';

const Play = () => {
  const { collections } = useContext(EleventyContext);

  return (
    <HTMLPage>
      <h1>Play</h1>

      <section>
        Just a list of games I made?
      </section>
    </HTMLPage>
  );
};

export default Play;
