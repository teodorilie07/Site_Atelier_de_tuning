// Bonus 20 (date trimise din index)
(function() {
  const KEY = 'tuning-comparare';
  const tray = document.getElementById('comparison-tray'); // Containerul este numit 'comparison-tray' în structura HTML existentă
  const slot1 = document.getElementById('tray-slot-1');
  const slot2 = document.getElementById('tray-slot-2');
  const btnOpen = document.getElementById('btn-comparare');
  const btnReset = document.getElementById('btn-comparare-reset');


  if (!tray || !slot1 || !slot2 || !btnOpen || !btnReset) {
    console.warn('Elementele tăvii de comparare nu au fost găsite.');
    return;
  }

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  }
  function save(arr) { localStorage.setItem(KEY, JSON.stringify(arr)); }

  function render() {
    const arr = load();
    const allAddButtons = document.querySelectorAll('.btn-comparare-add');

  
    const isProductPage = ['/produse', '/produs'].some(p => window.location.pathname.startsWith(p));
    if (arr.length > 0 && isProductPage) {
      tray.classList.add('visible');
    } else {
      tray.classList.remove('visible');
    }

    [slot1, slot2].forEach((slot, i) => {
      slot.innerHTML = '';
      if (arr[i]) {
        const nameSpan = document.createElement('span');
        nameSpan.className = 'product-name';
        nameSpan.textContent = arr[i].nume;
        slot.appendChild(nameSpan);

        const btn = document.createElement('button');
        btn.className = 'remove-x';
        btn.innerHTML = '&times;';
        btn.title = 'Elimină produsul';
        btn.setAttribute('data-testid', 'tray-remove-' + arr[i].id);
        btn.addEventListener('click', () => {
          const cur = load(); cur.splice(i, 1); save(cur); render();
        });
        slot.appendChild(btn);
      } else {
        const placeholder = document.createElement('span');
        placeholder.className = 'placeholder-text';
        placeholder.textContent = 'Adaugă produs...';
        slot.appendChild(placeholder);
      }
    });

    // Dezactivează butoanele "compară" și afișează tooltip când lista e plină
    if (arr.length >= 2) {
      allAddButtons.forEach(btn => {
        btn.disabled = true;
        btn.title = 'Ștergeți un produs din lista de comparare';
      });
      btnOpen.disabled = false;
      btnOpen.textContent = 'Afișează';
    } else {
      allAddButtons.forEach(btn => {
        const btnId = parseInt(btn.dataset.produsId, 10);
        if (arr.some(p => p.id === btnId)) {
          btn.disabled = true;
          btn.title = 'Produsul este deja în lista de comparare.';
        } else {
          btn.disabled = false;
          btn.title = 'Adaugă la comparare';
        }
      });
      btnOpen.disabled = true;
      btnOpen.textContent = 'Afișează';
    }
  }

  document.querySelectorAll('.btn-comparare-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const cur = load();
      if (cur.length >= 2) return; 

      const id = parseInt(btn.dataset.produsId, 10);
      if (cur.some(x => x.id === id)) return;

      const nume = btn.dataset.produsNume;
      const imagine = btn.dataset.produsImagine;
      cur.push({ id, nume, imagine });
      save(cur);
      render();
    });
  });


  // Atașează evenimentele pe butoanele persistente ale tăvii o singură dată
  if (btnOpen && !btnOpen.dataset.listenerAttached) {
    btnOpen.addEventListener('click', () => {
      const arr = load();
      if (arr.length !== 2) return;
      const url = '/comparare?ids=' + arr.map(x => x.id).join(',');
      window.open(url, '_blank', 'width=1200,height=800');
    });
    btnOpen.dataset.listenerAttached = 'true';
  }

  if (btnReset && !btnReset.dataset.listenerAttached) {
    btnReset.addEventListener('click', () => {
      if (confirm('Golește lista de comparare?')) { save([]); render(); }
    });
    btnReset.dataset.listenerAttached = 'true';
  }

  render();
})();
