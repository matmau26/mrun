window.PLAN_MATHILDE_REPERES = {
  "_meta": {
    "objet": "Bloc « Repères » prêt à coller dans plan-mathilde-data.js — remplace zones_fc et zones_puissance, et ajoute tableau_pilotage.",
    "genere_le": "2026-09-16",
    "corrige": [
      "zones_fc.liste[].bpm : la clé manquait, le gabarit lit z.bpm et affichait « undefined » sur les six zones.",
      "zones_puissance.liste[].watts : la clé manquait, le gabarit lit z.watts || z.puissance et affichait « — ».",
      "zones_puissance : retour au découpage officiel Stryd à 5 zones (la version en ligne affiche encore les 6 zones renumérotées).",
      "Ajout de tableau_pilotage : la fusion allure + FC + puissance + usage demandée."
    ],
    "a_corriger_hors_json": "L'en-tête affiche « Course 29 nov. 2026 ». La course est le samedi 28 nov. 2026 à 23:00 ; le 29 est la fin de la semaine S48 dans le plan. Le gabarit lit vraisemblablement meta.fin au lieu de course.date."
  },

  "tableau_pilotage": {
    "titre": "Tableau de pilotage",
    "note": "Chaque ligne est une intention d'entraînement : c'est le seul objet qui possède à la fois une allure, une FC, une puissance et un usage. Les colonnes « zone » indiquent où l'intention tombe dans chacun des deux référentiels, qui n'ont pas les mêmes frontières.",
    "statut": "CALIBRÉES SUR MESURES RÉELLES",
    "valides_jusqu_au": "2026-11-14",
    "legende_couleur": "La couleur code l'intensité, du plus clair au plus foncé. Deux lignes de même couleur occupent la même zone Stryd.",
    "rampe": {
      "clair": ["#86b6ef", "#3987e5", "#256abf", "#184f95", "#0d366b"],
      "sombre": ["#cde2fb", "#86b6ef", "#3987e5", "#256abf", "#184f95"],
      "note": "Rampe ordinale à une seule teinte, 5 pas, validée en clair et en sombre (monotonie, écart entre pas, contraste sur le fond)."
    },
    "lignes": [
      {
        "cle": "ef", "intention": "EF / footing", "sous_titre": "Endurance fondamentale",
        "allure": "5:30 – 6:00 /km", "allure_note": null,
        "fc": "138 – 155", "fc_note": null,
        "watts": "134 – 152 W", "pct_cp": "75 – 85 %",
        "zone_fc": "Z2", "zone_stryd": "Z1 → Z2", "intensite": 1,
        "seances": "Tous les footings et échauffements. 70 % du volume du bloc."
      },
      {
        "cle": "endurance_active", "intention": "Endurance active", "sous_titre": "Tempo bas",
        "allure": "5:05 – 5:20 /km", "allure_note": null,
        "fc": "156 – 170", "fc_note": null,
        "watts": "152 – 161 W", "pct_cp": "85 – 90 %",
        "zone_fc": "Z3", "zone_stryd": "Z2", "intensite": 2,
        "seances": "Blocs de fin de sortie longue, montées courues."
      },
      {
        "cle": "allure_course", "intention": "Allure SaintéSprint", "sous_titre": "L'allure de la course",
        "allure": "4:52 – 5:00 /km", "allure_note": "5:04 – 5:12 sur le parcours",
        "fc": "176 – 182", "fc_note": "180 tenus 2 h 05 en 2025",
        "watts": "157 – 165 W", "pct_cp": "88 – 92 %",
        "zone_fc": "Z4", "zone_stryd": "Z2 → Z3", "intensite": 2,
        "seances": "Famille C : 3×12', 2×20', 30' en fin de sortie longue."
      },
      {
        "cle": "seuil", "intention": "Seuil", "sous_titre": "Tenable 60 minutes",
        "allure": "4:32 – 4:42 /km", "allure_note": null,
        "fc": "177 – 183", "fc_note": null,
        "watts": "170 – 179 W", "pct_cp": "95 – 100 %",
        "zone_fc": "Z4", "zone_stryd": "Z3", "intensite": 3,
        "seances": "Famille B : 2×8', 2×12', 2×15', séance témoin 3×10'."
      },
      {
        "cle": "allure_10k", "intention": "Allure 10 km", "sous_titre": "~45 minutes d'effort",
        "allure": "4:22 – 4:32 /km", "allure_note": null,
        "fc": "182 – 188", "fc_note": null,
        "watts": "179 – 186 W", "pct_cp": "100 – 104 %",
        "zone_fc": "Z5", "zone_stryd": "Z4", "intensite": 4,
        "seances": "5×800 m, 4×8', test chronométré du 14 novembre."
      },
      {
        "cle": "allure_5k", "intention": "Allure 5 km", "sous_titre": "VMA longue",
        "allure": "4:05 – 4:15 /km", "allure_note": null,
        "fc": "186 – 190", "fc_note": null,
        "watts": "197 – 211 W", "pct_cp": "110 – 118 %",
        "zone_fc": "Z5", "zone_stryd": "Z4", "intensite": 4,
        "seances": "6×500 m."
      },
      {
        "cle": "vma_courte", "intention": "VMA courte", "sous_titre": "Travail de foulée",
        "allure": "3:48 – 4:00 /km", "allure_note": null,
        "fc": "libre", "fc_note": "elle n'a pas le temps de monter",
        "watts": "215 – 233 W", "pct_cp": "120 – 130 %",
        "zone_fc": "Z6", "zone_stryd": "Z5", "intensite": 5,
        "seances": "30/30, 40/40, 200 m, lignes droites."
      }
    ],
    "avertissement": "Allure course et seuil partagent presque la même fréquence cardiaque, et c'est normal : sur 24 km elle court à sa FC de seuil — 180 de moyenne pendant 2 h 05 en 2025, soit 97 % de son LTHR. Ce qui sépare ces deux lignes, c'est l'allure (20 s/km) et la durée des blocs, pas la FC. Piloter la course à la fréquence cardiaque seule la ferait courir trop lentement."
  },

  "zones_fc": {
    "base": "LTHR estimé 185 (fourchette 183-188). Zones calées sur le LTHR et vérifiées contre 62 séances réelles depuis le 01/06/2026.",
    "alerte": "Les zones affichées PAR LA MONTRE sont fausses : elles sont calées sur une FC de repos de 73 bpm et une FCmax de 190 renseignée par défaut. Ce sont ces zones-ci qui font foi.",
    "a_saisir_dans_garmin": [
      { "champ": "FC de repos", "actuel": 73, "a_mettre": 58 },
      { "champ": "FC au seuil lactique", "actuel": 177, "a_mettre": 185 },
      { "champ": "FC maximale", "actuel": 190, "a_mettre": 190, "note": "Correcte, ne pas y toucher." },
      { "champ": "Affichage des zones", "a_mettre": "BPM", "note": "Plutôt que % FC max ou % RFC : les bornes deviennent exactement celles du plan." }
    ],
    "liste": [
      { "zone": "Z1", "nom": "Récupération", "bpm": "120 – 137", "min": 120, "max": 137, "pct_lthr": "65 – 74 %", "intensite": 1, "usage": "Décrassage, retour au calme" },
      { "zone": "Z2", "nom": "Endurance fondamentale", "bpm": "138 – 155", "min": 138, "max": 155, "pct_lthr": "75 – 84 %", "intensite": 1, "usage": "Tous les footings — 70 % du volume" },
      { "zone": "Z3", "nom": "Endurance active", "bpm": "156 – 170", "min": 156, "max": 170, "pct_lthr": "84 – 92 %", "intensite": 2, "usage": "Blocs de fin de sortie longue, montées courues" },
      { "zone": "Z4", "nom": "Allure course / seuil bas", "bpm": "171 – 183", "min": 171, "max": 183, "pct_lthr": "92 – 99 %", "intensite": 3, "usage": "Séances type C, blocs de seuil 2×15', 3×12'" },
      { "zone": "Z5", "nom": "Seuil haut / allure 10 km", "bpm": "184 – 190", "min": 184, "max": 190, "pct_lthr": "99 – 103 %", "intensite": 4, "usage": "4×8', 3×2 km, test du 14/11" },
      { "zone": "Z6", "nom": "VMA", "bpm": "libre", "min": null, "max": null, "pct_lthr": "—", "intensite": 5, "usage": "30/30, 200 m, côtes courtes" }
    ]
  },

  "zones_puissance": {
    "base": "CP Stryd 179 W (màj 12/08/2026), 3,81 W/kg pour 47 kg.",
    "referentiel": "Zones officielles Stryd, 5 zones en % de la Critical Power. C'est ce qu'affichent l'application Stryd et le champ de données de la montre. Aucune renumérotation propre au plan.",
    "alerte": "Ne jamais utiliser la puissance affichée dans Garmin Connect : c'est la puissance native Garmin, pas Stryd. Sur l'UTV elle affiche 169 W quand le Stryd lit 108 W. Les zones de puissance course dans Garmin (FTP 237 W) sont à ignorer, pas à corriger.",
    "alerte_donnees": "Aucune donnée Stryd ne figure dans l'export RGPD. Le CP de 179 W est déclaratif et les bandes sont des % de CP. À recaler sur les fichiers PowerCenter avant la S42 — sinon, retirer la puissance du pilotage et ne garder que FC et allure.",
    "liste": [
      { "zone": "Z1", "nom": "Facile", "pct_cp": "65 – 80 %", "watts": "116 – 143", "min_w": 116, "max_w": 143, "w_kg": "2,47 – 3,04", "intensite": 1, "usage": "Footings faciles, sorties longues, volume de base" },
      { "zone": "Z2", "nom": "Modéré", "pct_cp": "80 – 90 %", "watts": "143 – 161", "min_w": 143, "max_w": 161, "w_kg": "3,04 – 3,43", "intensite": 2, "usage": "Tempo et simulation d'allure course" },
      { "zone": "Z3", "nom": "Seuil", "pct_cp": "90 – 100 %", "watts": "161 – 179", "min_w": 161, "max_w": 179, "w_kg": "3,43 – 3,81", "intensite": 3, "usage": "Intervalles longs, blocs de seuil, séances 10 km" },
      { "zone": "Z4", "nom": "Intervalle", "pct_cp": "100 – 115 %", "watts": "179 – 206", "min_w": 179, "max_w": 206, "w_kg": "3,81 – 4,38", "intensite": 4, "usage": "Intervalles, travail 5 km" },
      { "zone": "Z5", "nom": "Répétition", "pct_cp": "115 % +", "watts": "206 +", "min_w": 206, "max_w": null, "w_kg": "4,38 +", "intensite": 5, "usage": "Intervalles courts, sprints, piste rapide" }
    ]
  }
}
;
