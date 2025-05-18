import React, { useState } from "react";
import { Card, CardHeader, CardBody, Image } from "@heroui/react";
import DefaultLayout from "@/layouts/default";
import { Icon } from "@iconify/react";

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

  return (
    <DefaultLayout>
      <div className="w-full max-w-screen-lg mx-auto px-4 py-12 space-y-12">
        {/* Art Overview Card */}
        <Card className="w-full">
          <CardHeader className="p-0 cursor-pointer" onClick={handleOpen}>
            <Image
              src="/photos/1.jpg"
              alt="Работа Ильи Репина"
              className="w-full h-auto object-contain"
              objectFit="contain"
            />
          </CardHeader>
        </Card>

        {/* Description Section (moved out of Card) */}
        <div className="w-full shadow rounded px-6 py-1">
          <div className="grid grid cols-12  mb-4">
            <div className="col-span-8">
              <h2 className="text-2xl font-bold">Работа Ильи Репина</h2>
              <p className="text-gray-500">Илья Репин, 1890</p>
            </div>
            <div className="col-span-2  justify-end">
              <button className="px-4 py-2 rounded">Добавить в избранное</button>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-2">Работа датируется </h3>
          <p className="leading-relaxed ">
            Вашему вниманию предлагается уникальная подборка редких прижизненных фотографий Репина. Особенно интересны
            фотографии, запечатлевшие художника вместе с его великими современниками: писателем Львом Толстым, певцом Федором
            Шаляпиным, заблудшим литератором Максимом Горьким, а также своими коллегами по цеху — Валентином Серовым,
            Константином Коровиным, Василием Суриковым.
          </p>
          <div className="flex justify-center space-x-4 mt-6">
            <button className="p-1"><Icon icon="mdi:email-outline" width="24" /></button>
            <button className="p-1"><Icon icon="mdi:bookmark-outline" width="24" /></button>
          </div>
        </div>
      </div>

      {/* Fullscreen Overlay without zoom or drag */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <button
            className="absolute top-4 right-4 p-2"
            onClick={handleClose}
          >
            <Icon icon="mdi:close" width="28" color="#fff" />
          </button>
          <img
            src="/photos/1.jpg"
            alt="Работа Ильи Репина - полный экран"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </DefaultLayout>
  );
};

export default ArtDetailPage;