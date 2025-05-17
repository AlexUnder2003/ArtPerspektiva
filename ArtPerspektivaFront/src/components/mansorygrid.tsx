// MasonryGrid.tsx
import { Card, CardBody } from "@heroui/react";
import { FC } from "react";

interface MasonryGridProps {
  cards?: number;
}

export const MasonryGrid: FC<MasonryGridProps> = ({ cards = 20 }) => {
  /** Набор возможных высот (px). Можно расширять. */
  const heights = [160, 200, 260, 320, 380, 460];

  return (
    <section
      className="
        /* Masonry-колонки */
        columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5
        gap-4 space-y-4 px-2 pt-2
        mx-auto max-w-none
      "
    >
      {Array.from({ length: cards }).map((_, i) => {
        const h = heights[Math.floor(Math.random() * heights.length)];
        return (
          <Card
            key={i}
            isHoverable
            radius="none"   
            shadow="md"
            className="break-inside-avoid"
          >
            {/* inline-style = любая высота без необходимости добавлять utility-класс */}
            <CardBody
              style={{ height: h }}
              className="flex items-center justify-center"
            >
              Card #{i + 1} <br /> {h}px
            </CardBody>
          </Card>
        );
      })}
    </section>
  );
};
