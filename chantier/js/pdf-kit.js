/* Mise en page commune à tous les PDF : en-tête, pied de page, titres,
   cases à cocher, tableau d'identification et blocs de signature. */
(function () {
  'use strict';

  const C = {
    blue: [29, 76, 161],
    ink: [16, 33, 63],
    muted: [90, 106, 133],
    line: [214, 222, 234],
    soft: [242, 245, 250],
    turq: [47, 184, 174],
    sky: [0, 163, 224],
    yellow: [249, 184, 18],
    danger: [194, 59, 48],
    dangerSoft: [253, 241, 239],
    white: [255, 255, 255]
  };
  const PT = 0.3528; // 1 point en millimètres

  let logoPromise = null;
  function loadLogo() {
    if (!logoPromise) {
      logoPromise = fetch('assets/logo.png')
        .then(r => { if (!r.ok) throw new Error('logo'); return r.blob(); })
        .then(blob => new Promise((resolve, reject) => {
          const fr = new FileReader();
          fr.onload = () => resolve(fr.result);
          fr.onerror = reject;
          fr.readAsDataURL(blob);
        }))
        .catch(() => { logoPromise = null; return null; });
    }
    return logoPromise;
  }

  class Kit {
    constructor(jsPDF, opts) {
      this.doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
      this.company = opts.company;
      this.label = opts.label || '';
      this.logo = opts.logo || null;
      this.W = 210; this.H = 297; this.M = 18;
      this.bottom = this.H - 17.5;
      this.doc.setProperties({ title: opts.title || '', author: this.company.name, creator: this.company.name });
      this._header();
    }

    get cw() { return this.W - 2 * this.M; }

    _font(size, bold, color) {
      this.doc.setFont('helvetica', bold ? 'bold' : 'normal');
      this.doc.setFontSize(size);
      this.doc.setTextColor(...(color || C.ink));
    }
    _lh(size, factor) { return size * PT * (factor || 1.42); }

    _header() {
      const d = this.doc, M = this.M;
      if (this.logo) d.addImage(this.logo, 'PNG', M, 11, 17, 17, 'logo', 'FAST');
      const x = this.logo ? M + 21.5 : M;
      this._font(11.5, true, C.blue);
      d.text(this.company.name.toUpperCase(), x, 18.2);
      this._font(7.6, false, C.muted);
      d.text(this.company.address.join('  ·  '), x, 22.6);
      d.text('Tél. ' + this.company.phone + '  ·  ' + this.company.email, x, 26.2);
      if (this.label) {
        this._font(7.6, true, C.muted);
        d.text(this.label.toUpperCase(), this.W - M, 18.2, { align: 'right', charSpace: 0.25 });
      }
      // Filet aux trois couleurs du logo
      const y = 31.5, w = this.cw / 3;
      d.setFillColor(...C.yellow); d.rect(M, y, w, 0.9, 'F');
      d.setFillColor(...C.turq); d.rect(M + w, y, w, 0.9, 'F');
      d.setFillColor(...C.sky); d.rect(M + 2 * w, y, w, 0.9, 'F');
      this.y = 39;
    }

    _footer(page, total) {
      const d = this.doc, M = this.M, y = this.H - 14;
      d.setDrawColor(...C.line); d.setLineWidth(0.2);
      d.line(M, y, this.W - M, y);
      this._font(7, false, C.muted);
      const c = this.company;
      d.text(c.legal + '  ·  ' + c.address.join(' – '), M, y + 4.2);
      d.text('Tél. ' + c.phone + '  ·  ' + c.email + '  ·  ' + c.web, M, y + 7.6);
      d.text('Page ' + page + ' / ' + total, this.W - M, y + 4.2, { align: 'right' });
    }

    ensure(h) {
      if (this.y + h > this.bottom) { this.newPage(); return true; }
      return false;
    }
    newPage() { this.doc.addPage(); this._header(); }
    space(mm) { this.y += mm; }

    title(text, sub) {
      this._font(16.5, true, C.ink);
      const lines = this.doc.splitTextToSize(text, this.cw);
      const lh = this._lh(16.5, 1.25);
      this.doc.text(lines, this.M, this.y + lh * 0.75);
      this.y += lines.length * lh;
      if (sub) {
        this.y += 1;
        this._font(8.8, false, C.muted);
        const sl = this.doc.splitTextToSize(sub, this.cw);
        this.doc.text(sl, this.M, this.y + 3);
        this.y += sl.length * this._lh(8.8);
      }
      this.y += 4.5;
    }

    /* Hauteur qu'occupera un paragraphe (pour garder des blocs ensemble) */
    textHeight(text, size) {
      size = size || 9.4;
      this._font(size, false);
      return this.doc.splitTextToSize(text, this.cw).length * this._lh(size) + 2.2;
    }

    /* keep : place à réserver sous le titre pour ne pas le laisser seul en bas de page */
    section(text, keep) {
      this.ensure(keep || 26);
      this.y += 1.5;
      this.doc.setFillColor(...C.turq);
      this.doc.rect(this.M, this.y, 1.1, 4.6, 'F');
      this._font(10.8, true, C.blue);
      this.doc.text(text, this.M + 3.4, this.y + 3.7);
      this.y += 7.6;
    }

    para(text, o) {
      o = o || {};
      const size = o.size || 9.4, indent = o.indent || 0;
      const w = (o.width || this.cw) - indent;
      this._font(size, !!o.bold, o.color);
      const lines = this.doc.splitTextToSize(text, w);
      const lh = this._lh(size);
      for (const line of lines) {
        this.ensure(lh);
        this._font(size, !!o.bold, o.color);
        this.doc.text(line, this.M + indent, this.y + lh * 0.72);
        this.y += lh;
      }
      this.y += (o.gap == null ? 2.2 : o.gap);
    }

    bullets(items, o) {
      o = o || {};
      const size = o.size || 9.4, lh = this._lh(size);
      for (const item of items) {
        this._font(size, false);
        const lines = this.doc.splitTextToSize(item, this.cw - 5);
        this.ensure(lines.length * lh);
        this.doc.setFillColor(...C.turq);
        this.doc.circle(this.M + 1.3, this.y + lh * 0.48, 0.65, 'F');
        this._font(size, false);
        this.doc.text(lines, this.M + 5, this.y + lh * 0.72, { lineHeightFactor: 1.42 });
        this.y += lines.length * lh + 1.3;
      }
      this.y += 1;
    }

    /* Liste « intitulé en gras + description » */
    defs(items) {
      const size = 9.4, lh = this._lh(size);
      for (const it of items) {
        this._font(size, false);
        const lines = this.doc.splitTextToSize(it.text, this.cw - 5);
        this.ensure(lh + lines.length * lh + 1.6);
        this.doc.setFillColor(...C.turq);
        this.doc.circle(this.M + 1.3, this.y + lh * 0.48, 0.65, 'F');
        this._font(size, true);
        this.doc.text(it.term, this.M + 5, this.y + lh * 0.72);
        this.y += lh;
        this._font(size, false);
        this.doc.text(lines, this.M + 5, this.y + lh * 0.72, { lineHeightFactor: 1.42 });
        this.y += lines.length * lh + 1.6;
      }
      this.y += 0.8;
    }

    callout(text, o) {
      o = o || {};
      const danger = o.tone === 'danger';
      const size = 9.2, lh = this._lh(size), pad = 3.2;
      this._font(size, !!o.bold);
      const lines = this.doc.splitTextToSize(text, this.cw - 2 * pad - 1.5);
      const h = lines.length * lh + 2 * pad - 0.6;
      this.ensure(h + 2);
      this.doc.setFillColor(...(danger ? C.dangerSoft : C.soft));
      this.doc.roundedRect(this.M, this.y, this.cw, h, 1.4, 1.4, 'F');
      this.doc.setFillColor(...(danger ? C.danger : C.blue));
      this.doc.rect(this.M, this.y, 1.1, h, 'F');
      this._font(size, !!o.bold, C.ink);
      this.doc.text(lines, this.M + pad + 1.5, this.y + pad + lh * 0.62, { lineHeightFactor: 1.42 });
      this.y += h + 3.2;
    }

    /* Tableau « libellé / valeur » */
    kv(rows) {
      const labelW = 50, size = 9.4, lh = this._lh(size), padY = 2.1;
      const d = this.doc;
      d.setDrawColor(...C.line); d.setLineWidth(0.2);
      this.ensure(8);
      d.line(this.M, this.y, this.W - this.M, this.y);
      for (const [label, value] of rows) {
        this._font(size, true);
        const lines = d.splitTextToSize(value || '—', this.cw - labelW - 3);
        const h = lines.length * lh + 2 * padY;
        if (this.ensure(h)) d.line(this.M, this.y, this.W - this.M, this.y);
        d.setFillColor(...C.soft);
        d.rect(this.M, this.y, labelW, h, 'F');
        this._font(8.4, false, C.muted);
        d.text(label, this.M + 2.5, this.y + padY + lh * 0.72);
        this._font(size, true);
        d.text(lines, this.M + labelW + 3, this.y + padY + lh * 0.72, { lineHeightFactor: 1.42 });
        this.y += h;
        d.setDrawColor(...C.line); d.setLineWidth(0.2);
        d.line(this.M, this.y, this.W - this.M, this.y);
      }
      this.y += 4;
    }

    _box(x, y, checked) {
      const d = this.doc, s = 3.5;
      d.setLineWidth(0.3);
      if (checked) {
        d.setFillColor(...C.blue); d.setDrawColor(...C.blue);
        d.roundedRect(x, y, s, s, 0.6, 0.6, 'FD');
        d.setDrawColor(...C.white); d.setLineWidth(0.55);
        d.line(x + 0.8, y + 1.85, x + 1.5, y + 2.55);
        d.line(x + 1.5, y + 2.55, x + 2.75, y + 1.0);
      } else {
        d.setDrawColor(...C.muted);
        d.roundedRect(x, y, s, s, 0.6, 0.6, 'S');
      }
    }

    /* Cases à cocher disposées en colonnes */
    checks(items, cols) {
      cols = cols || 1;
      const size = 9.4, lh = this._lh(size);
      const colW = this.cw / cols;
      for (let i = 0; i < items.length; i += cols) {
        const row = items.slice(i, i + cols);
        const wrapped = row.map(it => {
          this._font(size, !!it.checked);
          return this.doc.splitTextToSize(it.label, colW - 8);
        });
        const h = Math.max(...wrapped.map(l => l.length)) * lh + 1.6;
        this.ensure(h);
        row.forEach((it, c) => {
          const x = this.M + c * colW;
          this._box(x, this.y + 0.45, it.checked);
          this._font(size, !!it.checked, it.checked ? C.ink : C.muted);
          this.doc.text(wrapped[c], x + 5.6, this.y + lh * 0.72, { lineHeightFactor: 1.42 });
        });
        this.y += h;
      }
      this.y += 2.4;
    }

    /* Blocs de signature côte à côte.
       blocks : [{ title, name, date, sig: {data, w, h}, note }] */
    signatures(blocks) {
      const d = this.doc, gap = 6, n = blocks.length;
      const w = (this.cw - gap * (n - 1)) / n, h = 45;
      this.ensure(h);
      blocks.forEach((b, i) => {
        const x = this.M + i * (w + gap), y = this.y;
        d.setDrawColor(...C.line); d.setLineWidth(0.25);
        d.roundedRect(x, y, w, h, 1.6, 1.6, 'S');
        d.setFillColor(...C.soft);
        d.roundedRect(x + 0.15, y + 0.15, w - 0.3, 7.2, 1.4, 1.4, 'F');
        this._font(7.6, true, C.blue);
        d.text(b.title.toUpperCase(), x + 3, y + 4.9, { charSpace: 0.15 });
        this._font(7.6, false, C.muted);
        d.text('Nom', x + 3, y + 12.4);
        d.text('Date', x + 3, y + 17.2);
        this._font(9.2, true);
        d.text(d.splitTextToSize(b.name || '—', w - 16)[0], x + 13, y + 12.4);
        d.text(b.date || '—', x + 13, y + 17.2);
        // Signature
        const bx = x + 3, by = y + 19.5, bw = w - 6, bh = 18.5;
        if (b.mention) {
          this._font(8, true);
          d.text(b.mention, x + w - 3, y + 12.4, { align: 'right' });
        }
        if (b.sig && b.sig.data) {
          const r = Math.min(bw / b.sig.w, bh / b.sig.h);
          const iw = b.sig.w * r, ih = b.sig.h * r;
          d.addImage(b.sig.data, 'PNG', bx + (bw - iw) / 2, by + (bh - ih) / 2, iw, ih, undefined, 'FAST');
        }
        d.setDrawColor(...C.line); d.setLineWidth(0.2);
        d.line(bx, by + bh + 1, bx + bw, by + bh + 1);
        if (b.note) {
          this._font(6.8, false, C.muted);
          d.text(b.note, bx, by + bh + 4.6);
        }
      });
      this.y += h + 3;
    }

    small(text) {
      this.para(text, { size: 7.6, color: C.muted, gap: 1.5 });
    }

    /* Texte d'introduction sous un titre */
    intro(text) {
      this.y -= 1.5;
      this.para(text, { size: 9, color: C.muted, gap: 3 });
    }

    /* Tableau : { head: [...], widths: [parts de la largeur], rows: [[...]] } */
    table(o) {
      const d = this.doc, size = 8.8, lh = this._lh(size, 1.35), pad = 1.9;
      const ws = o.widths.map(f => f * this.cw);
      const head = () => {
        this._font(7.4, true, C.white);
        const lines = o.head.map((t, i) => d.splitTextToSize(t, ws[i] - 2 * pad));
        const hl = this._lh(7.4, 1.3);
        const h = Math.max(...lines.map(l => l.length)) * hl + 2 * pad - 0.4;
        d.setFillColor(...C.blue);
        d.rect(this.M, this.y, this.cw, h, 'F');
        let x = this.M;
        lines.forEach((l, i) => { d.text(l, x + pad, this.y + pad + hl * 0.68, { lineHeightFactor: 1.3 }); x += ws[i]; });
        this.y += h;
      };
      this.ensure(18);
      head();
      for (const row of o.rows) {
        this._font(size, false);
        const lines = row.map((c, i) => d.splitTextToSize(c == null || c === '' ? '—' : String(c), ws[i] - 2 * pad));
        const h = Math.max(...lines.map(l => l.length)) * lh + 2 * pad - 0.4;
        if (this.y + h > this.bottom) { this.newPage(); head(); }
        this._font(size, false);
        let x = this.M;
        lines.forEach((l, i) => { d.text(l, x + pad, this.y + pad + lh * 0.7, { lineHeightFactor: 1.35 }); x += ws[i]; });
        d.setDrawColor(...C.line); d.setLineWidth(0.2);
        x = this.M;
        for (let i = 0; i <= ws.length; i++) { d.line(x, this.y, x, this.y + h); x += ws[i] || 0; }
        d.line(this.M, this.y + h, this.M + this.cw, this.y + h);
        this.y += h;
      }
      this.y += 4;
    }

    /* Photos sur deux colonnes : [{ data, w, h, caption }] */
    photos(items) {
      const d = this.doc, gap = 6, w = (this.cw - gap) / 2, maxH = 64;
      for (let i = 0; i < items.length; i += 2) {
        const row = items.slice(i, i + 2);
        const dims = row.map(p => { const r = Math.min(w / p.w, maxH / p.h); return [p.w * r, p.h * r]; });
        this._font(8, false, C.muted);
        const caps = row.map(p => d.splitTextToSize(p.caption || '', w));
        const h = Math.max(...dims.map(x => x[1]));
        const capH = Math.max(...caps.map(c => c.length)) * this._lh(8);
        this.ensure(h + capH + 6);
        row.forEach((p, c) => {
          const x = this.M + c * (w + gap);
          d.addImage(p.data, 'JPEG', x, this.y, dims[c][0], dims[c][1], undefined, 'FAST');
          this._font(8, false, C.muted);
          d.text(caps[c], x, this.y + dims[c][1] + 3.6, { lineHeightFactor: 1.42 });
        });
        this.y += h + capH + 6;
      }
    }

    finish() {
      const total = this.doc.getNumberOfPages();
      for (let p = 1; p <= total; p++) { this.doc.setPage(p); this._footer(p, total); }
      return { blob: this.doc.output('blob'), pages: total };
    }
  }

  window.OlympePdf = {
    available() { return !!(window.jspdf && window.jspdf.jsPDF); },
    async create(opts) {
      if (!this.available()) throw new Error('pdf-indisponible');
      const logo = await loadLogo();
      return new Kit(window.jspdf.jsPDF, Object.assign({ logo, company: window.OLYMPE.company }, opts));
    }
  };
})();
