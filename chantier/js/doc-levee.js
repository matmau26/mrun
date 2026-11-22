/* Document « Levée des réserves » : à utiliser après un PV de réception signé avec réserves.
   Les réserves des PV terminés sur ce téléphone sont proposées pour éviter de les ressaisir. */
(function () {
  'use strict';
  const O = window.OLYMPE, U = O.util;

  const STATUTS = [{ value: 'levee', label: 'Levée' }, { value: 'reste', label: 'Reste à traiter' }];
  const MANUEL = 'manuel';

  const restantes = d => (d.reserves || []).filter(r => r.statut === 'reste').length;
  const bilan = d => {
    const n = restantes(d);
    return n === 0 ? 'Toutes les réserves sont levées et acceptées.'
      : n === 1 ? 'Une réserve reste à traiter.' : n + ' réserves restent à traiter.';
  };

  O.docs.levee = {
    id: 'levee',
    title: 'Levée des réserves',
    pdfTitle: 'Fiche de levée des réserves signée',

    defaults() {
      return { date: U.today(), reserves: [{}] };
    },

    steps: [
      {
        id: 'pv', title: 'PV concerné',
        lead: 'Le procès-verbal de réception signé avec réserves.',
        fields: [
          {
            type: 'choice', name: 'source', label: 'PV enregistrés sur ce téléphone',
            when: () => U.pending.list().length > 0,
            options: () => U.pending.list().map(p => ({
              value: p.id, label: p.client,
              hint: 'PV du ' + U.frDate(p.datePv) + ' · ' + p.reserves.length + ' réserve' + (p.reserves.length > 1 ? 's' : '')
            })).concat([{ value: MANUEL, label: 'Autre PV', hint: 'Saisie manuelle' }]),
            onChange(d, v) {
              const p = U.pending.list().find(x => x.id === v);
              if (!p) return;
              d.client = p.client; d.adresse = p.adresse; d.email = p.email; d.devis = p.devis; d.datePv = p.datePv;
              d.reserves = p.reserves.map(t => ({ rappel: t }));
            }
          },
          { type: 'client', map: { client: 'client', email: 'email', adresse: 'adresse' }, when: () => O.clients.count() > 0 },
          { type: 'text', name: 'client', label: 'Client / maître d’ouvrage', placeholder: 'Nom et prénom', required: true, capitalize: 'words' },
          { type: 'textarea', name: 'adresse', label: 'Adresse du chantier', required: true, rows: 2 },
          { type: 'email', name: 'email', label: 'E-mail du client', optional: true, hint: 'Pour lui envoyer son exemplaire.' },
          { type: 'row', fields: [
            { type: 'date', name: 'datePv', label: 'PV initial du', required: true },
            { type: 'text', name: 'devis', label: 'Référence', optional: true }
          ] }
        ]
      },
      {
        id: 'visite', title: 'Visite de levée',
        fields: [
          { type: 'date', name: 'date', label: 'Date de la visite', required: true },
          { type: 'text', name: 'lieu', label: 'Fait à', placeholder: 'Commune', required: true, capitalize: 'words' },
          { type: 'text', name: 'tech', label: 'Intervenant', placeholder: 'Nom et prénom', required: true, capitalize: 'words', remember: 'tech' }
        ]
      },
      {
        id: 'reserves', title: 'Réserves',
        lead: 'Reprenez chaque réserve du PV, puis indiquez le résultat constaté avec le client.',
        fields: [
          {
            type: 'list', name: 'reserves', itemLabel: 'Réserve', addLabel: 'Ajouter une réserve', min: 1,
            error: 'Ajoutez au moins une réserve.',
            fields: [
              { type: 'textarea', name: 'rappel', label: 'Rappel de la réserve', required: true, rows: 2 },
              { type: 'textarea', name: 'resultat', label: 'Intervention / résultat constaté', required: true, rows: 2 },
              { type: 'choice', name: 'statut', label: 'Statut', required: true, inline: true, options: STATUTS },
              { type: 'photos', name: 'photos', label: 'Photos', max: 2 }
            ]
          }
        ]
      },
      {
        id: 'signatures', title: 'Signatures',
        lead: 'Le client signe, puis l’intervenant.',
        fields: [
          { type: 'statement', title: 'Décision', text: d => [bilan(d)] },
          { type: 'textarea', name: 'observations', label: 'Observations du client', optional: true, rows: 3 },
          { type: 'ack', name: 'luApprouve', label: 'Lu et approuvé', required: true, error: 'Le client confirme par « Lu et approuvé » avant de signer.' },
          { type: 'signature', name: 'sigClient', label: 'Signature du client', signer: d => d.client, required: true },
          { type: 'signature', name: 'sigTech', label: 'Signature de l’intervenant', signer: d => d.tech, required: true }
        ]
      }
    ],

    draftLabel: d => d.client || 'Client à renseigner',

    summary(d) {
      return [
        ['Client', d.client],
        ['Chantier', d.adresse],
        ['PV initial du', U.frDate(d.datePv)],
        ['Visite du', U.frDate(d.date)],
        ['Résultat', bilan(d)]
      ];
    },

    filename: d => U.fileName('Levee-reserves', d.client, d.date),

    mail(d) {
      return {
        to: [d.email, O.company.email].filter(Boolean),
        subject: 'Votre piscine – fiche de levée des réserves signée',
        body: 'Bonjour,\n\nVeuillez trouver ci-joint la fiche de levée des réserves signée le ' + U.frDate(d.date) + ', à la suite du procès-verbal de réception du ' + U.frDate(d.datePv) + '.\n\nNous restons à votre disposition pour toute question.\n\nCordialement,\n' + (d.tech || '') + '\n' + O.company.name + '\n' + O.company.phone
      };
    },

    /* Met à jour les réserves gardées sur le téléphone */
    onFinish(d) {
      if (d.source && d.source !== MANUEL) {
        U.pending.update(d.source, (d.reserves || []).filter(r => r.statut === 'reste').map(r => r.rappel));
      }
    },

    async buildPdf(d) {
      const k = await window.OlympePdf.create({ label: 'Levée des réserves', title: 'Fiche de levée des réserves' });
      const n = restantes(d);
      k.title('Fiche de levée des réserves');
      k.intro('Chaque réserve du procès-verbal de réception est reprise ci-dessous avec le résultat de la vérification contradictoire.');
      k.kv([
        ['Client / chantier', d.client + ' – ' + U.oneLine(d.adresse)],
        ['PV initial du', U.frDate(d.datePv) + (d.devis ? '  ·  Référence : ' + d.devis : '')],
        ['Date de visite de levée', U.frDate(d.date)],
        ['Intervenant', d.tech]
      ]);

      k.section('Réserves');
      k.table({
        head: ['N°', 'Rappel précis de la réserve', 'Intervention / résultat constaté', 'Statut'],
        widths: [0.07, 0.38, 0.38, 0.17],
        rows: (d.reserves || []).map((r, i) => [i + 1, U.oneLine(r.rappel), U.oneLine(r.resultat), r.statut === 'levee' ? 'Levée' : 'Reste à traiter'])
      });

      k.section('Décision');
      k.checks([
        { label: 'Toutes les réserves ci-dessus sont levées et acceptées.', checked: n === 0 },
        { label: 'Certaines réserves restent à traiter ; elles sont signalées dans le tableau ci-dessus.', checked: n > 0 },
        { label: 'Le client formule les observations suivantes :', checked: !!d.observations }
      ], 1);
      if (d.observations) k.para(d.observations, { indent: 5.6 });

      k.ensure(66);
      k.section('Signatures', 1);
      k.para('Fait à ' + d.lieu + ', le ' + U.frDate(d.date) + '.', { bold: true });
      k.signatures([
        {
          title: 'Le maître d’ouvrage / client', name: d.client, date: U.frDate(d.date), sig: d.sigClient,
          mention: d.luApprouve ? 'Lu et approuvé' : '',
          note: d.sigClient && d.sigClient.at ? 'Signé sur place le ' + U.frDateTime(d.sigClient.at) : ''
        },
        {
          title: 'L’entreprise – Les Piscines de l’Olympe', name: d.tech, date: U.frDate(d.date), sig: d.sigTech,
          note: d.sigTech && d.sigTech.at ? 'Signé sur place le ' + U.frDateTime(d.sigTech.at) : ''
        }
      ]);

      const photos = [];
      (d.reserves || []).forEach((r, i) => (r.photos || []).forEach(p =>
        photos.push({ data: p.data, w: p.w, h: p.h, caption: 'Réserve ' + (i + 1) + ' – ' + U.oneLine(r.rappel) })));
      if (photos.length) {
        k.newPage();
        k.title('Annexe – photos');
        k.photos(photos);
      }
      return k.finish();
    }
  };
})();
