import axios from 'axios';
import { NasaImage } from '../models/types';

const NASA_API_KEY = process.env.REACT_APP_NASA_API_KEY;
const NASA_API_URL = 'https://api.nasa.gov';
const NASA_IMAGES_URL = 'https://images-api.nasa.gov';

export const getImageOfTheDay = async (): Promise<NasaImage> => {
  try {
    const response = await axios.get(`${NASA_API_URL}/planetary/apod`, {
      params: {
        api_key: NASA_API_KEY,
      },
    });

    return {
      id: response.data.date,
      title: response.data.title,
      description: response.data.explanation,
      url: response.data.url,
      hdurl: response.data.hdurl,
      date: response.data.date,
      mediaType: response.data.media_type,
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
    const response = await axios.get(`${NASA_IMAGES_URL}/asset/${imageId}`);
    const metadata = await axios.get(`${NASA_IMAGES_URL}/metadata/${imageId}`);

    const imageData = metadata.data.collection.items[0];
    const imageAssets = response.data.collection.items;
    
    // Find the best quality images
    const originalImage = imageAssets.find((asset: any) => 
      asset.href.includes('orig') || asset.href.includes('large')
    ) || imageAssets[0];
    
    const hdImage = imageAssets.find((asset: any) => 
      asset.href.includes('large') || asset.href.includes('orig')
    ) || originalImage;

    return {
      id: imageId,
      title: imageData.title || 'Sans titre',
      description: imageData.description || 'Aucune description disponible',
      url: originalImage.href,
      hdurl: hdImage.href,
      date: imageData.date_created || new Date().toISOString(),
      mediaType: 'image',
    };
  } catch (error) {
    console.error('Error fetching image details:', error);
    throw error;
  }
};
