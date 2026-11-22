/* Document « Réception de chantier » : procès-verbal de réception, fiche de remise
   des documents et fiche de mise en service. Les textes reprennent le dossier Word.
   Chaque point a un libellé court pour l'écran (label) et le texte complet du PDF (pdf). */
(function () {
  'use strict';
  const O = window.OLYMPE, U = O.util;

  const BASSINS = [
    { value: 'coque', label: 'Piscine coque' },
    { value: 'beton', label: 'Béton / PVC armé' },
    { value: 'autre', label: 'Autre' }
  ];
  const PARTS = [
    { value: 'pv', label: 'Procès-verbal de réception', hint: 'Constat, décision et réserves' },
    { value: 'docs', label: 'Remise des documents', hint: 'Documents et notices remis au client' },
    { value: 'mes', label: 'Mise en service', hint: 'Essais, relevés de l’eau et prise en main' }
  ];

  const P_LOCAL = { value: 'local', label: 'Local technique et filtration', hint: 'Installés selon le devis', pdf: 'Local technique, filtration et organes hydrauliques installés conformément au périmètre du devis.' };
  const P_EQUIP = { value: 'equipements', label: 'Équipements complémentaires', hint: 'Chauffage, traitement, éclairage, couverture…', pdf: 'Équipements complémentaires prévus au devis (chauffage, traitement, éclairage, couverture, etc.) : contrôlés.' };
  const P_IMPLANT = { value: 'implantation', label: 'Implantation et aspect général', hint: 'Conformes aux prestations du devis', pdf: 'Implantation et aspect général du bassin conformes aux prestations prévues au devis, sous réserve des observations consignées.' };
  const P_PIECES = { value: 'pieces', label: 'Pièces à sceller', hint: 'Skimmers, buses, prise balai, bonde de fond', pdf: 'Skimmers, buses de refoulement, prise balai, bonde de fond ou autres pièces à sceller : contrôle visuel accessible.' };
  const P_CANA = { value: 'canalisations', label: 'Canalisations et raccordements', hint: 'Pas de fuite apparente', pdf: 'Canalisations et raccordements accessibles : absence de fuite apparente lors du contrôle effectué.' };
  const POINTS = {
    coque: [
      P_IMPLANT,
      { value: 'coque', label: 'Coque, margelles et finitions', hint: 'État visuel accessible', pdf: 'État visuel accessible de la coque, des margelles et des finitions réalisées par l’entreprise.' },
      P_PIECES, P_CANA, P_LOCAL, P_EQUIP
    ],
    beton: [
      { value: 'structure', label: 'Structure et ouvrages', hint: 'Réalisés dans le périmètre du devis', pdf: 'Structure et ouvrages réalisés dans le périmètre du devis ; observations éventuelles consignées ci-dessous.' },
      { value: 'pvc', label: 'Revêtement PVC armé', hint: 'Soudures, angles, pièces à sceller, finitions', pdf: 'Aspect visuel du revêtement PVC armé : soudures, angles, pièces à sceller et finitions accessibles.' },
      { value: 'pieces', label: 'Pièces à sceller, brides et joints', hint: 'Contrôle visuel des raccordements accessibles', pdf: 'Pièces à sceller, brides, joints et raccordements accessibles : contrôle visuel effectué.' },
      P_LOCAL, P_EQUIP
    ],
    autre: [P_IMPLANT, P_PIECES, P_CANA, P_LOCAL, P_EQUIP]
  };
  const TRAVAUX = {
    coque: 'Fourniture et/ou installation d’une piscine coque enterrée, raccordements hydrauliques et équipements prévus au devis.',
    beton: 'Construction d’un bassin en béton (blocs à bancher ou procédé prévu au devis) et réalisation du revêtement en PVC armé.'
  };
  const MISE_EAU = [{ value: 'oui', label: 'Réalisée' }, { value: 'non', label: 'Non réalisée' }];
  const ESSAI = [{ value: 'ok', label: 'Satisfaisant' }, { value: 'non', label: 'Non réalisé' }, { value: 'anomalie', label: 'Anomalie' }];
  const DECISIONS = [
    { value: 'sans', label: 'Réception sans réserve', pdf: 'Réception prononcée sans réserve à la date indiquée ci-dessus.' },
    { value: 'avec', label: 'Réception avec réserves', hint: 'À détailler ci-dessous', pdf: 'Réception prononcée avec réserves détaillées dans le tableau ci-dessous.' },
    { value: 'differee', label: 'Réception non prononcée ou différée', hint: 'Motifs à préciser', pdf: 'Réception non prononcée / différée : motifs précisés ci-dessous.' }
  ];

  const DOCS_CONTRAT = [
    { value: 'devis', label: 'Devis accepté et avenants', pdf: 'Devis accepté / descriptif des prestations et éventuels avenants.' },
    { value: 'facture', label: 'Facture ou situation finale', pdf: 'Facture(s) / situation finale, selon le cas.' },
    { value: 'rc', label: 'Attestation RC professionnelle', pdf: 'Attestation d’assurance responsabilité civile professionnelle.' },
    { value: 'decennale', label: 'Attestation décennale', pdf: 'Attestation d’assurance décennale couvrant l’activité et les travaux concernés.' },
    { value: 'charte', label: 'Charte d’engagements Propiscines®', pdf: 'Charte d’engagements Propiscines® remise au client.' }
  ];
  const DOCS_USAGE = [
    { value: 'securite', label: 'Notice de sécurité piscine', pdf: 'Notice technique / consignes de sécurité piscine remises au client.' },
    { value: 'guide', label: 'Guide pratique d’entretien', pdf: 'Guide pratique d’utilisation et d’entretien de la piscine.' },
    { value: 'traitement', label: 'Traitement de l’eau et précautions produits', pdf: 'Consignes de traitement de l’eau et précautions d’emploi des produits.' },
    { value: 'economies', label: 'Conseils d’économie d’eau et d’énergie', pdf: 'Conseils d’économie d’eau et d’énergie.' },
    { value: 'hivernage', label: 'Hivernage et remise en service', pdf: 'Consignes d’hivernage et de remise en service.' },
    { value: 'sav', label: 'Coordonnées du service après-vente', pdf: 'Coordonnées du service après-vente et procédure de demande d’intervention.' }
  ];
  const EQUIP_SUGGESTIONS = ['Pompe de filtration', 'Filtre', 'Coffret électrique', 'Électrolyseur', 'Régulateur pH', 'Pompe à chaleur', 'Projecteur', 'Volet / couverture', 'Robot nettoyeur', 'Alarme'];

  const HYDRO = [
    { value: 'vannes', label: 'Vannes et circuits', hint: 'Identifiés et expliqués', pdf: 'Vannes et circuits identifiés / expliqués au client.' },
    { value: 'prefiltre', label: 'Préfiltre de pompe', hint: 'Contrôlé, nettoyage expliqué', pdf: 'Préfiltre de pompe contrôlé et procédure de nettoyage expliquée.' },
    { value: 'filtre', label: 'Filtre et vanne multivoies', hint: 'Fonctionnement et contre-lavage expliqués', pdf: 'Filtre et vanne multivoies (si présents) : fonctionnement et contre-lavage expliqués.' },
    { value: 'pompe', label: 'Pompe', hint: 'Mise en fonctionnement, essai réalisé', pdf: 'Pompe mise en fonctionnement et essai réalisé.' },
    { value: 'horloge', label: 'Horloge / régulation', hint: 'Programmation expliquée', pdf: 'Programmation de l’horloge / régulation expliquée.' },
    { value: 'fuite', label: 'Pas de fuite apparente', hint: 'Sur les éléments accessibles pendant l’essai', pdf: 'Absence de fuite apparente constatée sur les éléments accessibles pendant l’essai.' }
  ];
  const EQUIP = [
    { value: 'electrolyseur', label: 'Électrolyseur, régulateur pH, doseur', pdf: 'Électrolyseur / régulateur pH / doseur : réglages et consignes expliqués.' },
    { value: 'pac', label: 'Pompe à chaleur', pdf: 'Pompe à chaleur : mise en route, consignes et précautions expliquées.' },
    { value: 'eclairage', label: 'Éclairage', pdf: 'Éclairage : commande et précautions expliquées.' },
    { value: 'volet', label: 'Volet, couverture, abri', pdf: 'Volet / couverture / abri : manœuvre, entretien et consignes de sécurité expliqués.' },
    { value: 'robot', label: 'Robot nettoyeur', pdf: 'Robot / nettoyeur : utilisation, entretien et stockage expliqués.' }
  ];
  const CONSEILS = [
    { value: 'filtration', label: 'Filtration : usage et durée', pdf: 'Utilisation normale de la filtration et durée de fonctionnement expliquées.' },
    { value: 'nettoyage', label: 'Nettoyage des paniers, préfiltre et filtre', pdf: 'Nettoyage des paniers, préfiltre et filtre expliqué.' },
    { value: 'equilibre', label: 'Contrôle régulier de l’eau', pdf: 'Contrôle régulier de l’équilibre et de la désinfection de l’eau expliqué.' },
    { value: 'produits', label: 'Stockage des produits, pas de mélange', pdf: 'Stockage sécurisé des produits de traitement et interdiction des mélanges rappelés.' },
    { value: 'electricite', label: 'Précautions électriques et local technique', pdf: 'Précautions électriques et accès au local technique expliqués.' },
    { value: 'enfants', label: 'Surveillance des enfants et sécurité', pdf: 'Surveillance des enfants et règles de sécurité autour du bassin rappelées.' },
    { value: 'hivernage', label: 'Hivernage et remise en service', pdf: 'Procédure d’hivernage / remise en service expliquée ou document remis.' }
  ];

  const T_PV = 'Les parties reconnaissent avoir procédé à une visite contradictoire et déclarent que la décision de réception indiquée ci-dessus correspond à leur accord à la date de signature. Le présent procès-verbal est établi en deux exemplaires, un pour chaque partie. La date de réception et ses effets sont appréciés conformément aux dispositions légales et contractuelles applicables.';
  const T_DOCS = 'Le client reconnaît avoir reçu les documents cochés ci-dessus. Les documents non cochés ne sont pas réputés remis par la signature de la présente fiche.';
  const T_MES = 'Le client reconnaît avoir reçu les explications cochées ci-dessus. La présente fiche atteste des opérations et informations consignées à la date indiquée ; elle ne remplace pas les notices des fabricants ni les consignes réglementaires.';
  const T_LIMITES = 'Les vérifications ci-dessus sont visuelles et fonctionnelles dans les limites des prestations réalisées et des conditions présentes le jour de la réception.';
  const T_CIBLES = 'Les valeurs cibles dépendent du traitement installé, des préconisations du fabricant et des conditions d’utilisation. Les corrections et dosages doivent être réalisés conformément aux notices des produits.';

  const has = part => d => (d.parts || []).includes(part);
  const hasPv = has('pv'), hasDocs = has('docs'), hasMes = has('mes');
  const labelOf = (list, v) => { const o = list.find(x => x.value === v); return o ? o.label : ''; };
  const bassinLabel = d => d.bassin === 'autre' ? (d.bassinAutre || 'Autre') : labelOf(BASSINS, d.bassin);
  const decisionLabel = d => {
    if (d.decision === 'avec') { const n = (d.reserves || []).length; return 'Réception avec ' + n + ' réserve' + (n > 1 ? 's' : ''); }
    return labelOf(DECISIONS, d.decision);
  };
  const checksOf = (list, sel) => list.map(x => ({ label: x.pdf, checked: (sel || []).includes(x.value) }));
  const measure = (v, unit) => v ? String(v).trim() + (unit ? ' ' + unit : '') : 'Non mesuré';

  O.docs.reception = {
    id: 'reception',
    title: 'Réception de chantier',
    pdfTitle: 'Dossier de réception signé',

    defaults() {
      return { date: U.today(), heure: U.now(), parts: ['pv', 'docs', 'mes'], points: [], reserves: [], notices: [] };
    },

    steps: [
      {
        id: 'client', title: 'Client',
        lead: 'Le maître d’ouvrage et l’adresse du chantier.',
        fields: [
          { type: 'client', map: { client: 'client', tel: 'tel', email: 'email', adresse: 'adresseChantier', adresseAutre: 'adresseClient' }, when: () => O.clients.count() > 0 },
          { type: 'text', name: 'client', label: 'Client / maître d’ouvrage', placeholder: 'Nom et prénom', required: true, capitalize: 'words' },
          { type: 'tel', name: 'tel', label: 'Téléphone', optional: true },
          { type: 'email', name: 'email', label: 'E-mail du client', optional: true, hint: 'Pour lui envoyer son exemplaire.' },
          { type: 'textarea', name: 'adresseChantier', label: 'Adresse du chantier', placeholder: 'N°, rue, code postal, ville', required: true, rows: 2 },
          { type: 'textarea', name: 'adresseClient', label: 'Adresse du client', optional: true, rows: 2, hint: 'Seulement si elle diffère de celle du chantier.' }
        ]
      },
      {
        id: 'visite', title: 'Chantier et visite',
        fields: [
          { type: 'choice', name: 'bassin', label: 'Type de bassin', required: true, options: BASSINS },
          { type: 'text', name: 'bassinAutre', label: 'Précisez le type de bassin', required: true, when: d => d.bassin === 'autre' },
          { type: 'row', fields: [
            { type: 'text', name: 'devis', label: 'N° de devis', optional: true },
            { type: 'date', name: 'dateDevis', label: 'Date du devis', optional: true }
          ] },
          { type: 'row', fields: [
            { type: 'date', name: 'date', label: 'Date de visite', required: true },
            { type: 'time', name: 'heure', label: 'Heure', required: true }
          ] },
          { type: 'text', name: 'lieu', label: 'Fait à', placeholder: 'Commune', required: true, capitalize: 'words' },
          { type: 'text', name: 'tech', label: 'Représentant des Piscines de l’Olympe', placeholder: 'Nom et prénom', required: true, capitalize: 'words', remember: 'tech' }
        ]
      },
      {
        id: 'contenu', title: 'Contenu de la visite',
        lead: 'Décochez ce qui sera fait un autre jour.',
        fields: [
          { type: 'choice', name: 'parts', multiple: true, required: true, options: PARTS, error: 'Sélectionnez au moins une partie.' }
        ]
      },
      {
        id: 'constat', title: 'Constat de réception', when: hasPv,
        lead: 'Cochez uniquement les points réellement examinés.',
        fields: [
          { type: 'choice', name: 'points', label: 'Points examinés', multiple: true, selectAll: true, options: d => POINTS[d.bassin] || POINTS.autre },
          { type: 'text', name: 'pvcRef', label: 'Couleur / référence du PVC armé', optional: true, when: d => d.bassin === 'beton' },
          { type: 'text', name: 'pvcFabricant', label: 'Fabricant du PVC armé', optional: true, when: d => d.bassin === 'beton' },
          { type: 'choice', name: 'miseEau', label: 'Mise en eau', required: true, inline: true, options: MISE_EAU },
          { type: 'textarea', name: 'miseEauObs', label: 'Niveau d’eau et remplissage', optional: true, rows: 2 },
          { type: 'choice', name: 'essai', label: 'Essai de la pompe et de la filtration', required: true, inline: true, options: ESSAI },
          { type: 'textarea', name: 'nonVerifies', label: 'Points non vérifiés ou inaccessibles', optional: true, rows: 2 }
        ]
      },
      {
        id: 'decision', title: 'Décision du client', when: hasPv,
        lead: 'La décision de réception appartient au maître d’ouvrage.',
        fields: [
          { type: 'choice', name: 'decision', required: true, options: DECISIONS },
          {
            type: 'list', name: 'reserves', label: 'Réserves', itemLabel: 'Réserve', addLabel: 'Ajouter une réserve', min: 1,
            error: 'Ajoutez au moins une réserve, ou changez la décision.',
            when: d => d.decision === 'avec',
            fields: [
              { type: 'textarea', name: 'texte', label: 'Réserve et localisation précise', required: true, rows: 2 },
              { type: 'text', name: 'action', label: 'Action convenue / responsable', optional: true },
              { type: 'date', name: 'delai', label: 'Date cible', optional: true },
              { type: 'photos', name: 'photos', label: 'Photos', max: 3 }
            ]
          },
          { type: 'textarea', name: 'motifs', label: 'Motifs', required: true, rows: 3, when: d => d.decision === 'differee' },
          { type: 'textarea', name: 'observations', label: 'Observations complémentaires', optional: true, rows: 3 }
        ]
      },
      {
        id: 'documents', title: 'Documents remis', when: hasDocs,
        lead: 'Cochez uniquement les documents réellement remis.',
        fields: [
          { type: 'choice', name: 'docsContrat', label: 'Contrat et assurances', multiple: true, selectAll: true, options: DOCS_CONTRAT },
          { type: 'choice', name: 'docsUsage', label: 'Sécurité, utilisation, entretien', multiple: true, selectAll: true, options: DOCS_USAGE }
        ]
      },
      {
        id: 'notices', title: 'Notices des équipements', when: hasDocs,
        lead: 'Une ligne par équipement installé.',
        fields: [
          {
            type: 'list', name: 'notices', itemLabel: 'Équipement', addLabel: 'Ajouter un équipement',
            empty: 'Aucun équipement ajouté pour l’instant.',
            newItem: () => ({ remise: true }),
            fields: [
              { type: 'text', name: 'equipement', label: 'Équipement', required: true, suggestions: EQUIP_SUGGESTIONS },
              { type: 'text', name: 'modele', label: 'Marque / modèle / référence', optional: true },
              { type: 'ack', name: 'remise', label: 'Notice remise' },
              { type: 'text', name: 'support', label: 'Support / observations', optional: true, placeholder: 'Papier, e-mail…' }
            ]
          },
          { type: 'textarea', name: 'docsAutres', label: 'Documents complémentaires', optional: true, rows: 2 }
        ]
      },
      {
        id: 'service', title: 'Mise en service', when: hasMes,
        lead: 'Cochez les essais et explications réellement effectués.',
        fields: [
          { type: 'choice', name: 'hydro', label: 'Hydraulique et filtration', multiple: true, selectAll: true, options: HYDRO },
          { type: 'row', fields: [
            { type: 'number', name: 'volume', label: 'Volume estimatif', unit: 'm³', optional: true },
            { type: 'text', name: 'volumeSource', label: 'Source / méthode', optional: true }
          ] }
        ]
      },
      {
        id: 'releves', title: 'Relevés de l’eau', when: hasMes,
        lead: 'Ne renseignez que les valeurs réellement mesurées.',
        fields: [
          { type: 'row', fields: [
            { type: 'number', name: 'tEau', label: 'Température', unit: '°C', optional: true },
            { type: 'number', name: 'ph', label: 'pH', optional: true }
          ] },
          { type: 'row', fields: [
            { type: 'number', name: 'chlore', label: 'Chlore libre', unit: 'mg/L', optional: true },
            { type: 'number', name: 'tac', label: 'TAC', unit: '°f', optional: true }
          ] },
          { type: 'row', fields: [
            { type: 'number', name: 'th', label: 'TH', unit: '°f', optional: true },
            { type: 'number', name: 'stab', label: 'Stabilisant', unit: 'mg/L', optional: true }
          ] },
          { type: 'text', name: 'methode', label: 'Méthode ou appareil de mesure', optional: true, placeholder: 'Bandelettes, photomètre…' },
          { type: 'textarea', name: 'corrections', label: 'Actions / corrections effectuées', optional: true, rows: 2 }
        ]
      },
      {
        id: 'explications', title: 'Prise en main', when: hasMes,
        lead: 'Ce qui a été expliqué au client.',
        fields: [
          { type: 'choice', name: 'equip', label: 'Équipements installés', hint: 'Selon l’installation.', multiple: true, options: EQUIP },
          { type: 'text', name: 'equipAutre', label: 'Autre équipement', optional: true },
          { type: 'choice', name: 'conseils', label: 'Conseils transmis', multiple: true, selectAll: true, options: CONSEILS },
          { type: 'textarea', name: 'anomalies', label: 'Anomalies, limites ou opérations restant à faire', optional: true, rows: 3 }
        ]
      },
      {
        id: 'signatures', title: 'Signatures',
        lead: 'Une seule signature vaut pour chaque partie du dossier.',
        fields: [
          {
            type: 'statement', title: 'Ce que le client signe',
            text: d => [
              hasPv(d) && { title: 'Procès-verbal de réception', text: decisionLabel(d) + '. La décision correspond à l’accord des parties après visite contradictoire.' },
              hasDocs(d) && { title: 'Remise des documents', text: 'Le client reconnaît avoir reçu les documents cochés. Les documents non cochés ne sont pas réputés remis.' },
              hasMes(d) && { title: 'Mise en service', text: 'Le client reconnaît avoir reçu les explications cochées. La fiche ne remplace pas les notices des fabricants.' }
            ].filter(Boolean)
          },
          { type: 'ack', name: 'luApprouve', label: 'Lu et approuvé', required: true, error: 'Le client confirme par « Lu et approuvé » avant de signer.' },
          { type: 'signature', name: 'sigClient', label: 'Signature du client', signer: d => d.client, required: true },
          { type: 'text', name: 'qualite', label: 'Qualité du représentant', optional: true, placeholder: 'Gérant, technicien…', remember: 'qualite' },
          { type: 'signature', name: 'sigTech', label: 'Signature du représentant', signer: d => d.tech, required: true }
        ]
      }
    ],

    draftLabel: d => d.client || 'Client à renseigner',

    summary(d) {
      const rows = [
        ['Client', d.client],
        ['Chantier', d.adresseChantier],
        ['Type de bassin', bassinLabel(d)],
        ['Visite du', U.frDate(d.date) + ' à ' + U.frTime(d.heure)],
        ['Contenu', PARTS.filter(p => (d.parts || []).includes(p.value)).map(p => p.label).join('\n')]
      ];
      if (hasPv(d)) rows.push(['Décision', decisionLabel(d)]);
      return rows;
    },

    filename: d => U.fileName('Reception-chantier', d.client, d.date),

    mail(d) {
      const what = hasPv(d) ? 'le procès-verbal de réception de votre piscine' : 'les documents relatifs à votre piscine';
      return {
        to: [d.email, O.company.email].filter(Boolean),
        subject: 'Réception de votre piscine – dossier signé',
        body: 'Bonjour,\n\nVeuillez trouver ci-joint ' + what + ', signé le ' + U.frDate(d.date) + '.\n\nNous restons à votre disposition pour toute question.\n\nCordialement,\n' + (d.tech || '') + '\n' + O.company.name + '\n' + O.company.phone
      };
    },

    /* Garde les réserves sur le téléphone pour préparer la fiche de levée */
    onFinish(d) {
      if (hasPv(d) && d.decision === 'avec' && (d.reserves || []).length) {
        U.pending.add({
          id: Date.now().toString(36), client: d.client, adresse: d.adresseChantier, email: d.email || '',
          devis: d.devis || '', datePv: d.date, reserves: d.reserves.map(r => r.texte)
        });
      }
    },

    async buildPdf(d) {
      const k = await window.OlympePdf.create({ label: 'Dossier de réception', title: 'Dossier de réception de chantier' });
      const chantier = d.client + ' – ' + U.oneLine(d.adresseChantier);
      let first = true;
      const open = (title, intro) => {
        if (!first) k.newPage();
        first = false;
        k.title(title);
        if (intro) k.intro(intro);
      };
      const sign = declaration => {
        k.ensure(k.textHeight(declaration) + 61.5); // déclaration, lieu et signatures restent ensemble
        k.section('Déclaration et signatures', 1);
        k.para(declaration);
        k.para('Fait à ' + d.lieu + ', le ' + U.frDate(d.date) + '.', { bold: true });
        k.signatures([
          {
            title: 'Le maître d’ouvrage / client', name: d.client, date: U.frDate(d.date), sig: d.sigClient,
            mention: d.luApprouve ? 'Lu et approuvé' : '',
            note: d.sigClient && d.sigClient.at ? 'Signé sur place le ' + U.frDateTime(d.sigClient.at) : ''
          },
          {
            title: 'L’entreprise – Les Piscines de l’Olympe', name: d.tech + (d.qualite ? ', ' + d.qualite : ''), date: U.frDate(d.date), sig: d.sigTech,
            note: d.sigTech && d.sigTech.at ? 'Signé sur place le ' + U.frDateTime(d.sigTech.at) : ''
          }
        ]);
      };

      /* ----- Procès-verbal de réception ----- */
      if (hasPv(d)) {
        const sel = d.points || [];
        const pts = POINTS[d.bassin] || POINTS.autre;
        const line = v => { const p = pts.find(x => x.value === v); return p ? { label: p.pdf, checked: sel.includes(v) } : null; };
        const eau = { label: 'Mise en eau : ' + (d.miseEau === 'oui' ? 'réalisée' : 'non réalisée') + '.' + (d.miseEauObs ? ' Niveau d’eau et remplissage : ' + U.oneLine(d.miseEauObs) : ''), checked: true };
        const essai = { label: 'Essai de fonctionnement de la pompe et du système de filtration : ' + ({ ok: 'satisfaisant', non: 'non réalisé', anomalie: 'anomalie constatée' })[d.essai] + '.', checked: true };
        let lines;
        if (d.bassin === 'coque') lines = [line('implantation'), line('coque'), eau, line('pieces'), line('canalisations'), line('local'), essai, line('equipements')];
        else if (d.bassin === 'beton') {
          const ref = (d.pvcRef || d.pvcFabricant)
            ? { label: 'Couleur / référence du PVC armé : ' + (d.pvcRef || '—') + '  ·  Fabricant : ' + (d.pvcFabricant || '—'), checked: true } : null;
          lines = [line('structure'), line('pvc'), ref, eau, line('pieces'), line('local'), essai, line('equipements')];
        } else lines = [line('implantation'), eau, line('pieces'), line('canalisations'), line('local'), essai, line('equipements')];

        open('Procès-verbal de réception – ' + (d.bassin === 'coque' ? 'Piscine coque' : d.bassin === 'beton' ? 'Piscine béton / PVC armé' : bassinLabel(d)),
          'Le présent procès-verbal constate la réception des travaux décrits ci-dessous, après visite contradictoire du chantier par le client et l’entreprise.');
        let n = 0;
        const sec = (t, keep) => k.section((++n) + '   ' + t, keep);

        sec('Identification des parties et du chantier');
        k.kv([
          ['Client / maître d’ouvrage', d.client + (d.tel ? '  ·  Tél. ' + d.tel : '')],
          ['Adresse du client', d.adresseClient ? U.oneLine(d.adresseClient) : 'Identique à l’adresse du chantier'],
          ['Adresse du chantier', U.oneLine(d.adresseChantier)],
          ['Entreprise', 'Les Piscines de l’Olympe – Représentant : ' + d.tech],
          ['Devis / commande n°', d.devis ? d.devis + (d.dateDevis ? ' du ' + U.frDate(d.dateDevis) : '') : ''],
          ['Date de visite / réception', U.frDate(d.date) + ' à ' + U.frTime(d.heure)],
          ['Type de travaux', TRAVAUX[d.bassin] || (bassinLabel(d) + ' – travaux et équipements prévus au devis.')]
        ]);

        sec('Constat de réception – points examinés');
        k.checks(lines.filter(Boolean), 1);
        k.small(T_LIMITES);
        if (d.nonVerifies) k.kv([['Non vérifié / non accessible', U.oneLine(d.nonVerifies)]]);
        else k.space(2);

        sec('Décision du maître d’ouvrage');
        k.checks(DECISIONS.map(x => ({ label: x.pdf, checked: d.decision === x.value })), 1);

        if (d.decision === 'avec') {
          sec('Réserves, observations et délais convenus', 34);
          k.table({
            head: ['N°', 'Réserve / observation et localisation précise', 'Action convenue / responsable', 'Délai / date cible'],
            widths: [0.07, 0.47, 0.28, 0.18],
            rows: (d.reserves || []).map((r, i) => [i + 1, U.oneLine(r.texte), r.action, U.frDate(r.delai)])
          });
        }
        if (d.decision === 'differee') {
          sec('Motifs');
          k.para(d.motifs || '');
        }
        if (d.observations) {
          sec('Observations complémentaires');
          k.para(d.observations);
        }
        sign(T_PV);

        const photos = [];
        (d.reserves || []).forEach((r, i) => (r.photos || []).forEach(p =>
          photos.push({ data: p.data, w: p.w, h: p.h, caption: 'Réserve ' + (i + 1) + ' – ' + U.oneLine(r.texte) })));
        if (d.decision === 'avec' && photos.length) {
          k.newPage();
          k.title('Annexe au procès-verbal – photos des réserves');
          k.photos(photos);
        }
      }

      /* ----- Fiche de remise des documents ----- */
      if (hasDocs(d)) {
        open('Fiche de remise des documents et notices',
          'Cette fiche trace les documents effectivement remis au client.');
        k.kv([
          ['Client / chantier', chantier],
          ['Date de remise / remis par', U.frDate(d.date) + '  ·  ' + d.tech]
        ]);
        k.section('Documents contractuels et assurances');
        k.checks(checksOf(DOCS_CONTRAT, d.docsContrat), 1);
        k.section('Sécurité, utilisation et entretien');
        k.checks(checksOf(DOCS_USAGE, d.docsUsage), 1);
        k.section('Notices fabricants et équipements installés', 30);
        const notices = (d.notices || []).filter(x => x.equipement);
        if (notices.length) {
          k.table({
            head: ['Équipement', 'Marque / modèle / référence', 'Notice remise', 'Support / observations'],
            widths: [0.26, 0.32, 0.14, 0.28],
            rows: notices.map(x => [x.equipement, x.modele, x.remise ? 'Oui' : 'Non', x.support])
          });
        } else {
          k.para('Aucune notice fabricant consignée sur cette fiche.');
        }
        if (d.docsAutres) {
          k.section('Documents complémentaires');
          k.para(d.docsAutres);
        }
        sign(T_DOCS);
      }

      /* ----- Fiche de mise en service ----- */
      if (hasMes(d)) {
        open('Fiche de mise en service et de prise en main',
          'Les valeurs sont relevées à la date de l’intervention et ne constituent pas une garantie de stabilité ultérieure de l’eau.');
        k.kv([
          ['Client / chantier', chantier],
          ['Date / intervenant', U.frDate(d.date) + '  ·  ' + d.tech],
          ['Type de bassin', bassinLabel(d)],
          ['Volume estimatif', d.volume ? d.volume + ' m³' + (d.volumeSource ? '  ·  ' + d.volumeSource : '') : '']
        ]);
        k.section('A   Mise en service hydraulique et filtration');
        k.checks(checksOf(HYDRO, d.hydro), 1);
        k.section('B   Traitement de l’eau – relevés du jour');
        k.table({
          head: ['Paramètre', 'Valeur', 'Paramètre', 'Valeur'],
          widths: [0.3, 0.2, 0.3, 0.2],
          rows: [
            ['Température de l’eau', measure(d.tEau, '°C'), 'pH', measure(d.ph)],
            ['Désinfectant / chlore libre', measure(d.chlore, 'mg/L'), 'TAC', measure(d.tac, '°f')],
            ['TH', measure(d.th, '°f'), 'Stabilisant', measure(d.stab, 'mg/L')]
          ]
        });
        k.y -= 1.5;
        k.kv([
          ['Méthode / appareil de mesure', d.methode],
          ['Actions / corrections', U.oneLine(d.corrections)]
        ]);
        k.y -= 1.5;
        k.small(T_CIBLES);
        k.space(1.5);
        k.section('C   Équipements complémentaires – selon installation');
        const equip = checksOf(EQUIP, d.equip);
        if (d.equipAutre) equip.push({ label: 'Autre équipement : ' + d.equipAutre, checked: true });
        k.checks(equip, 1);
        k.section('D   Formation et conseils transmis au client');
        k.checks(checksOf(CONSEILS, d.conseils), 1);
        k.section('E   Anomalies, limites ou opérations restant à effectuer');
        k.para(d.anomalies || 'Aucune mention consignée.');
        sign(T_MES);
      }

      return k.finish();
    }
  };
})();
