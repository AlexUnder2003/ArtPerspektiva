"use client";

import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import { Button } from "@heroui/react";
import ARTLOGO from "@/icons/Artlogo";
import { ThemeSwitch } from "@/components/theme-switch";

export default function ProfilePage() {
  const { user, loading, isAuthenticated, signout } = useContext(AuthContext);

  // Пока идёт загрузка — показываем лоадер
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Если пользователь не авторизован — редирект на логин
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Здесь user уже точно не null
  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeSwitch />
      </div>
      <ARTLOGO className="mb-6" />
      <div className="w-full max-w-md bg-white dark:bg-default-100 rounded-large shadow-small p-6">
        <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>
        <div className="space-y-2">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email || "—"}</p>
          <p><strong>ID:</strong> {user.id}</p>
        </div>
        <div className="mt-6 flex space-x-4">
          <Button
            variant="outlined"
            onClick={() => {
              signout();
            }}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}