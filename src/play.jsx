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
      title: '🥇 js1024 Mirror Puzzle',
      url: '/js1024-mirror-puzzle',
      description: 'A 1023 byte puzzle game that uses your webcam as the image on the tiles. <a href="https://js1024.fun/results/2022">Winner of js1024 2022</a>.',
    },
    {
      title: 'js1024 Stacking Game',
      url: '/js1024-stacking-game',
      description: 'A 1024 byte box-stacking game. Click, tap, or press any key (except spacebar, that messes with scrolling) to freeze blocks in place and try to stack as many as you can! Made for <a href="https://js1024.fun">JS1024</a>.',
    },
    {
      title: 'SVG-hand-rewriter',
      url: '/svg-hand-rewriter',
      description: 'A little tool created to make hand-re-writing of SVGs a little easier for myself.',
    },
    {
      title: 'Canvasnake',
      url: '/canvasnake',
      description: 'Created for an AI module at university, Canvasnake has machine-learning-based computer-controlled snakes, and local (same keyboard) multiplayer.',
    },
    {
      title: 'Codeheadings',
      url: '/codeheadings',
      description: 'A long time ago, I wanted some fancy headings for my far-too-much-text-in-one-file JavaScript projects…',
    },
    {
      title: 'Hex Guess 0x400',
      url: 'https://js1024.fun/demos/2020/33',
      description: 'A 1020 byte hex-code colour guessing game made for <a href="https://js1024.fun">JS1024</a>.',
    },
    {
      title: 'The Short Dark',
      url: 'https://reece-bennett.github.io/the-short-dark/',
      description: 'A <a href="https://ldjam.com/">Ludum Dare</a> entry. A top-down demake of The Long Dark for Ludum Dare 50. Scavenge buildings for resources, run from wild animals, eat snacks, and don’t get too cold!',
    },
  ];

  return (
    <HTMLPage>
      <header>
        <h1>Play</h1>
        <p>A collection of little games, tools, and experiments that I created myself, or helped out with. Source code for most these is available on <a href="https://github.com/burntcustard">GitHub</a>.</p>
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
