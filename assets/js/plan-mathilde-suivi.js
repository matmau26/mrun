/* ================================================================
   Plan Mathilde — Formulaire de suivi post-séance
   Ouvre une modale à la validation d'une séance,
   stocke la soumission en localStorage (prêt pour un envoi BDD ultérieur).
   ================================================================ */
(function () {
  'use strict';

  const S = window.PLAN_MATHILDE_SUIVI_SCHEMA;
  if (!S) return;

  const LS_SUIVI = 'mrun.mathilde.suivi.v1';   // { dayKey: { saved_at, submission } }
  const LS_QUEUE = 'mrun.mathilde.sync_queue.v1'; // [ payload, … ] en attente d'envoi
  const QUAL_TYPES = ['seuil', 'cotes', 'seance_specifique', 'test', 'course'];

  // ---- Synchronisation Google Sheets (Apps Script Web App) ---------------
  // Le token est visible côté client : la page est non listée et noindex,
  // c'est le compromis assumé. Le script côté Google refuse tout POST sans
  // ce token, et fait un upsert sur seance_id (les renvois ne dupliquent pas).
  const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzowuIuEazUNSsU_hd3cCGpoxRIl0nQ7yeA30fz6yQeAKw7G2KsWXD2yhfYZ5AA8Qit0A/exec';
  const WEBHOOK_TOKEN = 'c3622bb6-124b-40f2-8ef5-32c973a941fc';

  const loadSuivi = () => {
    try { return JSON.parse(localStorage.getItem(LS_SUIVI) || '{}') || {}; }
    catch (e) { return {}; }
  };
  const saveSuivi = (obj) => {
    try { localStorage.setItem(LS_SUIVI, JSON.stringify(obj)); return true; }
    catch (e) { return false; }
  };

  const escapeHtml = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  // ======================================================================
  // Couche réseau : envoi vers la feuille + file d'attente de réessai
  // ======================================================================
  const loadQueue = () => {
    try { return JSON.parse(localStorage.getItem(LS_QUEUE) || '[]') || []; }
    catch (e) { return []; }
  };
  const saveQueue = (arr) => {
    try { localStorage.setItem(LS_QUEUE, JSON.stringify(arr)); } catch (e) { /* silencieux */ }
  };
  const keyOf = (payload) => (payload && payload.submission && payload.submission.seance_id) || '';

  function enqueue(payload) {
    const k = keyOf(payload);
    const q = loadQueue().filter((p) => keyOf(p) !== k);  // une seule entrée par séance
    q.push(payload);
    saveQueue(q);
    updateSyncBadge();
  }
  function dequeue(payload) {
    const k = keyOf(payload);
    saveQueue(loadQueue().filter((p) => keyOf(p) !== k));
    updateSyncBadge();
  }

  // Content-Type text/plain : évite le préflight CORS, qu'Apps Script ne sait
  // pas traiter. Le script lit quand même e.postData.contents.
  function postToSheet(payload) {
    return fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow'
    }).then((res) => {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json().catch(() => ({ ok: true }));
    }).then((data) => {
      if (data && data.ok === false) throw new Error(data.error || 'refus serveur');
      return true;
    });
  }

  // Renvoie tout ce qui est en attente. Appelé au chargement de la page.
  function flushQueue() {
    const q = loadQueue();
    if (!q.length) return Promise.resolve({ sent: 0, failed: 0 });
    let sent = 0, failed = 0;
    return q.reduce((chain, payload) => chain.then(() =>
      postToSheet(payload)
        .then(() => { dequeue(payload); sent++; })
        .catch(() => { failed++; })
    ), Promise.resolve()).then(() => {
      updateSyncBadge();
      return { sent, failed };
    });
  }

  // ---- Lecture de l'état distant : la feuille fait foi ------------------
  // Apps Script ne renvoie pas toujours d'en-têtes CORS exploitables en
  // lecture. On tente donc fetch(), et on retombe sur JSONP — une balise
  // <script> n'étant pas soumise au CORS, elle passe systématiquement.

  function readViaFetch() {
    const url = WEBHOOK_URL
      + '?token=' + encodeURIComponent(WEBHOOK_TOKEN)
      + '&_=' + Date.now();
    return fetch(url, { method: 'GET', redirect: 'follow' })
      .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then((data) => {
        if (!data || data.ok === false) throw new Error((data && data.error) || 'refus serveur');
        return data.suivi || {};
      });
  }

  function readViaJsonp() {
    return new Promise((resolve, reject) => {
      const cbName = '__mrunSuiviCb' + Date.now() + Math.floor(Math.random() * 1000);
      const script = document.createElement('script');
      let settled = false;

      const cleanup = () => {
        clearTimeout(timer);
        try { delete window[cbName]; } catch (e) { window[cbName] = undefined; }
        if (script.parentNode) script.parentNode.removeChild(script);
      };
      const timer = setTimeout(() => {
        if (settled) return;
        settled = true; cleanup();
        reject(new Error('JSONP : délai dépassé'));
      }, 15000);

      window[cbName] = (data) => {
        if (settled) return;
        settled = true; cleanup();
        if (!data || data.ok === false) {
          reject(new Error((data && data.error) || 'refus serveur'));
        } else {
          resolve(data.suivi || {});
        }
      };
      script.onerror = () => {
        if (settled) return;
        settled = true; cleanup();
        reject(new Error('JSONP : chargement impossible'));
      };
      script.src = WEBHOOK_URL
        + '?token=' + encodeURIComponent(WEBHOOK_TOKEN)
        + '&callback=' + cbName
        + '&_=' + Date.now();
      document.head.appendChild(script);
    });
  }

  function fetchRemoteState() {
    return readViaFetch().catch((e) => {
      console.warn('[Mrun] Lecture directe impossible (' + e.message + '), bascule en JSONP.');
      return readViaJsonp();
    });
  }

  // Fusionne l'état distant dans le stockage local.
  // Règle : la feuille gagne si l'entrée locale est absente ou plus ancienne.
  // Google Sheets peut reformater la colonne date ("Wed Sep 16" au lieu de
  // "2026-09-16"). Le seance_id, lui, est une chaîne que nous construisons
  // ("S38-2026-09-16") : la date qu'il contient est toujours fiable.
  function normalizeDayKey(key, submission) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(key)) return key;
    const src = (submission && submission.seance_id) || key || '';
    const m = String(src).match(/(\d{4}-\d{2}-\d{2})/);
    return m ? m[1] : key;
  }

  // La feuille est la source de vérité : on reflète aussi ses suppressions.
  // Garde-fou : on ne retire jamais une entrée encore en file d'attente,
  // elle n'a simplement pas encore été envoyée.
  function mergeRemoteIntoLocal(remote) {
    const local = loadSuivi();
    let done = {};
    try { done = JSON.parse(localStorage.getItem('mrun.mathilde.done.v1') || '{}') || {}; }
    catch (e) { done = {}; }

    const seen = Object.create(null);
    let merged = 0;

    Object.keys(remote).forEach((rawKey) => {
      const r = remote[rawKey];
      const dayKey = normalizeDayKey(rawKey, r && r.submission);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) {
        console.warn('[Mrun] Entrée distante ignorée, date illisible :', rawKey);
        return;
      }
      if (r.submission) r.submission.date = dayKey;   // recale la date interne
      seen[dayKey] = true;

      const l = local[dayKey];
      const rTime = Date.parse(r.saved_at || '') || 0;
      const lTime = l ? (Date.parse(l.saved_at || '') || 0) : -1;
      if (rTime > lTime) { local[dayKey] = r; merged++; }

      done[dayKey] = true;   // présente dans la feuille = séance faite
    });

    // Ce qui attend d'être poussé est protégé de la purge
    const pending = Object.create(null);
    loadQueue().forEach((p) => {
      const k = normalizeDayKey((p.submission && p.submission.date) || '', p.submission);
      if (k) pending[k] = true;
    });

    let removed = 0;
    Object.keys(local).forEach((k) => {
      if (!seen[k] && !pending[k]) {
        delete local[k];
        delete done[k];
        removed++;
      }
    });

    saveSuivi(local);
    try { localStorage.setItem('mrun.mathilde.done.v1', JSON.stringify(done)); }
    catch (e) { /* silencieux */ }

    if (removed) {
      console.info('[Mrun] ' + removed + ' séance(s) retirée(s) localement — supprimée(s) de la feuille.');
    }
    return { merged: merged, removed: removed };
  }

  // Cycle complet : on pousse d'abord ce qui attend, puis on relit la feuille.
  function syncWithSheet() {
    setSyncBadgeState('syncing');
    return flushQueue()
      .then(fetchRemoteState)
      .then((remote) => {
        const n = Object.keys(remote).length;
        const res = mergeRemoteIntoLocal(remote);
        if (typeof window.mathildeApplyDone === 'function') {
          window.mathildeApplyDone();
        } else {
          console.warn('[Mrun] mathildeApplyDone absent : le rendu n\'a pas encore eu lieu.');
        }
        updateSyncBadge();
        console.info('[Mrun] Synchro OK — ' + n + ' séance(s) dans la feuille, '
          + res.merged + ' reprise(s), ' + res.removed + ' retirée(s).');
        return n;
      })
      .catch((e) => {
        updateSyncBadge();
        console.error('[Mrun] Synchro échouée :', e && e.message ? e.message : e);
        return -1;
      });
  }

  function setSyncBadgeState(state) {
    const el = document.getElementById('sync-badge');
    if (!el || state !== 'syncing') return;
    el.className = 'sync-badge is-syncing';
    el.innerHTML = '<i></i>Synchronisation…';
  }

  // Petit indicateur global (injecté dans le pied de page)
  function updateSyncBadge() {
    const n = loadQueue().length;
    let el = document.getElementById('sync-badge');
    if (!el) {
      const foot = document.querySelector('.site-foot__inner');
      if (!foot) return;
      el = document.createElement('span');
      el.id = 'sync-badge';
      el.className = 'sync-badge';
      foot.appendChild(el);
    }
    if (n === 0) {
      el.className = 'sync-badge is-ok';
      el.innerHTML = '<i></i>Suivi synchronisé';
    } else {
      el.className = 'sync-badge is-pending';
      el.innerHTML = '<i></i>' + n + ' séance' + (n > 1 ? 's' : '') + ' en attente de synchro';
      el.title = 'Réessai automatique au prochain chargement de la page.';
    }
  }
  const create = (tag, cls, txt) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (txt != null) el.textContent = txt;
    return el;
  };

  // -------- Modal shell -----------------------------------------------------
  let modalEl = null;
  function ensureModal() {
    if (modalEl) return modalEl;
    modalEl = document.createElement('div');
    modalEl.className = 'suivi-modal';
    modalEl.hidden = true;
    modalEl.innerHTML = `
      <div class="suivi-modal__backdrop" data-close></div>
      <div class="suivi-modal__card" role="dialog" aria-modal="true" aria-labelledby="suivi-title">
        <header class="suivi-modal__head">
          <button type="button" class="suivi-modal__close" data-close aria-label="Sortir sans enregistrer">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            <span>Sortir</span>
          </button>
          <div class="suivi-modal__head-body">
            <div class="suivi-modal__eyebrow">Suivi post-séance</div>
            <h3 id="suivi-title"></h3>
            <p class="suivi-modal__dates"></p>
          </div>
        </header>
        <div class="suivi-modal__alerts" hidden></div>
        <form class="suivi-modal__form"></form>
        <footer class="suivi-modal__foot">
          <button type="button" class="btn btn--ghost" data-close>Sortir sans enregistrer</button>
          <button type="button" class="btn btn--primary" data-submit>
            <span class="btn__long">Enregistrer et marquer fait</span>
            <span class="btn__short">Enregistrer</span>
          </button>
        </footer>
      </div>
    `;
    document.body.appendChild(modalEl);

    // closest() et non matches() : les boutons contiennent des <span>/<svg>,
    // e.target est l'enfant cliqué, pas le bouton porteur de l'attribut.
    modalEl.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) { closeModal(); return; }
      if (e.target.closest('[data-submit]')) { e.preventDefault(); submitForm(); }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modalEl.hidden) closeModal();
    });
    // La touche Entrée dans un champ ne doit jamais recharger la page :
    // on intercepte la soumission native et on passe par submitForm().
    modalEl.querySelector('.suivi-modal__form').addEventListener('submit', (e) => {
      e.preventDefault();
      submitForm();
    });
    return modalEl;
  }

  let currentDay = null;   // le jour en cours d'édition
  let currentWeek = null;
  let currentCard = null;

  function openModal(day, week, cardEl) {
    ensureModal();
    currentDay = day; currentWeek = week; currentCard = cardEl;
    modalEl.querySelector('#suivi-title').textContent = day.titre || 'Séance';
    modalEl.querySelector('.suivi-modal__dates').textContent =
      (day.jour ? day.jour.charAt(0).toUpperCase() + day.jour.slice(1) + ' — ' : '')
      + day.date + ' · ' + week.id;
    modalEl.querySelector('.suivi-modal__alerts').hidden = true;
    modalEl.querySelector('.suivi-modal__alerts').innerHTML = '';
    renderForm(day, week);
    modalEl.hidden = false;
    document.body.classList.add('has-modal-open');
    // Focus premier champ
    setTimeout(() => {
      const first = modalEl.querySelector('input, button[data-rpe], select, textarea');
      if (first) first.focus();
    }, 50);
  }

  function closeModal() {
    if (!modalEl) return;
    modalEl.hidden = true;
    document.body.classList.remove('has-modal-open');
    currentDay = null; currentWeek = null; currentCard = null;
  }

  // -------- Form rendering --------------------------------------------------
  function renderForm(day, week) {
    const form = modalEl.querySelector('.suivi-modal__form');
    const prev = loadSuivi()[day.date];
    const p = prev ? prev.submission : null;
    const hasQuality = QUAL_TYPES.includes(day.type);

    // Reset scroll top de la modale au montage
    modalEl.querySelector('.suivi-modal__card').scrollTop = 0;

    form.innerHTML = `
      ${sectionSeance(day, week, p)}
      ${sectionEffort(p)}
      ${sectionDouleurs(p)}
      ${hasQuality ? sectionQualite(day, p) : ''}
      ${sectionLibre(p)}
    `;

    // Hooks
    wireExecutionMotif(form);
    wireRpeButtons(form, p);
    wireScale5(form, 'jambes_5', p);
    wireScale5(form, 'forme_5', p);
    wireDouleurs(form, p);
    if (hasQuality) wireQualite(form, p);
  }

  // ---- Section "La séance" ----
  function sectionSeance(day, week, p) {
    return `
      <fieldset class="fset">
        <legend>La séance</legend>
        <div class="fset__grid">
          <label class="field">
            <span class="field__label">Date</span>
            <input type="date" name="date" value="${day.date}" readonly required>
          </label>
          <label class="field">
            <span class="field__label">Durée réelle (minutes) *</span>
            <input type="number" name="duree_min" min="1" max="600" step="1"
                   value="${p ? p.duree_min || '' : ''}" required>
          </label>
          <label class="field">
            <span class="field__label">Km réels</span>
            <input type="number" name="km_reels" min="0" max="200" step="0.1"
                   placeholder="ex. 12,4"
                   value="${p && p.km_reels != null ? p.km_reels : ''}">
          </label>
          <label class="field">
            <span class="field__label">Dénivelé réel (m D+)</span>
            <input type="number" name="denivele_reel" min="0" max="5000" step="1"
                   placeholder="ex. 250"
                   value="${p && p.denivele_reel != null ? p.denivele_reel : ''}">
          </label>
          <label class="field field--full">
            <span class="field__label">Séance réalisée *</span>
            <select name="execution" required>
              ${['conforme','allegee','modifiee','abandonnee','non_faite'].map(v => {
                const lib = { conforme:'Comme prévu', allegee:'Allégée (volume réduit)',
                  modifiee:'Modifiée (contenu différent)', abandonnee:'Abandonnée en cours',
                  non_faite:'Pas faite' }[v];
                const sel = (p ? p.execution : 'conforme') === v ? 'selected' : '';
                return `<option value="${v}" ${sel}>${lib}</option>`;
              }).join('')}
            </select>
          </label>
          <label class="field field--full" data-motif hidden>
            <span class="field__label">Pourquoi ? *</span>
            <input type="text" name="motif_ecart" maxlength="200" value="${escapeHtml(p ? p.motif_ecart : '')}">
          </label>
        </div>
      </fieldset>
    `;
  }
  function wireExecutionMotif(form) {
    const sel = form.querySelector('select[name="execution"]');
    const motif = form.querySelector('[data-motif]');
    const input = motif.querySelector('input[name="motif_ecart"]');
    const sync = () => {
      const show = sel.value !== 'conforme';
      motif.hidden = !show;
      input.required = show;
    };
    sel.addEventListener('change', sync);
    sync();
  }

  // ---- Section "L'effort" ----
  function sectionEffort(p) {
    return `
      <fieldset class="fset">
        <legend>L'effort</legend>
        <div class="field">
          <span class="field__label">Effort perçu (RPE 1–10) *</span>
          <div class="rpe-scale" data-rpe-scale>
            ${S.echelles.rpe.ancrages.map(a => `
              <button type="button" class="rpe-btn" data-rpe="${a.valeur}" title="${a.libelle} — ${a.repere}">${a.valeur}</button>
            `).join('')}
          </div>
          <p class="rpe-hint" data-rpe-hint>Cliquer pour choisir — le repère verbal s'affiche ici.</p>
          <input type="hidden" name="rpe" required value="${p ? p.rpe || '' : ''}">
        </div>
        <div class="fset__row">
          <div class="field">
            <span class="field__label">Jambes *</span>
            <div class="scale5" data-scale5="jambes_5">
              ${S.echelles.ressenti_5.ancrages.map(a => `
                <button type="button" class="s5-btn" data-val="${a.valeur}" title="${a.libelle}">${a.valeur}</button>
              `).join('')}
            </div>
            <p class="scale-hint" data-scale5-hint="jambes_5">
              ${S.echelles.ressenti_5.ancrages.map(a => `<span>${a.valeur} <em>${escapeHtml(a.libelle)}</em></span>`).join(' · ')}
            </p>
            <input type="hidden" name="jambes_5" required value="${p ? p.jambes_5 || '' : ''}">
          </div>
          <div class="field">
            <span class="field__label">Forme générale *</span>
            <div class="scale5" data-scale5="forme_5">
              ${S.echelles.ressenti_5.ancrages.map(a => `
                <button type="button" class="s5-btn" data-val="${a.valeur}" title="${a.libelle}">${a.valeur}</button>
              `).join('')}
            </div>
            <p class="scale-hint" data-scale5-hint="forme_5">
              ${S.echelles.ressenti_5.ancrages.map(a => `<span>${a.valeur} <em>${escapeHtml(a.libelle)}</em></span>`).join(' · ')}
            </p>
            <input type="hidden" name="forme_5" required value="${p ? p.forme_5 || '' : ''}">
          </div>
        </div>
      </fieldset>
    `;
  }
  function wireRpeButtons(form, p) {
    const btns = form.querySelectorAll('button[data-rpe]');
    const hint = form.querySelector('[data-rpe-hint]');
    const input = form.querySelector('input[name="rpe"]');
    const setActive = (v) => {
      btns.forEach(b => b.classList.toggle('is-active', +b.dataset.rpe === +v));
      const a = S.echelles.rpe.ancrages.find(x => x.valeur === +v);
      if (a) hint.innerHTML = `<strong>${escapeHtml(a.libelle)}</strong> — ${escapeHtml(a.repere)}`;
      input.value = v;
    };
    btns.forEach(b => b.addEventListener('click', () => setActive(+b.dataset.rpe)));
    if (p && p.rpe) setActive(p.rpe);
  }
  function wireScale5(form, name, p) {
    const scale = form.querySelector(`[data-scale5="${name}"]`);
    if (!scale) return;
    const btns = scale.querySelectorAll('.s5-btn');
    const input = form.querySelector(`input[name="${name}"]`);
    const hint = form.querySelector(`[data-scale5-hint="${name}"]`);
    const setActive = (v) => {
      btns.forEach(b => b.classList.toggle('is-active', +b.dataset.val === +v));
      input.value = v;
      const a = S.echelles.ressenti_5.ancrages.find(x => x.valeur === +v);
      if (hint && a) {
        hint.classList.add('is-selected');
        hint.innerHTML = `<strong>${v}/5 — ${escapeHtml(a.libelle)}</strong>`;
      }
    };
    btns.forEach(b => b.addEventListener('click', () => setActive(+b.dataset.val)));
    if (p && p[name]) setActive(p[name]);
  }

  // ---- Section "Douleurs" ----
  function sectionDouleurs(p) {
    const existing = (p && Array.isArray(p.douleurs)) ? p.douleurs : null;
    const defaults = existing || S.zones_douleur.affichees_par_defaut.map(code => ({ zone: code }));
    return `
      <fieldset class="fset">
        <legend>Douleurs</legend>
        <p class="fset__hint">Laisser à 0 si rien. Les trois moments sont indépendants.</p>
        <div class="douleurs" data-douleurs>
          ${defaults.map((d, i) => renderDouleurBlock(d, i)).join('')}
        </div>
        <button type="button" class="btn btn--ghost btn--sm" data-add-douleur>+ Ajouter une zone</button>
      </fieldset>
    `;
  }
  function renderDouleurBlock(d, idx) {
    const zone = d.zone || 'tibia';
    const zoneMeta = S.zones_douleur.liste.find(z => z.code === zone) || S.zones_douleur.liste[0];
    return `
      <div class="douleur-row" data-douleur-row data-idx="${idx}">
        <div class="douleur-row__head">
          <select data-field="zone">
            ${S.zones_douleur.liste.map(z => `<option value="${z.code}" ${z.code === zone ? 'selected' : ''}>${escapeHtml(z.libelle)}</option>`).join('')}
          </select>
          <select data-field="cote" ${zoneMeta.lateralise ? '' : 'disabled'}>
            <option value="droit" ${d.cote === 'droit' ? 'selected' : ''}>Droit</option>
            <option value="gauche" ${d.cote === 'gauche' ? 'selected' : ''}>Gauche</option>
            <option value="bilateral" ${d.cote === 'bilateral' || d.cote === 'les deux' ? 'selected' : ''}>Les deux</option>
          </select>
          <button type="button" class="douleur-row__remove" data-remove-douleur aria-label="Retirer">×</button>
        </div>
        <div class="douleur-row__moments">
          ${['reveil', 'journee', 'seance'].map(m => `
            <div class="douleur-moment">
              <span class="douleur-moment__label">${{reveil:'Au réveil', journee:'Journée', seance:'Séance'}[m]}</span>
              <div class="scale4" data-scale4="${m}">
                ${[0,1,2,3].map(v => `<button type="button" class="s4-btn" data-val="${v}" ${d[m] === v ? 'class="is-active"' : ''}>${v}</button>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        <div class="douleur-row__evo" data-evo hidden>
          <label>Pendant la séance, la douleur a…
            <select data-field="evolution_seance">
              <option value="">—</option>
              <option value="disparu_echauffement" ${d.evolution_seance === 'disparu_echauffement' ? 'selected' : ''}>Disparu à l'échauffement</option>
              <option value="stable" ${d.evolution_seance === 'stable' ? 'selected' : ''}>Est restée stable</option>
              <option value="augmente" ${d.evolution_seance === 'augmente' ? 'selected' : ''}>A augmenté</option>
            </select>
          </label>
        </div>
      </div>
    `;
  }
  function wireDouleurs(form, p) {
    const wrap = form.querySelector('[data-douleurs]');
    const add = form.querySelector('[data-add-douleur]');
    const rerenderRow = (rowEl) => {
      const idx = rowEl.dataset.idx;
      const zone = rowEl.querySelector('[data-field="zone"]').value;
      const zoneMeta = S.zones_douleur.liste.find(z => z.code === zone);
      const cote = rowEl.querySelector('[data-field="cote"]');
      cote.disabled = !(zoneMeta && zoneMeta.lateralise);
    };
    const wireRow = (rowEl) => {
      // Scale4 buttons
      rowEl.querySelectorAll('[data-scale4]').forEach(scale => {
        const btns = scale.querySelectorAll('.s4-btn');
        // Initialise
        btns.forEach(b => {
          if (b.getAttribute('class') && b.getAttribute('class').indexOf('is-active') !== -1) {
            b.className = 's4-btn is-active';
          }
        });
        btns.forEach(b => b.addEventListener('click', () => {
          btns.forEach(x => x.classList.remove('is-active'));
          b.classList.add('is-active');
          syncEvo(rowEl);
        }));
      });
      // Zone change → sync côté
      rowEl.querySelector('[data-field="zone"]').addEventListener('change', () => rerenderRow(rowEl));
      // Remove
      rowEl.querySelector('[data-remove-douleur]').addEventListener('click', () => rowEl.remove());
      // Init cote disabled state + evo visibility
      rerenderRow(rowEl);
      syncEvo(rowEl);
    };
    const syncEvo = (rowEl) => {
      const seanceScale = rowEl.querySelector('[data-scale4="seance"]');
      const active = seanceScale.querySelector('.s4-btn.is-active');
      const val = active ? +active.dataset.val : 0;
      const evo = rowEl.querySelector('[data-evo]');
      evo.hidden = val < 1;
    };
    wrap.querySelectorAll('[data-douleur-row]').forEach(wireRow);
    add.addEventListener('click', () => {
      const nextIdx = wrap.querySelectorAll('[data-douleur-row]').length;
      const tmp = document.createElement('div');
      tmp.innerHTML = renderDouleurBlock({ zone: 'mollet' }, nextIdx);
      const row = tmp.firstElementChild;
      wrap.appendChild(row);
      wireRow(row);
    });
  }

  // ---- Section "Qualité" ----
  function sectionQualite(day, p) {
    const q = p || {};
    return `
      <fieldset class="fset">
        <legend>Exécution de la séance de qualité</legend>
        <p class="fset__hint">Ces champs alimentent les recalibrations du 25/10 et du 14/11.</p>
        <label class="field">
          <span class="field__label">Allure de chaque bloc</span>
          <input type="text" name="allures_blocs" placeholder="4:36 / 4:29 / 4:18" value="${escapeHtml((q.allures_blocs || []).join(' / '))}">
          <span class="field__hint">Séparer par « / ». Copiable depuis la montre.</span>
        </label>
        <div class="field">
          <span class="field__label">Répétitions en réserve *</span>
          <div class="radio-list" data-radio="reserve">
            ${['0','1','2','3'].map(v => `
              <label class="radio ${String(q.reserve) === v ? 'is-active' : ''}">
                <input type="radio" name="reserve" value="${v}" ${String(q.reserve) === v ? 'checked' : ''} required>
                <span>${v === '0' ? '0 — je n\'aurais pas pu en faire une de plus' : (v === '3' ? '3 ou plus' : v)}</span>
              </label>
            `).join('')}
          </div>
        </div>
        <div class="field">
          <span class="field__label">Surface *</span>
          <div class="radio-list radio-list--inline" data-radio="surface">
            ${['piste','chemin roulant','bitume','sentier technique','tapis'].map(v => `
              <label class="radio ${q.surface === v ? 'is-active' : ''}">
                <input type="radio" name="surface" value="${v}" ${q.surface === v ? 'checked' : (v === 'chemin roulant' && !q.surface ? 'checked' : '')} required>
                <span>${escapeHtml(v)}</span>
              </label>
            `).join('')}
          </div>
        </div>
      </fieldset>
    `;
  }
  function wireQualite(form) {
    form.querySelectorAll('[data-radio] .radio input').forEach(input => {
      input.addEventListener('change', () => {
        const list = input.closest('[data-radio]');
        list.querySelectorAll('.radio').forEach(l => l.classList.remove('is-active'));
        input.closest('.radio').classList.add('is-active');
      });
    });
  }

  // ---- Section libre ----
  function sectionLibre(p) {
    return `
      <fieldset class="fset">
        <legend>Autre chose ?</legend>
        <label class="field">
          <span class="field__label">Commentaire</span>
          <textarea name="commentaire" maxlength="1000" rows="3" placeholder="Facultatif. Tout ce qui sort de l'ordinaire.">${escapeHtml(p ? p.commentaire : '')}</textarea>
        </label>
      </fieldset>
    `;
  }

  // -------- Submit + validation --------------------------------------------
  function submitForm() {
    const form = modalEl.querySelector('.suivi-modal__form');

    // Collect
    const sub = {
      date: form.querySelector('input[name="date"]').value,
      seance_id: currentWeek.id + '-' + currentDay.date,
      semaine_id: currentWeek.id,
      seance_type: currentDay.type,
      execution: form.querySelector('select[name="execution"]').value,
      motif_ecart: form.querySelector('input[name="motif_ecart"]').value.trim() || null,
      duree_min: parseInt(form.querySelector('input[name="duree_min"]').value, 10) || null,
      km_reels: (() => {
        const raw = form.querySelector('input[name="km_reels"]').value.replace(',', '.').trim();
        if (!raw) return null;
        const v = parseFloat(raw);
        return isNaN(v) ? null : v;
      })(),
      denivele_reel: (() => {
        const raw = form.querySelector('input[name="denivele_reel"]').value.trim();
        if (!raw) return null;
        const v = parseInt(raw, 10);
        return isNaN(v) ? null : v;
      })(),
      rpe: parseInt(form.querySelector('input[name="rpe"]').value, 10) || null,
      jambes_5: parseInt(form.querySelector('input[name="jambes_5"]').value, 10) || null,
      forme_5: parseInt(form.querySelector('input[name="forme_5"]').value, 10) || null,
      allures_blocs: (form.querySelector('input[name="allures_blocs"]')?.value || '')
        .split('/').map(s => s.trim()).filter(Boolean),
      reserve: form.querySelector('input[name="reserve"]:checked')?.value ?? null,
      surface: form.querySelector('input[name="surface"]:checked')?.value ?? null,
      commentaire: form.querySelector('textarea[name="commentaire"]').value.trim() || null,
      douleurs: collectDouleurs(form)
    };
    sub.charge_srpe = (sub.rpe && sub.duree_min) ? sub.rpe * sub.duree_min : null;

    // Validation
    const missing = [];
    if (!sub.duree_min) missing.push('Durée réelle');
    if (!sub.execution) missing.push('Séance réalisée');
    if (sub.execution !== 'conforme' && !sub.motif_ecart) missing.push('Motif de l\'écart');
    if (!sub.rpe) missing.push('RPE');
    if (!sub.jambes_5) missing.push('Jambes');
    if (!sub.forme_5) missing.push('Forme');
    if (QUAL_TYPES.includes(currentDay.type)) {
      if (sub.reserve == null) missing.push('Répétitions en réserve');
      if (!sub.surface) missing.push('Surface');
    }
    if (missing.length) {
      showAlerts([{ niveau: 'critique', message: 'Champs manquants : ' + missing.join(', ') }]);
      return;
    }

    // Save
    const store = loadSuivi();
    store[currentDay.date] = {
      saved_at: new Date().toISOString(),
      submission: sub
    };
    if (!saveSuivi(store)) {
      showAlerts([{ niveau: 'critique', message: 'Impossible d\'enregistrer localement (mode privé ?).' }]);
      return;
    }

    // Marque la séance comme faite (module principal)
    try {
      const done = JSON.parse(localStorage.getItem('mrun.mathilde.done.v1') || '{}');
      done[currentDay.date] = true;
      localStorage.setItem('mrun.mathilde.done.v1', JSON.stringify(done));
    } catch (e) { /* ignore */ }

    // Reflet visuel côté carte
    if (currentCard) {
      currentCard.classList.add('is-done');
      const cb = currentCard.querySelector('[data-day-check]');
      if (cb) cb.checked = true;
      const label = currentCard.querySelector('.day-card__check-label');
      if (label) label.textContent = 'Fait · voir/modifier';
      const pill = currentCard.querySelector('.day-card__check-pill');
      if (pill) pill.classList.add('is-saved');
    }

    // Rafraîchit compteurs si l'API principale expose une fonction
    if (typeof window.mathildeRefresh === 'function') window.mathildeRefresh(currentWeek.id);

    // Alertes règles
    const alertes = evalAlertes(sub, currentDay.type);

    // Envoi vers la feuille de suivi. La sauvegarde locale étant déjà faite,
    // un échec réseau ne perd rien : la soumission part en file de réessai.
    const payload = {
      token: WEBHOOK_TOKEN,
      saved_at: store[currentDay.date].saved_at,
      submission: sub
    };
    showAlerts(alertes.concat([{ niveau: 'info', message: '⟳ Envoi vers la feuille de suivi…' }]));

    postToSheet(payload).then(() => {
      dequeue(payload);
      showAlerts(alertes.concat([{ niveau: 'ok', message: '✓ Séance enregistrée et synchronisée.' }]));
      setTimeout(closeModal, alertes.length ? 3400 : 1100);
    }).catch(() => {
      enqueue(payload);
      showAlerts(alertes.concat([{
        niveau: 'alerte',
        message: 'Séance enregistrée sur cet appareil. La synchronisation a échoué — elle sera retentée automatiquement au prochain chargement de la page.'
      }]));
      setTimeout(closeModal, 3800);
    });
  }

  function collectDouleurs(form) {
    const rows = form.querySelectorAll('[data-douleur-row]');
    const out = [];
    rows.forEach(row => {
      const zone = row.querySelector('[data-field="zone"]').value;
      const cote = row.querySelector('[data-field="cote"]').disabled ? null : row.querySelector('[data-field="cote"]').value;
      const getScale = (m) => {
        const a = row.querySelector(`[data-scale4="${m}"] .s4-btn.is-active`);
        return a ? +a.dataset.val : 0;
      };
      const reveil = getScale('reveil'), journee = getScale('journee'), seance = getScale('seance');
      const evo = row.querySelector('[data-field="evolution_seance"]').value || null;
      out.push({
        zone, cote,
        reveil, journee, seance,
        evolution_seance: seance >= 1 ? evo : null,
        max_jour: Math.max(reveil, journee, seance)
      });
    });
    return out;
  }

  // -------- Évaluation d'alertes -------------------------------------------
  function evalAlertes(sub, type) {
    const out = [];
    // Douleur bloquante (3 partout)
    const bloq = sub.douleurs.find(d => d.reveil === 3 || d.journee === 3 || d.seance === 3);
    if (bloq) out.push({ niveau: 'critique', message: `Douleur bloquante déclarée sur « ${bloq.zone} ». Avis kiné. Aucune intensité avant avis.` });
    // Douleur tibia au repos
    const tib = sub.douleurs.find(d => d.zone === 'tibia' && (d.reveil >= 1 || d.journee >= 1));
    if (tib) out.push({ niveau: 'critique', message: 'Tibia douloureux au repos → arrêt immédiat de l\'intensité. Volume en Z2 conservé.' });
    // Séance trop facile
    if (['seuil','vma','allure_course','seance_specifique'].includes(type) && +sub.reserve >= 2 && sub.execution === 'conforme') {
      out.push({ niveau: 'info', message: 'Séance semble trop lente (2+ répétitions en réserve). À remonter au coach pour la prochaine recalibration.' });
    }
    // Surface bitume
    if (['seuil','vma','seance_specifique'].includes(type) && sub.surface === 'bitume') {
      out.push({ niveau: 'info', message: 'Rappel : VMA/seuil jamais sur bitume tant que le drapeau tibial n\'est pas oublié depuis 2 mois.' });
    }
    // RPE incohérent EF
    if (['ef','sortie_longue','foncier'].includes(type) && sub.rpe >= 7) {
      out.push({ niveau: 'info', message: 'Un footing vécu comme dur (RPE ≥ 7) : croiser avec les marqueurs du matin. Signal de fatigue avant d\'être un signal d\'allure.' });
    }
    return out;
  }

  function showAlerts(alertes) {
    const wrap = modalEl.querySelector('.suivi-modal__alerts');
    wrap.innerHTML = alertes.map(a => `
      <div class="alert alert--${a.niveau}">${escapeHtml(a.message)}</div>
    `).join('');
    wrap.hidden = alertes.length === 0;
    wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // -------- API publique ---------------------------------------------------
  // Le module Plan appelle openSuivi(day, week, cardElement) quand on clique
  // sur la pill de checkbox.
  window.mathildeSuivi = {
    open: openModal,
    hasSubmission: (dayKey) => !!loadSuivi()[dayKey],
    getSubmission: (dayKey) => loadSuivi()[dayKey] || null,
    getAll: loadSuivi,
    // Synchronisation
    pending: () => loadQueue().length,
    flush: flushQueue,
    pull: fetchRemoteState,
    sync: syncWithSheet,
    // Renvoie TOUT l'historique local vers la feuille (réparation manuelle)
    resync: function () {
      const all = loadSuivi();
      Object.keys(all).forEach((dayKey) => {
        enqueue({ token: WEBHOOK_TOKEN, saved_at: all[dayKey].saved_at, submission: all[dayKey].submission });
      });
      return flushQueue();
    },
    // Efface tout l'état local puis recharge depuis la feuille.
    // À utiliser quand la feuille a été corrigée à la main.
    reset: function () {
      try {
        localStorage.removeItem(LS_SUIVI);
        localStorage.removeItem(LS_QUEUE);
        localStorage.removeItem('mrun.mathilde.done.v1');
      } catch (e) { /* silencieux */ }
      if (typeof window.mathildeApplyDone === 'function') window.mathildeApplyDone();
      console.info('[Mrun] État local effacé. Relecture de la feuille…');
      return syncWithSheet();
    }
  };

  // Au chargement : on pousse la file d'attente puis on relit la feuille,
  // pour que l'état « fait » suive d'un appareil à l'autre.
  document.addEventListener('DOMContentLoaded', () => {
    updateSyncBadge();
    syncWithSheet();
  });
  // Retour de connexion, ou retour sur l'onglet après un moment ailleurs
  window.addEventListener('online', syncWithSheet);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') syncWithSheet();
  });
})();
