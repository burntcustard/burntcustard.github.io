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
        <div>
          {[navItems.find(n => n.url === '/')].map(({ title, url }) => (
            <a
              href={url}
              className={title.toLowerCase()}
              aria-current={isCurrentPostType(page, url) ? 'page' : null}
              key={title}
            >
              {pkg.name}
            </a>
          ))}
        </div>

        <div>
          {navItems.filter(n => n.url !== '/').map(({ title, url }) => (
            <a
              href={url}
              className={title.toLowerCase()}
              aria-current={isCurrentPostType(page, url) ? 'page' : null}
              key={title}
            >
              {title}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
