import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPaintings, fetchRecommended, Painting } from "@/services/api";
import { MasonryGrid } from "@/components/masonrygrid";
import DefaultLayout from "@/layouts/default";
import TabsCategories from "@/components/tabs";
import { AuthContext } from "@/contexts/AuthContext";
import { Helmet } from "react-helmet-async";


const IndexPage = () => {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const { isAuthenticated, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return; // ждём завершения загрузки пользователя

    if (isAuthenticated) {
      fetchRecommended()
        .then(setPaintings)
        .catch((err) => {
          console.error("Ошибка при загрузке рекомендаций", err);
          // fallback — загружаем все картины
          fetchPaintings().then(setPaintings);
        });
    } else {
      fetchPaintings().then(setPaintings);
    }
  }, [isAuthenticated, loading]);

  return (
    <DefaultLayout>
      <Helmet>
        <title>Галерея Картин — Главная</title>
        <meta name="description" content="Откройте для себя уникальные произведения искусства и живописи. Листайте галерею, добавляйте в избранное, изучайте авторов." />
        <meta property="og:title" content="Галерея Картин — Главная" />
        <meta property="og:description" content="Откройте для себя уникальные произведения искусства и живописи. Листайте галерею, добавляйте в избранное, изучайте авторов." />
        <meta property="og:image" content="https://yourdomain.com/preview.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/" />
        <meta property="og:site_name" content="Галерея Картин" />
        <link rel="canonical" href="https://yourdomain.com/" />
      </Helmet>
      <TabsCategories />
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
