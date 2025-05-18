import React, { useState } from "react";
import { Card, CardHeader, Avatar, Image, Button } from "@heroui/react";
import DefaultLayout from "@/layouts/default";
import { Icon } from "@iconify/react";
import { MasonryGridDebug } from "@/components/mansorytest";

import p1 from "../photos/1.jpg";
import p2 from "../photos/2.jpg";
import p3 from "../photos/3.jpg";
import p4 from "../photos/4.jpg";
import p5 from "../photos/5.jpg";
import p6 from "../photos/6.jpg";
import p7 from "../photos/7.jpg";
import p8 from "../photos/8.jpg";
import p9 from "../photos/9.jpg";

const ArtDetailPage = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleOpen = () => {
    document.body.style.overflow = 'hidden';
    setIsFullscreen(true);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    document.body.style.overflow = '';
    setIsFullscreen(false);
  };

  const handleFavorite = () => {
    console.log('Добавлено в избранное');
  };

  const handleContact = () => {
    console.log('Связаться с продавцом');
  };

  return (
    <DefaultLayout>
      <div className="w-full grid mx-auto">
        <div className="w-full max-w-screen-lg mx-auto px-4 py-12 space-y-12">
          {/* Art Overview Card */}
          <Card className="w-full">
            <CardHeader className="p-0 cursor-pointer" onClick={handleOpen}>
              <Image
                src={p1}
                alt="Работа Ильи Репина"
                className="w-full h-auto object-contain"
                objectFit="contain"
              />
            </CardHeader>
          </Card>

          <div className="w-full px-6 py-6">
            <div className="grid grid-cols-12 mb-4">
              <div className="col-span-8 flex items-center space-x-4">
                <Avatar
                  src={p2}
                  alt="Фото Ильи Репина"
                  size="lg"
                />
                <div>
                  <h2 className="font-sans">Papirosa in the woods</h2>
                  <p className="text-xl font-bold">Илья Репин</p>
                </div>
              </div>

              <div className="col-span-4 flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={handleFavorite}
                  className="min-w-[180px] flex items-center justify-center space-x-2"
                >
                  Добавить в избранное
                </Button>
                <Button
                  variant="solid"
                  onClick={handleContact}
                  className="min-w-[200px] flex items-center justify-center space-x-2"
                >
                  Связаться с продавцом
                </Button>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-2 font-sans">Работа датируется 01.02.2025</h3>
            <p className="leading-relaxed font-sans pb-10">
              Вашему вниманию предлагается уникальная подборка редких прижизненных фотографий Репина. Особенно интересны
              фотографии, запечатлевшие художника вместе с его великими современниками: писателем Львом Толстым, певцом Федором
              Шаляпиным, заблудшим литератором Максимом Горьким, а также своими коллегами по цеху — Валентином Серовым,
              Константином Коровиным, Василием Суриковым.
            </p>
          </div>

          {/* Description Section */}
          <div className="flex flex-wrap gap-2 items-center">
            <h3 className="text-xl font-semibold mb-2 font-sans">Другие работы автора</h3>
            <Button variant="solid">Посмотреть все</Button>
          </div>

          <MasonryGridDebug testPhotos={[p1, p2, p3, p4, p5, p6, p7, p8, p9]} />
        </div>

        {/* Fullscreen Overlay without zoom or drag */}
        {isFullscreen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            onClick={handleClose}
          >
            <button
              className="absolute top-4 right-4 p-2 text-white"
              onClick={handleClose}
            >
              <Icon icon="mdi:close" width="28" />
            </button>
            <img
              src={p1}
              alt="Работа Ильи Репина - полный экран"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default ArtDetailPage;
