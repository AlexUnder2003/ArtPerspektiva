import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

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

// Базовый URL вашего бэкенда
const BASE_URL = "http://127.0.0.1:8000/api";

// Создаем один экземпляр axios
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Интерсептор для добавления токена
api.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Авто-обновление токена при 401
api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const { data } = await axios.post<{ access: string }>(
            `${BASE_URL}/auth/jwt/refresh/`,
            { refresh: refreshToken }
          );
          localStorage.setItem("access_token", data.access);
          if (error.config?.headers) {
            error.config.headers["Authorization"] = `Bearer ${data.access}`;
          }
          return api.request(error.config!);
        } catch {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

// === АУТЕНТИФИКАЦИЯ ===
export const login = (username: string, password: string) =>
  api.post<{ access: string; refresh: string }>(
    "/auth/jwt/create/",
    { username, password }
  ).then(({ data }) => {
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    return data;
  });

export const signup = (
  username: string,
  email: string,
  password: string,
  re_password: string
) => api.post("/auth/users/", { username, email, password, re_password });

export const fetchMe = () => api.get("/auth/users/me/");

// === КАРТИНЫ ===
export const fetchPaintings = () =>
  api.get<Painting[]>("/paintings/").then(({ data }) =>
    data.filter(p => !p.archive)
  );

export const fetchPaintingById = (id: number) =>
  api.get<Painting>(`/paintings/${id}/`).then(({ data }) => data);

export const searchPaintings = (query: string) =>
  api
    .get<Painting[]>(`/paintings/?search=${encodeURIComponent(query)}`)
    .then(({ data }) => data.filter(p => !p.archive));

export const fetchSimilarPaintings = (id: number) =>
  api.get<Painting[]>(`/paintings/${id}/similar/`).then(({ data }) =>
    data.filter(p => !p.archive)
  );

// === Избранное ===
/**
 * Добавить картину в избранное
 * POST /paintings/{id}/favorite/
 */
export const addToFavorites = (id: number) =>
  api.post<Painting>(`/paintings/${id}/favorite/`).then(({ data }) => data);

/**
 * Убрать картину из избранного
 * DELETE /paintings/{id}/favorite/
 */
export const removeFromFavorites = (id: number) =>
  api.delete<void>(`/paintings/${id}/favorite/`);

/**
 * Получить список избранных картин пользователя
 * GET /favorites/
 */
export const fetchFavorites = () =>
  api.get<Painting[]>("/favorites/").then(({ data }) =>
    data.filter(p => !p.archive)
  );

// === АВТОРЫ ===
export const fetchArtists = () =>
  api.get<Artist[]>("/artists/").then(({ data }) => data);

export const fetchArtistById = (id: number) =>
  api.get<Artist>(`/artists/${id}/`).then(({ data }) => data);

export const searchArtists = (query: string) =>
  api
    .get<Artist[]>(`/artists/?search=${encodeURIComponent(query)}`)
    .then(({ data }) => data);

// === ТЕГИ ===
export const fetchTags = () =>
  api.get<Tag[]>("/tags/").then(({ data }) => data);

export default api;
