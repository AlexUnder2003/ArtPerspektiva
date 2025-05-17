// components/CategoryTabs.tsx
'use client';

import { Tabs, Tab, type TabsProps } from '@heroui/react';
import { twMerge } from 'tailwind-merge';

const defaultSlots: TabsProps['classNames'] = {
  tabList:  'flex gap-8',
  /* underline совпадает с цветом текста благодаря bg-current */
  cursor:   'h-[2px] bottom-0 bg-current transition-colors',
  tab:      'px-0',
  tabContent: [
    // базовый (светлая тема)
    'whitespace-nowrap text-neutral-800',
    // вариант для тёмной темы
    'dark:text-neutral-200',
    // активная вкладка (светлая + тёмная)
    'group-data-[selected=true]:text-neutral-950',
    'dark:group-data-[selected=true]:text-white',
    'font-medium transition-colors',
  ].join(' '),
};

export default function CategoryTabs(
  { className, classNames, ...rest }: {
    className?: string;
    classNames?: TabsProps['classNames'];
  } & Omit<TabsProps, 'items' | 'children' | 'classNames' | 'className'>
) {
  const categories = [
    { key: 'all',          title: 'Все' },
    { key: 'app-inspire',  title: 'App design inspiration' },
    { key: 'web-app',      title: 'Web app design' },
    { key: 'web-page',     title: 'Webpage design' },
    { key: 'illustration', title: 'Иллюстрации' },
    { key: 'arch',         title: 'Архитектура' },
  ];

  return (
    <Tabs
      aria-label="Категории работ"
      variant="underlined"
      defaultSelectedKey="all"
      className={twMerge('ml-6', className)}
      classNames={{ ...defaultSlots, ...classNames }}
      {...rest}
    >
      {categories.map(({ key, title }) => (
        <Tab key={key} title={title} />
      ))}
    </Tabs>
  );
}
