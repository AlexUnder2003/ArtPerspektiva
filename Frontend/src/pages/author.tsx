import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Card, Image } from "@heroui/react";
import DefaultLayout from "@/layouts/default";
import { Artist, fetchArtistById } from "@/services/api";
import { MasonryGrid } from "@/components/masonrygrid";
import { Helmet } from "react-helmet-async";

const AuthorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    fetchArtistById(Number(id)).then(setArtist);
  }, [id]);


  if (!artist) return <div className="text-center py-8">Загрузка...</div>;
  const canonicalUrl = `https://yourdomain.com/artist/${artist.id}`;

  return (
    <DefaultLayout>
      <Helmet>
        <title>{artist.name} — Художник | Галерея</title>
        <meta name="description" content={artist.bio.slice(0, 160)} />

        <meta property="og:title" content={artist.name} />
        <meta property="og:description" content={artist.bio.slice(0, 160)} />
        <meta property="og:image" content={artist.image} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Галерея Картин" />

        <link rel="canonical" href={canonicalUrl} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": artist.name,
            "description": artist.bio,
            "image": artist.image,
          })}
        </script>
      </Helmet>
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
            <MasonryGrid items={paintings}
            onItemClick={(id) => navigate(`/detail/${id}`)} />
          </div>
        ))}
      </div>
    </DefaultLayout>
  );
};

export default AuthorPage;
