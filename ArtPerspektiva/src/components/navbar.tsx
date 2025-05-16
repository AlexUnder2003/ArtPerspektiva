import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";

import { Input }  from "@heroui/input";
import { Link }   from "@heroui/link";
import { Kbd }    from "@heroui/kbd";

import { ThemeSwitch }     from "@/components/theme-switch";
import { SearchIcon } from "@/components/icons";


import { siteConfig } from "@/config/site";

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
    endContent={
      <Kbd keys={["command"]} className="hidden lg:inline-block">
        K
      </Kbd>
    }
    aria-label="Search"
  />
);

/* ───────────────── Navbar ───────────────── */
export const Navbar = () => (
  <HeroUINavbar position="sticky" maxWidth="fluid" className="px-4">
    <NavbarContent className="w-full items-center gap-4">
      {/* ПОИСК (grow) */}
      <NavbarItem className="hidden lg:flex grow">
        <SearchInput />
      </NavbarItem>

      {/* БЛОК СПРАВА */}
      <NavbarItem className="flex-none gap-2">
        

        {/* переключатель темы */}
        <ThemeSwitch />

        {/* бургер-меню */}
        <NavbarMenuToggle className="lg:hidden" />
      </NavbarItem>
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

/* экспорт по умолчанию тоже доступен */
export default Navbar;
