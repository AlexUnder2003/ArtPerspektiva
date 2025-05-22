import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPaintings, fetchRecommended, Painting } from "@/services/api";
import { MasonryGrid } from "@/components/masonrygrid";
import DefaultLayout from "@/layouts/default";
import TabsCategories from "@/components/tabs";
import { AuthContext } from "@/contexts/AuthContext";

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
