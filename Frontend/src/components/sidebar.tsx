import React from "react";
import {
  Accordion,
  AccordionItem,
  type ListboxProps,
  type ListboxSectionProps,
  type Selection,
  Listbox,
  ListboxItem,
  ListboxSection,
  Tooltip,
  cn,
} from "@heroui/react";
import { Icon } from "@iconify/react";
// Import SVG as React component via SVGR
import { ARTLOGO } from "../icons/Artlogo";

export enum SidebarItemType {
  Nest = "nest",
}

export type SidebarItem = {
  key: string;
  title: string;
  icon?: string;
  href?: string;
  type?: SidebarItemType.Nest;
  items?: SidebarItem[];
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  className?: string;
};

export type SidebarProps = Omit<ListboxProps<SidebarItem>, "children"> & {
  items: SidebarItem[];
  isCompact?: boolean;
  hideEndContent?: boolean;
  iconClassName?: string;
  sectionClasses?: ListboxSectionProps["classNames"];
  classNames?: ListboxProps<SidebarItem>["classNames"];
  defaultSelectedKey: string;
  onSelect?: (key: string) => void;
};

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  (
    {
      items,
      isCompact = false,
      hideEndContent = false,
      iconClassName,
      sectionClasses: sectionClassesProp = {},
      itemClasses: itemClassesProp = {},
      classNames,
      className,
      defaultSelectedKey,
      onSelect,
      ...props
    },
    ref,
  ) => {
    const [selected, setSelected] = React.useState<React.Key>(defaultSelectedKey);

    const sectionClasses = {
      ...sectionClassesProp,
      base: cn(sectionClassesProp.base, "w-full", { 'p-0 max-w-[44px]': isCompact }),
      group: cn(sectionClassesProp.group, { 'flex flex-col gap-1': isCompact }),
      heading: cn(sectionClassesProp.heading, { hidden: isCompact }),
    };

    const itemClasses = {
      ...itemClassesProp,
      base: cn(itemClassesProp.base, { 'w-11 h-11 gap-0 p-0': isCompact }),
    };

    const logoClass = cn('w-6 h-6 text-default-500 group-data-[selected=true]:text-foreground', iconClassName);

    const renderNestItem = React.useCallback(
      (item: SidebarItem) => {
        const isNest = item.type === SidebarItemType.Nest && item.items?.length;
        if (isNest) delete item.href;
        return (
          <ListboxItem
            {...item}
            key={item.key}
            classNames={{
              base: cn(
                itemClasses.base,
                { 'h-auto p-0': !isCompact && isNest },
                { 'inline-block w-11': isCompact && isNest },
              ),
            }}
            startContent={!isCompact && item.key === 'home' ? (
              <ARTLOGO className={logoClass} aria-label="Logo" />
            ) : !isCompact && item.icon ? (
              <Icon icon={item.icon} width={24} className={cn('text-default-500 group-data-[selected=true]:text-foreground', iconClassName)} />
            ) : null}
            endContent={isCompact || isNest || hideEndContent ? null : item.endContent}
            title={isCompact || isNest ? null : item.title}
          >
            {isCompact ? (
              <Tooltip content={item.title} placement="right">
                <div className="flex w-full items-center justify-center">
                  {item.key === 'home' ? (
                    <ARTLOGO className={logoClass} aria-label="Logo" />
                  ) : item.icon ? (
                    <Icon icon={item.icon} width={24} className={cn('text-default-500 group-data-[selected=true]:text-foreground', iconClassName)} />
                  ) : null}
                </div>
              </Tooltip>
            ) : (
              isNest && (
                <Accordion className="p-0">
                  <AccordionItem
                    key={item.key}
                    aria-label={item.title}
                    classNames={{ heading: 'pr-3', trigger: 'p-0', content: 'py-0 pl-4' }}
                    title={
                      <div className="flex h-11 items-center gap-2 px-2 py-1.5">
                        {item.key === 'home' ? (
                          <ARTLOGO className={logoClass} aria-label="Logo" />
                        ) : item.icon ? (
                          <Icon icon={item.icon} width={24} className={cn('text-default-500 group-data-[selected=true]:text-foreground', iconClassName)} />
                        ) : null}
                        <span className="text-small font-medium text-default-500 group-data-[selected=true]:text-foreground">
                          {item.title}
                        </span>
                      </div>
                    }
                  >
                    <Listbox items={item.items!} variant="flat" className="mt-0.5" classNames={{ list: cn('border-l border-default-200 pl-4') }}>
                      {item.items!.map(renderItem)}
                    </Listbox>
                  </AccordionItem>
                </Accordion>
              )
            )}
          </ListboxItem>
        );
      },
      [isCompact, hideEndContent, iconClassName, itemClasses.base],
    );

    const renderItem = React.useCallback(
      (item: SidebarItem) => {
        if (item.type === SidebarItemType.Nest && item.items?.length) return renderNestItem(item);
        return (
          <ListboxItem
            {...item}
            key={item.key}
            startContent={!isCompact && item.key === 'home' ? (
              <ARTLOGO className={logoClass} aria-label="Logo" />
            ) : !isCompact && item.icon ? (
              <Icon icon={item.icon} width={24} className={cn('text-default-500 group-data-[selected=true]:text-foreground', iconClassName)} />
            ) : null}
            endContent={isCompact || hideEndContent ? null : item.endContent}
            textValue={item.title}
            title={isCompact ? null : item.title}
          >
            {isCompact && (
              <Tooltip content={item.title} placement="right">
                <div className="flex w-full items-center justify-center">
                  {item.key === 'home' ? (
                    <ARTLOGO className={logoClass} aria-label="Logo" />
                  ) : item.icon ? (
                    <Icon icon={item.icon} width={24} className={cn('text-default-500 group-data-[selected=true]:text-foreground', iconClassName)} />
                  ) : null}
                </div>
              </Tooltip>
            )}
          </ListboxItem>
        );
      },
      [isCompact, hideEndContent, iconClassName],
    );

    return (
      <Listbox
        ref={ref}
        as="nav"
        hideSelectedIcon
        className={cn('list-none', className)}
        classNames={{ ...classNames, list: cn('items-center', classNames?.list) }}
        color="default"
        itemClasses={{
          ...itemClasses,
          base: cn('px-3 min-h-11 rounded-large h-[44px] data-[selected=true]:bg-default-100', itemClasses.base),
          title: cn('text-small font-medium text-default-500 group-data-[selected=true]:text-foreground', itemClasses.title),
        }}
        items={items}
        selectedKeys={[selected] as unknown as Selection}
        selectionMode="single"
        variant="flat"
        onSelectionChange={keys => {
          const key = Array.from(keys)[0] as string;
          setSelected(key);
          onSelect?.(key);
        }}
        {...props}
      >
        {items.map(item =>
          item.type === SidebarItemType.Nest && item.items?.length ? (
            renderNestItem(item)
          ) : item.items?.length ? (
            <ListboxSection key={item.key} title={item.title} classNames={sectionClasses} showDivider={isCompact}>
              {item.items.map(renderItem)}
            </ListboxSection>
          ) : (
            renderItem(item)
          ),
        )}
      </Listbox>
    );
  },
);

Sidebar.displayName = "Sidebar";

export default Sidebar;
