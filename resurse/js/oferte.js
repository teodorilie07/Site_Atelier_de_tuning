// oferte.js - Timer countdown HH:MM:SS + marcare ultimele 10s (Bonus 12)
(function() {
  const timers = document.querySelectorAll('.oferta-timer[data-expira]');
  if (!timers.length) return;

  function pad(n) { return String(n).padStart(2, '0'); }
  function format(ms) {
    if (ms <= 0) return '00:00:00';
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return pad(h) + ':' + pad(m) + ':' + pad(sec);
  }

  function tick() {
    const acum = Date.now();
    timers.forEach(t => {
      const expira = parseInt(t.dataset.expira, 10);
      const ramas = expira - acum;
      t.textContent = format(ramas);
      if (ramas <= 10000 && ramas > 0) t.classList.add('critical');
      else t.classList.remove('critical');
      if (ramas <= 0) t.textContent = 'EXPIRAT';
    });
  }
  tick();
  setInterval(tick, 1000);
})();
