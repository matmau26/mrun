# -*- coding: utf-8 -*-
"""Génère UTV26.html — page privée « plan de course » UTV 84K (Mathilde, 12/09/2026).

    cd tools/utv26 && python3 build.py

Python 3.8+, aucune dépendance. Sorties : ../../UTV26.html et content_export.md.

Sources (ne pas éditer le HTML à la main) :
  content.py   textes des onglets Ravitos / Nutrition / Briefing / What if
  pacing.json  points de passage et scénarios (pacing v3 audité le 08/09/2026)
  track.json   altitudes de la trace officielle tous les 10 m + heures réalistes
Les textes, chiffres et heures viennent de ces fichiers : seule la présentation
est définie ici.
"""
import hashlib, json, re, html, os

from content import RAVITOS, MATHIEU_LOGISTIQUE, NUTRITION, BRIEFING, WHATIF

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', '..', 'UTV26.html')

D = json.load(open(os.path.join(HERE, 'pacing.json'), encoding='utf-8'))
T = json.load(open(os.path.join(HERE, 'track.json'), encoding='utf-8'))

S = ['Bonne journée', 'Réaliste', 'Prudent', 'Dégradé', 'Type Annecy']
SH = ['Bonne', 'Réaliste', 'Prudent', 'Dégradé', 'Annecy']
COL = {'Bonne journée': '#008300', 'Réaliste': '#2a78d6', 'Prudent': '#c98500',
       'Dégradé': '#d95926', 'Type Annecy': '#b3261e'}
COLD = ['#4cb35c', '#7fb2f5', '#dfae4d', '#ff9166', '#ff7a70']  # variantes mode sombre
DEPART_H = 5.0
RACE_DATE = '2026-09-12'

