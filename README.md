# GARAJ TUNING — Atelier Piese Auto Performance

Aplicație web pentru un atelier de tuning auto — catalog produse (piese tuning), filtrare/sortare avansată, sistem oferte flash cu timer, comparare produse, seturi cu discount, 3 teme (Dark Racing / Industrial / Light), server-side rendering cu Node.js + Express + EJS + PostgreSQL.

**Proiect Tehnologii Web — 2026**

---

## Stack tehnologic

| Componentă | Tehnologie |
|-----------|-----------|
| **Backend** | Node.js 20 + Express 4 |
| **Templating** | EJS (Server-Side Rendered) |
| **Bază de date** | PostgreSQL 15 (via pgAdmin4) |
| **Styling** | Bootstrap 5.3 + SASS customizat (compilare automată) |
| **Client JS** | Vanilla JS (fetch, localStorage, sessionStorage) |
| **Iconițe** | Bootstrap Icons + FontAwesome |

---

## Instalare pas cu pas

### 1. Setup PostgreSQL (pgAdmin4)

1. Deschide **pgAdmin4** → conectează-te la serverul local (`localhost:5432`).
2. Query Tool → Rulează secțiunea de creare user & database (poți sări dacă există deja):

   ```sql
   CREATE ROLE ilie LOGIN PASSWORD '1212';
   CREATE DATABASE tuning_shop OWNER ilie;
   GRANT ALL PRIVILEGES ON DATABASE tuning_shop TO ilie;
   ```

3. Conectează-te la baza `tuning_shop` (dublu-click pe DB în pgAdmin4).
4. Query Tool → Rulează [`db/init.sql`](./db/init.sql) — creează tipul ENUM și tabelele (`produse`, `seturi`, `asociere_set`).
5. Query Tool → Rulează [`db/seed.sql`](./db/seed.sql) — populează 20 piese tuning + 3 seturi.

> **Notă:** Aplicația verifică automat la pornire dacă schema există și rulează seed-ul dacă tabelul `produse` e gol — deci pașii 4-5 pot fi omisi dacă preferi să lași aplicația să facă asta la primul start.

### 2. Fișier `.env`

Copiază exemplul din `.env` (deja creat) și ajustează dacă e nevoie:

```env
DB_USER=ilie
DB_PASS=1212
DB_NAME=tuning_shop
DB_HOST=localhost
DB_PORT=5432
PORT=8080
HOST=0.0.0.0
```

### 3. Instalare dependințe & pornire

```bash
npm install         # sau: yarn install
npm start           # sau: node index.js
```

Aplicația va fi disponibilă la **http://localhost:8080** (sau portul definit în `.env`).

---

## Structură repo

```
/
├── index.js               # Server principal Express + SASS compiler + oferte
├── package.json           # Dependinte (express, ejs, pg, sass, chokidar, dotenv)
├── .env                   # Config DB + port
├── oferte.json            # Persistență oferte flash (generate automat)
├── db/
│   ├── init.sql           # DDL: create user + database + enum + tabele
│   ├── seed.sql           # 20 produse + 3 seturi + asocieri
│   ├── connection.js      # pg.Pool
│   └── bootstrap.js       # Rulează init+seed automat dacă schema lipsește
├── resurse/
│   ├── scss/              # custom.scss (Bootstrap override), componente.scss
│   ├── css/               # compilate automat la pornire + on-the-fly (chokidar)
│   ├── js/                # theme.js, comparare.js, oferte.js, produs-sesiune.js, produse.js
│   └── imagini/
├── views/
│   ├── partials/          # header, meniu, footer, orar, card-produs
│   └── pagini/            # index, produse, produs, seturi, comparare, nu-exista
├── backup/                # backup CSS vechi (auto-creat, cleanup la 10 min)
└── temp/
```

---

## Funcționalități implementate (toate fazele)

### Faza 1 — Cadrul de lucru ✅

- **1.1** Obiect global cu `folderScss`, `folderCss`, `folderBackup`, `folderTemp` — foldere create automat la pornire.
- **1.2** Funcția `compileazaScss(caleScss, caleCss)`:
  - Suportă căi absolute (folosite direct) și relative (raportate la `folderScss` / `folderCss`).
  - Dacă `caleCss` lipsește → salvează în `folderCss` cu extensie `.css`.
  - Backup CSS vechi în `backup/resurse/css/` (cu timestamp) înainte de compilare.
  - Mesaj de eroare la eșec (fișier lipsă, syntax SCSS invalid).
- **1.3** Compilare inițială la pornire — parcurge toate `.scss` din `folderScss`.
- **1.4** Compilare on-the-fly cu **chokidar** (`fs.watch`-style) — orice modificare/creare `.scss` re-compilează.
- **1.5** [`resurse/scss/custom.scss`](./resurse/scss/custom.scss) — override complet Bootstrap:
  - Culori background pentru **3 teme** (dark racing, industrial, light) prin CSS vars.
  - `$font-family-base` (Exo 2), `$headings-font-family` (Rajdhani).
  - Breakpoints custom pentru `md` (800px) și `lg` (1080px).
  - `$border-radius` (2px, aspect brutalist).
  - Dimensiuni `$h1`–`$h6-font-size` mari (aspect racing).
  - Variabile custom pentru inputuri, butoane și **range (buline +50% + culori)**.
  - Elemente Bootstrap folosite: **navbar, cards, forms, buttons, modal, carousel, grid, dropdown**.
