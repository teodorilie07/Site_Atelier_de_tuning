// back-to-top.js - link-top e mereu vizibil (opacity 0.6 CSS), doar smooth scroll la click
(function() {
  const btn = document.getElementById('link-top') || document.getElementById('back-to-top');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    // Daca href e "#top", browserul va face jump implicit; forteaza smooth scroll consistent
    if (btn.getAttribute('href') && btn.getAttribute('href').startsWith('#')) {
      // Lasa default (smooth prin html { scroll-behavior: smooth; })
      return;
    }
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
