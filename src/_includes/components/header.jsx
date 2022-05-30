import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';

const isCurrentPostType = (pageUrl, url) => {
  const isCurrentPostTypeRegex = new RegExp(`^${url}\/?`, 'i');
  return isCurrentPostTypeRegex.test(pageUrl);
}

const navItems = [
  { title: 'Home', url: '/' },
  { title: 'Work', url: '/work' },
  { title: 'Blog', url: '/blog' },
];

const Header = () => {
  const { page } = useContext(EleventyContext);

  return (
    <header>
      {navItems.map(({ title, url }) => (
          <a
            href={url}
            aria-current={isCurrentPostType(page.url, url) ? 'page' : null}
            key={title}
          >
            {title}
          </a>
      ))}
    </header>
  );
}

export default Header;
