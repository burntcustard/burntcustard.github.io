function applyFancyBorders() {
  const fancyBorderElements = document.querySelectorAll('.listing div > a, nav a');

  function setDegToMouse(element, mx, my) {
    const { x, y, width, height } = element.getBoundingClientRect();
    const dx = mx - (x + width / 2);
    const dy = my - (y + height / 2);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    // Set the --deg CSS var, rounded to int for inline-style neatness
    element.style.setProperty('--deg', `${~~angle + 90}deg`);
  }

  window.addEventListener('mousemove', ({ clientX, clientY }) => {
    sessionStorage.setItem('mPos', `${clientX} ${clientY}`);
    fancyBorderElements.forEach(e => setDegToMouse(e, clientX, clientY));
  });

  const mPos = sessionStorage.getItem('mPos')?.split(' ');

  if (mPos) {
    fancyBorderElements.forEach(e => setDegToMouse(e, mPos[0], mPos[1]));
  }
}

if (window.matchMedia('(pointer: fine)').matches) applyFancyBorders();
