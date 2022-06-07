import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';

const isCurrentPostType = (page, url) => {
  if (url === '/' && page.url !== '/') {
    return false;
  }

  return page.url.startsWith(url);
}

const navItems = [
  { title: 'Home', url: '/' },
  { title: 'Play', url: '/play/' },
  { title: 'Work', url: '/work/' },
  { title: 'Blog', url: '/blog/' },
];

const Header = () => {
  const { page, pkg } = useContext(EleventyContext);

  return (
    <header>
      <nav>
        {navItems.map(({ title, url }) => (
          <a
            href={url}
            className={title.toLowerCase()}
            aria-current={isCurrentPostType(page, url) ? 'page' : null}
            key={title}
          >
            {title === 'Home' ? pkg.name : title}
          </a>
        ))}
      </nav>
    </header>
  );
};

export default Header;
