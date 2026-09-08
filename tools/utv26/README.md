# UTV26 — sources de la page privée `UTV26.html`

Page « plan de course » de l'Ultra Trail du Vercors 84K du **samedi 12/09/2026**
(Mathilde), publiée à la racine du site sous `UTV26.html` : non listée dans la
navigation, non indexée (`noindex,nofollow` + `X-Robots-Tag` dans `vercel.json`),
accessible uniquement par son adresse.

## Régénérer la page

```bash
cd tools/utv26
python3 build.py        # -> ../../UTV26.html  +  content_export.md
```

Python 3.8+, **aucune dépendance**. Le HTML produit est autonome : un seul
fichier, zéro requête réseau au chargement (pas de CDN, pas de police web, pas
d'analytics), profil dessiné en SVG inline.

**Ne jamais éditer `UTV26.html` à la main** : toute correction de contenu se
fait dans les sources ci-dessous, puis `python3 build.py`.

## Fichiers

| Fichier | Rôle |
|---|---|
| `build.py` | Générateur : mise en page, graphiques SVG, assemblage du HTML |
| `page.css` | Feuille de style de la page (intégrée au build) |
| `page.js` | Suivi de course, thème, onglets, hors-réseau (intégré au build) |
| `content.py` | **Textes** des onglets Ravitos / Nutrition / Briefing / What if |
| `pacing.json` | 23 points de passage × 5 scénarios (pacing v3 audité le 08/09/2026) |
| `track.json` | Altitudes de la trace officielle `utv26_v4.gpx` tous les 10 m + heures réalistes |
| `content_export.md` | Export Markdown de tout le contenu — pour relire et faire des diffs (généré) |
| `../../utv26-sw.js` | Service worker de la page, portée limitée à `/UTV26.html` |

Les blocs de texte qui ne dépendent pas de `content.py` (les 3 règles, la
lecture rapide aux ravitos, l'onglet Infos, les sources) sont en clair en haut
de la section « textes repris tels quels » de `build.py`.

## Contrôle de non-régression du contenu

`content_export.md` est reproduit **au caractère près** à partir des sources.
Après toute modification de `build.py`, vérifier que seul ce qui devait changer
a changé :

```bash
cd tools/utv26 && cp content_export.md /tmp/avant.md && python3 build.py \
  && diff /tmp/avant.md content_export.md
```

## Cas d'usage prévus

- **Mathieu**, au bord de la route : onglets Suivi et Ravitos. Il saisit l'heure
  réelle à chaque passage connu ; le scénario et l'écart avec le réaliste se
  calculent. Les cases des ravitos se cochent au fur et à mesure.
- **Mathilde**, avant la course : onglets Nutrition, Briefing, What if.
- Saisies, cases et notes sont gardées **sur l'appareil** (`localStorage`, clé
  `utv84k_v3`) : rien n'est envoyé nulle part. Elles sont liées à l'adresse et
  au navigateur — fixer l'URL définitive avant le vendredi 11/09 et faire les
  saisies sur un seul appareil.
- « Copier le suivi (JSON) » met tout dans le presse-papiers ; « Imprimer »
  sort l'onglet affiché (depuis Suivi : le tableau des 23 points, 2 pages A4).

## À mettre à jour après le briefing de l'orga (vendredi 11/09)

Heures réelles des barrières : bloc `INFOS` de `build.py`, `MATHIEU_LOGISTIQUE`
et la carte What if « barrière » de `content.py`, puis `python3 build.py`.

## Vérification avant mise en ligne

1. Ouvrir la page sur le téléphone, saisir une heure sur « SOMMET 1 » puis
   « RAVITO 1 », vérifier le scénario et l'écart, recharger : les valeurs restent.
2. Cocher deux cases dans Ravitos, recharger : elles restent.
3. Mode avion, recharger : la page revient (service worker, stratégie réseau
   d'abord — jamais de version périmée quand il y a du réseau).
4. Bouton Imprimer depuis l'onglet Suivi : 2 pages A4 lisibles.
