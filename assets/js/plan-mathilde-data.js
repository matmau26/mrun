window.PLAN_MATHILDE_SS = {
  "meta": {
    "schema_version": "1.0",
    "plan_version": "2.0",
    "titre": "Plan SainteSprint 24 km — Mathilde — version corrigée",
    "genere_le": "2026-09-15",
    "remplace": "2026-11_SainteSprint24K_Plan.json (v1.0 du 15/09/2026)",
    "source_donnees": "Export RGPD Garmin 2026-09-14_Mathilde (651 activités) + lecture tour par tour des fichiers .FIT (DI-Connect-Uploaded-Files)",
    "orientation": "vitesse spécifique + capacité à monter",
    "nb_semaines": 11,
    "debut": "2026-09-14",
    "fin": "2026-11-29",
    "confidentiel": true,
    "note_methode": "Les allures de ce plan sont tirées des intervalles réellement courus (laps .FIT), pas des moyennes de séance. Une moyenne de séance inclut échauffement, récupérations et retour au calme : elle sous-estime systématiquement le niveau réel de 30 à 60 s/km."
  },

  "corrections_v2": [
    {
      "sujet": "Diagnostic « la vitesse est partie »",
      "v1": "Dernière sortie sous 4:45/km le 01/04/2026, haut du moteur éteint, chantier n°1 du bloc.",
      "correction": "Faux. Lecture tour par tour : 18/06 progressif, km 8-9-10 à 4:28 / 4:17 / 4:17 (FC 176-178) · 29/07 3×8' à 4:38 / 4:29 / 4:18 (FC 168→180) · 12/08 2×10' à 4:40 et 4:26 (FC 175-180) · 26/08 2×6' à 4:30 et 4:25 (FC 175-182). Elle tenait 6 minutes à 4:25/km dix-sept jours avant l'ultra.",
      "consequence": "Toute la table d'allures v1 est relevée de 15 à 20 s/km. Le bloc n'a pas à « rallumer » quoi que ce soit : il doit rendre une vitesse existante tenable 2 heures."
    },
    {
      "sujet": "Cible de FC en course",
      "v1": "Allure course à FC 168-176, Z4 plafonnée à 176, LTHR 183.",
      "correction": "En 2025, du km 4 à l'arrivée, elle a couru à 180 bpm de moyenne pendant 2h05, pointes à 188. La moyenne de 177 de la v1 est tirée vers le bas par les 3 premiers km, où le capteur optique lit 144-148 bpm à 4:20-4:32/km (démarrage à froid, valeurs inexploitables).",
      "consequence": "LTHR réévalué à ~185 (à confirmer le 14/11). Bande de FC en course relevée à 176-182. Piloter la course à 168-176 l'aurait fait courir plus lentement qu'en 2025."
    },
    {
      "sujet": "Zones de FC",
      "v1": "Zones en %FCmax sur une FCmax de 197. Z2 = 120-137, « 75 % du volume doit s'y passer ».",
      "correction": "Sur 62 séances de course depuis le 01/06/2026, la FC moyenne médiane est de 152 ; deux séances seulement passent sous 137. Ses footings à 5:40-6:00/km sortent entre 140 et 152 bpm. La v1 associait dans la même ligne une allure (5:40-6:00) et une FC (120-137) que ses propres données contredisent.",
      "consequence": "Zones reconstruites sur le LTHR et calées sur ses valeurs observées. FCmax non mesurée : 190 en course 2025, les relevés >200 sont des artefacts de capteur optique. Le pilotage se fait au LTHR, pas à la FCmax."
    },
    {
      "sujet": "Où se trouve le temps",
      "v1": "Parcours « roulant, net descendant ». Trois séances de descente rapide, aucun travail en montée après la S40.",
      "correction": "Découpage km par km de 2025 : cinq kilomètres à 6:27, 6:42, 6:48, 6:51 et 7:31, cadence effondrée à 156-166 (donc marchés). Ces 5 km coûtent environ 8 min 30 par rapport à son allure moyenne. Les km roulants sont déjà courus à 4:45-5:11.",
      "consequence": "Gagner 10 % sur les cinq km de bosse rapporte 3:20 ; gagner 5 s/km sur les dix-huit km roulants rapporte 1:30. Ajout d'une séance de côtes courues et de blocs de marche rapide en pente raide en fin de sortie longue."
    },
    {
      "sujet": "Le creux J+10 / J+14",
      "v1": "« Son creux profond documenté tombe entre J+10 et J+14 » — justifie l'interdiction d'intensité avant le 28/09.",
      "correction": "Non retrouvé dans l'export. Sur les trois dernières grosses échéances (43 km Chamonix 28/06, bloc Chamonix 22-23/08, Malaucène 25/04), la VFC oscille entre 22 et 39 sans creux reproductible à J+10/J+14. En 2025, l'effondrement post-SaintéSprint a duré 48 h (VFC 19 le 30/11, 17 le 01/12, retour dans la norme le 02/12).",
      "consequence": "Les deux premières semaines restent sans intensité — deux semaines de récupération après un 85 km se justifient d'elles-mêmes — mais le pilotage se fait sur les marqueurs du jour, pas sur une fenêtre prédéfinie."
    },
    {
      "sujet": "Puissance Stryd en course",
      "v1": "Allure course à 168-176 W pour un CP de 179 W, soit 94-98 % du CP pendant 2h07.",
      "correction": "Physiologiquement intenable. L'ordre de grandeur pour un effort de 2 heures est 88-92 % du CP.",
      "consequence": "Bande de puissance en course ramenée à 157-165 W. Attention : aucune donnée Stryd n'est présente dans l'export RGPD (la puissance qu'il contient est la puissance native Garmin). Ces bandes sont des %CP, à recalibrer sur les fichiers Stryd réels."
    },
    {
      "sujet": "Calendrier de tests",
      "v1": "Trois efforts maximaux en cinq semaines : All'en Trail 11/10, 30' contre-la-montre 24/10, 10 km chrono 14/11 — sur une athlète qui sort d'un 85 km.",
      "correction": "Le 30' contre-la-montre du 24/10 est remplacé par une séance témoin 3×10' au seuil, mesurée mais non maximale. La recalibration se fait sur deux points concordants (All'en Trail + séance témoin), conformément à la règle du plan lui-même, puis le 10 km du 14/11 fige la cible.",
      "consequence": "Un seul effort maximal en dehors des courses, à 14 jours de l'objectif."
    },
    {
      "sujet": "Incohérences internes v1 corrigées",
      "v1": "Focus S43 annonçant un 3×10' absent du calendrier · focus S46 annonçant un 2×20' en réalité placé en S47 · B2 et B4 jamais programmées · C3 et D2 jamais programmées · Z4 à 160-176 alors que toutes les séances de seuil ciblent 172-183 · profil de course pris sur un altimètre déclaré défaillant · cible chrono calculée sur des prédictions Garmin déclarées inutilisables · règle des deux séances dures violée en S45.",
      "correction": "Calendrier et catalogue réconciliés : toute séance du catalogue est programmée au moins une fois, tout focus de semaine décrit les séances réellement présentes.",
      "consequence": "Le document est exécutable tel quel."
    },
    {
      "sujet": "Spécifique long",
      "v1": "40 minutes cumulées à allure course sur onze semaines, dont la seule séance longue spécifique à 7 jours de l'objectif.",
      "correction": "146 minutes cumulées à allure course réparties sur S44, S45, S47, dont deux en fin de sortie longue sur jambes entamées.",
      "consequence": "C'est le déterminant principal sur une course de 2 heures."
    },
    {
      "sujet": "Récupération d'après-course",
      "v1": "Protocole de coupure basé sur le faisceau du 01/12/2025.",
      "correction": "En 2025 le facteur le plus lourd n'est pas la course : elle s'est endormie à 4h59 pour 3h35 de sommeil. Trois heures et demie entre l'arrivée et le coucher.",
      "consequence": "Ajout d'un volet logistique : hébergement à l'arrivée, plan de retour, objectif de sommeil la nuit d'après."
    }
  ],

  "athlete": {
    "prenom": "Mathilde",
    "taille_cm": 156,
    "poids_kg": 47,
    "fc_max_observee": 190,
    "fc_max_note": "190 relevé en course (SainteSprint 2025). Les valeurs >200 de l'export (210 le 01/02/2026, 205 le 19/03/2026) sont des artefacts de capteur optique. FCmax jamais mesurée en protocole : le plan ne s'en sert pas.",
    "lthr_estime": 185,
    "lthr_source": "Déduit du comportement en course : 180 bpm de moyenne du km 4 à l'arrivée pendant 2h05 le 29/11/2025, et blocs de seuil à 175-182 en juillet-août 2026. Fourchette 183-188. À confirmer par la FC moyenne des 20 dernières minutes du 10 km du 14/11.",
    "lthr_v1": 183,
    "fc_repos_sept_2026": 58,
    "cp_stryd_w": 179,
    "cp_stryd_w_par_kg": 3.81,
    "cp_stryd_maj_le": "2026-08-12",
    "vo2max_garmin": 56,
    "vo2max_note": "56 jusqu'au 05/09/2026, retombé à 54 le 12/09 (effet mécanique de l'ultra). Pic de l'année à 57 en mars-avril 2026."
  },

  "course": {
    "nom": "Asics SaintéSprint",
    "distance_km": 24,
    "depart_lieu": "Soucieu-en-Jarrest, Place de la Flette",
    "arrivee_lieu": "Lyon",
    "date": "2026-11-28",
    "heure_depart": "23:00",
    "heure_depart_source": "saintelyon.com, page SaintéSprint, consultée le 15/09/2026 — 23h00 confirmé",
    "heure_depart_alerte": "L'information transmise initialement (23h30) est contredite par le site officiel. Reste à vérifier sur le dossard ou le règlement.",
    "fermeture_course": "16:00",
    "participants_max": 2900,
    "profil": "Roulant et net descendant sur le cumul, mais avec cinq kilomètres de montée franche qui décident du chrono",
    "denivele_2026_publie": false,
    "denivele_reference_2025": {
      "d_plus_m": 466,
      "d_moins_m": 628,
      "source": "montre Garmin 2025 — altimètre barométrique déclaré non fiable, à remplacer par le GPX officiel dès publication"
    },
    "sections_couteuses_2025": {
      "nb_km": 5,
      "kilometres": [9, 15, 19, 20, 21],
      "allures": ["7:31", "6:48", "6:42", "6:51", "6:27"],
      "cadence": "156 à 166 pas/min — donc marchés ou trottinés",
      "temps_perdu_vs_allure_moyenne": "environ 8 min 30",
      "lecture": "C'est le seul gisement de temps significatif du parcours."
    }
  },

  "reference_2025": {
    "date": "2025-11-29",
    "activite_garmin_id": 21126611307,
    "chrono_s": 7884,
    "chrono_affiche": "2h11:24",
    "chrono_source": "montre",
    "chrono_officiel_verifie": false,
    "distance_km": 24.57,
    "allure_moyenne_s_par_km": 321,
    "allure_moyenne_affichee": "5:21/km",
    "allure_gap_affichee": "5:08/km",
    "cout_terrain_pct": 4.0,
    "cout_terrain_note": "Ce pourcentage mélange le coût de la pente et les sections marchées. Il n'est pas « rattrapable » par une meilleure allure : une partie correspond à des kilomètres où elle ne court pas.",
    "segment_couru": {
      "distance_km": 23.78,
      "duree_s": 7305,
      "allure_affichee": "5:07/km",
      "d_plus_m": 361
    },
    "segment_marche": {
      "distance_m": 798,
      "duree_s": 579,
      "duree_affichee": "9'39"
    },
    "fc_moyenne_brute": 177,
    "fc_moyenne_km4_arrivee": 180,
    "fc_note": "Les 3 premiers km affichent 144-148 bpm à 4:20-4:32/km : lecture optique invalide au démarrage à froid. La FC de référence est 180, pas 177.",
    "fc_max": 190,
    "pct_lthr_recalcule": 97.3,
    "cadence_pas_min": 182,
    "longueur_foulee_cm": 101.7,
    "temps_contact_ms": 225,
    "charge": 767,
    "te_aerobie": 5.0,
    "te_anaerobie": 3.3,
    "pacing_2025": "km 1-3 à 4:32 / 4:28 / 4:20, puis FC scotchée entre 177 et 183 du km 4 à l'arrivée, sans effondrement final (km 24 à 4:59, km 25 à 4:45). Le pacing a tenu ; il n'y a pas de marge à récupérer côté gestion.",
    "apres_course": {
      "nuit_avant": { "duree": "8h29", "score": 83, "coucher": "22h56", "lever": "07h25" },
      "nuit_apres": { "duree": "3h35", "score": 26, "coucher": "04h59", "lever": "08h34" },
      "alerte": "Le 01/12/2025 est le pire faisceau santé des 30 mois de données : VFC 17 ms, FC nocturne 87, température cutanée +1,1 °C. Nuance ajoutée en v2 : le retour dans la norme est intervenu dès le 02/12 (VFC 23, FC 77) et la VFC était à 33 le 05/12. L'épisode a duré 48 à 72 heures, pas deux semaines.",
      "facteur_aggravant": "3h30 entre l'arrivée (≈01h11) et le coucher (04h59)."
    }
  },

  "comparaison_forme": [
    { "indicateur": "VO2max Garmin (course)", "nov_2025": "53-54", "sept_2026": "56", "ecart": "+4 %", "lecture": "Plafond aérobie en hausse. Pic de l'année à 57 en mars-avril." },
    { "indicateur": "Prédiction 10 km Garmin", "nov_2025": "44:15", "sept_2026": "43:22", "ecart": "−2,0 %", "lecture": "Utilisé comme signal de tendance uniquement, jamais comme allure prescrite ni comme base de calcul du chrono cible." },
    { "indicateur": "Meilleur bloc de seuil mesuré", "nov_2025": "non documenté", "sept_2026": "8' à 4:18/km (29/07) · 10' à 4:26/km (12/08) · 6' à 4:25/km (26/08)", "ecart": "—", "lecture": "C'est la donnée qui fixe les allures du plan." },
    { "indicateur": "Volume hebdo type", "nov_2025": "35-45 km", "sept_2026": "45-70 km (médiane 52)", "ecart": "+30 %", "lecture": "Socle aérobie nettement plus épais." },
    { "indicateur": "Bloc préparatoire disponible", "nov_2025": "3 semaines", "sept_2026": "11 semaines", "ecart": "×3,5", "lecture": "Marge de progression réelle, mais sur le spécifique et la montée, pas sur la vitesse pure." }
  ],

  "diagnostic": [
    { "signal": "vert", "titre": "Le socle est là", "texte": "84 km à l'UTV le 12/09 en étant malade, après un été à 45-72 km/semaine. L'endurance n'est pas le sujet sur 24 km." },
    { "signal": "vert", "titre": "La vitesse est là aussi", "texte": "8' à 4:18/km le 29/07, 10' à 4:26/km le 12/08, 6' à 4:25/km le 26/08, tous à FC 175-182. Le diagnostic inverse de la v1 reposait sur des moyennes de séance, qui incluent échauffement et retour au calme." },
    { "signal": "rouge", "titre": "Les montées décident du chrono", "texte": "Cinq kilomètres à 6:27-7:31 en 2025, cadence tombée à 156-166. Environ 8 min 30 perdues là. Le débrief UTV confirme : ses montées s'effondrent de 14 % quand ses descentes tiennent. C'est le chantier n°1." },
    { "signal": "vert", "titre": "Ses descentes tiennent", "texte": "Après 8 h de course à l'UTV, ses descentes raides gardaient la même vitesse qu'au départ. Sur un parcours à 628 m de descente, c'est un acquis à entretenir, pas à développer." },
    { "signal": "orange", "titre": "Le spécifique manque", "texte": "Aucun bloc continu à allure course de plus de 15 minutes dans les six derniers mois. Sur une course de 2 heures, c'est le déterminant principal." },
    { "signal": "orange", "titre": "Le frein mécanique", "texte": "Foulée de 101,7 cm à cadence 182 en course. Pour aller plus vite à cadence constante il faut allonger la foulée : neuromusculaire (lignes droites, côtes courtes, pliométrie légère), pas plus de volume." },
    { "signal": "orange", "titre": "Le risque n°1", "texte": "Un 85 km à 11 semaines de l'objectif. Les deux premières semaines sans course à pied ne se négocient pas, mais le pilotage se fait sur les marqueurs du jour." },
    { "signal": "orange", "titre": "Périoste tibial", "texte": "Drapeau à 1,5/3 début septembre, résolu au 15/09. La montée en vitesse sur surface dure est le facteur de risque principal du bloc." }
  ],

  "logique": "La vitesse est là, l'endurance est là. Le bloc sert à trois choses : rendre l'allume course tenable deux heures (spécifique long), reprendre du temps sur les cinq kilomètres de montée, et rendre le tout exécutable de nuit à la frontale. On protège la récupération post-85 km, on ne reconstruit ni le socle ni la VMA.",

  "scenarios": {
    "methode": "Base : allure course cible 4:52-5:00/km sur plat, déduite des blocs de seuil mesurés en juillet-août (4:18 à 4:40/km sur 6 à 10 minutes) moins l'écart usuel seuil→allure 2 h. Appliquée au parcours avec un coût terrain de 4 % et sur la distance montre 2025 de 24,53 km. Les prédictions Garmin ne servent pas au calcul.",
    "cible_figee_le": "2026-11-26",
    "liste": [
      { "code": "A", "nom": "Grande nuit", "chrono": "2h02 – 2h05", "chrono_min_s": 7320, "chrono_max_s": 7500, "allure": "4:58 – 5:06 /km", "conditions": "Terrain sec ET test 10 km du 14/11 sous 44:45", "ecart_2025": "−6 à −9 min", "couleur": "vert" },
      { "code": "B", "nom": "Objectif", "chrono": "2h05 – 2h08", "chrono_min_s": 7500, "chrono_max_s": 7680, "allure": "5:06 – 5:13 /km", "conditions": "Déroulement normal, terrain praticable, test 10 km entre 44:45 et 46:00", "ecart_2025": "−3 à −6 min", "couleur": "jaune" },
      { "code": "C", "nom": "Terrain dégradé", "chrono": "2h11 – 2h16", "chrono_min_s": 7860, "chrono_max_s": 8160, "allure": "5:20 – 5:33 /km", "conditions": "Boue, gel, pluie : le chrono n'est plus comparable", "ecart_2025": "0 à +5 min", "couleur": "orange" }
    ],
    "note_v1": "La grille v1 (A 2h04-2h06, B 2h07-2h09) était décalée d'un cran vers le bas : elle calculait le scénario B comme le chrono 2025 corrigé du seul delta de prédiction Garmin, c'est-à-dire en supposant que onze semaines de travail n'apportent rien."
  },

  "zones_fc": {
    "base": "LTHR estimé 185 (fourchette 183-188). Zones calées sur le LTHR et vérifiées contre 62 séances réelles depuis le 01/06/2026.",
    "alerte": "Les zones affichées PAR LA MONTRE sont fausses : elles sont calées sur une FC de repos de 73 bpm et une FCmax de 190 renseignée par défaut. Ce sont ces zones-ci qui font foi — à reparamétrer dans Garmin Connect.",
    "alerte_v1": "La v1 calculait les zones en %FCmax sur une FCmax de 197 non mesurée, ce qui plaçait la Z2 à 120-137 bpm : deux séances sur 62 y sont entrées depuis juin.",
    "liste": [
      { "zone": "Z1", "nom": "Récupération", "min": 120, "max": 137, "pct_lthr": "65-74 %", "usage": "Décrassage, retour au calme", "remarque": "Rare : trop lent pour elle, sauf lendemain de séance dure." },
      { "zone": "Z2", "nom": "Endurance fondamentale", "min": 138, "max": 155, "pct_lthr": "75-84 %", "usage": "Tous les footings", "remarque": "C'est là que sortent réellement ses footings à 5:30-6:00/km (FC observée 140-152). 70 % du volume." },
      { "zone": "Z3", "nom": "Endurance active", "min": 156, "max": 170, "pct_lthr": "84-92 %", "usage": "Blocs de fin de sortie longue, montées courues", "remarque": "Zone à ne pas surhabiter." },
      { "zone": "Z4", "nom": "Allure course / seuil bas", "min": 171, "max": 183, "pct_lthr": "92-99 %", "usage": "Séances type C, blocs de seuil 2×15', 3×12'", "remarque": "Le cœur du bloc. C'est la zone de la course : 180 de moyenne en 2025." },
      { "zone": "Z5", "nom": "Seuil haut / allure 10 km", "min": 184, "max": 190, "pct_lthr": "99-103 %", "usage": "4×8', 3×2 km, test du 14/11", "remarque": "Plafond : 190 relevé en course." },
      { "zone": "Z6", "nom": "VMA", "min": null, "max": null, "pct_lthr": "—", "usage": "30/30, 200 m, côtes courtes", "remarque": "FC libre : elle n'a pas le temps de monter, on juge sur la qualité de la foulée." }
    ]
  },

  "zones_puissance": {
    "base": "CP Stryd 179 W (màj 12/08/2026). Bandes exprimées en % du CP.",
    "alerte": "Ne jamais utiliser la puissance affichée dans Garmin Connect ou dans l'export : c'est la puissance native Garmin, pas Stryd. Sur l'UTV elle affiche 169 W quand le Stryd lit 108 W. En marche, la puissance native Garmin tombe à 0.",
    "alerte_v2": "Aucune donnée Stryd ne figure dans l'export RGPD. Ces bandes sont des %CP théoriques, à recalibrer sur les fichiers Stryd réels avant la S42.",
    "liste": [
      { "zone": "Z1", "nom": "Facile", "min_w": 116, "max_w": 134, "pct_cp": "65-75 %", "usage": "Décrassage" },
      { "zone": "Z2", "nom": "Endurance", "min_w": 134, "max_w": 152, "pct_cp": "75-85 %", "usage": "Footings, sorties longues", "remarque": "Viser puissance ET FC basses en même temps." },
      { "zone": "Z3", "nom": "Allure course", "min_w": 157, "max_w": 165, "pct_cp": "88-92 %", "usage": "Séances type C", "remarque": "Corrigé : la v1 prescrivait 168-176 W, soit 94-98 % du CP pendant 2 h — intenable." },
      { "zone": "Z4", "nom": "Seuil", "min_w": 172, "max_w": 179, "pct_cp": "96-100 %", "usage": "Blocs 2×15', 3×12'" },
      { "zone": "Z5", "nom": "Intervalle", "min_w": 179, "max_w": 197, "pct_cp": "100-110 %", "usage": "500-800 m, allure 10 km" },
      { "zone": "Z6", "nom": "Répétition", "min_w": 206, "max_w": null, "pct_cp": "115 %+", "usage": "30/30, 200 m" }
    ]
  },

  "allures": {
    "statut": "CALIBRÉES SUR MESURES RÉELLES",
    "valides_jusqu_au": "2026-11-14",
    "alerte": "Ces allures viennent des intervalles réellement courus entre juin et août 2026, relevés tour par tour dans les fichiers .FIT. Elles sont plus rapides de 15 à 20 s/km que celles de la v1, qui étaient déduites de moyennes de séance. Elles seront affinées une première fois après la séance témoin du 24/10, puis figées après le 10 km du 14/11.",
    "liste": [
      { "nom": "EF / Z2", "allure_plat": "5:30 – 6:00 /km", "fc": "138 – 155", "stryd": "134 – 152 W", "mesure_sur": "48 footings de juin à septembre 2026 : 5:33-6:04/km pour FC 140-152", "seances": "Tous les footings, échauffements" },
      { "nom": "Endurance active", "allure_plat": "5:05 – 5:20 /km", "fc": "156 – 170", "stryd": "152 – 160 W", "mesure_sur": "Fins de sorties longues 2026", "seances": "Blocs de fin de SL" },
      { "nom": "Allure course SainteSprint", "allure_plat": "4:52 – 5:00 /km", "allure_parcours": "5:04 – 5:12 /km", "fc": "176 – 182", "stryd": "157 – 165 W", "mesure_sur": "Déduite des blocs de seuil mesurés, moins l'écart seuil→2 h. Cohérente avec les 180 bpm de moyenne tenus 2h05 en 2025.", "seances": "Séances type C" },
      { "nom": "Seuil (60 min)", "allure_plat": "4:32 – 4:42 /km", "fc": "175 – 183", "stryd": "172 – 179 W", "mesure_sur": "12/08 : 2×10' à 4:40 et 4:26 (FC 175-180). 26/08 : 2×6' à 4:30 et 4:25 (FC 175-182).", "seances": "Séances type B" },
      { "nom": "Allure 10 km", "allure_plat": "4:22 – 4:32 /km", "fc": "182 – 188", "stryd": "179 – 190 W", "mesure_sur": "29/07 : 3×8' à 4:38 / 4:29 / 4:18, FC jusqu'à 180. 18/06 : 3 km finaux à 4:28 / 4:17 / 4:17.", "seances": "5×800 m, 4×8', test du 14/11" },
      { "nom": "Allure 5 km", "allure_plat": "4:05 – 4:15 /km", "fc": "186 – 190", "stryd": "195 – 210 W", "mesure_sur": "Extrapolée de l'allure 10 km", "seances": "6×500 m" },
      { "nom": "VMA courte", "allure_plat": "3:48 – 4:00 /km", "fc": "libre", "stryd": "215 – 235 W", "mesure_sur": "Extrapolée", "seances": "30/30, 40/40, 200 m, lignes droites" }
    ]
  },

  "semaines": [
    {
      "id": "S38", "debut": "2026-09-14", "fin": "2026-09-20", "libelle_dates": "14/09 – 20/09",
      "phase": "RECUP", "duree_cible": "~2h30", "km_cible": 0, "nb_seances": 2,
      "focus": "Aucune course à pied. 1 vélo léger + marche + mobilité.",
      "point_cle": "J+2 à J+8 du 85 km. Ne rien faire est la séance.",
      "couleur": "gris",
      "jours": [
        { "date": "2026-09-14", "jour": "lundi", "type": "repos", "titre": "Repos", "contenu": "Repos complet.", "repos": true, "cle": false },
        { "date": "2026-09-15", "jour": "mardi", "type": "repos", "titre": "Repos / mobilité", "contenu": "Mobilité 15' (hanches, chevilles, thoracique).", "repos": true, "cle": false },
        { "date": "2026-09-16", "jour": "mercredi", "type": "velo", "titre": "Vélo 45' très souple", "contenu": "Plateau, Z1 strict, aucune côte. Zéro objectif.", "repos": false, "cle": false },
        { "date": "2026-09-17", "jour": "jeudi", "type": "repos", "titre": "Repos", "contenu": "Repos complet.", "repos": true, "cle": false },
        { "date": "2026-09-18", "jour": "vendredi", "type": "marche", "titre": "Marche 45-60' + mobilité 15'", "contenu": "Marche en nature, terrain plat. Étirements doux.", "repos": false, "cle": false },
        { "date": "2026-09-19", "jour": "samedi", "type": "repos", "titre": "Repos", "contenu": "Repos complet.", "repos": true, "cle": false },
        { "date": "2026-09-20", "jour": "dimanche", "type": "velo", "titre": "Vélo 1h souple OU marche 1h", "contenu": "Aucune intensité. Si les jambes ne suivent pas : marche.", "repos": false, "cle": false }
      ]
    },
    {
      "id": "S39", "debut": "2026-09-21", "fin": "2026-09-27", "libelle_dates": "21/09 – 27/09",
      "phase": "REPRISE", "duree_cible": "~3h30", "km_cible": 26, "nb_seances": 4,
      "focus": "Footings Z2 courts uniquement. Premières lignes droites en fin de semaine. Muscu légère.",
      "point_cle": "Pilotage sur les marqueurs du jour (VFC, FC nocturne, sommeil), pas sur une fenêtre théorique. Si 3 marqueurs sur 4 sont en alerte 2 jours de suite, on retire une séance.",
      "couleur": "rouge",
      "jours": [
        { "date": "2026-09-21", "jour": "lundi", "type": "repos", "titre": "Repos", "contenu": "Repos ou marche.", "repos": true, "cle": false },
        { "date": "2026-09-22", "jour": "mardi", "type": "ef", "titre": "EF 30'", "contenu": "Plat, Z2 bas (FC <145). Première course depuis l'UTV : on teste, on ne performe pas.", "repos": false, "cle": true },
        { "date": "2026-09-23", "jour": "mercredi", "type": "renfo", "titre": "Muscu 45' légère", "contenu": "Charges légères, gainage, mobilité, mollets excentriques. Pas de pliométrie.", "repos": false, "cle": false },
        { "date": "2026-09-24", "jour": "jeudi", "type": "ef", "titre": "EF 35' + 4×20\" lignes droites", "contenu": "Plat, Z2. Lignes droites en accélération progressive, récup marchée complète. Si sensation lourde : 25' et on rentre, sans lignes droites.", "repos": false, "cle": false },
        { "date": "2026-09-25", "jour": "vendredi", "type": "repos", "titre": "Repos", "contenu": "Repos complet.", "repos": true, "cle": false },
        { "date": "2026-09-26", "jour": "samedi", "type": "ef", "titre": "EF 40'", "contenu": "Plat ou chemin roulant, Z2.", "repos": false, "cle": false },
        { "date": "2026-09-27", "jour": "dimanche", "type": "ef", "titre": "EF 50' + 4×20\" lignes droites", "contenu": "Z2 + 4 accélérations progressives de 20\" en fin de séance, récup complète.", "repos": false, "cle": false }
      ]
    },
    {
      "id": "S40", "debut": "2026-09-28", "fin": "2026-10-04", "libelle_dates": "28/09 – 04/10",
      "phase": "REATHLETISATION", "duree_cible": "~4h30", "km_cible": 38, "nb_seances": 5,
      "focus": "Réveil neuromusculaire : côtes courtes, lignes droites, pliométrie légère.",
      "point_cle": "Premier contact avec l'intensité. Toujours pas de bloc long en intensité.",
      "couleur": "vert",
      "jours": [
        { "date": "2026-09-28", "jour": "lundi", "type": "repos", "titre": "Repos", "contenu": "Repos.", "repos": true, "cle": false },
        { "date": "2026-09-29", "jour": "mardi", "type": "cotes", "titre": "Côtes courtes : 20' EF + 8×30\" en côte 6-8 % + 15' EF", "contenu": "Montée en relâchement, PAS à fond. Récup en trot descendant. Objectif : réveiller la foulée.", "repos": false, "cle": true },
        { "date": "2026-09-30", "jour": "mercredi", "type": "renfo", "titre": "Muscu 50' + pliométrie légère", "contenu": "Squat, fentes, mollets excentriques 3×15 par jambe. + skipping 3×20 m et 2×10 foulées bondissantes sur herbe.", "repos": false, "cle": false },
        { "date": "2026-10-01", "jour": "jeudi", "type": "repos", "titre": "Repos ou vélo 45'", "contenu": "Repos ou vélo Z1-Z2.", "repos": true, "cle": false },
        { "date": "2026-10-02", "jour": "vendredi", "type": "ef", "titre": "EF 45' + 6×20\" lignes droites", "contenu": "Lignes droites sur plat ou herbe, accélération progressive jusqu'à allure 3 km, récup marchée 40\".", "repos": false, "cle": false },
        { "date": "2026-10-03", "jour": "samedi", "type": "ef", "titre": "EF 50' Z2", "contenu": "Plat, Z2 (FC 138-155).", "repos": false, "cle": false },
        { "date": "2026-10-04", "jour": "dimanche", "type": "sl", "titre": "SL 1h15 vallonné Z2 + 3' descente en relâchement", "contenu": "Chemin, Z2, dernières 15' en endurance active. Une descente de 3' courue en relâchement, cadence >92.", "repos": false, "cle": false }
      ]
    },
    {
      "id": "S41", "debut": "2026-10-05", "fin": "2026-10-11", "libelle_dates": "05/10 – 11/10",
      "phase": "PREMIER ETALON", "duree_cible": "~4h30", "km_cible": 40, "nb_seances": 5,
      "focus": "Premier bloc de seuil aux allures corrigées. All'en Trail dimanche 11/10 (12 km / 400 m D+) à fond.",
      "point_cle": "Premier des deux points de calibration. Pas d'affûtage : on ne coupe que 2 jours.",
      "couleur": "jaune",
      "jours": [
        { "date": "2026-10-05", "jour": "lundi", "type": "repos", "titre": "Repos", "contenu": "Repos.", "repos": true, "cle": false },
        { "date": "2026-10-06", "jour": "mardi", "type": "seuil", "titre": "Seuil : 20' EF + 2×8' au seuil (r 3') + 12' EF", "contenu": "4:32-4:42/km sur plat ou faux-plat, FC 175-183. Premier vrai contact avec le seuil depuis l'UTV : si les jambes ne suivent pas, on tient l'allure haute de la fourchette.", "repos": false, "cle": true },
        { "date": "2026-10-07", "jour": "mercredi", "type": "renfo", "titre": "Muscu 45'", "contenu": "Entretien, charges modérées, mollets excentriques.", "repos": false, "cle": false },
        { "date": "2026-10-08", "jour": "jeudi", "type": "ef", "titre": "EF 40' + 5×20\" lignes droites", "contenu": "Déblocage.", "repos": false, "cle": false },
        { "date": "2026-10-09", "jour": "vendredi", "type": "repos", "titre": "Repos", "contenu": "Repos complet.", "repos": true, "cle": false },
        { "date": "2026-10-10", "jour": "samedi", "type": "ef", "titre": "EF 30' très souple + 3×1'", "contenu": "Jambes ouvertes : 3 accélérations de 1' à allure 10 km (4:22-4:32).", "repos": false, "cle": false },
        { "date": "2026-10-11", "jour": "dimanche", "type": "course", "titre": "ALL'EN TRAIL — 12 km / 400 m D+ — à fond", "contenu": "Partir vite, tenir. Noter chrono, place, FC moyenne, FC max, allure des sections en montée, ressenti.", "repos": false, "cle": true }
      ]
    },
    {
      "id": "S42", "debut": "2026-10-12", "fin": "2026-10-18", "libelle_dates": "12/10 – 18/10",
      "phase": "DEVELOPPEMENT", "duree_cible": "~5h30", "km_cible": 48, "nb_seances": 6,
      "focus": "Entrée du travail de montée courue (8×1' en côte) et allongement du seuil (2×12').",
      "point_cle": "Deux séances dures : mardi et vendredi. La sortie longue du dimanche est technique, pas intense.",
      "couleur": "bleu",
      "jours": [
        { "date": "2026-10-12", "jour": "lundi", "type": "repos", "titre": "Repos", "contenu": "Repos — 2 jours après la course.", "repos": true, "cle": false },
        { "date": "2026-10-13", "jour": "mardi", "type": "cotes", "titre": "CÔTES COURUES : 20' EF + 8×1' en côte 8-10 % (r descente trot) + 15' EF", "contenu": "Montée COURUE, cadence maintenue >170, buste droit, foulée courte. Effort seuil-haut, FC libre en fin de montée. C'est la séance qui vise directement les 5 km de bosse de la SainteSprint.", "repos": false, "cle": true },
        { "date": "2026-10-14", "jour": "mercredi", "type": "ef", "titre": "EF 45' + muscu 50'", "contenu": "Footing Z2 + muscu avec pliométrie.", "repos": false, "cle": false },
        { "date": "2026-10-15", "jour": "jeudi", "type": "repos", "titre": "Repos ou vélo", "contenu": "Repos ou vélo Z1.", "repos": true, "cle": false },
        { "date": "2026-10-16", "jour": "vendredi", "type": "seuil", "titre": "SEUIL : 20' EF + 2×12' au seuil (r 3') + 12' EF", "contenu": "4:32-4:42/km, FC 175-183. Allure RÉGULIÈRE : le 2e bloc à la même allure que le 1er. Si la FC dérive de plus de 6 bpm dans un bloc, l'allure est trop haute.", "repos": false, "cle": true },
        { "date": "2026-10-17", "jour": "samedi", "type": "ef", "titre": "EF 50' Z2", "contenu": "Z2 strict (138-155).", "repos": false, "cle": false },
        { "date": "2026-10-18", "jour": "dimanche", "type": "sl", "titre": "SL 1h30 Z2 + 4×2' descente technique", "contenu": "Chemin vallonné. Descentes à 3-6 % courues en relâchement total, cadence >92, sans freiner. Technique, pas intensité : la FC ne doit pas être un objectif. Remontée en trot.", "repos": false, "cle": false }
      ]
    },
    {
      "id": "S43", "debut": "2026-10-19", "fin": "2026-10-25", "libelle_dates": "19/10 – 25/10",
      "phase": "DEVELOPPEMENT + CALIBRATION", "duree_cible": "~6h00", "km_cible": 55, "nb_seances": 6,
      "focus": "VMA 6×500 m mardi. Séance témoin 3×10' au seuil samedi 24/10 : deuxième point de calibration.",
      "point_cle": "La séance témoin remplace le 30' contre-la-montre de la v1 : on mesure une allure à FC imposée, on ne déclenche pas un troisième effort maximal.",
      "couleur": "jaune",
      "jours": [
        { "date": "2026-10-19", "jour": "lundi", "type": "repos", "titre": "Repos", "contenu": "Repos.", "repos": true, "cle": false },
        { "date": "2026-10-20", "jour": "mardi", "type": "vma", "titre": "VMA : 20' EF + 6×500 m (r 1'30 trot) + 15' EF", "contenu": "500 m à allure 5 km (4:05-4:15/km). Le 1er doit être le plus lent, pas le plus rapide. Sur piste ou chemin roulant, pas sur bitume.", "repos": false, "cle": true },
        { "date": "2026-10-21", "jour": "mercredi", "type": "ef", "titre": "EF 45' + muscu 50'", "contenu": "Pliométrie maintenue.", "repos": false, "cle": false },
        { "date": "2026-10-22", "jour": "jeudi", "type": "ef", "titre": "EF 40' souple", "contenu": "Z2, jambes ouvertes.", "repos": false, "cle": false },
        { "date": "2026-10-23", "jour": "vendredi", "type": "repos", "titre": "Repos", "contenu": "Repos complet — on prépare la séance témoin.", "repos": true, "cle": false },
        { "date": "2026-10-24", "jour": "samedi", "type": "test", "titre": "SÉANCE TÉMOIN : 20' EF + 3×10' au seuil (r 3') + 10' EF", "contenu": "Sur plat, seule, à FC IMPOSÉE 178-182 — pas à allure imposée. On relève l'allure moyenne de chaque bloc et la dérive de FC. Protocole strictement reproductible : même parcours, même heure, à refaire si besoin. Croisée avec All'en Trail, elle donne les deux points concordants exigés par la règle du plan.", "repos": false, "cle": true },
        { "date": "2026-10-25", "jour": "dimanche", "type": "sl", "titre": "SL 1h30 Z2 + 20' marche rapide en pente raide", "contenu": "Souple, Z2. En 2e partie : 20' de marche rapide soutenue en pente à 15-25 %, bâtons non, mains sur les cuisses. Travail direct des sections marchées de la course.", "repos": false, "cle": false }
      ]
    },
    {
      "id": "S44", "debut": "2026-10-26", "fin": "2026-11-01", "libelle_dates": "26/10 – 01/11",
      "phase": "PIC_VOLUME + SPECIFIQUE", "duree_cible": "~6h30", "km_cible": 58, "nb_seances": 6,
      "focus": "5×800 m à allure 10 km. Première grosse séance spécifique : SL 1h45 dont 2×20' à allure course.",
      "point_cle": "Plus grosse semaine du bloc. Aucune autre semaine ne montera plus haut.",
      "couleur": "bleu",
      "jours": [
        { "date": "2026-10-26", "jour": "lundi", "type": "repos", "titre": "Repos", "contenu": "Repos.", "repos": true, "cle": false },
        { "date": "2026-10-27", "jour": "mardi", "type": "vma", "titre": "VMA : 20' EF + 5×800 m (r 2' trot) + 15' EF", "contenu": "800 m à allure 10 km recalibrée par la séance témoin (base 4:22-4:32/km). Régularité : moins de 3 s d'écart entre le 1er et le 5e.", "repos": false, "cle": true },
        { "date": "2026-10-28", "jour": "mercredi", "type": "ef", "titre": "EF 50' + muscu 50'", "contenu": "Dernière semaine où les charges restent lourdes.", "repos": false, "cle": false },
        { "date": "2026-10-29", "jour": "jeudi", "type": "repos", "titre": "Repos ou vélo 1h", "contenu": "Repos ou vélo Z2.", "repos": true, "cle": false },
        { "date": "2026-10-30", "jour": "vendredi", "type": "ef", "titre": "EF 45' + 6×20\" lignes droites", "contenu": "Z2 + lignes droites. Séance légère : la grosse séance est dimanche.", "repos": false, "cle": false },
        { "date": "2026-10-31", "jour": "samedi", "type": "ef", "titre": "EF 40' très souple", "contenu": "Z2 bas. On prépare dimanche.", "repos": false, "cle": false },
        { "date": "2026-11-01", "jour": "dimanche", "type": "allure_course", "titre": "SL SPÉCIFIQUE 1h45 dont 2×20' ALLURE COURSE (r 5' trot)", "contenu": "Chemin roulant. 30' d'échauffement Z2, puis 2×20' à 4:52-5:00/km sur plat (5:04-5:12 sur terrain roulant), FC 176-182, puis retour au calme. La séance la plus proche de la réalité de la course : blocs placés sur jambes déjà entamées.", "repos": false, "cle": true }
      ]
    },
    {
      "id": "S45", "debut": "2026-11-02", "fin": "2026-11-08", "libelle_dates": "02/11 – 08/11",
      "phase": "SPECIFIQUE + NUIT", "duree_cible": "~6h00", "km_cible": 52, "nb_seances": 6,
      "focus": "3×12' allure course mardi. Deux séances à la frontale : footing jeudi, VMA nocturne samedi.",
      "point_cle": "On arrête de chercher la vitesse pure, on la rend tenable et on l'apprend de nuit.",
      "couleur": "bleu",
      "jours": [
        { "date": "2026-11-02", "jour": "lundi", "type": "repos", "titre": "Repos", "contenu": "Repos.", "repos": true, "cle": false },
        { "date": "2026-11-03", "jour": "mardi", "type": "allure_course", "titre": "ALLURE COURSE : 20' EF + 3×12' (r 3') + 12' EF", "contenu": "4:52-5:00/km sur plat, FC 176-182, Stryd 157-165 W. Sur chemin roulant si possible. Si le 3e bloc demande un effort mental énorme, la cible est trop ambitieuse : on bascule sur le scénario B.", "repos": false, "cle": true },
        { "date": "2026-11-04", "jour": "mercredi", "type": "ef", "titre": "EF 45' + muscu 45'", "contenu": "Charges qui baissent, explosivité qui reste.", "repos": false, "cle": false },
        { "date": "2026-11-05", "jour": "jeudi", "type": "nuit", "titre": "EF 45' À LA FRONTALE", "contenu": "Après 21h, Z2 strict, sur chemin connu. Première sortie de nuit : habituation pure, aucune intensité. Tester la frontale, les réglages de faisceau, la tenue.", "repos": false, "cle": false },
        { "date": "2026-11-06", "jour": "vendredi", "type": "repos", "titre": "Repos", "contenu": "Repos complet.", "repos": true, "cle": false },
        { "date": "2026-11-07", "jour": "samedi", "type": "nuit", "titre": "VMA DE NUIT à la frontale : 20' EF + 12×(40\"/40\") + 15' EF", "contenu": "Après 21h, chemin roulant connu. 40\" à 3:48-4:00/km. Objectif : voir le sol dans un cône de lumière à vitesse élevée. Si la foulée se dégrade sur les 3 derniers, on arrête là.", "repos": false, "cle": true },
        { "date": "2026-11-08", "jour": "dimanche", "type": "sl", "titre": "SL 1h20 Z2 + descentes en relâchement", "contenu": "Souple. Descentes courues en relâchement, sans chercher l'intensité. 15' de marche rapide en pente raide en fin de sortie.", "repos": false, "cle": false }
      ]
    },
    {
      "id": "S46", "debut": "2026-11-09", "fin": "2026-11-15", "libelle_dates": "09/11 – 15/11",
      "phase": "PIC_INTENSITE + TEST", "duree_cible": "~5h00", "km_cible": 48, "nb_seances": 6,
      "focus": "3×(6×200 m) mardi. TEST 10 km chrono samedi 14/11.",
      "point_cle": "Le test fixe le scénario et fige toutes les allures. Volume qui baisse, intensité qui monte.",
      "couleur": "jaune",
      "jours": [
        { "date": "2026-11-09", "jour": "lundi", "type": "repos", "titre": "Repos", "contenu": "Repos.", "repos": true, "cle": false },
        { "date": "2026-11-10", "jour": "mardi", "type": "vma", "titre": "VMA courte : 20' EF + 3×(6×200 m, r 45\", R 3') + 15' EF", "contenu": "200 m à 3:48-4:00/km. Travail de foulée pure : c'est une séance technique, pas une séance de souffle. Sur piste ou chemin roulant, pas sur bitume (périoste).", "repos": false, "cle": true },
        { "date": "2026-11-11", "jour": "mercredi", "type": "ef", "titre": "EF 45' + muscu 40'", "contenu": "Dernière muscu avec charges du bloc.", "repos": false, "cle": false },
        { "date": "2026-11-12", "jour": "jeudi", "type": "ef", "titre": "EF 35' souple", "contenu": "Z2.", "repos": false, "cle": false },
        { "date": "2026-11-13", "jour": "vendredi", "type": "repos", "titre": "Repos", "contenu": "Repos complet.", "repos": true, "cle": false },
        { "date": "2026-11-14", "jour": "samedi", "type": "test", "titre": "TEST 10 KM CHRONO sur plat", "contenu": "20' échauffement + 4×20\" + 10 km à fond, sur plat, chronométré, montre sur allure moyenne masquée. Sous 44:45 : scénario A. De 44:45 à 46:00 : scénario B. Au-delà de 46:00 : scénario B prudent (2h08-2h11). La FC moyenne des 20 dernières minutes donne le LTHR réel, à comparer aux 185 estimés.", "repos": false, "cle": true },
        { "date": "2026-11-15", "jour": "dimanche", "type": "sl", "titre": "SL 1h20 Z2 souple", "contenu": "Récupération. Aucune intensité.", "repos": false, "cle": false }
      ]
    },
    {
      "id": "S47", "debut": "2026-11-16", "fin": "2026-11-22", "libelle_dates": "16/11 – 22/11",
      "phase": "REDUCTION", "duree_cible": "~4h30", "km_cible": 42, "nb_seances": 5,
      "focus": "Volume −25 %, intensité maintenue. 2×20' allure course mardi. SL nocturne samedi 21/11, départ 22h30.",
      "point_cle": "Répétition générale complète : horaire, frontale, tenue, sac, ravitaillement, et journée organisée comme le jour J.",
      "couleur": "bleu",
      "jours": [
        { "date": "2026-11-16", "jour": "lundi", "type": "repos", "titre": "Repos", "contenu": "Repos.", "repos": true, "cle": false },
        { "date": "2026-11-17", "jour": "mardi", "type": "allure_course", "titre": "ALLURE COURSE : 15' EF + 2×20' (r 4') + 10' EF", "contenu": "Dernière grosse séance spécifique. Allure figée par le test du 14/11. FC 176-182.", "repos": false, "cle": true },
        { "date": "2026-11-18", "jour": "mercredi", "type": "ef", "titre": "EF 40' + muscu légère 30'", "contenu": "Entretien seulement, plus de charges lourdes. Mollets excentriques maintenus.", "repos": false, "cle": false },
        { "date": "2026-11-19", "jour": "jeudi", "type": "repos", "titre": "Repos", "contenu": "Repos.", "repos": true, "cle": false },
        { "date": "2026-11-20", "jour": "vendredi", "type": "ef", "titre": "EF 35' + 6×20\" lignes droites", "contenu": "Jambes vives.", "repos": false, "cle": false },
        { "date": "2026-11-21", "jour": "samedi", "type": "nuit", "titre": "SL NOCTURNE — départ 22h30, 1h30 dont 30' allure course", "contenu": "RÉPÉTITION GÉNÉRALE COMPLÈTE : même heure de départ, même frontale (piles neuves testées), même tenue, même sac, même ravitaillement liquide et solide, même repas à 18h30 et sieste l'après-midi. 30' à allure course en 2e partie. On note tout ce qui gêne — c'est le dernier moment pour corriger.", "repos": false, "cle": true },
        { "date": "2026-11-22", "jour": "dimanche", "type": "ef", "titre": "EF 45' très souple", "contenu": "Décrassage. Dormir le lendemain matin.", "repos": false, "cle": false }
      ]
    },
    {
      "id": "S48", "debut": "2026-11-23", "fin": "2026-11-29", "libelle_dates": "23/11 – 29/11",
      "phase": "AFFUTAGE", "duree_cible": "~2h30", "km_cible": 22, "nb_seances": 4,
      "focus": "Deux touches courtes de rappel, repos vendredi. COURSE SAMEDI 28/11 à 23h00.",
      "point_cle": "Décalage progressif du sommeil dès le mardi + sieste obligatoire le samedi après-midi + hébergement à l'arrivée réservé.",
      "couleur": "vert",
      "jours": [
        { "date": "2026-11-23", "jour": "lundi", "type": "ef", "titre": "EF 35' + 4×20\"", "contenu": "Z2, jambes ouvertes.", "repos": false, "cle": false },
        { "date": "2026-11-24", "jour": "mardi", "type": "rappel", "titre": "RAPPEL : 15' EF + 6×1' allure 10 km (r 1'30) + 10' EF", "contenu": "Court et vif. Aucune fatigue résiduelle en sortant.", "repos": false, "cle": false },
        { "date": "2026-11-25", "jour": "mercredi", "type": "ef", "titre": "EF 30' + 4×20\"", "contenu": "Très souple.", "repos": false, "cle": false },
        { "date": "2026-11-26", "jour": "jeudi", "type": "rappel", "titre": "RAPPEL COURT : 12' EF + 10' allure course + 8' EF", "contenu": "Dernière touche. On sort en ayant envie d'en faire plus. Cible chrono figée ce soir-là, au vu de la météo annoncée.", "repos": false, "cle": false },
        { "date": "2026-11-27", "jour": "vendredi", "type": "repos", "titre": "Repos complet", "contenu": "Repos total. Sac préparé. Coucher tardif (voir protocole nuit).", "repos": true, "cle": false },
        { "date": "2026-11-28", "jour": "samedi", "type": "course", "titre": "COURSE — SainteSprint 24 km, départ 23h00", "contenu": "Réveil libre, sieste 15h-17h OBLIGATOIRE, repas principal vers 18h30, collation légère vers 21h30. Voir plan de course pour le pacing section par section.", "repos": false, "cle": true },
        { "date": "2026-11-29", "jour": "dimanche", "type": "recup", "titre": "Récupération", "contenu": "Aucune course à pied. Marche douce si envie. Voir protocole de récupération.", "repos": false, "cle": false }
      ]
    }
  ],

  "catalogue_seances": [
    {
      "famille": "A", "nom": "VITESSE / VMA", "objectif": "Entretenir le haut du moteur et allonger la foulée",
      "seances": [
        { "code": "A1", "structure": "12 × (40\" / 40\")", "programmee": "S45 (07/11, de nuit)", "execution": "40\" à 3:48-4:00/km, 40\" de trot. Sur plat.", "cibles": "FC libre · Stryd 215-235 W", "vigilance": "Ne pas regarder la FC : elle n'a pas le temps de monter. On juge sur la qualité de la foulée." },
        { "code": "A2", "structure": "6 × 500 m (r 1'30 trot)", "programmee": "S43 (20/10)", "execution": "Allure 5 km (4:05-4:15/km).", "cibles": "FC 186-190 en fin de bloc", "vigilance": "Le 1er doit être le plus lent, pas le plus rapide." },
        { "code": "A3", "structure": "5 × 800 m (r 2' trot)", "programmee": "S44 (27/10)", "execution": "Allure 10 km recalibrée (base 4:22-4:32/km).", "cibles": "FC 182-188", "vigilance": "Régularité : moins de 3 s d'écart entre le 1er et le 5e." },
        { "code": "A4", "structure": "3 × (6 × 200 m, r 45\", R 3')", "programmee": "S46 (10/11)", "execution": "3:48-4:00/km. Travail de foulée pure.", "cibles": "FC libre · Stryd 225-245 W", "vigilance": "Séance technique, pas séance de souffle. Jamais sur bitume." },
        { "code": "A5", "structure": "Lignes droites 4 à 6 × 20\"", "programmee": "S39 à S48, en fin de footing", "execution": "Accélération progressive jusqu'à allure 3 km, récup marchée 40\".", "cibles": "—", "vigilance": "Le rappel de vitesse le moins coûteux qui existe." }
      ]
    },
    {
      "famille": "B", "nom": "SEUIL", "objectif": "Élever le plafond soutenable — déterminant n°1 sur 2 heures",
      "seances": [
        { "code": "B1", "structure": "2 × 8' (r 3' trot)", "programmee": "S41 (06/10)", "execution": "Plat ou faux-plat régulier. 4:32-4:42/km.", "cibles": "FC 175-183 · Stryd 172-179 W", "vigilance": "Reprise : viser le haut de la fourchette d'allure." },
        { "code": "B2", "structure": "2 × 12' (r 3')", "programmee": "S42 (16/10)", "execution": "4:32-4:42/km.", "cibles": "FC 175-183", "vigilance": "La FC doit se stabiliser, pas grimper. Dérive de +6 bpm = allure trop haute." },
        { "code": "B3", "structure": "3 × 10' (r 3') à FC imposée", "programmee": "S43 (24/10) — séance témoin", "execution": "FC imposée 178-182, allure libre. On mesure l'allure obtenue.", "cibles": "FC 178-182", "vigilance": "Protocole reproductible : même parcours, même heure, même conditions. C'est un instrument de mesure, pas une séance de performance." },
        { "code": "B4", "structure": "Côtes courues 8 × 1' à 8-10 %", "programmee": "S42 (13/10)", "execution": "Montée courue, cadence >170, buste droit, foulée courte. Récup en trot descendant.", "cibles": "FC libre en fin de montée, 175+ ", "vigilance": "Séance ajoutée en v2 : elle vise les 5 km de bosse qui ont coûté 8 min 30 en 2025." }
      ]
    },
    {
      "famille": "C", "nom": "ALLURE COURSE", "objectif": "Rendre l'allure SainteSprint automatique et tenable 2 heures",
      "seances": [
        { "code": "C1", "structure": "3 × 12' (r 3')", "programmee": "S45 (03/11)", "execution": "4:52-5:00/km sur plat, 5:04-5:12/km sur terrain de course.", "cibles": "FC 176-182 · Stryd 157-165 W", "vigilance": "Sur chemin roulant de préférence." },
        { "code": "C2", "structure": "2 × 20' (r 4')", "programmee": "S47 (17/11)", "execution": "Idem, blocs longs, allure figée par le test du 14/11.", "cibles": "FC 176-182", "vigilance": "Si le 2e bloc demande un effort mental énorme, on bascule sur le scénario B." },
        { "code": "C3", "structure": "2 × 20' en fin de SL 1h45", "programmee": "S44 (01/11)", "execution": "Sur jambes déjà entamées, après 30' de Z2.", "cibles": "FC 176-182", "vigilance": "La séance la plus proche de la réalité de la course. C'est le rendez-vous à ne pas manquer du bloc." },
        { "code": "C4", "structure": "30' continu en SL nocturne", "programmee": "S47 (21/11)", "execution": "2e partie de la répétition générale, à la frontale, après 22h30.", "cibles": "FC 176-182", "vigilance": "Double objectif : spécifique et validation du matériel." }
      ]
    },
    {
      "famille": "D", "nom": "MONTÉE ET DESCENTE", "objectif": "Reprendre du temps en montée, entretenir l'acquis en descente",
      "seances": [
        { "code": "D1", "structure": "20' de marche rapide en pente raide (15-25 %)", "programmee": "S43 (25/10), S45 (08/11)", "execution": "En 2e partie de sortie longue. Mains sur les cuisses, buste penché, rythme soutenu et régulier.", "cibles": "FC 156-170", "vigilance": "Séance ajoutée en v2. Cinq km de la SainteSprint ont été marchés à 6:27-7:31 en 2025 avec une cadence à 156-166." },
        { "code": "D2", "structure": "4 à 6 × 2' de descente à 3-6 %", "programmee": "S40 (04/10), S42 (18/10), S45 (08/11)", "execution": "Courue en relâchement total, cadence >92, sans freiner. Remontée en trot.", "cibles": "FC libre — technique, pas intensité", "vigilance": "Point fort déjà acquis : on entretient, on ne développe pas. Ne compte pas comme séance dure." },
        { "code": "D3", "structure": "Descente roulante en fin de SL", "programmee": "Optionnel, S44 ou S45", "execution": "Les 15 dernières minutes de la SL en descente roulante, à bonne vitesse.", "cibles": "FC 156-172", "vigilance": "Prépare les quadriceps à encaisser 628 m de descente d'affilée." }
      ]
    },
    {
      "famille": "E", "nom": "RENFORCEMENT", "objectif": "Protéger et allonger la foulée",
      "seances": [
        { "code": "E1", "structure": "Muscu 45-50'", "programmee": "S39 à S47, hebdomadaire", "execution": "Squat, fentes, soulevé de terre jambes tendues, mollets excentriques 3×15 par jambe.", "cibles": "—", "vigilance": "Les mollets excentriques sont la prévention du périoste tibial. Charges lourdes jusqu'à S46, entretien ensuite." },
        { "code": "E2", "structure": "Pliométrie légère", "programmee": "À partir de S40", "execution": "Skipping 3×20 m, foulées bondissantes 2×10, montées de genoux.", "cibles": "—", "vigilance": "Sur surface souple (herbe, piste)." },
        { "code": "E3", "structure": "Gainage postérieur + mobilité thoracique", "programmee": "10-15' en fin de muscu", "execution": "—", "cibles": "—", "vigilance": "Chantier hérité de l'UTV (douleurs dos/épaules). Moins critique ici — sac léger — mais on entretient." }
      ]
    }
  ],

  "protocole_nuit": {
    "constat": [
      { "cle": "Heure de coucher habituelle", "valeur": "22h48 en médiane (88 nuits mesurées depuis le 15/06/2026), sommeil médian 7h54. Elle se couche après 23h30 dans 23 % des cas." },
      { "cle": "Départ de la course", "valeur": "23h00 (confirmé sur saintelyon.com), soit 12 minutes après l'heure où elle s'endort d'habitude" },
      { "cle": "Fenêtre d'effort maximal", "valeur": "23h00 à environ 01h05, c'est-à-dire exactement le creux circadien" },
      { "cle": "Ce qui s'est passé en 2025", "valeur": "Nuit avant : 8h29, score 83 — la préparation a marché. Nuit après : endormissement à 04h59, 3h35 de sommeil, score 26. Puis le pire faisceau santé des 30 mois de données le 01/12, normalisé le 02/12." },
      { "cle": "Conclusion", "valeur": "La préparation d'avant-course est à reproduire à l'identique. Le trou est ailleurs : 3h30 entre l'arrivée et le coucher. C'est un problème de logistique, pas d'entraînement." }
    ],
    "habituation": [
      { "quand": "2026-11-05", "seance": "EF 45' à la frontale", "objectif": "Premier contact, matériel et réglages", "detail": "Après 21h, Z2 strict, chemin connu. Tester faisceau, autonomie, tenue." },
      { "quand": "2026-11-07", "seance": "VMA de nuit à la frontale", "objectif": "Voir le sol à vitesse élevée dans un cône de lumière", "detail": "Après 21h, chemin roulant connu, 12×(40\"/40\")." },
      { "quand": "2026-11-21", "seance": "SL nocturne, départ 22h30, 1h30 dont 30' allure course", "objectif": "Répétition générale complète", "detail": "Même heure, même frontale (piles neuves), même tenue, même sac, même ravitaillement. Journée organisée comme le jour J : sieste l'après-midi, repas principal vers 18h30." }
    ],
    "logistique_jour_j": [
      { "sujet": "Navettes et sas", "consigne": "Le départ est à Soucieu-en-Jarrest et l'arrivée à Lyon : vérifier dès réception du dossard l'horaire des navettes aller et le délai entre l'arrivée sur site et le départ. À intégrer au rétroplanning du repas de 18h30 et de la collation de 21h30.", "statut": "à confirmer sur le règlement 2026" },
      { "sujet": "Hébergement à l'arrivée", "consigne": "Réserver une chambre à Lyon, à proximité de l'arrivée. Objectif : être couchée moins de 90 minutes après le passage de la ligne, soit vers 02h45 au lieu de 04h59 en 2025.", "statut": "à réserver avant fin octobre" },
      { "sujet": "Retour", "consigne": "Aucun trajet long le dimanche matin. Départ en milieu de journée au plus tôt, conduite par quelqu'un d'autre si possible.", "statut": "à caler" },
      { "sujet": "Objectif sommeil nuit d'après", "consigne": "5 heures minimum. C'est le levier le plus rentable du week-end.", "statut": "—" }
    ],
    "decalage_sommeil": [
      { "date": "2026-11-23", "coucher": "22h45", "lever": "libre", "consigne": "Semaine normale." },
      { "date": "2026-11-24", "coucher": "23h15", "lever": "libre", "consigne": "On commence à décaler. Lumière forte le soir, écrans autorisés." },
      { "date": "2026-11-25", "coucher": "23h45", "lever": "libre", "consigne": "Décalage +30 min." },
      { "date": "2026-11-26", "coucher": "00h15", "lever": "libre", "consigne": "Figer la cible chrono ce soir-là, au vu de la météo annoncée." },
      { "date": "2026-11-27", "coucher": "00h45", "lever": "vers 9h-10h", "consigne": "Repos total. Sac préparé." },
      { "date": "2026-11-28", "coucher": "sieste 15h-17h obligatoire", "lever": "libre", "consigne": "La sieste est la séance la plus importante de la journée. Repas principal vers 18h30 (3-4 h avant le départ), collation légère vers 21h30." }
    ],
    "decalage_alerte": "Le décalage progressif n'est utile que s'il est tenu. S'il perturbe la vie de famille, mieux vaut une nuit normale plus une longue sieste le samedi qu'un décalage à moitié fait.",
    "recuperation": [
      { "quand": "2026-11-28 nuit", "consigne": "Couchée dans les 90 minutes suivant l'arrivée. C'est la consigne la plus importante du protocole." },
      { "quand": "2026-11-29", "consigne": "Aucune course à pied. Dormir autant que le corps le demande, y compris en journée. Marche douce si envie. Repas riches, hydratation." },
      { "quand": "2026-11-30 → 2026-12-02", "consigne": "Zéro course à pied. Marche et mobilité uniquement." },
      { "quand": "2026-12-03", "consigne": "Reprise possible : 30' de footing Z1, seulement si la FC de repos est revenue sous 64 et le sommeil au-dessus de 7 h." },
      { "quand": "Signal d'arrêt", "consigne": "Si 3 marqueurs sur 4 (stress nocturne >31, Body Battery réveil <47, recoveryTime >3373 min, FC de repos) sont en alerte 2 jours de suite, on prolonge la coupure. Repère 2025 : les marqueurs étaient revenus dans la norme dès J+3." }
    ]
  },

  "tests": [
    {
      "date": "2026-10-11", "nom": "All'en Trail — 12 km / 400 m D+",
      "protocole": "Course réelle, à fond. Noter chrono, place, FC moyenne, FC max, allure des sections en montée, ressenti.",
      "exploitation": "Premier des deux points de calibration. On regarde surtout le comportement en montée : c'est le chantier du bloc.",
      "cle": true
    },
    {
      "date": "2026-10-24", "nom": "Séance témoin 3×10' au seuil",
      "protocole": "20' échauffement + 3×10' à FC imposée 178-182 (allure libre, r 3') + 10' retour au calme. Sur plat, seule, même parcours à chaque répétition du protocole.",
      "exploitation": "Deuxième point de calibration. L'allure moyenne obtenue à FC 178-182 donne l'allure seuil réelle et permet de réécrire les familles B et C. Remplace le 30' contre-la-montre de la v1 : on mesure sans déclencher un troisième effort maximal sur une athlète qui sort d'un 85 km.",
      "cle": true
    },
    {
      "date": "2026-11-14", "nom": "10 km chrono",
      "protocole": "20' échauffement + 4×20\" + 10 km à fond sur plat, chronométré, allure moyenne masquée.",
      "exploitation": "Fige la cible. Sous 44:45 : scénario A (2h02-2h05). De 44:45 à 46:00 : scénario B (2h05-2h08). Au-delà de 46:00 : scénario B prudent (2h08-2h11). La FC moyenne des 20 dernières minutes donne le LTHR réel.",
      "cle": true
    }
  ],

  "regles": [
    { "titre": "Les allures viennent des tours, pas des moyennes", "detail": "Toute réévaluation d'allure se fait sur les intervalles relevés dans le .FIT, jamais sur l'allure moyenne affichée par la séance. L'écart est de 30 à 60 s/km et c'est ce qui a produit le diagnostic erroné de la v1." },
    { "titre": "Deux points concordants", "detail": "On ne recalibre jamais sur une seule course ou une seule séance. La recalibration du 25/10 croise All'en Trail (11/10) et la séance témoin (24/10). Si les deux se contredisent, on refait la séance témoin le 31/10 avant de bouger quoi que ce soit." },
    { "titre": "Deux séances dures maximum", "detail": "Par semaine, jamais trois, quelle que soit la forme du moment. Les descentes en relâchement et la marche rapide en côte ne comptent pas comme séances dures ; les côtes courues (B4) et les blocs à allure course en fin de SL (C3) comptent." },
    { "titre": "Jamais deux montées à la fois", "detail": "Le volume ne monte jamais la même semaine que l'intensité. Si une semaine déborde, c'est le volume qu'on coupe, jamais la séance spécifique." },
    { "titre": "Fatigue", "detail": "On retire une séance de qualité (jamais un footing) si 3 marqueurs sur 4 sont en alerte 2 jours de suite : stress nocturne >31,3 · Body Battery au réveil <47 · recoveryTime >3373 min · FC de repos élevée." },
    { "titre": "FC de repos", "detail": "Correction saisonnière indispensable. Sa FC de repos monte naturellement en hiver (décembre 64,5 contre 59,8 en août). Seuil d'alerte : 63 bpm en septembre, environ 67 bpm en novembre. Ne pas s'alarmer d'une remontée progressive." },
    { "titre": "Périoste tibial", "detail": "Drapeau à 1,5/3 début septembre, résolu au 15/09. La vitesse sur surface dure est le facteur de risque principal du bloc : mollets excentriques à chaque muscu, VMA sur chemin roulant ou piste plutôt que bitume, arrêt immédiat de l'intensité à la moindre douleur au repos." },
    { "titre": "RPE", "detail": "Ne fonder aucune décision sur l'effort perçu, l'échelle a dérivé chez elle. Les colonnes exploitables du fichier ressentis sont Jambes /5, Forme /5 et les douleurs 0-3." },
    { "titre": "Dénivelé affiché", "detail": "L'altimètre barométrique de son Epix Pro est défaillant : il a annoncé 456 m de D+ sur 8 km à Montélimar et 14 795 m sur l'UTV. Ne juger aucune séance sur le D+ de la montre. Source de vérité : Strava, et le GPX officiel pour le parcours de course." },
    { "titre": "FC en début de séance", "detail": "Les 5 à 10 premières minutes de lecture optique par temps froid sont inexploitables (144-148 bpm à 4:20/km relevés au départ de la SainteSprint 2025). Ne jamais piloter le début d'une séance ou d'une course à la FC." }
  ],

  "sources": [
    { "donnee": "Allures de seuil et de 10 km", "source": "Fichiers .FIT tour par tour, DI-Connect-Uploaded-Files : séances des 18/06, 16/07, 29/07, 12/08, 26/08/2026", "fiabilite": "Élevée — donnée native de la montre, lue au tour" },
    { "donnee": "Perf SainteSprint 2025", "source": "Export RGPD Garmin 2026-09-14, activité 21126611307 du 29/11/2025 + .FIT tour par tour (25 tours)", "fiabilite": "Élevée — mais c'est le temps montre, pas le chrono officiel" },
    { "donnee": "FC moyenne réelle en course", "source": "Moyenne des tours 4 à 25 de la même activité : 180 bpm", "fiabilite": "Élevée" },
    { "donnee": "Sections coûteuses du parcours", "source": "Tours 9, 15, 19, 20, 21 de la même activité (cadence 156-166)", "fiabilite": "Élevée sur le comportement, faible sur le D+ absolu (altimètre)" },
    { "donnee": "Distribution de FC à l'entraînement", "source": "62 séances de course depuis le 01/06/2026, summarizedActivities", "fiabilite": "Élevée" },
    { "donnee": "Charge hebdomadaire", "source": "651 activités de l'export, agrégées par semaine ISO", "fiabilite": "Élevée en durée et distance, nulle en D+" },
    { "donnee": "VO2max et prédictions", "source": "DI-Connect-Metrics — MetricsMaxMetData et RunRacePredictions", "fiabilite": "Moyenne — tendance uniquement, jamais utilisées pour prescrire ni pour calculer la cible" },
    { "donnee": "FC de repos, sommeil, VFC", "source": "DI-Connect-Aggregator (UDSFile), DI-Connect-Wellness (sleepData, healthStatusData)", "fiabilite": "Élevée" },
    { "donnee": "Absence de creux J+10/J+14", "source": "healthStatusData sur les 20 jours suivant le 25/04, le 28/06 et le 23/08/2026", "fiabilite": "Élevée — aucun motif reproductible" },
    { "donnee": "Zones montre erronées", "source": "DI-Connect-Wellness/heartRateZones.json : FC repos 73, FCmax 190, LTHR 177", "fiabilite": "Élevée" },
    { "donnee": "CP Stryd 179 W", "source": "Mise à jour Stryd du 12/08/2026 — donnée externe, absente de l'export RGPD", "fiabilite": "Déclarative" },
    { "donnee": "Horaire et distance 2026", "source": "saintelyon.com, page SaintéSprint, consultée le 15/09/2026 : 24 km, 28/11/2026, 23h00, D+ « à venir »", "fiabilite": "Élevée" },
    { "donnee": "All'en Trail du 11/10", "source": "Information donnée par Mathieu le 15/09/2026", "fiabilite": "Déclarative" }
  ],

  "questions_ouvertes": [
    { "sujet": "Le chrono officiel de 2025", "detail": "On travaille sur 2h11:24 relevé par la montre sur 24,57 km. Le temps officiel (puce) et la distance officielle (24 km) peuvent différer. À récupérer sur les résultats de la SaintéLyon 2025 avant de figer la cible le 26/11.", "bloquant": true },
    { "sujet": "Les données Stryd", "detail": "Aucune donnée Stryd dans l'export RGPD : toutes les bandes de puissance sont des %CP théoriques. Récupérer les fichiers Stryd (PowerCenter) pour les caler avant la S42, sinon supprimer la puissance du pilotage et ne garder que FC et allure.", "bloquant": true },
    { "sujet": "Le profil 2026", "detail": "Dénivelé officiel 2026 non publié. On travaille sur les 466 m D+ / 628 m D− relevés par une montre dont l'altimètre est déclaré défaillant. À remplacer par le GPX officiel dès publication : c'est lui qui déterminera la répartition réelle des sections marchées.", "bloquant": false },
    { "sujet": "Navettes et sas de départ", "detail": "Horaire des navettes depuis Lyon et délai d'attente sur site inconnus. Ils conditionnent le rétroplanning du repas et de la collation.", "bloquant": false },
    { "sujet": "Les conditions de 2025", "detail": "Impossible de savoir a posteriori si le terrain était sec ou gras. Sans cette information, la comparaison de chrono d'une année sur l'autre reste approximative.", "bloquant": false },
    { "sujet": "Le plan de course", "detail": "Ce document est le plan d'entraînement. Le plan de course (pacing section par section, gestion des cinq montées, nutrition, hydratation, matériel) sera construit séparément, à partir du GPX officiel dès sa publication.", "bloquant": false }
  ]
}
;
