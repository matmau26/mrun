/* ================================================================
   Plan Mathilde — SainteSprint 24 km — Renderer v2
   Consomme window.PLAN_MATHILDE_SS
   Organisation : 3 onglets (Plan / Repères / Règles)
   Plan = fiche course + accordéon 11 semaines avec détail dépliable
   ================================================================ */
(function () {
  'use strict';

  const D = window.PLAN_MATHILDE_SS;
  if (!D) return;

  // ------- Utils -----------------------------------------------------------
  const $ = (sel, root = document) => root.querySelector(sel);
  const create = (tag, cls, txt) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (txt != null) el.textContent = txt;
    return el;
  };
  const fmtFrDate = (isoDate) => {
    if (!isoDate) return '';
    const dt = new Date(isoDate + 'T12:00:00');
    return dt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  const today = () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };
  const toDate = (iso) => new Date(iso + 'T00:00:00');
  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  // ------- LocalStorage : séances cochées ---------------------------------
  const LS_KEY = 'mrun.mathilde.done.v1';
  const loadDone = () => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}') || {}; }
    catch (e) { return {}; }
  };
  const saveDone = (obj) => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(obj)); }
    catch (e) { /* silencieux */ }
  };
  const DONE = loadDone();

  // ------- Phase → couleur -------------------------------------------------
  const PHASE_COLORS = {
    'RECUP': { bg: 'rgba(148, 163, 184, 0.18)', bd: 'rgba(148, 163, 184, 0.55)', text: '#94a3b8' },
    'REPRISE': { bg: 'rgba(59, 130, 246, 0.18)', bd: 'rgba(59, 130, 246, 0.55)', text: '#60a5fa' },
    'FOND': { bg: 'rgba(43, 199, 106, 0.18)', bd: 'rgba(43, 199, 106, 0.55)', text: '#2BC76A' },
    'DEVELOPPEMENT': { bg: 'rgba(255, 87, 34, 0.18)', bd: 'rgba(255, 87, 34, 0.55)', text: '#FF5722' },
    'AFFUTAGE': { bg: 'rgba(233, 30, 155, 0.18)', bd: 'rgba(233, 30, 155, 0.55)', text: '#E91E9B' },
    'COURSE': { bg: 'rgba(230, 57, 70, 0.22)', bd: 'rgba(230, 57, 70, 0.65)', text: '#ff6470' },
  };
  const phaseColor = (p) => PHASE_COLORS[p] || PHASE_COLORS['FOND'];

  const TYPE_ICON = {
    'repos': '·', 'marche': '🚶', 'velo': '🚴', 'foncier': '🏃', 'ef': '🏃',
    'sortie_longue': '🏔️', 'seuil': '⚡', 'cotes': '⛰️',
    'seance_specifique': '🎯', 'test': '📊', 'course': '🏁', 'renforcement': '🏋️',
  };
  const typeIcon = (t) => TYPE_ICON[t] || '·';

  const isCurrentWeek = (s) => {
    const t = today();
    return t >= toDate(s.debut) && t <= toDate(s.fin);
  };
  const isPastWeek = (s) => today() > toDate(s.fin);

  // ------- Anneau de progression SVG --------------------------------------
  // Retourne un <span.ring> autonome, à insérer dans un header.
  function progressRing(done, total, weekId) {
    const size = 44;
    const stroke = 5;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const pct = total ? done / total : 0;
    const dash = pct * c;
    const ring = create('span', 'ring');
    ring.setAttribute('title', done + ' / ' + total + ' séances faites');
    ring.innerHTML = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">
        <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="rgba(255,255,255,0.10)" stroke-width="${stroke}"/>
        <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none"
          stroke="url(#ring-grad-${weekId})" stroke-width="${stroke}"
          stroke-linecap="round"
          stroke-dasharray="${dash} ${c}"
          transform="rotate(-90 ${size/2} ${size/2})"
          data-ring-dash="${weekId}"/>
        <defs>
          <linearGradient id="ring-grad-${weekId}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#2BC76A"/>
            <stop offset="100%" stop-color="#FF5722"/>
          </linearGradient>
        </defs>
      </svg>
      <span class="ring__num" data-ring-num="${weekId}">${done}/${total}</span>
    `;
    ring.dataset.ringWeek = weekId;
    ring.dataset.ringTotal = total;
    ring.dataset.ringCircum = c.toFixed(3);
    return ring;
  }

  function updateRing(weekId, done, total) {
    const ring = document.querySelector('[data-ring-week="' + weekId + '"]');
    if (!ring) return;
    const c = parseFloat(ring.dataset.ringCircum || 0);
    const dash = total ? (done / total) * c : 0;
    const path = document.querySelector('[data-ring-dash="' + weekId + '"]');
    if (path) path.setAttribute('stroke-dasharray', dash.toFixed(2) + ' ' + c.toFixed(2));
    const num = document.querySelector('[data-ring-num="' + weekId + '"]');
    if (num) num.textContent = done + '/' + total;
  }

  // ------- Hero ------------------------------------------------------------
  function renderHero() {
    const el = $('#hero-content');
    const c = D.course || {};

    el.innerHTML = `
      <div class="hero__tag">Plan personnel — accès privé</div>
      <h1>SainteSprint 24 km <span>· Mathilde</span></h1>
      <p class="hero__sub">
        <strong>${c.nom || 'Course'}</strong> ·
        ${c.distance_km ? c.distance_km + ' km' : ''}
        ${c.date ? ' · départ ' + fmtFrDate(c.date) : ''}
        ${c.heure_depart ? ' · ' + c.heure_depart : ''}
      </p>
      <div class="hero__tags">
        <span class="tag">${D.meta.nb_semaines} semaines</span>
        <span class="tag">Début ${fmtFrDate(D.meta.debut)}</span>
        <span class="tag">Course ${fmtFrDate(D.meta.fin)}</span>
        <span class="tag tag--accent">${D.meta.orientation || ''}</span>
      </div>
      <p class="hero__foot">Version ${D.meta.plan_version} — généré le ${fmtFrDate(D.meta.genere_le)}</p>
    `;

    const target = toDate(c.date);
    const t = today();
    const days = Math.round((target - t) / 86400000);
    const cd = $('#countdown');
    if (cd) {
      const countdownHtml = days > 0
        ? `<span class="countdown__num">${days}</span> jours avant la course`
        : days === 0
          ? `<span class="countdown__num">C'est aujourd'hui</span>`
          : `<span class="countdown__num">Course passée</span>`;
      cd.innerHTML = `
        ${countdownHtml}
        <div class="progress">
          <div class="progress__head">
            <span class="progress__label">Séances faites</span>
            <span class="progress__val"><strong data-global-done>0 / 0</strong> · <span data-global-remain>0 restante</span> · <span data-global-pct>0 %</span></span>
          </div>
          <div class="progress__bar"><div class="progress__fill" data-global-bar style="width: 0%;"></div></div>
          <p class="progress__hint">Coche chaque séance faite. La progression est enregistrée localement dans ce navigateur.</p>
        </div>
      `;
    }
  }

  // ------- Fiche course ---------------------------------------------------
  // (SANS l'alerte heure_depart_alerte)
  function renderCourseInfo() {
    const wrap = $('#course-info');
    if (!wrap || !D.course) return;
    const c = D.course;
    const rows = [
      ['Nom', c.nom],
      ['Date', fmtFrDate(c.date) + (c.heure_depart ? ' · ' + c.heure_depart : '')],
      ['Distance', c.distance_km ? c.distance_km + ' km' : null],
      ['Départ', c.depart_lieu],
      ['Arrivée', c.arrivee_lieu],
      ['Profil', c.profil],
    ].filter((r) => r[1]);
    const dl = create('dl', 'course-info__list');
    rows.forEach(([k, v]) => {
      dl.appendChild(create('dt', null, k));
      dl.appendChild(create('dd', null, v));
    });
    wrap.appendChild(dl);
  }

  // ------- Plan accordéon (aperçu + détail fusionnés) ---------------------
  function renderPlanAccordion() {
    const wrap = $('#plan-accordion');
    if (!wrap) return;

    D.semaines.forEach((s) => {
      const color = phaseColor(s.phase);
      const isNow = isCurrentWeek(s);
      const isPast = isPastWeek(s);
      const doableJours = (s.jours || []).filter((j) => !j.repos);
      const doneCount = doableJours.filter((j) => DONE[j.date]).length;
      const totalCount = doableJours.length;

      const details = document.createElement('details');
      details.className = 'week-acc'
        + (isNow ? ' is-now' : '')
        + (isPast ? ' is-past' : '');
      details.style.setProperty('--phase-bd', color.bd);
      details.style.setProperty('--phase-bg', color.bg);
      details.style.setProperty('--phase-text', color.text);
      details.dataset.weekId = s.id;
      if (isNow) details.open = true;

      // ---- SUMMARY (visible fermé) ----
      const summary = document.createElement('summary');
      summary.className = 'week-acc__summary';
      summary.innerHTML = `
        <div class="week-acc__id">
          <span class="week-acc__code">${s.id}</span>
          <span class="week-acc__phase">${s.phase}</span>
          ${isNow ? '<span class="week-acc__badge">En cours</span>' : ''}
        </div>
        <div class="week-acc__meta">
          <h3>${s.libelle_dates}</h3>
          ${s.focus ? '<p class="week-acc__focus">' + escapeHtml(s.focus) + '</p>' : ''}
        </div>
        <div class="week-acc__stats">
          <div><b>${s.duree_cible || '—'}</b><span>durée</span></div>
          <div><b>${s.km_cible ? s.km_cible + ' km' : '—'}</b><span>volume</span></div>
          <div><b>${s.nb_seances}</b><span>séances</span></div>
        </div>
        <div class="week-acc__ring" data-week-ring="${s.id}"></div>
        <svg class="week-acc__chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      `;
      // Insère l'anneau
      const ringSlot = summary.querySelector('[data-week-ring]');
      if (ringSlot) ringSlot.appendChild(progressRing(doneCount, totalCount, s.id));

      details.appendChild(summary);

      // ---- DÉTAIL (visible ouvert) ----
      const body = document.createElement('div');
      body.className = 'week-acc__body';
      if (s.point_cle) {
        body.innerHTML = '<p class="week-acc__key"><strong>Point clé :</strong> ' + escapeHtml(s.point_cle) + '</p>';
      }
      const days = document.createElement('div');
      days.className = 'days-grid';
      (s.jours || []).forEach((j) => {
        const key = j.date;
        const isDone = !!DONE[key];
        const canCheck = !j.repos; // Pas de checkbox sur repos
        const day = document.createElement('article');
        day.className = 'day-card'
          + (j.cle ? ' is-key' : '')
          + (j.repos ? ' is-rest' : '')
          + (isDone && canCheck ? ' is-done' : '');
        day.dataset.dayKey = key;
        day.dataset.weekId = s.id;
        day.innerHTML = `
          <header>
            <span class="day-card__day">${j.jour}</span>
            <span class="day-card__date">${fmtFrDate(j.date).replace(/ ?\d{4}$/, '')}</span>
            ${j.cle ? '<span class="day-card__flag">clé</span>' : ''}
          </header>
          <h4 class="day-card__title"><span class="day-card__icon">${typeIcon(j.type)}</span>${escapeHtml(j.titre || '')}</h4>
          ${j.contenu ? '<p class="day-card__body">' + escapeHtml(j.contenu) + '</p>' : ''}
          ${canCheck ? `
            <label class="day-card__check">
              <input type="checkbox" data-day-check ${isDone ? 'checked' : ''} aria-label="Marquer cette séance comme faite" />
              <span class="day-card__check-pill">
                <span class="day-card__check-tick" aria-hidden="true">✓</span>
                <span class="day-card__check-label">${isDone ? 'Fait' : 'Marquer comme fait'}</span>
              </span>
            </label>
          ` : ''}
        `;
        days.appendChild(day);
      });
      body.appendChild(days);
      details.appendChild(body);

      wrap.appendChild(details);
    });

    // Écouteur global pour les checkboxes
    wrap.addEventListener('change', (e) => {
      const cb = e.target.closest('[data-day-check]');
      if (!cb) return;
      const card = cb.closest('.day-card');
      if (!card) return;
      const key = card.dataset.dayKey;
      const weekId = card.dataset.weekId;
      if (cb.checked) DONE[key] = true;
      else delete DONE[key];
      saveDone(DONE);
      card.classList.toggle('is-done', cb.checked);
      const label = card.querySelector('.day-card__check-label');
      if (label) label.textContent = cb.checked ? 'Fait' : 'Marquer comme fait';
      // Met à jour ring de la semaine + compteurs globaux
      const s = D.semaines.find((x) => x.id === weekId);
      if (s) {
        const doable = s.jours.filter((j) => !j.repos);
        const done = doable.filter((j) => DONE[j.date]).length;
        updateRing(weekId, done, doable.length);
      }
      refreshGlobal();
    });
  }

  // ------- Compteur global ------------------------------------------------
  function refreshGlobal() {
    const total = D.semaines.reduce((n, s) => n + s.jours.filter((j) => !j.repos).length, 0);
    const done = D.semaines.reduce((n, s) => n + s.jours.filter((j) => !j.repos && DONE[j.date]).length, 0);
    const remain = Math.max(0, total - done);
    const pct = total ? Math.round(done * 100 / total) : 0;
    const setTxt = (sel, txt) => { const el = document.querySelector(sel); if (el) el.textContent = txt; };
    setTxt('[data-global-done]', done + ' / ' + total);
    setTxt('[data-global-remain]', remain + ' restante' + (remain > 1 ? 's' : ''));
    setTxt('[data-global-pct]', pct + ' %');
    const bar = document.querySelector('[data-global-bar]');
    if (bar) bar.style.width = pct + '%';
  }

  // ------- Zones FC --------------------------------------------------------
  function renderZonesFC() {
    const wrap = $('#zones-fc');
    if (!wrap || !D.zones_fc) return;
    const alert = create('p', 'note-alert');
    alert.innerHTML = '<strong>⚠︎ À reparamétrer dans Garmin Connect.</strong> ' + escapeHtml(D.zones_fc.alerte || '');
    wrap.appendChild(alert);
    if (D.zones_fc.base) wrap.appendChild(create('p', 'note-meta', D.zones_fc.base));

    const list = create('div', 'zones-list');
    D.zones_fc.liste.forEach((z) => {
      const row = create('div', 'zone-item');
      row.innerHTML = `
        <div class="zone-item__head">
          <span class="zone-item__id">${z.zone}</span>
          <span class="zone-item__name">${z.nom}</span>
          <span class="zone-item__range">${z.bpm}</span>
        </div>
        <p class="zone-item__usage">${escapeHtml(z.usage || '')}</p>
      `;
      list.appendChild(row);
    });
    wrap.appendChild(list);
  }

  // ------- Allures (SANS l'alerte v1) -------------------------------------
  function renderAllures() {
    const wrap = $('#allures');
    if (!wrap || !D.allures) return;
    const meta = create('p', 'note-meta');
    meta.innerHTML = '<strong>Statut :</strong> ' + escapeHtml(D.allures.statut || '')
      + ' · <strong>Valides jusqu\'au :</strong> ' + fmtFrDate(D.allures.valides_jusqu_au);
    wrap.appendChild(meta);

    const table = create('table', 'ptable');
    table.innerHTML = '<thead><tr><th>Allure</th><th>Rythme /km</th><th>FC</th><th>Utilisation</th></tr></thead><tbody></tbody>';
    const tb = table.querySelector('tbody');
    D.allures.liste.forEach((a) => {
      const tr = create('tr');
      tr.innerHTML = `
        <td><strong>${escapeHtml(a.nom)}</strong></td>
        <td>${escapeHtml(a.allure_plat || a.allure || '—')}</td>
        <td>${escapeHtml(a.fc || '—')}</td>
        <td>${escapeHtml(a.seances || a.usage || '—')}</td>
      `;
      tb.appendChild(tr);
    });
    wrap.appendChild(table);
  }

  // ------- Zones Puissance ------------------------------------------------
  function renderZonesPower() {
    const wrap = $('#zones-power');
    if (!wrap || !D.zones_puissance) return;
    if (D.zones_puissance.base) wrap.appendChild(create('p', 'note-meta', D.zones_puissance.base));
    const list = D.zones_puissance.liste || [];
    if (list.length === 0) return;
    const table = create('table', 'ptable');
    table.innerHTML = '<thead><tr><th>Zone</th><th>Nom</th><th>%CP</th><th>Watts</th></tr></thead><tbody></tbody>';
    const tb = table.querySelector('tbody');
    list.forEach((z) => {
      const tr = create('tr');
      tr.innerHTML = `
        <td><strong>${escapeHtml(z.zone || '')}</strong></td>
        <td>${escapeHtml(z.nom || '')}</td>
        <td>${escapeHtml(z.pct_cp || z.pct || '—')}</td>
        <td>${escapeHtml(z.watts || z.puissance || '—')}</td>
      `;
      tb.appendChild(tr);
    });
    wrap.appendChild(table);
  }

  // ------- Tests -----------------------------------------------------------
  function renderTests() {
    const wrap = $('#tests');
    if (!wrap || !D.tests) return;
    D.tests.forEach((t) => {
      const card = create('article', 'test-card' + (t.cle ? ' is-key' : ''));
      card.innerHTML = `
        <header>
          <span class="test-card__date">${fmtFrDate(t.date)}</span>
          ${t.cle ? '<span class="test-card__key">test clé</span>' : ''}
        </header>
        <h3>${escapeHtml(t.nom)}</h3>
        ${t.protocole ? '<p><strong>Protocole.</strong> ' + escapeHtml(t.protocole) + '</p>' : ''}
        ${t.exploitation ? '<p><strong>Exploitation.</strong> ' + escapeHtml(t.exploitation) + '</p>' : ''}
      `;
      wrap.appendChild(card);
    });
  }

  // ------- Règles ----------------------------------------------------------
  function renderRules() {
    const wrap = $('#rules');
    if (!wrap || !D.regles) return;
    D.regles.forEach((r, i) => {
      const card = create('article', 'rule-card');
      card.innerHTML = `
        <span class="rule-card__num">${String(i + 1).padStart(2, '0')}</span>
        <div>
          <h4>${escapeHtml(r.titre)}</h4>
          <p>${escapeHtml(r.detail)}</p>
        </div>
      `;
      wrap.appendChild(card);
    });
  }

  // ------- Tabs ------------------------------------------------------------
  function initTabs() {
    const tabs = Array.from(document.querySelectorAll('.tab[data-tab]'));
    const panels = Array.from(document.querySelectorAll('.tab-panel'));
    const activate = (name) => {
      tabs.forEach((t) => {
        const on = t.dataset.tab === name;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      panels.forEach((p) => {
        const on = p.id === 'tab-' + name;
        p.classList.toggle('is-active', on);
        p.hidden = !on;
      });
      // scroll to top of the panel area
      const bar = document.querySelector('.tabs-bar');
      if (bar) window.scrollTo({ top: window.scrollY + bar.getBoundingClientRect().top - 60, behavior: 'smooth' });
    };
    tabs.forEach((t) => t.addEventListener('click', () => activate(t.dataset.tab)));
  }

  // ------- Init ------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    renderHero();
    renderCourseInfo();
    renderPlanAccordion();
    renderZonesFC();
    renderAllures();
    renderZonesPower();
    renderTests();
    renderRules();
    refreshGlobal();

    const gen = $('#generated-on');
    if (gen) gen.textContent = fmtFrDate(D.meta.genere_le);
  });
})();
