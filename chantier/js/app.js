/* Moteur de l'outil : accueil, parcours pas à pas, signature, envoi.
   Les documents eux-mêmes sont décrits dans les fichiers doc-*.js. */
(function () {
  'use strict';

  const O = window.OLYMPE;
  const app = document.getElementById('app');
  const layer = document.getElementById('layer');
  let cleanup = null; // fonction appelée en quittant un écran

  /* ---------- Petits outils ---------- */

  function el(tag, props, ...kids) {
    const n = document.createElement(tag);
    if (props) {
      for (const k of Object.keys(props)) {
        const v = props[k];
        if (v == null || v === false) continue;
        if (k === 'class') n.className = v;
        else if (k === 'html') n.innerHTML = v;
        else if (k === 'value') n.value = v;
        else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), v);
        else n.setAttribute(k, v === true ? '' : v);
      }
    }
    for (const kid of kids.flat(Infinity)) {
      if (kid == null || kid === false) continue;
      n.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return n;
  }

  const svg = (d, extra) => '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ' + (extra || '') + '>' + d + '</svg>';
  const ICON = {
    shield: svg('<path d="M12 3l7.5 3v5.6c0 4.5-3 8.1-7.5 9.4-4.500-1.300-7.500-4.900-7.500-9.400V6L12 3z"/><path d="M8.800 12.200l2.300 2.300 4.200-4.600"/>'),
    clipboard: svg('<rect x="5" y="4.500" width="14" height="16.500" rx="2.200"/><path d="M9 4.500V4a1.500 1.500 0 0 1 1.500-1.500h3A1.500 1.500 0 0 1 15 4v.500"/><path d="M8.800 13.200l2.200 2.200 4.200-4.400"/>'),
    drop: svg('<path d="M12 3.200s6.200 6.300 6.200 10.800a6.200 6.200 0 0 1-12.400 0C5.800 9.500 12 3.200 12 3.200z"/><path d="M9.200 14.400a2.900 2.900 0 0 0 2.300 2.700"/>'),
    right: svg('<path d="M9 5.500l6.500 6.500L9 18.500"/>'),
    left: svg('<path d="M15 5.500L8.500 12l6.500 6.500"/>'),
    close: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
    check: svg('<path d="M5 12.500l4.500 4.500L19 7.500"/>', 'stroke-width="2.6"'),
    pen: svg('<path d="M4 20l1-4.200L16.300 4.500a1.800 1.800 0 0 1 2.600 0l.600.600a1.800 1.800 0 0 1 0 2.600L8.200 19 4 20z"/><path d="M14.500 6.300l3.200 3.200"/>'),
    file: svg('<path d="M7 3h7l5 5v11.500A1.500 1.500 0 0 1 17.500 21h-10.500A1.500 1.500 0 0 1 5.500 19.500v-15A1.500 1.500 0 0 1 7 3z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 16.500h4"/>'),
    mail: svg('<rect x="3" y="5" width="18" height="14" rx="2.200"/><path d="M3.500 7l8.500 6.200L20.500 7"/>'),
    download: svg('<path d="M12 4v11"/><path d="M7.500 11l4.500 4.500 4.500-4.500"/><path d="M5 19.500h14"/>'),
    eye: svg('<path d="M2.500 12s3.500-6.500 9.500-6.500 9.500 6.500 9.500 6.500-3.500 6.500-9.500 6.500S2.500 12 2.500 12z"/><circle cx="12" cy="12" r="2.800"/>'),
    trash: svg('<path d="M4.500 7h15"/><path d="M9.500 7V4.800h5V7"/><path d="M6.500 7l.800 12.200a1.500 1.500 0 0 0 1.500 1.300h6.400a1.500 1.500 0 0 0 1.500-1.300L17.500 7"/>'),
    alert: svg('<path d="M12 4l9 15.500H3L12 4z"/><path d="M12 10v4.500"/><path d="M12 17.200v.100"/>'),
    done: svg('<circle cx="12" cy="12" r="9"/><path d="M8 12.300l2.800 2.800L16.200 9.500"/>'),
    plus: svg('<path d="M12 5.500v13M5.500 12h13"/>'),
    gear: svg('<circle cx="12" cy="12" r="3"/><path d="M12 3v2.500M12 18.500V21M3 12h2.500M18.500 12H21M5.600 5.600l1.800 1.800M16.600 16.600l1.800 1.800M5.600 18.400l1.800-1.800M16.600 7.400l1.800-1.800"/>'),
    users: svg('<circle cx="9" cy="8.500" r="3.200"/><path d="M3 19.500c.400-3.300 2.900-5.300 6-5.300s5.600 2 6 5.300"/><path d="M15.500 5.600a3.200 3.200 0 0 1 0 5.800"/><path d="M17.500 14.600c2 .600 3.200 2.300 3.500 4.900"/>'),
    search: svg('<circle cx="10.500" cy="10.500" r="6"/><path d="M15 15l5 5"/>'),
    back: svg('<path d="M9 5.500h10.500A1.500 1.500 0 0 1 21 7v10a1.500 1.500 0 0 1-1.500 1.500H9L3 12l6-6.500z"/><path d="M12 9.500l5 5M17 9.500l-5 5"/>'),
    camera: svg('<path d="M4.500 8h3l1.500-2.200h6L16.500 8h3A1.500 1.500 0 0 1 21 9.500v8A1.500 1.500 0 0 1 19.500 19h-15A1.500 1.500 0 0 1 3 17.500v-8A1.500 1.500 0 0 1 4.500 8z"/><circle cx="12" cy="13.200" r="3.300"/>'),
    tasks: svg('<path d="M4 6.500l1.600 1.600L8.500 5"/><path d="M4 12.500l1.600 1.600L8.500 11"/><path d="M4 18.500l1.600 1.600L8.500 17"/><path d="M12 6.500h8M12 12.500h8M12 18.500h8"/>')
  };
  const icon = (name, cls) => el('span', { class: 'ic' + (cls ? ' ' + cls : ''), html: ICON[name] });

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* stockage indisponible */ } }
  };
  // un brouillon appartient au compte connecté ; sans comptes, il est commun à l'appareil
  const draftKey = id => 'olympe.brouillon.' + (me ? me.id + '.' : '') + id;
  const loadDraft = id => store.get(draftKey(id), null);
  let fullWarned = false;
  const saveDraft = d => {
    d.updatedAt = Date.now();
    if (!store.set(draftKey(d.id), d) && !fullWarned) {
      fullWarned = true;
      toast('Mémoire pleine : retirez des photos');
    }
  };
  const dropDraft = id => store.del(draftKey(id));
  const activeSteps = (doc, data) => doc.steps.filter(s => !s.when || s.when(data));
  const flatFields = fields => fields.flatMap(f => f.type === 'row' ? f.fields : [f]);

  const go = hash => { if (location.hash === hash) route(); else location.hash = hash; };
  const stepHash = (id, i) => '#/d/' + id + '/' + i;

  function toast(text) {
    const t = el('div', { class: 'toast', role: 'status' }, text);
    layer.append(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 250); }, 2600);
  }

  function openSheet(o) {
    const close = () => { wrap.classList.remove('show'); setTimeout(() => wrap.remove(), 200); };
    const wrap = el('div', { class: 'sheet-wrap', onclick: e => { if (e.target === wrap) close(); } },
      el('div', { class: 'sheet', role: 'dialog', 'aria-modal': 'true', 'aria-label': o.title },
        el('div', { class: 'sheet-grip' }),
        el('h2', { class: 'sheet-title' }, o.title),
        o.text && el('p', { class: 'sheet-text' }, o.text),
        el('div', { class: 'sheet-actions' }, o.actions.map(a =>
          el('button', { type: 'button', class: 'btn ' + (a.kind || 'ghost'), onclick: () => { close(); a.onClick && a.onClick(); } }, a.label)))
      ));
    layer.append(wrap);
    requestAnimationFrame(() => wrap.classList.add('show'));
  }

  /* ---------- Signature au doigt ---------- */

  function openSignature(o) {
    let strokes = [], cur = null, box = { w: 1, h: 1 };
    const canvas = el('canvas', { class: 'sig-canvas' });
    const ctx = canvas.getContext('2d');
    const hint = el('div', { class: 'sig-hint' }, 'Signez dans ce cadre');
    const area = el('div', { class: 'sig-area' }, canvas, el('div', { class: 'sig-line' }), hint);
    const clearBtn = el('button', { type: 'button', class: 'btn ghost', disabled: true, onclick: clear }, 'Effacer');
    const okBtn = el('button', { type: 'button', class: 'btn primary', disabled: true, onclick: validate }, 'Valider la signature');
    const modal = el('div', { class: 'sig-modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': o.title },
      el('div', { class: 'sig-head' },
        el('div', { class: 'sig-heading' },
          el('div', { class: 'sig-title' }, o.title),
          o.signer && el('div', { class: 'sig-signer' }, o.signer)),
        el('button', { type: 'button', class: 'icon-btn dark', 'aria-label': 'Fermer', onclick: close }, icon('close'))),
      area,
      el('div', { class: 'sig-foot' }, clearBtn, okBtn));

    function setup() {
      const r = area.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      box = { w: r.width, h: r.height, dpr };
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      redraw();
    }
    function style(c, scale) {
      c.lineCap = 'round'; c.lineJoin = 'round';
      c.strokeStyle = '#10213F'; c.fillStyle = '#10213F';
      c.lineWidth = 2.6 * scale;
    }
    function drawStroke(c, pts, sx, sy, scale) {
      style(c, scale);
      if (pts.length === 1) {
        c.beginPath(); c.arc(pts[0].x * sx, pts[0].y * sy, 1.5 * scale, 0, Math.PI * 2); c.fill();
        return;
      }
      c.beginPath();
      c.moveTo(pts[0].x * sx, pts[0].y * sy);
      for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2 * sx, my = (pts[i].y + pts[i + 1].y) / 2 * sy;
        c.quadraticCurveTo(pts[i].x * sx, pts[i].y * sy, mx, my);
      }
      const last = pts[pts.length - 1];
      c.lineTo(last.x * sx, last.y * sy);
      c.stroke();
    }
    function redraw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const all = cur ? strokes.concat([cur]) : strokes;
      for (const s of all) drawStroke(ctx, s, canvas.width, canvas.height, box.dpr);
    }
    function point(e) {
      const r = canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
    }
    function refresh() {
      const has = strokes.length > 0;
      clearBtn.disabled = !has; okBtn.disabled = !has;
      hint.classList.toggle('hidden', has || !!cur);
    }
    canvas.addEventListener('pointerdown', e => {
      e.preventDefault();
      try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* sans importance */ }
      cur = [point(e)];
      refresh(); redraw();
    });
    canvas.addEventListener('pointermove', e => {
      if (!cur) return;
      e.preventDefault();
      const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      for (const ev of (events.length ? events : [e])) cur.push(point(ev));
      redraw();
    });
    const end = () => { if (!cur) return; strokes.push(cur); cur = null; refresh(); redraw(); };
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);

    function clear() { strokes = []; cur = null; refresh(); redraw(); }
    function close() {
      window.removeEventListener('resize', setup);
      document.body.classList.remove('locked');
      modal.remove();
    }
    function validate() {
      // Recadre la signature sur son tracé pour un PDF léger
      let x0 = 1, y0 = 1, x1 = 0, y1 = 0;
      for (const s of strokes) for (const p of s) {
        x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y);
      }
      const pad = 10;
      const px0 = Math.max(0, x0 * box.w - pad), py0 = Math.max(0, y0 * box.h - pad);
      const pw = Math.min(box.w, x1 * box.w + pad) - px0, ph = Math.min(box.h, y1 * box.h + pad) - py0;
      const scale = Math.min(3, 900 / Math.max(pw, 1));
      const out = document.createElement('canvas');
      out.width = Math.max(1, Math.round(pw * scale));
      out.height = Math.max(1, Math.round(ph * scale));
      const c = out.getContext('2d');
      c.translate(-px0 * scale, -py0 * scale);
      for (const s of strokes) drawStroke(c, s, box.w * scale, box.h * scale, scale);
      const sig = { data: out.toDataURL('image/png'), w: out.width, h: out.height, at: new Date().toISOString() };
      close();
      o.onDone(sig);
    }

    layer.append(modal);
    document.body.classList.add('locked');
    window.addEventListener('resize', setup);
    setup();
  }

  /* ---------- Accueil ---------- */

  function renderHome() {
    const c = O.company;
    const drafts = O.catalog.map(item => ({ item, doc: O.docs[item.id], draft: loadDraft(item.id) }))
      .filter(x => x.doc && x.draft);

    const isReady = item => !!O.docs[item.id] && !item.soon;
    const ready = O.catalog.filter(isReady);
    const soon = O.catalog.filter(item => !isReady(item));
    const card = item => el('button', {
      type: 'button', class: 'doc-card' + (isReady(item) ? '' : ' soon'), disabled: !isReady(item),
      onclick: () => startDoc(item.id)
    },
      icon(item.icon, 'doc-ic'),
      el('span', { class: 'doc-text' },
        el('span', { class: 'doc-title' }, item.title),
        el('span', { class: 'doc-desc' }, item.desc)),
      isReady(item) ? icon('right', 'doc-go') : null);

    const view = el('main', { class: 'view home' },
      el('header', { class: 'hero' },
        el('div', { class: 'hero-in' },
          el('img', { class: 'hero-logo', src: 'assets/logo.png', alt: c.name, width: '76', height: '76' }),
          el('h1', { class: 'hero-title' }, 'Documents de chantier'),
          el('p', { class: 'hero-sub' }, 'Choisissez le document à remplir.'),
          me ? el('button', { type: 'button', class: 'hero-user', onclick: accountSheet },
            el('span', { class: 'who-ini small' }, me.name.slice(0, 1).toUpperCase()),
            el('span', null, me.name + ' · Mon compte')) : null),
        el('div', { class: 'hero-wave', html: '<svg viewBox="0 0 400 28" preserveAspectRatio="none" aria-hidden="true"><path d="M0 14c40 0 40-10 80-10s40 10 80 10 40-10 80-10 40 10 80 10 40-10 80-10v24H0z" fill="currentColor"/></svg>' })),

      el('div', { class: 'home-body' },
        drafts.length ? el('section', { class: 'home-section' },
          el('h2', { class: 'home-label' }, 'En cours'),
          drafts.map(({ doc, draft }) => {
            const total = activeSteps(doc, draft.data).length + 1;
            const step = Math.min(draft.step || 0, total - 1);
            return el('div', { class: 'draft' },
              el('button', { type: 'button', class: 'draft-main', onclick: () => go(stepHash(doc.id, step)) },
                el('span', { class: 'draft-text' },
                  el('span', { class: 'draft-title' }, doc.draftLabel(draft.data)),
                  el('span', { class: 'draft-sub' }, doc.title),
                  el('span', { class: 'draft-sub' }, 'Étape ' + (step + 1) + ' sur ' + total)),
                el('span', { class: 'draft-cta' }, 'Reprendre')),
              el('button', {
                type: 'button', class: 'draft-del', 'aria-label': 'Supprimer le brouillon',
                onclick: () => openSheet({
                  title: 'Supprimer ce brouillon ?',
                  text: 'Les informations saisies et les signatures seront effacées.',
                  actions: [
                    { label: 'Supprimer', kind: 'danger', onClick: () => { dropDraft(doc.id); renderHome(); } },
                    { label: 'Annuler' }
                  ]
                })
              }, icon('trash')));
          })) : null,

        el('section', { class: 'home-section' },
          drafts.length ? el('h2', { class: 'home-label' }, 'Nouveau document') : null,
          ready.map(card)),

        soon.length ? el('section', { class: 'home-section' },
          el('h2', { class: 'home-label' }, 'Bientôt disponibles'),
          soon.map(card)) : null,

        settingsEntry()),

      el('footer', { class: 'home-foot' },
        el('div', { class: 'foot-name' }, c.name),
        el('div', null, c.address.join(' · ')),
        el('div', null, c.phone + ' · ' + c.email),
        O.version ? el('div', { class: 'foot-version' }, 'Version ' + O.version) : null));

    show(view);
  }

  /* ---------- Fichier clients (export Extrabat) ---------- */

  const dayMonthYear = ms => {
    const t = new Date(ms), p = n => String(n).padStart(2, '0');
    return p(t.getDate()) + '/' + p(t.getMonth() + 1) + '/' + t.getFullYear();
  };
  const thousands = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  function clientsState() {
    const info = O.clients.info();
    if (info && info.unreadable) return { text: 'À réimporter', late: true };
    if (!info || !info.count) return { text: 'Aucun fichier importé', late: false };
    const days = Math.floor((Date.now() - info.at) / 86400000);
    const when = days <= 0 ? 'aujourd’hui' : days === 1 ? 'hier' : 'il y a ' + days + ' jours';
    return {
      text: thousands(info.count) + ' client' + (info.count > 1 ? 's' : '') + ' · mis à jour ' + when,
      late: days > 30
    };
  }

  /* Entrée « Réglages » de l'accueil : réservée au bureau quand l'outil a des comptes */
  function settingsEntry() {
    const state = clientsState();
    if (O.api && (!me || me.role !== 'admin')) {
      return el('p', { class: 'home-info' + (state.late ? ' late' : '') }, 'Fichier clients : ' + state.text);
    }
    return el('section', { class: 'home-section' },
      el('h2', { class: 'home-label' }, 'Réglages'),
      el('button', { type: 'button', class: 'doc-card slim', onclick: () => go(O.api ? '#/reglages' : '#/clients') },
        icon(O.api ? 'gear' : 'users', 'doc-ic'),
        el('span', { class: 'doc-text' },
          el('span', { class: 'doc-title' }, O.api ? 'Réglages' : 'Fichier clients'),
          el('span', { class: 'doc-desc' + (state.late ? ' late' : '') }, O.api ? 'Fichier clients · ' + state.text : state.text)),
        icon('right', 'doc-go')));
  }

  function renderClients() {
    const C = O.clients;
    if (O.api && (!me || me.role !== 'admin')) return go('#/');
    let pending = null, busy = false, problem = '';
    const body = el('div', { class: 'step' });
    const fileInput = el('input', { type: 'file', accept: '.csv,text/csv,text/plain,application/vnd.ms-excel', hidden: true });
    const view = el('main', { class: 'view wizard' },
      el('header', { class: 'topbar' },
        el('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Retour', onclick: () => go(O.api ? '#/reglages' : '#/') }, icon('left')),
        el('div', { class: 'topbar-title' }, 'Fichier clients'),
        el('span', { class: 'icon-btn' })),
      body, fileInput);

    const stepRow = (n, title, text) => el('li', { class: 'howto-step' },
      el('span', { class: 'read-num' }, String(n)),
      el('div', null, el('div', { class: 'howto-title' }, title), el('div', { class: 'howto-text' }, text)));

    function paint() {
      const info = C.info(), kids = [];
      kids.push(el('h1', { class: 'step-title', tabindex: '-1' }, 'Fichier clients'));
      kids.push(el('p', { class: 'step-lead' }, 'Pour retrouver un client en tapant son nom, sans ressaisir son adresse, son téléphone et son e-mail.'));

      if (pending) {
        const n = pending.rows.length;
        kids.push(el('div', { class: 'file-card' },
          icon('users', 'file-ic ok'),
          el('div', { class: 'file-text' },
            el('div', { class: 'file-name' }, thousands(n) + ' client' + (n > 1 ? 's' : '') + ' reconnu' + (n > 1 ? 's' : '')),
            el('div', { class: 'file-meta' }, 'Vérifiez, puis enregistrez la liste.'))));
        kids.push(el('ul', { class: 'found' }, pending.found.map(([label, ok]) =>
          el('li', { class: ok ? 'yes' : 'no' }, icon(ok ? 'check' : 'close'), el('span', null, label + (ok ? '' : ' : colonne absente du fichier'))))));
        kids.push(el('div', { class: 'stack' },
          el('button', { type: 'button', class: 'btn primary block', disabled: busy, onclick: save }, 'Enregistrer la liste'),
          el('button', { type: 'button', class: 'btn ghost block', onclick: () => { pending = null; paint(); } }, 'Annuler')));
      } else {
        const state = clientsState();
        kids.push(el('div', { class: 'file-card' },
          icon('users', 'file-ic' + (info && info.count ? ' ok' : '')),
          el('div', { class: 'file-text' },
            el('div', { class: 'file-name' }, info && info.count ? thousands(info.count) + ' client' + (info.count > 1 ? 's' : '') + (O.api ? ' partagé' + (info.count > 1 ? 's' : '') + ' avec l’équipe' : ' dans ce téléphone') : 'Aucun fichier importé'),
            el('div', { class: 'file-meta' }, info && info.unreadable ? 'Le code d’accès a changé : la liste est à réimporter.'
              : info && info.count ? 'Mis à jour le ' + dayMonthYear(info.at) + (state.late ? ' · à mettre à jour' : '')
                : 'Suivez les trois étapes ci-dessous.'))));
        if (problem) kids.push(el('div', { class: 'note warning' }, icon('alert'), el('div', null, el('div', { class: 'note-title' }, 'Import impossible'), el('div', { class: 'note-text' }, problem))));
        kids.push(el('div', { class: 'statement' },
          el('div', { class: 'statement-title' }, 'Mode d’emploi'),
          el('ol', { class: 'howto' },
            stepRow(1, 'Dans Extrabat', 'Menu Exports, puis Clients.'),
            stepRow(2, 'Exporter', 'Format export : « Format CSV ». Puis bouton Valider.'),
            stepRow(3, 'Dans cet outil', 'Touchez « Importer le fichier » et choisissez le fichier obtenu.'))));
        kids.push(el('div', { class: 'stack' },
          el('button', { type: 'button', class: 'btn primary block', disabled: busy, onclick: () => fileInput.click() }, busy ? 'Lecture du fichier…' : 'Importer le fichier'),
          info && info.count ? el('button', {
            type: 'button', class: 'btn ghost block', onclick: () => openSheet({
              title: O.api ? 'Supprimer la liste pour toute l’équipe ?' : 'Supprimer la liste de ce téléphone ?',
              text: 'La recherche de clients ne sera plus proposée tant qu’un fichier n’aura pas été réimporté.',
              actions: [{ label: 'Supprimer', kind: 'danger', onClick: () => (O.api ? api('clients.del') : Promise.resolve()).then(() => C.remove()).then(paint).catch(e => { problem = e.status ? e.message : 'Pas de connexion Internet : la liste n’a pas été supprimée.'; paint(); }) }, { label: 'Annuler' }]
            })
          }, 'Supprimer la liste') : null));
        kids.push(el('p', { class: 'field-hint' }, O.api
          ? 'À refaire régulièrement, par exemple une fois par mois : la nouvelle liste remplace l’ancienne. Elle est envoyée automatiquement aux téléphones de l’équipe, qui n’ont rien à faire.'
          : 'À refaire régulièrement, par exemple une fois par mois : la nouvelle liste remplace l’ancienne. Elle reste dans ce téléphone, protégée par le code d’accès, et n’est envoyée nulle part.'));
      }
      body.replaceChildren(...kids.filter(Boolean));
    }

    function save() {
      busy = true; paint();
      const rows = pending.rows.map(r => ({ n: r.n, p: r.p, c: r.c, t: r.t, e: r.e, a: r.a }));
      (O.api ? api('clients.put', { rows: rows }).then(r => C.save(rows, r.at)) : C.save(rows)).then(() => {
        const n = pending.rows.length;
        pending = null; busy = false; problem = '';
        paint();
        toast(O.api ? 'Liste envoyée à l’équipe' : thousands(n) + ' clients enregistrés');
      }).catch(e => { busy = false; pending = null; problem = (O.api && !e.status) ? 'Pas de connexion Internet : la liste n’a pas été envoyée. Réessayez.' : (e.message || 'La liste n’a pas pu être enregistrée.'); paint(); });
    }

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      fileInput.value = '';
      if (!file) return;
      busy = true; problem = ''; paint();
      C.read(file).then(res => { busy = false; pending = res; paint(); window.scrollTo(0, 0); })
        .catch(e => { busy = false; problem = e.message || 'Ce fichier n’a pas pu être lu.'; paint(); });
    });

    paint();
    show(view);
  }

  function startDoc(id) {
    const doc = O.docs[id];
    if (!doc) return;
    const begin = () => {
      saveDraft({ id, step: 0, data: doc.defaults ? doc.defaults() : {} });
      go(stepHash(id, 0));
    };
    const draft = loadDraft(id);
    if (!draft) return begin();
    openSheet({
      title: 'Un document est déjà en cours',
      text: doc.draftLabel(draft.data) + ' · ' + doc.title,
      actions: [
        { label: 'Reprendre le document en cours', kind: 'primary', onClick: () => go(stepHash(id, draft.step || 0)) },
        { label: 'En commencer un nouveau', onClick: begin }
      ]
    });
  }

  /* ---------- Parcours pas à pas ---------- */

  function isEmpty(v) {
    return v == null || v === false || (typeof v === 'string' && !v.trim()) || (Array.isArray(v) && !v.length);
  }
  function validateStep(step, data) {
    const errors = {};
    for (const f of flatFields(step.fields)) {
      if (!f.name || (f.when && !f.when(data))) continue;
      const v = data[f.name];
      if (f.type === 'list') {
        const items = Array.isArray(v) ? v : [];
        const label = f.itemLabel || 'Ligne';
        if (items.length < (f.min || 0)) { errors[f.name] = f.error || 'Ajoutez au moins un élément.'; continue; }
        const bad = items.findIndex(it => f.fields.some(sf => sf.required && isEmpty(it[sf.name])));
        if (bad >= 0) errors[f.name] = label + ' ' + (bad + 1) + ' : complétez-la ou supprimez-la.';
        continue;
      }
      if (f.type === 'number' && !isEmpty(v) && !/^\d+([.,]\d+)?$/.test(String(v).trim())) {
        errors[f.name] = 'Indiquez un nombre.';
        continue;
      }
      if (f.required && isEmpty(v)) {
        errors[f.name] = f.error || (f.type === 'signature' ? 'La signature est nécessaire pour continuer.'
          : f.type === 'choice' ? 'Sélectionnez une réponse.' : 'Ce champ est à renseigner.');
      } else if (f.type === 'email' && !isEmpty(v) && !/^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]{2,}$/.test(v.trim())) {
        errors[f.name] = 'Cette adresse e-mail semble incomplète.';
      }
    }
    return errors;
  }

  function renderWizard(doc, idx) {
    let draft = loadDraft(doc.id);
    if (!draft) { draft = { id: doc.id, step: 0, data: doc.defaults ? doc.defaults() : {} }; saveDraft(draft); }
    const data = draft.data;
    const steps = activeSteps(doc, data);
    const total = steps.length + 1;
    idx = Math.max(0, Math.min(idx, total - 1));

    // On ne saute pas une étape incomplète
    for (let i = 0; i < idx; i++) {
      if (Object.keys(validateStep(steps[i], data)).length) {
        return location.replace(stepHash(doc.id, i));
      }
    }
    if (draft.step !== idx) { draft.step = idx; saveDraft(draft); }

    let saveTimer = null;
    const flush = () => { if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; saveDraft(draft); } };
    const queueSave = () => { clearTimeout(saveTimer); saveTimer = setTimeout(() => { saveTimer = null; saveDraft(draft); }, 250); };

    const isFinal = idx === steps.length;
    const step = isFinal ? null : steps[idx];

    const topbar = el('header', { class: 'topbar' },
      el('button', {
        type: 'button', class: 'icon-btn', 'aria-label': idx === 0 ? 'Retour à l’accueil' : 'Étape précédente',
        onclick: () => { flush(); idx === 0 ? go('#/') : go(stepHash(doc.id, idx - 1)); }
      }, icon('left')),
      el('div', { class: 'topbar-title' }, doc.title),
      el('button', {
        type: 'button', class: 'icon-btn', 'aria-label': 'Fermer et reprendre plus tard',
        onclick: () => { flush(); go('#/'); toast('Brouillon enregistré'); }
      }, icon('close')));

    const progress = el('div', { class: 'progress', role: 'progressbar', 'aria-valuemin': '1', 'aria-valuemax': String(total), 'aria-valuenow': String(idx + 1) },
      el('div', { class: 'progress-track' }, el('div', { class: 'progress-bar', style: 'width:' + ((idx + 1) / total * 100) + '%' })),
      el('div', { class: 'progress-label' }, 'Étape ' + (idx + 1) + ' sur ' + total));

    const body = el('div', { class: 'step' });
    const bottom = el('div', { class: 'bottombar' });
    const view = el('main', { class: 'view wizard' }, topbar, progress, body, bottom);

    if (isFinal) {
      renderFinal(doc, draft, body, bottom);
      show(view);
      return;
    }

    const title = el('h1', { class: 'step-title', tabindex: '-1' }, step.title);
    body.append(title);
    if (step.lead) body.append(el('p', { class: 'step-lead' }, step.lead));

    const nodes = []; // { f, node, setError }
    const refreshVisibility = () => {
      for (const n of nodes) n.node.hidden = !!(n.f.when && !n.f.when(data));
    };
    const update = (name, value) => {
      data[name] = value;
      draft.sent = false;
      queueSave();
      refreshVisibility();
      const n = nodes.find(x => x.f.name === name);
      if (!n) return;
      n.setError(null);
      if (n.f.onChange) { // la réponse modifie d'autres champs : on réaffiche l'étape
        n.f.onChange(data, value);
        flush(); saveDraft(draft);
        route();
      }
    };

    const build = f => {
      if (f.type === 'row') return el('div', { class: 'row' }, f.fields.map(build));
      const built = FIELD[f.type](f, data, update);
      const err = el('div', { class: 'field-error', role: 'alert', hidden: true });
      if (f.name) built.append(err);
      nodes.push({
        f, node: built,
        setError(msg) {
          err.hidden = !msg; err.textContent = msg || '';
          built.classList.toggle('has-error', !!msg);
        }
      });
      return built;
    };
    for (const f of step.fields) body.append(build(f));
    refreshVisibility();

    const next = el('button', { type: 'button', class: 'btn primary block' },
      idx === steps.length - 1 ? 'Créer le document' : 'Continuer');
    next.addEventListener('click', () => {
      const errors = validateStep(step, data);
      let first = null;
      for (const n of nodes) {
        const msg = n.f.name ? errors[n.f.name] : null;
        n.setError(msg || null);
        if (msg && !first) first = n.node;
      }
      if (first) {
        first.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const input = first.querySelector('input, textarea');
        if (input) input.focus({ preventScroll: true });
        return;
      }
      flush(); saveDraft(draft);
      go(stepHash(doc.id, idx + 1));
    });
    bottom.append(next);

    cleanup = flush;
    show(view);
    title.focus({ preventScroll: true });
  }

  /* ---------- Types de champs ---------- */

  function labelRow(f, forId) {
    if (!f.label) return null;
    return el('label', { class: 'field-label', for: forId || null },
      f.label, f.optional ? el('span', { class: 'optional' }, 'Facultatif') : null);
  }
  let uid = 0;

  function inputField(f, data, update) {
    const id = 'f' + (++uid);
    const isArea = f.type === 'textarea';
    let value = data[f.name];
    if (isEmpty(value) && f.remember) {
      // avec des comptes, le représentant est la personne connectée
      value = (f.remember === 'tech' && me) ? me.name : store.get('olympe.pref.' + f.remember, '');
      if (value) data[f.name] = value;
    }
    const plain = f.type === 'email' || f.type === 'tel' || f.type === 'number' || f.capitalize === 'words';
    const listId = f.suggestions ? id + 'l' : null;
    const input = el(isArea ? 'textarea' : 'input', {
      id, class: 'input', name: f.name,
      type: isArea ? null : (f.type === 'number' ? 'text' : f.type),
      rows: isArea ? String(f.rows || 3) : null,
      placeholder: f.placeholder || null,
      autocomplete: 'off',
      autocapitalize: f.type === 'email' ? 'none' : (f.capitalize || 'sentences'),
      autocorrect: plain ? 'off' : null,
      spellcheck: plain ? 'false' : null,
      inputmode: f.type === 'email' ? 'email' : f.type === 'tel' ? 'tel' : f.type === 'number' ? 'decimal' : null,
      enterkeyhint: isArea ? null : 'done',
      list: listId,
      value: value || ''
    });
    input.addEventListener('input', () => {
      update(f.name, input.value);
      if (f.remember) store.set('olympe.pref.' + f.remember, input.value.trim());
    });
    if (!isArea) input.addEventListener('keydown', e => { if (e.key === 'Enter') input.blur(); });
    const control = f.unit
      ? el('div', { class: 'input-wrap' }, input, el('span', { class: 'unit' }, f.unit))
      : input;
    return el('div', { class: 'field' }, labelRow(f, id), control,
      listId ? el('datalist', { id: listId }, f.suggestions.map(s => el('option', { value: s }))) : null,
      f.hint ? el('div', { class: 'field-hint' }, f.hint) : null);
  }

  /* Réduit une photo avant de la garder dans le document */
  function shrink(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const r = Math.min(1, 1200 / Math.max(img.naturalWidth, img.naturalHeight));
        const c = document.createElement('canvas');
        c.width = Math.round(img.naturalWidth * r);
        c.height = Math.round(img.naturalHeight * r);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        resolve({ data: c.toDataURL('image/jpeg', 0.68), w: c.width, h: c.height });
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('image')); };
      img.src = url;
    });
  }

  const FIELD = {
    text: inputField, email: inputField, date: inputField, textarea: inputField,
    tel: inputField, time: inputField, number: inputField,

    heading(f) {
      return el('h2', { class: 'sub-title' }, f.text);
    },

    /* Recherche dans le fichier clients : remplit d'un coup les champs du document.
       f.map relie les champs du document : { client, tel, email, adresse, adresseAutre } */
    client(f, data, update) {
      const C = O.clients, m = f.map;
      const input = el('input', {
        class: 'input', type: 'search', placeholder: 'Nom, prénom ou ville', autocomplete: 'off',
        autocapitalize: 'none', autocorrect: 'off', spellcheck: 'false', enterkeyhint: 'search',
        'aria-label': 'Rechercher un client dans le fichier'
      });
      const results = el('div', { class: 'client-results' });
      const apply = (r, addr) => {
        data[m.client] = C.name(r);
        if (m.tel) data[m.tel] = r.t || '';
        if (m.email) data[m.email] = r.e || '';
        if (m.adresse) data[m.adresse] = addr ? addr[1] : '';
        if (m.adresseAutre) {
          const other = r.a.find(x => x[0] === 'Correspondance' && (!addr || x[1] !== addr[1]));
          data[m.adresseAutre] = other ? other[1] : '';
        }
        update(m.client, data[m.client]);
        toast('Fiche client reprise');
        route();
      };
      const pick = r => {
        if (!m.adresse || r.a.length < 2) return apply(r, r.a[0]);
        results.replaceChildren(
          el('div', { class: 'client-ask' }, 'Quelle adresse pour ' + C.name(r) + ' ?'),
          ...r.a.map(a => el('button', { type: 'button', class: 'client-row', onclick: () => apply(r, a) },
            el('span', { class: 'client-name' }, a[0]),
            el('span', { class: 'client-sub' }, a[1].replace(/\n/g, ', ')))));
      };
      input.addEventListener('input', () => {
        const q = input.value.trim();
        const found = C.search(q, 8);
        if (found.length) {
          results.replaceChildren(...found.map(r => el('button', { type: 'button', class: 'client-row', onclick: () => pick(r) },
            el('span', { class: 'client-name' }, [r.n, r.p].filter(Boolean).join(' ')),
            el('span', { class: 'client-sub' }, (r.a[0] ? r.a[0][1].replace(/\n/g, ', ') : (r.t || r.e || 'Sans adresse'))))));
        } else if (q.length >= 2) {
          results.replaceChildren(el('div', { class: 'client-none' }, 'Aucun client trouvé. Remplissez les champs ci-dessous.'));
        } else {
          results.replaceChildren();
        }
      });
      input.addEventListener('keydown', e => { if (e.key === 'Enter') input.blur(); });
      return el('div', { class: 'field client-search' },
        el('div', { class: 'field-label' }, 'Reprendre un client du fichier'),
        el('div', { class: 'input-wrap search' }, icon('search'), input),
        results);
    },

    /* Liste de lignes que l'on ajoute ou supprime (réserves, équipements…) */
    list(f, data, update) {
      const label = f.itemLabel || 'Ligne';
      const get = () => { if (!Array.isArray(data[f.name])) data[f.name] = []; return data[f.name]; };
      const commit = () => update(f.name, get());
      const body = el('div', { class: 'items' });
      const remove = i => {
        const it = get()[i];
        const filled = Object.keys(it).some(k => (typeof it[k] === 'string' && it[k].trim()) || (Array.isArray(it[k]) && it[k].length));
        const doIt = () => { get().splice(i, 1); commit(); paint(); };
        if (!filled) return doIt();
        openSheet({
          title: 'Supprimer « ' + label + ' ' + (i + 1) + ' » ?',
          actions: [{ label: 'Supprimer', kind: 'danger', onClick: doIt }, { label: 'Annuler' }]
        });
      };
      const paint = focusLast => {
        const kids = get().map((it, i) => el('div', { class: 'item' },
          el('div', { class: 'item-head' },
            el('span', { class: 'item-title' }, label + ' ' + (i + 1)),
            el('button', { type: 'button', class: 'item-del', 'aria-label': 'Supprimer ' + label + ' ' + (i + 1), onclick: () => remove(i) }, icon('trash'))),
          f.fields.map(sf => FIELD[sf.type](sf, it, (n, v) => { it[n] = v; commit(); }))));
        if (!kids.length && f.empty) kids.push(el('p', { class: 'items-empty' }, f.empty));
        body.replaceChildren(...kids);
        if (focusLast && body.lastElementChild) {
          const input = body.lastElementChild.querySelector('input, textarea');
          if (input) input.focus();
        }
      };
      const add = el('button', {
        type: 'button', class: 'btn ghost block',
        onclick: () => { get().push(f.newItem ? f.newItem() : {}); commit(); paint(true); }
      }, icon('plus'), el('span', null, f.addLabel || 'Ajouter'));
      paint();
      return el('div', { class: 'field' }, labelRow(f), body, add);
    },

    photos(f, data, update) {
      const max = f.max || 4;
      const get = () => Array.isArray(data[f.name]) ? data[f.name] : [];
      const input = el('input', { type: 'file', accept: 'image/*', multiple: true, hidden: true });
      const grid = el('div', { class: 'photos' });
      const paint = () => {
        const kids = get().map((p, i) => el('div', { class: 'photo' },
          el('img', { src: p.data, alt: 'Photo ' + (i + 1) }),
          el('button', {
            type: 'button', class: 'photo-del', 'aria-label': 'Retirer la photo ' + (i + 1),
            onclick: () => { const l = get().slice(); l.splice(i, 1); update(f.name, l); paint(); }
          }, icon('close'))));
        if (kids.length < max) {
          kids.push(el('button', { type: 'button', class: 'photo-add', onclick: () => input.click() },
            icon('camera'), el('span', null, kids.length ? 'Ajouter' : 'Ajouter une photo')));
        }
        grid.classList.toggle('empty', !get().length);
        grid.replaceChildren(...kids);
      };
      input.addEventListener('change', async () => {
        const files = Array.from(input.files).slice(0, max - get().length);
        input.value = '';
        for (const file of files) {
          try { update(f.name, get().concat(await shrink(file))); paint(); }
          catch (e) { toast('Cette photo n’a pas pu être lue'); }
        }
      });
      paint();
      return el('div', { class: 'field' }, labelRow(f), grid, input);
    },

    choice(f, data, update) {
      const multiple = !!f.multiple;
      const options = typeof f.options === 'function' ? f.options(data) : f.options;
      const exclusives = options.filter(o => o.exclusive).map(o => o.value);
      const regular = options.filter(o => !o.exclusive).map(o => o.value);
      const buttons = [];
      const allOn = () => { const v = data[f.name]; return Array.isArray(v) && regular.every(x => v.includes(x)); };
      const allBtn = f.selectAll ? el('button', {
        type: 'button', class: 'select-all',
        onclick: () => { update(f.name, allOn() ? [] : regular.slice()); sync(); }
      }) : null;
      const sync = () => {
        const v = data[f.name];
        for (const b of buttons) {
          const on = multiple ? (Array.isArray(v) && v.includes(b.opt.value)) : v === b.opt.value;
          b.node.setAttribute('aria-checked', on ? 'true' : 'false');
        }
        if (allBtn) allBtn.textContent = allOn() ? 'Tout décocher' : 'Tout cocher';
      };
      const group = el('div', { class: 'choices' + (f.inline ? ' inline' : ''), role: multiple ? 'group' : 'radiogroup', 'aria-label': f.label || null },
        options.map(opt => {
          const node = el('button', { type: 'button', class: 'choice' + (opt.exclusive ? ' apart' : ''), role: multiple ? 'checkbox' : 'radio', 'aria-checked': 'false' },
            el('span', { class: 'mark ' + (multiple ? 'square' : 'round'), html: ICON.check }),
            el('span', { class: 'choice-text' },
              el('span', { class: 'choice-label' }, opt.label),
              opt.hint ? el('span', { class: 'choice-hint' }, opt.hint) : null));
          node.addEventListener('click', () => {
            let v = data[f.name];
            if (multiple) {
              v = Array.isArray(v) ? v.slice() : [];
              if (v.includes(opt.value)) v = v.filter(x => x !== opt.value);
              else if (opt.exclusive) v = [opt.value];
              else v = v.filter(x => !exclusives.includes(x)).concat(opt.value);
            } else {
              v = opt.value;
            }
            update(f.name, v);
            sync();
          });
          buttons.push({ opt, node });
          return node;
        }));
      sync();
      return el('div', { class: 'field' },
        (f.label || allBtn) ? el('div', { class: 'field-label' }, el('span', null, f.label || ''), allBtn) : null,
        f.hint ? el('div', { class: 'field-hint above' }, f.hint) : null,
        group);
    },

    ack(f, data, update) {
      const node = el('button', { type: 'button', class: 'choice ack', role: 'checkbox', 'aria-checked': data[f.name] ? 'true' : 'false' },
        el('span', { class: 'mark square', html: ICON.check }),
        el('span', { class: 'choice-text' }, el('span', { class: 'choice-label' }, f.label)));
      node.addEventListener('click', () => {
        const on = node.getAttribute('aria-checked') !== 'true';
        node.setAttribute('aria-checked', on ? 'true' : 'false');
        update(f.name, on);
      });
      return el('div', { class: 'field' }, node);
    },

    read(f) {
      return el('div', { class: 'read' }, f.sections.map(s =>
        el('section', { class: 'read-card' },
          el('h2', { class: 'read-title' }, el('span', { class: 'read-num' }, s.n), s.title),
          s.blocks.map(b => {
            if (b.p) return el('p', null, b.p);
            if (b.defs) return el('ul', { class: 'read-defs' }, b.defs.map(d => el('li', null, el('strong', null, d.term), el('span', null, d.text))));
            if (b.list) return el('ul', { class: 'read-list' }, b.list.map(t => el('li', null, t)));
            if (b.alert) return el('div', { class: 'read-alert' }, icon('alert'), el('span', null, b.alert));
            if (b.small) return el('p', { class: 'read-small' }, b.small);
            return null;
          }))));
    },

    statement(f, data) {
      const texts = typeof f.text === 'function' ? f.text(data) : [].concat(f.text);
      return el('div', { class: 'statement' },
        el('div', { class: 'statement-title' }, f.title),
        texts.map(t => typeof t === 'string' ? el('p', null, t)
          : el('div', { class: 'statement-part' }, el('div', { class: 'statement-head' }, t.title), el('p', null, t.text))));
    },

    note(f) {
      return el('div', { class: 'note ' + (f.tone || '') },
        icon('alert'),
        el('div', null, el('div', { class: 'note-title' }, f.title), el('div', { class: 'note-text' }, f.text)));
    },

    signature(f, data, update) {
      const box = el('button', { type: 'button', class: 'sig-box' });
      const paint = () => {
        const sig = data[f.name];
        box.replaceChildren();
        box.classList.toggle('signed', !!sig);
        if (sig) {
          box.append(el('img', { src: sig.data, alt: 'Signature enregistrée' }), el('span', { class: 'sig-edit' }, 'Modifier'));
        } else {
          box.append(icon('pen'), el('span', null, 'Toucher pour signer'));
        }
      };
      box.addEventListener('click', () => openSignature({
        title: f.label,
        signer: f.signer ? f.signer(data) : '',
        onDone: sig => { update(f.name, sig); paint(); }
      }));
      paint();
      return el('div', { class: 'field' }, el('div', { class: 'field-label' }, f.label), box);
    }
  };

  /* ---------- Dernière étape : le PDF et son envoi ---------- */

  function renderFinal(doc, draft, body, bottom) {
    const data = draft.data;
    const mail = doc.mail(data);
    const filename = doc.filename(data);
    let pdf = null; // { file, url, canShare }

    const title = el('h1', { class: 'step-title', tabindex: '-1' }, 'Envoi du document');
    const lead = el('p', { class: 'step-lead' }, 'Vérifiez, puis envoyez le document au client et au magasin.');

    const fileCard = el('div', { class: 'file-card building' },
      icon('file', 'file-ic'),
      el('div', { class: 'file-text' },
        el('div', { class: 'file-name' }, doc.pdfTitle || filename),
        el('div', { class: 'file-meta' }, 'Création du document…')),
      el('button', { type: 'button', class: 'btn small ghost', disabled: true, onclick: () => pdf && window.open(pdf.url, '_blank') }, 'Aperçu'));

    const recap = el('dl', { class: 'recap' }, doc.summary(data).map(([k, v]) =>
      el('div', { class: 'recap-row' }, el('dt', null, k), el('dd', null, v || '—'))));

    const recipients = el('div', { class: 'recipients' },
      el('div', { class: 'field-label' }, 'Destinataires'),
      mail.to.map(addr => el('div', { class: 'recipient' }, icon('mail'), el('span', null, addr))),
      data.email ? null : el('button', { type: 'button', class: 'link', onclick: () => go(stepHash(doc.id, 0)) }, 'Ajouter l’e-mail du client'));
    const tip = el('p', { class: 'field-hint', hidden: true });

    const sendBtn = el('button', { type: 'button', class: 'btn primary block', disabled: true }, icon('mail'), el('span', null, 'Envoyer par e-mail'));
    const dlBtn = el('button', { type: 'button', class: 'btn ghost block', disabled: true }, icon('download'), el('span', null, 'Télécharger le PDF'));
    const doneBtn = el('button', { type: 'button', class: 'btn primary block', onclick: finish }, 'Terminer');
    const sentBanner = el('div', { class: 'note success', hidden: true },
      icon('done'),
      el('div', null,
        el('div', { class: 'note-title' }, 'E-mail préparé'),
        el('div', { class: 'note-text' }, 'Une fois l’e-mail parti, terminez pour revenir à l’accueil.')));

    body.append(title, lead, sentBanner, fileCard, recap, recipients, tip);
    paintBottom();

    function paintBottom() {
      bottom.replaceChildren();
      if (draft.sent) {
        sentBanner.hidden = false;
        sendBtn.className = 'btn ghost block';
        sendBtn.lastChild.textContent = 'Envoyer à nouveau';
        bottom.append(doneBtn, sendBtn);
      } else {
        bottom.append(sendBtn, dlBtn);
      }
    }
    function markSent() {
      draft.sent = true; saveDraft(draft);
      paintBottom();
      sentBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    function finish() {
      if (doc.onFinish) { try { doc.onFinish(data); } catch (e) { /* sans conséquence pour l'utilisateur */ } }
      dropDraft(doc.id);
      go('#/');
      toast('Document terminé');
    }
    function download() {
      const a = el('a', { href: pdf.url, download: filename });
      document.body.append(a); a.click(); a.remove();
    }
    function viaMailApp() {
      download();
      const note = '\n\nPièce jointe à ajouter : ' + filename;
      const href = 'mailto:' + mail.to.join(',') + '?subject=' + encodeURIComponent(mail.subject) + '&body=' + encodeURIComponent(mail.body + note);
      setTimeout(() => { location.href = href; }, 400);
      markSent();
    }
    sendBtn.addEventListener('click', () => {
      if (!pdf) return;
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(mail.to.join(', ')).catch(() => {});
      if (pdf.canShare) {
        navigator.share({ files: [pdf.file], title: mail.subject, text: mail.body })
          .then(markSent)
          .catch(err => { if (!err || err.name !== 'AbortError') viaMailApp(); });
      } else {
        viaMailApp();
      }
    });
    dlBtn.addEventListener('click', () => { if (pdf) download(); });

    const meta = fileCard.querySelector('.file-meta');
    const preview = fileCard.querySelector('button');
    doc.buildPdf(data).then(res => {
      const file = new File([res.blob], filename, { type: 'application/pdf' });
      pdf = {
        file, url: URL.createObjectURL(res.blob),
        canShare: !!(navigator.canShare && navigator.share && navigator.canShare({ files: [file] }))
      };
      fileCard.classList.remove('building');
      meta.textContent = 'PDF · ' + res.pages + ' page' + (res.pages > 1 ? 's' : '') + ' · ' + Math.max(1, Math.round(res.blob.size / 1024)) + ' Ko';
      preview.disabled = false; sendBtn.disabled = false; dlBtn.disabled = false;
      tip.hidden = false;
      tip.textContent = pdf.canShare
        ? 'Au moment de l’envoi, les adresses sont copiées : il suffit de les coller dans le champ « À » de l’e-mail.'
        : 'Sur cet appareil, le PDF est téléchargé puis l’e-mail s’ouvre : ajoutez-y le fichier en pièce jointe.';
    }).catch(err => {
      fileCard.classList.remove('building');
      fileCard.classList.add('failed');
      meta.textContent = err && err.message === 'pdf-indisponible'
        ? 'L’outil n’est pas chargé entièrement. Rouvrez-le avec du réseau.'
        : 'Le document n’a pas pu être créé.';
      const retry = el('button', { type: 'button', class: 'btn primary block', onclick: route }, 'Réessayer');
      bottom.replaceChildren(retry);
    });

    cleanup = () => { if (pdf) URL.revokeObjectURL(pdf.url); };
    setTimeout(() => title.focus({ preventScroll: true }), 0);
  }

  /* ---------- Navigation ---------- */

  function show(view) {
    app.replaceChildren(view);
    window.scrollTo(0, 0);
  }

  function route() {
    if (cleanup) { try { cleanup(); } catch (e) { /* rien */ } cleanup = null; }
    layer.replaceChildren();
    document.body.classList.remove('locked');
    const m = location.hash.match(/^#\/d\/([a-z-]+)\/(\d+)$/);
    if (m && O.docs[m[1]]) renderWizard(O.docs[m[1]], parseInt(m[2], 10));
    else if (location.hash === '#/clients') renderClients();
    else if (location.hash === '#/reglages') renderSettings();
    else if (location.hash === '#/techniciens') renderUsers();
    else renderHome();
  }

  /* ---------- Connexion : choix du compte et code personnel ---------- */

  const RELOCK_AFTER = 15 * 60 * 1000; // code redemandé après 15 minutes en arrière-plan
  const TRIES_KEY = 'olympe.essais';
  const ITER = 150000;
  let locked = false;
  let me = null; // compte connecté : { id, name, role, token }
  O.session = { me: () => me };

  async function pbkdf(code, salt, iterations) {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', enc.encode(code), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: enc.encode(salt), iterations: iterations, hash: 'SHA-256' }, key, 256);
    return Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function api(action, body) {
    return fetch(O.api, {
      method: 'POST', cache: 'no-store', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({ a: action, token: me ? me.token : undefined }, body || {}))
    }).then(async r => {
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { const e = new Error(j.error || 'Le serveur ne répond pas correctement.'); e.status = r.status; e.wait = j.wait; throw e; }
      return j;
    });
  }
  const waitText = s => s >= 90 ? Math.ceil(s / 60) + ' min' : s + ' s';

  /* Essais faux quand la vérification se fait dans l'appareil (hors ligne ou outil sans comptes) */
  const localWait = () => Math.max(0, (store.get(TRIES_KEY, {}).until || 0) - Date.now());
  function localFail() {
    const t = store.get(TRIES_KEY, {});
    t.n = (t.n || 0) + 1;
    if (t.n % 5 === 0) t.until = Date.now() + Math.min(300, 30 * Math.pow(2, t.n / 5 - 1)) * 1000;
    store.set(TRIES_KEY, t);
    const w = Math.ceil(localWait() / 1000);
    return { msg: w ? 'Trop d’essais. Réessayez dans ' + waitText(w) + '.' : 'Code incorrect.' };
  }

  function blueScreen(label, kids) {
    return el('div', { class: 'lock', role: 'dialog', 'aria-modal': 'true', 'aria-label': label },
      el('div', { class: 'lock-in' },
        el('img', { class: 'lock-logo', src: 'assets/logo.png', alt: O.company.name, width: '72', height: '72' }), kids));
  }
  function closeScreen(screen) {
    screen.classList.add('leave');
    setTimeout(() => screen.remove(), 220);
  }

  /* Clavier à 6 chiffres. o.verify(code) répond { ok: true } ou { msg: '…' }. */
  function keypad(o) {
    let code = '', busy = false;
    const dots = el('div', { class: 'lock-dots', 'aria-hidden': 'true' }, Array.from({ length: 6 }, () => el('span')));
    const msg = el('div', { class: 'lock-msg', role: 'alert' });
    const pad = el('div', { class: 'lock-pad' }, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map(k => {
      if (!k) return el('span');
      return el('button', {
        type: 'button', class: 'lock-key' + (k === 'del' ? ' del' : ''),
        'aria-label': k === 'del' ? 'Effacer' : k, onclick: () => press(k)
      }, k === 'del' ? icon('back') : k);
    }));
    const done = () => document.removeEventListener('keydown', onKey);
    const screen = blueScreen(o.title, [
      el('h1', { class: 'lock-title' }, o.title),
      el('p', { class: 'lock-sub' }, o.sub || 'Saisissez le code à 6 chiffres.'),
      dots, msg, pad,
      o.onBack ? el('button', { type: 'button', class: 'lock-link', onclick: () => { done(); screen.remove(); o.onBack(); } }, 'Changer de compte') : null
    ]);
    const paint = () => Array.from(dots.children).forEach((d, i) => d.classList.toggle('on', i < code.length));
    function press(k) {
      if (busy) return;
      if (k === 'del') { code = code.slice(0, -1); paint(); return; }
      if (code.length >= 6) return;
      code += k; msg.textContent = ''; paint();
      if (code.length < 6) return;
      if (!(window.crypto && crypto.subtle)) {
        code = ''; paint();
        msg.textContent = 'Le code ne peut pas être vérifié ici : l’adresse doit être en HTTPS.';
        return;
      }
      busy = true;
      msg.textContent = 'Vérification…';
      Promise.resolve(o.verify(code)).catch(() => ({ msg: 'Vérification impossible. Réessayez.' })).then(res => {
        if (res && res.ok) {
          done();
          locked = false;
          closeScreen(screen);
          o.onOpen();
          return;
        }
        busy = false; code = ''; paint();
        msg.textContent = (res && res.msg) || 'Code incorrect.';
        dots.classList.remove('shake'); void dots.offsetWidth; dots.classList.add('shake');
      });
    }
    function onKey(e) {
      if (/^[0-9]$/.test(e.key)) { e.preventDefault(); press(e.key); }
      else if (e.key === 'Backspace') { e.preventDefault(); press('del'); }
    }
    document.addEventListener('keydown', onKey);
    document.body.append(screen);
  }

  /* Outil sans comptes (pas de serveur) : un seul code, vérifié dans l'appareil */
  async function legacyVerify(code) {
    if (localWait() > 0) return localFail();
    if (await pbkdf(code, O.access.salt, O.access.iterations) !== O.access.hash) return localFail();
    store.del(TRIES_KEY);
    await O.clients.unlock(code, '');
    return { ok: true };
  }

  /* Brouillons commencés avant l'arrivée des comptes : ils reviennent à la première
     personne qui se connecte sur l'appareil, pour ne rien perdre. */
  function adoptOldDrafts() {
    for (const id of Object.keys(O.docs)) {
      const old = 'olympe.brouillon.' + id;
      const d = store.get(old, null);
      if (!d) continue;
      if (!store.get(draftKey(id), null)) store.set(draftKey(id), d);
      store.del(old);
    }
  }

  /* Avec comptes : le serveur vérifie le code ; hors réseau, l'appareil s'en charge
     pour un compte déjà ouvert ici. */
  async function signIn(user, code) {
    const vKey = 'olympe.verif.' + user.id;
    try {
      const r = await api('login', { id: user.id, code: code, token: undefined });
      const salt = Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2, '0')).join('');
      store.set(vKey, { salt: salt, hash: await pbkdf(code, salt, ITER), user: r.user, token: r.token });
      me = Object.assign({}, r.user, { token: r.token });
    } catch (e) {
      if (e.status === 401) { store.del(vKey); return { msg: 'Code incorrect.' }; }
      if (e.status === 429) return { msg: 'Trop d’essais. Réessayez dans ' + waitText(e.wait || 60) + '.' };
      if (e.status) return { msg: e.message };
      const v = store.get(vKey, null); // pas de réseau
      if (!v) return { msg: 'Connexion Internet nécessaire pour la première ouverture sur cet appareil.' };
      if (localWait() > 0 || await pbkdf(code, v.salt, ITER) !== v.hash) return localFail();
      me = Object.assign({}, v.user, { token: v.token });
    }
    store.del(TRIES_KEY);
    store.set('olympe.dernier', user.id);
    adoptOldDrafts();
    await O.clients.unlock(code, user.id);
    sync();
    return { ok: true };
  }

  /* Récupère la dernière liste de clients déposée par le bureau, sans rien demander. */
  function sync() {
    if (!O.api || !me) return Promise.resolve();
    const info = O.clients.info();
    return api('sync', { since: info && info.at ? info.at : 0 }).then(async r => {
      store.set('olympe.comptes', r.users);
      me = Object.assign({}, r.user, { token: me.token });
      const v = store.get('olympe.verif.' + me.id, null);
      if (v) { v.user = r.user; store.set('olympe.verif.' + me.id, v); }
      if (r.clients) {
        if (r.clients.length) await O.clients.save(r.clients, r.clientsAt); else await O.clients.remove();
        if (!locked && (location.hash === '' || location.hash === '#/')) renderHome();
      }
    }).catch(e => {
      if (e.status === 401) { // compte supprimé ou code changé par le bureau
        store.del('olympe.verif.' + me.id);
        signOut();
        toast('Reconnectez-vous');
      }
    });
  }

  /* Feuille « Mon compte » : chacun peut changer son propre code */
  function accountSheet() {
    if (!me) return;
    openSheet({
      title: me.name,
      text: me.role === 'admin' ? 'Compte du bureau' : 'Compte technicien',
      actions: [
        {
          label: 'Changer mon code', kind: 'primary', onClick: () => codeSheet({
            title: 'Nouveau code',
            text: 'Choisissez 6 chiffres. L’ancien code cessera de fonctionner tout de suite.',
            onOk: code => api('code', { code: code }).then(() => {
              const user = { id: me.id, name: me.name };
              store.del('olympe.verif.' + user.id);
              toast('Code changé');
              me = null;
              askCode(user, route); // on se reconnecte avec le nouveau code
            }).catch(e => toast(e.status ? e.message : 'Pas de connexion Internet : code inchangé'))
          })
        },
        { label: 'Changer de compte', onClick: signOut },
        { label: 'Fermer' }
      ]
    });
  }

  function signOut() {
    me = null;
    O.clients.forget();
    if (O.api) accountsScreen(route); else lockLegacy(route);
  }

  function lockLegacy(onOpen) {
    if (locked) return;
    locked = true;
    O.clients.forget();
    keypad({ title: 'Code d’accès', verify: legacyVerify, onOpen: onOpen });
  }

  function askCode(user, onOpen) {
    locked = true;
    O.clients.forget();
    keypad({
      title: user.name, sub: 'Saisissez votre code à 6 chiffres.',
      verify: code => signIn(user, code), onOpen: onOpen,
      onBack: () => accountsScreen(onOpen)
    });
  }

  function accountsScreen(onOpen) {
    locked = true;
    O.clients.forget();
    const list = el('div', { class: 'who-list' });
    const note = el('div', { class: 'lock-msg', role: 'alert' });
    const screen = blueScreen('Choix du compte', [
      el('h1', { class: 'lock-title' }, 'Qui êtes-vous ?'),
      el('p', { class: 'lock-sub' }, 'Choisissez votre compte.'),
      list, note
    ]);
    const paint = users => {
      list.replaceChildren(...users.map(u => el('button', { type: 'button', class: 'who', onclick: () => { screen.remove(); askCode(u, onOpen); } },
        el('span', { class: 'who-ini' }, u.name.slice(0, 1).toUpperCase()), el('span', null, u.name))));
    };
    const cached = store.get('olympe.comptes', []);
    paint(cached);
    if (!cached.length) note.textContent = 'Chargement des comptes…';
    api('comptes', { token: undefined }).then(r => { store.set('olympe.comptes', r.users); note.textContent = ''; paint(r.users); })
      .catch(() => { if (!store.get('olympe.comptes', []).length) note.textContent = 'Connexion Internet nécessaire pour la première ouverture.'; });
    document.body.append(screen);
  }

  /* ---------- Réglages (compte du bureau) ---------- */

  function settingsShell(titleText, backHash) {
    const body = el('div', { class: 'step' });
    const view = el('main', { class: 'view wizard' },
      el('header', { class: 'topbar' },
        el('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Retour', onclick: () => go(backHash) }, icon('left')),
        el('div', { class: 'topbar-title' }, titleText),
        el('span', { class: 'icon-btn' })),
      body);
    return { body: body, view: view };
  }

  function renderSettings() {
    if (!me || me.role !== 'admin') return go('#/');
    const s = settingsShell('Réglages', '#/');
    const link = (ic, title, desc, hash) => el('button', { type: 'button', class: 'doc-card', onclick: () => go(hash) },
      icon(ic, 'doc-ic'),
      el('span', { class: 'doc-text' }, el('span', { class: 'doc-title' }, title), el('span', { class: 'doc-desc' }, desc)),
      icon('right', 'doc-go'));
    s.body.append(
      el('h1', { class: 'step-title', tabindex: '-1' }, 'Réglages'),
      el('p', { class: 'step-lead' }, 'Réservé au bureau.'),
      link('users', 'Fichier clients', clientsState().text, '#/clients'),
      link('shield', 'Techniciens et codes', 'Ajouter, supprimer, changer un code', '#/techniciens'));
    show(s.view);
  }

  function codeSheet(o) {
    const input = el('input', { class: 'input', type: 'password', inputmode: 'numeric', maxlength: '6', autocomplete: 'new-password', placeholder: '6 chiffres', 'aria-label': 'Nouveau code à 6 chiffres' });
    const err = el('div', { class: 'field-error', hidden: true }, 'Le code doit comporter 6 chiffres.');
    const close = () => { wrap.classList.remove('show'); setTimeout(() => wrap.remove(), 200); };
    const wrap = el('div', { class: 'sheet-wrap', onclick: e => { if (e.target === wrap) close(); } },
      el('div', { class: 'sheet', role: 'dialog', 'aria-modal': 'true', 'aria-label': o.title },
        el('div', { class: 'sheet-grip' }),
        el('h2', { class: 'sheet-title' }, o.title),
        el('p', { class: 'sheet-text' }, o.text),
        el('div', { class: 'field sheet-field' }, input, err),
        el('div', { class: 'sheet-actions' },
          el('button', { type: 'button', class: 'btn primary', onclick: () => { if (!/^\d{6}$/.test(input.value)) { err.hidden = false; return; } close(); o.onOk(input.value); } }, 'Enregistrer'),
          el('button', { type: 'button', class: 'btn ghost', onclick: close }, 'Annuler'))));
    layer.append(wrap);
    requestAnimationFrame(() => wrap.classList.add('show'));
  }

  function renderUsers() {
    if (!me || me.role !== 'admin') return go('#/');
    const s = settingsShell('Techniciens et codes', '#/reglages');
    const listBox = el('div', { class: 'items' });
    const problem = el('div', { class: 'field-error', role: 'alert', hidden: true });
    const say = e => { problem.hidden = false; problem.textContent = e.status ? e.message : 'Pas de connexion Internet : réessayez plus tard.'; };
    const paint = users => {
      problem.hidden = true;
      store.set('olympe.comptes', users.map(u => ({ id: u.id, name: u.name })));
      listBox.replaceChildren(...users.map(u => el('div', { class: 'user-row' },
        el('span', { class: 'who-ini small' }, u.name.slice(0, 1).toUpperCase()),
        el('span', { class: 'user-text' },
          el('span', { class: 'user-name' }, u.name + (u.id === me.id ? ' (vous)' : '')),
          el('span', { class: 'user-role' }, u.role === 'admin' ? 'Bureau · accès aux réglages' : 'Technicien')),
        el('button', {
          type: 'button', class: 'btn small ghost', onclick: () => codeSheet({
            title: 'Nouveau code pour ' + u.name,
            text: 'L’ancien code cessera de fonctionner tout de suite.',
            onOk: code => api('code', { id: u.id, code: code }).then(r => {
              if (r.token) { me.token = r.token; const v = store.get('olympe.verif.' + me.id, null); if (v) { store.del('olympe.verif.' + me.id); } }
              toast('Code de ' + u.name + ' changé');
            }).catch(say)
          })
        }, 'Code'),
        u.id === me.id ? null : el('button', {
          type: 'button', class: 'item-del', 'aria-label': 'Supprimer ' + u.name, onclick: () => openSheet({
            title: 'Supprimer le compte de ' + u.name + ' ?',
            text: 'Cette personne ne pourra plus ouvrir l’outil.',
            actions: [{ label: 'Supprimer', kind: 'danger', onClick: () => api('users.del', { id: u.id }).then(r => paint(r.users)).catch(say) }, { label: 'Annuler' }]
          })
        }, icon('trash')))));
    };

    const name = el('input', { class: 'input', type: 'text', placeholder: 'Prénom', autocomplete: 'off', autocapitalize: 'words', maxlength: '30', 'aria-label': 'Prénom' });
    const code = el('input', { class: 'input', type: 'password', inputmode: 'numeric', maxlength: '6', autocomplete: 'new-password', placeholder: 'Code à 6 chiffres', 'aria-label': 'Code à 6 chiffres' });
    const adminBox = el('button', { type: 'button', class: 'choice', role: 'checkbox', 'aria-checked': 'false' },
      el('span', { class: 'mark square', html: ICON.check }),
      el('span', { class: 'choice-text' }, el('span', { class: 'choice-label' }, 'Accès aux réglages (bureau)')));
    adminBox.addEventListener('click', () => adminBox.setAttribute('aria-checked', adminBox.getAttribute('aria-checked') === 'true' ? 'false' : 'true'));
    const add = el('button', { type: 'button', class: 'btn primary block' }, icon('plus'), el('span', null, 'Ajouter'));
    add.addEventListener('click', () => {
      if (!name.value.trim() || !/^\d{6}$/.test(code.value)) { problem.hidden = false; problem.textContent = 'Indiquez un prénom et un code à 6 chiffres.'; return; }
      api('users.add', { name: name.value, code: code.value, role: adminBox.getAttribute('aria-checked') === 'true' ? 'admin' : 'tech' })
        .then(r => { name.value = ''; code.value = ''; adminBox.setAttribute('aria-checked', 'false'); paint(r.users); toast('Compte ajouté'); }).catch(say);
    });

    s.body.append(
      el('h1', { class: 'step-title', tabindex: '-1' }, 'Techniciens et codes'),
      el('p', { class: 'step-lead' }, 'Chaque personne a son compte et son code à 6 chiffres.'),
      listBox, problem,
      el('div', { class: 'statement' },
        el('div', { class: 'statement-title' }, 'Ajouter une personne'),
        el('div', { class: 'field' }, name), el('div', { class: 'field' }, code), adminBox, add));
    show(s.view);
    api('users').then(r => paint(r.users)).catch(say);
  }

  /* ---------- Démarrage ---------- */

  window.addEventListener('hashchange', () => { if (!locked) route(); });

  function relockOnReturn(lockAgain) {
    let hiddenAt = 0;
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) hiddenAt = Date.now();
      else if (!locked && hiddenAt && Date.now() - hiddenAt > RELOCK_AFTER) lockAgain();
      else if (!locked && !document.hidden) sync();
    });
  }

  if (O.api) {
    const last = store.get('olympe.comptes', []).find(u => u.id === store.get('olympe.dernier', ''));
    if (last) askCode(last, route); else accountsScreen(route);
    relockOnReturn(() => { if (me) askCode({ id: me.id, name: me.name }, () => {}); });
  } else if (O.access) {
    lockLegacy(route);
    relockOnReturn(() => lockLegacy(() => {}));
  } else {
    O.clients.unlock(null, '').then(route);
  }

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
  }
})();
