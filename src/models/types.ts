export interface NasaImage {
  title: string;
  description: string;
  date: string;
  url: string;
  media_type: string;
  hdurl?: string;
}

export interface SearchResponse {
  collection: {
    items: NasaImage[];
    metadata: {
      total_hits: number;
    };
  };
}

export interface ThreeDModel {
  id: string;
  name: string;
  modelUrl: string;
  thumbnail: string;
  description: string;
}
