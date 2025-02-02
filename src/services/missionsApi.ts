import axios from 'axios';

export interface Mission {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'planned';
  launchDate?: string;
  endDate?: string;
  type: 'rover' | 'satellite' | 'probe' | 'telescope';
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
  }
];

export const getMissions = async (): Promise<Mission[]> => {
  // Simulation d'une requête API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(missions);
    }, 1000);
  });
};

export const getMissionById = async (id: string): Promise<Mission | undefined> => {
  // Simulation d'une requête API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(missions.find(mission => mission.id === id));
    }, 500);
  });
};
