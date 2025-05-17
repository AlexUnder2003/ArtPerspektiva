// MasonryGrid.tsx
// Tailwind + HeroUI + Masonry (columns-*) + IntersectionObserver
// + hover‑overlay автора/описания + isPressable без лишних отступов

import { Card } from "@heroui/react";
import { FC, useCallback, useEffect, useRef, useState } from "react";

interface MasonryGridProps {
  /** Сколько карточек загружать за одну «страницу» */
  pageSize?: number;
}

interface Item {
  id: number;
  height: number;
  src: string;
  author: string;
  description: string;
}

export const MasonryGrid: FC<MasonryGridProps> = ({ pageSize = 20 }) => {
  /* --------------------------- state & refs --------------------------- */
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const fetching = useRef(false);

  /* --------------------------- data loader --------------------------- */
  const fetchPage = useCallback(async () => {
    if (fetching.current) return; // защита от повторов
    fetching.current = true;

    // 👉 имитация API‑задержки
    await new Promise((r) => setTimeout(r, 500));

    const newItems: Item[] = Array.from({ length: pageSize }).map((_, idx) => {
      const id = page * pageSize + idx;
      const height = 160 + Math.floor(Math.random() * 300); // 160–460 px
      return {
        id,
        height,
        src: `https://picsum.photos/seed/${id}/600/800`, // детерминированный случайный seed
        author: `Author ${id}`,
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      };
    });

    setItems((prev) => [...prev, ...newItems]);
    setPage((prev) => prev + 1);
    fetching.current = false;
  }, [page, pageSize]);

  /* --------------------------- first page --------------------------- */
  useEffect(() => {
    fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------------- infinite‑scroll sentinel -------------------- */
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

  /* ------------------------------- UI -------------------------------- */
  return (
    <>
      <section className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4 px-2 mx-auto max-w-none">
        {items.map((item) => (
          <Card
            key={item.id}
            isHoverable
            isPressable
            shadow="md"
            className="break-inside-avoid overflow-hidden group m-0 w-full block"
            >
            <div className="relative w-full">
              {/* image */}
              <img
                src={item.src}
                alt={item.description}
                style={{ height: item.height }}
                className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* overlay on hover */}
              <div className="absolute inset-0 text-start bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white">
                <h3 className="text-sm font-semibold mb-1">{item.author}</h3>
                <p className="text-xs leading-tight line-clamp-2">{item.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </section>

      {/* «sentinel» для IntersectionObserver */}
      <div ref={loadingRef} className="h-10" />
    </>
  );
};
