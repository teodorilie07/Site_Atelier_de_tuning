const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

console.log("Calea folderului (__dirname):", __dirname);
console.log("Calea fișierului (__filename):", __filename);
console.log("Folderul de lucru (process.cwd()):", process.cwd());

const vect_foldere = ["temp", "logs", "backup", "fisiere_uploadate"];
vect_foldere.forEach(folder => {
    let caleFolder = path.join(__dirname, folder);
    if (!fs.existsSync(caleFolder)) {
        fs.mkdirSync(caleFolder);
        console.log(`Folder creat automat: ${folder}`);
    }
});

let obGlobal = { obErori: null };

function initErori() {
    try {
        let continut = fs.readFileSync(path.join(__dirname, 'erori.json'));
        obGlobal.obErori = JSON.parse(continut);
    } catch (eroare) {
        console.error("Eroare la citirea fișierului erori.json:", eroare);
    }
}
initErori();

function afisareEroare(res, identificator, titlu, text, imagine) {
    if (!obGlobal.obErori) {
        return res.status(500).send("Eroare critica: Resursele de erori nu sunt initializate.");
    }

    let eroare = obGlobal.obErori.info_erori.find(e => e.identificator === identificator);
    if (!eroare) eroare = obGlobal.obErori.eroare_default;

    let titluFinal = titlu || eroare.titlu;
    let textFinal = text || eroare.text;
    
    let imagineFinala = imagine || (obGlobal.obErori.cale_baza + '/' + eroare.imagine);

    if (eroare.status) res.status(identificator || 500);

    res.render('pagini/eroare', {
        titlu: titluFinal,
        text: textFinal,
        imagine: imagineFinala,
        ip: res.req.ip
    });
}

app.use(/\.ejs$/i, (req, res) => {
    afisareEroare(res, 400);
});

express.static.mime.define({'text/vtt': ['vtt']});

app.use('/resurse', (req, res, next) => {
    if (req.originalUrl.endsWith('/')) {
        return afisareEroare(res, 403);
    }
    next();
}, express.static(path.join(__dirname, 'resurse')));

app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'resurse', 'ico', 'favicon-96x96.png'), (err) => {
        if (err) res.status(404).end();
    });
});

app.get(['/', '/index', '/home'], (req, res) => {
    res.render('pagini/index', { ip: req.ip, titlu: 'Acasă - Tuning Pro' });
});

app.get('/despre', (req, res) => {
    res.render('pagini/despre', { ip: req.ip, titlu: 'Despre Noi - Tuning Pro' });
});

app.get(/^\/(.*)$/, (req, res) => {
    let pagina = req.params[0];

    if (path.extname(pagina)) {
        return afisareEroare(res, 404);
    }

    let calePagina = path.join(__dirname, 'views', 'pagini', pagina + '.ejs');

    fs.access(calePagina, fs.constants.F_OK, (err) => {
        if (err) {
            return afisareEroare(res, 404);
        }
        res.render('pagini/' + pagina, { ip: req.ip, titlu: pagina.toUpperCase() + ' - Tuning Pro' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serverul rulează cu succes pe http://localhost:${PORT}`);
});