# ---------------------------------------------------------------- utilitaires
def clock(h):
    m = int(round((DEPART_H + h) * 60))
    return "%02dh%02d" % ((m // 60) % 24, m % 60)

def clockc(h):
    m = int(round((DEPART_H + h) * 60))
    return "%02d:%02d" % ((m // 60) % 24, m % 60)

def hm(h):
    m = int(round(h * 60))
    return "%dh%02d" % (m // 60, m % 60)

def md2html(t):
    t = html.escape(t, quote=False)
    t = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', t)
    t = re.sub(r'(?<!\*)\*(?!\*)(.+?)\*', r'<i>\1</i>', t)
    return t

def strip_tags(t):
    return re.sub(r'<[^>]+>', '', t)

# ------------------------------------------------------------------- la trace
ALT = T['alt_m']                     # altitude tous les 10 m
STEP = T['step_m'] / 1000.0          # 0,01 km
L = round((len(ALT) - 1) * STEP, 2)  # 84,93 km
CUMR = T['cum_h_realiste']           # heures depuis 05h00, un point tous les 100 m
CSTEP = T['cum_step_m'] / 1000.0

_cu, _cd = [0.0], [0.0]
for i in range(1, len(ALT)):
    d = ALT[i] - ALT[i - 1]
    _cu.append(_cu[-1] + (d if d > 0 else 0.0))
    _cd.append(_cd[-1] + (-d if d < 0 else 0.0))

def alt_at(km):
    x = min(max(km / STEP, 0), len(ALT) - 1)
    i = int(x)
    if i >= len(ALT) - 1:
        return ALT[-1]
    return ALT[i] + (ALT[i + 1] - ALT[i]) * (x - i)

def _i(km):
    """Index du premier point de la trace situé au-delà de km (searchsorted 'left').

    Le calcul reprend celui du script d'origine (np.searchsorted sur une grille
    en mètres) pour que les D+ / D− affichés soient au mètre près ceux du plan
    audité du 08/09/2026.
    """
    v = km * 1000.0
    j = int(v // 10.0)
    if j * 10.0 < v:
        j += 1
    return min(max(j, 0), len(ALT) - 1)

def up_dn(k0, k1):
    a, b = _i(k0), _i(k1)
    return _cu[b] - _cu[a], _cd[b] - _cd[a]

def km_at(clock_str):
    """« 11h45 » -> km sur la trace, au scénario réaliste."""
    m = re.search(r'(\d{1,2})h(\d{2})', clock_str)
    if not m:
        return None
    h = int(m.group(1)) + int(m.group(2)) / 60 - DEPART_H
    lo, hi = 0, len(CUMR) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if CUMR[mid] < h:
            lo = mid + 1
        else:
            hi = mid
    return round(lo * CSTEP, 2)

# ---------------------------------------------------- points de passage (data)
REN = {'Barrière — Les Jarrands': 'Barrière km 72,6 (Les Jarrands ? à confirmer)',
       'Chrono + secours 11 — 941 m — pied de la dernière montée':
       'Chrono + secours 11 — 941 m — pied de la dernière montée (km 76,1)'}
pts = D['pts']
sc = D['scen']
for p in pts:
    p['nom'] = REN.get(p['nom'], p['nom'])

def cptype(nom):
    if 'RAVITO' in nom:
        return 'ravito'
    if 'arrière' in nom or 'BARRIÈRE' in nom:
        return 'barriere'
    if 'DÉPART' in nom or 'ARRIVÉE' in nom:
        return 'terminus'
    return 'point'

CP = [dict(i=i, km=p['km'], alt=round(p['alt']), nom=p['nom'], type=cptype(p['nom']),
           h=[p[s] for s in S]) for i, p in enumerate(pts)]

RAVK = [(25.44, 'St-Nizier'), (41.28, 'Autrans'), (65.29, 'Rencurel')]
PERTUSON_KM = 56.45
BARRIERES_KM = [33.08, 72.62]
PORTIONS = [(0, 25.44), (25.44, 41.28), (41.28, 65.29), (65.29, L)]
PNUM = ['①', '②', '③', '④']

# ------------------------------------------------------------------- profils
# Espace de dessin commun à tous les graphiques : 400 unités de large, pour
# qu'une fois mis à la largeur d'un téléphone (~390 px) les textes des axes
# restent lisibles (échelle ≈ 1).
W, PL, PR = 400.0, 24.0, 8.0
PH = 130.0                  # hauteur du tracé
A0, A1 = 600.0, 2000.0      # bornes d'altitude

def px(km):
    return PL + (W - PL - PR) * km / L

def py(a):
    return PH * (1 - (a - A0) / (A1 - A0))

_st = 21
_pk = [i * _st * STEP for i in range(len(ALT) // _st)] + [L]
_pa = [ALT[min(i * _st, len(ALT) - 1)] for i in range(len(ALT) // _st)] + [ALT[-1]]
_line = " ".join("%s%.1f,%.1f" % ("M" if i == 0 else "L", px(k), py(a))
                 for i, (k, a) in enumerate(zip(_pk, _pa)))
_area = _line + " L%.1f,%.1f L%.1f,%.1f Z" % (px(L), PH, px(0), PH)
PROFIL_DEFS = ('<svg width="0" height="0" aria-hidden="true" class="defs">'
               '<defs><path id="pl" d="%s"/><path id="pa" d="%s"/></defs></svg>'
               % (_line, _area))

KM_AUBE = km_at('06h45')
KM_NUIT = km_at('20h21')

def axes_km(y):
    return "".join('<text class="ax" x="%.1f" y="%.1f">%d</text>' % (px(k), y, k)
                   for k in range(0, int(L) + 1, 10))

_clip_n = [0]

def base_profile(hi=None):
    """Silhouette + bande de nuit + repères ravitos/barrières. hi = (k0,k1) surligné."""
    o = '<rect class="night" x="%.1f" y="0" width="%.1f" height="%.1f"/>' % (
        px(0), px(KM_AUBE) - px(0), PH)
    o += '<use href="#pa" class="pa"/><use href="#pl" class="pl"/>'
    if hi and hi[0] is not None:
        k0, k1 = hi[0], max(hi[1], hi[0] + 0.25)
        _clip_n[0] += 1
        cid = 'clip%d' % _clip_n[0]
        o += ('<clipPath id="%s"><rect x="%.1f" y="-40" width="%.1f" height="%.1f"/></clipPath>'
              '<use href="#pa" class="pa hi" clip-path="url(#%s)"/>'
              '<use href="#pl" class="pl hi" clip-path="url(#%s)"/>'
              % (cid, px(k0), px(k1) - px(k0), PH + 40, cid, cid))
    for k in BARRIERES_KM:
        o += '<line class="bar" x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f"/>' % (
            px(k), py(alt_at(k)), px(k), PH)
    o += ('<line class="pert" x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f"/>'
          '<circle class="pertd" cx="%.1f" cy="%.1f" r="2.4"/>'
          % (px(PERTUSON_KM), py(alt_at(PERTUSON_KM)), px(PERTUSON_KM), PH,
             px(PERTUSON_KM), py(alt_at(PERTUSON_KM))))
    for k, nm in RAVK:
        o += ('<line class="rav" x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f"/>'
              '<circle class="ravd" cx="%.1f" cy="%.1f" r="3.2"/>'
              % (px(k), py(alt_at(k)), px(k), PH, px(k), py(alt_at(k))))
    return o

def main_profile():
    """Graphique principal : axe des heures en haut, des km en bas, portions."""
    o = '<svg class="chart main" viewBox="0 -20 400 190" role="img" aria-label="Profil du parcours : 84,9 km, 4 888 m de D+, altitude de 681 à 1 918 m, avec les trois ravitos et la barrière de Pertuson">'
    # axe des heures (scénario réaliste)
    for hh in range(5, 19):
        k = km_at('%02dh00' % hh)
        if k is None or k <= 0.2 or k >= L - 0.2:
            continue
        o += '<line class="grid v" x1="%.1f" y1="0" x2="%.1f" y2="%.1f"/>' % (px(k), px(k), PH)
        o += '<text class="ax" x="%.1f" y="-8">%dh</text>' % (px(k), hh)
    o += '<text class="ax lab" x="%.1f" y="-8" text-anchor="start">heure</text>' % px(0)
    for a in (800, 1200, 1600):
        o += '<line class="grid" x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f"/>' % (px(0), py(a), px(L), py(a))
        o += '<text class="ax y" x="%.1f" y="%.1f">%d</text>' % (PL - 4, py(a) + 3, a)
    o += base_profile()
    for k, nm in RAVK:
        o += '<text class="ax rv" x="%.1f" y="%.1f">%s</text>' % (px(k), py(alt_at(k)) - 7, nm)
    o += '<text class="ax pt" x="%.1f" y="%.1f">15h00</text>' % (px(PERTUSON_KM), py(alt_at(PERTUSON_KM)) - 7)
    o += '<g id="hereMain"></g>'
    o += axes_km(PH + 13)
    o += '<text class="ax lab" x="%.1f" y="%.1f" text-anchor="end">km</text>' % (px(L), PH + 13)
    for i, (k0, k1) in enumerate(PORTIONS):
        up, dn = up_dn(k0, k1)
        if i:
            o += '<line class="sep" x1="%.1f" y1="0" x2="%.1f" y2="%.1f"/>' % (px(k0), px(k0), PH + 18)
        o += '<text class="ax po" x="%.1f" y="%.1f">%s %s km · D+ %s</text>' % (
            (px(k0) + px(k1)) / 2, PH + 29, PNUM[i], fr(k1 - k0), frn(up))
    return o + '</svg>'

def mini_profile(k0, k1, idx):
    """Profil complet, section [k0,k1] surlignée, pour le briefing."""
    if k0 is None:
        return ''
    o = '<svg class="chart mini" viewBox="0 -6 400 156" role="img" aria-label="Situation de cette phase sur le profil : km %.1f à %.1f">' % (k0, k1)
    o += base_profile((k0, k1))
    o += axes_km(PH + 13)
    return o + '</svg>'

def portion_profile(k0, k1, intakes, idx):
    """Profil complet, portion surlignée, prises de nutrition numérotées."""
    o = '<svg class="chart port" viewBox="0 -56 400 206" role="img" aria-label="Profil de la portion km %.1f à %.1f avec les %d prises numérotées">' % (k0, k1, len(intakes))
    o += base_profile((k0, k1))
    prev, lvl = -99.0, 0
    for n, (km, txt) in enumerate(intakes, 1):
        if km is None:
            continue
        x, y = px(km), py(alt_at(km))
        lvl = (lvl + 1) % 3 if (x - prev) < 40 else 0
        prev = x
        yb = -46 + lvl * 15
        o += ('<line class="lead" x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f"/>'
              '<circle class="nb" cx="%.1f" cy="%.1f" r="6"/>'
              '<text class="nbt" x="%.1f" y="%.1f">%d</text>'
              '<text class="ax pk" x="%.1f" y="%.1f">%s</text>'
              % (x, y, x, yb + 6, x, yb, x, yb + 2.8, n, x + 8.5, yb + 2.8, txt))
    o += axes_km(PH + 13)
    return o + '</svg>'

# ------------------------------------------------- « où tu es » (texte briefing)
BKM = [(None, None), (0, 0.3), (0, 12.43), (12.43, 25.44), (25.44, 25.8),
       (25.44, 35.82), (35.82, 41.28), (41.28, 65.29), (65.29, 65.6),
       (65.22, 69.42), (69.42, 72.41), (72.41, 81.52), (81.52, L)]

def ou_tu_es(k0, k1, dec='.'):
    if k0 is None:
        return ""
    up, dn = up_dn(k0, k1)
    rup, rdn = up_dn(k1, L)
    t = ("<p class='ou'><b>km %.1f → %.1f</b> · alt %d → %d m · cette section : "
         "+%d / −%d m · <b>il restera %.1f km et %d m de D+</b> (%d m de descente)</p>"
         % (k0, k1, alt_at(k0), alt_at(k1), up, dn, L - k1, rup, rdn))
    return t if dec == '.' else t.replace('.', dec)

# ------------------------------------------------------- prises de nutrition
PKM = [(0, 25.44), (25.44, 41.28), (41.28, 65.29), (65.29, L)]

def intakes_of(p):
    """(km, libellé court) pour chaque ligne de la timeline d'une portion."""
    out = []
    for a, b_ in p['timeline']:
        km = km_at(a)
        short = re.sub(r'\*\*|—.*| .*', ' ', b_).split()[0] if b_ else ''
        short = {'gel': 'gel', 'barre': 'barre', 'purée': 'purée',
                 'rien': '—'}.get(short.lower().strip('*'), short.strip('*'))
        if 'salée' in b_:
            short = 'purée salée'
        if 'plus rien' in b_.lower():
            short = '(fin flasques)'
        if 'caféiné' in b_ or 'CAF' in b_:
            short = 'gel caf.'
        out.append((km, short))
    return out

for pi, p in enumerate(NUTRITION['portions']):
    p['_intakes'] = intakes_of(p)
    p['_kms'] = [k for k, _ in p['_intakes']]
    p['_svg'] = portion_profile(PKM[pi][0], PKM[pi][1], p['_intakes'], pi + 1)

# ------------------------------------------------------- export markdown (relecture)
def build_md():
    M = []
    M.append("# UTV 84K — CONTENU DE LA PAGE (source pour Claude Code)\n\nGénéré le 09/09/2026 · pacing v3 · nutrition v3.4 · météo J-4. Cinq onglets.\n")
    M.append("## ONGLET 1 — SUIVI DE COURSE (digital)\n\nTable des 23 points de passage × 5 scénarios, colonne « Réel » saisissable (heure), colonne « Scénario » calculée automatiquement, notes libres, sauvegarde locale (localStorage) et export JSON. Données dans `data.json`. Le profil `UTV84K_Profil_Pacing.png` est affiché au-dessus.\n")
    M.append("| km | alt | Point | " + " | ".join(SH) + " |\n|---|---|---|" + "---|" * 5)
    for p in pts:
        M.append("| %.1f | %d | %s | " % (p['km'], round(p['alt']), p['nom']) + " | ".join(clock(p[s]) for s in S) + " |")
    M.append("\nRègle de lecture : une seule lecture ne veut rien dire ; la tendance sur 2-3 points compte. Autrans « réaliste » jusqu'à 11h30 (incertitude M5). Pertuson (km 56,45) ferme à 15h00 : réaliste 13h31, dégradé 14h47 (+13 min), type Annecy 15h43 = DNF.\n")
    M.append("## ONGLET 2 — RAVITOS (organisation, pour Mathieu)\n")
    for r in RAVITOS:
        M.append("### %s\n**%s** · Portion suivante : %s\n" % (r['titre'], r['heure'], r['portion']))
        M.append("Flasques à donner :\n" + "\n".join("- " + x for x in r['flasques']))
        M.append("Solides (pochette) :\n" + "\n".join("- " + x for x in r['solides']))
        M.append("Matériel :\n" + "\n".join("- " + x for x in r['materiel']))
        M.append("Actions :\n" + "\n".join("- " + x for x in r['actions']) + "\n")
    M.append("### Logistique Mathieu\n" + "\n".join("- **%s** — %s" % (a, b) for a, b in MATHIEU_LOGISTIQUE) + "\n")
    M.append("## ONGLET 3 — NUTRITION & HYDRATATION (pour Mathilde)\n")
    M.append("### Ce qu'il faut savoir\n" + "\n".join("- **%s** %s" % (a, b) for a, b in NUTRITION['principes']) + "\n")
    M.append("### Tes produits (étiquettes relevées le 09/09)\n\n| Produit | Format | Glucides | Sodium | Lipides | Testé ? |\n|---|---|---|---|---|---|\n"
             + "\n".join("| " + " | ".join(r) + " |" for r in NUTRITION['produits']) + "\n")
    M.append("### Cibles\n" + "\n".join("- **%s** : %s" % (a, b) for a, b in NUTRITION['cibles']) + "\n")
    M.append("### Avant le départ\n" + "\n".join("- **%s** — %s" % (a, b) for a, b in NUTRITION['avant']) + "\n")
    for p in NUTRITION['portions']:
        M.append("### %s · km %s · %s · %s\n**Flasques :** %s\n" % (p['nom'], p['km'], p['duree'], p['meteo'], p['flasques']))
        M.append("| # | Quand | Où (km, réaliste) | Quoi |\n|---|---|---|---|\n" + "\n".join(
            "| %d | %s | %s | %s |" % (j + 1, a, ("km %.1f" % km_at(a)) if km_at(a) is not None else "—", b)
            for j, (a, b) in enumerate(p['timeline'])))
        M.append("\n**Total :** %s\n" % p['total'] + "\n".join("- " + c for c in p['consignes']) + "\n")
    M.append("### Plan B / Plan C\n" + NUTRITION['planB'] + "\n\n### Non testé\n" + NUTRITION['jamais_teste'] + "\n")
    M.append("## ONGLET 4 — BRIEFING DE COURSE (le film de la journée)\n")
    for b in BRIEFING:
        kk = BKM[BRIEFING.index(b)]
        M.append("### %s\n*%s*\n" % (b['t'], b['h'])
                 + (("\n**Où tu es :** " + strip_tags(ou_tu_es(kk[0], kk[1])) + "\n") if kk[0] is not None else "")
                 + "\n**Carte (3 lignes pour Mathilde) :**\n" + "\n".join("- " + x for x in b['carte'])
                 + "\n\n**À faire :**\n" + "\n".join("- " + x for x in b['faire']))
        M.append("\n**Repères :** %s\n\n**Ce que tu vas ressentir :** %s\n" % (b['reperes'], b['ressenti'])
                 + ("\n**Leçon du Mont-Blanc :** %s\n" % b['mmb'] if b['mmb'] else ""))
    M.append("## ONGLET 5 — WHAT IF\n")
    for w in WHATIF:
        M.append("### %s\n**Signal :** %s\n\n**Décision :** %s\n\n**Plan :**\n" % (w['titre'], w['signal'], w['decision'])
                 + "\n".join("- " + x for x in w['plan']) + "\n\n**Mathieu :** %s\n" % w['mathieu'])
    return "\n".join(M)

# ============================================================ pièces de la page
CHEV = ('<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
        'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
        '<path d="M6 9l6 6 6-6"/></svg>')

def ico(paths, extra=''):
    return ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" '
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"%s>%s</svg>'
            % (extra, paths))

ICONS = {
 'suivi':    ico('<path d="M3 17.5l4.5-6.5 4 2.8 4-7.3 5.5 6"/><path d="M3 21h18"/>'),
 'ravitos':  ico('<path d="M9.5 3h5"/><path d="M10.5 3v3.6L7.8 12v7a2 2 0 002 2h4.4a2 2 0 002-2v-7l-2.7-5.4V3"/><path d="M7.8 14.5h8.4"/>'),
 'nutrition':ico('<path d="M13 2.5L4.5 14H10l-1 7.5L19.5 10H13z"/>'),
 'briefing': ico('<path d="M4.5 5.5h15M4.5 12h15M4.5 18.5h9"/>'),
 'whatif':   ico('<path d="M12 3.2l9.2 16.3H2.8z"/><path d="M12 9.5v4.6"/><path d="M12 17.2h.01"/>'),
 'infos':    ico('<circle cx="12" cy="12" r="9.2"/><path d="M12 11v6"/><path d="M12 7.8h.01"/>'),
}
TABS = [('suivi', 'Suivi'), ('ravitos', 'Ravitos'), ('nutrition', 'Nutri'),
        ('briefing', 'Briefing'), ('whatif', 'What if'), ('infos', 'Infos')]

def sumline(title, sub=''):
    return ('<summary><span class="sum-t"><b>%s</b>%s</span>%s</summary>'
            % (title, ('<span class="sub">%s</span>' % sub) if sub else '', CHEV))

def li_list(items, cls=''):
    return '<ul%s>%s</ul>' % ((' class="%s"' % cls) if cls else '',
                              "".join('<li>%s</li>' % md2html(x) for x in items))

def chk_list(items, key):
    """Liste à cocher. La clé de sauvegarde vient du TEXTE de la ligne, pas de sa
    position : après une mise à jour du plan, une ligne déplacée garde sa coche et
    une ligne réécrite la perd — ce qui est le comportement voulu, on veut la
    relire. Avec un index, tout se décalait en silence."""
    seen, out = set(), []
    for x in items:
        h = hashlib.sha1(x.encode('utf-8')).hexdigest()[:8]
        assert h not in seen, 'deux lignes identiques dans %s' % key
        seen.add(h)
        out.append('<li><label><input type="checkbox" data-k="%s-%s"><span>%s</span></label></li>'
                   % (key, h, md2html(x)))
    return '<ul class="chk">%s</ul>' % "".join(out)

def jump(pairs):
    return ('<nav class="jump" aria-label="Aller à">%s</nav>'
            % "".join('<button type="button" data-go="%s">%s</button>' % (i, t) for i, t in pairs))

def fr(x, dec=1):
    return (("%%.%df" % dec) % x).replace('.', ',')

def frn(n):
    return format(int(round(n)), ',d').replace(',', ' ')

# ------------------------------------------------------------- textes repris tels quels
REGLES_TPL = """<div class="card rules"%s><h3>Les 3 règles</h3><ol><li><b>≤ 120 W sur la première montée.</b> Sommet attendu km 12,43 entre 06h51 et 07h02 ; avant 06h50, ce sont les watts moyens de M1 qui tranchent (&gt; 125 W = trop vite). Alarme FC 165 = « regarde les watts », pas « ralentis ».</li><li><b>Repartie d'Autrans avant 12h15</b>, sinon mode barrière (Pertuson km 56,45 ferme à 15h00).</li><li><b>Aucun arrêt debout « pour souffler ».</b> Les seuls arrêts : les 3 ravitos, un pipi, un caillou dans la chaussure. Tout le reste se fait en marchant.</li></ol><p class="knee"><b>Règle du genou (« règle des 10 minutes »)</b> — dès que le genou fait mal en descente : foulée courte, cadence haute, bâtons, pendant <b>10 minutes</b>. Toujours là après 10 minutes → <b>tu MARCHES toute la descente en cours</b>. À la descente suivante, tu recours et tu refais le test. Marcher 10 min de descente coûte 3-4 min ; courir sur un genou qui parle coûte la portion ④.</p></div>"""

def regles(el_id=''):
    return REGLES_TPL % ((' id="%s"' % el_id) if el_id else '')

LECTURE = """<div class="card" id="su-lecture"><h3>Lecture rapide aux ravitos</h3><table class="kv"><tr><th>St-Nizier 25,4</th><td>avant 08h34 bonne · 08h34-09h00 réaliste · 09h00-09h19 prudent · 09h19-09h43 dégradé · après 09h43 alerte</td></tr><tr><th>Autrans 41,3</th><td>avant 10h53 bonne · 10h53-<b>11h30</b> réaliste · 11h30-12h10 prudent · 12h10-12h30 dégradé · <b>après 12h30 → mode barrière</b></td></tr><tr><th>Rencurel 65,3</th><td>avant 14h15 bonne · 14h15-15h33 réaliste · 15h33-16h27 prudent · 16h27-17h00 dégradé</td></tr><tr><th>Arrivée</th><td>avant 17h45 bonne · 17h45-19h00 réaliste · 19h00-20h00 prudent (crépuscule) · 20h00-21h00 dégradé (nuit)</td></tr></table></div>"""

INFOS = """<div class="card"><h3>Repères de la journée</h3><table class="kv"><tr><th>Départ</th><td>Samedi 12/09/2026 · 05h00 · Villard-de-Lans, Colline des Bains</td></tr><tr><th>Parcours</th><td>84,9 km · D+ 4 888 (trace) / 4 300 (orga) · alt 680 → 1 918 m</td></tr><tr><th>Lumière</th><td>Aube ~06h40 · lever 07h13 · coucher 19h51 · nuit 20h21</td></tr><tr><th>Barrières</th><td>Pertuson km 56,45 : <b>15h00</b> · arrivée 23h30 · 5 autres barrières (km 25,4 · 33 · 41,3 · 65,3 · 72,6) — <b>heures à récupérer au briefing</b> : le dégradé passe Rencurel à 16h27 et le km 72,6 à 18h10</td></tr><tr><th>Ravitos</th><td>St-Nizier km 25,44 · Autrans (La Sure) km 41,28 · Rencurel km 65,29 — aucun gobelet, assistance autorisée</td></tr><tr><th>Secours</th><td>Postes aux km 12,3 · 20,4 · 25,5 · 33 · 36,9 · 46 · 58,2 · 65,3 · 71 · 76 · arrivée (positions de la trace officielle)</td></tr><tr><th>Interdits</th><td><b>Anti-inflammatoires (ibuprofène…) toute la journée.</b> Paracétamol seulement si Mathieu le donne.</td></tr><tr><th>Chronos live</th><td>km 12,3 · 25,4 · 30 · 33,1 · 41,3 · 58,2 · 65,3 · 76,1 — live.l-chrono.com</td></tr><tr><th>Météo (J-4)</th><td>Sec, peu nuageux · 8 °C matin / 17-19 °C après-midi à 1 027 m · 3-6 °C au sommet à 07h · 20-23 °C aux points bas 15h-17h · vent N 10 km/h. À revérifier le 11/09.</td></tr><tr><th>Physio</th><td>CP 179 W · FCmax 197 · LTHR 183 · plafonds puissance ① ≤120 W · ② ≤117 · ③ ≤112 · ④ ≤107 (estimations)</td></tr></table></div>"""

SOURCES = """<div class="card"><h3>Sources</h3><p class="sub">Trace officielle utv26_v4.gpx · pacing v3 calibré sur 7 courses (temps en mouvement) et contrôlé par audit indépendant le 08/09/2026 · relecture des 19 notes d'entraînement et du fichier ressentis · rapport de course MMB 42K (28/06/2026) · étiquettes produits Baouw/Maurten · météo infosmontagne / weather-forecast.com relevée le 08/09. Fiabilité du pacing 7/10 — les fenêtres sont larges à dessein.</p></div>"""

# --------------------------------------------------------------- onglet SUIVI
def sec_suivi():
    cards = []
    for c in CP:
        lad = "".join('<div%s><span class="s">%s</span><span class="h">%s</span></div>'
                      % (' class="on"' if j == 1 else '', SH[j], clock(c['h'][j]))
                      for j in range(5))
        cards.append(
            '<article class="cp %s" data-i="%d">'
            '<div class="cp-h"><span class="cp-km num">km %s</span>'
            '<h3 class="cp-nm">%s</h3><span class="cp-alt num">D+ %s</span></div>'
            '<div class="cp-lad">%s</div>'
            '<div class="cp-in">'
            '<input type="time" id="t%d" data-i="%d" inputmode="numeric" '
            'aria-label="Heure réelle de passage — %s">'
            '<p class="scen"></p></div></article>'
            % (c['type'], c['i'], fr(c['km']), md2html(c['nom']), frn(up_dn(0, c['km'])[0]), lad,
               c['i'], c['i'], html.escape(strip_tags(md2html(c['nom'])), quote=True)))

    rows = []
    for c in CP:
        rows.append('<tr class="%s" data-i="%d"><td class="km num">%s</td>'
                    '<td class="dp num">%s</td><td class="nm">%s</td>%s'
                    '<td class="reel num" data-reel="%d">—</td><td data-scen="%d"></td></tr>'
                    % (c['type'], c['i'], fr(c['km']), frn(up_dn(0, c['km'])[0]), md2html(c['nom']),
                       "".join('<td class="h%d num">%s</td>' % (j, clock(c['h'][j])) for j in range(5)),
                       c['i'], c['i']))
    rows.append('<tr><td></td><td></td><td class="nm"><b>Temps en mouvement</b></td>%s<td></td><td></td></tr>'
                % "".join('<td class="num">%s</td>' % hm(sc[s]['mouv']) for s in S))
    rows.append('<tr><td></td><td></td><td class="nm"><b>Arrêts</b></td>'
                '<td class="num">18 min</td><td class="num">26 min</td><td class="num">40 min</td>'
                '<td class="num">60 min</td><td class="num">2h20</td><td></td><td></td></tr>')
    rows.append('<tr class="terminus"><td></td><td></td><td class="nm"><b>TOTAL → ARRIVÉE</b></td>%s<td></td><td></td></tr>'
                % "".join('<td class="h%d num"><b>%s</b><br>→ %s</td>' % (j, hm(sc[s]['total']), clock(sc[s]['total']))
                          for j, s in enumerate(S)))

    thead = ('<tr><th>km</th><th>D+ cum.</th><th>Point</th>%s<th>Réel</th><th>Scénario</th></tr>'
             % "".join('<th class="h%d">%s</th>' % (j, SH[j]) for j in range(5)))

    tot_up = up_dn(0, L)[0]
    return (
      '%s'
      '<div class="card tint" id="pertuson" hidden><p id="pertL"></p></div>'
      '<div class="card" id="su-profil">'
        '<div class="toolbar" style="justify-content:space-between;align-items:baseline">'
          '<h2>Profil · %s km · D+ %s m</h2>'
          '<button type="button" class="btn" id="chartZoom" aria-pressed="false">Agrandir</button>'
        '</div>'
        '<div class="chart-wrap" id="chartWrap">%s</div>'
        '<div class="chips">'
          '<span><i style="background:var(--acc)"></i>Ravitos 25,4 · 41,3 · 65,3</span>'
          '<span><i style="background:var(--bad)"></i>Barrières · Pertuson 15h00</span>'
          '<span><i style="background:var(--night)"></i>Nuit, frontale</span>'
          '<span>Axe du haut : heure au scénario réaliste</span>'
        '</div>'
        '<div class="prog">'
          '<div><span class="k">Parcourus</span><span class="v"><span id="pKm">0</span> km</span></div>'
          '<div><span class="k">D+ encaissé</span><span class="v"><span id="pUp">0</span> m</span></div>'
          '<div><span class="k">Restants</span><span class="v"><span id="pKmR">%s</span> km</span></div>'
          '<div><span class="k">D+ restant</span><span class="v"><span id="pUpR">%s</span> m</span></div>'
        '</div>'
        '<div class="bar-track"><div class="bar-fill" id="pFill"></div></div>'
        '<p class="sub" style="margin-top:8px">Calculé sur le dernier point de passage saisi.</p>'
      '</div>'
      '%s'
      '<div class="card" id="su-outils">'
        '<p class="sub">Saisis l\'heure réelle à chaque passage connu : le scénario se calcule tout seul. '
        'Une seule lecture ne veut rien dire — c\'est la tendance sur 2-3 points qui compte. '
        'Heures des ravitos = arrêt inclus. Sauvegarde automatique sur cet appareil.</p>'
        '<div class="toolbar" style="margin-top:10px">'
          '<button type="button" class="btn" id="btnTsv">Copier pour tableur</button>'
          '<button type="button" class="btn" id="btnCsv">Fichier .csv</button>'
          '<button type="button" class="btn" id="btnPrint">Imprimer</button>'
          '<button type="button" class="btn" id="btnWake" hidden aria-pressed="false">Écran allumé</button>'
          '<button type="button" class="btn ghost" id="btnExport">JSON</button>'
          '<button type="button" class="btn ghost" id="btnReset">Effacer les saisies</button>'
          '<span class="msg" id="msg" role="status"></span>'
        '</div>'
        '<p class="sub" style="margin-top:9px">Tu peux n\'en renseigner qu\'une partie : '
        'chaque point se calcule tout seul, dans n\'importe quel ordre. Une case laissée '
        'vide ne bloque rien — ni le scénario des autres points, ni la progression, '
        'ni l\'export.<br>« Copier pour tableur » met les 23 lignes dans le presse-papiers : '
        'un collage dans Excel ou Google Sheets et les colonnes tombent en place. '
        'Après une correction, tu recopies et tu recolles par-dessus — la grille fait '
        'toujours la même taille.</p>'
      '</div>'
      '<div class="cplist" id="su-passages">%s</div>'
      '%s'
      '<div class="card" id="su-notes"><h3>Notes de course</h3>'
      '<textarea id="notes" placeholder="Ce qu\'elle a dit aux ravitos, ce qu\'elle a mangé, décisions prises…"></textarea></div>'
      '<details class="card tablewrap" id="su-tableau">%s<table class="big"><thead>%s</thead><tbody>%s</tbody></table></details>'
      % (jump([('su-profil', 'Profil'), ('su-regles', '3 règles'),
                ('su-passages', 'Passages'), ('su-lecture', 'Lecture rapide'),
                ('su-notes', 'Notes'), ('su-tableau', 'Tableau')]),
         fr(L), frn(tot_up), main_profile(), fr(L), frn(tot_up), regles('su-regles'),
         "".join(cards), LECTURE,
         sumline('Tableau complet', 'Les 23 points × 5 scénarios — pour l\'écran large et l\'impression'),
         thead, "".join(rows)))

# ------------------------------------------------------------- onglet RAVITOS
def sec_ravitos():
    o = [jump([('rav-' + r['id'], r['titre'].split('—')[0].strip().title()
                if r['id'] not in ('depart', 'arrivee') else r['titre'].split('—')[0].strip().capitalize())
               for r in RAVITOS] + [('rav-logistique', 'Logistique')])]
    o.append('<p class="intro">Ce que Mathieu embarque et donne à chaque point. '
             'Coche au fur et à mesure — l\'état est gardé sur cet appareil.</p>')
    for r in RAVITOS:
        o.append('<details class="card" id="rav-%s" data-group%s>'
                 '<summary><span class="sum-t"><b>%s</b><span class="sub">%s</span></span>'
                 '<span class="count" data-count></span>%s</summary>'
                 '<p class="sub">Portion suivante : %s</p>'
                 '<div class="grid2"><div><h4>🥤 Flasques</h4>%s<h4>🍫 Solides</h4>%s</div>'
                 '<div><h4>🎒 Matériel</h4>%s<h4>✅ Actions</h4>%s</div></div></details>'
                 % (r['id'], ' open' if r['id'] == 'depart' else '',
                    md2html(r['titre']), md2html(r['heure']), CHEV, md2html(r['portion']),
                    chk_list(r['flasques'], r['id'] + 'f'), chk_list(r['solides'], r['id'] + 's'),
                    chk_list(r['materiel'], r['id'] + 'm'), chk_list(r['actions'], r['id'] + 'a')))
    o.append('<div class="card" id="rav-logistique"><h3>Logistique Mathieu</h3><table class="kv">%s</table></div>'
             % "".join('<tr><th>%s</th><td>%s</td></tr>' % (md2html(a), md2html(b))
                       for a, b in MATHIEU_LOGISTIQUE))
    return "".join(o)

# ----------------------------------------------------------- onglet NUTRITION
def sec_nutrition():
    dest = ['St-Nizier', 'Autrans', 'Rencurel', 'Arrivée']
    o = [jump([('nut-savoir', 'À savoir'), ('nut-produits', 'Produits'),
               ('nut-cibles', 'Cibles'), ('nut-avant', 'Avant')]
              + [('nut-p%d' % (i + 1), '%s %s' % (PNUM[i], dest[i])) for i in range(4)]
              + [('nut-plan', 'Plan B/C')])]
    o.append('<p class="intro">Pour Mathilde : quoi prendre, quand, et comment gérer. '
             'Plan nutrition v3.4 du 09/09, construit sur tes propres données '
             'et sur les étiquettes de tes produits.</p>'
             '<p class="card tint" id="nutNext" hidden style="font-weight:700;font-size:.85rem"></p>')
    o.append('<div class="card" id="nut-savoir"><h3>Ce qu\'il faut savoir</h3>%s</div>'
             % "".join('<div class="pr"><b>%s</b><p>%s</p></div>' % (md2html(a), md2html(b))
                       for a, b in NUTRITION['principes']))
    prod = []
    for nom, fmt, gl, na, li, note in NUTRITION['produits']:
        prod.append('<li><div class="p-h"><b>%s</b><span>%s</span></div>'
                    '<div class="p-n"><span><i>Glucides</i>%s</span><span><i>Sodium</i>%s</span>'
                    '<span><i>Lipides</i>%s</span></div><p class="p-t">%s</p></li>'
                    % (md2html(nom), md2html(fmt), md2html(gl), md2html(na), md2html(li), md2html(note)))
    o.append('<div class="card" id="nut-produits"><h3>Tes produits</h3>'
             '<p class="sub">Valeurs relevées sur les étiquettes le 09/09.</p>'
             '<ul class="prod">%s</ul></div>' % "".join(prod))
    o.append('<div class="card" id="nut-cibles"><h3>Cibles</h3><table class="kv">%s</table></div>'
             % "".join('<tr><th>%s</th><td>%s</td></tr>' % (a, md2html(b)) for a, b in NUTRITION['cibles']))
    o.append('<div class="card" id="nut-avant"><h3>Avant le départ</h3><table class="kv">%s</table></div>'
             % "".join('<tr><th>%s</th><td>%s</td></tr>' % (a, md2html(b)) for a, b in NUTRITION['avant']))
    for pi, p in enumerate(NUTRITION['portions']):
        tl = []
        for j, (a, b) in enumerate(p['timeline']):
            m = re.search(r'(\d{1,2})h(\d{2})', a)
            at = ' data-at="%s:%s"' % (m.group(1).zfill(2), m.group(2)) if m else ''
            km = p['_kms'][j]
            # depuis la v3.4 les libellés portent souvent le km : on ne le répète pas
            suffixe = (' · km %s' % fr(km)) if (km is not None and 'km' not in a) else ''
            tl.append('<li%s><span class="n">%d</span>'
                      '<span class="w">%s%s</span><span class="q">%s</span></li>'
                      % (at, j + 1, md2html(a), suffixe, md2html(b)))
        o.append('<div class="card" id="nut-p%d"><h3>%s</h3>'
                 '<p class="sub">km %s · %s · %s</p><p><b>Flasques :</b> %s</p>'
                 '<div class="chart-wrap">%s</div><ul class="tl">%s</ul>'
                 '<p class="tot">%s</p>%s</div>'
                 % (pi + 1, md2html(p['nom']), p['km'], p['duree'], p['meteo'],
                    md2html(p['flasques']), p['_svg'], "".join(tl), md2html(p['total']),
                    li_list(p['consignes'])))
    o.append('<div class="card bad" id="nut-plan"><h3>Plan B · Plan C</h3><p>%s</p></div>'
             '<div class="card"><h3>Non testé — assumé</h3><p>%s</p></div>'
             % (md2html(NUTRITION['planB']), md2html(NUTRITION['jamais_teste'])))
    return "".join(o)

# ------------------------------------------------------------ onglet BRIEFING
def sec_briefing():
    def short(t):
        s = t.split(' — ')[0]
        return s if len(s) <= 22 else s[:21] + '…'
    o = [jump([('br-%d' % i, short(b['t'])) for i, b in enumerate(BRIEFING)])]
    o.append('<p class="intro">Le film de la journée : quoi faire, quand, et ce que tu vas ressentir '
             '— pour l\'avoir déjà vécu avant de le vivre.</p>')
    o.append(regles('br-regles'))
    for i, b in enumerate(BRIEFING):
        o.append('<details class="card" id="br-%d"%s>'
                 '<summary><span class="sum-t"><b>%s</b><span class="sub">%s</span></span>%s</summary>'
                 '<div class="carte">%s</div>%s%s'
                 '<h4>À faire</h4>%s<h4>Repères</h4><p>%s</p>'
                 '<h4>Ce que tu vas ressentir</h4><p class="feel">%s</p>%s</details>'
                 % (i, ' open' if i < 2 else '', md2html(b['t']), md2html(b['h']), CHEV,
                    "".join('<div>%s</div>' % md2html(x) for x in b['carte']),
                    ('<div class="chart-wrap">%s</div>' % mini_profile(BKM[i][0], BKM[i][1], i)) if BKM[i][0] is not None else '',
                    ou_tu_es(BKM[i][0], BKM[i][1], ','),
                    li_list(b['faire']), md2html(b['reperes']), md2html(b['ressenti']),
                    ('<h4>Leçon du Mont-Blanc</h4><p class="mmb">%s</p>' % md2html(b['mmb'])) if b['mmb'] else ''))
    return "".join(o)

# -------------------------------------------------------------- onglet WHAT IF
def sec_whatif():
    import unicodedata
    def norm(t):
        t = unicodedata.normalize('NFD', t.lower())
        return "".join(c for c in t if unicodedata.category(c) != 'Mn')
    o = ['<div class="stuck">'
         '<label class="vh" for="wiQ">Filtrer les situations</label>'
         '<input type="search" id="wiQ" placeholder="Filtrer : genou, estomac, chaud, barrière…" '
         'autocomplete="off" enterkeyhint="done"></div>'
         '<p class="intro">Un signal = un plan. Tu bascules, tu ne réfléchis pas.</p>'
         '<div id="wiList">']
    for w in WHATIF:
        hay = norm(" ".join([w['titre'], w['signal'], w['decision'], " ".join(w['plan']), w['mathieu']]))
        o.append('<details class="card%s" data-s="%s">'
                 '<summary><span class="sum-t"><b>%s</b></span>%s</summary>'
                 '<p class="sig"><b>Signal :</b> %s</p><p class="dec">%s</p>'
                 '<h4>Plan</h4>%s<h4>Mathieu</h4><p>%s</p></details>'
                 % (' bad' if 'URGENCES' in w['titre'] else '',
                    html.escape(hay, quote=True), md2html(w['titre']), CHEV,
                    md2html(w['signal']), md2html(w['decision']),
                    li_list(w['plan']), md2html(w['mathieu'])))
    o.append('</div><p class="empty" id="wiNone" hidden>Aucune situation ne correspond.</p>')
    return "".join(o)

# --------------------------------------------------------------- onglet INFOS
def sec_infos():
    page = ('<div class="card"><h3>Cette page</h3><table class="kv">'
            '<tr><th>Accès</th><td>Page privée : non listée sur le site, non indexée '
            '(<code>noindex,nofollow</code>). Elle ne s\'ouvre que par son adresse.</td></tr>'
            '<tr><th>Hors réseau</th><td>Aucune ressource externe : une fois la page ouverte, '
            'elle se recharge et fonctionne sans réseau. À ouvrir une fois avant le départ.</td></tr>'
            '<tr><th>Tes saisies</th><td>Heures de passage, cases cochées et notes restent '
            '<b>sur cet appareil</b> (stockage local du navigateur). Rien n\'est envoyé nulle part. '
            'Elles sont liées à cette adresse et à ce navigateur : ne change pas d\'appareil '
            'en cours de course, et n\'utilise pas la navigation privée.</td></tr>'
            '<tr><th>Récupérer</th><td><b>« Copier pour tableur »</b> met les 23 lignes '
            '(km, D+ cumulé, point, les 5 scénarios, l\'heure réelle, le scénario calculé, '
            'l\'écart) dans le presse-papiers, tabulées : un collage dans Excel ou Google '
            'Sheets suffit. <b>« Fichier .csv »</b> enregistre la même grille (séparateur '
            '« ; », UTF-8 avec BOM : Excel français l\'ouvre d\'un double-clic). '
            '<b>« JSON »</b> pour un traitement automatique. Dans les trois cas la grille '
            'est complète, saisie ou non : une correction se règle en recollant par-dessus. '
            '« Imprimer » sort l\'onglet affiché sur papier.</td></tr>'
            '<tr><th>Confort</th><td>Les deux boutons en haut à droite : taille du texte et thème '
            '(auto / clair / sombre). « Écran allumé » dans l\'onglet Suivi empêche la veille '
            '(si le navigateur le permet).</td></tr>'
            '<tr><th>Sur le téléphone</th><td>Ajoute la page à l\'écran d\'accueil : elle s\'ouvre '
            'alors en un geste, sans chercher l\'adresse.</td></tr>'
            '</table></div>')
    return INFOS + page + SOURCES

# ==================================================================== assemblage
def js_payload():
    cps = [{'km': c['km'], 'nom': strip_tags(md2html(c['nom'])), 'alt': c['alt'],
            'h': [round(x, 5) for x in c['h']],
            'sx': round(px(c['km']), 1), 'sy': round(py(alt_at(c['km'])), 1),
            'type': c['type'],
            'up': int(round(up_dn(0, c['km'])[0])),
            'upR': int(up_dn(c['km'], L)[0])} for c in CP]
    pert = next(c['i'] for c in CP if abs(c['km'] - PERTUSON_KM) < 0.01)
    js = open(os.path.join(HERE, 'page.js'), encoding='utf-8').read()
    rep = {
        '__CP__': json.dumps(cps, ensure_ascii=False, separators=(',', ':')),
        '__NAMES__': json.dumps(SH, ensure_ascii=False),
        '__RACE_DATE__': json.dumps(RACE_DATE),
        '__GEO__': json.dumps({'W': W, 'PH': PH}),
        '__TOT__': json.dumps({'km': L, 'up': int(round(up_dn(0, L)[0]))}),
        '__PERT_I__': str(pert),
    }
    for k, v in rep.items():
        assert k in js, k
        js = js.replace(k, v)
    return js

FAVICON = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E"
           "%3Crect width='32' height='32' rx='7' fill='%23111'/%3E"
           "%3Cpath d='M4 23l6-11 5 5 4-9 9 15z' fill='none' stroke='%23ff7043' "
           "stroke-width='2.6' stroke-linejoin='round'/%3E%3C/svg%3E")

def build_html():
    css = open(os.path.join(HERE, 'page.css'), encoding='utf-8').read()
    tabs = "".join(
        '<button type="button" data-t="%s"%s>%s<span>%s</span></button>'
        % (tid, ' aria-current="true"' if i == 0 else '', ICONS[tid], lab)
        for i, (tid, lab) in enumerate(TABS))
    sections = [('suivi', sec_suivi()), ('ravitos', sec_ravitos()), ('nutrition', sec_nutrition()),
                ('briefing', sec_briefing()), ('whatif', sec_whatif()), ('infos', sec_infos())]
    body = "".join('<section id="%s"%s>%s</section>'
                   % (sid, ' class="on"' if i == 0 else '', htmlpart)
                   for i, (sid, htmlpart) in enumerate(sections))
    return """<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow,noarchive,noimageindex">
<meta name="referrer" content="no-referrer">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme:light)">
<meta name="theme-color" content="#171a1e" media="(prefers-color-scheme:dark)">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="UTV 84K">
<meta name="description" content="Page privée — plan de course UTV 84K du 12/09/2026.">
<title>UTV 84K · Mathilde · Plan de course</title>
<link rel="icon" href="%(favicon)s">
<link rel="apple-touch-icon" href="%(favicon)s">
<style>%(css)s</style>
</head>
<body>
<header>
  <div class="brand">
    <div class="brand-t">
      <h1><span class="mk">UTV 84K</span> · Mathilde</h1>
      <span class="sub">Sam. 12/09/2026 · 05h00 · pacing v3 · nutrition v3.4</span>
    </div>
    <button type="button" class="iconbtn" id="btnBig" aria-pressed="false" aria-label="Agrandir le texte" title="Taille du texte">A+</button>
    <button type="button" class="iconbtn" id="btnTheme" aria-label="Thème" title="Thème">%(themeico)s</button>
  </div>
  <button type="button" class="live" aria-label="Aller au prochain point de passage">
    <span class="live-now"><b id="clock" class="num">--:--</b><span>maintenant</span></span>
    <span class="live-main"><span class="l1" id="liveL1"></span><span class="l2" id="liveL2"></span></span>
    <span class="live-go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></span>
  </button>
</header>
%(defs)s
<main>%(body)s
<footer>Page privée · plan de course généré depuis les sources (pacing v3 · nutrition v3.4 du 09/09/2026) · aucune donnée ne quitte cet appareil.</footer>
</main>
<nav class="tabs" role="tablist" aria-label="Sections">%(tabs)s</nav>
<script>%(js)s</script>
</body>
</html>
""" % {'favicon': FAVICON, 'css': css, 'defs': PROFIL_DEFS, 'body': body,
       'tabs': tabs, 'js': js_payload(), 'themeico': THEME_ICONS}

THEME_ICONS = (
  '<span data-th="auto">' + ico('<circle cx="12" cy="12" r="8.4"/><path d="M12 3.6v16.8" '
  'stroke-width="0"/><path d="M12 3.6a8.4 8.4 0 000 16.8z" fill="currentColor" stroke="none"/>') + '</span>'
  '<span data-th="light" style="display:none">' + ico('<circle cx="12" cy="12" r="4.4"/>'
  '<path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4L17 7M7 17l-1.6 1.6"/>') + '</span>'
  '<span data-th="dark" style="display:none">' + ico('<path d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z"/>') + '</span>'
)

if __name__ == '__main__':
    md = build_md()
    open(os.path.join(HERE, 'content_export.md'), 'w', encoding='utf-8').write(md)
    page = build_html()
    open(OUT, 'w', encoding='utf-8').write(page)
    print("UTV26.html %d Ko · content_export.md %d Ko" % (len(page.encode()) // 1024, len(md.encode()) // 1024))
