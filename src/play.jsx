import { useContext } from 'react';
import EleventyContext from 'eleventy-plugin-react-ssr/context';
import HTMLPage from './_includes/components/html-page';
import Listing from './_includes/components/listing';

const Play = () => {
  const items = [
    {
      title: '3DC5S',
      url: '/3dc5s',
      description: `A <a href="https://js13kgames.com/entries/3dc5s">Js13kGames entry</a>. 3DC5S or 'Three Dimensional Cascading Style Sheets Space Station Simulator' is a game where the only objective is to build a cool looking space station, by unlocking modules, managing resources, and sticking blocks together.`,
    },
    {
      title: '20461-dioretsa',
      url: '/20461-dioretsa',
      description: 'A <a href="https://js13kgames.com/entries/20461-dioretsa">Js13kGames entry</a>. Named after the damocloid, (and Asteroids… backwards) 20461 Dioretsa is a local multiplayer Asteroids-like.',
    },
    {
      title: 'Canvasnake',
      url: '/canvasnake',
      description: 'Created for an AI module at university, Canvasnake has machine-learning-based computer-controlled snakes, and local (same keyboard) multiplayer.',
    },
  ];

  return (
    <HTMLPage>
      <header>
        <h1>Play</h1>
        <p>A collection of little games that I've created myself, or helped out with.</p>
      </header>

      <section>
        {items.map(({ title, url, description }) => (
          <Listing
            excerpt={description}
            title={title}
            url={url}
            key={url}
          />
        ))}
      </section>
    </HTMLPage>
  );
};

export default Play;
