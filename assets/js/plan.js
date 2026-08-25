/* =========================================================
   Mrun — Plan SaintéSprint 2026 (Mathieu)
   Rendu du plan + progression locale + graphique de charge.
   Données : assets/js/plan-saintesprint-data.js
   ========================================================= */
(function () {
  'use strict';

  var PLAN = window.PLAN_SAINTESPRINT;
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
    var m = min % 60;
    if (h === 0) return m + " min";
    if (m === 0) return h + " h";
    return h + " h " + (m < 10 ? '0' + m : m);
  }

  function fmtDurationShort(min) {
    var h = Math.floor(min / 60);
    var m = min % 60;
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
    if (p.indexOf('décharge') !== -1 || p.indexOf('affûtage') !== -1) return 'allege';
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
    w.seances.forEach(function (s, j) { s._id = w.semaine_avant_course + '-' + (j + 1); });
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
    var cdValue = document.getElementById('countdown-value');
    var cdUnit = document.getElementById('countdown-unit');
    if (days === 0) {
      cdValue.textContent = "C'est";
      cdUnit.textContent = 'aujourd’hui';
    } else {
      cdValue.textContent = 'J−' + days;
      cdUnit.textContent = days > 1 ? 'jours' : 'jour';
    }

    document.getElementById('topbar-countdown').innerHTML =
      '<span class="dot" aria-hidden="true"></span> <b>' + (days === 0 ? 'Jour J' : 'J−' + days) + '</b>';

    set('stat-weeks', fmtNum(weeks.length));
    set('stat-hours', fmtNum(Math.round(TOTALS.min / 60)));
    set('stat-km', fmtNum(Math.round(TOTALS.km)));
    set('stat-dplus', fmtNum(TOTALS.dplus));
    set('stat-seances', fmtNum(TOTALS.seances));
  }

  function set(id, value) {
    var node = document.getElementById(id);
    if (node) node.textContent = value;
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
    var circle = document.getElementById('ring-value');
    var r = 52;
    var circ = 2 * Math.PI * r;
    circle.setAttribute('stroke-dasharray', circ.toFixed(1));
    circle.setAttribute('stroke-dashoffset', (circ * (1 - st.pct / 100)).toFixed(1));

    set('ring-pct', st.pct + '%');
    document.getElementById('progress-bar').style.width = st.pct + '%';
    document.getElementById('progress-count').innerHTML =
      '<b>' + st.count + '</b> / ' + TOTALS.seances + ' séances';
    document.getElementById('progress-time').innerHTML =
      '<b>' + fmtDuration(st.min) + '</b> sur ' + fmtDuration(TOTALS.min);
    document.getElementById('progress-km').innerHTML =
      '<b>' + fmtNum(Math.round(st.km)) + ' km</b> · ' + fmtNum(st.dplus) + ' m D+';

    var label = document.getElementById('progress-week');
    label.textContent = nowWeek._isNow
      ? 'Semaine en cours : ' + nowWeek.semaine_avant_course + ' · ' + nowWeek.dates_affichage
      : 'Prochaine semaine : ' + nowWeek.semaine_avant_course + ' · ' + nowWeek.dates_affichage;
  }

  /* ---------------------------------------------------------
     Zones FC
     --------------------------------------------------------- */
  function renderZones() {
    var z = PLAN.meta.athlete.zones_fc;
    var fcMax = PLAN.meta.athlete.fc_max;
    var floor = 90;
    var colors = ['var(--z-rest)', 'var(--z-easy)', 'var(--z-tempo)', 'var(--z-mix)', 'var(--z-hard)'];
    var host = document.getElementById('zones-list');

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
     Règles transverses
     --------------------------------------------------------- */
  function renderRules() {
    var host = document.getElementById('rules-grid');
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

  /* ---------------------------------------------------------
     Semaines & séances
     --------------------------------------------------------- */
  var ICON_KEY = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2 4 6v6c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10V6l-8-4Z"/><path d="M9 12h6"/></svg>';
  var ICON_INFO = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>';
  var ICON_CHECK = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 12 5.5 5.5L20 7"/></svg>';
  var ICON_CHEV = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

  function sessionCard(seance) {
    var zone = zoneOf(seance);
    var isRace = seance.intensite.zone === 'COURSE';
    var isDone = !!done[seance._id];

    var html =
      '<article class="session' + (isDone ? ' is-done' : '') + (isRace ? ' is-race' : '') + '" style="--zone-color:' + zone.color + '" data-session="' + seance._id + '">' +
        '<div class="session__top">' +
          '<div>' +
            '<span class="session__num">Séance ' + seance.numero + '</span>' +
            '<h4 class="session__type">' + esc(seance.type) + '</h4>' +
          '</div>' +
          '<span class="zone-pill"><b>' + esc(zone.key) + '</b><small>' + esc(zone.name) + '</small></span>' +
        '</div>' +

        '<div class="session__stats">' +
          '<div class="session__stat"><b>' + fmtDurationShort(seance.duree_min) + '</b><span>Durée</span></div>' +
          '<div class="session__stat"><b>' + fmtNum(seance.km_estimes, seance.km_estimes % 1 ? 1 : 0) + '</b><span>km est.</span></div>' +
          '<div class="session__stat"><b>' + fmtNum(seance.denivele_m) + '</b><span>m D+</span></div>' +
        '</div>' +

        '<p class="session__pace"><b>' + esc(seance.intensite.detail) + '</b></p>' +
        '<p class="session__pace" style="margin-top:-8px">' + esc(seance.intensite.allure_cible) + '</p>' +

        '<p class="session__detail">' + esc(seance.detail_seance) + '</p>' +

        (seance.element_en_tete
          ? '<div class="note">' + ICON_KEY + '<span>' + esc(seance.element_en_tete) + '</span></div>'
          : '') +
        (seance.autres
          ? '<div class="note note--muted">' + ICON_INFO + '<span>' + esc(seance.autres) + '</span></div>'
          : '') +

        '<div class="session__foot">' +
          '<button class="check" type="button" aria-pressed="' + isDone + '" data-check="' + seance._id + '">' +
            '<span class="check__box">' + ICON_CHECK + '</span>' +
            '<span class="check__text">' + (isDone ? 'Séance validée' : 'Marquer comme faite') + '</span>' +
          '</button>' +
        '</div>' +
      '</article>';

    return html;
  }

  function weekCard(week) {
    var group = GROUPS[week._group];
    var doneInWeek = week.seances.filter(function (s) { return done[s._id]; }).length;
    var isRace = week._group === 'course';

    var dots = week.seances.map(function (s) {
      return '<i class="' + (done[s._id] ? 'is-done' : '') + '"></i>';
    }).join('');

    var node = el(
      '<section class="week' + (week._isNow ? ' is-now' : '') + (week._isPast ? ' is-past' : '') + (isRace ? ' is-race' : '') + '"' +
        ' id="' + week.semaine_avant_course.replace('-', 'moins') + '" data-group="' + week._group + '" data-past="' + week._isPast + '">' +

        '<button class="week__head" type="button" aria-expanded="false" aria-controls="body-' + week._index + '">' +
          '<span class="week__id">' +
            '<span class="week__code">' + esc(week.semaine_avant_course) + '</span>' +
            '<span class="week__dates">' + esc(week.dates_affichage) + '</span>' +
          '</span>' +

          '<span class="week__main">' +
            '<span class="week__badges">' +
              '<span class="badge badge--solid" style="background:' + group.color + '">' + esc(week.phase) + '</span>' +
              (week._isNow ? '<span class="badge badge--now">Semaine en cours</span>' : '') +
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
          '<div class="week__support">' +
            '<div><div class="support__label">Renforcement</div><div class="support__value">' + esc(week.renforcement) + '</div></div>' +
            '<div><div class="support__label">Vélo</div><div class="support__value">' + esc(week.velo) + '</div></div>' +
            '<div><div class="support__label">Semaine</div><div class="support__value">' + esc(week.semaine_annee) + ' · ' + week.seances.length + ' séances · ' + fmtDuration(week.temps_total_min) + '</div></div>' +
          '</div>' +
          '<div class="sessions">' + week.seances.map(sessionCard).join('') + '</div>' +
        '</div>' +
      '</section>'
    );

    return node;
  }

  function renderWeeks() {
    var host = document.getElementById('weeks');
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
    var week = weeks[+weekNode.querySelector('.week__body').id.replace('body-', '')];
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
    var upcoming = document.getElementById('filter-upcoming');
    var expandAll = document.getElementById('expand-all');
    var empty = document.getElementById('weeks-empty');

    function apply() {
      var visible = 0;
      weeks.forEach(function (w) {
        var node = document.getElementById(w.semaine_avant_course.replace('-', 'moins'));
        var okGroup = current === 'all' || w._group === current;
        var okTime = !upcomingOnly || !w._isPast;
        var show = okGroup && okTime;
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

  /* ---------------------------------------------------------
     Graphique — charge hebdomadaire
     Une seule mesure à l'écran (jamais deux axes) : la
     bascule change la mesure, pas l'échelle superposée.
     --------------------------------------------------------- */
  var MEASURES = {
    duree: {
      label: 'Durée hebdomadaire',
      get: function (w) { return w.temps_total_min; },
      fmt: function (v) { return fmtDurationShort(v); },
      /* Pas de graduation « rond » : sinon l'axe ment (3 h 05 arrondi à 3 h). */
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

  function roundedTopPath(x, y, w, h, r) {
    r = Math.min(r, w / 2, h);
    return 'M' + x + ',' + (y + h) +
      'V' + (y + r) +
      'a' + r + ',' + r + ' 0 0 1 ' + r + ',' + -r +
      'h' + (w - 2 * r) +
      'a' + r + ',' + r + ' 0 0 1 ' + r + ',' + r +
      'V' + (y + h) + 'Z';
  }

  function renderChart() {
    var m = MEASURES[chartMeasure];
    var W = 1000, H = 360;
    var padL = 68, padR = 10, padT = 34, padB = 74;
    var plotW = W - padL - padR;
    var plotH = H - padT - padB;

    var values = weeks.map(m.get);
    var max = Math.max.apply(null, values);
    var niceMax = Math.ceil((max * 1.06) / m.step) * m.step;
    var steps = Math.round(niceMax / m.step);

    var slot = plotW / weeks.length;
    var barW = Math.round(slot * 0.56);   /* marques fines, respiration entre les barres */
    var offset = (slot - barW) / 2;

    var svg = ['<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-labelledby="chart-title chart-desc" preserveAspectRatio="xMidYMid meet">'];
    svg.push('<title id="chart-title">' + m.label + ' sur les ' + weeks.length + ' semaines du plan</title>');
    svg.push('<desc id="chart-desc">Le détail chiffré est disponible dans le tableau sous le graphique.</desc>');

    /* Grille + axe */
    for (var i = 0; i <= steps; i++) {
      var v = m.step * i;
      var y = padT + plotH - (v / niceMax) * plotH;
      svg.push('<line class="grid-line" x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (W - padR) + '" y2="' + y.toFixed(1) + '"/>');
      svg.push('<text class="axis-text" x="' + (padL - 12) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="end">' + m.axis(v) + '</text>');
    }

    /* Barres */
    weeks.forEach(function (w, i) {
      var v = m.get(w);
      var h = Math.max(3, (v / niceMax) * plotH);
      var x = padL + i * slot + offset;
      var y = padT + plotH - h;
      var hex = GROUPS[w._group].hex;

      svg.push('<g class="bar-group" data-bar="' + i + '">');
      svg.push('<path class="bar-rect" d="' + roundedTopPath(x, y, barW, h, 4) + '" fill="' + hex + '"/>');
      if (w._isNow) {
        svg.push('<rect class="now-marker" x="' + (x - 3).toFixed(1) + '" y="' + (y - 3).toFixed(1) + '" width="' + (barW + 6).toFixed(1) + '" height="' + (h + 6).toFixed(1) + '" rx="6"/>');
      }
      svg.push('<text class="bar-label" x="' + (x + barW / 2).toFixed(1) + '" y="' + (y - 9).toFixed(1) + '" text-anchor="middle">' + m.fmt(v) + '</text>');
      svg.push('<text class="week-label' + (w._isNow ? ' is-now' : '') + '" x="' + (x + barW / 2).toFixed(1) + '" y="' + (padT + plotH + 22) + '" text-anchor="middle">' + esc(w.semaine_avant_course) + '</text>');
      /* Bande de phase sous l'axe : la couleur redit la phase, en continu,
         avec 2 px de fond entre deux blocs. */
      svg.push('<rect class="phase-band" x="' + (padL + i * slot + 1).toFixed(1) + '" y="' + (padT + plotH + 32) + '" width="' + (slot - 2).toFixed(1) + '" height="6" fill="' + hex + '"/>');
      /* Cible de survol pleine hauteur, plus large que la barre */
      svg.push('<rect x="' + (padL + i * slot).toFixed(1) + '" y="' + padT + '" width="' + slot.toFixed(1) + '" height="' + plotH + '" fill="transparent"/>');
      svg.push('</g>');
    });

    /* Repères de fin de bande */
    svg.push('<text class="axis-text" x="' + padL + '" y="' + (padT + plotH + 56) + '">Début du plan</text>');
    svg.push('<text class="axis-text" x="' + (W - padR) + '" y="' + (padT + plotH + 56) + '" text-anchor="end">SaintéSprint</text>');

    svg.push('</svg>');
    document.getElementById('chart').innerHTML = svg.join('');
    bindChartHover();
  }

  function bindChartHover() {
    var chart = document.getElementById('chart');
    var tip = document.getElementById('chart-tooltip');

    chart.querySelectorAll('.bar-group').forEach(function (g) {
      g.addEventListener('mouseenter', function () { showTip(g); });
      g.addEventListener('mousemove', function () { showTip(g); });
      g.addEventListener('mouseleave', function () { tip.classList.remove('is-visible'); });
    });

    function showTip(g) {
      var w = weeks[+g.dataset.bar];
      var group = GROUPS[w._group];
      var rect = g.querySelector('.bar-rect').getBoundingClientRect();
      var host = chart.getBoundingClientRect();

      tip.innerHTML =
        '<div class="tt-phase" style="color:' + group.color + '">' + esc(w.phase) + '</div>' +
        '<h4>' + esc(w.semaine_avant_course) + ' · ' + esc(w.dates_affichage) + '</h4>' +
        '<dl>' +
          '<dt>Durée</dt><dd>' + fmtDuration(w.temps_total_min) + '</dd>' +
          '<dt>Distance</dt><dd>' + fmtNum(w.km_estimes_total, 1) + ' km</dd>' +
          '<dt>D+</dt><dd>' + fmtNum(w.denivele_total_m) + ' m</dd>' +
          '<dt>Séances</dt><dd>' + w.seances.length + '</dd>' +
        '</dl>';

      /* L'infobulle reste dans le cadre : au-dessus de la barre quand il y a
         la place, sinon juste en dessous de son sommet. */
      tip.classList.add('is-visible');
      var tipW = tip.offsetWidth;
      var tipH = tip.offsetHeight;
      var cx = rect.left - host.left + rect.width / 2;
      var barTop = rect.top - host.top;
      var left = Math.min(Math.max(cx - tipW / 2, 4), host.width - tipW - 4);
      var top = barTop - tipH - 12;
      if (top < 4) top = barTop + 14;

      tip.style.left = left + 'px';
      tip.style.top = top + 'px';
    }
  }

  function renderTable() {
    var rows = weeks.map(function (w) {
      return '<tr class="' + (w._isNow ? 'is-now' : '') + '">' +
        '<td>' + esc(w.semaine_avant_course) + '</td>' +
        '<td>' + esc(w.dates_affichage) + '</td>' +
        '<td>' + esc(w.phase) + '</td>' +
        '<td>' + fmtDuration(w.temps_total_min) + '</td>' +
        '<td>' + fmtNum(w.km_estimes_total, 1) + ' km</td>' +
        '<td>' + fmtNum(w.denivele_total_m) + ' m</td>' +
        '</tr>';
    }).join('');

    document.getElementById('chart-table').innerHTML =
      '<table><caption class="sr-only">Charge hebdomadaire du plan SaintéSprint 2026</caption><thead><tr>' +
      '<th scope="col">Semaine</th><th scope="col">Dates</th><th scope="col">Phase</th>' +
      '<th scope="col">Durée</th><th scope="col">Distance</th><th scope="col">D+</th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table>';
  }

  function initChartControls() {
    var seg = document.getElementById('chart-measures');
    seg.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-measure]');
      if (!btn) return;
      chartMeasure = btn.dataset.measure;
      seg.querySelectorAll('button').forEach(function (b) {
        b.setAttribute('aria-selected', String(b === btn));
      });
      document.getElementById('chart-caption').textContent = MEASURES[chartMeasure].label +
        ' — chaque barre est une semaine, de S-13 au jour de course.';
      renderChart();
    });

    var toggle = document.getElementById('table-toggle');
    var table = document.getElementById('chart-table');
    toggle.addEventListener('click', function () {
      var open = table.hasAttribute('hidden');
      if (open) table.removeAttribute('hidden'); else table.setAttribute('hidden', '');
      toggle.textContent = open ? 'Masquer le tableau de données' : 'Afficher le tableau de données';
      toggle.setAttribute('aria-expanded', String(open));
    });

    var resize;
    window.addEventListener('resize', function () {
      clearTimeout(resize);
      resize = setTimeout(renderChart, 180);
    });
  }

  /* ---------------------------------------------------------
     Divers
     --------------------------------------------------------- */
  function goToCurrentWeek() {
    var node = document.getElementById(nowWeek.semaine_avant_course.replace('-', 'moins'));
    if (!node) return;
    if (node.hidden) {
      document.querySelector('[data-filter="all"]').click();
    }
    toggleWeek(node, node.querySelector('.week__head'), true);
    node.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function initMisc() {
    document.querySelectorAll('[data-goto-now]').forEach(function (btn) {
      btn.addEventListener('click', goToCurrentWeek);
    });

    document.getElementById('reset-progress').addEventListener('click', function () {
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

    document.getElementById('generated-on').textContent =
      new Date(PLAN.meta.genere_le).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  /* ---------------------------------------------------------
     Démarrage
     --------------------------------------------------------- */
  renderHero();
  renderZones();
  renderRules();
  renderWeeks();
  renderProgress();
  renderChart();
  renderTable();
  initChartControls();
  initFilters();
  initMisc();

  /* La semaine en cours s'ouvre d'office : c'est l'information
     que Mathieu vient chercher 9 fois sur 10. */
  var nowNode = document.getElementById(nowWeek.semaine_avant_course.replace('-', 'moins'));
  if (nowNode) toggleWeek(nowNode, nowNode.querySelector('.week__head'), true);
})();
