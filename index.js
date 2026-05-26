
require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const sass = require('sass');
const chokidar = require('chokidar');
const { pool, query } = require('./db/connection');
const { ensureSchema } = require('./db/bootstrap');

const app = express();


global.folderScss = path.join(__dirname, 'resurse', 'scss');
global.folderCss  = path.join(__dirname, 'resurse', 'css');
global.folderBackup = path.join(__dirname, 'backup');
global.folderBackupCss = path.join(__dirname, 'backup', 'resurse', 'css');
global.folderTemp = path.join(__dirname, 'temp');
global.folderImagini = path.join(__dirname, 'resurse', 'imagini');

// Foldere create automat la pornire
[global.folderCss, global.folderTemp, global.folderBackup, global.folderBackupCss, global.folderImagini].forEach(f => {
  if (!fs.existsSync(f)) fs.mkdirSync(f, { recursive: true });
});


function compileazaScss(caleScss, caleCss) {
  try {
    // Rezolvare cai absolute vs relative
    const scssAbsolut = path.isAbsolute(caleScss) ? caleScss : path.join(global.folderScss, caleScss);
    if (!fs.existsSync(scssAbsolut)) {
      console.error(`[SCSS] Fisier lipsa: ${scssAbsolut}`);
      return;
    }
    let cssAbsolut;
    if (!caleCss) {
      const numeFara = path.basename(scssAbsolut, path.extname(scssAbsolut));
      cssAbsolut = path.join(global.folderCss, numeFara + '.css');
    } else {
      cssAbsolut = path.isAbsolute(caleCss) ? caleCss : path.join(global.folderCss, caleCss);
    }

    // Backup fisier css vechi
    if (fs.existsSync(cssAbsolut)) {
      const dirBackup = global.folderBackupCss;
      if (!fs.existsSync(dirBackup)) fs.mkdirSync(dirBackup, { recursive: true });
      const numeCss = path.basename(cssAbsolut);
      const stamp = new Date().toISOString().replace(/[:.]/g, '-');
      const dest = path.join(dirBackup, `${stamp}_${numeCss}`);
      try {
        fs.copyFileSync(cssAbsolut, dest);
      } catch (errBackup) {
        console.error(`[SCSS] Backup esec pentru ${cssAbsolut}: ${errBackup.message}`);
      }
    }

    // Compilare
    const rezultat = sass.compile(scssAbsolut, {
      style: 'expanded',
      loadPaths: [path.join(__dirname, 'node_modules')],
    });
    const dirDest = path.dirname(cssAbsolut);
    if (!fs.existsSync(dirDest)) fs.mkdirSync(dirDest, { recursive: true });
    fs.writeFileSync(cssAbsolut, rezultat.css);
    console.log(`[SCSS] Compilat: ${path.basename(scssAbsolut)} -> ${path.relative(__dirname, cssAbsolut)}`);
  } catch (err) {
    console.error(`[SCSS] Eroare la compilarea ${caleScss}: ${err.message}`);
  }
}


function compileazaInitial() {
  const fisiere = fs.readdirSync(global.folderScss).filter(f => f.endsWith('.scss') && !f.startsWith('_'));
  fisiere.forEach(f => compileazaScss(f));
}
compileazaInitial();


