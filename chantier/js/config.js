/* Réglages de l'outil : coordonnées de l'entreprise et liste des documents.
   C'est le seul fichier à modifier pour changer une adresse ou un téléphone. */
window.OLYMPE = {
  /* Numéro affiché en bas de l'accueil : pratique pour savoir quelle version a un téléphone. */
  version: '2.2',

  /* Adresse du serveur qui gère les comptes, les codes et le fichier clients partagé.
     Sans cette ligne, l'outil fonctionne seul avec le code unique ci-dessous. */
  api: '/api/chantier',

  /* Code d'accès unique à 6 chiffres (utilisé seulement sans serveur). Seule son empreinte est écrite ici.
     Pour le changer : « python outils/changer_code.py » (ne pas modifier ces lignes à la main). */
  /* ACCES-DEBUT */
  access: { iterations: 150000, salt: 'd596293b7e885a0a', hash: 'e0efdc7e05bae5f0493d5ce649491c6e198b4db4a85565870d69b2ec66f956d4' },
  /* ACCES-FIN */

  company: {
    name: 'Les Piscines de l’Olympe',
    legal: 'SASU GAF LES PISCINES DE L’OLYMPE',
    address: ['ZA du Meyrol', 'Déviation Poids Lourds', '26200 Montélimar'],
    phone: '04 75 90 23 18',
    email: 'gaf.olympe@orange.fr',
    web: 'www.lespiscinesdelolympe.fr'
  },

  /* Documents affichés sur la page d'accueil, dans cet ordre.
     « soon: true » affiche la carte sans la rendre cliquable. */
  catalog: [
    {
      id: 'securite',
      title: 'Sécurité de la piscine',
      desc: 'Notice d’information et attestation signée',
      icon: 'shield'
    },
    {
      id: 'reception',
      title: 'Réception de chantier',
      desc: 'PV, documents remis, mise en service',
      icon: 'clipboard'
    },
    {
      id: 'levee',
      title: 'Levée des réserves',
      desc: 'Vérification des réserves d’un PV signé',
      icon: 'tasks'
    },
    {
      id: 'carnet',
      title: 'Carnet d’entretien',
      desc: 'Analyse de l’eau et compte rendu de visite',
      icon: 'drop',
      soon: true
    }
  ],

  /* Rempli par les fichiers doc-*.js */
  docs: {}
};
