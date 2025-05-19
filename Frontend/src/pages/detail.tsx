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
    // TODO: добавить логику добавления в избранное
    console.log('Добавлено в избранное');
  };

  const handleContact = () => {
    // TODO: добавить логику связи с продавцом (например, открытие формы или перенаправление)
    console.log('Связаться с продавцом');
  };

  return (
    <DefaultLayout>
      <div className="w-full mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-8 pb-8">
          {/* Левый блок: 50% ширины, флекс-центровка */}
          <div className="w-full lg:w-1/2 flex justify-center items-center overflow-hidden">
            <Image
              src="/photos/8.jpg"
              alt="Работа Ильи Репина"
              className="max-w-full max-h-[75vh] object-contain cursor-pointer"
              onClick={handleOpen}
            />
          </div>

          {/* Правый блок: 50% ширины */}
          <div className="w-full lg:w-1/2 flex flex-col">
            {/* Описание и автор */}
            <div>
              <div className="flex flex-col lg:flex-row items-start lg:items-center mb-4 w-full space-y-4 lg:space-y-0 lg:space-x-4">
                <Avatar
                  src="/photos/unnamed.jpg"
                  alt="Илья Репин"
                  size="lg"
                  className="mr-4"
                />
                <div>
                  <h2 className="text-2xl font-sans">Papirosa in the woods</h2>
                  <p className="text-xl font-bold">Илья Репин</p>
                </div>
                <div className="flex flex-wrap gap-4 lg:ml-auto">
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
              <h3 className="text-xl font-semibold mb-2 font-sans">
                Работа датируется 01.02.3050
              </h3>
              <p className="leading-relaxed font-sans mb-6">
                Вашему вниманию предлагается уникальная подборка редких прижизненных фотографий Репина. Особенно интересны
                фотографии, запечатлевшие художника вместе с его великими современниками.
              </p>
            </div>
          </div>
        </div>

        {/* "Другие работы автора" снизу */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold font-sans">Другие работы автора</h3>
            <Button variant="solid">
              <span>Посмотреть все</span>
            </Button>
          </div>
          <MasonryGridDebug testPhotos={[p1, p2, p3, p4, p5, p6, p7, p8, p9]} />
        </div>

        {/* Fullscreen Overlay */}
        {isFullscreen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 overflow-hidden"
            onClick={handleClose}
          >
            <button className="absolute top-4 right-4 p-2" onClick={handleClose}>
              <Icon icon="mdi:close" width="28" color="#fff" />
            </button>
            <img
              src="/photos/1.jpg"
              alt="Работа Ильи Репина - полный экран"
              className="max-w-[100vw] max-h-[100vh] object-contain"
            />
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default ArtDetailPage;
