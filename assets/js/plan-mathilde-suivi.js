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
  const QUAL_TYPES = ['seuil', 'cotes', 'seance_specifique', 'test', 'course'];

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
          <div>
            <div class="suivi-modal__eyebrow">Suivi post-séance</div>
            <h3 id="suivi-title"></h3>
            <p class="suivi-modal__dates"></p>
          </div>
          <button type="button" class="suivi-modal__close" data-close aria-label="Fermer">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </header>
        <div class="suivi-modal__alerts" hidden></div>
        <form class="suivi-modal__form"></form>
        <footer class="suivi-modal__foot">
          <button type="button" class="btn btn--ghost" data-close>Annuler</button>
          <button type="submit" class="btn btn--primary" data-submit>Enregistrer et marquer fait</button>
        </footer>
      </div>
    `;
    document.body.appendChild(modalEl);

    modalEl.addEventListener('click', (e) => {
      if (e.target.matches('[data-close]')) closeModal();
      if (e.target.matches('[data-submit]')) submitForm();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modalEl.hidden) closeModal();
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
            <span class="field__label">Séance prévue</span>
            <input type="text" name="seance_label" value="${escapeHtml(day.titre || '')}" readonly>
          </label>
          <label class="field">
            <span class="field__label">Durée réelle (minutes) *</span>
            <input type="number" name="duree_min" min="1" max="600" step="1"
                   value="${p ? p.duree_min || '' : ''}" required>
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
              <button type="button" class="rpe-btn" data-rpe="${a.valeur}">${a.valeur}</button>
            `).join('')}
          </div>
          <p class="rpe-hint" data-rpe-hint>Cliquer pour choisir. Repère verbal affiché ici.</p>
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
            <input type="hidden" name="jambes_5" required value="${p ? p.jambes_5 || '' : ''}">
          </div>
          <div class="field">
            <span class="field__label">Forme générale *</span>
            <div class="scale5" data-scale5="forme_5">
              ${S.echelles.ressenti_5.ancrages.map(a => `
                <button type="button" class="s5-btn" data-val="${a.valeur}" title="${a.libelle}">${a.valeur}</button>
              `).join('')}
            </div>
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
    const setActive = (v) => {
      btns.forEach(b => b.classList.toggle('is-active', +b.dataset.val === +v));
      input.value = v;
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
    if (alertes.length) {
      showAlerts(alertes);
      setTimeout(closeModal, 3200);
    } else {
      showAlerts([{ niveau: 'ok', message: 'Séance enregistrée.' }]);
      setTimeout(closeModal, 900);
    }
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
    getAll: loadSuivi
  };
})();
