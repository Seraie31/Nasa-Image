import axios from 'axios';
import { NASA_API_KEY } from '../config';
import { apiCache } from '../utils/apiCache';

export interface EarthImage {
  identifier: string;
  caption: string;
  image: string;
  version: string;
  date: string;
  coords: {
    centroid_coordinates: {
      lat: number;
      lon: number;
    };
    dscovr_j2000_position: {
      x: number;
      y: number;
      z: number;
    };
    lunar_j2000_position: {
      x: number;
      y: number;
      z: number;
    };
    sun_j2000_position: {
      x: number;
      y: number;
      z: number;
    };
    attitude_quaternions: {
      q0: number;
      q1: number;
      q2: number;
      q3: number;
    };
  };
}

export const getLatestEarthImages = async (): Promise<EarthImage[]> => {
  const cacheKey = 'latest_earth_images';
  const cachedData = apiCache.get<EarthImage[]>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  if (!apiCache.canMakeRequest()) {
    const waitTime = apiCache.getTimeUntilNextRequest();
    throw new Error(`Limite de requêtes atteinte. Veuillez réessayer dans ${Math.ceil(waitTime / 1000)} secondes.`);
  }

  try {
    apiCache.recordRequest();
    const response = await axios.get('https://api.nasa.gov/EPIC/api/natural', {
      params: {
        api_key: NASA_API_KEY
      }
    });

    const formattedData = response.data.map((item: any) => {
      const date = new Date(item.date);
      const formattedDate = `${date.getUTCFullYear()}/${String(date.getUTCMonth() + 1).padStart(2, '0')}/${String(date.getUTCDate()).padStart(2, '0')}`;
      
      return {
        ...item,
        image: `https://api.nasa.gov/EPIC/archive/natural/${formattedDate}/png/${item.image}.png?api_key=${NASA_API_KEY}`
      };
    });

    apiCache.set(cacheKey, formattedData);
    return formattedData;
  } catch (error) {
    console.error('Erreur lors de la récupération des images de la Terre:', error);
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      throw new Error('Limite de requêtes atteinte. Veuillez réessayer plus tard.');
    }
    throw new Error('Impossible de récupérer les images de la Terre');
  }
};

export const getEarthImagesByDate = async (date: Date): Promise<EarthImage[]> => {
  const formattedDate = date.toISOString().split('T')[0];
  const cacheKey = `earth_images_${formattedDate}`;
  const cachedData = apiCache.get<EarthImage[]>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  if (!apiCache.canMakeRequest()) {
    const waitTime = apiCache.getTimeUntilNextRequest();
    throw new Error(`Limite de requêtes atteinte. Veuillez réessayer dans ${Math.ceil(waitTime / 1000)} secondes.`);
  }

  try {
    apiCache.recordRequest();
    const response = await axios.get(`https://api.nasa.gov/EPIC/api/natural/date/${formattedDate}`, {
      params: {
        api_key: NASA_API_KEY
      }
    });

    const formattedData = response.data.map((item: any) => {
      const imageDate = new Date(item.date);
      const formattedImageDate = `${imageDate.getUTCFullYear()}/${String(imageDate.getUTCMonth() + 1).padStart(2, '0')}/${String(imageDate.getUTCDate()).padStart(2, '0')}`;
      
      return {
        ...item,
        image: `https://api.nasa.gov/EPIC/archive/natural/${formattedImageDate}/png/${item.image}.png?api_key=${NASA_API_KEY}`
      };
    });

    apiCache.set(cacheKey, formattedData);
    return formattedData;
  } catch (error) {
    console.error('Erreur lors de la récupération des images de la Terre:', error);
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      throw new Error('Limite de requêtes atteinte. Veuillez réessayer plus tard.');
    }
    throw new Error('Impossible de récupérer les images de la Terre pour cette date');
  }
};
