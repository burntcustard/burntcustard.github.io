import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import HTMLPage from './_includes/components/html-page';

function Index() {
  const { pkg } = useContext(EleventyContext);

  const socials = {
    'Twitter': 'https://x.com/burntcustard',
    'Bluesky': 'https://bsky.app/profile/burnt.io',
    'LinkedIn': 'https://www.linkedin.com/in/burntcustard/',
    'GitHub': 'https://github.com/burntcustard',
    'CodePen': 'https://codepen.io/burntcustard/',
  };

  return (
    <HTMLPage>
      <header>
        <h1>{pkg.name}</h1>
      </header>

      <p>
        Hi! My name&apos;s John, aka burntcustard. I&apos;m a <strong><abbr title="User Experience">UX</abbr></strong> and <strong>accessibility</strong> focused senior front-end web developer.
      </p>

      <p>
        I spent 5 years as the UX Engineer at <a href="https://wearelighthouse.com/">Lighthouse London</a>.
      </p>

      <p>
        <strong>I&apos;m currently looking for new projects</strong> - full time and freelance. You can see <a href="/john-evans-cv">my CV</a>, check out my previous <a href="/work">work</a>, or send an enquiry to <a href="mailto:john@burnt.io?subject=Enquiry">john@burnt.io</a>.
      </p>

      <p style={{ textWrap: 'balance' }}>
        {Object.entries(socials).map(([name, url], index) => (
          <>
            {index ? ' ' : ''}
            <a
              href={url}
              rel="noreferrer"
            >
              {name}
            </a>
          </>
        ))}
      </p>
    </HTMLPage>
  )
}

export default Index;
