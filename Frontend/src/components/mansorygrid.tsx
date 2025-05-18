import { Card } from "@heroui/react";
import { FC, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { fetchPaintings, Painting } from "@/services/api";

export const MasonryGrid: FC = () => {
  const [items, setItems] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPaintings()
      .then(data => setItems(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Загрузка картин...</div>;
  if (error) return <div>Ошибка при загрузке: {error}</div>;

  return (
    <section className="w-full self-stretch columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4 px-2 mx-auto max-w-none">
      {items.map(item => (
        <div key={item.id} className="break-inside-avoid w-full">
          <Card isHoverable isPressable shadow="md" className="overflow-hidden group block m-0 w-full">
            <div className="relative w-full">
              <img src={item.image} alt={item.title} className="w-full h-auto transition-transform duration-300 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                <div className="flex-1 flex items-center justify-center pointer-events-none">
                  <Icon icon="mdi:eye-outline" width="36" className="text-white/70" />
                </div>
                <div className="flex flex-wrap gap-2 items-end">
                  {item.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-white/80 backdrop-blur-sm text-xs font-medium text-gray-800">
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
              <span className="text-lg font-bold leading-tight">{item.artist} · {item.year}</span>
            </div>
            <button type="button" className="p-2 rounded-full hover:bg-gray-700/20 transition self-start" aria-label="Add to favourites">
              <Icon icon="mdi:plus" width="27" />
            </button>
          </div>
        </div>
      ))}
    </section>
  );
};
