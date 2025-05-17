import {Tabs, Tab} from "@heroui/react";

export default function App() {

  return (
    <div className="flex flex-wrap gap-4 font-sans ml-3">
        <Tabs aria-label="Tabs variants" variant="underlined">
          <Tab key="photos" title="Photos" />
          <Tab key="music" title="Music" />
          <Tab key="videos" title="Videos" />
        </Tabs>
    </div>
  );
}
