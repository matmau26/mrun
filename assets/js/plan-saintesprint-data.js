/* Données du plan SaintéSprint 2026 — Mathieu (source : Plan_entrainement_MM_SainteSprint_v4.xlsx)
   Fichier généré depuis plan_saintesprint_mm.json — ne pas éditer à la main sans mettre à jour la source. */
window.PLAN_SAINTESPRINT = {
  "meta": {
    "titre": "Plan SaintéSprint 2026 — Mathieu · v4 (plan en durée)",
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
      },
      "cadence_cible_ppm": 178
    },
    "regles_transverses": [
      "Douleur osseuse ou genou qui augmente à l'effort = STOP immédiat + kiné",
      "Plan piloté en DURÉE : si tu accélères, tu écourtes d'autant",
      "Côtes sur pente ≤10% uniquement (sauf sprints 8–10\")",
      "Descentes raides marchées, D− compté séparément",
      "Cadence cible 178 ppm (protocole métronome S-13/S-12)",
      "≥1 jour entre 2 courses, ≥48 h entre séance qualité et sortie longue",
      "Le facile doit être VRAIMENT facile (Z2, <142 bpm)",
      "Décharges à respecter sans combler",
      "HRV/sommeil à lire en tendance 7 jours"
    ],
    "totaux": {
      "heures": 44,
      "km_estimes": 345,
      "denivele_m": 7050,
      "semaines": 14
    },
    "genere_le": "2026-08-25",
    "source": "Plan_entrainement_MM_SainteSprint_v4.xlsx"
  },
  "semaines": [
    {
      "semaine_avant_course": "S-13",
      "semaine_annee": "W35",
      "date_debut": "2026-08-24",
      "dates_affichage": "24–30 août 2026",
      "phase": "Spécifique 1",
      "focus": "Entrée dans le spécifique. Priorité : cadence + zéro douleur.",
      "renforcement": "×2 : kiné 30' (pied/cheville/genou) + maison 15' (charges progressives, pliométrie légère)",
      "velo": "45–60' Z1–Z2 optionnel",
      "temps_total_min": 195,
      "km_estimes_total": 24.8,
      "denivele_total_m": 450,
      "seances": [
        {
          "numero": 1,
          "type": "EF",
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
          "numero": 2,
          "type": "Côtes courtes",
          "duree_min": 50,
          "intensite": {
            "zone": "Z4",
            "detail": "Z4 (156–176 bpm)",
            "allure_cible": "effort en côte — allure non pertinente"
          },
          "km_estimes": 6.5,
          "denivele_m": 150,
          "detail_seance": "Échauffement 15' EF Z1–Z2 + 3 éducatifs → 6×30–45\" en côte pente 6–10%, effort Z4, récup descente trottée lente ~2' → 4 sprints de côte 8–10\" (pente raide tolérée : très peu de cycles), récup marchée 2' → Retour au calme 10' Z1.",
          "element_en_tete": "Côtes en souplesse, buste droit. Jamais >10% sur les répétitions longues (charge tibiale interne).",
          "autres": null
        },
        {
          "numero": 3,
          "type": "Sortie longue",
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
      "semaine_avant_course": "S-12",
      "semaine_annee": "W36",
      "date_debut": "2026-08-31",
      "dates_affichage": "31 août – 6 sept. 2026",
      "phase": "Spécifique 1",
      "focus": "Première touche de seuil. Tout le reste reste facile.",
      "renforcement": "×2 : kiné 30' + maison 15'",
      "velo": "45–60' Z1–Z2 optionnel",
      "temps_total_min": 205,
      "km_estimes_total": 25.8,
      "denivele_total_m": 500,
      "seances": [
        {
          "numero": 1,
          "type": "EF",
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
          "numero": 2,
          "type": "Seuil (dose d'entrée)",
          "duree_min": 50,
          "intensite": {
            "zone": "Z3",
            "detail": "Z3 (142–155 bpm)",
            "allure_cible": "≈6:20–6:40/km"
          },
          "km_estimes": 6.5,
          "denivele_m": 60,
          "detail_seance": "Échauffement 15' EF + 3 lignes droites → 2×7' au seuil Z3 (145–155), allure ≈6:20–6:40/km, récup 3' trot → Retour au calme 10' Z1.",
          "element_en_tete": "14' cumulées = dose d'entrée volontairement basse (littérature : 10–15'). Ne pas en rajouter.",
          "autres": null
        },
        {
          "numero": 3,
          "type": "Sortie longue",
          "duree_min": 115,
          "intensite": {
            "zone": "Z2",
            "detail": "Z2 (120–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 14,
          "denivele_m": 410,
          "detail_seance": "Z2 continue, trail roulant à vallonné. Descentes raides marchées.",
          "element_en_tete": "Tester la nutrition : 1 gel ou équivalent vers 1h.",
          "autres": "≥48 h après le seuil"
        }
      ]
    },
    {
      "semaine_avant_course": "S-11",
      "semaine_annee": "W37",
      "date_debut": "2026-09-07",
      "dates_affichage": "7–13 sept. 2026",
      "phase": "Spécifique 1",
      "focus": "Semaine la plus chargée du bloc 1. Écoute le tibia.",
      "renforcement": "×2 : kiné 30' + maison 15'",
      "velo": "45–60' Z1–Z2 optionnel",
      "temps_total_min": 220,
      "km_estimes_total": 28,
      "denivele_total_m": 600,
      "seances": [
        {
          "numero": 1,
          "type": "EF + lignes",
          "duree_min": 45,
          "intensite": {
            "zone": "Z12",
            "detail": "Z1–Z2 (100–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 6,
          "denivele_m": 40,
          "detail_seance": "Footing Z2 + 4 lignes droites (15–20\", récup complète) en fin de séance.",
          "element_en_tete": "Cadence 178 acquise ? Vérifie la moyenne sur Garmin.",
          "autres": null
        },
        {
          "numero": 2,
          "type": "Côtes",
          "duree_min": 55,
          "intensite": {
            "zone": "Z4",
            "detail": "Z4 (156–176 bpm)",
            "allure_cible": "effort en côte — allure non pertinente"
          },
          "km_estimes": 7,
          "denivele_m": 180,
          "detail_seance": "Échauffement 15' EF + éducatifs → 8×45\" en côte 6–10%, effort Z4, récup descente trottée lente → 4 sprints de côte 8–10\", récup marchée → Retour au calme 10' Z1.",
          "element_en_tete": "L'économie en montée = prédicteur n°1 de la perf trail court. Qualité d'appui > vitesse.",
          "autres": null
        },
        {
          "numero": 3,
          "type": "Sortie longue",
          "duree_min": 120,
          "intensite": {
            "zone": "Z2",
            "detail": "Z2 (120–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 15,
          "denivele_m": 380,
          "detail_seance": "2h00 en Z2, trail. Descentes raides marchées, D− noté séparément.",
          "element_en_tete": "Dernière longue avant décharge : ne pas la « bonifier ».",
          "autres": null
        }
      ]
    },
    {
      "semaine_avant_course": "S-10",
      "semaine_annee": "W38",
      "date_debut": "2026-09-14",
      "dates_affichage": "14–20 sept. 2026",
      "phase": "DÉCHARGE",
      "focus": "DÉCHARGE −35%. Sommeil ++, HRV en tendance 7 jours.",
      "renforcement": "allégé : kiné 30' + mobilité 10'",
      "velo": "option, facile uniquement",
      "temps_total_min": 145,
      "km_estimes_total": 18.9,
      "denivele_total_m": 300,
      "seances": [
        {
          "numero": 1,
          "type": "EF récup",
          "duree_min": 35,
          "intensite": {
            "zone": "Z12",
            "detail": "Z1–Z2 (100–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 4.6,
          "denivele_m": 20,
          "detail_seance": "Footing très lent Z1–Z2.",
          "element_en_tete": "Vraiment lent. Semaine de régénération.",
          "autres": null
        },
        {
          "numero": 2,
          "type": "Footing + lignes",
          "duree_min": 40,
          "intensite": {
            "zone": "Z12",
            "detail": "Z1–Z2 (100–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 5.3,
          "denivele_m": 40,
          "detail_seance": "Footing Z1–Z2 + 4 lignes droites (15–20\") en fin. Rien d'autre.",
          "element_en_tete": "Les lignes entretiennent la foulée sans charge.",
          "autres": null
        },
        {
          "numero": 3,
          "type": "Sortie longue courte",
          "duree_min": 70,
          "intensite": {
            "zone": "Z2",
            "detail": "Z2 (120–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 9,
          "denivele_m": 240,
          "detail_seance": "1h10 tranquille, terrain facile.",
          "element_en_tete": "NE PAS combler : la décharge fait partie de l'entraînement.",
          "autres": null
        }
      ]
    },
    {
      "semaine_avant_course": "S-9",
      "semaine_annee": "W39",
      "date_debut": "2026-09-21",
      "dates_affichage": "21–27 sept. 2026",
      "phase": "Spécifique 2",
      "focus": "Bloc 2. Le seuil monte, le reste ne bouge pas.",
      "renforcement": "×2 : kiné 30' + maison 15'",
      "velo": "45–60' Z1–Z2 optionnel",
      "temps_total_min": 225,
      "km_estimes_total": 28,
      "denivele_total_m": 600,
      "seances": [
        {
          "numero": 1,
          "type": "EF",
          "duree_min": 45,
          "intensite": {
            "zone": "Z12",
            "detail": "Z1–Z2 (100–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 6,
          "denivele_m": 40,
          "detail_seance": "Footing continu Z2.",
          "element_en_tete": "Retour de charge : rester strictement en Z2.",
          "autres": null
        },
        {
          "numero": 2,
          "type": "Seuil",
          "duree_min": 55,
          "intensite": {
            "zone": "Z34",
            "detail": "Z3–Z4 (150–165 bpm)",
            "allure_cible": "≈6:10–6:30/km"
          },
          "km_estimes": 7,
          "denivele_m": 60,
          "detail_seance": "Échauffement 15' EF + 3 lignes → 3×7' seuil Z3–Z4 (150–165), allure ≈6:10–6:30/km, récup 3' trot → Retour au calme 10' Z1.",
          "element_en_tete": "21' cumulées : montée de dose contrôlée (cap 20–30').",
          "autres": null
        },
        {
          "numero": 3,
          "type": "Sortie longue",
          "duree_min": 125,
          "intensite": {
            "zone": "Z2",
            "detail": "Z2 (120–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 15,
          "denivele_m": 500,
          "detail_seance": "2h05 vallonnée, D+ en montées douces. Marche-course dans les raidillons.",
          "element_en_tete": "Nutrition : tester la stratégie course (1 prise/45').",
          "autres": "≥48 h après le seuil"
        }
      ]
    },
    {
      "semaine_avant_course": "S-8",
      "semaine_annee": "W40",
      "date_debut": "2026-09-28",
      "dates_affichage": "28 sept. – 4 oct. 2026",
      "phase": "Spécifique 2",
      "focus": "Force en côte + volume D+ raisonné.",
      "renforcement": "×2 : kiné 30' + maison 15'",
      "velo": "45–60' Z1–Z2 optionnel",
      "temps_total_min": 235,
      "km_estimes_total": 29,
      "denivele_total_m": 700,
      "seances": [
        {
          "numero": 1,
          "type": "EF",
          "duree_min": 45,
          "intensite": {
            "zone": "Z12",
            "detail": "Z1–Z2 (100–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 6,
          "denivele_m": 40,
          "detail_seance": "Footing continu Z2.",
          "element_en_tete": null,
          "autres": null
        },
        {
          "numero": 2,
          "type": "Côtes longues",
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
          "numero": 3,
          "type": "Sortie longue",
          "duree_min": 135,
          "intensite": {
            "zone": "Z2",
            "detail": "Z2 (120–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 16,
          "denivele_m": 460,
          "detail_seance": "2h15 trail avec D+. Descentes contrôlées même si les jambes vont bien.",
          "element_en_tete": "Compteur D− : si >400 m de descente courue, marche davantage.",
          "autres": null
        }
      ]
    },
    {
      "semaine_avant_course": "S-7",
      "semaine_annee": "W41",
      "date_debut": "2026-10-05",
      "dates_affichage": "5–11 oct. 2026",
      "phase": "Spécifique 2 · PIC temps",
      "focus": "Semaine pic n°1 (4h00). Première vraie longue de nuit.",
      "renforcement": "×2 : kiné 30' + maison 15'",
      "velo": "45–60' Z1–Z2 optionnel",
      "temps_total_min": 240,
      "km_estimes_total": 30,
      "denivele_total_m": 750,
      "seances": [
        {
          "numero": 1,
          "type": "EF de nuit (frontale)",
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
          "numero": 2,
          "type": "Seuil",
          "duree_min": 55,
          "intensite": {
            "zone": "Z34",
            "detail": "Z3–Z4 (150–165 bpm)",
            "allure_cible": "≈6:10–6:30/km"
          },
          "km_estimes": 7,
          "denivele_m": 60,
          "detail_seance": "Échauffement 15' EF + 3 lignes → 2×12' seuil Z3–Z4 (150–165), récup 4' trot → Retour au calme 10' Z1.",
          "element_en_tete": "24' cumulées : dose max du plan. Jambes lourdes → transformer en 3×7'.",
          "autres": null
        },
        {
          "numero": 3,
          "type": "Sortie longue NUIT",
          "duree_min": 140,
          "intensite": {
            "zone": "Z2",
            "detail": "Z2 (120–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 17,
          "denivele_m": 650,
          "detail_seance": "2h20 trail de nuit complet : frontale, tenue, repères, nutrition. Z2 strict.",
          "element_en_tete": "Checklist : frontale chargée + secours, tour de cou, gants fins, flasque sous la veste.",
          "autres": "Pic de temps de la prépa"
        }
      ]
    },
    {
      "semaine_avant_course": "S-6",
      "semaine_annee": "W42",
      "date_debut": "2026-10-12",
      "dates_affichage": "12–18 oct. 2026",
      "phase": "DÉCHARGE",
      "focus": "DÉCHARGE −37%. Refaire le test de sudation + sodium.",
      "renforcement": "allégé : kiné 30' + mobilité 10'",
      "velo": "option, facile uniquement",
      "temps_total_min": 150,
      "km_estimes_total": 18.9,
      "denivele_total_m": 350,
      "seances": [
        {
          "numero": 1,
          "type": "EF récup",
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
          "numero": 2,
          "type": "Footing + lignes",
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
          "numero": 3,
          "type": "Sortie longue courte",
          "duree_min": 75,
          "intensite": {
            "zone": "Z2",
            "detail": "Z2 (120–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 9,
          "denivele_m": 290,
          "detail_seance": "1h15 souple.",
          "element_en_tete": "TEST DE SUDATION cette semaine : pesée nu avant/après une sortie (acclimatation été retombée → valeurs représentatives de novembre).",
          "autres": null
        }
      ]
    },
    {
      "semaine_avant_course": "S-5",
      "semaine_annee": "W43",
      "date_debut": "2026-10-19",
      "dates_affichage": "19–25 oct. 2026",
      "phase": "Spécifique 3",
      "focus": "Spécificité maximale : allure cible + nuit + tenue.",
      "renforcement": "×2 : kiné 30' + maison 15'",
      "velo": "45–60' Z1–Z2 optionnel",
      "temps_total_min": 230,
      "km_estimes_total": 28.3,
      "denivele_total_m": 700,
      "seances": [
        {
          "numero": 1,
          "type": "EF de nuit",
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
          "numero": 2,
          "type": "Allure course",
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
          "numero": 3,
          "type": "Sortie longue nuit",
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
      "semaine_avant_course": "S-4",
      "semaine_annee": "W44",
      "date_debut": "2026-10-26",
      "dates_affichage": "26 oct. – 1 nov. 2026",
      "phase": "PIC",
      "focus": "SEMAINE PIC (4h05). Après : décrue monotone jusqu'à la course.",
      "renforcement": "×2 : kiné 30' + maison 15'",
      "velo": "45–60' Z1–Z2 optionnel",
      "temps_total_min": 245,
      "km_estimes_total": 30.3,
      "denivele_total_m": 800,
      "seances": [
        {
          "numero": 1,
          "type": "EF",
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
          "numero": 2,
          "type": "Mix côtes + seuil",
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
          "numero": 3,
          "type": "RÉPÉTITION GÉNÉRALE",
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
          "autres": "S-4 = marge osseuse : un souci se déclarerait à S-2/S-1, gérable. Férié le 1er nov."
        }
      ]
    },
    {
      "semaine_avant_course": "S-3",
      "semaine_annee": "W45",
      "date_debut": "2026-11-02",
      "dates_affichage": "2–8 nov. 2026",
      "phase": "Pré-affûtage",
      "focus": "Pré-affûtage : seconde longue à 70%, intensité conservée.",
      "renforcement": "×2 : kiné 30' + maison 15'",
      "velo": "45–60' Z1–Z2 optionnel",
      "temps_total_min": 195,
      "km_estimes_total": 24.8,
      "denivele_total_m": 500,
      "seances": [
        {
          "numero": 1,
          "type": "EF",
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
          "numero": 2,
          "type": "Seuil court",
          "duree_min": 50,
          "intensite": {
            "zone": "Z34",
            "detail": "Z3–Z4 (150–165 bpm)",
            "allure_cible": "≈6:10–6:30/km"
          },
          "km_estimes": 6.5,
          "denivele_m": 60,
          "detail_seance": "Échauffement 15' EF + 3 lignes → 3×6' seuil Z3–Z4, récup 3' → Retour au calme 10' Z1.",
          "element_en_tete": "18' cumulées : l'intensité se maintient, le volume descend (−21%).",
          "autres": null
        },
        {
          "numero": 3,
          "type": "Sortie longue secondaire",
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
      "semaine_avant_course": "S-2",
      "semaine_annee": "W46",
      "date_debut": "2026-11-09",
      "dates_affichage": "9–15 nov. 2026",
      "phase": "Affûtage",
      "focus": "Affûtage semaine 1. Volume −40%, intensité maintenue en touches.",
      "renforcement": "allégé : kiné 30' + mobilité 10'",
      "velo": "option courte",
      "temps_total_min": 155,
      "km_estimes_total": 19.6,
      "denivele_total_m": 350,
      "seances": [
        {
          "numero": 1,
          "type": "EF",
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
          "numero": 2,
          "type": "Allure course courte",
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
          "numero": 3,
          "type": "Sortie longue légère (nuit)",
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
      "semaine_avant_course": "S-1",
      "semaine_annee": "W47",
      "date_debut": "2026-11-16",
      "dates_affichage": "16–22 nov. 2026",
      "phase": "Affûtage",
      "focus": "Fraîcheur maximale. Rien de nouveau, rien de dur.",
      "renforcement": "allégé : kiné 30' + mobilité 10'",
      "velo": "repos conseillé",
      "temps_total_min": 115,
      "km_estimes_total": 15.3,
      "denivele_total_m": 100,
      "seances": [
        {
          "numero": 1,
          "type": "EF souple",
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
          "numero": 2,
          "type": "Activation",
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
          "numero": 3,
          "type": "Footing léger",
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
      "semaine_avant_course": "S0",
      "semaine_annee": "W48",
      "date_debut": "2026-11-23",
      "dates_affichage": "23–28 nov. 2026",
      "phase": "SEMAINE DE COURSE",
      "focus": "Sommeil, glucides, zéro nouveauté.",
      "renforcement": "repos / mobilité douce",
      "velo": "repos",
      "temps_total_min": 245,
      "km_estimes_total": 32.6,
      "denivele_total_m": 530,
      "seances": [
        {
          "numero": 1,
          "type": "EF + lignes (lun ou mar)",
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
          "numero": 2,
          "type": "Activation (mer ou jeu)",
          "duree_min": 30,
          "intensite": {
            "zone": "Z12",
            "detail": "Z1–Z2 (100–141 bpm)",
            "allure_cible": "7:15–7:45/km (allure libre, pilotée par la FC)"
          },
          "km_estimes": 4,
          "denivele_m": 10,
          "detail_seance": "30' footing léger + 3 lignes. VENDREDI = REPOS COMPLET.",
          "element_en_tete": "Préparer le sac : frontale chargée + piles secours, flasque, couche sèche pour l'arrivée.",
          "autres": null
        },
        {
          "numero": 3,
          "type": "🎯 COURSE — SaintéSprint",
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
          "autres": "Négatif split = la meilleure stratégie pour ton profil. SAMEDI 28 NOVEMBRE au soir."
        }
      ]
    }
  ]
};
