// src/components/tabs/index.tsx
import { useState, useEffect, useRef } from "react";
import { Tabs, Tab } from "@heroui/react";
import { fetchTags, Tag } from "@/services/api";

interface TabsCategoriesProps {
  selectedTagId: number | null;
  onSelect: (tagId: number | null) => void;   // ⬅️ колбэк наверх
}

export default function TabsCategories({
  selectedTagId,
  onSelect,
}: TabsCategoriesProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  /* получаем теги один раз */
  useEffect(() => {
    fetchTags().then(setTags).catch(console.error);
  }, []);

  /* выбранный ключ: "all" либо id */
  const selectedKey = selectedTagId != null ? String(selectedTagId) : "all";

  /* автоскролл к активному табу */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const tabEl = container.querySelector<HTMLElement>(`[data-key="${selectedKey}"]`);
    tabEl?.scrollIntoView({ behavior: "smooth", inline: "center" });
  }, [selectedKey]);

  /* при смене таба */
  const handleSelectionChange = (key: string) => {
    onSelect(key === "all" ? null : Number(key)); // ⬅️ сообщаем наверх
  };

  return (
    <div
      ref={containerRef}
      className="
        w-full flex justify-start md:justify-center
        overflow-x-auto scrollbar-hide pb-3
      "
    >
      <Tabs
        aria-label="Категории по тегам"
        variant="underlined"
        selectedKey={selectedKey}
        onSelectionChange={key => handleSelectionChange(key as string)}
        className="inline-flex space-x-4 min-w-max px-4"
      >
        <Tab key="all" title="Все" aria-label="Все" data-key="all" />
        {tags.map(tag => (
          <Tab
            key={tag.id}
            value={tag.id}
            title={tag.name}
            aria-label={tag.name}
            data-key={tag.id}
          />
        ))}
      </Tabs>
    </div>
  );
}
