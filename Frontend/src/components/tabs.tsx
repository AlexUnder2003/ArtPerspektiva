import { useState, useEffect } from "react";
import { Tabs, Tab } from "@heroui/react";
import { fetchTags, Tag } from "@/services/api";

export default function TabsCategories() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    fetchTags()
      .then(data => {
        setTags(data);
        if (data.length) setSelected(data[0].name); // по умолчанию первый таб
      })
      .catch(err => console.error("Ошибка при загрузке тегов:", err));
  }, []);

  return (
    <div className="flex flex-wrap gap-4 font-sans ml-3 justify-center pb-3">
      <Tabs
        aria-label="Категории по тегам"
        variant="underlined"
        selectedKey={selected}
        onSelectionChange={(key) => setSelected(key as string)}
      >
        {tags.map(tag => (
          <Tab key={tag.name} title={tag.name} />
        ))}
      </Tabs>
    </div>
  );
}
