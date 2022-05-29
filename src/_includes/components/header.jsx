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
        const isCurrentPostTypeRegex = new RegExp(`^${url}\/?`, 'i');
        const isCurrentPostType = isCurrentPostTypeRegex.test(page.url);

        return (
          <a
            href={url}
            aria-current={isCurrentPostType ? 'page' : null}
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
