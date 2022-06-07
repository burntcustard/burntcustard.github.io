const fancyBorderElements = document.querySelectorAll('.listing a, nav a');

fancyBorderElements.forEach((element) => {
  window.addEventListener('mousemove', ({ clientX, clientY }) => {
    const { x, y, width, height } = element.getBoundingClientRect();
    const dx = clientX - (x + .5 * width);
    const dy = clientY - (y + .5 * height);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    element.style.setProperty('--deg', `${angle + 90}deg`);
})});
