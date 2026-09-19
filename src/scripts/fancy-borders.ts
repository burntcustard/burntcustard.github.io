function applyFancyBorders() {
  const fancyBorderElements: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('article div > a, nav a');

  function setDegToMouse(element: HTMLAnchorElement, mx: number, my: number) {
    const { x, y, width, height } = element.getBoundingClientRect();
    const dx = mx - (x + width / 2);
    const dy = my - (y + height / 2);
    const deg = `${~~(Math.atan2(dy, dx) * 180 / Math.PI) + 90}deg`;
    // Set the --deg CSS var, rounded to int for inline-style neatness
    element.style.setProperty('--deg', deg);

    if (element.matches('nav a[href="/"]')) {
      sessionStorage.setItem('brandBorderDeg', deg);
    }
  }

  window.addEventListener('mousemove', ({ clientX, clientY }) => {
    sessionStorage.setItem('mPos', `${clientX} ${clientY}`);
    fancyBorderElements.forEach(e => setDegToMouse(e, clientX, clientY));
  });

  const mPos = sessionStorage.getItem('mPos')?.split(' ');

  if (mPos) {
    fancyBorderElements.forEach(e => setDegToMouse(
      e,
      Number(mPos[0]),
      Number(mPos[1]),
    ));
  }
}

if (window.matchMedia('(pointer: fine)').matches) applyFancyBorders();
