import axios from "axios";

export interface Painting {
  id: number;
  title: string;
  artist: string;
  description: string;
  artist_id: number;  
  year: number;
  image: string;
  tags: string[];
  archive: boolean;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Artist {
  id: number;
  name: string;
  bio: string;
  image: string;
  paintings: Painting[];
}

const BASE = "/api";

export const fetchPaintings = async (): Promise<Painting[]> => {
  const { data } = await axios.get<Painting[]>(`${BASE}/paintings/`);
  return data.filter(p => !p.archive);
};

export const fetchPaintingById = async (id: number): Promise<Painting> => {
  const { data } = await axios.get<Painting>(`${BASE}/paintings/${id}/`);
  return data;
};

// НОВЫЙ метод — очень важно, чтобы был именно slash в конце!
export const fetchSimilarPaintings = async (id: number): Promise<Painting[]> => {
  const url = `${BASE}/paintings/${id}/similar/`;
  const { data } = await axios.get<Painting[]>(url);
  return data.filter(p => !p.archive);
};

export const fetchArtists = async (): Promise<Artist[]> => {
  const url = `${BASE}/artists/`;
  const { data } = await axios.get<Artist[]>(url);
  return data;
  
}

export const fetchArtistById = async (id: number): Promise<Artist> => {
  const url = `${BASE}/artists/${id}/`;
  const { data } = await axios.get<Artist>(url);
  return data;
}

export const fetchTags = async (): Promise<Tag[]> => {
  const { data } = await axios.get<Tag[]>(`${BASE}/tags/`);
  return data;
};