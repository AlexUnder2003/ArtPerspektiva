import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPaintings, Painting } from "@/services/api";
import { MasonryGrid } from "@/components/masonrygrid";
import DefaultLayout from "@/layouts/default";
import TabsCategories from "@/components/tabs";

const IndexPage = () => {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPaintings().then(setPaintings);
  }, []);

  return (
    <DefaultLayout>
      <TabsCategories></TabsCategories>
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