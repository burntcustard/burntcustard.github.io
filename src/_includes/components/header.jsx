import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';

const Header = () => {
  const { data, page } = useContext(EleventyContext);
  const navItems = [
    { title: 'Home', url: '/' },
    { title: 'Work', url: '/work' },
    { title: 'Blog', url: '/blog' },
  ];

  return (
    <header>
      {navItems.map(({ title, url }) => {
        const regex = new RegExp(`^${url}\/?$`, 'i');

        return (
          <a
            href={url}
            aria-current={regex.test(page.url) ? 'page' : null}
            key={title}
          >
            {title}
          </a>
        );
      })}
    </header>
  );
}

export default Header;
