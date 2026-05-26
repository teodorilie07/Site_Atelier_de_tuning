
(function() {
  const form = document.getElementById('form-filtre');
  if (!form) return;

  const grid = document.getElementById('produse-grid');
  const contor = document.querySelector('[data-testid="contor-produse"]');

  // Update-range afisari
  form.querySelectorAll('input[type="range"]').forEach(r => {
    const target = document.getElementById(r.dataset.targetValue);
    r.addEventListener('input', () => { if (target) target.textContent = r.value; });
  });


  let timer;
  function doFetch() {
    const fd = new FormData(form);
    const params = new URLSearchParams();
    for (const [k, v] of fd.entries()) {
      if (v == null || v === '') continue;
      params.append(k, v);
    }
    params.set('pagina', '1');
    fetch('/catalog-json?' + params.toString())
      .then(r => r.json())
      .then(data => {
        if (contor) contor.textContent = data.total;
        renderProduse(data.produse);
      })
      .catch(err => console.error('fetch produse:', err));
  }
  function scheduleFetch() { clearTimeout(timer); timer = setTimeout(doFetch, 300); }

  form.querySelectorAll('[data-onchange-filter]').forEach(el => {
    el.addEventListener('change', scheduleFetch);
    if (el.type === 'text' || el.tagName === 'TEXTAREA') el.addEventListener('input', scheduleFetch);
    if (el.type === 'range') el.addEventListener('input', scheduleFetch);
  });


  document.getElementById('btn-reset')?.addEventListener('click', () => {
    if (!confirm('Resetează toate filtrele?')) return;
    window.location.href = '/produse';
  });

 
  document.getElementById('btn-calculeaza')?.addEventListener('click', () => {
    const div = document.getElementById('div-calcul-rezultat');
    const cards = grid.querySelectorAll('.product-card:not([style*="display: none"])');
    let suma = 0; let nr = 0; let hp = 0;
    cards.forEach(c => {
      const priceEl = c.querySelector('.card-price');
      if (!priceEl) return;
      const txt = priceEl.textContent.replace(/[^0-9.]/g, ' ').trim();
      const last = txt.split(/\s+/).pop();
      const v = parseFloat(last); if (!isNaN(v)) suma += v;
      const meta = c.querySelector('.card-meta');
      if (meta) { const m = meta.textContent.match(/\+(\d+)\s*CP/); if (m) hp += parseInt(m[1], 10); }
      nr++;
    });
    div.classList.remove('d-none');
    div.innerHTML = `<strong>${nr}</strong> produse afișate · Total: <strong>${suma.toFixed(2)} RON</strong> · CP total: <strong>+${hp}</strong>`;
    setTimeout(() => div.classList.add('d-none'), 5000);
  });


  function esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
 
  function renderProduse(list) {
    if (!list || !list.length) {
      grid.innerHTML = `<div class="alert alert-info text-center" data-testid="msg-fara-produse">
        <i class="bi bi-emoji-frown" style="font-size: 2rem;"></i>
        <h4 class="mt-2">Nu există produse care să corespundă filtrelor.</h4>
      </div>`;
      return;
    }
    const cards = list.map(p => cardHTML(p)).join('');
    grid.innerHTML = `<div class="row g-4">${cards}</div>`;
    document.dispatchEvent(new Event('produse-rerender'));
    grid.querySelectorAll('.carousel').forEach(carousel => {
      new bootstrap.Carousel(carousel);
    });
    rerunFeatureScripts();
  }
  function cardHTML(p) {
    const nou = p._este_nou ? `<span class="badge-tuning badge-nou" data-testid="badge-nou-${p.id}">NOU</span>` : '';
    const cheap = p._cheapest ? `<span class="badge-tuning badge-cheapest" data-testid="badge-cheapest-${p.id}">CEL MAI IEFTIN</span>` : '';
    const ofertaBadge = p._oferta ? `<span class="badge-tuning badge-oferta" data-testid="badge-oferta-${p.id}">-${p._oferta.discount}%</span>` : '';
    const oldPrice = p._oferta ? `<span class="old">${parseFloat(p._pret_vechi).toFixed(2)} RON</span>` : '';
    const timerEl = p._oferta ? `<span class="oferta-timer ms-2" data-expira="${p._oferta.expira_la}" data-testid="timer-oferta-${p.id}">00:00:00</span>` : '';

    const areImaginiExtra = Array.isArray(p.imagini_extra) && p.imagini_extra.length > 0;
    const carId = `carousel-prod-${p.id}-${Math.floor(Math.random() * 10000)}`;
    let mediaHTML = '';

    if (areImaginiExtra) {
      const extraItems = p.imagini_extra.map(img => `
        <div class="carousel-item h-100">
          <img src="${esc(img)}" class="d-block w-100 h-100" alt="${esc(p.nume)}" loading="lazy">
        </div>
      `).join('');

      mediaHTML = `
        <div id="${carId}" class="carousel slide h-100" data-bs-ride="carousel" data-testid="product-carousel-${p.id}">
          <div class="carousel-inner h-100">
            <div class="carousel-item active h-100">
              <img src="${esc(p.imagine)}" class="d-block w-100 h-100" alt="${esc(p.nume)}" loading="lazy">
            </div>
            ${extraItems}
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#${carId}" data-bs-slide="prev" onclick="event.preventDefault()">
            <span class="carousel-control-prev-icon"></span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#${carId}" data-bs-slide="next" onclick="event.preventDefault()">
            <span class="carousel-control-next-icon"></span>
          </button>
        </div>
      `;
    } else {
      mediaHTML = `<img src="${esc(p.imagine)}" alt="${esc(p.nume)}" loading="lazy">`;
    }

    return `<div class="col-md-6 col-xl-4"><div class="product-card card reveal" data-produs-id="${p.id}" data-testid="product-card-${p.id}">
      <div class="card-media">
        ${mediaHTML}
        <div class="badges-wrap">
          <div class="d-flex gap-1 flex-column align-items-start">${nou}${cheap}</div>
          ${ofertaBadge}
        </div>
      </div>
      <div class="card-body">
        <h3 class="card-title" data-testid="product-title-${p.id}"><a href="/produs/${p.id}" style="color:inherit; text-decoration:none;" data-testid="product-link-${p.id}">${esc(p.nume)}</a></h3>
        <div class="card-meta">
          <span><i class="bi bi-tag-fill"></i> ${esc(p.categorie)}</span>
          <span><i class="bi bi-hexagon-fill"></i> ${esc(p.material)}</span>
          ${p.putere_castigata_hp > 0 ? `<span style="color:var(--tuning-secondary);"><i class="bi bi-lightning-charge-fill"></i> +${p.putere_castigata_hp} CP</span>` : ''}
        </div>
        <div class="card-price" data-testid="product-price-${p.id}">${oldPrice} ${parseFloat(p._pret_afisat).toFixed(2)} RON ${timerEl}</div>
        <div class="d-flex gap-2 mt-2 flex-wrap">
          <a href="/produs/${p.id}" class="btn btn-sm btn-tuning" data-testid="product-view-${p.id}"><span>Detalii</span></a>
          <button class="btn btn-sm btn-outline-light btn-comparare-add" data-produs-id="${p.id}"
                  data-produs-nume="${esc(p.nume)}" data-produs-imagine="${esc(p.imagine)}"
                  data-testid="btn-comparare-add-${p.id}" title="Adaugă la comparare">
            <i class="bi bi-columns-gap"></i>
          </button>
          <button class="btn btn-sm btn-outline-secondary btn-sesiune-pastreaza" data-produs-id="${p.id}" data-testid="btn-pastreaza-${p.id}" title="Păstrează în sesiune"><i class="bi bi-bookmark-heart"></i></button>
          <button class="btn btn-sm btn-outline-warning btn-sesiune-ascunde" data-produs-id="${p.id}" data-testid="btn-ascunde-${p.id}" title="Ascunde din sesiune"><i class="bi bi-eye-slash"></i></button>
          <button class="btn btn-sm btn-outline-danger btn-sesiune-sterge" data-produs-id="${p.id}" data-testid="btn-sterge-${p.id}" title="Șterge din sesiune"><i class="bi bi-trash"></i></button>
        </div>
      </div>
    </div></div>`;
  }

  function rerunFeatureScripts() {
    ['/resurse/js/comparare.js', '/resurse/js/oferte.js', '/resurse/js/produs-sesiune.js'].forEach(src => {
      const s = document.createElement('script');
      s.src = src + '?t=' + Date.now();
      document.body.appendChild(s);
    });
  }
})();
