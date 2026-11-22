/* Fichier clients : lecture de l'export Extrabat (format CSV), rangement dans le téléphone
   et recherche. La liste est chiffrée avec une clé tirée du code d'accès ; rien n'est envoyé
   sur Internet. */
(function () {
  'use strict';
  const O = window.OLYMPE;
  const DB = 'olympe', STORE = 'coffre';
  let key = null;        // clé de chiffrement, disponible une fois le code saisi
  let list = [];         // clients déchiffrés, en mémoire seulement
  let meta = null;       // { count, at } ou { unreadable: true }
  let ns = '';           // suffixe des clés : une liste par compte connecté

  const norm = s => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const enc = new TextEncoder();

  /* ---------- Petite base du navigateur (IndexedDB) ---------- */
  function db() {
    return new Promise((resolve, reject) => {
      const r = indexedDB.open(DB, 1);
      r.onupgradeneeded = () => r.result.createObjectStore(STORE);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
  }
  function tx(mode, fn) {
    return db().then(d => new Promise((resolve, reject) => {
      const t = d.transaction(STORE, mode);
      const req = fn(t.objectStore(STORE));
      t.oncomplete = () => { d.close(); resolve(req && req.result); };
      t.onerror = t.onabort = () => { d.close(); reject(t.error); };
    }));
  }
  const get = k => tx('readonly', s => s.get(k));
  const put = (k, v) => tx('readwrite', s => s.put(v, k));
  const del = k => tx('readwrite', s => s.delete(k));

  /* ---------- Lecture du fichier CSV ---------- */
  function decode(buf) {
    let text;
    try { text = new TextDecoder('utf-8', { fatal: true }).decode(buf); }
    catch (e) { text = new TextDecoder('windows-1252').decode(buf); }
    return text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text;
  }
  function separator(text) {
    const end = text.search(/\r?\n/);
    const line = text.slice(0, end > 0 ? end : 2000);
    let best = ';', n = -1;
    for (const s of [';', ',', '\t', '|']) {
      const c = line.split(s).length;
      if (c > n) { n = c; best = s; }
    }
    return best;
  }
  function parseCsv(text, sep) {
    const rows = [];
    let row = [], cell = '', quoted = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (quoted) {
        if (ch === '"') {
          if (text[i + 1] === '"') { cell += '"'; i++; } else quoted = false;
        } else cell += ch;
      } else if (ch === '"') quoted = true;
      else if (ch === sep) { row.push(cell); cell = ''; }
      else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && text[i + 1] === '\n') i++;
        row.push(cell); cell = '';
        if (row.some(c => c.trim())) rows.push(row);
        row = [];
      } else cell += ch;
    }
    row.push(cell);
    if (row.some(c => c.trim())) rows.push(row);
    return rows;
  }

  /* Types d'adresse d'Extrabat, dans l'ordre où on les propose */
  const KINDS = [['chantier', 'Chantier'], ['corresp', 'Correspondance'], ['livr', 'Livraison'], ['factur', 'Facturation']];
  const PHONES = ['portable 1', 'portable', 'mobile', 'portable 2', 'domicile', 'telephone', 'tel', 'professionnel m', 'professionnel mme'];
  const isName = x => x === 'nom' || x === 'nom client' || x === 'nom du client';

  function mapColumns(header) {
    const h = header.map(norm);
    const find = test => h.findIndex(test);
    const cols = {
      nom: find(isName),
      prenom: find(x => x === 'prenom'),
      civ: find(x => x.indexOf('civilite') === 0),
      email: find(x => x === 'email' || x === 'e mail' || x === 'mail' || x === 'adresse email' || x === 'courriel'),
      phones: PHONES.map(p => h.indexOf(p)).filter(i => i >= 0),
      addresses: []
    };
    for (const kind of KINDS) {
      const k = kind[0];
      const a = {
        label: kind[1],
        desc: find(x => x.indexOf('adresse') === 0 && x.indexOf(k) > 0),
        cp: find(x => (x.indexOf('cp') === 0 || x.indexOf('code postal') === 0) && x.indexOf(k) > 0),
        ville: find(x => x.indexOf('ville') === 0 && x.indexOf(k) > 0)
      };
      if (a.desc >= 0 || a.ville >= 0) cols.addresses.push(a);
    }
    if (!cols.addresses.length) { // export sans précision du type d'adresse
      const a = { label: 'Adresse', desc: h.indexOf('adresse'), cp: find(x => x === 'cp' || x === 'code postal'), ville: h.indexOf('ville') };
      if (a.desc >= 0 || a.ville >= 0) cols.addresses.push(a);
    }
    return cols;
  }

  function readText(text) {
    const rows = parseCsv(text, separator(text));
    const at = rows.slice(0, 6).findIndex(r => r.some(c => isName(norm(c))));
    if (at < 0) {
      const seen = (rows[0] || []).map(c => c.trim()).filter(Boolean).slice(0, 8).join(', ');
      throw new Error('La colonne « Nom » est introuvable. '
        + (seen ? 'Colonnes lues : ' + seen + '. ' : 'Le fichier semble vide. ')
        + 'Vérifiez que l’export est bien au format CSV.');
    }
    const cols = mapColumns(rows[at]);
    const cell = (r, i) => (i >= 0 && r[i] ? r[i].trim() : '');
    const out = [];
    for (const r of rows.slice(at + 1)) {
      const n = cell(r, cols.nom), p = cell(r, cols.prenom);
      if (!n && !p) continue;
      const a = [], seenAddr = new Set();
      for (const c of cols.addresses) {
        const line2 = (cell(r, c.cp) + ' ' + cell(r, c.ville)).trim();
        const txt = [cell(r, c.desc).replace(/\s*[\r\n]+\s*/g, ', '), line2].filter(Boolean).join('\n');
        const k = norm(txt);
        if (txt && !seenAddr.has(k)) { seenAddr.add(k); a.push([c.label, txt, cell(r, c.ville)]); }
      }
      let t = '';
      for (const i of cols.phones) { t = cell(r, i); if (t) break; }
      out.push({ n: n, p: p, c: cell(r, cols.civ), t: t, e: cell(r, cols.email), a: a });
    }
    if (!out.length) throw new Error('Aucun client trouvé dans ce fichier.');
    out.sort((x, y) => (x.n + ' ' + x.p).localeCompare(y.n + ' ' + y.p, 'fr', { sensitivity: 'base' }));
    return {
      rows: out,
      found: [
        ['Nom', cols.nom >= 0], ['Prénom', cols.prenom >= 0], ['Téléphone', cols.phones.length > 0],
        ['E-mail', cols.email >= 0], ['Adresse', cols.addresses.length > 0]
      ]
    };
  }

  function index() {
    for (const r of list) r._k = ' ' + norm(r.n + ' ' + r.p + ' ' + r.a.map(x => x[2] || '').join(' ')) + ' ';
  }

  O.clients = {
    /* Appelé quand le code d'accès est bon (ou sans code si l'outil n'en a pas). */
    async unlock(code, user) {
      key = null; list = []; meta = null;
      ns = user ? ':' + user : '';
      try {
        if (code && window.crypto && crypto.subtle) {
          let salt = await get('sel' + ns);
          if (!salt) { salt = crypto.getRandomValues(new Uint8Array(16)); await put('sel' + ns, salt); }
          const base = await crypto.subtle.importKey('raw', enc.encode(code), 'PBKDF2', false, ['deriveKey']);
          key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: salt, iterations: 150000, hash: 'SHA-256' },
            base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
        }
        const rec = await get('clients' + ns);
        if (!rec) return;
        if (rec.plain) list = rec.rows;
        else if (key) list = JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: rec.iv }, key, rec.data)));
        else throw new Error('clé absente');
        meta = { count: list.length, at: rec.at };
        index();
      } catch (e) {
        list = [];
        meta = { unreadable: true }; // code d'accès changé depuis l'import, ou stockage indisponible
      }
    },

    /* Oublie la liste en mémoire quand l'outil se reverrouille. */
    forget() { key = null; list = []; },

    count() { return list.length; },
    info() { return meta; },

    async read(file) {
      if (file.size > 25 * 1024 * 1024) throw new Error('Ce fichier est trop volumineux.');
      if (/\.xlsx?$/i.test(file.name)) throw new Error('C’est un fichier Excel. Dans Extrabat, choisissez « Format CSV » avant de valider l’export.');
      return readText(decode(await file.arrayBuffer()));
    },
    readText: readText,

    async save(rows, when) {
      const at = when || Date.now();
      const clean = rows.map(r => ({ n: r.n, p: r.p, c: r.c, t: r.t, e: r.e, a: r.a }));
      if (O.access || O.api) {
        if (!key) throw new Error('Le fichier ne peut pas être protégé ici : l’adresse doit être en HTTPS.');
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const data = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, enc.encode(JSON.stringify(clean)));
        await put('clients' + ns, { iv: iv, data: data, at: at });
      } else {
        await put('clients' + ns, { plain: true, rows: clean, at: at });
      }
      list = clean;
      meta = { count: list.length, at: at };
      index();
    },

    async remove() { await del('clients' + ns); list = []; meta = null; },

    name(r) { return [r.c, r.p, r.n].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim(); },

    search(q, max) {
      const tokens = norm(q).split(' ').filter(Boolean);
      if (tokens.join('').length < 2) return [];
      const out = [];
      for (const r of list) {
        if (tokens.every(t => r._k.indexOf(' ' + t) >= 0)) {
          out.push(r);
          if (out.length >= (max || 8)) break;
        }
      }
      return out;
    }
  };
})();