chokidar.watch(global.folderScss, { ignoreInitial: true }).on('all', (event, file) => {
  if (['add', 'change'].includes(event) && file.endsWith('.scss') && !path.basename(file).startsWith('_')) {
    console.log(`[Watcher] ${event}: ${path.basename(file)}`);
    compileazaScss(file);
  }
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('view cache', false);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Fisiere statice
app.use('/resurse', express.static(path.join(__dirname, 'resurse')));


const CALE_OFERTE = path.join(__dirname, 'oferte.json');
const T_GENERARE_MS  = 2 * 60 * 1000;   // 2 min - genereaza oferte noi
const T2_CLEANUP_MS  = 5 * 60 * 1000;   // 5 min - cleanup oferte expirate
const DURATA_OFERTA  = 4 * 60 * 1000;   // 4 min durata (garanteaza overlap cu T=2min)

function citesteOferte() {
  try { return JSON.parse(fs.readFileSync(CALE_OFERTE, 'utf-8')); }
  catch { return []; }
}
function scrieOferte(list) { fs.writeFileSync(CALE_OFERTE, JSON.stringify(list, null, 2)); }

async function genereazaOferte() {
  try {
    const r = await query('SELECT id, pret FROM produse ORDER BY RANDOM() LIMIT 4');
    const acum = Date.now();
    const oferte = citesteOferte();
    r.rows.forEach(p => {
      if (oferte.some(o => o.id_produs === p.id && o.expira_la > acum)) return;
      const discount = 10 + Math.floor(Math.random() * 25); // 10-35%
      const pretVechi = parseFloat(p.pret);
      const pretNou = +(pretVechi * (1 - discount / 100)).toFixed(2);
      oferte.push({
        id_produs: p.id,
        pret_vechi: pretVechi,
        pret_nou: pretNou,
        discount,
        creata_la: acum,
        expira_la: acum + DURATA_OFERTA,
      });
    });
    scrieOferte(oferte);
    console.log(`[Oferte] generate ${r.rows.length} oferte flash`);
  } catch (e) {
    console.error('[Oferte] eroare generare:', e.message);
  }
}

function cleanupOferte() {
  const acum = Date.now();
  const oferte = citesteOferte();
  const active = oferte.filter(o => o.expira_la > acum);
  if (active.length !== oferte.length) {
    scrieOferte(active);
    console.log(`[Oferte] cleanup ${oferte.length - active.length} expirate`);
  }
}

function cleanupBackup() {
  try {
    const acum = Date.now();
    const limita = 10 * 60 * 1000; // 10 min
    fs.readdirSync(global.folderBackupCss).forEach(f => {
      const p = path.join(global.folderBackupCss, f);
      const stat = fs.statSync(p);
      if (acum - stat.mtimeMs > limita) fs.unlinkSync(p);
    });
  } catch (e) { /* silent */ }
}


const CATEGORII_ENUM = ['Exterior', 'Interior', 'Motor', 'Roti', 'Electronice'];
app.use(async (req, res, next) => {
  res.locals.categorii = CATEGORII_ENUM;
  res.locals.orarAtelier = [
    { zi: 'Luni',      deschidere: '09:00', inchidere: '18:00' },
    { zi: 'Marți',     deschidere: '09:00', inchidere: '18:00' },
    { zi: 'Miercuri',  deschidere: '09:00', inchidere: '18:00' },
    { zi: 'Joi',       deschidere: '09:00', inchidere: '18:00' },
    { zi: 'Vineri',    deschidere: '09:00', inchidere: '18:00' },
    { zi: 'Sâmbătă',   deschidere: '10:00', inchidere: '15:00' },
    { zi: 'Duminică',  deschidere: null,    inchidere: null }, // inchis
  ];
  res.locals.currentPath = req.path;
  res.locals.oferteActive = citesteOferte().filter(o => o.expira_la > Date.now());
  next();
});


function aplicaOferta(produs, oferte) {
  const o = oferte.find(o => o.id_produs === produs.id && o.expira_la > Date.now());
  if (o) {
    produs._oferta = o;
    produs._pret_vechi = o.pret_vechi;
    produs._pret_afisat = o.pret_nou;
  } else {
    produs._pret_afisat = parseFloat(produs.pret);
  }
  return produs;
}


const T_NOU_ZILE = 30;
function marcheazaNou(p) {
  const acum = new Date();
  const data = new Date(p.data_adaugare);
  p._este_nou = (acum - data) < (T_NOU_ZILE * 24 * 3600 * 1000);
  return p;
}

async function calcCeiMaiIeftini() {
  const r = await query(`
    SELECT DISTINCT ON (categorie) id, categorie FROM produse
    ORDER BY categorie, pret ASC
  `);
  return new Set(r.rows.map(x => x.id));
}


function normalize(s) {
  return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// Aplica filtre pe lista produse (server)
function aplicaFiltre(produse, filtre) {
  let list = [...produse];
  if (filtre.nume) {
    const raw = normalize(filtre.nume).trim();
    if (raw.includes('*')) {
      const regexStr = '^' + raw.split('*').map(s => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$';
      const rx = new RegExp(regexStr);
      list = list.filter(p => rx.test(normalize(p.nume)));
    } else {
      list = list.filter(p => normalize(p.nume).includes(raw));
    }
  }
  if (filtre.pret_min != null && filtre.pret_min !== '') {
    const v = parseFloat(filtre.pret_min); list = list.filter(p => parseFloat(p.pret) >= v);
  }
  if (filtre.pret_max != null && filtre.pret_max !== '') {
    const v = parseFloat(filtre.pret_max); list = list.filter(p => parseFloat(p.pret) <= v);
  }
  if (filtre.material_datalist) {
    list = list.filter(p => normalize(p.material) === normalize(filtre.material_datalist));
  }
  if (filtre.montaj && filtre.montaj !== 'orice') {
    const need = filtre.montaj === 'da';
    list = list.filter(p => p.necesita_montaj_profesionist === need);
  }
  if (filtre.categorii && filtre.categorii.length) {
    const set = new Set(Array.isArray(filtre.categorii) ? filtre.categorii : [filtre.categorii]);
    list = list.filter(p => set.has(p.categorie));
  }
  if (filtre.compat_text) {
    const raw = normalize(filtre.compat_text).trim();
    if (raw) list = list.filter(p => (p.compatibilitate || []).some(c => normalize(c).includes(raw)));
  }
  if (filtre.culoare && filtre.culoare !== 'oricare') {
    list = list.filter(p => normalize(p.culoare) === normalize(filtre.culoare));
  }
  if (filtre.materiale_multi && filtre.materiale_multi.length) {
    const arr = Array.isArray(filtre.materiale_multi) ? filtre.materiale_multi : [filtre.materiale_multi];
    const set = new Set(arr.map(normalize));
    list = list.filter(p => set.has(normalize(p.material)));
  }
  return list;
}

// -------- Sortare ----------------------------------------------------------
function aplicaSortare(produse, cheie, ordine) {
  const copy = [...produse];
  const dir = ordine === 'desc' ? -1 : 1;
  const cheiFolosite = Array.isArray(cheie) ? cheie : [cheie];
  copy.sort((a, b) => {
    for (const k of cheiFolosite) {
      let va, vb;
      switch (k) {
        case 'nume': va = a.nume; vb = b.nume; break;
        case 'descriere_lungime': va = (a.descriere || '').length; vb = (b.descriere || '').length; break;
        case 'pret': va = parseFloat(a.pret); vb = parseFloat(b.pret); break;
        case 'putere': va = a.putere_castigata_hp; vb = b.putere_castigata_hp; break;
        case 'data': va = new Date(a.data_adaugare).getTime(); vb = new Date(b.data_adaugare).getTime(); break;
        default: va = a.nume; vb = b.nume;
      }
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
    }
    return 0;
  });
  return copy;
}



// Homepage
app.get('/', async (req, res) => {
  try {
    const oferte = citesteOferte().filter(o => o.expira_la > Date.now());
    const noi = await query(`SELECT * FROM produse WHERE data_adaugare > CURRENT_DATE - INTERVAL '${T_NOU_ZILE} days' ORDER BY data_adaugare DESC LIMIT 6`);
    const populare = await query(`SELECT * FROM produse ORDER BY RANDOM() LIMIT 4`);
    const cheapestSet = await calcCeiMaiIeftini();

    const noiP = noi.rows.map(p => aplicaOferta(marcheazaNou(p), oferte)).map(p => ({ ...p, _cheapest: cheapestSet.has(p.id) }));
    const popP = populare.rows.map(p => aplicaOferta(marcheazaNou(p), oferte)).map(p => ({ ...p, _cheapest: cheapestSet.has(p.id) }));

    res.render('pagini/index', {
      title: 'GARAJ TUNING - Piese Auto Performance',
      produseNoi: noiP,
      produsePopulare: popP,
      oferte,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send('Eroare server: ' + e.message);
  }
});

// Catalog produse 
app.get('/produse', async (req, res) => {
  try {
    const oferte = citesteOferte().filter(o => o.expira_la > Date.now());
    const cheapestSet = await calcCeiMaiIeftini();

    // Filtre categoria din meniu
    const catMeniu = req.query.categorie;

    // Query filtre
    let produse = (await query('SELECT * FROM produse ORDER BY id ASC')).rows;

    // Range real min/max (Bonus 1) - preț
    const pretMinReal = Math.min(...produse.map(p => parseFloat(p.pret)));
    const pretMaxReal = Math.max(...produse.map(p => parseFloat(p.pret)));
    const materialeDistincte = [...new Set(produse.map(p => p.material))].sort();
    const culoriDistincte = [...new Set(produse.map(p => p.culoare))].sort();

    // Aplica filtru categorie meniu
    if (catMeniu && CATEGORII_ENUM.includes(catMeniu)) {
      produse = produse.filter(p => p.categorie === catMeniu);
    }

    // Aplica filtre din query
    const filtre = {
      nume: req.query.nume,
      pret_min: req.query.pret_min,
      pret_max: req.query.pret_max,
      material_datalist: req.query.material_datalist,
      montaj: req.query.montaj,
      categorii: req.query.categorii,
      compat_text: req.query.compat_text,
      culoare: req.query.culoare,
      materiale_multi: req.query.materiale_multi,
    };
    let filtrate = aplicaFiltre(produse, filtre);

    // Sortare
    const sortCheie = req.query.sort_cheie || 'nume';
    const sortOrdine = req.query.sort_ordine || 'asc';
    if (req.query.sort_cheie) {
      filtrate = aplicaSortare(filtrate, sortCheie, sortOrdine);
    } else {
      // Sortare default: nume + descriere_lungime
      filtrate = aplicaSortare(filtrate, ['nume', 'descriere_lungime'], 'asc');
    }

    // Paginare (Bonus 5)
    const K = 8;
    const pagina = parseInt(req.query.pagina || '1', 10);
    const total = filtrate.length;
    const totalPagini = Math.max(1, Math.ceil(total / K));
    const paginate = filtrate.slice((pagina - 1) * K, pagina * K);
    const hidratate = paginate.map(p => aplicaOferta(marcheazaNou(p), oferte)).map(p => ({ ...p, _cheapest: cheapestSet.has(p.id) }));

    res.render('pagini/produse', {
      title: 'Catalog produse',
      produse: hidratate,
      total,
      pagina,
      totalPagini,
      catMeniu,
      pretMinReal, pretMaxReal,
      materialeDistincte, culoriDistincte,
      filtre: { ...filtre, sort_cheie: sortCheie, sort_ordine: sortOrdine },
    });
  } catch (e) {
    console.error(e);
    res.status(500).send('Eroare: ' + e.message);
  }
});

// filtrare fetch (Bonus 10) 
app.get('/catalog-json', async (req, res) => {
  try {
    const oferte = citesteOferte().filter(o => o.expira_la > Date.now());
    const cheapestSet = await calcCeiMaiIeftini();
    let produse = (await query('SELECT * FROM produse ORDER BY id ASC')).rows;

    if (req.query.categorie && CATEGORII_ENUM.includes(req.query.categorie)) {
      produse = produse.filter(p => p.categorie === req.query.categorie);
    }

    const filtre = {
      nume: req.query.nume,
      pret_min: req.query.pret_min,
      pret_max: req.query.pret_max,
      material_datalist: req.query.material_datalist,
      montaj: req.query.montaj,
      categorii: req.query.categorii,
      compat_text: req.query.compat_text,
      culoare: req.query.culoare,
      materiale_multi: req.query.materiale_multi,
    };
    let filtrate = aplicaFiltre(produse, filtre);

    const sortCheie = req.query.sort_cheie || 'nume';
    const sortOrdine = req.query.sort_ordine || 'asc';
    filtrate = aplicaSortare(filtrate, sortCheie, sortOrdine);

    const K = 8;
    const pagina = parseInt(req.query.pagina || '1', 10);
    const total = filtrate.length;
    const totalPagini = Math.max(1, Math.ceil(total / K));
    const paginate = filtrate.slice((pagina - 1) * K, pagina * K);
    const hidratate = paginate.map(p => aplicaOferta(marcheazaNou(p), oferte))
      .map(p => ({ ...p, _cheapest: cheapestSet.has(p.id) }));

    res.json({ produse: hidratate, total, pagina, totalPagini });
  } catch (e) {
    res.status(500).json({ eroare: e.message });
  }
});

// Pagina produs individual
app.get('/produs/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).send('ID invalid');
    const r = await query('SELECT * FROM produse WHERE id = $1', [id]);
    if (!r.rows.length) return res.status(404).render('pagini/nu-exista', { title: 'Produs inexistent', msg: 'Produsul cerut nu există.' });
    const oferte = citesteOferte().filter(o => o.expira_la > Date.now());
    const cheapestSet = await calcCeiMaiIeftini();
    const produs = aplicaOferta(marcheazaNou(r.rows[0]), oferte);
    produs._cheapest = cheapestSet.has(produs.id);

    // Produse similare (Bonus 16)
    const simRes = await query(
      'SELECT * FROM produse WHERE categorie = $1 AND id <> $2 ORDER BY ABS(pret - $3) ASC LIMIT 4',
      [produs.categorie, produs.id, produs.pret]
    );
    const similare = simRes.rows.map(p => aplicaOferta(marcheazaNou(p), oferte));

    res.render('pagini/produs', {
      title: produs.nume,
      produs,
      similare,
    });
  } catch (e) {
    res.status(500).send('Eroare: ' + e.message);
  }
});

// Seturi (Bonus 17)
app.get('/seturi', async (req, res) => {
  try {
    const setsRes = await query('SELECT * FROM seturi ORDER BY id ASC');
    const seturi = [];
    for (const s of setsRes.rows) {
      const prodRes = await query(`
        SELECT p.* FROM produse p
        JOIN asociere_set a ON a.id_produs = p.id
        WHERE a.id_set = $1
        ORDER BY p.id
      `, [s.id]);
      const produse = prodRes.rows;
      const suma = produse.reduce((acc, p) => acc + parseFloat(p.pret), 0);
      const nrProduse = produse.length;
      const procentReducere = Math.min(5, nrProduse) * 5; // min(5, n) * 5%
      const pretFinal = +(suma * (1 - procentReducere / 100)).toFixed(2);
      seturi.push({
        ...s, produse, suma: +suma.toFixed(2), pretFinal, procentReducere, nrProduse,
      });
    }
    res.render('pagini/seturi', { title: 'Seturi tuning', seturi });
  } catch (e) {
    res.status(500).send('Eroare: ' + e.message);
  }
});

// Comparare (fereastra noua, Bonus 20)
app.get('/comparare', async (req, res) => {
  try {
    const ids = String(req.query.ids || '').split(',').map(x => parseInt(x, 10)).filter(x => !Number.isNaN(x)).slice(0, 2);
    if (ids.length < 2) return res.render('pagini/comparare', { title: 'Comparare', produse: [], eroare: 'Selectează exact 2 produse pentru comparare.' });
    const r = await query('SELECT * FROM produse WHERE id = ANY($1::int[])', [ids]);
    if (r.rows.length < 2) return res.render('pagini/comparare', { title: 'Comparare', produse: [], eroare: 'Produsele nu au fost găsite.' });
    // ordoneaza dupa ordinea din ids
    const ordered = ids.map(id => r.rows.find(p => p.id === id)).filter(Boolean);
    res.render('pagini/comparare', { title: 'Comparare produse', produse: ordered, eroare: null });
  } catch (e) {
    res.status(500).send('Eroare: ' + e.message);
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('pagini/nu-exista', { title: '404', msg: `Ruta ${req.path} nu există.` });
});

// =============================================================================
// Startup
// =============================================================================
const PORT = parseInt(process.env.PORT || '8080', 10);
const HOST = process.env.HOST || '0.0.0.0';

async function start() {
  try {
    await ensureSchema();
    // Genereaza cateva oferte initiale imediat
    await genereazaOferte();
    setInterval(genereazaOferte, T_GENERARE_MS);
    setInterval(cleanupOferte,   T2_CLEANUP_MS);
    setInterval(cleanupBackup,   10 * 60 * 1000);
  } catch (e) {
    console.error('[Startup] eroare init DB:', e.message);
  }
  app.listen(PORT, HOST, () => {
    console.log(`[Server] Atelier Tuning ruleaza pe http://${HOST}:${PORT}`);
  });
}

start();
