# PRD — Atelier Tuning Auto (GARAJ TUNING)

## Problem Statement (original)
Aplicație web pentru un atelier de tuning auto — catalog produse (piese tuning), filtrare/sortare avansată, sistem oferte, comparare produse, seturi, teme multiple. Server-side rendering Node.js + Express + EJS + PostgreSQL. Proiect Tehnologii Web 2026.

## User Choices
- **Stack:** Node.js + Express + EJS + **PostgreSQL** (instalat în container: user `ilie` / parolă `1212` / DB `tuning_shop`)
- **Port:** default 8080 (dar `PORT` din `.env` → în container preview se folosește `3000` pentru accesibilitate)
- **Imagini:** placeholder-uri Unsplash (piese auto + garaj)
- **Scop:** implementare TOTALĂ (Fazele 1-5 + toate bonusurile B1-B20)
- **Temă vizuală:** Dark/Racing (default) + Modern Industrial + Light Clean (3 teme)

## Arhitectură
```
/app/
├── index.js               # Express server + SASS compiler + oferte + scheduler
├── package.json           # deps: express, ejs, pg, sass, chokidar, dotenv, bootstrap
├── .env                   # DB_USER=ilie, DB_PASS=1212, DB_NAME=tuning_shop, PORT=3000
├── oferte.json            # Persistență oferte flash generate
├── db/
│   ├── init.sql           # ENUM + tabele produse/seturi/asociere_set
│   ├── seed.sql           # 20 piese + 3 seturi + asocieri
│   ├── connection.js      # pg.Pool
│   └── bootstrap.js       # ensureSchema (idempotent)
├── resurse/
│   ├── scss/{custom, componente}.scss  # SASS compilate automat
│   ├── css/                            # generate auto
│   ├── js/{theme, comparare, oferte, produs-sesiune, produse}.js
│   └── imagini/
├── views/
│   ├── partials/{header, meniu, footer, orar, card-produs}.ejs
│   └── pagini/{index, produse, produs, seturi, comparare, nu-exista}.ejs
├── backup/                # backup CSS + cleanup 10min
└── temp/
```

## Persoane (personas)
- **Pasionat tuning:** vrea catalog rapid, filtrare pe categorie, comparare 2 produse.
- **Mecanic:** verifică compatibilitatea și dacă necesită montaj profesionist.
- **Vânător de oferte:** urmărește badge-uri "OFERTĂ" cu timer.

## Cerințe statice
- 20 produse (piese tuning) cu ENUM 5 categorii, dublu-criteriu (preț + putere CP), multi-value compatibilitate, boolean montaj.
- 3 teme (dark racing / industrial / light) cu variabile CSS.
- 8 tipuri inputuri filter (text wildcard, 2× range, datalist, radio, checkbox, textarea, select, multi-select).
- Bootstrap 5 + SASS custom cu override variabile.
- Compilare SCSS automată + backup + on-the-fly (chokidar).

## Ce s-a implementat (07 Jan 2026)

### Faza 1 — Cadru ✅
- Obiect global `folderScss/Css/Backup/Temp`, foldere auto-create.
- Fnc `compileazaScss()` cu backup + suport căi absolute/relative.
- Compilare inițială + on-the-fly cu chokidar.
- Custom SCSS cu suprascriere Bootstrap: culori 3 teme, fonturi Rajdhani+Exo2, breakpoints md=800/lg=1080, border-radius 2px, h1-h6 sizes, range +50%, inputuri/butoane custom.
- PostgreSQL: user `ilie`/`1212`, DB `tuning_shop`, ENUM `categorie_produs`, tabele produse/seturi/asociere_set.

### Faza 2 — Pagini + meniu ✅
- Meniu dropdown categorii generate din ENUM (via `res.locals`).
- `/produse` article + tabel + imagine + grid Bootstrap.
- `/produs/:id` cu `<time>` format `zi/Luna/an (Zi_săptămână)` în română.
- Filtrare server-side pe categorie via query string.

### Faza 3 — CSS obligatorii + Filtre ✅
- `column-count`+`column-rule` (secțiunea "De ce Garaj Tuning") — 1 col pe mic/mediu.
- `::selection` custom.
- Marquee animat orizontal cu keyframes.
- Background fix cu schimbare imagine la 5s.
- Tabel responsive + transpus la media query (`< 768px`).
- Light/dark/industrial cu localStorage.
- **8 inputuri filter** + 4 butoane (Filtrează, Sortare 2 chei, Calculează cu div fix 2s, Reset cu confirm).

### Faza 4 — Bonusuri UI ✅
- B1 range min/max din DB · B2 3 teme · B3 mesaj fără produse · B4 filtrare onchange (debounced 300ms) · B5 paginare K=8 · B6 3 butoane sesiune per card (păstrează/ascunde/șterge) · B7 search fără diacritice · B8 sortare pe 5 chei · B9 carusel Bootstrap imagini multiple · B15 contor produse.

### Faza 5 — Bonusuri avansate ✅
- B10a+b fetch server-side (`/catalog-json`) · B12 oferte JSON T=2min, T2=5min cleanup, timer HH:MM:SS + critical <10s, preț tăiat · B13 cleanup backup CSS la 10min · B14 cel-mai-ieftin per categorie · B16 produse similare · B17 seturi cu discount `min(5,n)*5%` · B18 marcaj "NOU" 30 zile · B19 orar accesibil pe orice pagină, zi curentă marcată, status live · B20 comparare 2 produse cu tray fix + fereastră nouă.

## Testing status
- Iteration 1 → 3 issues (1 CRITICAL /api/* conflict, 2 MEDIUM imagini 404, 1 LOW spațiu H1) — toate fixate.
- **Iteration 2 → 100% success rate, zero bugs** (`/app/test_reports/iteration_2.json`).

## Backlog / P1
- Coș de cumpărături + checkout (nu era cerut, dar pas natural).
- Sistem review-uri / rating produse.
- Autentificare admin pentru CRUD produse.

## Backlog / P2
- Multi-lingv (RO/EN).
- Export catalog PDF.
- Wishlist persistat pe cont.

## Cum se rulează local (după clonare)
1. `pgAdmin4` → creează user `ilie` pw `1212` + DB `tuning_shop`; conectat la DB rulează `db/init.sql` apoi `db/seed.sql`.
2. Copiază `.env.example` → `.env` (deja creat).
3. `npm install && npm start` → http://localhost:8080
