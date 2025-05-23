import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Image } from "@heroui/react";
import DefaultLayout from "@/layouts/default";
import { Artist, fetchArtistById } from "@/services/api";
import { MasonryGrid } from "@/components/masonrygrid";

const AuthorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchArtistById(Number(id)).then(setArtist);
  }, [id]);


  if (!artist) return <div className="text-center py-8">Загрузка...</div>;

  return (
    <DefaultLayout>
      {/* Обложка + Аватар */}
      <div
        className="relative w-full h-80 rounded-lg"
        style={{
          backgroundImage: `url(${artist.background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        <Card className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-80 h-80  shadow-xl">
          <Image
            removeWrapper
            alt="Фото автора"
            className="w-full h-full object-cover rounded-xl"
            src={artist.image}
          />
        </Card>
      </div>

      {/* Имя и био */}
      <h1 className="text-3xl font-bold text-center mt-24">{artist.name}</h1>
      <p className="text-center max-w-2xl mx-auto mt-2 font-sans">{artist.bio}</p>

      {/* Работы по годам */}
      <h1 className="text-3xl font-bold text-center mt-24">Работы автора</h1>
      <div className="mt-12 space-y-12">
        {Object.entries(artist.paintings_by_year).map(([year, paintings]) => (
          <div key={year}>
            <h2 className="text-2xl font-semibold mb-4">{year} год</h2>
            <MasonryGrid items={paintings} />
          </div>
        ))}
      </div>
    </DefaultLayout>
  );
};

export default AuthorPage;
