# Mrun — Site institutionnel

Site internet de l'association **Mrun** (trail running & course nature).

## Structure

```
.
├── index.html                                # Page d'accueil
├── communiques.html                          # Liste des communiqués
├── communiques/
│   └── 2026-04-grand-raid-ventoux.html       # Communiqué Grand Raid du Ventoux
└── assets/
    ├── css/style.css                         # Feuille de style
    └── js/main.js                            # Interactions (nav, scroll, animations)
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
