import axios from 'axios';
import { NASA_API_KEY } from '../config';

export const getAsteroidImageUrl = async (asteroidName: string): Promise<string> => {
  try {
    // Recherche d'images via l'API NASA Image and Video Library
    const response = await axios.get(`https://images-api.nasa.gov/search`, {
      params: {
        q: `asteroid ${asteroidName.replace('(', '').replace(')', '')}`,
        media_type: 'image'
      }
    });

    if (response.data.collection.items.length > 0) {
      const item = response.data.collection.items[0];
      if (item.links && item.links.length > 0) {
        return item.links[0].href;
      }
    }

    // Si aucune image spécifique n'est trouvée, utiliser une image d'astéroïde générique depuis l'API APOD
    const apodResponse = await axios.get(`https://api.nasa.gov/planetary/apod`, {
      params: {
        api_key: NASA_API_KEY,
        count: 1,
        thumbs: true
      }
    });

    if (apodResponse.data[0].media_type === 'image') {
      return apodResponse.data[0].url;
    }

    // Si tout échoue, utiliser une URL d'image statique
    return 'https://www.nasa.gov/wp-content/uploads/2019/07/asteroid-990x557.jpg';
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'image:', error);
    return 'https://www.nasa.gov/wp-content/uploads/2019/07/asteroid-990x557.jpg';
  }
};
