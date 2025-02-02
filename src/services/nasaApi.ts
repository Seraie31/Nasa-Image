import axios from 'axios';
import { NasaImage } from '../models/types';
import { extractDateFromApodId, isValidApodDate } from '../utils/dateUtils';

const NASA_API_KEY = process.env.REACT_APP_NASA_API_KEY;
const NASA_API_URL = 'https://api.nasa.gov';
const NASA_IMAGES_URL = 'https://images-api.nasa.gov';

// Fonction utilitaire pour formater la date au format YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getImageOfTheDay = async (): Promise<NasaImage> => {
  try {
    // Utiliser la date d'aujourd'hui
    const today = formatDate(new Date());
    
    const response = await axios.get(`${NASA_API_URL}/planetary/apod`, {
      params: {
        api_key: NASA_API_KEY,
        date: today // Ajouter explicitement la date
      },
    });

    return {
      id: 'apod-' + response.data.date,
      title: response.data.title,
      description: response.data.explanation,
      url: response.data.url,
      hdurl: response.data.hdurl || response.data.url, // Fallback vers url si hdurl n'existe pas
      date: response.data.date,
      mediaType: response.data.media_type,
      isApod: true
    };
  } catch (error) {
    console.error('Error fetching image of the day:', error);
    throw error;
  }
};

interface SearchParams {
  q: string;
  media_type?: string;
  year_start?: string;
  year_end?: string;
  page?: number;
  page_size?: number;
}

export const searchImages = async (query: string, page: number = 1): Promise<NasaImage[]> => {
  try {
    const params: SearchParams = {
      q: query,
      media_type: 'image',
      page_size: 100,
      page: page
    };

    // Add year range for better results
    if (query.toLowerCase().includes('earth')) {
      params.year_start = '2015';
    }

    const response = await axios.get(`${NASA_IMAGES_URL}/search`, { params });

    // Filter and process the results
    return response.data.collection.items
      .filter((item: any) => 
        item.links?.[0]?.href && 
        item.data?.[0]?.description &&
        !item.data[0].description.toLowerCase().includes('error') &&
        item.data[0].media_type === 'image'
      )
      .map((item: any) => {
        const data = item.data[0];
        const imageUrl = item.links[0].href;
        
        // Get HD version URL by replacing the size in the URL
        const hdUrl = imageUrl.replace('~thumb.jpg', '~orig.jpg')
                             .replace('~medium.jpg', '~orig.jpg')
                             .replace('~small.jpg', '~orig.jpg');

        return {
          id: data.nasa_id,
          title: data.title,
          description: data.description,
          url: imageUrl,
          hdurl: hdUrl,
          date: data.date_created,
          mediaType: 'image',
        };
      })
      .slice(0, 24); // Limit to 24 images per page for better performance
  } catch (error) {
    console.error('Error searching images:', error);
    throw error;
  }
};

export const getImageDetails = async (imageId: string): Promise<NasaImage> => {
  try {
    // Vérifier si c'est une image APOD
    if (imageId.startsWith('apod-')) {
      const date = extractDateFromApodId(imageId);
      if (!date) {
        throw new Error('Format de date invalide pour APOD (utilisez YYYY-MM-DD)');
      }

      if (!isValidApodDate(date)) {
        throw new Error('Date invalide pour APOD (doit être entre le 16/06/1995 et aujourd\'hui)');
      }

      try {
        const apodResponse = await axios.get(`${NASA_API_URL}/planetary/apod`, {
          params: {
            api_key: NASA_API_KEY,
            date: date
          }
        });

        if (apodResponse.data) {
          return {
            id: imageId,
            title: apodResponse.data.title,
            description: apodResponse.data.explanation,
            url: apodResponse.data.url,
            hdurl: apodResponse.data.hdurl || apodResponse.data.url,
            date: apodResponse.data.date,
            mediaType: apodResponse.data.media_type,
            isApod: true
          };
        }
      } catch (apodError) {
        if (axios.isAxiosError(apodError)) {
          if (apodError.response?.status === 400) {
            throw new Error('Date invalide pour APOD');
          }
          throw new Error(`Erreur lors de la récupération de l'image APOD: ${apodError.response?.status || 'Erreur réseau'}`);
        }
        throw apodError;
      }
    }

    // Si ce n'est pas une image APOD, essayer l'API NASA Images
    const [assetResponse, metadataResponse] = await Promise.all([
      axios.get(`${NASA_IMAGES_URL}/asset/${imageId}`),
      axios.get(`${NASA_IMAGES_URL}/metadata/${imageId}`)
    ]).catch(error => {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error('Image non trouvée dans la bibliothèque NASA');
      }
      throw error;
    });

    if (!assetResponse.data?.collection?.items || !metadataResponse.data?.collection?.items) {
      throw new Error('Format de réponse invalide de l\'API NASA Images');
    }

    const imageData = metadataResponse.data.collection.items[0];
    const imageAssets = assetResponse.data.collection.items;

    if (!imageData || !imageAssets || imageAssets.length === 0) {
      throw new Error('Image non trouvée');
    }

    const originalImage = imageAssets.find((asset: any) => 
      asset.href.includes('orig') || asset.href.includes('large')
    ) || imageAssets[0];

    const hdImage = imageAssets.find((asset: any) => 
      asset.href.includes('large') || asset.href.includes('orig')
    ) || originalImage;

    if (!originalImage.href) {
      throw new Error('URL de l\'image invalide');
    }

    return {
      id: imageId,
      title: imageData.data?.[0]?.title || 'Sans titre',
      description: imageData.data?.[0]?.description || 'Aucune description disponible',
      url: originalImage.href,
      hdurl: hdImage.href,
      date: imageData.data?.[0]?.date_created || new Date().toISOString(),
      mediaType: 'image',
      isApod: false
    };
  } catch (error) {
    console.error('Error fetching image details:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Une erreur inattendue est survenue');
  }
};

export const getAsteroidImage = async (asteroidName: string): Promise<string> => {
  try {
    // Recherche d'images via l'API NASA Image and Video Library
    const response = await axios.get(`https://images-api.nasa.gov/search`, {
      params: {
        q: asteroidName.replace('(', '').replace(')', ''),
        media_type: 'image'
      }
    });

    if (response.data.collection.items.length > 0) {
      // Retourne l'URL de la première image trouvée
      const imageData = response.data.collection.items[0];
      if (imageData.links && imageData.links.length > 0) {
        return imageData.links[0].href;
      }
    }

    // Si aucune image spécifique n'est trouvée, retourne une image générique d'astéroïde
    return '/images/generic-asteroid.jpg';
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'image de l\'astéroïde:', error);
    return '/images/generic-asteroid.jpg';
  }
};
