"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { login as apiLogin, fetchMe, signup as apiSignup } from "@/services/api";

export interface AuthContextType {
  user: any | null;
  loading: boolean;
  isAuthenticated: boolean;
  signin: (username: string, password: string, remember: boolean) => Promise<void>;
  signout: () => void;
  signup: (username: string, email: string, password: string, rePassword: string) => Promise<void>;
  updateUser: (updatedUser: any) => void; // добавили updateUser
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  signin: async () => {},
  signout: () => {},
  signup: async () => {},
  updateUser: () => {}, // заглушка
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const setToken = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("access_token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("access_token");
    }
  };

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
      const { access, refresh } = await apiLogin(username, password);
      setToken(access);
      if (remember) {
        localStorage.setItem("refresh_token", refresh);
      }
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
    } finally {
      setLoading(false);
    }
  };

  const signout = () => {
    setToken(null);
    setUser(null);
  };

  // Добавляем функцию для обновления данных пользователя в контексте
  const updateUser = (updatedUser: any) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        signin,
        signout,
        signup,
        updateUser, // прокидываем в контекст
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
