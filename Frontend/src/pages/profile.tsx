"use client";

import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import { Avatar, Button, Spinner, addToast } from "@heroui/react";
import DefaultLayout from "@/layouts/default";
import { fetchFavorites, Painting } from "@/services/api";
import { MasonryGrid } from "@/components/masonrygrid";

export default function ProfilePage() {
  const { user, loading, isAuthenticated, signout } = useContext(AuthContext);
  const [favorites, setFavorites] = useState<Painting[]>([]);
  const [favLoading, setFavLoading] = useState<boolean>(true);

  // Загрузка избранного при готовности аутентификации
  useEffect(() => {
    if (!loading && isAuthenticated) {
      (async () => {
        try {
          const data = await fetchFavorites();
          setFavorites(data);
        } catch (error: any) {
          addToast({
            title: "Ошибка",
            description: error.response?.data?.detail || "Не удалось загрузить избранное.",
            status: "error",
            duration: 3000,
          });
        } finally {
          setFavLoading(false);
        }
      })();
    }
  }, [loading, isAuthenticated]);

  // Показать лоадер пока проверяется авторизация
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Редирект, если не авторизован
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DefaultLayout>
        <Avatar
        className="mx-auto size-40 mt-5"
        showFallback 
      />
        <h1 className="text-2xl font-bold text-center">
          {user?.name} {user?.last_name}
        </h1>
        <p className="text-center mt-2">@{user?.username}</p>
        <p className="text-center mt-1">{user?.email}</p>
        <div className="flex justify-center mt-4">
          <Button
            variant="solid"
            onClick={signout}
            className="min-w-[200px] bg-red-600 hover:bg-red-700"
          >
            Выйти
          </Button>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-medium mb-4 text-center">
            Ваши любимые работы
          </h2>
          {favLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : (
            <MasonryGrid
              items={favorites}
              onItemClick={(id) => console.log("Clicked favorite painting", id)}
            />
          )}
        </div>
    </DefaultLayout>
  );
}
