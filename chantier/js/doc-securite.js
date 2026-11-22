/* Document « Sécurité de la piscine » : notice d'information + attestation de remise.
   Les textes reprennent le document Word d'origine. */
(function () {
  'use strict';
  const O = window.OLYMPE;

  const DEVICES = [
    { value: 'barriere', label: 'Barrière de protection', norm: 'NF P90-306', text: 'Empêche l’accès au bassin, notamment des jeunes enfants.' },
    { value: 'alarme', label: 'Système d’alarme', norm: 'NF P90-307', text: 'Détecte une immersion ou une approche selon le type d’alarme.' },
    { value: 'couverture', label: 'Couverture de sécurité', norm: 'NF P90-308', text: 'Empêche l’immersion involontaire lorsqu’elle est correctement mise en place.' },
    { value: 'abri', label: 'Abri de piscine', norm: 'NF P90-309', text: 'Rend le bassin inaccessible lorsqu’il est fermé et verrouillé.' }
  ];
  const NONE = 'aucun';

  const SUPPLY = [
    { value: 'olympe', label: 'Inclus au devis des Piscines de l’Olympe' },
    { value: 'client', label: 'Fourni ou posé par le client ou un autre prestataire' }
  ];

  const NOTICE = [
    {
      n: '1', title: 'Une obligation réglementaire',
      blocks: [
        { p: 'Les piscines privées de plein air, enterrées ou semi-enterrées, à usage individuel ou collectif, doivent être pourvues d’un dispositif de sécurité destiné à prévenir les noyades. Cette obligation ne vise pas de la même manière les bassins entièrement hors sol, démontables ou gonflables, ni les piscines situées dans un bâtiment.' },
        { p: 'Le dispositif doit être installé au plus tard à la mise en eau du bassin ou, si les travaux nécessitent une mise en eau préalable, au plus tard à leur achèvement. La méconnaissance de cette obligation peut être sanctionnée pénalement.' }
      ]
    },
    {
      n: '2', title: 'Les quatre familles de dispositifs',
      blocks: [
        { defs: DEVICES.map(d => ({ term: d.label + ' – ' + d.norm, text: d.text })) },
        { p: 'Choisir un équipement conforme à la norme applicable, adapté au bassin, installé et utilisé conformément à sa notice. Une bâche à bulles ou une simple couverture d’hivernage ne constitue pas nécessairement une couverture de sécurité.' }
      ]
    },
    {
      n: '3', title: 'Prévenir les noyades au quotidien',
      blocks: [
        { list: [
          'Ne jamais laisser un enfant seul près de l’eau, même quelques instants ; désigner un adulte chargé d’une surveillance active et continue.',
          'Retirer les jouets flottants après la baignade ; conserver une perche, une bouée et un téléphone à proximité.',
          'Refermer et réactiver systématiquement le dispositif de sécurité après utilisation ; contrôler régulièrement son bon fonctionnement.',
          'Apprendre aux enfants à évoluer dans l’eau dès que possible ; connaître les gestes de premiers secours.'
        ] },
        { alert: 'En cas d’urgence : sortir la personne de l’eau sans se mettre en danger, appeler le 15, le 18 ou le 112 et suivre les consignes des secours.' }
      ]
    },
    {
      n: '4', title: 'Si vous ne retenez pas de dispositif dans notre devis',
      blocks: [
        { p: 'L’absence d’un dispositif de sécurité dans le devis ne supprime pas l’obligation légale de sécuriser le bassin. Merci d’indiquer à l’entreprise le dispositif que vous prévoyez d’installer, ainsi que son mode de fourniture et sa date prévisionnelle de pose. Un refus ou une attestation signée ne vaut pas dérogation réglementaire et ne décharge pas automatiquement les intervenants de leurs responsabilités.' },
        { small: 'Références : Code de la construction et de l’habitation, articles L.134-10 et suivants et D.134-51 et suivants ; normes françaises indiquées ci-dessus (vérifier leurs versions en vigueur).' }
      ]
    }
  ];

  const DECLARATION = 'Je reconnais avoir reçu la notice « Sécurité de la piscine », avoir été informé(e) de l’obligation applicable aux piscines privées enterrées ou semi-enterrées non closes, des principales solutions de protection et du fait qu’aucun dispositif ne remplace la surveillance active et continue des enfants.';
  const REFUSAL = 'Je reconnais avoir été expressément alerté(e) sur les risques de noyade et sur la nécessité de respecter les délais légaux de sécurisation. Je comprends que ma signature ne constitue ni une dispense de sécurisation ni une renonciation à mes droits.';

  const hasNone = d => (d.dispositifs || []).includes(NONE);
  const hasDevice = d => (d.dispositifs || []).some(v => v !== NONE);
  const frDate = iso => { if (!iso) return ''; const [y, m, j] = iso.split('-'); return j + '/' + m + '/' + y; };
  const frDateTime = iso => {
    if (!iso) return '';
    const t = new Date(iso), p = n => String(n).padStart(2, '0');
    return p(t.getDate()) + '/' + p(t.getMonth() + 1) + '/' + t.getFullYear() + ' à ' + p(t.getHours()) + ' h ' + p(t.getMinutes());
  };
  const deviceLabels = d => DEVICES.filter(x => (d.dispositifs || []).includes(x.value)).map(x => x.label);

  O.docs.securite = {
    id: 'securite',
    title: 'Sécurité de la piscine',

    defaults() {
      const t = new Date(), p = n => String(n).padStart(2, '0');
      return { date: t.getFullYear() + '-' + p(t.getMonth() + 1) + '-' + p(t.getDate()), dispositifs: [] };
    },

    steps: [
      {
        id: 'client',
        title: 'Client et chantier',
        lead: 'Ces informations figureront sur l’attestation.',
        fields: [
          { type: 'client', map: { client: 'client', email: 'email', adresse: 'adresse' }, when: () => O.clients.count() > 0 },
          { type: 'text', name: 'client', label: 'Client / maître d’ouvrage', placeholder: 'Nom et prénom', required: true, capitalize: 'words' },
          { type: 'textarea', name: 'adresse', label: 'Adresse du bassin', placeholder: 'N°, rue, code postal, ville', required: true, rows: 2 },
          { type: 'text', name: 'devis', label: 'N° de devis ou de chantier', optional: true },
          { type: 'email', name: 'email', label: 'E-mail du client', optional: true, hint: 'Pour lui envoyer son exemplaire.' },
          { type: 'date', name: 'date', label: 'Date', required: true }
        ]
      },
      {
        id: 'notice',
        title: 'Notice de sécurité',
        lead: 'À faire lire au client avant de continuer.',
        fields: [
          { type: 'read', sections: NOTICE },
          { type: 'ack', name: 'lu', label: 'Le client a pris connaissance de la notice', required: true, error: 'Confirmez la lecture de la notice pour continuer.' }
        ]
      },
      {
        id: 'dispositif',
        title: 'Dispositif de sécurité prévu',
        lead: 'Plusieurs dispositifs peuvent être sélectionnés.',
        fields: [
          {
            type: 'choice', name: 'dispositifs', multiple: true, required: true,
            error: 'Sélectionnez au moins une réponse.',
            options: DEVICES.map(d => ({ value: d.value, label: d.label, hint: d.norm }))
              .concat([{ value: NONE, label: 'Aucun dispositif choisi à ce jour', exclusive: true }])
          },
          { type: 'choice', name: 'fourniture', label: 'Qui fournit le dispositif ?', required: true, options: SUPPLY, when: hasDevice },
          { type: 'textarea', name: 'precisions', label: 'Précisions', optional: true, rows: 2, hint: 'Marque, modèle, prestataire, si connus.', when: hasDevice },
          { type: 'date', name: 'datePose', label: 'Date prévisionnelle de pose', optional: true, when: hasDevice },
          { type: 'note', tone: 'warning', title: 'Une régularisation reste obligatoire', text: 'L’absence de dispositif dans le devis ne supprime pas l’obligation légale de sécuriser le bassin.', when: hasNone },
          { type: 'textarea', name: 'observations', label: 'Observations', optional: true, rows: 3, when: hasNone }
        ]
      },
      {
        id: 'signatures',
        title: 'Signatures',
        lead: 'Le client signe, puis le représentant de l’entreprise.',
        fields: [
          { type: 'statement', title: 'Déclaration du client', text: d => hasNone(d) ? [DECLARATION, REFUSAL] : [DECLARATION] },
          { type: 'signature', name: 'sigClient', label: 'Signature du client', signer: d => d.client, required: true },
          { type: 'text', name: 'tech', label: 'Représentant des Piscines de l’Olympe', placeholder: 'Nom et prénom', required: true, capitalize: 'words', remember: 'tech' },
          { type: 'signature', name: 'sigTech', label: 'Signature du représentant', signer: d => d.tech, required: true }
        ]
      }
    ],

    pdfTitle: 'Notice et attestation signée',

    draftLabel: d => d.client || 'Client à renseigner',

    summary(d) {
      const rows = [
        ['Client', d.client],
        ['Adresse du bassin', d.adresse]
      ];
      if (d.devis) rows.push(['Devis / chantier', d.devis]);
      rows.push(['Dispositif prévu', hasNone(d) ? 'Aucun choisi à ce jour' : deviceLabels(d).join(', ')]);
      if (hasDevice(d)) rows.push(['Fourniture', d.fourniture === 'olympe' ? 'Incluse au devis' : 'Client ou autre prestataire']);
      rows.push(['Signé le', frDate(d.date)]);
      return rows;
    },

    filename(d) {
      const name = (d.client || 'client').normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'client';
      return 'Attestation-securite_' + name + '_' + d.date + '.pdf';
    },

    mail(d) {
      return {
        to: [d.email, O.company.email].filter(Boolean),
        subject: 'Sécurité de votre piscine – notice et attestation signée',
        body: 'Bonjour,\n\nVeuillez trouver ci-joint la notice d’information sur la sécurité de la piscine ainsi que l’attestation de remise signée le ' + frDate(d.date) + '.\n\nNous restons à votre disposition pour toute question.\n\nCordialement,\n' + (d.tech || '') + '\n' + O.company.name + '\n' + O.company.phone
      };
    },

    async buildPdf(d) {
      const k = await window.OlympePdf.create({ label: 'Sécurité de la piscine', title: 'Notice et attestation – Sécurité de la piscine' });

      // Page 1 : la notice
      k.title('Notice d’information – Sécurité de la piscine',
        'Document remis au maître d’ouvrage  ·  Piscines privées enterrées ou semi-enterrées non closes');
      for (const s of NOTICE) {
        k.section(s.n + '   ' + s.title);
        for (const b of s.blocks) {
          if (b.p) k.para(b.p);
          else if (b.defs) k.defs(b.defs);
          else if (b.list) k.bullets(b.list);
          else if (b.alert) k.callout(b.alert, { tone: 'danger', bold: true });
          else if (b.small) k.small(b.small);
        }
        k.space(1.5);
      }

      // Page 2 : l'attestation
      k.newPage();
      k.title('Attestation de remise et d’information');
      k.section('Identification du projet');
      k.kv([
        ['Client / maître d’ouvrage', d.client],
        ['Adresse du bassin', (d.adresse || '').replace(/\s*\n\s*/g, ', ')],
        ['N° du devis / chantier', d.devis],
        ['Date', frDate(d.date)]
      ]);

      k.section('Information remise');
      k.para(DECLARATION);

      k.section('Dispositif de sécurité prévu');
      const sel = d.dispositifs || [];
      k.checks(DEVICES.map(x => ({ label: x.label + ' (' + x.norm + ')', checked: sel.includes(x.value) })), 2);
      k.checks([
        { label: 'Inclus au devis des Piscines de l’Olympe', checked: hasDevice(d) && d.fourniture === 'olympe' },
        { label: 'Fourni / posé par le client ou un autre prestataire', checked: hasDevice(d) && d.fourniture === 'client' },
        { label: 'Aucun dispositif choisi à ce jour (une régularisation reste obligatoire)', checked: hasNone(d) }
      ], 1);
      if (hasDevice(d)) {
        k.kv([
          ['Précisions', (d.precisions || '').replace(/\s*\n\s*/g, ' ')],
          ['Date prévisionnelle de pose', frDate(d.datePose)]
        ]);
      }

      if (hasNone(d)) {
        k.section('Absence de choix à ce jour');
        k.para(REFUSAL);
        if (d.observations) k.kv([['Observations', d.observations.replace(/\s*\n\s*/g, ' ')]]);
      }

      k.ensure(66); // le titre, les deux signatures et la mention finale restent ensemble
      k.section('Signatures');
      k.signatures([
        { title: 'Le client / maître d’ouvrage', name: d.client, date: frDate(d.date), sig: d.sigClient, note: d.sigClient && d.sigClient.at ? 'Signé sur place le ' + frDateTime(d.sigClient.at) : '' },
        { title: 'Pour Les Piscines de l’Olympe', name: d.tech, date: frDate(d.date), sig: d.sigTech, note: d.sigTech && d.sigTech.at ? 'Signé sur place le ' + frDateTime(d.sigTech.at) : '' }
      ]);
      k.small('Document établi et signé sur écran en présence des deux parties. Un exemplaire est adressé au client par e-mail, un exemplaire est conservé par l’entreprise.');

      return k.finish();
    }
  };
})();
