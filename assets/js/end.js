if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const articles = document.querySelectorAll('article');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const screen = entry.target.querySelector('.screen') ?? entry.target.querySelector('div');
        screen.style.transform = screen.style.opacity = '';
      }
    });
  }, { threshold: .5, once: true });

  articles.forEach((article, index) => {
    const div = article.querySelector('.screen') ?? article.querySelector('div');
    const isScreen = div.className === 'screen';
    const isMobile = window.screen.width <= 500;
    const translateDirection = isScreen ? (isMobile ? 0 : Math.pow(-1, index)) : 1;
    div.style.transform = `translateX(${translateDirection * 200}px)`;
    div.style.opacity = '0';
  });

  articles.forEach((article, index) => {
    setTimeout(() => observer.observe(article), 300 + 300 * index)
  });
}
