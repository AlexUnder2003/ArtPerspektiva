// MasonryGrid.tsx
// Tailwind + HeroUI + бесконечная прокрутка с пагинацией

import { Card } from "@heroui/react";
import { FC, useEffect, useRef, useState, useCallback } from "react";

interface MasonryGridProps {
  /** Сколько карточек загружать за один «page» */
  pageSize?: number;
}

interface Item {
  id: number;
  height: number;
  src: string;
}

/**
 * Masonry‑сетка с «водопадом» (columns-*) и ленивой подгрузкой страниц.
 * Ради демо используется https://picsum.photos. Замените на свой API.
 */
export const MasonryGrid: FC<MasonryGridProps> = ({ pageSize = 20 }) => {
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const fetching = useRef(false);

  const fetchPage = useCallback(async () => {

    if (fetching.current) return;
    fetching.current = true;

    await new Promise((r) => setTimeout(r, 500));

    const newItems: Item[] = Array.from({ length: pageSize }).map((_, idx) => {
      const id = page * pageSize + idx;
      const height = 160 + Math.floor(Math.random() * 300);
      const src = `https://picsum.photos/seed/${id}/600/800`;
      return { id, height, src };
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
      { rootMargin: "200px" } // немного заранее
    );

    observer.observe(loadingRef.current);
    return () => observer.disconnect();
  }, [fetchPage]);

  return (
    <>
      <section
        className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4 px-2 mx-auto max-w-none"
      >
        {items.map((item) => (
          <Card key={item.id} isHoverable shadow="md" className="break-inside-avoid" radius="none">
            <img
              src={item.src}
              alt="random unsplash"
              style={{ height: item.height }}
              className="w-full object-cover"
            />
            
          </Card>
        ))}
      </section>

      {/* sentinel для IntersectionObserver */}
      <div ref={loadingRef} className="h-10" />
    </>
  );
};
