import React, { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Image, Button } from "@heroui/react";
import DefaultLayout from "@/layouts/default";

const ArtDetailPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <DefaultLayout>
      <div className="w-full max-w-screen-lg mx-auto px-4 py-12 space-y-12">
        {/* Art Overview Card with Lightbox */}
        <Card className="w-full">
          <CardHeader className="p-0 cursor-pointer" onClick={handleOpen}>
            <Image
              src="/photos/1.jpg"
              alt="Работа Ильи Репина"
              className="w-full h-auto object-contain"
              objectFit="contain"
              objectPosition="center"
            />
          </CardHeader>
          <CardBody className="px-4 pt-4">
            <h2 className="text-2xl font-bold">Илья Репин</h2>
            <p className="text-gray-600">Название работы: Неизвестное Поле</p>
            <p className="text-gray-600">Дата: 23.01.1345</p>
          </CardBody>
        </Card>

        {/* Lightbox Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            onClick={handleClose}
          >
            <Image
              src="/photos/1.jpg"
              alt="Работа Ильи Репина - 확대"
              className="max-w-full max-h-full"
              objectFit="contain"
              objectPosition="center"
            />
          </div>
        )}

        {/* Description Card */}
        <Card className="w-full">
          <CardHeader className="px-4">
            <h3 className="text-xl font-semibold">Описание произведения</h3>
            <p className="text-gray-500">Подробная информация о работе</p>
          </CardHeader>
          <CardBody className="px-4">
            <p className="leading-relaxed">
              Вашему вниманию предлагается уникальная подборка редких прижизненных фотографий Репина. Особенно интересны
              фотографии, запечатлевшие художника вместе с его великими современниками: писателем Львом Толстым, певцом Федором
              Шаляпиным, заблудшим литератором Максимом Горьким, а также своими коллегами по цеху — Валентином Серовым,
              Константином Коровиным, Василием Суриковым.
            </p>
            <p className="mt-4 leading-relaxed">
              Кроме этого, представлены фотографии Репина в окружении весьма многочисленных учеников, в окружении своих
              многочисленных детей, а также в своей мастерской с кистями и палитрой в руках. Последняя фотография Репина была
              снята в 1930 году, уже незадолго до его смерти. Репин умер далеко от родины, на территории Финляндии, в своей
              усадьбе Пенать близ Кюоккалы. Несмотря на настойчивые призывы советской власти, великий мастер отказался
              вернуться в Россию — страну рабов, страну царей.
            </p>
          </CardBody>
          <CardFooter className="px-4 py-4">
            <div className="flex justify-center space-x-4">
              <Button variant="outline">Связаться с продавцом</Button>
              <Button>Сохранить</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </DefaultLayout>
  );
};

export default ArtDetailPage;
