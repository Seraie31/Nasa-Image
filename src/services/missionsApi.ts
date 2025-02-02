import axios from 'axios';

export type MissionType = 'rover' | 'satellite' | 'probe' | 'telescope';
export type MissionStatus = 'active' | 'completed' | 'planned';

export interface Mission {
  id: string;
  name: string;
  description: string;
  status: MissionStatus;
  launchDate?: string;
  endDate?: string;
  type: MissionType;
  imageUrl: string;
  details: {
    objectives: string[];
    achievements?: string[];
    location?: string;
    technology?: string[];
  };
}

// Données simulées des missions (à remplacer par une vraie API plus tard)
const missions: Mission[] = [
  {
    id: 'perseverance',
    name: 'Mars Perseverance Rover',
    description: 'Le rover Perseverance explore la surface de Mars à la recherche de signes de vie ancienne et collecte des échantillons pour un futur retour sur Terre.',
    status: 'active',
    launchDate: '2020-07-30',
    type: 'rover',
    imageUrl: 'https://mars.nasa.gov/system/feature_items/images/6037_msl_banner.jpg',
    details: {
      objectives: [
        'Rechercher des signes de vie microbienne ancienne',
        'Collecter des échantillons de roches et de régolithe',
        "Tester la production d'oxygène à partir de l'atmosphère martienne"
      ],
      location: 'Cratère Jezero, Mars',
      technology: [
        "MOXIE - Production d'oxygène",
        'SuperCam - Analyse des roches',
        'Ingenuity - Hélicoptère martien'
      ]
    }
  },
  {
    id: 'webb',
    name: 'James Webb Space Telescope',
    description: "Le plus grand et le plus puissant télescope spatial jamais construit, capable d'observer les premières galaxies formées dans l'univers primitif.",
    status: 'active',
    launchDate: '2021-12-25',
    type: 'telescope',
    imageUrl: 'https://stsci-opo.org/STScI-01G7DCYW190F6KWJWH89QPZB45.png',
    details: {
      objectives: [
        'Observer les premières galaxies après le Big Bang',
        "Étudier la formation et l'évolution des galaxies",
        'Comprendre la formation des étoiles et des systèmes planétaires'
      ],
      technology: [
        'Miroir principal segmenté de 6,5 mètres',
        "Instruments d'observation infrarouge",
        'Bouclier solaire en 5 couches'
      ]
    }
  },
  {
    id: 'artemis',
    name: 'Programme Artemis',
    description: 'Programme spatial visant à ramener des humains sur la Lune et à établir une présence durable pour préparer les voyages vers Mars.',
    status: 'active',
    launchDate: '2022-11-16',
    type: 'probe',
    imageUrl: 'https://www.nasa.gov/wp-content/uploads/2023/03/artemis-1-rocket-moon.jpg',
    details: {
      objectives: [
        'Atterrir la première femme et le prochain homme sur la Lune',
        'Établir une base lunaire durable',
        'Développer les technologies pour les missions vers Mars'
      ],
      technology: [
        'Système de lancement spatial (SLS)',
        'Vaisseau spatial Orion',
        'Station spatiale lunaire Gateway'
      ]
    }
  },
  {
    id: 'curiosity',
    name: 'Mars Curiosity Rover',
    description: 'Le rover Curiosity explore le cratère Gale sur Mars pour étudier le climat et la géologie martienne.',
    status: 'active',
    launchDate: '2011-11-26',
    type: 'rover',
    imageUrl: 'https://mars.nasa.gov/system/news_items/main_images/8944_1-curiosity-banner.jpg',
    details: {
      objectives: [
        'Étudier le climat et la géologie de Mars',
        'Évaluer si Mars a pu abriter la vie',
        'Étudier le rayonnement à la surface de Mars'
      ],
      location: 'Cratère Gale, Mars',
      technology: [
        'ChemCam - Analyse chimique par laser',
        'SAM - Analyse des composés organiques',
        'RAD - Détection des radiations'
      ]
    }
  },
  {
    id: 'hubble',
    name: 'Télescope Spatial Hubble',
    description: 'Le télescope spatial Hubble a révolutionné notre compréhension du cosmos depuis plus de 30 ans.',
    status: 'active',
    launchDate: '1990-04-24',
    type: 'telescope',
    imageUrl: 'https://www.nasa.gov/sites/default/files/thumbnails/image/hubble_30th_anniversary.jpg',
    details: {
      objectives: [
        'Observer les galaxies lointaines',
        'Étudier les planètes du système solaire',
        'Capturer des images emblématiques du cosmos'
      ],
      technology: [
        'Miroir principal de 2,4 mètres',
        'Caméras à haute résolution',
        'Spectromètres'
      ]
    }
  },
  {
    id: 'voyager1',
    name: 'Voyager 1',
    description: 'La sonde spatiale Voyager 1 est l\'objet créé par l\'homme le plus éloigné de la Terre, explorant l\'espace interstellaire.',
    status: 'completed',
    launchDate: '1977-09-05',
    type: 'probe',
    imageUrl: 'https://www.nasa.gov/sites/default/files/thumbnails/image/voyager_1.jpg',
    details: {
      objectives: [
        'Explorer Jupiter et Saturne',
        'Étudier l\'espace interstellaire',
        'Transporter le Golden Record'
      ],
      technology: [
        'Instruments de mesure du plasma',
        'Caméras',
        'Antenne à grand gain'
      ],
      achievements: [
        'Premier objet humain à quitter l\'héliosphère',
        'Photos détaillées de Jupiter et Saturne',
        'Plus de 45 ans de fonctionnement'
      ]
    }
  },
  {
    id: 'dragonfly',
    name: 'Dragonfly',
    description: 'Future mission d\'exploration de Titan, la plus grande lune de Saturne, utilisant un drone à propulsion nucléaire.',
    status: 'planned',
    launchDate: '2027-06-01',
    type: 'probe',
    imageUrl: 'https://www.nasa.gov/sites/default/files/thumbnails/image/dragonfly-titan.jpg',
    details: {
      objectives: [
        'Explorer la surface de Titan',
        'Étudier la chimie prébiotique',
        'Rechercher des signes de vie potentielle'
      ],
      location: 'Titan, lune de Saturne',
      technology: [
        'Drone à propulsion nucléaire',
        'Instruments d\'analyse chimique',
        'Caméras panoramiques'
      ]
    }
  }
];

export const getMissions = (): Promise<Mission[]> => {
  // Simulation d'une requête API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(missions);
    }, 1000);
  });
};

export const getMissionById = (id: string): Promise<Mission | undefined> => {
  // Simulation d'une requête API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(missions.find(mission => mission.id === id));
    }, 500);
  });
};
