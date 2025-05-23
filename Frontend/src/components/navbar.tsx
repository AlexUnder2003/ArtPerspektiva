// components/Navbar.tsx
import { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import { searchPaintings, Painting } from "@/services/api";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { ThemeSwitch } from "@/components/theme-switch";
import { SearchIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";

export const Navbar = () => {
  const [query, setQuery] = useState("");
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [open, setOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Debounced fetch
  const fetchResults = useCallback(
    debounce(async (q: string) => {
      if (q.trim().length === 0) {
        setPaintings([]);
        return;
      }
      try {
        const pl = await searchPaintings(q);
        setPaintings(pl);
      } catch (err) {
        console.error("Search error:", err);
        setPaintings([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    fetchResults(query);
    setOpen(query.trim().length > 0);
  }, [query, fetchResults]);

  const handleSelect = () => {
    setOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <HeroUINavbar
      position="sticky"
      maxWidth="full"
      className="px-4"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="w-full grid items-center gap-2 grid-cols-[1fr_auto_auto]">
        {/* Desktop search (hidden on mobile) */}
        <div className="relative w-full hidden md:block">
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Введите название картины"
            fullWidth
            className="w-full max-w-none font-sans"
            classNames={{
              inputWrapper: "w-full bg-default-100",
              input: "w-full text-sm",
            }}
            startContent={
              <SearchIcon className="text-default-400 pointer-events-none font-sans flex-shrink-0" />
            }
            aria-label="Search paintings"
          />

          {open && paintings.length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-background shadow-lg rounded-lg z-10 max-h-80 overflow-auto">
              <div className="px-4 py-2">
                {paintings.map((p) => (
                  <Link
                    key={p.id}
                    href={`/detail/${p.id}`}
                    className="block px-2 py-1 rounded hover:bg-default-100"
                    onClick={handleSelect}
                  >
                    {p.title} — {p.artist}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <NavbarMenuToggle className="md:hidden" />
        <ThemeSwitch className="ml-3" />
      </NavbarContent>

      <NavbarMenu>
        {/* Mobile search + dropdown */}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          <div className="relative px-4 pt-12 pb-3">
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Введите название картины"
              fullWidth
              className="w-full max-w-none font-sans"
              startContent={<SearchIcon className="text-default-400" />}
            />

            {open && paintings.length > 0 && (
              <div className="absolute top-full left-4 right-4 mt-1 bg-background shadow-lg rounded-lg z-10 max-h-60 overflow-auto">
                <div className="px-4 py-2">
                  {paintings.map((p) => (
                    <Link
                      key={p.id}
                      href={`/detail/${p.id}`}
                      className="block px-2 py-1 rounded hover:bg-default-100"
                      onClick={handleSelect}
                    >
                      {p.title} — {p.artist}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {siteConfig.navMenuItems.map(({ label, href }, i) => (
            <NavbarMenuItem key={label}>
              <Link
                href={href ?? "#"}
                size="lg"
                color={
                  i === 2
                    ? "primary"
                    : i === siteConfig.navMenuItems.length - 1
                    ? "danger"
                    : "foreground"
                }
                onClick={() => {
                  setIsMenuOpen(false);
                  setOpen(false);
                }}
              >
                {label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};

export default Navbar;