- **1.6** PostgreSQL via `pg` Pool + `.env` + `db/init.sql` + `db/seed.sql`.

### Faza 2 — Pagini produse & meniu ✅

- Meniu cu **dropdown pe categorii** generat din ENUM (via `res.locals.categorii`).
- `/produse` — template EJS cu **article + tabel + imagine** (grid Bootstrap `row`/`col`).
- `/produs/:id` — pagina individuală cu **toate detaliile**, dată în `<time>` format `zi/Luna/an (Zi_săptămână)` în română.
- Filtrare server-side pe categorie (`/produse?categorie=Motor`).

### Faza 3 — CSS obligatorii + Filtre ✅

- **`column-count` + `column-rule`** pe secțiunea "De ce Garaj Tuning" (o coloană pe mic/mediu).
- **`::selection`** customizat cu variabile CSS.
- **Text animat orizontal** (marquee cu keyframes, responsive fără scroll).
- **Background fix cu schimbare imagine la 5s** (secțiunea "Fiecare piesă crește performanța").
- **Tabel responsive** 4+ coloane + **transpus la media query** (`< 768px`) cu `data-label`.
- **Light/dark theme** cu icon soare/lună + `localStorage`.

**Filtre (8 inputuri conform cerinței):**
1. `input text` — nume produs cu wildcard `*` (Bonus 7: fără diacritice).
2. `range` × 2 — preț min/max (afișare valoare live).
3. `datalist` — material.
4. `radio group` cu opțiunea "orice" — necesită montaj profesionist.
5. `checkbox group` (toggle-buttons Bootstrap) — categorii multiple.
6. `textarea` cu floating label + `is-invalid` — compatibilitate.
7. `select simplu` cu default "oricare" — culoare.
8. `select multiplu` — materiale.

**Butoane acțiune:**
- **Filtrează** (submit form).
- **Sortare** cu 2+ chei (nume + lungime descriere + preț + putere + data).
- **Calculează** — `div` fix ce apare 2 secunde cu totalul produselor afișate.
- **Reset** cu `confirm()`.

### Faza 4 — Bonusuri UI ✅

- **B1** Range min/max din DB (`pretMinReal`, `pretMaxReal`).
- **B2** **3 teme** (dark racing, industrial, light).
- **B3** Mesaj "Nu există produse".
- **B4** Filtrare `onchange` pe toate 8 inputurile (debounced 300ms).
- **B5** Paginare cu K=8 elemente/pagină.
- **B6** 3 butoane per produs (păstrează / ascunde / șterge din sesiune — `sessionStorage`).
- **B7** Search fără diacritice (normalize NFD).
- **B8** Sortare pe **5 chei diferite**: nume, preț, putere, dată, lungime descriere.
- **B9** Imagini multiple + **carusel Bootstrap** (pe cardurile care au `imagini_extra`).
- **B15** Contor produse afișate.

### Faza 5 — Bonusuri avansate ✅

- **B10a+b** Filtrare/sortare server-side + `fetch()` (`/api/produse`).
- **B12** Sistem oferte:
  - Fișier JSON persistent (`oferte.json`).
  - Generator la interval T = 2 min (4 oferte random cu discount 10–35%).
  - Timer HH:MM:SS pe fiecare card + pe pagina produs.
  - Ultimele 10s marcate cu clasă `.critical` (pulse animation).
  - Preț tăiat + preț nou pe produse cu ofertă.
  - Cleanup automat la T2 = 5 min.
- **B13** Cleanup backup vechi cu `setInterval` (10 min).
- **B14** Cel mai ieftin per categorie (badge "CEL MAI IEFTIN" verde).
- **B16** Produse similare pe pagina individuală (aceeași categorie, preț apropiat).
- **B17** Seturi produse cu tabelele `seturi` + `asociere_set`, **preț redus cu `min(5, n) * 5%`**.
- **B18** Marcaj "NOU" pentru produse adăugate în ultimele 30 zile + secțiune home.
- **B19** Orar atelier accesibil pe orice pagină (fragment EJS în footer, **zi curentă marcată roșu**, **status DESCHIS / ÎNCHIS** calculat live).
- **B20** Comparare 2 produse cu **container fix persistent bottom** (localStorage) → **fereastră nouă** cu tabel comparativ.

---

## Comenzi utile

```bash
# Rulare
node index.js

# Development (auto-restart)
npx nodemon index.js

# Rebuild forțat CSS din SCSS
rm resurse/css/*.css && node -e "require('./index.js')"
```

---

## Autor

Proiect realizat în cadrul cursului **Tehnologii Web**, ianuarie 2026.
