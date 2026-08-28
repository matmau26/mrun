/* Données du plan SaintéSprint 2026 — Mathieu · v5 (contraintes de septembre intégrées)
   Généré depuis assets/data/plan-saintesprint-mm.json — voir README. */
window.PLAN_SAINTESPRINT = {
  "meta": {
    "titre": "Plan SaintéSprint 2026 — Mathieu · v5 (plan en durée, contraintes septembre intégrées)",
    "course": {
      "nom": "SaintéSprint (SaintéLyon format 24 km)",
      "date": "2026-11-28",
      "depart": "soir (course de nuit)",
      "distance_km": 24,
      "denivele_m": 500,
      "objectif_temps": "~3h00",
      "allure_cible": "7:15–7:30/km"
    },
    "athlete": {
      "prenom": "Mathieu",
      "fc_max": 197,
      "fc_repos": 49,
      "lthr": 173,
      "cadence_cible_ppm": 178,
      "zones_fc": {
        "Z1": {
          "min": 100,
          "max": 119,
          "usage": "Récupération, échauffement"
        },
        "Z2": {
          "min": 120,
          "max": 141,
          "usage": "Endurance fondamentale — footings & longues"
        },
        "Z3": {
          "min": 142,
          "max": 155,
          "usage": "Tempo / allure course"
        },
        "Z4": {
          "min": 156,
          "max": 176,
          "usage": "Seuil / côtes — cap 20–30 min cumulées/séance"
        },
        "Z5": {
          "min": 177,
          "max": 197,
          "usage": "Sprints de côte 8–10\" uniquement"
        }
      },
      "allures": {
        "EF": "7:15–7:45/km",
        "seuil_Z3": "6:20–6:40/km",
        "seuil_Z3Z4": "6:10–6:30/km",
        "allure_course": "7:15–7:30/km"
      }
    },
    "codification": {
      "format": "S{numero_semaine_plan}-{numero_seance:02d}",
      "exemple": "S1-03 = 1re semaine du plan, 3e séance",
      "note": "numero_semaine_plan va de 1 (24–30 août) à 14 (semaine de course)"
    },
    "regles_transverses": [
      "Douleur osseuse ou genou qui augmente à l'effort = STOP immédiat + kiné",
      "Plan piloté en DURÉE : si tu accélères, tu écourtes d'autant",
      "Côtes sur pente ≤10% uniquement (sauf sprints 8–10\")",
      "Descentes raides marchées, D− compté séparément",
      "Cadence cible 178 ppm (protocole métronome S1–S2)",
      "≥1 jour entre 2 courses, ≥48 h entre séance qualité et sortie longue",
      "Le facile doit être VRAIMENT facile (Z2, <142 bpm)",
      "Décharges à respecter sans combler",
      "HRV/sommeil à lire en tendance 7 jours",
      "Séance manquée = séance perdue : on ne rattrape jamais, on reprend le fil",
      "JAMAIS deux jours de course consécutifs : si la sortie longue tombe le dimanche, la 1re séance de la semaine suivante démarre au plus tôt le MARDI (ou lundi en vélo/repos)",
      "Une séance de qualité (côtes, seuil, allure) ne se place jamais à moins de 48 h d'une sortie longue, avant comme après"
    ],
    "indisponibilites": [
      {
        "periode": "ven. 4/09 après-midi → sam. 5/09 midi",
        "motif": "Soirée d'entreprise (alcool)",
        "impact": "Semaine S2 : longue décalée au dim. 6"
      },
      {
        "periode": "mer. 9/09 matin → jeu. 10/09 soir",
        "motif": "Déplacement sans temps libre",
        "impact": "Semaine S3 : 2 jours perdus"
      },
      {
        "periode": "ven. 11/09 fin de journée → dim. 13/09",
        "motif": "Vercors — assistance Mathilde (UTV 84K)",
        "impact": "Semaine S3 : week-end perdu, pas de sortie longue"
      },
      {
        "periode": "ven. 18/09 → lun. 21/09",
        "motif": "EVG Belgrade — aucun sport, programme épuisant",
        "impact": "Semaine S4 tronquée (déjà décharge) + semaine S5 en ré-entrée"
      }
    ],
    "totaux": {
      "heures": 44.8,
      "km_estimes": 327.3,
      "denivele_m": 6810,
      "semaines": 14,
      "seances": 42
    },
    "genere_le": "2026-08-25",
    "version": "v5"
  },
  "semaines": [
    {
      "code_semaine": "S1",
      "numero_semaine_plan": 1,
      "semaine_avant_course": "S-13",
      "semaine_annee": "W35",
      "date_debut": "2026-08-24",
      "dates_affichage": "24–30 août 2026",
      "phase": "Spécifique 1",
      "focus": "Entrée dans le spécifique. Priorité : cadence + zéro douleur.",
      "contraintes": null,
      "renforcement": "×2 : kiné 30' (pied/cheville/genou) + maison 15' (charges progressives, pliométrie légère)",
      "velo": "45–60' Z1–Z2 optionnel",
      "temps_total_min": 195,
      "km_estimes_total": 24.8,
      "denivele_total_m": 450,
      "seances": [
        {
          "code": "S1-01",
          "numero": 1,
          "type": "EF",
          "jour_suggere": "mar. ou mer.",
          "duree_min": 40,
          "intensite": {
            "zone": "Z12",
            "detail": "Z1–Z2 (100–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 5.3,
          "denivele_m": 30,
          "detail_seance": "Footing continu Z2, aisance totale. PROTOCOLE CADENCE : métronome/montre 178 ppm + consigne « atterrir doux ».",
          "element_en_tete": "C'est la durée qui compte, pas les km. Si tu accélères, tu écourtes.",
          "autres": "Semaine 1/2 du protocole cadence (Chan 2018 : −62% blessures)"
        },
        {
          "code": "S1-02",
          "numero": 2,
          "type": "Côtes courtes",
          "jour_suggere": "jeu. ou ven.",
          "duree_min": 50,
          "intensite": {
            "zone": "Z4",
            "detail": "Z4 (156–176 bpm)",
            "allure_cible": "effort en côte — allure non pertinente"
          },
          "km_estimes": 6.5,
          "denivele_m": 150,
          "detail_seance": "Échauffement 15' EF Z1–Z2 + 3 éducatifs → 6×30–45\" en côte pente 6–10%, effort Z4, récup descente trottée lente ~2' → 4 sprints de côte 8–10\", récup marchée 2' → Retour au calme 10' Z1.",
          "element_en_tete": "Côtes en souplesse, buste droit. Jamais >10% sur les répétitions longues (charge tibiale interne).",
          "autres": null
        },
        {
          "code": "S1-03",
          "numero": 3,
          "type": "Sortie longue",
          "jour_suggere": "sam. ou dim.",
          "duree_min": 105,
          "intensite": {
            "zone": "Z2",
            "detail": "Z2 (120–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 13,
          "denivele_m": 270,
          "detail_seance": "Trail facile Z2 continue. Descentes raides marchées. Boire 500–750 ml (600–1000 ml/h si >25°C).",
          "element_en_tete": "Terrain souple si possible. Marche-course légitime dans les montées.",
          "autres": "≥48 h après la séance de côtes"
        }
      ]
    },
    {
      "code_semaine": "S2",
      "numero_semaine_plan": 2,
      "semaine_avant_course": "S-12",
      "semaine_annee": "W36",
      "date_debut": "2026-08-31",
      "dates_affichage": "31 août – 6 sept. 2026",
      "phase": "Spécifique 1",
      "focus": "Première touche de seuil. Séances à caler AVANT la soirée d'entreprise.",
      "contraintes": "⚠ Soirée d'entreprise avec alcool : ven. 4/09 après-midi → sam. 5/09 midi. Les 2 premières séances se placent lun.–jeu., la longue passe au DIMANCHE 6.",
      "renforcement": "×2 : kiné 30' + maison 15'",
      "velo": "45–60' Z1–Z2 optionnel",
      "temps_total_min": 205,
      "km_estimes_total": 25.8,
      "denivele_total_m": 500,
      "seances": [
        {
          "code": "S2-01",
          "numero": 1,
          "type": "EF",
          "jour_suggere": "lun. 31 ou mar. 1er",
          "duree_min": 40,
          "intensite": {
            "zone": "Z12",
            "detail": "Z1–Z2 (100–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 5.3,
          "denivele_m": 30,
          "detail_seance": "Footing continu Z2. Semaine 2/2 du protocole cadence (métronome 178).",
          "element_en_tete": "Dernière semaine avec métronome, ensuite c'est acquis.",
          "autres": null
        },
        {
          "code": "S2-02",
          "numero": 2,
          "type": "Seuil (dose d'entrée)",
          "jour_suggere": "mer. 2 ou jeu. 3",
          "duree_min": 50,
          "intensite": {
            "zone": "Z3",
            "detail": "Z3 (142–155 bpm)",
            "allure_cible": "≈6:20–6:40/km"
          },
          "km_estimes": 6.5,
          "denivele_m": 60,
          "detail_seance": "Échauffement 15' EF + 3 lignes droites → 2×7' au seuil Z3 (145–155), allure ≈6:20–6:40/km, récup 3' trot → Retour au calme 10' Z1.",
          "element_en_tete": "14' cumulées = dose d'entrée volontairement basse. Ne pas en rajouter.",
          "autres": "À faire mer. 2 ou jeu. 3 — avant la soirée"
        },
        {
          "code": "S2-03",
          "numero": 3,
          "type": "Sortie longue",
          "jour_suggere": "dim. 6",
          "duree_min": 115,
          "intensite": {
            "zone": "Z2",
            "detail": "Z2 (120–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 14,
          "denivele_m": 410,
          "detail_seance": "Z2 continue, trail roulant à vallonné. Descentes raides marchées.",
          "element_en_tete": "Alcool + nuit courte vendredi : si les sensations sont mauvaises dimanche, réduire à 1h30 sans culpabiliser.",
          "autres": "Décalée au dim. 6 (samedi indisponible)"
        }
      ]
    },
    {
      "code_semaine": "S3",
      "numero_semaine_plan": 3,
      "semaine_avant_course": "S-11",
      "semaine_annee": "W37",
      "date_debut": "2026-09-07",
      "dates_affichage": "7–13 sept. 2026",
      "phase": "Spécifique 1 · ALLÉGÉE (contraintes)",
      "focus": "Semaine comprimée : 3 créneaux, pas de sortie longue possible. Lundi en vélo pour ne pas enchaîner deux jours de course après la longue du dim. 6. On protège, on ne rattrape pas.",
      "contraintes": "⚠ Déplacement sans temps libre : mer. 9/09 matin → jeu. 10/09 soir. ⚠ Vercors (assistance Mathilde, UTV 84K) : ven. 11/09 fin de journée → dim. 13/09. Créneaux réels : lun. 7, mar. 8, ven. 11 en journée. ⚠ La longue de S2 tombant le dim. 6, le lundi 7 passe en VÉLO (sans impact) : pas de course deux jours de suite.",
      "renforcement": "×1 suffit cette semaine (kiné 30', à coupler au vélo du lun. 7)",
      "velo": "intégré comme séance 1 (lun. 7)",
      "temps_total_min": 175,
      "km_estimes_total": 15.5,
      "denivele_total_m": 440,
      "seances": [
        {
          "code": "S3-01",
          "numero": 1,
          "type": "Vélo récup (sans impact)",
          "jour_suggere": "lun. 7",
          "duree_min": 50,
          "intensite": {
            "zone": "Z12",
            "detail": "Z1–Z2 (100–141 bpm)",
            "allure_cible": "vélo — Z1–Z2, pas de mesure d'allure"
          },
          "km_estimes": 0,
          "denivele_m": 0,
          "detail_seance": "45–60' de vélo très facile Z1–Z2. AUCUN impact au sol : c'est le lendemain de ta sortie longue du dim. 6.",
          "element_en_tete": "Remplace volontairement un footing : deux jours de course consécutifs = à éviter (la mécanosensibilité osseuse ne revient qu'après ~24 h de repos). Si fatigue : repos complet.",
          "autres": "Le vélo sert d'espaceur : il maintient l'aérobie sans charger le tibia"
        },
        {
          "code": "S3-02",
          "numero": 2,
          "type": "Côtes",
          "jour_suggere": "mar. 8",
          "duree_min": 50,
          "intensite": {
            "zone": "Z4",
            "detail": "Z4 (156–176 bpm)",
            "allure_cible": "effort en côte — allure non pertinente"
          },
          "km_estimes": 6.5,
          "denivele_m": 150,
          "detail_seance": "Échauffement 15' EF + éducatifs → 7×45\" en côte 6–10%, effort Z4, récup descente trottée lente → 3 sprints de côte 8–10\" → Retour au calme 10' Z1.",
          "element_en_tete": "Séance clé de la semaine, placée à 48 h de la longue du dim. 6 (délai minimum respecté).",
          "autres": null
        },
        {
          "code": "S3-03",
          "numero": 3,
          "type": "Sortie mi-longue",
          "jour_suggere": "ven. 11 matin",
          "duree_min": 75,
          "intensite": {
            "zone": "Z2",
            "detail": "Z2 (120–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 9,
          "denivele_m": 290,
          "detail_seance": "1h15 en Z2 sur terrain vallonné. Remplace la sortie longue (week-end indisponible).",
          "element_en_tete": "Le week-end Vercors = beaucoup d'heures debout + nuit blanche : c'est une charge réelle, sans bénéfice d'entraînement. Ne rien ajouter après.",
          "autres": "Ven. 11 en matinée/midi, AVANT le départ pour le Vercors"
        }
      ]
    },
    {
      "code_semaine": "S4",
      "numero_semaine_plan": 4,
      "semaine_avant_course": "S-10",
      "semaine_annee": "W38",
      "date_debut": "2026-09-14",
      "dates_affichage": "14–20 sept. 2026",
      "phase": "DÉCHARGE (renforcée)",
      "focus": "DÉCHARGE. Récupération du week-end Vercors, puis coupure EVG. Tombe idéalement dans le calendrier.",
      "contraintes": "⚠ EVG à Belgrade : ven. 18/09 → lun. 21/09, aucun sport possible, programme épuisant. Créneaux réels : mar. 15 → jeu. 17 (lun. 14 = repos, récup du Vercors). Vélo intercalé mer. 16 pour ne pas courir 3 jours de suite.",
      "renforcement": "allégé : kiné 30' + mobilité 10'",
      "velo": "option très facile",
      "temps_total_min": 160,
      "km_estimes_total": 13.8,
      "denivele_total_m": 280,
      "seances": [
        {
          "code": "S4-01",
          "numero": 1,
          "type": "EF récup",
          "jour_suggere": "mar. 15",
          "duree_min": 40,
          "intensite": {
            "zone": "Z12",
            "detail": "Z1–Z2 (100–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 5.3,
          "denivele_m": 30,
          "detail_seance": "Footing très lent Z1–Z2, terrain plat + 4 lignes droites en fin.",
          "element_en_tete": "Lundi 14 = repos complet (retour du Vercors, nuit blanche). Démarrer mardi.",
          "autres": null
        },
        {
          "code": "S4-02",
          "numero": 2,
          "type": "Vélo (espaceur sans impact)",
          "jour_suggere": "mer. 16",
          "duree_min": 50,
          "intensite": {
            "zone": "Z12",
            "detail": "Z1–Z2 (100–141 bpm)",
            "allure_cible": "vélo — Z1–Z2, pas de mesure d'allure"
          },
          "km_estimes": 0,
          "denivele_m": 0,
          "detail_seance": "45–60' vélo facile Z1–Z2. Intercalé pour éviter 3 jours de course consécutifs sur une semaine à créneaux serrés.",
          "element_en_tete": "Optionnel : si la fatigue du Vercors persiste, repos complet.",
          "autres": null
        },
        {
          "code": "S4-03",
          "numero": 3,
          "type": "Sortie courte",
          "jour_suggere": "jeu. 17",
          "duree_min": 70,
          "intensite": {
            "zone": "Z2",
            "detail": "Z2 (120–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 8.5,
          "denivele_m": 250,
          "detail_seance": "1h10 tranquille, terrain facile. Dernière séance avant la coupure.",
          "element_en_tete": "NE PAS combler la semaine : décharge + EVG = 2 stress à absorber, c'est déjà assez.",
          "autres": "À faire jeu. 17 (ven. 18 = départ Belgrade)"
        }
      ]
    },
    {
      "code_semaine": "S5",
      "numero_semaine_plan": 5,
      "semaine_avant_course": "S-9",
      "semaine_annee": "W39",
      "date_debut": "2026-09-21",
      "dates_affichage": "21–27 sept. 2026",
      "phase": "REPRISE post-EVG",
      "focus": "Semaine de RÉ-ENTRÉE, pas de charge. 4 jours d'EVG = dette de sommeil + alcool : la récupération passe avant.",
      "contraintes": "⚠ Retour de Belgrade lun. 21/09 : journée de repos complet obligatoire. Reprise progressive à partir de mardi 22.",
      "renforcement": "×2 : kiné 30' + maison 15' (à partir de mer.)",
      "velo": "45–60' très facile, option",
      "temps_total_min": 180,
      "km_estimes_total": 23.1,
      "denivele_total_m": 460,
      "seances": [
        {
          "code": "S5-01",
          "numero": 1,
          "type": "EF très facile",
          "jour_suggere": "mar. 22 ou mer. 23",
          "duree_min": 35,
          "intensite": {
            "zone": "Z12",
            "detail": "Z1–Z2 (100–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 4.6,
          "denivele_m": 20,
          "detail_seance": "Footing bas de Z2, voire Z1. Aucune ambition.",
          "element_en_tete": "Si la fatigue est forte (HRV basse, jambes lourdes), remplacer par 30' de marche ou repos.",
          "autres": "Aucune séance de qualité cette semaine : c'est volontaire"
        },
        {
          "code": "S5-02",
          "numero": 2,
          "type": "EF + lignes",
          "jour_suggere": "jeu. 24 ou ven. 25",
          "duree_min": 45,
          "intensite": {
            "zone": "Z12",
            "detail": "Z1–Z2 (100–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 6,
          "denivele_m": 40,
          "detail_seance": "Footing Z2 + 5 lignes droites (15–20\", récup complète).",
          "element_en_tete": "Les lignes réveillent la foulée sans charge métabolique.",
          "autres": null
        },
        {
          "code": "S5-03",
          "numero": 3,
          "type": "Sortie longue",
          "jour_suggere": "dim. 27",
          "duree_min": 100,
          "intensite": {
            "zone": "Z2",
            "detail": "Z2 (120–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 12.5,
          "denivele_m": 400,
          "detail_seance": "1h40 en Z2, trail roulant. Volontairement SOUS ta longue du 6 sept. (1h55).",
          "element_en_tete": "Retour à une durée déjà tolérée, pas une progression. Si mauvaises sensations : 1h15 suffit.",
          "autres": "≥48 h après la 2e séance"
        }
      ]
    },
    {
      "code_semaine": "S6",
      "numero_semaine_plan": 6,
      "semaine_avant_course": "S-8",
      "semaine_annee": "W40",
      "date_debut": "2026-09-28",
      "dates_affichage": "28 sept. – 4 oct. 2026",
      "phase": "Spécifique 2",
      "focus": "Vraie reprise du spécifique. Premier bloc propre depuis 4 semaines.",
      "contraintes": null,
      "renforcement": "×2 : kiné 30' + maison 15'",
      "velo": "45–60' Z1–Z2 optionnel",
      "temps_total_min": 210,
      "km_estimes_total": 26.5,
      "denivele_total_m": 670,
      "seances": [
        {
          "code": "S6-01",
          "numero": 1,
          "type": "EF",
          "jour_suggere": "lun. ou mar.",
          "duree_min": 45,
          "intensite": {
            "zone": "Z12",
            "detail": "Z1–Z2 (100–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 6,
          "denivele_m": 40,
          "detail_seance": "Footing continu Z2.",
          "element_en_tete": "Si la fatigue de septembre traîne encore, rester sur les volumes de S-9 une semaine de plus.",
          "autres": null
        },
        {
          "code": "S6-02",
          "numero": 2,
          "type": "Côtes longues",
          "jour_suggere": "mer. ou jeu.",
          "duree_min": 55,
          "intensite": {
            "zone": "Z4",
            "detail": "Z4 (156–176 bpm)",
            "allure_cible": "effort en côte — allure non pertinente"
          },
          "km_estimes": 7,
          "denivele_m": 200,
          "detail_seance": "Échauffement 15' EF → 5×2' en côte 6–10%, effort Z4 régulier (pas de sprint), récup = descente MARCHÉE → Retour au calme 10' Z1.",
          "element_en_tete": "Descente marchée obligatoire : c'est la montée qu'on travaille, pas l'excentrique.",
          "autres": null
        },
        {
          "code": "S6-03",
          "numero": 3,
          "type": "Sortie longue",
          "jour_suggere": "sam. ou dim.",
          "duree_min": 110,
          "intensite": {
            "zone": "Z2",
            "detail": "Z2 (120–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 13.5,
          "denivele_m": 430,
          "detail_seance": "1h50 trail avec D+. Descentes contrôlées.",
          "element_en_tete": "Progression douce : +10% vs la longue de S-9.",
          "autres": "Compteur D− : si >400 m de descente courue, marche davantage"
        }
      ]
    },
    {
      "code_semaine": "S7",
      "numero_semaine_plan": 7,
      "semaine_avant_course": "S-7",
      "semaine_annee": "W41",
      "date_debut": "2026-10-05",
      "dates_affichage": "5–11 oct. 2026",
      "phase": "Spécifique 2",
      "focus": "Montée du seuil + première longue de nuit.",
      "contraintes": null,
      "renforcement": "×2 : kiné 30' + maison 15'",
      "velo": "45–60' Z1–Z2 optionnel",
      "temps_total_min": 225,
      "km_estimes_total": 28,
      "denivele_total_m": 680,
      "seances": [
        {
          "code": "S7-01",
          "numero": 1,
          "type": "EF de nuit (frontale)",
          "jour_suggere": "lun. ou mar.",
          "duree_min": 45,
          "intensite": {
            "zone": "Z12",
            "detail": "Z1–Z2 (100–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 6,
          "denivele_m": 40,
          "detail_seance": "Footing Z2, départ à la tombée de la nuit, terrain connu : premier test frontale.",
          "element_en_tete": "Objectif : s'habituer à la lumière, pas performer.",
          "autres": null
        },
        {
          "code": "S7-02",
          "numero": 2,
          "type": "Seuil",
          "jour_suggere": "mer. ou jeu.",
          "duree_min": 55,
          "intensite": {
            "zone": "Z34",
            "detail": "Z3–Z4 (150–165 bpm)",
            "allure_cible": "≈6:10–6:30/km"
          },
          "km_estimes": 7,
          "denivele_m": 60,
          "detail_seance": "Échauffement 15' EF + 3 lignes → 3×7' seuil Z3–Z4 (150–165), récup 3' trot → Retour au calme 10' Z1.",
          "element_en_tete": "21' cumulées : montée de dose contrôlée (cap 20–30').",
          "autres": null
        },
        {
          "code": "S7-03",
          "numero": 3,
          "type": "Sortie longue NUIT",
          "jour_suggere": "sam. ou dim.",
          "duree_min": 125,
          "intensite": {
            "zone": "Z2",
            "detail": "Z2 (120–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 15,
          "denivele_m": 580,
          "detail_seance": "2h05 trail de nuit complet : frontale, tenue, repères, nutrition. Z2 strict.",
          "element_en_tete": "Checklist : frontale chargée + secours, tour de cou, gants fins, flasque sous la veste.",
          "autres": "≥48 h après le seuil"
        }
      ]
    },
    {
      "code_semaine": "S8",
      "numero_semaine_plan": 8,
      "semaine_avant_course": "S-6",
      "semaine_annee": "W42",
      "date_debut": "2026-10-12",
      "dates_affichage": "12–18 oct. 2026",
      "phase": "DÉCHARGE",
      "focus": "DÉCHARGE −33%. Refaire le test de sudation + sodium.",
      "contraintes": null,
      "renforcement": "allégé : kiné 30' + mobilité 10'",
      "velo": "option, facile uniquement",
      "temps_total_min": 150,
      "km_estimes_total": 18.9,
      "denivele_total_m": 350,
      "seances": [
        {
          "code": "S8-01",
          "numero": 1,
          "type": "EF récup",
          "jour_suggere": "lun. ou mar.",
          "duree_min": 35,
          "intensite": {
            "zone": "Z12",
            "detail": "Z1–Z2 (100–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 4.6,
          "denivele_m": 20,
          "detail_seance": "Footing très lent.",
          "element_en_tete": "Régénération.",
          "autres": null
        },
        {
          "code": "S8-02",
          "numero": 2,
          "type": "Footing + lignes",
          "jour_suggere": "mer. ou jeu.",
          "duree_min": 40,
          "intensite": {
            "zone": "Z12",
            "detail": "Z1–Z2 (100–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 5.3,
          "denivele_m": 40,
          "detail_seance": "Footing Z1–Z2 + 4 lignes droites.",
          "element_en_tete": null,
          "autres": null
        },
        {
          "code": "S8-03",
          "numero": 3,
          "type": "Sortie longue courte",
          "jour_suggere": "sam. ou dim.",
          "duree_min": 75,
          "intensite": {
            "zone": "Z2",
            "detail": "Z2 (120–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 9,
          "denivele_m": 290,
          "detail_seance": "1h15 souple.",
          "element_en_tete": "TEST DE SUDATION : pesée nu avant/après (acclimatation été retombée → valeurs représentatives de novembre).",
          "autres": null
        }
      ]
    },
    {
      "code_semaine": "S9",
      "numero_semaine_plan": 9,
      "semaine_avant_course": "S-5",
      "semaine_annee": "W43",
      "date_debut": "2026-10-19",
      "dates_affichage": "19–25 oct. 2026",
      "phase": "Spécifique 3",
      "focus": "Spécificité maximale : allure cible + nuit + tenue.",
      "contraintes": null,
      "renforcement": "×2 : kiné 30' + maison 15'",
      "velo": "45–60' Z1–Z2 optionnel",
      "temps_total_min": 230,
      "km_estimes_total": 28.3,
      "denivele_total_m": 700,
      "seances": [
        {
          "code": "S9-01",
          "numero": 1,
          "type": "EF de nuit",
          "jour_suggere": "lun. ou mar.",
          "duree_min": 40,
          "intensite": {
            "zone": "Z12",
            "detail": "Z1–Z2 (100–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 5.3,
          "denivele_m": 30,
          "detail_seance": "Footing Z2 de nuit.",
          "element_en_tete": "Entretien de l'habitude nocturne.",
          "autres": null
        },
        {
          "code": "S9-02",
          "numero": 2,
          "type": "Allure course",
          "jour_suggere": "mer. ou jeu.",
          "duree_min": 55,
          "intensite": {
            "zone": "Z3",
            "detail": "Z3 (142–155 bpm)",
            "allure_cible": "≈7:15–7:30/km"
          },
          "km_estimes": 7,
          "denivele_m": 100,
          "detail_seance": "Échauffement 15' EF → 2×15' à allure course (Z3 142–155, ≈7:15–7:30/km) sur terrain vallonné similaire course, récup 5' trot → Retour au calme 10' Z1.",
          "element_en_tete": "30' cumulées à allure cible : LA séance de calibration. Note sensations et FC moyenne des blocs.",
          "autres": "Placée après décharge = fraîcheur maximale"
        },
        {
          "code": "S9-03",
          "numero": 3,
          "type": "Sortie longue nuit",
          "jour_suggere": "sam. ou dim.",
          "duree_min": 135,
          "intensite": {
            "zone": "Z2",
            "detail": "Z2 (120–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 16,
          "denivele_m": 570,
          "detail_seance": "2h15 de nuit avec D+, tenue course complète (test n°2).",
          "element_en_tete": "Valider : flasque sous la veste, gestion zip/bonnet (ventiler AVANT de transpirer).",
          "autres": null
        }
      ]
    },
    {
      "code_semaine": "S10",
      "numero_semaine_plan": 10,
      "semaine_avant_course": "S-4",
      "semaine_annee": "W44",
      "date_debut": "2026-10-26",
      "dates_affichage": "26 oct. – 1 nov. 2026",
      "phase": "PIC",
      "focus": "SEMAINE PIC (4h05). Après : décrue monotone jusqu'à la course.",
      "contraintes": null,
      "renforcement": "×2 : kiné 30' + maison 15'",
      "velo": "45–60' Z1–Z2 optionnel",
      "temps_total_min": 245,
      "km_estimes_total": 30.3,
      "denivele_total_m": 800,
      "seances": [
        {
          "code": "S10-01",
          "numero": 1,
          "type": "EF",
          "jour_suggere": "lun. ou mar.",
          "duree_min": 40,
          "intensite": {
            "zone": "Z12",
            "detail": "Z1–Z2 (100–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 5.3,
          "denivele_m": 30,
          "detail_seance": "Footing continu Z2.",
          "element_en_tete": null,
          "autres": null
        },
        {
          "code": "S10-02",
          "numero": 2,
          "type": "Mix côtes + seuil",
          "jour_suggere": "mer. ou jeu.",
          "duree_min": 55,
          "intensite": {
            "zone": "Z4",
            "detail": "Z4 (156–176 bpm)",
            "allure_cible": "effort en côte — allure non pertinente / ≈6:20–6:40/km"
          },
          "km_estimes": 7,
          "denivele_m": 120,
          "detail_seance": "Échauffement 15' EF → 4×1' côte 6–10% (Z4), récup descente marchée → 5' trot → 2×8' seuil Z3 (145–155), récup 3' → Retour au calme 10' Z1.",
          "element_en_tete": "Séance combinée = rappel des deux qualités avant la générale.",
          "autres": null
        },
        {
          "code": "S10-03",
          "numero": 3,
          "type": "RÉPÉTITION GÉNÉRALE",
          "jour_suggere": "sam. 31 ou dim. 1er",
          "duree_min": 150,
          "intensite": {
            "zone": "Z2",
            "detail": "Z2 (120–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 18,
          "denivele_m": 650,
          "detail_seance": "2h30 MAX, de nuit, protocole jour J complet : tenue définitive, frontale, nutrition course (1 prise/40–45'), hydratation 300–500 ml/h, départ légèrement frileux. Dernière VRAIE longue de la prépa.",
          "element_en_tete": "83% du temps de course cible = plafond littérature. On ne dépasse pas, même en forme.",
          "autres": "S-4 = marge osseuse (un souci se déclarerait à S-2/S-1, gérable). Férié le 1er nov."
        }
      ]
    },
    {
      "code_semaine": "S11",
      "numero_semaine_plan": 11,
      "semaine_avant_course": "S-3",
      "semaine_annee": "W45",
      "date_debut": "2026-11-02",
      "dates_affichage": "2–8 nov. 2026",
      "phase": "Pré-affûtage",
      "focus": "Pré-affûtage : seconde longue à 70%, intensité conservée.",
      "contraintes": null,
      "renforcement": "×2 : kiné 30' + maison 15'",
      "velo": "45–60' Z1–Z2 optionnel",
      "temps_total_min": 195,
      "km_estimes_total": 24.8,
      "denivele_total_m": 500,
      "seances": [
        {
          "code": "S11-01",
          "numero": 1,
          "type": "EF",
          "jour_suggere": "lun. ou mar.",
          "duree_min": 40,
          "intensite": {
            "zone": "Z12",
            "detail": "Z1–Z2 (100–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 5.3,
          "denivele_m": 30,
          "detail_seance": "Footing continu Z2.",
          "element_en_tete": null,
          "autres": null
        },
        {
          "code": "S11-02",
          "numero": 2,
          "type": "Seuil court",
          "jour_suggere": "mer. ou jeu.",
          "duree_min": 50,
          "intensite": {
            "zone": "Z34",
            "detail": "Z3–Z4 (150–165 bpm)",
            "allure_cible": "≈6:10–6:30/km"
          },
          "km_estimes": 6.5,
          "denivele_m": 60,
          "detail_seance": "Échauffement 15' EF + 3 lignes → 3×6' seuil Z3–Z4, récup 3' → Retour au calme 10' Z1.",
          "element_en_tete": "18' cumulées : l'intensité se maintient, le volume descend.",
          "autres": null
        },
        {
          "code": "S11-03",
          "numero": 3,
          "type": "Sortie longue secondaire",
          "jour_suggere": "sam. ou dim.",
          "duree_min": 105,
          "intensite": {
            "zone": "Z2",
            "detail": "Z2 (120–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 13,
          "denivele_m": 410,
          "detail_seance": "1h45 modérée = 70% de la longue max (architecture « palier dégressif » validée littérature). Terrain roulant, peu de D−.",
          "element_en_tete": "Stimulus de durabilité sans pic mécanique.",
          "autres": null
        }
      ]
    },
    {
      "code_semaine": "S12",
      "numero_semaine_plan": 12,
      "semaine_avant_course": "S-2",
      "semaine_annee": "W46",
      "date_debut": "2026-11-09",
      "dates_affichage": "9–15 nov. 2026",
      "phase": "Affûtage",
      "focus": "Affûtage semaine 1. Volume −40%, intensité maintenue en touches.",
      "contraintes": null,
      "renforcement": "allégé : kiné 30' + mobilité 10'",
      "velo": "option courte",
      "temps_total_min": 155,
      "km_estimes_total": 19.6,
      "denivele_total_m": 350,
      "seances": [
        {
          "code": "S12-01",
          "numero": 1,
          "type": "EF",
          "jour_suggere": "lun. ou mar.",
          "duree_min": 35,
          "intensite": {
            "zone": "Z12",
            "detail": "Z1–Z2 (100–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 4.6,
          "denivele_m": 20,
          "detail_seance": "Footing souple Z1–Z2.",
          "element_en_tete": null,
          "autres": null
        },
        {
          "code": "S12-02",
          "numero": 2,
          "type": "Allure course courte",
          "jour_suggere": "mer. ou jeu.",
          "duree_min": 45,
          "intensite": {
            "zone": "Z3",
            "detail": "Z3 (142–155 bpm)",
            "allure_cible": "≈7:15–7:30/km"
          },
          "km_estimes": 6,
          "denivele_m": 60,
          "detail_seance": "Échauffement 15' EF → 15' à allure course (Z3) → Retour au calme 10' Z1.",
          "element_en_tete": "Garder le contact avec l'allure cible, sans fatigue.",
          "autres": null
        },
        {
          "code": "S12-03",
          "numero": 3,
          "type": "Sortie longue légère (nuit)",
          "jour_suggere": "sam. ou dim.",
          "duree_min": 75,
          "intensite": {
            "zone": "Z2",
            "detail": "Z2 (120–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 9,
          "denivele_m": 270,
          "detail_seance": "1h15 de nuit, tenue définitive : DERNIER test matériel. Rien de nouveau après cette sortie.",
          "element_en_tete": "Valider définitivement : frontale, couches, gants, nutrition.",
          "autres": null
        }
      ]
    },
    {
      "code_semaine": "S13",
      "numero_semaine_plan": 13,
      "semaine_avant_course": "S-1",
      "semaine_annee": "W47",
      "date_debut": "2026-11-16",
      "dates_affichage": "16–22 nov. 2026",
      "phase": "Affûtage",
      "focus": "Fraîcheur maximale. Rien de nouveau, rien de dur.",
      "contraintes": null,
      "renforcement": "allégé : kiné 30' + mobilité 10'",
      "velo": "repos conseillé",
      "temps_total_min": 115,
      "km_estimes_total": 15.3,
      "denivele_total_m": 100,
      "seances": [
        {
          "code": "S13-01",
          "numero": 1,
          "type": "EF souple",
          "jour_suggere": "lun. ou mar.",
          "duree_min": 30,
          "intensite": {
            "zone": "Z12",
            "detail": "Z1–Z2 (100–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 4,
          "denivele_m": 10,
          "detail_seance": "Footing très souple.",
          "element_en_tete": "Fraîcheur avant tout.",
          "autres": null
        },
        {
          "code": "S13-02",
          "numero": 2,
          "type": "Activation",
          "jour_suggere": "mer. ou jeu.",
          "duree_min": 40,
          "intensite": {
            "zone": "Z3",
            "detail": "Z3 (142–155 bpm)",
            "allure_cible": "≈7:15–7:30/km"
          },
          "km_estimes": 5.3,
          "denivele_m": 30,
          "detail_seance": "Échauffement 15' EF → 4 lignes droites + 2×5' allure course (Z3), récup 3' → Retour au calme 10' Z1.",
          "element_en_tete": "10' d'allure : juste garder le moteur réveillé.",
          "autres": null
        },
        {
          "code": "S13-03",
          "numero": 3,
          "type": "Footing léger",
          "jour_suggere": "ven. ou sam.",
          "duree_min": 45,
          "intensite": {
            "zone": "Z12",
            "detail": "Z1–Z2 (100–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 6,
          "denivele_m": 60,
          "detail_seance": "45' faciles, terrain plat à léger. Aucun objectif.",
          "element_en_tete": "Sommeil ++ toute la semaine (banque de sommeil avant course de nuit).",
          "autres": null
        }
      ]
    },
    {
      "code_semaine": "S14",
      "numero_semaine_plan": 14,
      "semaine_avant_course": "S0",
      "semaine_annee": "W48",
      "date_debut": "2026-11-23",
      "dates_affichage": "23–28 nov. 2026",
      "phase": "SEMAINE DE COURSE",
      "focus": "Sommeil, glucides, zéro nouveauté.",
      "contraintes": null,
      "renforcement": "repos / mobilité douce",
      "velo": "repos",
      "temps_total_min": 245,
      "km_estimes_total": 32.6,
      "denivele_total_m": 530,
      "seances": [
        {
          "code": "S14-01",
          "numero": 1,
          "type": "EF + lignes",
          "jour_suggere": "lun. 23 ou mar. 24",
          "duree_min": 35,
          "intensite": {
            "zone": "Z12",
            "detail": "Z1–Z2 (100–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 4.6,
          "denivele_m": 20,
          "detail_seance": "Footing très souple + 3 lignes droites.",
          "element_en_tete": "Glucides ++ dès J-3 (~8–10 g/kg/j les 2 derniers jours si toléré).",
          "autres": null
        },
        {
          "code": "S14-02",
          "numero": 2,
          "type": "Activation",
          "jour_suggere": "mer. 25 ou jeu. 26",
          "duree_min": 30,
          "intensite": {
            "zone": "Z12",
            "detail": "Z1–Z2 (100–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 4,
          "denivele_m": 10,
          "detail_seance": "30' footing léger + 3 lignes. VENDREDI 27 = REPOS COMPLET.",
          "element_en_tete": "Préparer le sac : frontale chargée + piles secours, flasque, couche sèche pour l'arrivée.",
          "autres": null
        },
        {
          "code": "S14-03",
          "numero": 3,
          "type": "🎯 COURSE — SaintéSprint 24 km",
          "jour_suggere": "SAM. 28 NOV. au soir",
          "duree_min": 180,
          "intensite": {
            "zone": "COURSE",
            "detail": "Z3 cible, dérive Z4 tolérée en fin",
            "allure_cible": "≈7:15–7:30/km — objectif ~3h"
          },
          "km_estimes": 24,
          "denivele_m": 500,
          "detail_seance": "24 km de nuit. Départ PRUDENT (1er tiers en Z2–bas Z3, FC <150) → milieu à allure cible → finir fort si les jambes répondent. Hydratation 300–500 ml/h + 300–600 mg sodium/h. Nutrition : 1 prise/40–45' dès 45'. Boire à la soif + rappel toutes les 20–25' (le froid coupe la soif).",
          "element_en_tete": "Partir légèrement frileux. Ventiler avant de transpirer. À l'arrivée : couche sèche + doudoune IMMÉDIATEMENT (risque n°1 = after-chill).",
          "autres": "Négatif split = la meilleure stratégie pour ton profil."
        }
      ]
    }
  ]
};
