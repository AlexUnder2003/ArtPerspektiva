// MasonryGrid.tsx
// Обновлено: картинки сохраняют исходные пропорции — ничего не обрезается и нет «чёрных полос»
// • убрали фиксированный height и object-cover → img растягивается по ширине, высота auto
// • Masonry (columns-*) + тестовые фото + бесконечная подгрузка остаются

import { Card } from "@heroui/react";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";

interface MasonryGridProps {
  pageSize?: number;
  testPhotos?: string[];
}

interface Item {
  id: number;
  src: string;
  title: string;
  author: string;
  year: number;
  tags: string[];
}

export const MasonryGrid: FC<MasonryGridProps> = ({ pageSize = 20, testPhotos = [] }) => {
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const fetching = useRef(false);

  /* helpers */
  const TAG_POOL = [
    "nature",
    "city",
    "food",
    "travel",
    "art",
    "design",
    "architecture",
    "night",
    "sunset",
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
  const rndTags = () => {
    const shuffled = [...TAG_POOL].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 3) + 1);
  };

  /* fetch next page */
  const fetchPage = useCallback(async () => {
    if (fetching.current) return;
    fetching.current = true;

    await new Promise((r) => setTimeout(r, 500));

    const newItems: Item[] = Array.from({ length: pageSize }).map((_, idx) => {
      const id = page * pageSize + idx + 1;
      return {
        id,
        src: `https://picsum.photos/seed/${id}/600/800`, // 600×800, но мы не фиксируем высоту — браузер её вычислит
        title: rnd(TITLE_POOL),
        author: `Author ${id}`,
        year: 1995 + (id % 30),
        tags: rndTags(),
      };
    });

    setItems((prev) => [...prev, ...newItems]);
    setPage((prev) => prev + 1);
    fetching.current = false;
  }, [page, pageSize]);

  /* initial render: prepend test photos */
  useEffect(() => {
    const initial: Item[] = testPhotos.map((src, idx) => ({
      id: -(idx + 1),
      src,
      title: rnd(TITLE_POOL),
      author: "Test Author",
      year: 2025,
      tags: rndTags(),
    }));

    setItems(initial);
    fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* intersection observer */
  useEffect(() => {
    if (!loadingRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchPage();
      },
      { rootMargin: "200px" }
    );
    observer.observe(loadingRef.current);
    return () => observer.disconnect();
  }, [fetchPage]);

  return (
    <>
      <section className="w-full self-stretch columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4 px-2 mx-auto max-w-none">
        {items.map((item) => (
          <div key={item.id} className="break-inside-avoid w-full">
            <Card isHoverable isPressable shadow="md" className="overflow-hidden group block m-0 w-full">
              <div className="relative w-full">
                {/* auto height, сохраняем пропорции */}
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />

                {/* overlay */}
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
                <span className="text-base font-medium text-gray-200 leading-tight">{item.title}</span>
                <span className="text-sm text-gray-400">{item.author} · {item.year}</span>
              </div>
              <button
                type="button"
                className="p-1 rounded-full hover:bg-gray-700/20 transition self-start"
                aria-label="Add to favourites"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: handle favourites
                }}
              >
                <Icon icon="mdi:plus" width="22" className="text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </section>
      <div ref={loadingRef} className="h-10" />
    </>
  );
};