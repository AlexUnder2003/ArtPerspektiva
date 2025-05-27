import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchPaintings,
  fetchRecommended,
  Painting,
} from "@/services/api";
import { MasonryGrid } from "@/components/masonrygrid";
import DefaultLayout from "@/layouts/default";
import TabsCategories from "@/components/tabs";
import { AuthContext } from "@/contexts/AuthContext";
import { Helmet } from "react-helmet-async";

const IndexPage = () => {
  /** список картин, отображаемых в сетке */
  const [paintings, setPaintings] = useState<Painting[]>([]);
  /** выбранный тег (id) или null, если «Все» */
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);

  const { isAuthenticated, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  /**
   * Загружаем картины:
   *  – авторизованному пользователю — персональные рекомендации,
   *  – гостю — общий каталог.
   *  Фильтр по тегу добавляется через selectedTagId.
   */
  useEffect(() => {
    if (loading) return;

    const loader = isAuthenticated ? fetchRecommended : fetchPaintings;

    loader(selectedTagId)
      .then(setPaintings)
      .catch((err) => {
        console.error("Ошибка при загрузке картин", err);
        // если рекомендации упали — открываем общий список
        return fetchPaintings(selectedTagId).then(setPaintings);
      });
  }, [isAuthenticated, loading, selectedTagId]);

  return (
    <DefaultLayout>
      <Helmet>
        <title>ArtPerspektiva — Главная</title>
        <meta
          name="description"
          content="Откройте для себя уникальные произведения искусства и живописи. Листайте галерею, добавляйте в избранное, изучайте авторов."
        />
        <meta property="og:title" content="Галерея Картин — Главная" />
        <meta
          property="og:description"
          content="Откройте для себя уникальные произведения искусства и живописи. Листайте галерею, добавляйте в избранное, изучайте авторов."
        />
        <meta property="og:image" content="https://yourdomain.com/preview.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/" />
        <meta property="og:site_name" content="Галерея Картин" />
        <link rel="canonical" href="https://yourdomain.com/" />
      </Helmet>

      {/* Табы-категории: передаём id и колбэк выбора */}
      <TabsCategories
        selectedTagId={selectedTagId}
        onSelect={setSelectedTagId}
      />

      {/* Сама «каменная» сетка работ */}
      <div className="px-4 py-6">
        <MasonryGrid
          items={paintings}
          onItemClick={(id) => navigate(`/detail/${id}`)}
        />
      </div>
    </DefaultLayout>
  );
};

export default IndexPage;
