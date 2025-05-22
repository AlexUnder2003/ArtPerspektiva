"use client";

import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import { Avatar, Button, Spinner, addToast } from "@heroui/react";
import DefaultLayout from "@/layouts/default";
import { fetchFavorites, Painting, fetchMe} from "@/services/api";
import { MasonryGrid } from "@/components/masonrygrid";
import { ProfileEditModal } from "@/components/profileeditmodal";
import type { UserProfile } from "@/services/api";

export default function ProfilePage() {
  const { user, loading, isAuthenticated, signout, reloadUser } = useContext(AuthContext);
  const [isEditOpen, setEditOpen] = useState(false);
  const [favorites, setFavorites] = useState<Painting[]>([]);
  const [favLoading, setFavLoading] = useState(true);
  const navigate = useNavigate();

  // Загрузка избранного
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

  // Лоадер страницы
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

  // Обработчик сохранения из модалки
  const handleSaveProfile = async (updated: UserProfile) => {
    // Здесь мы предполагаем, что AuthContext имеет метод reloadUser,
    // который заново делает fetchMe() и пушит в контекст.
    if (reloadUser) {
      await reloadUser();
    } else {
      // если reloadUser нет, можно вручную установить user в контексте
      // или просто обновить локальный профиль:
      // setLocalUser(updated);
    }
    addToast({ title: "Профиль обновлён", status: "success", duration: 3000 });
  };

  return (
    <DefaultLayout>
      {/* Модалка должна быть на верхнем уровне JSX */}
      <ProfileEditModal
        isOpen={isEditOpen}
        onClose={() => setEditOpen(false)}
        user={user as UserProfile}
        onSave={handleSaveProfile}
      />

      <div className="pt-8 px-4 max-w-screen-lg mx-auto">
        <Avatar
          src={(user as UserProfile).avatar}
          showFallback
          name={(user as UserProfile).username}
          className="mx-auto mb-4 size-40"
        />
        <h1 className="text-2xl font-bold text-center">
          {(user as UserProfile).first_name} {(user as UserProfile).last_name}
        </h1>
        <p className="text-center mt-2">@{(user as UserProfile).username}</p>
        <p className="text-center mt-1">{(user as UserProfile).email}</p>

        <div className="flex justify-center mt-4 space-x-4">
          <Button
            variant="solid"
            onClick={() => setEditOpen(true)}
            className="min-w-[200px]"
          >
            Редактировать
          </Button>
          <Button
            variant="solid"
            onClick={signout}
            className="min-w-[200px] bg-red-600 hover:bg-red-700"
          >
            Выйти
          </Button>
        </div>
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
              onItemClick={(id) => navigate(`/detail/${id}`)}
            />
          )}
        </div>
    </DefaultLayout>
  );
}
