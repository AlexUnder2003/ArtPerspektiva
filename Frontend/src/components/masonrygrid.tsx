// src/components/MasonryGrid.tsx
import React, { useState, useEffect } from "react";
import { Card, addToast } from "@heroui/react";
import { Icon } from "@iconify/react";
import {
  Painting,
  addToFavorites,
  removeFromFavorites,
} from "@/services/api";
import { RequireAuthButton } from "./authmodal";


interface MasonryGridProps {
  /** Обязательный массив картин для рендера */
  items: Painting[];
  /** Дополнительные классы для секции */
  className?: string;
  /** Обработчик нажатия на карточку */
  onItemClick?: (id: number) => void;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({
  items,
  className = "",
  onItemClick,
}) => {

  // Локальное состояние для мгновенного обновления UI
  const [localItems, setLocalItems] = useState<Painting[]>(items);

  // Синхронизируем пропсы с локальным стейтом при их изменении
  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  if (localItems.length === 0) {
    return <div className="text-center py-8">Нет работ для отображения</div>;
  }

  // Переключить избранное и обновить локальные данные
  const handleToggleFavorite = async (id: number, isFavorite: boolean) => {
    try {
      if (isFavorite) {
        await removeFromFavorites(id);
        addToast({
          title: "Убрано из избранного",
          description: `Картина удалена из избранного.`,
        });
      } else {
        await addToFavorites(id);
        addToast({
          title: "Добавлено в избранное",
          description: `Картина добавлена в избранное.`,
        });
      }

      // Мгновенно обновляем локальный список
      setLocalItems(prev =>
        prev.map(p =>
          p.id === id ? { ...p, is_favorite: !isFavorite } : p
        )
      );
    } catch (error: any) {
      addToast({
        title: "Ошибка",
        description:
          error.response?.data?.detail || "Не удалось обновить избранное.",
      });
    }
  };

  return (
    <section
      className={`w-full self-stretch columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4 px-2 mx-auto max-w-none ${className}`}>
      {localItems.map(item => (
        <div key={item.id} className="break-inside-avoid w-full">
          <Card
            isHoverable
            isPressable
            shadow="md"
            className="overflow-hidden group block m-0 w-full"
            onPress={() => onItemClick?.(item.id)}
          >
            <div className="relative w-full">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                <div className="flex-1 flex items-center justify-center pointer-events-none">
                  <Icon icon="mdi:eye-outline" width="36" className="text-white/70" />
                </div>
                <div className="flex flex-wrap gap-2 items-end">
                  {item.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full bg-white/80 backdrop-blur-sm text-xs font-medium text-gray-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <div className="flex items-start justify-between pt-2 px-1">
            <div className="flex flex-col">
              <span className="text-base font-normal leading-tight">{item.title}</span>
              <span className="text-lg font-bold leading-tight">
                {item.artist} · {item.year}
              </span>
            </div>
            <RequireAuthButton
              tooltip={item.is_favorite ? "Убрать из избранного" : "Добавить в избранное"}
              onClick={() =>
                handleToggleFavorite(item.id, !!item.is_favorite)
              }
            >
              <Icon
                icon={
                  item.is_favorite ? "mdi:close" : "mdi:plus"
                }
                width="27"
              />
            </RequireAuthButton>
          </div>
        </div>
      ))}
    </section>
  );
};