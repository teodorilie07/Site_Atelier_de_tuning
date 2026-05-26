// produs-sesiune.js - 3 butoane per produs cu sessionStorage (Bonus 6)
(function() {
  const KEY_ASC = 'tuning-ascuns';
  const KEY_STE = 'tuning-sters';
  const KEY_PAS = 'tuning-pastrat';

  function load(k) { try { return new Set(JSON.parse(sessionStorage.getItem(k)) || []); } catch { return new Set(); } }
  function save(k, s) { sessionStorage.setItem(k, JSON.stringify([...s])); }

  const asc = load(KEY_ASC);
  const ste = load(KEY_STE);
  const pas = load(KEY_PAS);

  function applyAll() {
    document.querySelectorAll('[data-produs-id]').forEach(card => {
      const id = parseInt(card.dataset.produsId, 10);
      if (!card.classList.contains('product-card')) return;
      if (ste.has(id)) card.style.display = 'none';
      else if (asc.has(id)) {
        card.style.opacity = '0.35';
        card.style.filter = 'grayscale(0.8)';
      } else if (pas.has(id)) {
        card.style.borderColor = 'var(--tuning-primary)';
        card.style.boxShadow = 'var(--tuning-shadow)';
      }
    });
  }

  document.querySelectorAll('.btn-sesiune-pastreaza').forEach(b => b.addEventListener('click', (e) => {
    e.preventDefault(); const id = parseInt(b.dataset.produsId, 10);
    if (pas.has(id)) pas.delete(id); else pas.add(id);
    save(KEY_PAS, pas); applyAll();
  }));
  document.querySelectorAll('.btn-sesiune-ascunde').forEach(b => b.addEventListener('click', (e) => {
    e.preventDefault(); const id = parseInt(b.dataset.produsId, 10);
    if (asc.has(id)) asc.delete(id); else asc.add(id);
    save(KEY_ASC, asc); applyAll();
  }));
  document.querySelectorAll('.btn-sesiune-sterge').forEach(b => b.addEventListener('click', (e) => {
    e.preventDefault(); const id = parseInt(b.dataset.produsId, 10);
    if (confirm('Șterge acest produs din sesiune?')) {
      ste.add(id); save(KEY_STE, ste); applyAll();
    }
  }));

  applyAll();
})();
