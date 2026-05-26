// theme.js - Switch pentru 3 teme (Bonus 2)
(function() {
  const KEY = 'tuning-theme';
  const buttons = document.querySelectorAll('.theme-switch button[data-theme]');
  const html = document.documentElement;

  function apply(theme) {
    html.setAttribute('data-tuning-theme', theme);
    localStorage.setItem(KEY, theme);
    buttons.forEach(b => b.classList.toggle('active', b.dataset.theme === theme));
  }

  const current = localStorage.getItem(KEY) || 'light';
  apply(current);

  buttons.forEach(b => {
    b.addEventListener('click', () => apply(b.dataset.theme));
  });
})();
