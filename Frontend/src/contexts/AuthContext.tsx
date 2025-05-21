"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { login as apiLogin, fetchMe, signup as apiSignup } from "@/services/api";

export interface AuthContextType {
  user: any | null;
  loading: boolean;
  isAuthenticated: boolean;
  signin: (username: string, password: string, remember: boolean) => Promise<void>;
  signout: () => void;
  signup: (username: string, email: string, password: string, rePassword: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  signin: async () => {},
  signout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Устанавливаем JWT в axios
  const setToken = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("access_token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("access_token");
    }
  };

  // При монтировании проверяем токен
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setToken(token);
      fetchMe()
        .then(({ data }) => setUser(data))
        .catch(() => setToken(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const signin = async (
    username: string,
    password: string,
    remember: boolean
    ) => {
    setLoading(true);
    try {
        // apiLogin сразу возвращает { access, refresh }
        const { access, refresh } = await apiLogin(username, password);

        // кладём access в заголовки и в localStorage
        setToken(access);

        // опционально сохраняем refresh
        if (remember) {
        localStorage.setItem("refresh_token", refresh);
        }

        // подгружаем профиль
        const me = await fetchMe();
        setUser(me.data);
    } finally {
        setLoading(false);
    }
    };

    const signup = async (
    username: string,
    email: string,
    password: string,
    rePassword: string
    ) => {
    setLoading(true);
    try {
        await apiSignup(username, email, password, rePassword);
        // после успеха можно автоматически логинить
        // или просто возвращать управление в компонент 
    } finally {
        setLoading(false);
    }
    };


  const signout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated: !!user, signin, signout, signup }}
    >
      {children}
    </AuthContext.Provider>
  );
}
