// MasonryGrid.tsx
// Tailwind + HeroUI + Masonry (columns-*) + IntersectionObserver
// • title + author·year caption
// • overlay‑tags + eye icon on hover
// • larger «+» Iconify button for favourites

import { Card } from "@heroui/react";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";

interface MasonryGridProps {
  pageSize?: number;
}

interface Item {
  id: number;
  height: number;
  src: string;
  title: string;
  author: string;
  year: number;
  tags: string[];
}

export const MasonryGrid: FC<MasonryGridProps> = ({ pageSize = 20 }) => {
  /* --------------------------- state & refs --------------------------- */
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const fetching = useRef(false);

  /* --------------------------- data loader --------------------------- */
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

  const fetchPage = useCallback(async () => {
    if (fetching.current) return;
    fetching.current = true;

    await new Promise((r) => setTimeout(r, 500));

    const newItems: Item[] = Array.from({ length: pageSize }).map((_, idx) => {
      const id = page * pageSize + idx;
      const height = 160 + Math.floor(Math.random() * 300); // 160–460 px
      const year = 1995 + (id % 30);

      const shuffledTags = TAG_POOL.sort(() => 0.5 - Math.random());
      const tags = shuffledTags.slice(0, Math.floor(Math.random() * 3) + 1);

      const title = TITLE_POOL[Math.floor(Math.random() * TITLE_POOL.length)];

      return {
        id,
        height,
        title,
        year,
        src: `https://picsum.photos/seed/${id}/600/800`,
        author: `Author ${id}`,
        tags,
      };
    });

    setItems((prev) => [...prev, ...newItems]);
    setPage((prev) => prev + 1);
    fetching.current = false;
  }, [page, pageSize]);

  useEffect(() => {
    fetchPage();
  }, []);

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
      <section className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4 px-2 mx-auto max-w-none">
        {items.map((item) => (
          <div key={item.id} className="break-inside-avoid w-full">
            <Card
              isHoverable
              isPressable
              shadow="md"
              className="overflow-hidden group w-full block m-0"
            >
              <div className="relative w-full">
                <img
                  src={item.src}
                  alt={item.title}
                  style={{ height: item.height }}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                  <div className="flex-1 flex items-center justify-center pointer-events-none">
                    <Icon icon="mdi:eye-outline" width="36" className="text-white/70" />
                  </div>
                  {/* tags at bottom */}
                  <div className="flex flex-wrap gap-2 items-end">
                    {item.tags.slice(0, 3).map((tag) => (
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
                <span className="text-base font-medium leading-tight">
                  {item.title}
                </span>
                <span className="text-sm">
                  {item.author} · {item.year}
                </span>
              </div>

              <button
                type="button"
                className="p-1 rounded-full hover:bg-gray-700/20 transition self-start"
                aria-label="Add to favourites"
                onClick={(e) => {
                  e.stopPropagation();
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
