function applyFancyBorders() {
  const fancyBorderElements = [...document.querySelectorAll('.listing > a, nav a')];

  function setAngleToMouse(element, mx, my) {
    const { x, y, width, height } = element.getBoundingClientRect();
    const dx = mx - (x + width / 2);
    const dy = my - (y + height / 2);
    const angle = Math.atan2(dy, dx);
    element.style.setProperty('--rad', `${angle + 1.57}rad`);
  }

  window.addEventListener('mousemove', ({ clientX, clientY }) => {
    sessionStorage.setItem('mx', clientX);
    sessionStorage.setItem('my', clientY);
    fancyBorderElements.forEach(element => setAngleToMouse(element, clientX, clientY));
  });

  const mx = sessionStorage.getItem('mx');
  const my = sessionStorage.getItem('my');
  mx && my && fancyBorderElements.forEach(element => setAngleToMouse(element, mx, my));
}

const mouseQuery = window.matchMedia('(pointer: fine)');

if (mouseQuery.matches) applyFancyBorders();
