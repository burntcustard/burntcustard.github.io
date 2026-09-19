if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const targets = document.querySelectorAll<HTMLElement>([
    'main > header',
    'main > h1',
    'main > p',
    '.content > *',
    'article.listing > div',
    'article.work',
  ].join(','));
  const workTargets = Array.from(document.querySelectorAll('article.work'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLElement;
        target.style.transition = target.style.translate = target.style.opacity = '';
        observer.unobserve(target);
      }
    });
  }, { threshold: .1 });

  targets.forEach((target) => {
    const workIndex = workTargets.indexOf(target);
    const translateDirection = workIndex === -1 ? 1 : workIndex % 2 ? 1 : -1;
    target.style.translate = `${translateDirection * 200}px`;
    target.style.opacity = '0';
    target.style.transition = 'none';
  });

  // The initial hidden state is now represented by inline styles, so the
  // head-level fallback selector can be removed without a visible flash.
  delete document.documentElement.dataset.slideIn;

  targets.forEach((target, index) => {
    setTimeout(() => observer.observe(target), 300 + 150 * Math.min(index, 8))
  });
}
