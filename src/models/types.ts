export interface NasaImage {
  id: string;
  title: string;
  description: string;
  url: string;
  hdurl?: string;
  date: string;
  mediaType: string;
  isApod?: boolean;
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
