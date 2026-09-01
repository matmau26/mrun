# Mrun — Site institutionnel

Site internet de l'association **Mrun** (trail running & course nature).

## Structure

```
.
├── index.html                                # Page d'accueil
├── communiques.html                          # Liste des communiqués
├── communiques/
│   └── 2026-04-grand-raid-ventoux.html       # Communiqué Grand Raid du Ventoux
├── matmau.html                               # Page privée (non listée) — plan SaintéSprint
└── assets/
    ├── css/style.css                         # Feuille de style du site
    ├── css/plan.css                          # Feuille de style de la page plan
    ├── js/main.js                            # Interactions (nav, scroll, animations)
    ├── js/plan.js                            # Rendu du plan, des graphiques et de la nav
    ├── js/plan-saintesprint-data.js          # Données du plan (généré depuis le JSON)
    ├── js/plan-comparaison-data.js           # Séries de comparaison v5 vs prépa 2024
    └── data/plan-saintesprint-mm.json        # Source des données du plan
```

## Lancer en local

Site 100% statique. Ouvrir `index.html` dans un navigateur, ou servir le dossier :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Ajouter un communiqué

1. Dupliquer `communiques/2026-04-grand-raid-ventoux.html`
2. Renommer le fichier (`AAAA-MM-slug.html`)
3. Mettre à jour le contenu et l'image de couverture
4. Ajouter une carte dans `communiques.html` et `index.html`

## Page privée — plan d'entraînement

`matmau.html` est un plan d'entraînement personnel (SaintéSprint 2026, version **v5**
— contraintes de septembre intégrées). La page
**n'est liée depuis aucune autre page** du site : elle n'est accessible que par
son URL directe — <https://mrun.vercel.app/matmau.html>.

Elle est aussi marquée `noindex, nofollow` (balise `<meta name="robots">` + en-tête
`X-Robots-Tag` déclaré dans `vercel.json`) pour ne pas remonter dans les moteurs
de recherche. Ce n'est pas une protection par mot de passe : qui a le lien a la page.

Les séances cochées sont stockées dans le `localStorage` du navigateur — rien
n'est envoyé sur un serveur, et la progression est propre à chaque appareil.

### Mettre à jour le plan

1. Remplacer `assets/data/plan-saintesprint-mm.json`
2. Régénérer le fichier JS consommé par la page :

```bash
{ printf 'window.PLAN_SAINTESPRINT = '; cat assets/data/plan-saintesprint-mm.json; printf ';\n'; } \
  > assets/js/plan-saintesprint-data.js
```

La page se réadapte seule : nombre de semaines, totaux, graphique, compte à rebours
et détection de la semaine en cours sont tous calculés depuis les données.

Champs attendus par semaine : `code_semaine` (S1…S14), `semaine_avant_course` (S-13…S0),
`dates_affichage`, `phase`, `focus`, `contraintes` (optionnel), `renforcement`, `velo`,
les totaux, et une liste `seances` (`code`, `type`, `jour_suggere`, `duree_min`,
`intensite`, `km_estimes`, `denivele_m`, `detail_seance`, `element_en_tete`, `autres`).
Une séance dont le `type` contient « vélo » est traitée comme sans impact : km et D+
s'affichent en « — ».

### Cache des ressources

`matmau.html` charge ses ressources avec un jeton de version (`?v=5.1`) et
`vercel.json` les sert en `must-revalidate` : le navigateur revalide à chaque
visite, donc une mise à jour des données est visible sans vider le cache.
Après une modification de `plan.js`, `plan.css` ou d'un fichier de données,
incrémenter le jeton dans `matmau.html` reste la garantie la plus sûre.

### Mettre à jour le comparatif

`assets/js/plan-comparaison-data.js` contient les séries hebdomadaires du plan actuel
et de la préparation 2024 (durée, km, D+). Dans les deux séries : **course finale exclue**
et **course à pied uniquement** — c'est la seule base comparable, et les totaux affichés
dans cette section diffèrent donc volontairement de ceux du plan complet.
