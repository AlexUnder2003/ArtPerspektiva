import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Avatar, Image, Button } from "@heroui/react";
import DefaultLayout from "@/layouts/default";
import { Icon } from "@iconify/react";
import { MasonryGrid } from "@/components/masonrygrid";
import {
  Painting,
  Artist,
  fetchPaintingById,
  fetchSimilarPaintings,
  fetchArtistById,
} from "@/services/api";

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
      .catch(err => console.error(err));

    fetchSimilarPaintings(paintingId)
      .then(setRelated)
      .catch(err => console.error(err));
  }, [paintingId]);

  const handleArtistClick = () => {
    if (artist) navigate(`/artist/${artist.id}`);
  };
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
  const handleFavorite = () => {
    console.log("Добавлено в избранное:", painting?.id);
  };

  // 2) Следим за хэшем в URL и скроллим к элементу с этим id
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location]);

  if (!painting) {
    return (
      <DefaultLayout>
        <div className="w-full mx-auto px-4 py-20 text-center">
          Загрузка...
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="w-full mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-8 pb-8" id="top">
          {/* Левая колонка: изображение */}
          <div className="w-full lg:w-1/2 flex justify-center items-center overflow-hidden">
            <Image
              src={painting.image}
              alt={painting.title}
              className="max-w-full max-h-[75vh] object-contain cursor-pointer"
              onClick={handleOpen}
            />
          </div>

          {/* Правая колонка: художник + детали */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="mb-4">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full space-y-4 lg:space-y-0 lg:space-x-4">
                {/* Аватар художника */}
                <div
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={handleArtistClick}
                >
                  <Avatar
                    src={artist?.image || ""}
                    alt={artist?.name || ""}
                    size="lg"
                  />
                  <div>
                    <h2 className="text-2xl font-sans">
                      {artist?.name}
                    </h2>
                    {/* вместо "Художник" выводим название картины */}
                    <p className="text-xl font-bold">
                      {painting.title}
                    </p>
                  </div>
                </div>

                {/* Кнопки */}
                <div className="flex flex-wrap gap-4">
                  <Button
                    variant="solid"
                    onClick={handleContact}
                    className="min-w-[200px] flex items-center justify-center space-x-2"
                  >
                    <span>Связаться с продавцом</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleFavorite}
                    className="min-w-[180px] flex items-center justify-center space-x-2"
                  >
                    <span>Добавить в избранное</span>
                  </Button>
                </div>
              </div>

              {/* Дата и описание */}
              <h3 className="text-xl font-semibold mt-4 font-sans">
                Работа датируется {painting.year}
              </h3>
              <p className="leading-relaxed font-sans mt-2 mb-6">
                {painting.description}
              </p>

              {/* Теги */}
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

        {/* Похожие работы */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold font-sans">Похожие работы</h3>
            <Button variant="solid" onClick={() => navigate("/")}>
              <span>Посмотреть все</span>
            </Button>
          </div>
          <MasonryGrid
            items={related}
            onItemClick={pid =>
              // добавляем хэш в URL
              navigate(`/detail/${pid}#top`)
            }
          />
        </div>

        {/* Fullscreen-модалка */}
        {isFullscreen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 overflow-hidden"
            onClick={handleClose}
          >
            <button
              className="absolute top-4 right-4 p-2"
              onClick={handleClose}
            >
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
