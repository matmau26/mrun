/* =========================================================
   Mrun — Plan SaintéSprint 2026 (Mathieu) · v5
   Rendu du plan, progression locale, graphiques et navigation.
   Données : plan-saintesprint-data.js + plan-comparaison-data.js
   ========================================================= */
(function () {
  'use strict';

  var PLAN = window.PLAN_SAINTESPRINT;
  var COMP = window.PLAN_COMPARAISON;
  if (!PLAN) return;

  var STORAGE_KEY = 'mrun-plan-saintesprint-2026-v1';
  var MS_DAY = 86400000;

  /* ---------------------------------------------------------
     Utilitaires
     --------------------------------------------------------- */
  function parseDate(iso) {
    var p = iso.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }

  function today() {
    var d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function fmtDuration(min) {
    var h = Math.floor(min / 60);
    var m = Math.round(min % 60);
    if (h === 0) return m + " min";
    if (m === 0) return h + " h";
    return h + " h " + (m < 10 ? '0' + m : m);
  }

  function fmtDurationShort(min) {
    var h = Math.floor(min / 60);
    var m = Math.round(min % 60);
    if (h === 0) return m + "'";
    return h + 'h' + (m < 10 ? '0' + m : m);
  }

  function fmtNum(n, dec) {
    return n.toLocaleString('fr-FR', {
      minimumFractionDigits: dec || 0,
      maximumFractionDigits: dec || 0
    });
  }

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function byId(id) { return document.getElementById(id); }

  function set(id, value) {
    var node = byId(id);
    if (node) node.textContent = value;
  }

  /* ---------------------------------------------------------
     Groupes de phase — 3 familles seulement.
     Distinguer « Spécifique 1 » de « Spécifique 2 » n'apporte
     rien à l'œil : la couleur code la NATURE de la semaine,
     le libellé exact reste écrit en toutes lettres.
     --------------------------------------------------------- */
  var GROUPS = {
    charge: { label: 'Charge', color: 'var(--c-charge)', hex: '#e0561f' },
    allege: { label: 'Allègement', color: 'var(--c-allege)', hex: '#3592cc' },
    course: { label: 'Course', color: 'var(--c-course)', hex: '#c64ba0' }
  };

  function groupOf(week) {
    var p = week.phase.toLowerCase();
    if (p.indexOf('course') !== -1) return 'course';
    /* « Allégée » ne suffit plus : depuis que S3 garde sa sortie longue,
       c'est une des semaines les plus chargées du bloc 1. Seules les vraies
       semaines à charge réduite passent en bleu. */
    if (p.indexOf('décharge') !== -1 || p.indexOf('affûtage') !== -1 ||
        p.indexOf('reprise') !== -1) return 'allege';
    return 'charge';
  }

  /* Zones FC — rampe d'intensité. Toujours accompagnée de son
     libellé texte : la couleur ne porte jamais l'information seule. */
  var ZONES = {
    Z12: { key: 'Z1–Z2', color: 'var(--z-easy)', name: 'Facile' },
    Z2: { key: 'Z2', color: 'var(--z-easy)', name: 'Endurance' },
    Z3: { key: 'Z3', color: 'var(--z-tempo)', name: 'Tempo' },
    Z34: { key: 'Z3–Z4', color: 'var(--z-mix)', name: 'Seuil' },
    Z4: { key: 'Z4', color: 'var(--z-hard)', name: 'Côtes / seuil' },
    Z5: { key: 'Z5', color: 'var(--z-hard)', name: 'Sprints' },
    COURSE: { key: 'JOUR J', color: 'var(--z-race)', name: 'Course' }
  };

  function zoneOf(seance) {
    return ZONES[seance.intensite.zone] || { key: seance.intensite.zone, color: 'var(--line-2)', name: '' };
  }

  function isBike(seance) { return /v[ée]lo/i.test(seance.type); }

  /* ---------------------------------------------------------
     État
     --------------------------------------------------------- */
  var weeks = PLAN.semaines;
  var TODAY = today();
  var RACE = parseDate(PLAN.meta.course.date);

  weeks.forEach(function (w, i) {
    w._index = i;
    w._start = parseDate(w.date_debut);
    w._end = new Date(w._start.getTime() + 6 * MS_DAY);
    w._group = groupOf(w);
    w._isPast = TODAY > w._end;
    w._isNow = TODAY >= w._start && TODAY <= w._end;
    w._anchor = 'semaine-' + w.code_semaine;
    w.seances.forEach(function (s) { s._id = s.code; });
  });

  var nowWeek = weeks.filter(function (w) { return w._isNow; })[0]
    || weeks.filter(function (w) { return !w._isPast; })[0]
    || weeks[weeks.length - 1];

  var TOTALS = weeks.reduce(function (a, w) {
    a.min += w.temps_total_min;
    a.km += w.km_estimes_total;
    a.dplus += w.denivele_total_m;
    a.seances += w.seances.length;
    return a;
  }, { min: 0, km: 0, dplus: 0, seances: 0 });

  var done = loadDone();

  function loadDone() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr.reduce(function (o, k) { o[k] = true; return o; }, {}) : {};
    } catch (e) { return {}; }
  }

  function saveDone() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.keys(done)));
    } catch (e) { /* navigation privée : on continue sans persistance */ }
  }

  /* ---------------------------------------------------------
     En-tête : compte à rebours & chiffres clés
     --------------------------------------------------------- */
  function renderHero() {
    var days = Math.max(0, Math.round((RACE - TODAY) / MS_DAY));

    if (days === 0) {
      set('countdown-value', "C'est");
      set('countdown-unit', 'aujourd’hui');
    } else {
      set('countdown-value', 'J−' + days);
      set('countdown-unit', days > 1 ? 'jours' : 'jour');
    }

    byId('topbar-countdown').innerHTML =
      '<span class="dot" aria-hidden="true"></span> <b>' + (days === 0 ? 'Jour J' : 'J−' + days) + '</b>';

    set('stat-weeks', fmtNum(weeks.length));
    set('stat-hours', fmtNum(TOTALS.min / 60, 1));
    set('stat-km', fmtNum(Math.round(TOTALS.km)));
    set('stat-dplus', fmtNum(TOTALS.dplus));
  }

  /* ---------------------------------------------------------
     Progression
     --------------------------------------------------------- */
  function progressStats() {
    var doneCount = 0, doneMin = 0, doneKm = 0, doneD = 0;
    weeks.forEach(function (w) {
      w.seances.forEach(function (s) {
        if (done[s._id]) {
          doneCount++;
          doneMin += s.duree_min;
          doneKm += s.km_estimes;
          doneD += s.denivele_m;
        }
      });
    });
    return {
      count: doneCount,
      pct: TOTALS.seances ? Math.round((doneCount / TOTALS.seances) * 100) : 0,
      min: doneMin, km: doneKm, dplus: doneD
    };
  }

  function renderProgress() {
    var st = progressStats();
    var circle = byId('ring-value');
    var circ = 2 * Math.PI * 52;
    circle.setAttribute('stroke-dasharray', circ.toFixed(1));
    circle.setAttribute('stroke-dashoffset', (circ * (1 - st.pct / 100)).toFixed(1));

    set('ring-pct', st.pct + '%');
    byId('progress-bar').style.width = st.pct + '%';
    byId('progress-count').innerHTML = '<b>' + st.count + '</b> / ' + TOTALS.seances + ' séances';
    byId('progress-time').innerHTML = '<b>' + fmtDuration(st.min) + '</b> sur ' + fmtDuration(TOTALS.min);
    byId('progress-km').innerHTML =
      '<b>' + fmtNum(Math.round(st.km)) + ' km</b> · ' + fmtNum(st.dplus) + ' m D+';

    byId('progress-week').innerHTML = (nowWeek._isNow ? 'Semaine en cours : ' : 'Prochaine semaine : ') +
      '<b>' + esc(nowWeek.code_semaine) + '</b> · ' + esc(nowWeek.semaine_avant_course) +
      ' · ' + esc(nowWeek.dates_affichage);
  }

  /* ---------------------------------------------------------
     Zones FC
     --------------------------------------------------------- */
  function renderZones() {
    var z = PLAN.meta.athlete.zones_fc;
    var fcMax = PLAN.meta.athlete.fc_max;
    var floor = 90;
    var colors = ['var(--z-rest)', 'var(--z-easy)', 'var(--z-tempo)', 'var(--z-mix)', 'var(--z-hard)'];
    var host = byId('zones-list');

    Object.keys(z).forEach(function (key, i) {
      var d = z[key];
      var left = ((d.min - floor) / (fcMax - floor)) * 100;
      var width = ((d.max - d.min) / (fcMax - floor)) * 100;
      host.appendChild(el(
        '<div class="zone-row">' +
          '<span class="zone-key" style="background:' + colors[i] + '">' + esc(key) + '</span>' +
          '<div class="zone-meta">' +
            '<div class="zone-meta__top">' +
              '<span class="zone-bpm">' + d.min + '–' + d.max + ' <small>bpm</small></span>' +
              '<span class="zone-usage">' + esc(d.usage) + '</span>' +
            '</div>' +
            '<div class="zone-scale"><i style="left:' + left.toFixed(1) + '%;width:' + width.toFixed(1) + '%;background:' + colors[i] + '"></i></div>' +
          '</div>' +
        '</div>'
      ));
    });
  }

  /* ---------------------------------------------------------
     Règles transverses & indisponibilités
     --------------------------------------------------------- */
  function renderRules() {
    var host = byId('rules-grid');
    PLAN.meta.regles_transverses.forEach(function (rule, i) {
      var critical = i === 0;
      host.appendChild(el(
        '<div class="rule' + (critical ? ' rule--critical' : '') + '">' +
          '<span class="rule__num">' + (critical ? 'Règle d’or' : 'Règle ' + (i + 1)) + '</span>' +
          esc(rule) +
        '</div>'
      ));
    });
  }

  function renderIndispos() {
    var list = PLAN.meta.indisponibilites || [];
    var host = byId('indispos');
    if (!host || !list.length) return;

    list.forEach(function (item) {
      host.appendChild(el(
        '<div class="indispo">' +
          '<div class="indispo__periode">' + esc(item.periode) + '</div>' +
          '<div class="indispo__motif">' + esc(item.motif) + '</div>' +
          '<div class="indispo__impact">' + esc(item.impact) + '</div>' +
        '</div>'
      ));
    });
  }

  /* ---------------------------------------------------------
     Semaines & séances
     --------------------------------------------------------- */
  var ICON_KEY = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2 4 6v6c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10V6l-8-4Z"/><path d="M9 12h6"/></svg>';
  var ICON_INFO = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>';
  var ICON_WARN = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.3 3.7 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg>';
  var ICON_CHECK = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 12 5.5 5.5L20 7"/></svg>';
  var ICON_CHEV = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

  function sessionCard(seance) {
    var zone = zoneOf(seance);
    var isRace = seance.intensite.zone === 'COURSE';
    var isDone = !!done[seance._id];
    var bike = isBike(seance);

    /* Sur une séance de vélo, km et D+ valent 0 par construction :
       afficher « — » plutôt qu'un zéro qui ressemble à une donnée manquante. */
    var km = bike ? '—' : fmtNum(seance.km_estimes, seance.km_estimes % 1 ? 1 : 0);
    var dplus = bike ? '—' : fmtNum(seance.denivele_m);

    return '<article class="session' + (isDone ? ' is-done' : '') + (isRace ? ' is-race' : '') + '"' +
        ' style="--zone-color:' + zone.color + '" data-session="' + esc(seance._id) + '">' +

        '<div class="session__top">' +
          '<div>' +
            '<span class="session__num">' + esc(seance.code) +
              (seance.jour_suggere ? ' · <span class="session__day">' + esc(seance.jour_suggere) + '</span>' : '') +
            '</span>' +
            '<h4 class="session__type">' + esc(seance.type) + '</h4>' +
          '</div>' +
          '<span class="zone-pill"><b>' + esc(zone.key) + '</b><small>' + esc(bike ? 'Vélo' : zone.name) + '</small></span>' +
        '</div>' +

        '<div class="session__stats">' +
          '<div class="session__stat"><b>' + fmtDurationShort(seance.duree_min) + '</b><span>Durée</span></div>' +
          '<div class="session__stat"><b>' + km + '</b><span>km est.</span></div>' +
          '<div class="session__stat"><b>' + dplus + '</b><span>m D+</span></div>' +
        '</div>' +

        '<p class="session__pace"><b>' + esc(seance.intensite.detail) + '</b></p>' +
        '<p class="session__pace session__pace--sub">' + esc(seance.intensite.allure_cible) + '</p>' +

        '<p class="session__detail">' + esc(seance.detail_seance) + '</p>' +

        (seance.element_en_tete
          ? '<div class="note">' + ICON_KEY + '<span>' + esc(seance.element_en_tete) + '</span></div>'
          : '') +
        (seance.autres
          ? '<div class="note note--muted">' + ICON_INFO + '<span>' + esc(seance.autres) + '</span></div>'
          : '') +

        '<div class="session__foot">' +
          '<button class="check" type="button" aria-pressed="' + isDone + '" data-check="' + esc(seance._id) + '">' +
            '<span class="check__box">' + ICON_CHECK + '</span>' +
            '<span class="check__text">' + (isDone ? 'Séance validée' : 'Marquer comme faite') + '</span>' +
          '</button>' +
        '</div>' +
      '</article>';
  }

  function weekCard(week) {
    var group = GROUPS[week._group];
    var doneInWeek = week.seances.filter(function (s) { return done[s._id]; }).length;
    var isRace = week._group === 'course';

    var dots = week.seances.map(function (s) {
      return '<i class="' + (done[s._id] ? 'is-done' : '') + '"></i>';
    }).join('');

    return el(
      '<section class="week' + (week._isNow ? ' is-now' : '') + (week._isPast ? ' is-past' : '') + (isRace ? ' is-race' : '') + '"' +
        ' id="' + week._anchor + '" data-group="' + week._group + '" data-week="' + week._index + '">' +

        '<button class="week__head" type="button" aria-expanded="false" aria-controls="body-' + week._index + '">' +
          '<span class="week__id">' +
            '<span class="week__code">' + esc(week.code_semaine) + '</span>' +
            '<span class="week__dates">' + esc(week.semaine_avant_course) + ' · ' + esc(week.dates_affichage) + '</span>' +
          '</span>' +

          '<span class="week__main">' +
            '<span class="week__badges">' +
              '<span class="badge badge--solid" style="background:' + group.color + '">' + esc(week.phase) + '</span>' +
              (week._isNow ? '<span class="badge badge--now">Semaine en cours</span>' : '') +
              (week.contraintes ? '<span class="badge badge--warn">⚠ Contraintes</span>' : '') +
              (doneInWeek === week.seances.length ? '<span class="badge" data-done-badge style="color:var(--z-easy)">Terminée</span>' : '') +
            '</span>' +
            '<span class="week__focus">' + esc(week.focus) + '</span>' +
          '</span>' +

          '<span class="week__metrics">' +
            '<span class="metric"><b>' + fmtDurationShort(week.temps_total_min) + '</b><span>Durée</span></span>' +
            '<span class="metric"><b>' + fmtNum(week.km_estimes_total, week.km_estimes_total % 1 ? 1 : 0) + '</b><span>km</span></span>' +
            '<span class="metric"><b>' + fmtNum(week.denivele_total_m) + '</b><span>m D+</span>' +
              '<span class="week__dots">' + dots + '</span>' +
            '</span>' +
          '</span>' +

          '<span class="week__chev">' + ICON_CHEV + '</span>' +
        '</button>' +

        '<div class="week__body" id="body-' + week._index + '">' +
          (week.contraintes
            ? '<div class="constraint">' + ICON_WARN + '<div><b>Contraintes de la semaine</b>' +
              '<p>' + esc(week.contraintes.replace(/⚠\s*/g, '')) + '</p></div></div>'
            : '') +
          '<div class="week__support">' +
            '<div><div class="support__label">Renforcement</div><div class="support__value">' + esc(week.renforcement) + '</div></div>' +
            '<div><div class="support__label">Vélo</div><div class="support__value">' + esc(week.velo) + '</div></div>' +
            '<div><div class="support__label">Semaine</div><div class="support__value">' + esc(week.semaine_annee) + ' · ' + week.seances.length + ' séances · ' + fmtDuration(week.temps_total_min) + '</div></div>' +
          '</div>' +
          '<div class="sessions">' + week.seances.map(sessionCard).join('') + '</div>' +
        '</div>' +
      '</section>'
    );
  }

  function renderWeeks() {
    var host = byId('weeks');
    weeks.forEach(function (w) { host.appendChild(weekCard(w)); });

    host.addEventListener('click', function (e) {
      var head = e.target.closest('.week__head');
      if (head) { toggleWeek(head.closest('.week'), head); return; }

      var check = e.target.closest('[data-check]');
      if (check) { toggleSession(check); }
    });
  }

  function toggleWeek(weekNode, head, force) {
    var open = force != null ? force : !weekNode.classList.contains('is-open');
    weekNode.classList.toggle('is-open', open);
    head.setAttribute('aria-expanded', String(open));
  }

  function toggleSession(button) {
    var id = button.dataset.check;
    if (done[id]) delete done[id]; else done[id] = true;
    saveDone();

    var isDone = !!done[id];
    button.setAttribute('aria-pressed', String(isDone));
    button.querySelector('.check__text').textContent = isDone ? 'Séance validée' : 'Marquer comme faite';
    button.closest('.session').classList.toggle('is-done', isDone);

    refreshWeekHeader(button.closest('.week'));
    renderProgress();
  }

  function refreshWeekHeader(weekNode) {
    if (!weekNode) return;
    var week = weeks[+weekNode.dataset.week];
    var doneInWeek = week.seances.filter(function (s) { return done[s._id]; }).length;

    var dots = weekNode.querySelectorAll('.week__dots i');
    week.seances.forEach(function (s, i) {
      if (dots[i]) dots[i].classList.toggle('is-done', !!done[s._id]);
    });

    var badges = weekNode.querySelector('.week__badges');
    var flag = badges.querySelector('[data-done-badge]');
    if (doneInWeek === week.seances.length && !flag) {
      badges.appendChild(el('<span class="badge" data-done-badge style="color:var(--z-easy)">Terminée</span>'));
    } else if (doneInWeek !== week.seances.length && flag) {
      flag.remove();
    }
  }

  /* ---------------------------------------------------------
     Filtres
     --------------------------------------------------------- */
  function initFilters() {
    var current = 'all';
    var upcomingOnly = false;

    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
    var upcoming = byId('filter-upcoming');
    var expandAll = byId('expand-all');
    var empty = byId('weeks-empty');

    function apply() {
      var visible = 0;
      weeks.forEach(function (w) {
        var node = byId(w._anchor);
        var show = (current === 'all' || w._group === current) && (!upcomingOnly || !w._isPast);
        node.hidden = !show;
        if (show) visible++;
      });
      empty.hidden = visible > 0;
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        current = btn.dataset.filter;
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        apply();
      });
    });

    upcoming.addEventListener('click', function () {
      upcomingOnly = !upcomingOnly;
      upcoming.setAttribute('aria-pressed', String(upcomingOnly));
      apply();
    });

    expandAll.addEventListener('click', function () {
      var shouldOpen = expandAll.dataset.state !== 'open';
      document.querySelectorAll('.week').forEach(function (node) {
        if (node.hidden) return;
        toggleWeek(node, node.querySelector('.week__head'), shouldOpen);
      });
      expandAll.dataset.state = shouldOpen ? 'open' : 'closed';
      expandAll.textContent = shouldOpen ? 'Tout replier' : 'Tout déplier';
    });
  }

  /* =========================================================
     Graphiques
     ========================================================= */
  function niceMaxFor(max, step) { return Math.max(step, Math.ceil((max * 1.02) / step) * step); }

  function roundedTopPath(x, y, w, h, r) {
    r = Math.min(r, w / 2, h);
    return 'M' + x + ',' + (y + h) +
      'V' + (y + r) +
      'a' + r + ',' + r + ' 0 0 1 ' + r + ',' + -r +
      'h' + (w - 2 * r) +
      'a' + r + ',' + r + ' 0 0 1 ' + r + ',' + r +
      'V' + (y + h) + 'Z';
  }

  /* ---------------------------------------------------------
     Charge hebdomadaire du plan (barres)
     Une seule mesure à l'écran : la bascule change la mesure,
     jamais deux axes superposés.
     --------------------------------------------------------- */
  var MEASURES = {
    duree: {
      label: 'Durée hebdomadaire',
      get: function (w) { return w.temps_total_min; },
      fmt: function (v) { return fmtDurationShort(v); },
      step: 60,
      axis: function (v) { return (v / 60) + ' h'; }
    },
    distance: {
      label: 'Distance estimée',
      get: function (w) { return w.km_estimes_total; },
      fmt: function (v) { return fmtNum(v, v % 1 ? 1 : 0) + ' km'; },
      step: 10,
      axis: function (v) { return fmtNum(v) + ' km'; }
    },
    denivele: {
      label: 'Dénivelé positif',
      get: function (w) { return w.denivele_total_m; },
      fmt: function (v) { return fmtNum(v) + ' m'; },
      step: 200,
      axis: function (v) { return fmtNum(v) + ' m'; }
    }
  };

  var chartMeasure = 'duree';

  function renderChart() {
    var m = MEASURES[chartMeasure];
    var W = 1000, H = 380;
    var padL = 68, padR = 10, padT = 34, padB = 92;
    var plotW = W - padL - padR;
    var plotH = H - padT - padB;

    var max = Math.max.apply(null, weeks.map(m.get));
    var niceMax = niceMaxFor(max, m.step);
    var steps = Math.round(niceMax / m.step);

    var slot = plotW / weeks.length;
    var barW = Math.round(slot * 0.56);   /* marques fines, respiration entre les barres */
    var offset = (slot - barW) / 2;

    var svg = ['<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-labelledby="chart-title chart-desc" preserveAspectRatio="xMidYMid meet">'];
    svg.push('<title id="chart-title">' + m.label + ' sur les ' + weeks.length + ' semaines du plan</title>');
    svg.push('<desc id="chart-desc">Le détail chiffré est disponible dans le tableau sous le graphique.</desc>');

    for (var i = 0; i <= steps; i++) {
      var v = m.step * i;
      var y = padT + plotH - (v / niceMax) * plotH;
      svg.push('<line class="grid-line" x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (W - padR) + '" y2="' + y.toFixed(1) + '"/>');
      svg.push('<text class="axis-text" x="' + (padL - 12) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="end">' + m.axis(v) + '</text>');
    }

    weeks.forEach(function (w, i) {
      var v = m.get(w);
      var h = Math.max(3, (v / niceMax) * plotH);
      var x = padL + i * slot + offset;
      var y = padT + plotH - h;
      var cx = (x + barW / 2).toFixed(1);
      var hex = GROUPS[w._group].hex;

      svg.push('<g class="bar-group" data-bar="' + i + '">');
      svg.push('<path class="bar-rect" d="' + roundedTopPath(x, y, barW, h, 4) + '" fill="' + hex + '"/>');
      if (w._isNow) {
        svg.push('<rect class="now-marker" x="' + (x - 3).toFixed(1) + '" y="' + (y - 3).toFixed(1) + '" width="' + (barW + 6).toFixed(1) + '" height="' + (h + 6).toFixed(1) + '" rx="6"/>');
      }
      svg.push('<text class="bar-label" x="' + cx + '" y="' + (y - 9).toFixed(1) + '" text-anchor="middle">' + m.fmt(v) + '</text>');
      /* Double libellé : code du plan (S1…S14) + semaines avant course (S-13…S0) */
      svg.push('<text class="week-label' + (w._isNow ? ' is-now' : '') + '" x="' + cx + '" y="' + (padT + plotH + 22) + '" text-anchor="middle">' + esc(w.code_semaine) + '</text>');
      svg.push('<text class="week-sublabel" x="' + cx + '" y="' + (padT + plotH + 36) + '" text-anchor="middle">' + esc(w.semaine_avant_course) + '</text>');
      /* Bande de phase sous l'axe : la couleur redit la phase, en continu */
      svg.push('<rect class="phase-band" x="' + (padL + i * slot + 1).toFixed(1) + '" y="' + (padT + plotH + 46) + '" width="' + (slot - 2).toFixed(1) + '" height="6" fill="' + hex + '"/>');
      svg.push('<rect x="' + (padL + i * slot).toFixed(1) + '" y="' + padT + '" width="' + slot.toFixed(1) + '" height="' + plotH + '" fill="transparent"/>');
      svg.push('</g>');
    });

    svg.push('<text class="axis-text" x="' + padL + '" y="' + (padT + plotH + 72) + '">Début du plan</text>');
    svg.push('<text class="axis-text" x="' + (W - padR) + '" y="' + (padT + plotH + 72) + '" text-anchor="end">SaintéSprint</text>');
    svg.push('</svg>');

    byId('chart').innerHTML = svg.join('');
    bindBarHover();
  }

  function bindBarHover() {
    var chart = byId('chart');
    var tip = byId('chart-tooltip');

    chart.querySelectorAll('.bar-group').forEach(function (g) {
      g.addEventListener('mouseenter', function () { show(g); });
      g.addEventListener('mousemove', function () { show(g); });
      g.addEventListener('mouseleave', function () { tip.classList.remove('is-visible'); });
    });

    function show(g) {
      var w = weeks[+g.dataset.bar];
      var group = GROUPS[w._group];
      var rect = g.querySelector('.bar-rect').getBoundingClientRect();
      var host = chart.parentNode.getBoundingClientRect();

      tip.innerHTML =
        '<div class="tt-phase" style="color:' + group.color + '">' + esc(w.phase) + '</div>' +
        '<h4>' + esc(w.code_semaine) + ' · ' + esc(w.semaine_avant_course) + '</h4>' +
        '<p class="tt-sub">' + esc(w.dates_affichage) + '</p>' +
        '<dl>' +
          '<dt>Durée</dt><dd>' + fmtDuration(w.temps_total_min) + '</dd>' +
          '<dt>Distance</dt><dd>' + fmtNum(w.km_estimes_total, 1) + ' km</dd>' +
          '<dt>D+</dt><dd>' + fmtNum(w.denivele_total_m) + ' m</dd>' +
          '<dt>Séances</dt><dd>' + w.seances.length + '</dd>' +
        '</dl>';

      placeTooltip(tip, host, rect.left - host.left + rect.width / 2, rect.top - host.top);
    }
  }

  /* L'infobulle reste dans le cadre : au-dessus du point quand il y a
     la place, sinon juste en dessous. */
  function placeTooltip(tip, host, cx, anchorTop) {
    tip.classList.add('is-visible');
    var w = tip.offsetWidth, h = tip.offsetHeight;
    var left = Math.min(Math.max(cx - w / 2, 4), host.width - w - 4);
    var top = anchorTop - h - 12;
    if (top < 4) top = anchorTop + 16;
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
  }

  function renderTable() {
    var rows = weeks.map(function (w) {
      return '<tr class="' + (w._isNow ? 'is-now' : '') + '">' +
        '<td>' + esc(w.code_semaine) + '</td>' +
        '<td>' + esc(w.semaine_avant_course) + '</td>' +
        '<td>' + esc(w.dates_affichage) + '</td>' +
        '<td>' + esc(w.phase) + '</td>' +
        '<td>' + fmtDuration(w.temps_total_min) + '</td>' +
        '<td>' + fmtNum(w.km_estimes_total, 1) + ' km</td>' +
        '<td>' + fmtNum(w.denivele_total_m) + ' m</td>' +
        '</tr>';
    }).join('');

    byId('chart-table').innerHTML =
      '<table><caption class="sr-only">Charge hebdomadaire du plan SaintéSprint 2026</caption><thead><tr>' +
      '<th scope="col">Semaine</th><th scope="col">Avant course</th><th scope="col">Dates</th><th scope="col">Phase</th>' +
      '<th scope="col">Durée</th><th scope="col">Distance</th><th scope="col">D+</th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table>';
  }

  /* ---------------------------------------------------------
     Comparatif v5 vs prépa 2024 (courbes)
     --------------------------------------------------------- */
  var SERIES = [
    { key: 'v5', label: 'Plan actuel (v5)', hex: '#e0561f', width: 2.5 },
    { key: 'p24', label: 'Prépa 2024 réelle', hex: '#3592cc', width: 2 }
  ];

  var COMP_MEASURES = {
    h: {
      label: 'Durée hebdomadaire',
      pick: function (s) { return s.h.map(function (v) { return v * 60; }); },
      step: 60,
      axis: function (v) { return (v / 60) + ' h'; },
      fmt: function (v) { return fmtDurationShort(v); },
      hint: 'Heures de course à pied par semaine — le vélo de S3 et S4 et la course finale ne sont pas comptés, d’où l’écart avec le total affiché dans le plan.'
    },
    km: {
      label: 'Kilométrage',
      pick: function (s) { return s.km; },
      step: 10,
      axis: function (v) { return fmtNum(v) + ' km'; },
      fmt: function (v) { return fmtNum(v, v % 1 ? 1 : 0) + ' km'; },
      hint: 'Estimation à ton allure réelle pour le plan, kilomètres réellement courus pour 2024. Les 24 km de la course ne sont pas comptés.'
    },
    dp: {
      label: 'Dénivelé positif',
      pick: function (s) { return s.dp; },
      step: 250,
      axis: function (v) { return fmtNum(v) + ' m'; },
      fmt: function (v) { return fmtNum(v) + ' m'; },
      hint: '2024 était très irrégulier : quasi plat pendant des semaines, puis 1 094 m à 3 semaines de la course.'
    },
    cumul: {
      label: 'Charge cumulée',
      pick: function (s) { return cumulative(s.h).map(function (v) { return v * 60; }); },
      step: 600,
      axis: function (v) { return (v / 60) + ' h'; },
      fmt: function (v) { return fmtDurationShort(v); },
      hint: 'Vision intégrale : l’écart de charge totale absorbée sur le cycle.'
    }
  };

  /* La série de comparaison ne compte que la course à pied, course finale
     exclue : sur certaines semaines elle est donc plus basse que le total
     affiché dans le plan. On calcule l'écart pour l'annoncer à l'écran,
     sinon 3 h 30 au plan et 2 h 40 sur la courbe ressemblent à un bug. */
  function exclusionsOf(week) {
    var bike = 0, race = 0, bikeKm = 0, raceKm = 0, bikeD = 0, raceD = 0;
    week.seances.forEach(function (s) {
      if (s.intensite.zone === 'COURSE') { race += s.duree_min; raceKm += s.km_estimes; raceD += s.denivele_m; }
      else if (isBike(s)) { bike += s.duree_min; bikeKm += s.km_estimes; bikeD += s.denivele_m; }
    });
    var motifs = [];
    if (bike) motifs.push('vélo');
    if (race) motifs.push('course');
    return {
      motif: motifs.join(' + '),
      h: bike + race,
      km: bikeKm + raceKm,
      dp: bikeD + raceD,
      total: { h: week.temps_total_min, km: week.km_estimes_total, dp: week.denivele_total_m }
    };
  }

  function cumulative(arr) {
    var total = 0;
    return arr.map(function (v) { total += v; return total; });
  }

  var compMeasure = 'h';

  function renderComparison() {
    if (!COMP) return;
    var m = COMP_MEASURES[compMeasure];
    var n = COMP.labels.length;
    var series = SERIES.map(function (s) {
      return { key: s.key, label: s.label, hex: s.hex, width: s.width, values: m.pick(COMP[s.key]) };
    });

    var W = 1000, H = 360;
    var padL = 68, padR = 96, padT = 30, padB = 84;
    var plotW = W - padL - padR;
    var plotH = H - padT - padB;

    var max = Math.max.apply(null, series.reduce(function (a, s) { return a.concat(s.values); }, []));
    var niceMax = niceMaxFor(max, m.step);
    var steps = Math.round(niceMax / m.step);
    var stepX = plotW / (n - 1);

    var xOf = function (i) { return padL + i * stepX; };
    var yOf = function (v) { return padT + plotH - (v / niceMax) * plotH; };

    var svg = ['<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-labelledby="comp-title comp-desc" preserveAspectRatio="xMidYMid meet">'];
    svg.push('<title id="comp-title">' + m.label + ' — plan actuel v5 comparé à la préparation 2024</title>');
    svg.push('<desc id="comp-desc">Le détail chiffré est disponible dans le tableau sous le graphique.</desc>');

    for (var i = 0; i <= steps; i++) {
      var v = m.step * i;
      var y = yOf(v);
      svg.push('<line class="grid-line" x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (W - padR) + '" y2="' + y.toFixed(1) + '"/>');
      svg.push('<text class="axis-text" x="' + (padL - 12) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="end">' + m.axis(v) + '</text>');
    }

    COMP.labels.forEach(function (lab, i) {
      svg.push('<text class="week-label" x="' + xOf(i).toFixed(1) + '" y="' + (padT + plotH + 22) + '" text-anchor="middle">' + esc(lab) + '</text>');
      svg.push('<text class="week-sublabel" x="' + xOf(i).toFixed(1) + '" y="' + (padT + plotH + 36) + '" text-anchor="middle">' + esc(COMP.labels_course[i]) + '</text>');

      /* Ce que la courbe ne compte pas, écrit sous la semaine concernée */
      var exc = compMeasure === 'cumul' || !weeks[i] ? null : exclusionsOf(weeks[i]);
      var hidden = exc ? exc[compMeasure] : 0;
      if (hidden > 0) {
        svg.push('<text class="excl-label" x="' + xOf(i).toFixed(1) + '" y="' + (padT + plotH + 52) + '" text-anchor="middle">+' +
          esc(m.fmt(compMeasure === 'h' ? hidden : hidden)) + ' ' + esc(exc.motif) + '</text>');
      }
    });

    svg.push('<line class="crosshair" id="comp-crosshair" x1="0" y1="' + padT + '" x2="0" y2="' + (padT + plotH) + '" style="opacity:0"/>');

    series.forEach(function (s) {
      var d = s.values.map(function (v, i) { return (i ? 'L' : 'M') + xOf(i).toFixed(1) + ',' + yOf(v).toFixed(1); }).join(' ');
      svg.push('<path d="' + d + '" fill="none" stroke="' + s.hex + '" stroke-width="' + s.width + '" stroke-linejoin="round" stroke-linecap="round"/>');
      s.values.forEach(function (v, i) {
        svg.push('<circle class="pt" data-serie="' + s.key + '" data-i="' + i + '" cx="' + xOf(i).toFixed(1) + '" cy="' + yOf(v).toFixed(1) + '" r="4" fill="' + s.hex + '" stroke="var(--surface)" stroke-width="2"/>');
      });
    });

    /* Libellés directs en bout de courbe : l'identité ne repose pas que sur
       la couleur. Les deux séries finissent souvent au même niveau — on les
       écarte pour qu'elles ne se superposent jamais. */
    var ends = series.map(function (s) { return { label: s.key === 'v5' ? 'Plan v5' : '2024', hex: s.hex, y: yOf(s.values[n - 1]) }; });
    if (Math.abs(ends[0].y - ends[1].y) < 15) {
      var mid = (ends[0].y + ends[1].y) / 2;
      var first = ends[0].y <= ends[1].y ? 0 : 1;
      ends[first].y = mid - 8;
      ends[1 - first].y = mid + 8;
    }
    ends.forEach(function (e) {
      svg.push('<text class="serie-label" x="' + (xOf(n - 1) + 12) + '" y="' + (e.y + 4).toFixed(1) + '" fill="' + e.hex + '">' + esc(e.label) + '</text>');
    });

    for (var j = 0; j < n; j++) {
      svg.push('<rect class="comp-hit" data-i="' + j + '" x="' + (xOf(j) - stepX / 2).toFixed(1) + '" y="' + padT + '" width="' + stepX.toFixed(1) + '" height="' + plotH + '" fill="transparent"/>');
    }

    svg.push('</svg>');
    byId('comp-chart').innerHTML = svg.join('');
    byId('comp-hint').textContent = m.hint;
    bindCompHover(series, xOf, yOf, padT, plotH);
  }

  function bindCompHover(series, xOf, yOf, padT, plotH) {
    var chart = byId('comp-chart');
    var tip = byId('comp-tooltip');
    var cross = byId('comp-crosshair');
    var m = COMP_MEASURES[compMeasure];

    chart.querySelectorAll('.comp-hit').forEach(function (hit) {
      hit.addEventListener('mouseenter', function () { show(+hit.dataset.i); });
      hit.addEventListener('mousemove', function () { show(+hit.dataset.i); });
      hit.addEventListener('mouseleave', hide);
    });
    chart.addEventListener('mouseleave', hide);

    function hide() {
      tip.classList.remove('is-visible');
      cross.style.opacity = 0;
      chart.querySelectorAll('.pt').forEach(function (p) { p.classList.remove('is-active'); });
    }

    function show(i) {
      cross.setAttribute('x1', xOf(i).toFixed(1));
      cross.setAttribute('x2', xOf(i).toFixed(1));
      cross.style.opacity = 1;

      chart.querySelectorAll('.pt').forEach(function (p) {
        p.classList.toggle('is-active', +p.dataset.i === i);
      });

      var rows = series.map(function (s) {
        return '<dt><i style="background:' + s.hex + '"></i>' + esc(s.key === 'v5' ? 'Plan v5' : 'Prépa 2024') + '</dt>' +
          '<dd>' + m.fmt(s.values[i]) + '</dd>';
      }).join('');

      var delta = series[0].values[i] - series[1].values[i];

      var exc = compMeasure === 'cumul' || !weeks[i] ? null : exclusionsOf(weeks[i]);
      var horsSerie = exc && exc[compMeasure] > 0
        ? '<p class="tt-delta">Semaine complète au plan : <b>' + m.fmt(exc.total[compMeasure]) +
          '</b> — ' + m.fmt(exc[compMeasure]) + ' de ' + esc(exc.motif) + ' hors comparaison.</p>'
        : '';

      tip.innerHTML =
        '<h4>' + esc(COMP.labels[i]) + ' · ' + esc(COMP.labels_course[i]) + '</h4>' +
        '<p class="tt-sub">' + esc(weeks[i] ? weeks[i].dates_affichage : '') + '</p>' +
        '<dl>' + rows + '</dl>' +
        '<p class="tt-delta">Écart : ' + (delta >= 0 ? '+' : '−') + m.fmt(Math.abs(delta)) + '</p>' +
        horsSerie;

      var pt = chart.querySelector('.pt[data-i="' + i + '"]');
      var rect = pt.getBoundingClientRect();
      var host = chart.parentNode.getBoundingClientRect();
      var topPx = Math.min.apply(null, series.map(function (s) {
        return (yOf(s.values[i]) / 360) * host.height;
      }));
      placeTooltip(tip, host, rect.left - host.left + rect.width / 2, topPx);
    }
  }

  function renderComparisonSummary() {
    if (!COMP) return;
    var sum = function (a) { return a.reduce(function (x, y) { return x + y; }, 0); };
    var v5h = sum(COMP.v5.h), p24h = sum(COMP.p24.h);
    var ecart = Math.round((v5h / p24h - 1) * 100);

    /* La semaine de course est écartée du « creux » : son volume est bas
       par construction puisque la course elle-même n'est pas comptée. */
    var horsCourse = COMP.v5.h.slice(0, -1);
    var creuxV5 = Math.min.apply(null, horsCourse);

    var cards = [
      ['Plan v5 · course à pied', fmtDurationShort(v5h * 60),
        fmtNum(sum(COMP.v5.km)) + ' km · ' + fmtNum(sum(COMP.v5.dp)) + ' m D+ · hors course et vélo'],
      ['Prépa 2024 réelle', fmtDurationShort(p24h * 60),
        fmtNum(sum(COMP.p24.km)) + ' km · ' + fmtNum(sum(COMP.p24.dp)) + ' m D+ · course exclue'],
      ['v5 vs 2024', '+' + ecart + ' %', 'de temps de course en plus'],
      ['Semaine la plus creuse', fmtDurationShort(creuxV5 * 60),
        'hors semaine de course · en 2024, une semaine complète à 0 h'],
      ['Pic hebdomadaire', fmtDurationShort(Math.max.apply(null, COMP.v5.h) * 60) + ' en S10',
        '2024 : ' + fmtDurationShort(Math.max.apply(null, COMP.p24.h) * 60) + ' en S11, à 3 semaines de la course']
    ];

    byId('comp-kpis').innerHTML = cards.map(function (c) {
      return '<div class="kpi"><div class="kpi__value">' + c[1] + '</div>' +
        '<div class="kpi__label"><b>' + c[0] + '</b>' + esc(c[2]) + '</div></div>';
    }).join('');

    byId('comp-note').innerHTML =
      '<b>Lecture.</b> Le plan v5 reste plus chargé que ta prépa 2024 (+' + ecart + ' % de temps de course), ' +
      'mais il est surtout beaucoup plus <b>régulier</b>. 2024, c’était une semaine à 0 h, deux semaines sous 1 h 30, ' +
      'puis un pic de 4 h 32 avec 1 094 m D+ à trois semaines de la course : exactement le motif « creux puis relance » ' +
      'associé au risque de blessure. Le v5 lisse la progression et place son pic à S10 (S-4), avec quatre semaines ' +
      'de décrue derrière. Les contraintes de septembre ont été <b>absorbées, pas compensées</b> : deux footings sont ' +
      'devenus du vélo sans impact, la longue de S3 est courue sur place pendant l’assistance au Vercors, ' +
      'et rien n’a été rattrapé.';
  }

  function renderComparisonTable() {
    if (!COMP) return;
    var rows = COMP.labels.map(function (lab, i) {
      return '<tr>' +
        '<td>' + esc(lab) + '</td>' +
        '<td>' + esc(COMP.labels_course[i]) + '</td>' +
        '<td>' + fmtDurationShort(COMP.v5.h[i] * 60) + '</td>' +
        '<td>' + fmtDurationShort(COMP.p24.h[i] * 60) + '</td>' +
        '<td>' + fmtNum(COMP.v5.km[i], 1) + '</td>' +
        '<td>' + fmtNum(COMP.p24.km[i], 1) + '</td>' +
        '<td>' + fmtNum(COMP.v5.dp[i]) + '</td>' +
        '<td>' + fmtNum(COMP.p24.dp[i]) + '</td>' +
        '</tr>';
    }).join('');

    byId('comp-table').innerHTML =
      '<table><caption class="sr-only">Comparaison hebdomadaire entre le plan v5 et la préparation 2024</caption><thead><tr>' +
      '<th scope="col">Semaine</th><th scope="col">Avant course</th>' +
      '<th scope="col">v5 durée</th><th scope="col">2024 durée</th>' +
      '<th scope="col">v5 km</th><th scope="col">2024 km</th>' +
      '<th scope="col">v5 D+</th><th scope="col">2024 D+</th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table>';
  }

  /* ---------------------------------------------------------
     Contrôles des graphiques
     --------------------------------------------------------- */
  function initSegmented(segId, onChange) {
    var seg = byId(segId);
    if (!seg) return;
    seg.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-measure]');
      if (!btn) return;
      seg.querySelectorAll('button').forEach(function (b) {
        b.setAttribute('aria-selected', String(b === btn));
      });
      onChange(btn.dataset.measure);
    });
  }

  function initTableToggle(btnId, tableId, labelOn, labelOff) {
    var toggle = byId(btnId);
    var table = byId(tableId);
    if (!toggle || !table) return;
    toggle.addEventListener('click', function () {
      var open = table.hasAttribute('hidden');
      if (open) table.removeAttribute('hidden'); else table.setAttribute('hidden', '');
      toggle.textContent = open ? labelOn : labelOff;
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  function initCharts() {
    initSegmented('chart-measures', function (key) {
      chartMeasure = key;
      byId('chart-caption').textContent = MEASURES[key].label +
        ' — chaque barre est une semaine, de S1 (S-13) au jour de course.';
      renderChart();
    });

    initSegmented('comp-measures', function (key) {
      compMeasure = key;
      renderComparison();
    });

    initTableToggle('table-toggle', 'chart-table', 'Masquer le tableau de données', 'Afficher le tableau de données');
    initTableToggle('comp-table-toggle', 'comp-table', 'Masquer le tableau de données', 'Afficher le tableau de données');

    var resize;
    window.addEventListener('resize', function () {
      clearTimeout(resize);
      resize = setTimeout(function () { renderChart(); renderComparison(); }, 180);
    });
  }

  /* ---------------------------------------------------------
     Navigation par sections
     --------------------------------------------------------- */
  function initNav() {
    var nav = byId('nav');
    if (!nav) return;

    var toggle = byId('nav-toggle');
    var list = byId('nav-list');
    var links = Array.prototype.slice.call(list.querySelectorAll('a'));
    var targets = links.map(function (a) { return byId(a.getAttribute('href').slice(1)); });

    function closeMenu() {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      var open = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });

    list.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });

    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    /* Surlignage de la section courante */
    var ticking = false;
    function updateActive() {
      var trigger = window.scrollY + 140;
      var current = -1;
      targets.forEach(function (node, i) {
        if (node && node.getBoundingClientRect().top + window.scrollY <= trigger) current = i;
      });
      /* En bas de page, la dernière section ne franchit jamais la ligne de
         déclenchement : on la marque active dès qu'on touche le fond. */
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        current = targets.length - 1;
      }
      links.forEach(function (a, i) {
        if (i === current) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { updateActive(); ticking = false; });
    }, { passive: true });
    updateActive();
  }

  /* ---------------------------------------------------------
     Divers
     --------------------------------------------------------- */
  function goToCurrentWeek() {
    var node = byId(nowWeek._anchor);
    if (!node) return;
    if (node.hidden) document.querySelector('[data-filter="all"]').click();
    toggleWeek(node, node.querySelector('.week__head'), true);
    node.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function initMisc() {
    document.querySelectorAll('[data-goto-now]').forEach(function (btn) {
      btn.addEventListener('click', goToCurrentWeek);
    });

    byId('reset-progress').addEventListener('click', function () {
      if (!window.confirm('Remettre la progression à zéro ? Les séances validées seront décochées.')) return;
      done = {};
      saveDone();
      document.querySelectorAll('[data-check]').forEach(function (btn) {
        btn.setAttribute('aria-pressed', 'false');
        btn.querySelector('.check__text').textContent = 'Marquer comme faite';
        btn.closest('.session').classList.remove('is-done');
      });
      document.querySelectorAll('.week').forEach(refreshWeekHeader);
      renderProgress();
    });

    var topbar = document.querySelector('.topbar');
    var onScroll = function () { topbar.classList.toggle('is-stuck', window.scrollY > 20); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    set('generated-on', new Date(PLAN.meta.genere_le)
      .toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }));
    set('plan-version', PLAN.meta.version);
  }

  /* ---------------------------------------------------------
     Démarrage
     --------------------------------------------------------- */
  renderHero();
  renderZones();
  renderRules();
  renderIndispos();
  renderWeeks();
  renderProgress();
  renderChart();
  renderTable();
  renderComparison();
  renderComparisonSummary();
  renderComparisonTable();
  initCharts();
  initFilters();
  initNav();
  initMisc();

  /* La semaine en cours s'ouvre d'office : c'est l'information
     que Mathieu vient chercher 9 fois sur 10. */
  var nowNode = byId(nowWeek._anchor);
  if (nowNode) toggleWeek(nowNode, nowNode.querySelector('.week__head'), true);
})();
