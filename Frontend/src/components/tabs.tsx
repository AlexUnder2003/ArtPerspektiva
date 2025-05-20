import { useState, useEffect, useRef } from "react";
import { Tabs, Tab } from "@heroui/react";
import { fetchTags, Tag } from "@/services/api";

export default function TabsCategories() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selected, setSelected] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTags()
      .then(data => {
        setTags(data);
        if (data.length) setSelected(data[0].name);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const tabsEls = container.querySelectorAll<HTMLElement>('[role="tab"]');
    const target = Array.from(tabsEls).find(el => el.textContent === selected);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }, [selected]);

  return (
    <div
      ref={containerRef}
      className="
        w-full
        flex              /* делаем флекс-контейнер */
        justify-start     /* по умолчанию (моб.): сдвиг влево */
        md:justify-center /* на md+ (ПК): центрируем */
        overflow-x-auto   /* горизонтальный скролл */
        scrollbar-hide      /* скрываем полосу */
        pb-3
      "
    >
      <Tabs
        aria-label="Категории по тегам"
        variant="underlined"
        selectedKey={selected}
        onSelectionChange={key => setSelected(key as string)}
        className="inline-flex space-x-4 min-w-max px-4"
      >
        {tags.map(tag => (
          <Tab
            key={tag.name}
            value={tag.name}
            title={tag.name}
            aria-label={tag.name}
          />
        ))}
      </Tabs>
    </div>
  );
}
