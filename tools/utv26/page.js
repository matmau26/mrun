/* UTV26 — suivi de course. Tout est local : rien ne sort de l'appareil.
   Les valeurs saisies (heures, cases cochées, notes) sont gardées dans
   localStorage sous la clé utv84k_v3. */
(function () {
  'use strict';

  var CP = __CP__;
  var NAMES = __NAMES__;
  var RACE_DATE = __RACE_DATE__;
  var GEO = __GEO__;
  var TOT = __TOT__;
  var KEY = 'utv84k_v3';

  var st = {};
  try { st = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { st = {}; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };

  /* ------------------------------------------------------- heures et durées */
  function toH(v) {                        // « 08:47 » -> heures depuis 05h00
    if (!v) return null;
    var p = v.split(':');
    var x = (+p[0]) + (+p[1]) / 60 - 5;
    if (x < -6) x += 24;                   // saisie après minuit
    return x;
  }
  function fmtClock(h) {                   // heures depuis 05h00 -> « 08h47 »
    var m = Math.round((h + 5) * 60);
    return pad(Math.floor(m / 60) % 24) + 'h' + pad(((m % 60) + 60) % 60);
  }
  function fmtDur(mins) {
    var s = mins < 0 ? '−' : '';
    mins = Math.abs(Math.round(mins));
    return mins < 60 ? s + mins + ' min'
                     : s + Math.floor(mins / 60) + ' h ' + pad(mins % 60);
  }
  function nowH() {
    var d = new Date();
    return d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600 - 5;
  }
  function todayISO() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function daysToRace() {
    var a = new Date(todayISO() + 'T00:00:00'), b = new Date(RACE_DATE + 'T00:00:00');
    return Math.round((b - a) / 86400000);
  }
  var IS_RACE_DAY = todayISO() === RACE_DATE;

  /* ------------------------------------------------------ thème, taille, wake */
  var THEMES = ['auto', 'light', 'dark'];
  var THEME_LABEL = { auto: 'Thème : automatique', light: 'Thème : clair', dark: 'Thème : sombre' };
  function applyTheme() {
    var t = st.theme || 'auto';
    if (t === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', t);
    var b = $('#btnTheme');
    if (b) {
      b.setAttribute('aria-label', THEME_LABEL[t]);
      b.title = THEME_LABEL[t];
      $$('#btnTheme [data-th]').forEach(function (g) { g.style.display = g.dataset.th === t ? '' : 'none'; });
    }
  }
  function applyBig() {
    document.documentElement.setAttribute('data-big', st.big ? '1' : '0');
    var b = $('#btnBig');
    if (b) { b.classList.toggle('on', !!st.big); b.setAttribute('aria-pressed', st.big ? 'true' : 'false'); }
  }
  applyTheme(); applyBig();
  $('#btnTheme').addEventListener('click', function () {
    st.theme = THEMES[(THEMES.indexOf(st.theme || 'auto') + 1) % 3]; save(); applyTheme();
  });
  $('#btnBig').addEventListener('click', function () { st.big = !st.big; save(); applyBig(); });

  var wl = null, btnWake = $('#btnWake');
  if (btnWake && 'wakeLock' in navigator) {
    btnWake.hidden = false;
    var setWake = function (on) {
      btnWake.classList.toggle('on', on);
      btnWake.setAttribute('aria-pressed', on ? 'true' : 'false');
    };
    var acquire = function () {
      navigator.wakeLock.request('screen').then(function (s) {
        wl = s; setWake(true);
        s.addEventListener('release', function () { wl = null; setWake(false); });
      }, function () { st.wake = false; setWake(false); });
    };
    btnWake.addEventListener('click', function () {
      if (wl) { st.wake = false; save(); wl.release(); }
      else { st.wake = true; save(); acquire(); }
    });
    document.addEventListener('visibilitychange', function () {
      if (st.wake && !wl && document.visibilityState === 'visible') acquire();
    });
    if (st.wake) acquire();
  }

  /* ---------------------------------------------------------------- onglets */
  var TABS = $$('.tabs button').map(function (b) { return b.dataset.t; });
  function show(t, push) {
    if (TABS.indexOf(t) < 0) t = TABS[0];
    $$('.tabs button').forEach(function (b) {
      var on = b.dataset.t === t;
      b.classList.toggle('on', on);
      if (on) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
    $$('main > section').forEach(function (s) { s.classList.toggle('on', s.id === t); });
    st.tab = t; save();
    if (push && location.hash.slice(1) !== t) history.pushState(null, '', '#' + t);
    return t;
  }
  $$('.tabs button').forEach(function (b) {
    b.addEventListener('click', function () { show(b.dataset.t, true); window.scrollTo(0, 0); });
  });
  window.addEventListener('popstate', function () { show(location.hash.slice(1) || st.tab || TABS[0], false); });
  show(location.hash.slice(1) || st.tab || TABS[0], false);

  /* ------------------------------------------------------- cases à cocher */
  function counters() {
    $$('[data-count]').forEach(function (el) {
      var box = $$('input[type=checkbox]', el.closest('[data-group]'));
      var n = box.filter(function (c) { return c.checked; }).length;
      el.textContent = n + '/' + box.length;
      el.classList.toggle('full', box.length > 0 && n === box.length);
    });
  }
  $$('input[type=checkbox][data-k]').forEach(function (c) {
    c.checked = !!(st.chk && st.chk[c.dataset.k]);
    c.addEventListener('change', function () {
      st.chk = st.chk || {}; st.chk[c.dataset.k] = c.checked; save(); counters();
    });
  });
  counters();

  /* ------------------------------------------------------------------ notes */
  var notes = $('#notes');
  notes.value = st.notes || '';
  notes.addEventListener('input', function () { st.notes = notes.value; save(); });

  /* ------------------------------------ scénario d'un point de passage saisi */
  function classify(i, real) {
    var t = CP[i].h;
    if (real == null) return null;
    if (t[4] - t[0] < 0.001) {             // départ : les 5 scénarios sont à 05h00
      return { label: '', delta: Math.round((real - t[1]) * 60), cls: '' };
    }
    var idx = 0, k;
    for (k = 0; k < t.length; k++) if (real >= t[k]) idx = k + 1;
    var label, cls;
    if (idx === 0) { label = 'Avance — watts M1 ?'; cls = 'e0'; }
    else if (idx >= 5) { label = 'Hors Annecy'; cls = 'e4'; }
    else {
      var f = (real - t[idx - 1]) / (t[idx] - t[idx - 1]);
      label = NAMES[idx - 1] + (f > 0.5 ? ' → ' + NAMES[idx] : '');
      cls = 'e' + (f > 0.5 ? idx : idx - 1);
    }
    return { label: label, delta: Math.round((real - t[1]) * 60), cls: cls };
  }
  function render(i) {
    var v = (st.reel || {})[i], real = toH(v), r = classify(i, real);
    var card = $('.cp[data-i="' + i + '"]');
    var out = $('.scen', card);
    out.className = 'scen' + (r && r.cls ? ' ' + r.cls : '');
    if (!r) { out.innerHTML = ''; }
    else {
      out.innerHTML = (r.label ? '<span>' + r.label + '</span>' : '')
        + '<span class="d">' + (r.delta >= 0 ? '+' : '') + r.delta + ' min vs réaliste</span>';
    }
    card.classList.toggle('done', real != null);
    var tr = $('.big tr[data-i="' + i + '"]');
    if (tr) {
      $('[data-reel]', tr).textContent = v ? v.replace(':', 'h') : '—';
      $('[data-scen]', tr).textContent = r ? (r.label ? r.label + ' ' : '') + '(' + (r.delta >= 0 ? '+' : '') + r.delta + ')' : '';
    }
  }

  $$('.cp input[type=time]').forEach(function (inp) {
    var i = inp.dataset.i;
    if (st.reel && st.reel[i]) inp.value = st.reel[i];
    inp.addEventListener('change', function () {
      st.reel = st.reel || {};
      if (inp.value) st.reel[i] = inp.value; else delete st.reel[i];
      save(); render(i); refresh();
    });
  });

  /* ------------------------------------------- bandeau live et progression */
  function lastEntered() {
    var best = -1;
    for (var i = 1; i < CP.length; i++) if ((st.reel || {})[i]) best = i;
    return best;
  }
  function nextPoint() {
    var last = lastEntered();
    for (var i = Math.max(last + 1, 1); i < CP.length; i++) if (!(st.reel || {})[i]) return i;
    return -1;
  }
  function hereMarker(last, next) {
    var g = $('#hereMain');
    if (!g) return;
    var o = '';
    if (next >= 0) {
      o += '<circle class="dot" style="fill:none;stroke:var(--ink2)" cx="' + CP[next].sx + '" cy="' + CP[next].sy + '" r="3"/>';
    }
    if (last >= 0) {
      var c = CP[last], anchor = c.sx < GEO.W * 0.62 ? 'start' : 'end';
      o += '<line x1="' + c.sx + '" y1="' + c.sy + '" x2="' + c.sx + '" y2="' + (c.sy - 21) + '"/>'
        + '<circle class="dot" cx="' + c.sx + '" cy="' + c.sy + '" r="3.6"/>'
        + '<text x="' + (c.sx + (anchor === 'start' ? -2 : 2)) + '" y="' + (c.sy - 24) + '" text-anchor="' + anchor + '">'
        + 'km ' + String(c.km.toFixed(1)).replace('.', ',') + '</text>';
    }
    g.innerHTML = o;
    g.setAttribute('class', 'here');
  }
  function refresh() {
    var last = lastEntered(), next = nextPoint();

    $$('.cp').forEach(function (el) { el.classList.toggle('next', +el.dataset.i === next); });
    hereMarker(last, next);

    /* progression */
    var kmDone = last >= 0 ? CP[last].km : 0;
    var upDone = last >= 0 ? CP[last].up : 0;
    $('#pKm').textContent = String(kmDone.toFixed(1)).replace('.', ',');
    $('#pKmR').textContent = String((TOT.km - kmDone).toFixed(1)).replace('.', ',');
    var upLeft = last >= 0 ? CP[last].upR : TOT.up;
    $('#pUp').textContent = upDone.toLocaleString('fr-FR');
    $('#pUpR').textContent = upLeft.toLocaleString('fr-FR');
    $('#pFill').style.width = (100 * kmDone / TOT.km).toFixed(1) + '%';

    /* état + prochain point */
    var r = last >= 0 ? classify(last, toH(st.reel[last])) : null;
    var l1 = $('#liveL1'), l2 = $('#liveL2');
    if (r) {
      l1.textContent = (r.label ? r.label + ' · ' : '') + (r.delta >= 0 ? '+' : '') + r.delta + ' min vs réaliste';
      l1.className = 'l1 scen ' + r.cls;
    } else {
      l1.textContent = IS_RACE_DAY ? 'Aucun passage saisi' : 'J−' + daysToRace() + ' · samedi 12/09, départ 05h00';
      l1.className = 'l1';
    }
    if (next >= 0) {
      var c = CP[next], txt = 'Prochain ' + fmtClock(c.h[1]);
      if (IS_RACE_DAY) {
        var d = (c.h[1] - nowH()) * 60;
        txt += d >= 0 ? ' (dans ' + fmtDur(d) + ')' : ' (il y a ' + fmtDur(-d) + ')';
      }
      l2.textContent = txt + ' · ' + c.nom;
    } else {
      l2.textContent = 'Tous les points sont saisis.';
    }

    /* barrière de Pertuson */
    var pw = $('#pertuson');
    if (!(st.reel || {})[__PERT_I__] && IS_RACE_DAY) {
      var left = (10 - nowH()) * 60;        // 15h00 = 10 h après le départ
      pw.hidden = false;
      pw.className = 'card tint' + (left < 60 ? ' bad' : '');
      $('#pertL').textContent = left >= 0
        ? 'Barrière de Pertuson (km 56,45) · ferme à 15h00 · dans ' + fmtDur(left)
        : 'Barrière de Pertuson (km 56,45) · fermée depuis ' + fmtDur(-left);
    } else { pw.hidden = true; }

    nutriSoon();
  }

  /* --------------------------------------------- nutrition : prochaine prise */
  function nutriSoon() {
    var lis = $$('.tl li[data-at]'), pick = null, n = nowH();
    lis.forEach(function (li) { li.classList.remove('soon'); });
    if (!IS_RACE_DAY) return;
    for (var i = 0; i < lis.length; i++) {
      if (toH(lis[i].dataset.at) >= n - 0.17) { pick = lis[i]; break; }
    }
    var b = $('#nutNext');
    if (pick) {
      pick.classList.add('soon');
      b.hidden = false;
      b.textContent = 'Prochaine prise · ' + pick.dataset.at.replace(':', 'h')
        + ' · ' + $('.q', pick).textContent;
    } else { b.hidden = true; }
  }

  /* ---------------------------------------------------------- what if : filtre */
  var q = $('#wiQ');
  q.addEventListener('input', function () {
    var v = q.value.trim().toLowerCase(), n = 0;
    $$('#wiList details').forEach(function (d) {
      var hit = !v || d.dataset.s.indexOf(v) >= 0;
      d.hidden = !hit;
      if (hit) n++;
      if (v && hit && v.length > 2) d.open = true;
    });
    $('#wiNone').hidden = n > 0;
  });

  /* ------------------------------------------------- navigation par pastilles */
  $$('.jump').forEach(function (bar) {
    $$('button', bar).forEach(function (b) {
      b.addEventListener('click', function () {
        var t = document.getElementById(b.dataset.go);
        if (!t) return;
        if (t.tagName === 'DETAILS') t.open = true;
        t.scrollIntoView({ block: 'start', behavior: 'smooth' });
        $$('button', bar).forEach(function (x) { x.classList.toggle('on', x === b); });
      });
    });
  });

  /* ------------------------------------------------------------------ profil */
  $('#chartZoom').addEventListener('click', function () {
    var w = $('#chartWrap'), on = w.classList.toggle('zoom');
    this.textContent = on ? 'Réduire' : 'Agrandir';
    this.setAttribute('aria-pressed', on ? 'true' : 'false');
    if (on) w.scrollLeft = 0;
  });

  /* --------------------------------------------------------- outils de suivi */
  $('#btnExport').addEventListener('click', function () {
    var rows = [];
    for (var i = 0; i < CP.length; i++) {
      var v = (st.reel || {})[i];
      if (!v) continue;
      var r = classify(i, toH(v));
      rows.push({ km: CP[i].km, point: CP[i].nom, reel: v,
                  scenario: r ? r.label : '', ecart_min_vs_realiste: r ? r.delta : null });
    }
    var txt = JSON.stringify({ course: 'UTV 84K 2026', export: new Date().toISOString(),
                               passages: rows, notes: st.notes || '' }, null, 1);
    var done = function () { flash('Copié dans le presse-papiers.'); };
    var fail = function () { window.prompt('Copie ce texte :', txt); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, fail);
    else fail();
  });
  function flash(m) {
    var el = $('#msg'); el.textContent = m;
    setTimeout(function () { el.textContent = ''; }, 3500);
  }
  /* à l'impression, tous les replis s'ouvrent puis reviennent à leur état */
  var reclose = [];
  function openAll() {
    reclose = $$('details:not([open])');
    reclose.forEach(function (d) { d.open = true; });
  }
  function restore() {
    reclose.forEach(function (d) { d.open = false; });
    reclose = [];
  }
  window.addEventListener('beforeprint', openAll);
  window.addEventListener('afterprint', restore);
  try {
    var mq = window.matchMedia('print');
    if (mq.addEventListener) mq.addEventListener('change', function (e) { e.matches ? openAll() : restore(); });
  } catch (e) {}
  $('#btnPrint').addEventListener('click', function () {
    openAll();
    window.print();
    setTimeout(restore, 1500);
  });
  $('#btnReset').addEventListener('click', function () {
    if (!window.confirm('Effacer toutes les saisies de cet appareil : heures de passage, cases cochées et notes ?')) return;
    st = { tab: st.tab, theme: st.theme, big: st.big };
    save();
    location.reload();
  });

  /* ------------------------------------------------------------------ départ */
  $('.live').addEventListener('click', function () {
    show('suivi', true);
    var n = nextPoint();
    var el = n >= 0 ? $('.cp[data-i="' + n + '"]') : null;
    if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    else window.scrollTo(0, 0);
  });

  /* --------------------------------------------------- lecture hors réseau
     La page ne dépend d'aucune ressource externe ; ce bloc sert seulement à
     pouvoir la RECHARGER sans réseau (zone blanche). Stratégie réseau
     d'abord : en ligne on voit toujours la version à jour du serveur, hors
     ligne on retombe sur la dernière copie. Si rien de tout ça n'est
     disponible, la page fonctionne exactement pareil. */
  var CACHE = 'utv26';
  try {
    if (window.caches) caches.open(CACHE).then(function (c) { return c.add(location.href); }).catch(function () {});
  } catch (e) {}
  if ('serviceWorker' in navigator &&
      (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    navigator.serviceWorker.register('utv26-sw.js', { scope: location.pathname }).catch(function () {});
  }

  function tick() {
    var d = new Date();
    $('#clock').textContent = pad(d.getHours()) + ':' + pad(d.getMinutes());
    refresh();
  }
  for (var i = 0; i < CP.length; i++) render(i);
  tick();
  setInterval(tick, 20000);
})();
