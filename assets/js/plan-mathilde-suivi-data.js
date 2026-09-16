window.PLAN_MATHILDE_SUIVI_SCHEMA = {
  "meta": {
    "schema_version": "1.0",
    "titre": "Suivi post-séance — formulaire de validation et schéma de base",
    "genere_le": "2026-09-16",
    "athlete": "Mathilde",
    "contexte": "Formulaire affiché sur le site au moment où l'athlète valide une séance du plan SainteSprint. Une soumission = un enregistrement.",
    "remplace": "Kit_Nouvel_Athlete_v1.2/Templates/T09_Ressentis_modele.csv pour la durée de ce bloc",
    "retires_volontairement": [
      "Frontale et matériel nuit — géré par l'athlète, aucune saisie",
      "Chaussures — déjà suivi dans Strava, aucune saisie",
      "Heure de coucher et de lever — mesuré par la montre, plus fiable que le déclaratif",
      "Poids du matin — 4 mesures dans l'export depuis décembre 2023, pas de balance connectée",
      "Nutrition, hydratation, frottements — hors sujet sur 2 heures, à réactiver en S47-S48"
    ],
    "principe": "Un champ n'existe que si l'on peut nommer la décision qu'il change. Chaque champ ci-dessous est relié à une règle de la section regles_alerte.",
    "temps_de_saisie_cible": "30 secondes pour un footing, 60 secondes pour une séance de qualité",
    "confidentiel": true
  },

  "echelles": {
    "rpe": {
      "code": "borg_cr10",
      "libelle": "Effort perçu de la séance",
      "aide": "À noter au moins 20 minutes après la fin de la séance, pas pendant. Question posée : « globalement, à quel point la séance a-t-elle été dure ? »",
      "min": 1,
      "max": 10,
      "pas": 1,
      "ancrages": [
        { "valeur": 1, "libelle": "Très très facile", "repere": "Je pourrais tenir ça des heures" },
        { "valeur": 2, "libelle": "Très facile", "repere": "Conversation complète sans effort" },
        { "valeur": 3, "libelle": "Facile", "repere": "Footing de récupération" },
        { "valeur": 4, "libelle": "Modéré", "repere": "Footing normal, phrases complètes" },
        { "valeur": 5, "libelle": "Un peu dur", "repere": "Endurance active, phrases courtes" },
        { "valeur": 6, "libelle": "Dur", "repere": "Allure course, quelques mots à la fois" },
        { "valeur": 7, "libelle": "Très dur", "repere": "Seuil, je compte les minutes" },
        { "valeur": 8, "libelle": "Très très dur", "repere": "Allure 10 km, je ne parle plus" },
        { "valeur": 9, "libelle": "Presque maximal", "repere": "Je termine mais je ne recommencerais pas" },
        { "valeur": 10, "libelle": "Maximal", "repere": "Je n'aurais pas pu faire une répétition de plus" }
      ],
      "note_derive": "Les repères verbaux doivent rester affichés à chaque saisie, pas seulement au premier usage : c'est le seul mécanisme qui empêche l'échelle de glisser dans le temps. Voir regles_alerte.controle_derive_rpe."
    },
    "douleur": {
      "code": "douleur_0_3",
      "libelle": "Niveau de douleur",
      "min": 0,
      "max": 3,
      "ancrages": [
        { "valeur": 0, "libelle": "Rien", "repere": "Aucune sensation" },
        { "valeur": 1, "libelle": "Gêne", "repere": "Je la sens, elle ne change rien à ce que je fais" },
        { "valeur": 2, "libelle": "Douleur", "repere": "Elle modifie ma foulée ou m'oblige à ralentir" },
        { "valeur": 3, "libelle": "Bloquant", "repere": "Elle m'empêche de courir" }
      ]
    },
    "ressenti_5": {
      "code": "ressenti_1_5",
      "min": 1,
      "max": 5,
      "ancrages": [
        { "valeur": 1, "libelle": "Très mauvais" },
        { "valeur": 2, "libelle": "Mauvais" },
        { "valeur": 3, "libelle": "Correct" },
        { "valeur": 4, "libelle": "Bon" },
        { "valeur": 5, "libelle": "Excellent" }
      ]
    }
  },

  "zones_douleur": {
    "affichees_par_defaut": ["tibia", "quadriceps"],
    "justification_defaut": "Tibia : drapeau périoste levé début septembre 2026, et la montée en vitesse sur surface dure est le facteur de risque principal du bloc. Quadriceps : 628 m de descente sur le parcours.",
    "liste": [
      { "code": "tibia", "libelle": "Tibia", "lateralise": true, "priorite": 1 },
      { "code": "quadriceps", "libelle": "Cuisse / quadriceps", "lateralise": true, "priorite": 2 },
      { "code": "mollet", "libelle": "Mollet", "lateralise": true, "priorite": 3 },
      { "code": "achille", "libelle": "Tendon d'Achille", "lateralise": true, "priorite": 3 },
      { "code": "genou", "libelle": "Genou", "lateralise": true, "priorite": 3 },
      { "code": "ischio", "libelle": "Ischio-jambier", "lateralise": true, "priorite": 3 },
      { "code": "pied", "libelle": "Pied", "lateralise": true, "priorite": 3 },
      { "code": "hanche", "libelle": "Hanche", "lateralise": true, "priorite": 3 },
      { "code": "dos", "libelle": "Dos", "lateralise": false, "priorite": 3 },
      { "code": "autre", "libelle": "Autre", "lateralise": true, "priorite": 4, "saisie_libre": true }
    ],
    "moments": [
      { "code": "reveil", "libelle": "Au réveil", "aide": "Avant de poser le pied par terre", "poids_decision": "fort", "note": "Une douleur présente au réveil est le signal le plus discriminant : elle distingue une périostite qui régresse d'une lésion osseuse qui progresse." },
      { "code": "journee", "libelle": "Dans la journée", "aide": "Au repos, assise ou en marchant", "poids_decision": "fort", "note": "Douleur au repos = arrêt immédiat de l'intensité, règle du plan." },
      { "code": "seance", "libelle": "Pendant la séance", "aide": "À l'échauffement, pendant, ou en fin de séance", "poids_decision": "moyen", "note": "Une gêne qui disparaît après l'échauffement et ne revient pas est banale. Une douleur qui augmente au fil de la séance ne l'est pas." }
    ],
    "champ_complementaire": {
      "code": "evolution_seance",
      "libelle": "Pendant la séance, la douleur a…",
      "options": ["disparu à l'échauffement", "est restée stable", "a augmenté", "sans objet"],
      "condition": "douleur.seance >= 1",
      "note": "Champ décisif : « a augmenté » est un drapeau, « disparu à l'échauffement » ne l'est pas, à niveau égal."
    }
  },

  "formulaire": {
    "declencheur": "Validation d'une séance du plan",
    "sections": [
      {
        "code": "seance",
        "titre": "La séance",
        "toujours_visible": true,
        "champs": [
          { "code": "date", "libelle": "Date", "type": "date", "requis": true, "prerempli": "date du jour" },
          { "code": "seance_id", "libelle": "Séance", "type": "reference", "requis": true, "prerempli": "séance du plan pour cette date", "source": "2026-11_SainteSprint24K_Plan_v2.json → semaines[].jours[]" },
          { "code": "execution", "libelle": "Séance réalisée", "type": "enum", "requis": true, "defaut": "conforme",
            "options": [
              { "valeur": "conforme", "libelle": "Comme prévu" },
              { "valeur": "allegee", "libelle": "Allégée (volume réduit)" },
              { "valeur": "modifiee", "libelle": "Modifiée (contenu différent)" },
              { "valeur": "abandonnee", "libelle": "Abandonnée en cours" },
              { "valeur": "non_faite", "libelle": "Pas faite" }
            ] },
          { "code": "motif_ecart", "libelle": "Pourquoi", "type": "texte_court", "requis": true, "condition": "execution != 'conforme'", "max": 200 },
          { "code": "duree_min", "libelle": "Durée réelle", "type": "entier", "unite": "minutes", "requis": true, "prerempli": "depuis l'activité Garmin si appariée", "min": 1, "max": 600 }
        ]
      },
      {
        "code": "effort",
        "titre": "L'effort",
        "toujours_visible": true,
        "champs": [
          { "code": "rpe", "libelle": "Effort perçu", "type": "echelle", "echelle": "rpe", "requis": true, "affichage": "boutons 1 à 10 avec le repère verbal affiché sous le bouton sélectionné" },
          { "code": "jambes_5", "libelle": "Jambes", "type": "echelle", "echelle": "ressenti_5", "requis": true },
          { "code": "forme_5", "libelle": "Forme générale", "type": "echelle", "echelle": "ressenti_5", "requis": true }
        ]
      },
      {
        "code": "douleurs",
        "titre": "Douleurs",
        "toujours_visible": true,
        "type": "repeteur",
        "entrees_par_defaut": ["tibia", "quadriceps"],
        "ajout_possible": true,
        "libelle_ajout": "Ajouter une zone",
        "aide_section": "Laisser à 0 si rien. Les trois moments sont indépendants : une douleur peut être absente au réveil et présente en séance, et l'inverse.",
        "champs_par_entree": [
          { "code": "zone", "libelle": "Zone", "type": "enum", "source": "zones_douleur.liste", "requis": true },
          { "code": "cote", "libelle": "Côté", "type": "enum", "options": ["droit", "gauche", "les deux"], "requis": true, "condition": "zone.lateralise == true" },
          { "code": "reveil", "libelle": "Au réveil", "type": "echelle", "echelle": "douleur", "requis": true, "defaut": 0 },
          { "code": "journee", "libelle": "Dans la journée", "type": "echelle", "echelle": "douleur", "requis": true, "defaut": 0 },
          { "code": "seance", "libelle": "Pendant la séance", "type": "echelle", "echelle": "douleur", "requis": true, "defaut": 0 },
          { "code": "evolution_seance", "libelle": "Pendant la séance, la douleur a…", "type": "enum", "options": ["disparu à l'échauffement", "est restée stable", "a augmenté"], "requis": true, "condition": "seance >= 1" },
          { "code": "commentaire", "libelle": "Précision", "type": "texte_court", "requis": false, "max": 200, "condition": "reveil >= 1 || journee >= 1 || seance >= 1" }
        ]
      },
      {
        "code": "qualite",
        "titre": "Exécution de la séance de qualité",
        "condition": "seance.type IN ['seuil','vma','cotes','allure_course','test','nuit','rappel']",
        "aide_section": "Ces trois champs alimentent les deux recalibrations d'allures du bloc, le 25/10 et le 14/11.",
        "champs": [
          { "code": "allures_blocs", "libelle": "Allure de chaque bloc", "type": "liste_texte", "requis": false, "placeholder": "4:36 / 4:29 / 4:18", "aide": "Dans l'ordre. Copiable depuis la montre." },
          { "code": "reserve", "libelle": "Répétitions en réserve", "type": "enum", "requis": true,
            "options": ["0 — je n'aurais pas pu en faire une de plus", "1", "2", "3 ou plus"],
            "aide": "À la même allure. C'est ce qui dit si la séance était calibrée." },
          { "code": "surface", "libelle": "Surface", "type": "enum", "requis": true, "defaut": "chemin",
            "options": ["piste", "chemin roulant", "bitume", "sentier technique", "tapis"],
            "aide": "Alimente la règle « VMA et seuil jamais sur bitume »." }
        ]
      },
      {
        "code": "libre",
        "titre": "Autre chose ?",
        "toujours_visible": true,
        "champs": [
          { "code": "commentaire", "libelle": "Commentaire", "type": "texte_long", "requis": false, "max": 1000, "placeholder": "Facultatif. Tout ce qui sort de l'ordinaire." }
        ]
      }
    ]
  },

  "stockage": {
    "table_principale": {
      "nom": "validation_seance",
      "cle_primaire": "id",
      "index": ["athlete_id", "date", "seance_id"],
      "unicite": ["athlete_id", "seance_id"],
      "colonnes": [
        { "nom": "id", "type": "uuid" },
        { "nom": "athlete_id", "type": "uuid", "requis": true },
        { "nom": "date", "type": "date", "requis": true },
        { "nom": "seance_id", "type": "text", "requis": true, "note": "Identifiant de la séance du plan, ex. S42-2026-10-16" },
        { "nom": "semaine_id", "type": "text", "requis": true, "note": "ex. S42, dénormalisé pour l'agrégation hebdo" },
        { "nom": "seance_type", "type": "text", "note": "Repris du plan : ef, sl, seuil, vma, cotes, allure_course, nuit, test, course, rappel, renfo" },
        { "nom": "execution", "type": "text", "requis": true },
        { "nom": "motif_ecart", "type": "text" },
        { "nom": "duree_min", "type": "integer", "requis": true },
        { "nom": "rpe", "type": "smallint", "requis": true, "contrainte": "1..10" },
        { "nom": "charge_srpe", "type": "integer", "calcule": "rpe * duree_min", "note": "Charge interne. À comparer à la charge Garmin de la même activité : c'est le contrôle de dérive de l'échelle." },
        { "nom": "jambes_5", "type": "smallint", "contrainte": "1..5" },
        { "nom": "forme_5", "type": "smallint", "contrainte": "1..5" },
        { "nom": "allures_blocs", "type": "text[]" },
        { "nom": "reserve", "type": "smallint", "contrainte": "0..3", "note": "3 = « 3 ou plus »" },
        { "nom": "surface", "type": "text" },
        { "nom": "commentaire", "type": "text" },
        { "nom": "garmin_activity_id", "type": "bigint", "note": "Appariement avec l'activité de la montre, si trouvée" },
        { "nom": "cree_le", "type": "timestamptz", "requis": true },
        { "nom": "modifie_le", "type": "timestamptz" }
      ]
    },
    "table_douleurs": {
      "nom": "validation_douleur",
      "relation": "N pour 1 avec validation_seance",
      "note": "Une ligne par zone déclarée, y compris les zones à 0 : l'absence de douleur est une donnée, et c'est elle qui permet de dater l'apparition d'un symptôme.",
      "index": ["validation_id", "zone"],
      "colonnes": [
        { "nom": "id", "type": "uuid" },
        { "nom": "validation_id", "type": "uuid", "requis": true },
        { "nom": "date", "type": "date", "requis": true, "note": "Dénormalisé, pour requêter une série temporelle par zone sans jointure" },
        { "nom": "zone", "type": "text", "requis": true },
        { "nom": "cote", "type": "text", "contrainte": "droit | gauche | bilateral" },
        { "nom": "reveil", "type": "smallint", "requis": true, "contrainte": "0..3" },
        { "nom": "journee", "type": "smallint", "requis": true, "contrainte": "0..3" },
        { "nom": "seance", "type": "smallint", "requis": true, "contrainte": "0..3" },
        { "nom": "evolution_seance", "type": "text", "contrainte": "disparu_echauffement | stable | augmente" },
        { "nom": "commentaire", "type": "text" },
        { "nom": "max_jour", "type": "smallint", "calcule": "greatest(reveil, journee, seance)" }
      ]
    },
    "vues_utiles": [
      { "nom": "v_douleur_serie", "description": "Une ligne par jour et par zone, avec les trois moments et le max — c'est la série à tracer pour voir une tendance." },
      { "nom": "v_charge_hebdo", "description": "Somme de charge_srpe par semaine_id, à comparer aux km et à la charge Garmin." },
      { "nom": "v_conformite_hebdo", "description": "Part des séances en execution = conforme, par semaine. Première colonne à regarder au bilan du lundi." },
      { "nom": "v_rpe_par_type", "description": "RPE moyen par seance_type et par mois. Sert au contrôle de dérive." }
    ]
  },

  "regles_alerte": [
    {
      "code": "douleur_bloquante",
      "niveau": "critique",
      "condition": "n'importe quelle zone atteint 3 sur n'importe quel moment",
      "action": "Séance annulée. Avis kiné. Aucune intensité avant avis.",
      "affichage": "Bandeau rouge immédiat à la soumission du formulaire"
    },
    {
      "code": "douleur_repos",
      "niveau": "critique",
      "condition": "zone 'tibia' avec reveil >= 1 OU journee >= 1",
      "action": "Arrêt immédiat de l'intensité. Le volume en Z2 est conservé, ce sont les séances rapides qui sautent, jamais l'inverse.",
      "source": "Règle « Périoste tibial » du plan v2",
      "affichage": "Bandeau rouge, et la prochaine séance de qualité du plan est marquée à confirmer"
    },
    {
      "code": "douleur_progressive",
      "niveau": "alerte",
      "condition": "evolution_seance = 'augmente' sur la même zone, 2 séances consécutives",
      "action": "Retirer la séance de qualité suivante. Surface souple uniquement pendant 7 jours.",
      "affichage": "Bandeau orange"
    },
    {
      "code": "douleur_persistante",
      "niveau": "alerte",
      "condition": "max_jour >= 1 sur la même zone pendant 5 jours glissants sur 7",
      "action": "Signaler au bilan du lundi même si le niveau reste bas. Une gêne de niveau 1 qui dure est plus informative qu'un pic isolé à 2.",
      "affichage": "Ligne dans le bilan hebdo"
    },
    {
      "code": "rpe_incoherent",
      "niveau": "information",
      "condition": "seance_type IN ('ef','sl') ET rpe >= 7",
      "action": "Croiser avec les marqueurs du matin. Un footing vécu comme dur est un signal de fatigue avant d'être un signal d'allure.",
      "affichage": "Note dans le rapport quotidien"
    },
    {
      "code": "seance_trop_facile",
      "niveau": "information",
      "condition": "seance_type IN ('seuil','vma','allure_course') ET reserve >= 2 ET execution = 'conforme'",
      "action": "Les allures prescrites sont trop lentes pour elle. À remonter à la recalibration suivante.",
      "affichage": "Ligne dans le bilan hebdo"
    },
    {
      "code": "seance_trop_dure",
      "niveau": "alerte",
      "condition": "seance_type IN ('seuil','vma','allure_course') ET execution IN ('allegee','abandonnee') 2 fois sur 3 séances",
      "action": "Les allures prescrites sont trop rapides. Redescendre d'un cran sans attendre la recalibration.",
      "affichage": "Bandeau orange au bilan"
    },
    {
      "code": "surface_bitume",
      "niveau": "information",
      "condition": "seance_type IN ('vma','seuil') ET surface = 'bitume'",
      "action": "Rappeler la règle. Non bloquant, mais à recouper si le tibia se manifeste dans les 10 jours.",
      "affichage": "Message en ligne au moment de la saisie"
    },
    {
      "code": "conformite_faible",
      "niveau": "alerte",
      "condition": "moins de 70 % des séances en execution = 'conforme' sur une semaine",
      "action": "Le plan n'est plus le plan. Revoir la semaine suivante avant de continuer.",
      "affichage": "Bilan du lundi"
    },
    {
      "code": "controle_derive_rpe",
      "niveau": "maintenance",
      "condition": "Mensuel, hors formulaire",
      "action": "Comparer le RPE moyen des séances de seuil au mois précédent, à allure et FC équivalentes. Si le RPE baisse de plus d'un point sans amélioration de l'allure ou de la FC, l'échelle glisse et il faut réafficher les ancrages plus haut dans le formulaire. Même contrôle sur charge_srpe contre la charge Garmin de la même activité.",
      "note": "L'échelle de cette athlète avait dérivé par le passé : ce contrôle est ce qui permet de continuer à s'en servir."
    }
  ],

  "exemple_soumission": {
    "date": "2026-10-16",
    "seance_id": "S42-2026-10-16",
    "semaine_id": "S42",
    "seance_type": "seuil",
    "execution": "conforme",
    "duree_min": 56,
    "rpe": 7,
    "charge_srpe": 392,
    "jambes_5": 4,
    "forme_5": 4,
    "allures_blocs": ["4:38", "4:35"],
    "reserve": 1,
    "surface": "chemin roulant",
    "commentaire": "Deuxième bloc plus facile que le premier, vent dans le dos au retour.",
    "douleurs": [
      { "zone": "tibia", "cote": "droit", "reveil": 0, "journee": 0, "seance": 1, "evolution_seance": "disparu_echauffement", "commentaire": "Sensation sur les 5 premières minutes seulement." },
      { "zone": "quadriceps", "cote": "bilateral", "reveil": 0, "journee": 0, "seance": 0 }
    ],
    "alertes_declenchees": []
  }
}
;
