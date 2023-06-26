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

      <body className={page.url.split('/')[1] || 'home'}>
        <Header pageUrl={page.url} />

        <main>
          {children}
        </main>

        <script src="/assets/js/end.js" media="(prefers-reduced-motion: no-preference)"/>
      </body>
    </html>
  );
};

export default HTMLPage;
