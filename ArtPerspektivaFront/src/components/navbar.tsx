// ─────────────────────────────────────────────
// src/components/navbar.tsx  – Grid-версия
// • Поиск виден ≥ lg (≥ 1024 px)
// • ThemeSwitch ВСЕГДА крайний справа
// ─────────────────────────────────────────────
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import { Input } from "@heroui/input";
import { Link }  from "@heroui/link";
import { Kbd }   from "@heroui/kbd";

import { ThemeSwitch } from "@/components/theme-switch";
import { SearchIcon }  from "@/components/icons";
import { siteConfig }  from "@/config/site";

/* ─────────────── Поиск ─────────────── */
const SearchInput = () => (
  <Input
    type="search"
    placeholder="Search…"
    fullWidth
    className="w-full max-w-none"
    classNames={{
      inputWrapper: "w-full bg-default-100",
      input:        "w-full text-sm",
    }}
    startContent={
      <SearchIcon className="text-default-400 pointer-events-none flex-shrink-0" />
    }
    endContent={<Kbd keys={["command"]} className="hidden lg:inline-block">K</Kbd>}
    aria-label="Search"
  />
);

/* ─────────────────── Navbar ─────────────────── */
export const Navbar = () => (
  <HeroUINavbar position="sticky" maxWidth="fluid" className="px-4">
    {/* Grid: 1fr (поиск) | auto (бургер) | auto (ThemeSwitch) */}
    <NavbarContent
      className="w-full grid items-center gap-2 grid-cols-[1fr_auto_auto]"
    >
      {/* Поиск – только ≥ lg */}
      <div className="hidden md:block w-full">
        <SearchInput />
      </div>

      {/* Бургер – виден < lg */}
      <NavbarMenuToggle className="md:hidden" />

      {/* Theme-switch – ВСЕГДА последний, поэтому крайний справа */}
      <ThemeSwitch />
    </NavbarContent>

    {/* Мобильное меню */}
    <NavbarMenu>
      <div className="px-4">
        <SearchInput />
      </div>

      <div className="mx-4 mt-2 flex flex-col gap-2">
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
            >
              {label}
            </Link>
          </NavbarMenuItem>
        ))}
      </div>
    </NavbarMenu>
  </HeroUINavbar>
);

export default Navbar;
