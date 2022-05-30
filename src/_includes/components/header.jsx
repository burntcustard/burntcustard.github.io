import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';

const isCurrentPostType = (url) => {
  const { page } = useContext(EleventyContext);

  if (url === '/' && page.url !== '/') {
    return false;
  }

  return page.url.startsWith(url);
}

const navItems = [
  { title: 'Home', url: '/' },
  { title: 'Work', url: '/work/' },
  { title: 'Blog', url: '/blog/' },
];

const Header = () => (
  <header>
    {navItems.map(({ title, url }) => (
      <a
        href={url}
        aria-current={isCurrentPostType(url) ? 'page' : null}
        key={title}
      >
        {title}
      </a>
    ))}
  </header>
);

export default Header;
