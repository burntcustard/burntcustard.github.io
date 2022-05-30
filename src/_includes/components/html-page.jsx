import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import Head from './head';
import Header from './header';

const HTMLPage = ({ children }) => {
  const { title, elevent, data, page } = useContext(EleventyContext);

  return (
    <html lang="en-gb">
      <Head title={title}/>

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
