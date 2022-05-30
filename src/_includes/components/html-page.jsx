import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import Head from './head';
import Header from './header';
import makeTitle from '../utils/makeTitle';

const HTMLPage = ({ children }) => {
  const { title, page, description } = useContext(EleventyContext);

  return (
    <html lang="en-gb">
      <Head
        title={makeTitle({ pageUrl: page.url, postTitle: title })}
        description={description}
      />

      <body>
        <Header pageUrl={page.url} />

        <main>
          {children}
        </main>
      </body>
    </html>
  );
};

export default HTMLPage;
