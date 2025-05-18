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

export const fetchPaintings = async (): Promise<Painting[]> => {
  const { data } = await axios.get<Painting[]>('http://127.0.0.1:8000/api/paintings/');
  // Фильтруем архивированные
  return data.filter(p => !p.archive);
};