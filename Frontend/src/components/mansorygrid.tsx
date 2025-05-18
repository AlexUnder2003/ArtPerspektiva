import { Card } from "@heroui/react";
import { FC, useEffect, useState } from "react";
import { Icon } from "@iconify/react";

interface MasonryGridProps {
  /** Массив URL‑ов картинок, которые нужно показать */
  testPhotos: string[];
}

interface Item {
  id: number;
  src: string;
  title: string;
  author: string;
  year: number;
  tags: string[];
}

export const MasonryGrid: FC<MasonryGridProps> = ({ testPhotos }) => {
  const [items, setItems] = useState<Item[]>([]);

  /* константы для «заглушек» */
  const TAG_POOL = [
    "nature",
    "city",
    "food",
    "travel",
    "art",
    "design",
    "architecture",
  ];
  const TITLE_POOL = [
    "Morning Light",
    "Urban Stories",
    "Hidden Paths",
    "Golden Hour",
    "Silent Waves",
    "Neon Nights",
    "Rustic Charm",
  ];
  const rnd = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
  const rndTags = () => TAG_POOL.sort(() => 0.5 - Math.random()).slice(0, 3);

  /* формируем список один раз при маунте */
  useEffect(() => {
    const initial: Item[] = testPhotos.map((src, idx) => ({
      id: idx,
      src,
      title: rnd(TITLE_POOL),
      author: "Test Author",
      year: 2025,
      tags: rndTags(),
    }));
    setItems(initial);
  }, [testPhotos]);

  return (
    <section className="w-full self-stretch columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4 px-2 mx-auto max-w-none">
      {items.map((item) => (
        <div key={item.id} className="break-inside-avoid w-full">
          <Card isHoverable isPressable shadow="md" className="overflow-hidden group block m-0 w-full">
            <div className="relative w-full">
              <img src={item.src} alt={item.title} className="w-full h-auto transition-transform duration-300 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                <div className="flex-1 flex items-center justify-center pointer-events-none">
                  <Icon icon="mdi:eye-outline" width="36" className="text-white/70" />
                </div>
                <div className="flex flex-wrap gap-2 items-end">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-white/80 backdrop-blur-sm text-xs font-medium text-gray-800">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* caption */}
          <div className="flex items-start justify-between pt-2 px-1">
            <div className="flex flex-col">
              {/* Название простым шрифтом */}
              <span className="text-base font-normal leading-tight">{item.title}</span>
              {/* Автор выделен жирным и чуть больше */}
              <span className="text-l font-bold leading-tight">{item.author}  {item.year}</span>
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
