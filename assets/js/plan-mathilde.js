/* ================================================================
   Plan Mathilde — SainteSprint 24 km — Renderer
   Consomme window.PLAN_MATHILDE_SS (défini par plan-mathilde-data.js)
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
    // "2026-09-14" -> "14 sept. 2026"
    if (!isoDate) return '';
    const dt = new Date(isoDate + 'T12:00:00');
    return dt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  const today = () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };
  const toDate = (iso) => new Date(iso + 'T00:00:00');

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
    'repos': '·',
    'marche': '🚶',
    'velo': '🚴',
    'foncier': '🏃',
    'ef': '🏃',
    'sortie_longue': '🏔️',
    'seuil': '⚡',
    'cotes': '⛰️',
    'seance_specifique': '🎯',
    'test': '📊',
    'course': '🏁',
    'renforcement': '🏋️',
  };
  const typeIcon = (t) => TYPE_ICON[t] || '·';

  // ------- Hero card -------------------------------------------------------
  function renderHero() {
    const el = $('#hero-content');
    const a = D.athlete || {};
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

    // Countdown
    const target = toDate(c.date);
    const t = today();
    const days = Math.round((target - t) / 86400000);
    const cd = $('#countdown');
    if (cd) {
      if (days > 0) cd.innerHTML = `<span class="countdown__num">${days}</span> jours avant la course`;
      else if (days === 0) cd.innerHTML = `<span class="countdown__num">C'est aujourd'hui</span>`;
      else cd.innerHTML = `<span class="countdown__num">Course passée</span>`;
    }
  }

  // ------- Overview timeline (11 semaines) ---------------------------------
  function renderOverview() {
    const wrap = $('#overview-grid');
    D.semaines.forEach((s) => {
      const c = phaseColor(s.phase);
      const isNow = isCurrentWeek(s);
      const card = create('article', 'ov-card' + (isNow ? ' is-now' : ''));
      card.style.setProperty('--phase-bd', c.bd);
      card.style.setProperty('--phase-bg', c.bg);
      card.style.setProperty('--phase-text', c.text);
      card.innerHTML = `
        <header>
          <span class="ov-card__id">${s.id}</span>
          <span class="ov-card__phase">${s.phase}</span>
        </header>
        <p class="ov-card__dates">${s.libelle_dates}</p>
        <p class="ov-card__focus">${s.focus || ''}</p>
        <footer>
          <span>${s.duree_cible || '—'}</span>
          ${s.km_cible ? '<span>' + s.km_cible + ' km</span>' : ''}
          <span>${s.nb_seances} séances</span>
        </footer>
      `;
      card.addEventListener('click', () => {
        const target = document.getElementById('week-' + s.id);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      wrap.appendChild(card);
    });
  }

  function isCurrentWeek(s) {
    const t = today();
    return t >= toDate(s.debut) && t <= toDate(s.fin);
  }

  // ------- Zones FC --------------------------------------------------------
  function renderZonesFC() {
    const wrap = $('#zones-fc');
    if (!wrap || !D.zones_fc) return;

    const alert = create('p', 'note-alert');
    alert.innerHTML = `<strong>⚠︎ À reparamétrer dans Garmin Connect.</strong> ${D.zones_fc.alerte || ''}`;
    wrap.appendChild(alert);

    const meta = create('p', 'note-meta', D.zones_fc.base || '');
    wrap.appendChild(meta);

    const list = create('div', 'zones-list');
    D.zones_fc.liste.forEach((z) => {
      const row = create('div', 'zone-item');
      row.innerHTML = `
        <div class="zone-item__head">
          <span class="zone-item__id">${z.zone}</span>
          <span class="zone-item__name">${z.nom}</span>
          <span class="zone-item__range">${z.bpm}</span>
        </div>
        <p class="zone-item__usage">${z.usage || ''}</p>
      `;
      list.appendChild(row);
    });
    wrap.appendChild(list);
  }

  // ------- Allures ---------------------------------------------------------
  function renderAllures() {
    const wrap = $('#allures');
    if (!wrap || !D.allures) return;

    const meta = create('p', 'note-meta');
    meta.innerHTML = `<strong>Statut :</strong> ${D.allures.statut || ''} · <strong>Valides jusqu'au :</strong> ${fmtFrDate(D.allures.valides_jusqu_au)}`;
    wrap.appendChild(meta);

    const table = create('table', 'ptable');
    table.innerHTML = `
      <thead>
        <tr>
          <th>Allure</th>
          <th>Rythme /km</th>
          <th>FC</th>
          <th>Utilisation</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    const tb = table.querySelector('tbody');
    D.allures.liste.forEach((a) => {
      const tr = create('tr');
      tr.innerHTML = `
        <td><strong>${a.nom}</strong></td>
        <td>${a.allure_plat || a.allure || '—'}</td>
        <td>${a.fc || '—'}</td>
        <td>${a.seances || a.usage || '—'}</td>
      `;
      tb.appendChild(tr);
    });
    wrap.appendChild(table);

    if (D.allures.alerte) {
      const note = create('p', 'note-alert');
      note.textContent = D.allures.alerte;
      wrap.appendChild(note);
    }
  }

  // ------- Zones Puissance -------------------------------------------------
  function renderZonesPower() {
    const wrap = $('#zones-power');
    if (!wrap || !D.zones_puissance) return;

    if (D.zones_puissance.base) {
      const meta = create('p', 'note-meta', D.zones_puissance.base);
      wrap.appendChild(meta);
    }
    const list = D.zones_puissance.liste || [];
    if (list.length === 0) return;

    const table = create('table', 'ptable');
    table.innerHTML = '<thead><tr><th>Zone</th><th>Nom</th><th>%CP</th><th>Watts</th></tr></thead><tbody></tbody>';
    const tb = table.querySelector('tbody');
    list.forEach((z) => {
      const tr = create('tr');
      tr.innerHTML = `
        <td><strong>${z.zone || ''}</strong></td>
        <td>${z.nom || ''}</td>
        <td>${z.pct_cp || z.pct || '—'}</td>
        <td>${z.watts || z.puissance || '—'}</td>
      `;
      tb.appendChild(tr);
    });
    wrap.appendChild(table);
  }

  // ------- Calendrier détaillé ---------------------------------------------
  function renderCalendar() {
    const wrap = $('#calendar');
    D.semaines.forEach((s) => {
      const c = phaseColor(s.phase);
      const isNow = isCurrentWeek(s);
      const isPast = today() > toDate(s.fin);

      const sec = create('section', 'week-block' + (isNow ? ' is-now' : '') + (isPast ? ' is-past' : ''));
      sec.id = 'week-' + s.id;
      sec.style.setProperty('--phase-bd', c.bd);
      sec.style.setProperty('--phase-bg', c.bg);
      sec.style.setProperty('--phase-text', c.text);

      const head = create('header', 'week-block__head');
      head.innerHTML = `
        <div class="week-block__id">
          <span class="week-block__code">${s.id}</span>
          <span class="week-block__phase">${s.phase}</span>
          ${isNow ? '<span class="week-block__badge">En cours</span>' : ''}
        </div>
        <div class="week-block__meta">
          <h3>${s.libelle_dates}</h3>
          ${s.focus ? '<p class="week-block__focus">' + s.focus + '</p>' : ''}
          ${s.point_cle ? '<p class="week-block__key"><strong>Point clé :</strong> ' + s.point_cle + '</p>' : ''}
        </div>
        <div class="week-block__stats">
          <div><b>${s.duree_cible || '—'}</b><span>durée</span></div>
          <div><b>${s.km_cible ? s.km_cible + ' km' : '—'}</b><span>volume</span></div>
          <div><b>${s.nb_seances}</b><span>séances</span></div>
        </div>
      `;
      sec.appendChild(head);

      const days = create('div', 'days-grid');
      (s.jours || []).forEach((j) => {
        const day = create('article', 'day-card' + (j.cle ? ' is-key' : '') + (j.repos ? ' is-rest' : ''));
        day.innerHTML = `
          <header>
            <span class="day-card__day">${j.jour}</span>
            <span class="day-card__date">${fmtFrDate(j.date).replace(/ ?\d{4}$/, '')}</span>
            ${j.cle ? '<span class="day-card__flag">clé</span>' : ''}
          </header>
          <h4 class="day-card__title"><span class="day-card__icon">${typeIcon(j.type)}</span>${j.titre || ''}</h4>
          ${j.contenu ? '<p class="day-card__body">' + escapeHtml(j.contenu) + '</p>' : ''}
        `;
        days.appendChild(day);
      });
      sec.appendChild(days);

      wrap.appendChild(sec);
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
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
        <h3>${t.nom}</h3>
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
          <h4>${r.titre}</h4>
          <p>${escapeHtml(r.detail)}</p>
        </div>
      `;
      wrap.appendChild(card);
    });
  }

  // ------- Diagnostic / Course info ---------------------------------------
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
      const dt = create('dt', null, k);
      const dd = create('dd', null, v);
      dl.append(dt, dd);
    });
    wrap.appendChild(dl);

    if (c.heure_depart_alerte) {
      const alert = create('p', 'note-alert');
      alert.innerHTML = '⚠︎ ' + escapeHtml(c.heure_depart_alerte);
      wrap.appendChild(alert);
    }
  }

  // ------- Nav toggle (mobile) --------------------------------------------
  function initNav() {
    const btn = document.getElementById('nav-toggle');
    const list = document.getElementById('nav-list');
    if (!btn || !list) return;
    btn.addEventListener('click', () => {
      const open = list.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    list.addEventListener('click', (e) => {
      if (e.target.matches('a')) {
        list.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ------- Init ------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    renderHero();
    renderOverview();
    renderCourseInfo();
    renderZonesFC();
    renderAllures();
    renderZonesPower();
    renderCalendar();
    renderTests();
    renderRules();

    // Generated on
    const gen = $('#generated-on');
    if (gen) gen.textContent = fmtFrDate(D.meta.genere_le);
  });
})();
