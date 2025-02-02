import axios from 'axios';

const NASA_API_KEY = process.env.REACT_APP_NASA_API_KEY;
const NASA_API_URL = 'https://api.nasa.gov';
const NASA_IMAGES_URL = 'https://images-api.nasa.gov';

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

// Fonction pour obtenir les données des rovers martiens
const getMarsRovers = async (): Promise<Mission[]> => {
  try {
    const response = await axios.get(`${NASA_API_URL}/mars-photos/api/v1/rovers`, {
      params: { api_key: NASA_API_KEY }
    });

    return response.data.rovers.map((rover: any) => ({
      id: rover.name.toLowerCase(),
      name: `${rover.name} Rover`,
      description: `Rover d'exploration martienne ${rover.status === 'active' ? 'explorant actuellement' : 'ayant exploré'} la surface de Mars.`,
      status: rover.status === 'active' ? 'active' : 'completed',
      launchDate: rover.launch_date,
      endDate: rover.max_date,
      type: 'rover',
      imageUrl: `https://mars.nasa.gov/system/feature_items/images/${rover.name.toLowerCase()}_banner.jpg`,
      details: {
        objectives: [
          'Explorer la surface martienne',
          'Analyser la composition des roches',
          'Rechercher des signes de vie ancienne'
        ],
        location: rover.landing_site,
        technology: [
          'Caméras haute résolution',
          'Instruments d\'analyse chimique',
          'Bras robotique'
        ]
      }
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des rovers:', error);
    return [];
  }
};

// Fonction pour obtenir les images et informations des missions via l'API NASA Images
const getMissionImages = async (query: string): Promise<any> => {
  try {
    const response = await axios.get(`${NASA_IMAGES_URL}/search`, {
      params: {
        q: query,
        media_type: 'image',
        year_start: '2020',
        page_size: 1
      }
    });

    if (response.data.collection.items.length > 0) {
      const item = response.data.collection.items[0];
      return {
        imageUrl: item.links?.[0]?.href,
        description: item.data[0]?.description
      };
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération des images:', error);
    return null;
  }
};

// Fonction pour obtenir les données des missions spatiales actuelles
const getCurrentMissions = async (): Promise<Mission[]> => {
  const baseMissions = [
    {
      id: 'webb',
      name: 'James Webb Space Telescope',
      type: 'telescope' as MissionType,
      status: 'active' as MissionStatus,
      description: "Le plus grand et le plus puissant télescope spatial jamais construit.",
      imageUrl: 'https://www.nasa.gov/wp-content/uploads/2023/03/nasa-logo-web-rgb.png',
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
      type: 'probe' as MissionType,
      status: 'active' as MissionStatus,
      description: 'Programme spatial visant à ramener des humains sur la Lune.',
      imageUrl: 'https://www.nasa.gov/wp-content/uploads/2023/03/nasa-logo-web-rgb.png',
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
      id: 'dragonfly',
      name: 'Dragonfly',
      type: 'probe' as MissionType,
      status: 'planned' as MissionStatus,
      description: "Mission d'exploration de Titan, la plus grande lune de Saturne.",
      imageUrl: 'https://www.nasa.gov/wp-content/uploads/2023/03/nasa-logo-web-rgb.png',
      details: {
        objectives: [
          'Explorer la surface de Titan',
          'Étudier la chimie prébiotique',
          'Rechercher des signes de vie potentielle'
        ],
        technology: [
          'Drone à propulsion nucléaire',
          "Instruments d'analyse chimique",
          'Caméras panoramiques'
        ],
        location: 'Titan, lune de Saturne'
      }
    }
  ];

  // Enrichir chaque mission avec des données de l'API NASA Images
  const enrichedMissions = await Promise.all(
    baseMissions.map(async (mission) => {
      const imageData = await getMissionImages(mission.name);
      return {
        ...mission,
        imageUrl: imageData?.imageUrl || mission.imageUrl,
        description: imageData?.description || mission.description
      };
    })
  );

  return enrichedMissions;
};

export const getMissions = async (): Promise<Mission[]> => {
  try {
    // Obtenir les données des rovers et des missions actuelles en parallèle
    const [rovers, currentMissions] = await Promise.all([
      getMarsRovers(),
      getCurrentMissions()
    ]);

    // Combiner les résultats
    const allMissions = [...rovers, ...currentMissions];

    // Trier les missions par date de lancement (les plus récentes en premier)
    return allMissions.sort((a, b) => {
      if (!a.launchDate) return 1;
      if (!b.launchDate) return -1;
      return new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime();
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des missions:', error);
    throw new Error('Impossible de récupérer les données des missions');
  }
};

export const getMissionById = async (id: string): Promise<Mission | undefined> => {
  const missions = await getMissions();
  return missions.find(mission => mission.id === id);
};
