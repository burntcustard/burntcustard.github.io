import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import Header from './header';

const HTMLPage = ({ children }) => {
  const { title, elevent, data, page } = useContext(EleventyContext);

  return (
    <html lang="en-gb">
      <head>
        <meta charSet="utf-8"/>
        <title>{title}</title>
      </head>

      <body>
        <Header pageUrl={page.url} data={data} />

        <main>
          {children}
        </main>
      </body>
    </html>
  );
}

export default HTMLPage;
