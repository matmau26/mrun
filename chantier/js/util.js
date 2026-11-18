/* Petites fonctions partagées par les documents. */
(function () {
  'use strict';
  const p2 = n => String(n).padStart(2, '0');
  const KEY = 'olympe.reserves';

  window.OLYMPE.util = {
    today() { const t = new Date(); return t.getFullYear() + '-' + p2(t.getMonth() + 1) + '-' + p2(t.getDate()); },
    now() { const t = new Date(); return p2(t.getHours()) + ':' + p2(t.getMinutes()); },
    frDate(iso) { if (!iso) return ''; const a = iso.split('-'); return a[2] + '/' + a[1] + '/' + a[0]; },
    frTime(hm) { return hm ? hm.replace(':', ' h ') : ''; },
    frDateTime(iso) {
      if (!iso) return '';
      const t = new Date(iso);
      return p2(t.getDate()) + '/' + p2(t.getMonth() + 1) + '/' + t.getFullYear() + ' à ' + p2(t.getHours()) + ' h ' + p2(t.getMinutes());
    },
    oneLine(text) { return (text || '').replace(/\s*\n\s*/g, ', ').trim(); },
    fileName(prefix, name, date) {
      const n = (name || 'client').normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'client';
      return prefix + '_' + n + '_' + date + '.pdf';
    },

    /* PV signés avec réserves, gardés sur le téléphone pour préparer la levée. */
    pending: {
      list() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } },
      save(list) { try { localStorage.setItem(KEY, JSON.stringify(list.slice(-30))); } catch (e) { /* stockage plein */ } },
      add(entry) { const l = this.list(); l.push(entry); this.save(l); },
      update(id, reserves) {
        let l = this.list();
        if (reserves.length) l.forEach(e => { if (e.id === id) e.reserves = reserves; });
        else l = l.filter(e => e.id !== id);
        this.save(l);
      }
    }
  };
})();
