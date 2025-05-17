// MasonryGrid.tsx
import { Card, CardBody } from "@heroui/react";   // HeroUI v2+
import { FC } from "react";

interface MasonryGridProps {
  cards?: number;          // сколько «пустых» карточек показать
}

export const MasonryGrid: FC<MasonryGridProps> = ({ cards = 20 }) => (
  <section
    className="
        grid grid-cols-1                /* мобильный */
        sm:grid-cols-2 md:grid-cols-4   /* ≥ 640 / 768 */
        lg:grid-cols-5 xl:grid-cols-8   /* ≥ 1024 / 1280 */
        gap-4 p-2
        mx-auto max-w-none              /* без ограничения ширины */
    "
    >
    {Array.from({ length: cards }).map((_, i) => (
        <Card
        key={i}
        isHoverable
        shadow="md"
        className="w-full"
        >
        <CardBody className="h-52 flex items-center justify-center text-gray-400">
            Card #{i + 1}
        </CardBody>
        </Card>
    ))}
    </section>

);
