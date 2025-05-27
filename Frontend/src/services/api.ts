  import axios, {
    AxiosInstance,
    AxiosError,
    InternalAxiosRequestConfig,
    AxiosHeaders,
  } from "axios";

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
    is_favorite: boolean;
  }

  export interface UserProfile {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
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
    background: string;
    paintings_by_year: {
      [year: string]: Painting[];
    };
  }


  const BASE_URL = "http://localhost:8000/api";

  const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: new AxiosHeaders({
      "Content-Type": "application/json",
    }),
  });

  // ✅ Интерсептор запроса с безопасной установкой заголовка
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      const token = localStorage.getItem("access_token");
      if (token) {
        if (!config.headers) {
          config.headers = new AxiosHeaders();
        }
        if (typeof config.headers.set === "function") {
          config.headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  // ✅ Интерсептор ответа с автообновлением токена
  api.interceptors.response.use(
    (response) => response,
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

            if (error.config?.headers && typeof error.config.headers.set === "function") {
              error.config.headers.set("Authorization", `Bearer ${data.access}`);
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

  // === Аутентификация ===
  export const login = (username: string, password: string) =>
    api.post<{ access: string; refresh: string }>("/auth/jwt/create/", {
      username,
      password,
    }).then(({ data }) => {
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

  // === Картины ===
  export const fetchPaintings = (tagId?: number) => {
    let url = "/paintings/";
    if (tagId != null) {
      url += `?tags=${tagId}`;
    }
    return api.get<Painting[]>(url).then(({ data }) =>
      data.filter((p) => !p.archive)
    );
  };

  export const fetchRecommended = (tagId?: number) => {
    let url = "/recommendations/";
    if (tagId != null) {
      url += `?tags=${tagId}`;
    }
    return api.get<Painting[]>(url).then(({ data }) =>
      data.filter((p) => !p.archive)
    );
  };


  export const fetchPaintingById = (id: number) =>
    api.get<Painting>(`/paintings/${id}/`).then(({ data }) => data);

  export const searchPaintings = (query: string) =>
    api
      .get<Painting[]>(`/paintings/?search=${encodeURIComponent(query)}`)
      .then(({ data }) => data.filter((p) => !p.archive));

  export const fetchSimilarPaintings = (id: number) =>
    api
      .get<Painting[]>(`/paintings/${id}/similar/`)
      .then(({ data }) => data.filter((p) => !p.archive));

  // === Избранное ===
  export const addToFavorites = (id: number) =>
    api.post<Painting>(`/paintings/${id}/favorite/`).then(({ data }) => data);

  export const removeFromFavorites = (id: number) =>
    api.delete<void>(`/paintings/${id}/favorite/`);

  export const fetchFavorites = () =>
    api.get<Painting[]>("/favorites/").then(({ data }) =>
      data.filter((p) => !p.archive)
    );

  // === Авторы ===
  export const fetchArtists = () =>
    api.get<Artist[]>("/artists/").then(({ data }) => data);

  export const fetchArtistById = (id: number) =>
    api.get<Artist>(`/artists/${id}/`).then(({ data }) => data);



  // === Теги ===
  export const fetchTags = () =>
    api.get<Tag[]>("/tags/").then(({ data }) => data);

  export const updateUserProfile = (data: Partial<UserProfile>) =>
    api.patch<UserProfile>("/auth/users/me/", data).then(({ data: user }) => user);

  export default api;
