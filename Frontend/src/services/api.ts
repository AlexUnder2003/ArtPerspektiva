import axios from "axios";

export interface Painting {
  id: number;
  title: string;
  artist: string;
  year: number;
  image: string;
  tags: string[];
  archive: boolean;
}

const BASE = "http://127.0.0.1:8000/api/paintings";

export const fetchPaintings = async (): Promise<Painting[]> => {
  const { data } = await axios.get<Painting[]>(`${BASE}/`);
  return data.filter(p => !p.archive);
};

export const fetchPaintingById = async (id: number): Promise<Painting> => {
  const { data } = await axios.get<Painting>(`${BASE}/${id}/`);
  return data;
};

// НОВЫЙ метод — очень важно, чтобы был именно slash в конце!
export const fetchSimilarPaintings = async (id: number): Promise<Painting[]> => {
  const url = `${BASE}/${id}/similar/`;
  console.log(">>> fetchSimilarPaintings url:", url); // временный лог
  const { data } = await axios.get<Painting[]>(url);
  return data.filter(p => !p.archive);
};