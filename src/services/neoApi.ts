import axios from 'axios';

const NASA_API_KEY = process.env.REACT_APP_NASA_API_KEY;
const NASA_API_URL = 'https://api.nasa.gov';

export interface NearEarthObject {
  id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    close_approach_date: string;
    close_approach_date_full: string;
    epoch_date_close_approach: number;
    relative_velocity: {
      kilometers_per_second: string;
      kilometers_per_hour: string;
    };
    miss_distance: {
      astronomical: string;
      lunar: string;
      kilometers: string;
    };
    orbiting_body: string;
  }>;
  orbital_data?: {
    orbit_class: {
      orbit_class_type: string;
      orbit_class_description: string;
    };
    orbit_determination_date: string;
    first_observation_date: string;
    last_observation_date: string;
    orbital_period: string;
    perihelion_distance: string;
    aphelion_distance: string;
  };
}

export interface NeoFeed {
  element_count: number;
  near_earth_objects: {
    [date: string]: NearEarthObject[];
  };
}

export const getNeoFeed = async (startDate: string, endDate: string): Promise<NeoFeed> => {
  try {
    const response = await axios.get(`${NASA_API_URL}/neo/rest/v1/feed`, {
      params: {
        start_date: startDate,
        end_date: endDate,
        api_key: NASA_API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching NEO feed:', error);
    throw new Error('Erreur lors de la récupération des données NEO');
  }
};

export const getNeoById = async (asteroidId: string): Promise<NearEarthObject> => {
  try {
    const response = await axios.get(
      `${NASA_API_URL}/neo/rest/v1/neo/${asteroidId}`,
      {
        params: {
          api_key: NASA_API_KEY
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching NEO details:', error);
    throw new Error('Erreur lors de la récupération des détails de l\'astéroïde');
  }
};

export const calculateDangerLevel = (neo: NearEarthObject): number => {
  let score = 0;
  
  // Facteur de danger basé sur la taille
  const avgDiameter = (
    neo.estimated_diameter.kilometers.estimated_diameter_min +
    neo.estimated_diameter.kilometers.estimated_diameter_max
  ) / 2;
  
  if (avgDiameter > 1) score += 3;
  else if (avgDiameter > 0.5) score += 2;
  else if (avgDiameter > 0.1) score += 1;

  // Facteur de danger basé sur la proximité
  const closestApproach = neo.close_approach_data.reduce((min, approach) => {
    const distance = parseFloat(approach.miss_distance.astronomical);
    return distance < min ? distance : min;
  }, Infinity);

  if (closestApproach < 0.05) score += 3;
  else if (closestApproach < 0.1) score += 2;
  else if (closestApproach < 0.2) score += 1;

  // Bonus pour les astéroïdes potentiellement dangereux
  if (neo.is_potentially_hazardous_asteroid) score += 2;

  return Math.min(score, 5); // Score maximum de 5
};

export const formatVelocity = (velocity: string): string => {
  const vel = parseFloat(velocity);
  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 2
  }).format(vel);
};

export const formatDistance = (distance: string, unit: 'km' | 'lunar' | 'au'): string => {
  const dist = parseFloat(distance);
  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: unit === 'au' ? 3 : 0
  }).format(dist);
};
