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
        <span class="tag">Course ${fmtFrDate(c.date || D.meta.fin)}</span>
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

    // Ouvre la modale de suivi au lieu du toggle direct.
    const openSuiviFrom = (card) => {
      const weekId = card.dataset.weekId;
      const dayKey = card.dataset.dayKey;
      const s = D.semaines.find((x) => x.id === weekId);
      if (!s) return;
      const day = (s.jours || []).find((j) => j.date === dayKey);
      if (!day || day.repos) return;
      if (window.mathildeSuivi && typeof window.mathildeSuivi.open === 'function') {
        window.mathildeSuivi.open(day, s, card);
      } else {
        // Fallback toggle
        const cb = card.querySelector('[data-day-check]');
        if (cb) {
          cb.checked = !cb.checked;
          if (cb.checked) DONE[dayKey] = true; else delete DONE[dayKey];
          saveDone(DONE);
          card.classList.toggle('is-done', cb.checked);
          refreshGlobal();
        }
      }
    };
    wrap.addEventListener('click', (e) => {
      const label = e.target.closest('label.day-card__check');
      if (!label) return;
      e.preventDefault();
      e.stopPropagation();
      const card = label.closest('.day-card');
      if (card) openSuiviFrom(card);
    });
    // Clavier : Espace/Entrée sur la checkbox invisible
    wrap.addEventListener('keydown', (e) => {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      const cb = e.target.closest('[data-day-check]');
      if (!cb) return;
      e.preventDefault();
      const card = cb.closest('.day-card');
      if (card) openSuiviFrom(card);
    });

    // Refresh callback exposé pour le module suivi.
    // Re-lit DONE depuis le localStorage pour rester synchro avec les
    // écritures faites depuis la modale.
    window.mathildeRefresh = (weekId) => {
      try {
        const fresh = JSON.parse(localStorage.getItem(LS_KEY) || '{}') || {};
        Object.keys(DONE).forEach((k) => { if (!(k in fresh)) delete DONE[k]; });
        Object.keys(fresh).forEach((k) => { DONE[k] = fresh[k]; });
      } catch (e) { /* ignore */ }
      const s = D.semaines.find((x) => x.id === weekId);
      if (s) {
        const doable = s.jours.filter((j) => !j.repos);
        const done = doable.filter((j) => DONE[j.date]).length;
        updateRing(weekId, done, doable.length);
      }
      refreshGlobal();
    };
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

  // Bloc « Repères » — priorité au fichier dédié (window.PLAN_MATHILDE_REPERES),
  // fallback sur les blocs historiques de PLAN_MATHILDE_SS.
  const R = window.PLAN_MATHILDE_REPERES || {};
  const zonesFcSrc = R.zones_fc || D.zones_fc;
  const zonesPowerSrc = R.zones_puissance || D.zones_puissance;
  const tableauPilotage = R.tableau_pilotage || null;

  // ------- Tableau de pilotage (allure + FC + watts + usage fusionnés) ----
  function renderTableauPilotage() {
    const wrap = $('#tableau-pilotage');
    if (!wrap || !tableauPilotage) return;
    const T = tableauPilotage;
    const rampe = (T.rampe && T.rampe.sombre) || ['#cde2fb', '#86b6ef', '#3987e5', '#256abf', '#184f95'];
    const colorFor = (i) => rampe[Math.max(0, Math.min(rampe.length - 1, i - 1))];

    if (T.note) {
      const note = create('p', 'note-meta');
      note.textContent = T.note;
      wrap.appendChild(note);
    }
    const meta = create('p', 'note-meta');
    meta.innerHTML = '<strong>Statut :</strong> ' + escapeHtml(T.statut || '')
      + ' · <strong>Valides jusqu\'au :</strong> ' + fmtFrDate(T.valides_jusqu_au);
    wrap.appendChild(meta);

    // Rendu en cartes (adaptables mobile ↔ desktop) plutôt qu'un tableau
    const list = create('div', 'pilot-list');
    (T.lignes || []).forEach((l) => {
      const c = colorFor(l.intensite || 1);
      const card = create('article', 'pilot-card');
      card.style.setProperty('--row-color', c);
      card.innerHTML = `
        <header class="pilot-card__head">
          <span class="pilot-card__intensity" title="Intensité ${l.intensite || 1}/5"></span>
          <div class="pilot-card__title">
            <strong>${escapeHtml(l.intention)}</strong>
            ${l.sous_titre ? '<small>' + escapeHtml(l.sous_titre) + '</small>' : ''}
          </div>
          <div class="pilot-card__zones">
            <span class="pilot-zone-tag pilot-zone-tag--fc"><em>FC</em>${escapeHtml(l.zone_fc || '—')}</span>
            <span class="pilot-zone-tag pilot-zone-tag--stryd"><em>Stryd</em>${escapeHtml(l.zone_stryd || '—')}</span>
          </div>
        </header>
        <div class="pilot-card__stats">
          <div class="pstat pstat--allure">
            <span class="pstat__label">Allure /km</span>
            <span class="pstat__value">${escapeHtml(l.allure || '—')}</span>
            ${l.allure_note ? '<span class="pstat__note">' + escapeHtml(l.allure_note) + '</span>' : ''}
          </div>
          <div class="pstat pstat--fc">
            <span class="pstat__label">FC</span>
            <span class="pstat__value">${escapeHtml(l.fc || '—')}</span>
            ${l.fc_note ? '<span class="pstat__note">' + escapeHtml(l.fc_note) + '</span>' : ''}
          </div>
          <div class="pstat pstat--watts">
            <span class="pstat__label">Watts</span>
            <span class="pstat__value">${escapeHtml(l.watts || '—')}</span>
            ${l.pct_cp ? '<span class="pstat__note">' + escapeHtml(l.pct_cp) + '</span>' : ''}
          </div>
        </div>
        <footer class="pilot-card__seances">
          <span class="pilot-card__seances-label">Séances</span>
          <span class="pilot-card__seances-text">${escapeHtml(l.seances || '—')}</span>
        </footer>
      `;
      list.appendChild(card);
    });
    wrap.appendChild(list);

    if (T.avertissement) {
      const note = create('div', 'legend-callout');
      note.innerHTML = '<strong>À noter.</strong> ' + escapeHtml(T.avertissement);
      wrap.appendChild(note);
    }
  }

  // ------- Zones FC --------------------------------------------------------
  function renderZonesFC() {
    const wrap = $('#zones-fc');
    if (!wrap || !zonesFcSrc) return;

    // Alerte principale
    if (zonesFcSrc.alerte) {
      const alert = create('p', 'note-alert');
      alert.innerHTML = '<strong>⚠︎ À reparamétrer dans Garmin Connect.</strong> ' + escapeHtml(zonesFcSrc.alerte);
      wrap.appendChild(alert);
    }
    if (zonesFcSrc.base) wrap.appendChild(create('p', 'note-meta', zonesFcSrc.base));

    // Tableau « à saisir dans Garmin » si présent
    if (Array.isArray(zonesFcSrc.a_saisir_dans_garmin) && zonesFcSrc.a_saisir_dans_garmin.length) {
      const box = create('div', 'garmin-fix');
      const head = create('div', 'garmin-fix__head');
      head.innerHTML = '<span>À saisir dans Garmin Connect</span>';
      box.appendChild(head);
      const table = create('table', 'ptable ptable--tight');
      table.innerHTML = '<thead><tr><th>Champ</th><th>Actuel</th><th>À mettre</th></tr></thead><tbody></tbody>';
      const tb = table.querySelector('tbody');
      zonesFcSrc.a_saisir_dans_garmin.forEach((r) => {
        const tr = create('tr');
        const changed = r.actuel != null && String(r.actuel) !== String(r.a_mettre);
        tr.innerHTML = `
          <td><strong>${escapeHtml(r.champ)}</strong></td>
          <td class="${changed ? 'garmin-fix__old' : ''}">${r.actuel != null ? escapeHtml(r.actuel) : '—'}</td>
          <td class="${changed ? 'garmin-fix__new' : ''}"><strong>${escapeHtml(r.a_mettre)}</strong>${r.note ? '<br><small>' + escapeHtml(r.note) + '</small>' : ''}</td>
        `;
        tb.appendChild(tr);
      });
      box.appendChild(table);
      wrap.appendChild(box);
    }

    // Zones
    const list = create('div', 'zones-list');
    (zonesFcSrc.liste || []).forEach((z) => {
      const row = create('div', 'zone-item');
      row.innerHTML = `
        <div class="zone-item__head">
          <span class="zone-item__id">${z.zone}</span>
          <span class="zone-item__name">${escapeHtml(z.nom || '')}</span>
          <span class="zone-item__range">${escapeHtml(z.bpm || '—')}</span>
        </div>
        ${z.pct_lthr ? '<div class="zone-item__pct">' + escapeHtml(z.pct_lthr) + ' du LTHR</div>' : ''}
        <p class="zone-item__usage">${escapeHtml(z.usage || '')}</p>
      `;
      list.appendChild(row);
    });
    wrap.appendChild(list);
  }

  // ------- Zones Puissance (5 zones Stryd) --------------------------------
  function renderZonesPower() {
    const wrap = $('#zones-power');
    if (!wrap || !zonesPowerSrc) return;
    if (zonesPowerSrc.base) wrap.appendChild(create('p', 'note-meta', zonesPowerSrc.base));
    if (zonesPowerSrc.referentiel) {
      const p = create('p', 'note-meta');
      p.textContent = zonesPowerSrc.referentiel;
      wrap.appendChild(p);
    }
    if (zonesPowerSrc.alerte) {
      const p = create('p', 'note-alert');
      p.innerHTML = '<strong>⚠︎</strong> ' + escapeHtml(zonesPowerSrc.alerte);
      wrap.appendChild(p);
    }
    if (zonesPowerSrc.alerte_donnees) {
      const p = create('p', 'note-alert');
      p.innerHTML = '<strong>⚠︎ Données.</strong> ' + escapeHtml(zonesPowerSrc.alerte_donnees);
      wrap.appendChild(p);
    }
    const list = zonesPowerSrc.liste || [];
    if (list.length === 0) return;
    const table = create('table', 'ptable');
    table.innerHTML = '<thead><tr><th>Zone</th><th>Nom</th><th>%CP</th><th>Watts</th><th class="hide-sm">W/kg</th><th class="hide-sm">Usage</th></tr></thead><tbody></tbody>';
    const tb = table.querySelector('tbody');
    list.forEach((z) => {
      const tr = create('tr');
      tr.innerHTML = `
        <td><strong>${escapeHtml(z.zone || '')}</strong></td>
        <td>${escapeHtml(z.nom || '')}</td>
        <td>${escapeHtml(z.pct_cp || z.pct || '—')}</td>
        <td>${escapeHtml(z.watts || z.puissance || '—')}</td>
        <td class="hide-sm">${escapeHtml(z.w_kg || '—')}</td>
        <td class="hide-sm">${escapeHtml(z.usage || '—')}</td>
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

  // ==========================================================================
  // COMPARATIF 2025 vs 2026
  // ==========================================================================
  const C = window.PLAN_MATHILDE_COMP;

  const CONF_COLORS = {
    vert: '#2BC76A', orange: '#FF9F1C', rouge: '#E63946', gris: '#94a3b8'
  };

  function renderComparatifVerdict() {
    const wrap = $('#comp-verdict');
    if (!wrap || !C) return;
    const v = C.verdict;
    let html = `
      <div class="verdict">
        <span class="verdict__tag">Verdict</span>
        <h2 class="verdict__title">${escapeHtml(v.titre)}</h2>
        <p class="verdict__resume">${escapeHtml(v.resume)}</p>
        <div class="verdict__grid">`;
    (v.confiance || []).forEach((c) => {
      const color = CONF_COLORS[c.couleur] || '#94a3b8';
      html += `
          <div class="conf-card" style="--conf-color: ${color};">
            <div class="conf-card__head">
              <span class="conf-card__dot"></span>
              <span class="conf-card__axe">${escapeHtml(c.axe)}</span>
              <span class="conf-card__niveau">${escapeHtml(c.niveau).replace('_', ' ')}</span>
            </div>
            <p class="conf-card__text">${escapeHtml(c.texte)}</p>
          </div>`;
    });
    html += `</div></div>`;
    wrap.innerHTML = html;
  }

  function renderComparatifSynthese() {
    const wrap = $('#comp-synthese');
    if (!wrap || !C) return;
    C.synthese.forEach((s) => {
      const isBetterHigher = ['seances', 'specifiques'].includes(s.cle);
      const isImprovement = isBetterHigher ? s.ecart_pct > 0 : s.ecart_pct < 0;
      const isFlat = Math.abs(s.ecart_pct) < 2;
      const arrow = s.ecart_pct > 0 ? '↑' : (s.ecart_pct < 0 ? '↓' : '·');
      const cls = isFlat ? 'is-flat' : (isImprovement ? 'is-up' : 'is-alert');
      const fmtVal = (v) => {
        if (s.unite === 'h') {
          const h = Math.floor(v);
          const m = Math.round((v - h) * 60);
          return h + ' h ' + String(m).padStart(2, '0');
        }
        if (s.unite === 'm') return v.toLocaleString('fr-FR').replace(/,/g, ' ') + ' m';
        if (s.unite === 'km') return v.toLocaleString('fr-FR').replace(/,/g, ' ') + ' km';
        return String(v);
      };
      const card = create('article', 'kpi ' + cls);
      card.innerHTML = `
        <span class="kpi__label">${escapeHtml(s.libelle)}</span>
        <div class="kpi__cmp">
          <div class="kpi__col">
            <span class="kpi__year">Plan 2026</span>
            <span class="kpi__val">${fmtVal(s.valeur_2026)}</span>
          </div>
          <div class="kpi__col kpi__col--alt">
            <span class="kpi__year">2025 réel</span>
            <span class="kpi__val">${fmtVal(s.valeur_2025)}</span>
          </div>
        </div>
        <div class="kpi__delta"><span class="kpi__arrow">${arrow}</span>${Math.abs(s.ecart_pct).toFixed(1)} %</div>
        ${s.reserve ? '<p class="kpi__note">' + escapeHtml(s.reserve) + '</p>' : ''}
      `;
      wrap.appendChild(card);
    });
  }

  // ------- Graphique SVG générique ---------------------------------------
  function chartWrapper(metric) {
    const w = create('article', 'chart-card');
    const head = create('header', 'chart-card__head');
    head.innerHTML = `
      <h3>${escapeHtml(metric.libelle)}</h3>
      <div class="chart-legend">
        <span><i style="background:${C.series[1].couleur_claire};"></i>Plan 2026 v2</span>
        <span><i style="background:${C.series[0].couleur_claire};"></i>Prépa 2025 réelle</span>
      </div>
    `;
    w.appendChild(head);
    return w;
  }

  function chartCanvas(metric, weeks) {
    const W = 800, H = 260, padL = 44, padR = 16, padT = 20, padB = 34;
    const innerW = W - padL - padR, innerH = H - padT - padB;
    const n = weeks.length;
    const xStep = innerW / (n - 1);
    const xBar = innerW / n;
    const yMax = metric.axe_max;
    const yFor = (v) => padT + innerH - (v == null ? 0 : v) / yMax * innerH;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('class', 'chart-svg');
    svg.setAttribute('preserveAspectRatio', 'none');

    // ------- Bande sûre (ACWR) ou bande de référence (été 2026) --------
    if (metric.cle === 'acwr' && metric.bande_sure) {
      const y1 = yFor(metric.bande_sure.max);
      const y2 = yFor(metric.bande_sure.min);
      const band = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      band.setAttribute('x', padL);
      band.setAttribute('y', y1);
      band.setAttribute('width', innerW);
      band.setAttribute('height', y2 - y1);
      band.setAttribute('class', 'chart-band');
      svg.appendChild(band);
    }
    if (metric.cle === 'km' && C.reference_ete_2026 && C.reference_ete_2026.affichage_bande) {
      const b = C.reference_ete_2026.affichage_bande;
      const y1 = yFor(b.max), y2 = yFor(b.min);
      const band = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      band.setAttribute('x', padL); band.setAttribute('y', y1);
      band.setAttribute('width', innerW); band.setAttribute('height', y2 - y1);
      band.setAttribute('class', 'chart-band chart-band--info');
      svg.appendChild(band);
    }

    // ------- Grid + labels y --------
    (metric.graduations || []).forEach((g) => {
      const y = yFor(g);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', padL); line.setAttribute('x2', padL + innerW);
      line.setAttribute('y1', y); line.setAttribute('y2', y);
      line.setAttribute('class', 'chart-grid');
      svg.appendChild(line);
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', padL - 8); t.setAttribute('y', y + 4);
      t.setAttribute('class', 'chart-tick');
      t.setAttribute('text-anchor', 'end');
      t.textContent = g;
      svg.appendChild(t);
    });

    // ------- Labels x --------
    weeks.forEach((w, i) => {
      const x = padL + i * xStep;
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', x); t.setAttribute('y', H - 12);
      t.setAttribute('class', 'chart-xlabel'); t.setAttribute('text-anchor', 'middle');
      t.textContent = w.id;
      svg.appendChild(t);
    });

    // ------- Séries --------
    const val = (w, s) => w[metric.cle] ? w[metric.cle][s] : null;

    const drawLine = (color, seriesKey, dashed = false) => {
      const pts = [];
      weeks.forEach((w, i) => {
        const v = val(w, seriesKey);
        if (v == null) return;
        const x = padL + i * xStep;
        pts.push({ x, y: yFor(v), v, week: w });
      });
      if (pts.length < 2) return;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const d = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p.x + ' ' + p.y).join(' ');
      path.setAttribute('d', d);
      path.setAttribute('class', 'chart-line' + (dashed ? ' chart-line--dashed' : ''));
      path.setAttribute('stroke', color);
      svg.appendChild(path);
      pts.forEach((p) => {
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        c.setAttribute('cx', p.x); c.setAttribute('cy', p.y); c.setAttribute('r', 3.5);
        c.setAttribute('fill', color); c.setAttribute('class', 'chart-dot');
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = p.week.id + ' — ' + formatChartValue(metric, p.v);
        c.appendChild(title);
        svg.appendChild(c);
      });
    };

    const drawBars = (colorA, colorB) => {
      // Two grouped bars per week
      const barW = xBar * 0.35;
      weeks.forEach((w, i) => {
        const xCenter = padL + i * xStep;
        const vA = val(w, 'y2026'), vB = val(w, 'y2025');
        if (vA != null) {
          const yA = yFor(vA), hA = padT + innerH - yA;
          const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          r.setAttribute('x', xCenter - barW - 1); r.setAttribute('y', yA);
          r.setAttribute('width', barW); r.setAttribute('height', hA);
          r.setAttribute('fill', colorA); r.setAttribute('class', 'chart-bar');
          const t = document.createElementNS('http://www.w3.org/2000/svg', 'title');
          t.textContent = w.id + ' · Plan 2026 : ' + formatChartValue(metric, vA);
          r.appendChild(t);
          svg.appendChild(r);
        }
        if (vB != null) {
          const yB = yFor(vB), hB = padT + innerH - yB;
          const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          r.setAttribute('x', xCenter + 1); r.setAttribute('y', yB);
          r.setAttribute('width', barW); r.setAttribute('height', hB);
          r.setAttribute('fill', colorB); r.setAttribute('class', 'chart-bar');
          const t = document.createElementNS('http://www.w3.org/2000/svg', 'title');
          t.textContent = w.id + ' · 2025 réel : ' + formatChartValue(metric, vB);
          r.appendChild(t);
          svg.appendChild(r);
        }
      });
    };

    const drawStacked = () => {
      // Stacked bars: total séances = specifiques + footings/SL
      const barW = xBar * 0.35;
      const colA = C.series[1].couleur_claire;
      const colB = C.series[0].couleur_claire;
      const colASpec = '#0a4c8a';
      const colBSpec = '#a53d16';
      weeks.forEach((w, i) => {
        const xC = padL + i * xStep;
        const draw = (xOff, total, spec, base, specColor) => {
          if (total == null) return;
          const other = total - (spec || 0);
          const yTop = yFor(total);
          const hTot = padT + innerH - yTop;
          const yMid = yFor(other);
          const hOther = padT + innerH - yMid;
          // Base (footings/SL)
          const r1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          r1.setAttribute('x', xOff); r1.setAttribute('y', yMid);
          r1.setAttribute('width', barW); r1.setAttribute('height', hOther);
          r1.setAttribute('fill', base); r1.setAttribute('class', 'chart-bar');
          svg.appendChild(r1);
          // Top (spécifiques)
          if (spec > 0) {
            const r2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            r2.setAttribute('x', xOff); r2.setAttribute('y', yTop);
            r2.setAttribute('width', barW); r2.setAttribute('height', hMid(spec, yTop, padT, innerH, yMax));
            r2.setAttribute('fill', specColor); r2.setAttribute('class', 'chart-bar');
            const t = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            t.textContent = w.id + ' — ' + total + ' séances dont ' + spec + ' spécifiques';
            r2.appendChild(t);
            svg.appendChild(r2);
          }
        };
        draw(xC - barW - 1, val(w, 'y2026'), w.specifiques ? w.specifiques.y2026 : 0, colA, colASpec);
        draw(xC + 1, val(w, 'y2025'), w.specifiques ? w.specifiques.y2025 : 0, colB, colBSpec);
      });
    };

    function hMid(spec, yTop, padT, innerH, yMax) {
      return spec / yMax * innerH;
    }

    const colB = C.series[0].couleur_claire;
    const colA = C.series[1].couleur_claire;

    if (metric.graphique === 'courbe') {
      drawLine(colB, 'y2025', true);
      drawLine(colA, 'y2026', false);
    } else if (metric.graphique === 'barres') {
      drawBars(colA, colB);
    } else if (metric.graphique === 'barres_empilees') {
      drawStacked();
    }

    return svg;
  }

  function formatChartValue(metric, v) {
    if (metric.cle === 'duree') {
      const h = Math.floor(v); const m = Math.round((v - h) * 60);
      return h + ' h ' + String(m).padStart(2, '0');
    }
    if (metric.cle === 'acwr') return v.toFixed(2);
    return v + (metric.unite ? ' ' + metric.unite : '');
  }

  function renderComparatifCharts() {
    const wrap = $('#comp-charts');
    if (!wrap || !C) return;
    C.metriques.forEach((m) => {
      const card = chartWrapper(m);
      card.appendChild(chartCanvas(m, C.semaines));
      if (m.note) {
        const p = create('p', 'chart-note');
        p.textContent = m.note;
        card.appendChild(p);
      }
      wrap.appendChild(card);
    });
  }

  function renderComparatifRisque() {
    if (!C || !C.risque) return;
    const constat = $('#comp-risque-constat');
    if (constat) constat.textContent = C.risque.constat || '';
    const wrap = $('#comp-risque');
    if (wrap) {
      (C.risque.mitigations || []).forEach((r) => {
        const card = create('article', 'rule-card');
        card.innerHTML = `
          <span class="rule-card__num">${String(r.rang).padStart(2, '0')}</span>
          <div>
            <h4>${escapeHtml(r.titre)}</h4>
            <p>${escapeHtml(r.detail)}</p>
          </div>
        `;
        wrap.appendChild(card);
      });
    }
    const marge = $('#comp-marge');
    if (marge && C.risque.marge_supplementaire) {
      marge.innerHTML = '<strong>Marge disponible.</strong> ' + escapeHtml(C.risque.marge_supplementaire);
    }
  }

  function renderComparatifSources() {
    const wrap = $('#comp-sources');
    if (!wrap || !C || !C.sources) return;
    const list = create('ul', 'src-list');
    C.sources.forEach((s) => {
      const li = create('li');
      li.innerHTML = `
        <strong>${escapeHtml(s.donnee)}</strong>
        <span>${escapeHtml(s.source)}</span>
        <em>Fiabilité : ${escapeHtml(s.fiabilite)}</em>
      `;
      list.appendChild(li);
    });
    wrap.appendChild(list);
  }

  // ------- Init ------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    renderHero();
    renderCourseInfo();
    renderPlanAccordion();
    renderTableauPilotage();
    renderZonesFC();
    renderZonesPower();
    renderTests();
    renderRules();
    refreshGlobal();

    // Nouvel onglet Comparatif
    renderComparatifVerdict();
    renderComparatifSynthese();
    renderComparatifCharts();
    renderComparatifRisque();
    renderComparatifSources();

    const gen = $('#generated-on');
    if (gen) gen.textContent = fmtFrDate(D.meta.genere_le);
  });
})();
