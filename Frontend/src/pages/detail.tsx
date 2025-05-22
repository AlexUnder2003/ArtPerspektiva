"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Avatar, Image, Button, addToast } from "@heroui/react";
import DefaultLayout from "@/layouts/default";
import { Icon } from "@iconify/react";
import { MasonryGrid } from "@/components/masonrygrid";
import {
  Painting,
  Artist,
  fetchPaintingById,
  fetchSimilarPaintings,
  fetchArtistById,
  addToFavorites,
  removeFromFavorites,
} from "@/services/api";
import { RequireAuthButton } from "@/components/authmodal";

const ArtDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const paintingId = Number(id);
  const navigate = useNavigate();
  const location = useLocation();

  const [painting, setPainting] = useState<Painting | null>(null);
  const [related, setRelated] = useState<Painting[]>([]);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!paintingId) return;
    fetchPaintingById(paintingId)
      .then(data => {
        setPainting(data);
        return fetchArtistById(data.artist_id);
      })
      .then(setArtist)
      .catch(console.error);
    fetchSimilarPaintings(paintingId)
      .then(setRelated)
      .catch(console.error);
  }, [paintingId]);

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location]);

  const handleOpen = () => {
    document.body.style.overflow = "hidden";
    setIsFullscreen(true);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    document.body.style.overflow = "";
    setIsFullscreen(false);
  };

  const handleContact = () => {
    console.log("Связаться с продавцом для", painting?.id);
  };

  const handleToggleFavorite = async () => {
    if (!painting) return;
    try {
      if (painting.is_favorite) {
        await removeFromFavorites(painting.id);
        addToast({
          title: "Убрано из избранного",
          description: `Картина удалена из избранного.`,
        });
      } else {
        await addToFavorites(painting.id);
        addToast({
          title: "Добавлено в избранное",
          description: `Картина добавлена в избранное.`,
        });
      }
      setPainting({ ...painting, is_favorite: !painting.is_favorite });
    } catch (error: any) {
      addToast({
        title: "Ошибка",
        description:
          error.response?.data?.detail || "Не удалось обновить избранное.",
      });
    }
  };

  if (!painting) {
    return (
      <DefaultLayout>
        <div className="w-full mx-auto px-4 py-20 text-center">Загрузка...</div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="w-full mx-auto px-4 py-4" id="top">
        <div className="flex flex-col lg:flex-row gap-8 pb-8">
          <div className="w-full lg:w-1/2 flex justify-center items-center overflow-hidden">
            <Image
              src={painting.image}
              alt={painting.title}
              className="max-w-full max-h-[75vh] object-contain cursor-pointer"
              onClick={handleOpen}
            />
          </div>

          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="mb-4">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                <div
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => artist && navigate(`/artist/${artist.id}`)}
                >
                  <Avatar src={artist?.image || ""} alt={artist?.name || ""} size="lg" />
                  <div>
                    <h2 className="text-2xl font-sans">{artist?.name}</h2>
                    <p className="text-xl font-bold">{painting.title}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button
                    variant="solid"
                    onClick={handleContact}
                    className="min-w-[200px] flex items-center justify-center space-x-2"
                  >
                    <span>Связаться с продавцом</span>
                  </Button>
                  <RequireAuthButton onClick={handleToggleFavorite} tooltip={null}>
                    <span className="min-w-[180px] flex items-center justify-center space-x-2">
                      <Icon icon={painting.is_favorite ? "mdi:close" : "mdi:plus"} width="20" />
                      <span>
                        {painting.is_favorite ? "Убрать из избранного" : "Добавить в избранное"}
                      </span>
                    </span>
                  </RequireAuthButton>
                </div>
              </div>

              <h3 className="text-xl font-semibold mt-4 font-sans">Работа датируется {painting.year}</h3>
              <p className="leading-relaxed font-sans mt-2 mb-6">{painting.description}</p>

              <div className="flex space-x-2 flex-wrap">
                {painting.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-foreground rounded-full text-background"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold font-sans">Похожие работы</h3>
            <Button variant="solid" onClick={() => navigate("/")}>
              Посмотреть все
            </Button>
          </div>
          <MasonryGrid
            items={related}
            onItemClick={pid => navigate(`/detail/${pid}#top`)}
          />
        </div>

        {isFullscreen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            onClick={handleClose}
          >
            <button className="absolute top-4 right-4 p-2" onClick={handleClose}>
              <Icon icon="mdi:close" width="28" color="#fff" />
            </button>
            <img
              src={painting.image}
              alt={`${painting.title} - полный экран`}
              className="max-w-[100vw] max-h-[100vh] object-contain"
            />
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default ArtDetailPage;
