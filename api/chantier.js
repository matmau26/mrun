/* Outil « Documents de chantier » : comptes des techniciens, codes personnels et fichier clients partagé.
   Fonction Vercel (Node.js). Les données sont rangées dans un stockage Vercel Blob privé :
     chantier/comptes.json  -> comptes (empreintes des codes, jamais les codes) et date du fichier clients
     chantier/clients.json  -> la liste des clients importée par le bureau
   Une seule adresse, en POST, avec { a: 'action', ... }. */
import { get, put } from '@vercel/blob';
import crypto from 'node:crypto';

const F_ACCOUNTS = 'chantier/comptes.json';
const F_CLIENTS = 'chantier/clients.json';
const ITER = 150000;
const SESSION_DAYS = 60;

/* Comptes de départ : même code que le code d'accès unique en place avant les comptes
   (empreinte reprise de js/config.js). À changer ensuite dans Réglages. */
const START = { iter: 150000, salt: 'd596293b7e885a0a', hash: 'e0efdc7e05bae5f0493d5ce649491c6e198b4db4a85565870d69b2ec66f956d4' };
const START_USERS = [['antoine', 'Antoine', 'tech'], ['frederic', 'Frédéric', 'tech'], ['audric', 'Audric', 'tech'], ['sophie', 'Sophie', 'admin']];

const json = (body, status) => new Response(JSON.stringify(body), {
  status: status || 200,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' }
});
const fail = (status, error, extra) => json(Object.assign({ error }, extra || {}), status);

async function read(path) {
  try {
    const r = await get(path, { access: 'private', useCache: false });
    if (!r || r.statusCode !== 200 || !r.stream) return null;
    return JSON.parse(await new Response(r.stream).text());
  } catch (e) {
    if (e && (e.name === 'BlobNotFoundError' || /not found/i.test(String(e.message)))) return null;
    throw e;
  }
}
const write = (path, obj) => put(path, JSON.stringify(obj), { access: 'private', allowOverwrite: true, addRandomSuffix: false, contentType: 'application/json' });

function startAccounts() {
  return { v: 1, clientsAt: 0, users: START_USERS.map(u => ({ id: u[0], name: u[1], role: u[2], salt: START.salt, iter: START.iter, hash: START.hash, cv: 1, fails: 0, until: 0 })) };
}
async function accounts() { return (await read(F_ACCOUNTS)) || startAccounts(); }

const hashCode = (code, salt, iter) => crypto.pbkdf2Sync(String(code), salt, iter, 32, 'sha256').toString('hex');
const sameHex = (a, b) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'));
function setCode(user, code) {
  user.salt = crypto.randomBytes(16).toString('hex');
  user.iter = ITER;
  user.hash = hashCode(code, user.salt, ITER);
  user.cv = (user.cv || 1) + 1; // toute session ouverte avec l'ancien code devient invalide
  user.fails = 0; user.until = 0;
}

/* Sessions : jeton signé, sans stockage. La clé de signature dérive du secret du stockage. */
const signKey = () => crypto.createHash('sha256').update('olympe-chantier|session|' + (process.env.BLOB_READ_WRITE_TOKEN || '')).digest();
const b64 = s => Buffer.from(s).toString('base64url');
function makeToken(user) {
  const p = b64(JSON.stringify({ u: user.id, cv: user.cv || 1, exp: Date.now() + SESSION_DAYS * 86400000 }));
  return p + '.' + crypto.createHmac('sha256', signKey()).update(p).digest('base64url');
}
function readToken(token, acc) {
  if (typeof token !== 'string' || token.indexOf('.') < 0) return null;
  const [p, sig] = token.split('.');
  const good = crypto.createHmac('sha256', signKey()).update(p).digest('base64url');
  if (sig.length !== good.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good))) return null;
  let data;
  try { data = JSON.parse(Buffer.from(p, 'base64url').toString('utf8')); } catch (e) { return null; }
  if (!data || data.exp < Date.now()) return null;
  const user = acc.users.find(u => u.id === data.u);
  return user && (user.cv || 1) === data.cv ? user : null;
}

const pub = u => ({ id: u.id, name: u.name, role: u.role });
const validCode = c => typeof c === 'string' && /^\d{6}$/.test(c);
const cleanName = n => String(n || '').replace(/\s+/g, ' ').trim().slice(0, 30);
const slug = n => n.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const str = (v, max) => (typeof v === 'string' ? v : '').slice(0, max);

function cleanRows(rows) {
  if (!Array.isArray(rows) || rows.length > 40000) return null;
  return rows.map(r => ({
    n: str(r && r.n, 80), p: str(r && r.p, 80), c: str(r && r.c, 30), t: str(r && r.t, 40), e: str(r && r.e, 120),
    a: (Array.isArray(r && r.a) ? r.a : []).slice(0, 4).map(x => [str(x && x[0], 20), str(x && x[1], 300), str(x && x[2], 80)])
  })).filter(r => r.n || r.p);
}

