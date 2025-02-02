import axios from 'axios';

const NASA_API_KEY = process.env.REACT_APP_NASA_API_KEY;
const BASE_URL = 'https://api.nasa.gov';

const nasaApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: NASA_API_KEY,
  },
});

export const searchImages = async (query: string) => {
  try {
    const response = await nasaApi.get('/search', {
      params: {
        q: query,
        media_type: 'image',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching NASA images:', error);
    throw error;
  }
};

export const getImageOfTheDay = async () => {
  try {
    const response = await nasaApi.get('/planetary/apod');
    return response.data;
  } catch (error) {
    console.error('Error fetching image of the day:', error);
    throw error;
  }
};

export default nasaApi;
