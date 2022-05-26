import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';

import Header from './_includes/components/header';

function Index() {
  const { collections, data } = useContext(EleventyContext);

  return (
    <html>
      <Header/>
    </html>
  )
}

export default Index;