export async function POST(request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return fail(503, 'Stockage non configuré.');
  if ((request.headers.get('content-type') || '').indexOf('application/json') !== 0) return fail(415, 'Format non accepté.');
  let b;
  try { b = await request.json(); } catch (e) { return fail(400, 'Requête illisible.'); }
  const a = b && b.a;

  try {
    const acc = await accounts();

    /* Liste des prénoms pour l'écran de connexion (aucune autre information). */
    if (a === 'comptes') return json({ users: acc.users.map(u => ({ id: u.id, name: u.name })) });

    if (a === 'login') {
      const user = acc.users.find(u => u.id === b.id);
      if (!user || !validCode(b.code)) return fail(401, 'Code incorrect.');
      const now = Date.now();
      if (user.until > now) return fail(429, 'Trop d’essais.', { wait: Math.ceil((user.until - now) / 1000) });
      if (!sameHex(hashCode(b.code, user.salt, user.iter), user.hash)) {
        user.fails = (user.fails || 0) + 1;
        let wait = 0;
        if (user.fails % 5 === 0) { wait = Math.min(3600, 60 * Math.pow(2, user.fails / 5 - 1)); user.until = now + wait * 1000; }
        await write(F_ACCOUNTS, acc);
        return fail(wait ? 429 : 401, wait ? 'Trop d’essais.' : 'Code incorrect.', wait ? { wait } : null);
      }
      if (user.fails || user.until) { user.fails = 0; user.until = 0; await write(F_ACCOUNTS, acc); }
      return json({ user: pub(user), token: makeToken(user) });
    }

    /* Toutes les autres actions demandent une session valide. */
    const me = readToken(b.token, acc);
    if (!me) return fail(401, 'Session expirée.');
    const admin = me.role === 'admin';

    if (a === 'sync') {
      const out = { user: pub(me), users: acc.users.map(u => ({ id: u.id, name: u.name })), clientsAt: acc.clientsAt || 0 };
      if ((acc.clientsAt || 0) > (Number(b.since) || 0)) {
        const c = await read(F_CLIENTS);
        if (c && Array.isArray(c.rows)) { out.clients = c.rows; out.clientsAt = c.at; }
      }
      return json(out);
    }

    if (a === 'code') { // changer son propre code, ou celui d'un autre si on est le bureau
      const target = acc.users.find(u => u.id === (b.id || me.id));
      if (!target || (target.id !== me.id && !admin)) return fail(403, 'Action réservée au bureau.');
      if (!validCode(b.code)) return fail(400, 'Le code doit comporter 6 chiffres.');
      setCode(target, b.code);
      await write(F_ACCOUNTS, acc);
      return json({ ok: true, token: target.id === me.id ? makeToken(target) : undefined });
    }

    if (!admin) return fail(403, 'Action réservée au bureau.');

    if (a === 'users') return json({ users: acc.users.map(pub) });

    if (a === 'users.add') {
      const name = cleanName(b.name);
      if (!name || !validCode(b.code)) return fail(400, 'Indiquez un prénom et un code à 6 chiffres.');
      if (acc.users.length >= 30) return fail(400, 'Nombre maximal de comptes atteint.');
      if (acc.users.some(u => u.name.toLowerCase() === name.toLowerCase())) return fail(409, 'Ce prénom existe déjà.');
      let id = slug(name) || 'compte';
      while (acc.users.some(u => u.id === id)) id += '-' + crypto.randomBytes(2).toString('hex');
      const user = { id, name, role: b.role === 'admin' ? 'admin' : 'tech', cv: 0, fails: 0, until: 0 };
      setCode(user, b.code);
      acc.users.push(user);
      await write(F_ACCOUNTS, acc);
      return json({ users: acc.users.map(pub) });
    }

    if (a === 'users.del') {
      const target = acc.users.find(u => u.id === b.id);
      if (!target) return fail(404, 'Compte introuvable.');
      if (target.id === me.id) return fail(400, 'Vous ne pouvez pas supprimer votre propre compte.');
      acc.users = acc.users.filter(u => u.id !== target.id);
      await write(F_ACCOUNTS, acc);
      return json({ users: acc.users.map(pub) });
    }

    if (a === 'clients.put') {
      const rows = cleanRows(b.rows);
      if (!rows || !rows.length) return fail(400, 'Liste de clients vide ou illisible.');
      const at = Date.now();
      await write(F_CLIENTS, { at, by: me.name, rows });
      acc.clientsAt = at;
      await write(F_ACCOUNTS, acc);
      return json({ ok: true, at, count: rows.length });
    }

    if (a === 'clients.del') {
      const at = Date.now();
      await write(F_CLIENTS, { at, by: me.name, rows: [] });
      acc.clientsAt = at;
      await write(F_ACCOUNTS, acc);
      return json({ ok: true, at });
    }

    return fail(400, 'Action inconnue.');
  } catch (e) {
    console.error('chantier', a, e && e.message);
    return fail(500, 'Erreur du serveur. Réessayez dans un instant.');
  }
}

export function GET() {
  return fail(405, 'Méthode non acceptée.');
}
