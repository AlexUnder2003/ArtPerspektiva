// src/components/default-layout.tsx
import { Link } from "@heroui/link";
import { ScrollShadow } from "@heroui/react";

import Sidebar      from "@/components/sidebar";
import { items }    from "@/components/sidebar-items";
import Navbar       from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full">
      <aside className="hidden md:block w-16 h-full border-r border-default-100 bg-background">
        <ScrollShadow className="h-full">
          <Sidebar defaultSelectedKey="home" items={items} isCompact hideEndContent className="pt-3"/>
        </ScrollShadow>
      </aside>

      <div className="flex flex-col flex-1 min-w-0">
        <header className="w-full flex items-center justify-center px-4 pt-4  bg-background">
          <h1 className="text-2xl font-sans">ART PERSPEKTIVA</h1>
        </header>
        <Navbar />

        <main className="flex-1 overflow-y-auto px-4 pt-2">
          {children}
        </main>

        <footer className="w-full flex items-center justify-center py-3">
          <Link
            isExternal
            className="flex items-center gap-1 text-current"
            href="https://heroui.com"
            title="heroui.com homepage"
          >
            <span className="text-default-600">Powered by</span>
            <p className="text-primary">HeroUI</p>
          </Link>
        </footer>
      </div>
    </div>
  );
}
