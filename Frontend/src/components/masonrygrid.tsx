import React from "react";
import { Card, addToast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Painting, addToFavorites } from "@/services/api";
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

  if (items.length === 0) {
    return <div className="text-center py-8">Нет работ для отображения</div>;
  }

  // Обработчик добавления в избранное
  const handleAddToFavorites = async (id: number) => {
    try {
      await addToFavorites(id);
      addToast({
        title: "Добавлено в избранное",
        description: `Картина с ID ${id} добавлена в избранное.`,
        status: "success",
        duration: 3000,
      });
    } catch (error: any) {
      addToast({
        title: "Ошибка",
        description: error.response?.data?.detail || "Не удалось добавить в избранное.",
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <section
      className={`w-full self-stretch columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4 px-2 mx-auto max-w-none ${className}`}>
      {items.map(item => (
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
            <RequireAuthButton onClick={() => handleAddToFavorites(item.id)}>
              <Icon icon="mdi:plus" width="27" />
            </RequireAuthButton>
          </div>
        </div>
      ))}
    </section>
  );
};