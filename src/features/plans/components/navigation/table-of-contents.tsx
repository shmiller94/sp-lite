import { memo, useMemo } from 'react';

import { Body2 } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

import { useTableOfContents } from '../../hooks/use-table-of-contents';

export const TableOfContents = memo(() => {
  const { sectionLinks, activeSection } = useTableOfContents();

  const mainSectionNumbers = useMemo(() => {
    const numbers = new Map<string, number>();
    let count = 0;

    sectionLinks.forEach((link) => {
      if (link.type === 'main') {
        numbers.set(link.key, count + 1);
        count++;
      }
    });

    return numbers;
  }, [sectionLinks]);

  const activeIndex = sectionLinks.findIndex(
    (link) => link.key === activeSection,
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const findParentMainSectionIndex = (subSectionIndex: number) => {
    for (let i = subSectionIndex - 1; i >= 0; i--) {
      if (sectionLinks[i].type === 'main') return i;
    }
    return -1;
  };

  const { indicatorHeight, indicatorTop } = useMemo(() => {
    const baseHeight = 20;
    const itemHeight = 32;

    if (activeIndex < 0)
      return { indicatorHeight: baseHeight, indicatorTop: 0 };

    const activeLink = sectionLinks[activeIndex];

    if (activeLink.type === 'sub') {
      const parentIndex = findParentMainSectionIndex(activeIndex);
      if (parentIndex >= 0) {
        const itemsBetween = activeIndex - parentIndex;
        return {
          indicatorHeight: baseHeight + itemsBetween * itemHeight,
          indicatorTop: parentIndex * itemHeight,
        };
      }
    }

    return {
      indicatorHeight: baseHeight,
      indicatorTop: activeIndex * itemHeight,
    };
  }, [activeIndex, findParentMainSectionIndex, sectionLinks]);

  const scrollToSection = (key: string) => {
    const targetLink = sectionLinks.find((link) => link.key === key);
    if (!targetLink) return;

    const elementRect = targetLink.element.getBoundingClientRect();
    const offsetPosition = elementRect.top + window.scrollY - 128;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  };

  return (
    <div className="space-y-2">
      <nav className="relative pl-1.5">
        {/* Active section indicator bar */}
        <div
          className="absolute left-0 mt-1.5 w-[1.5px] bg-vermillion-900 transition-all duration-200 ease-out"
          style={{
            transform: `translateY(${indicatorTop}px)`,
            height: `${indicatorHeight}px`,
          }}
        />
        {sectionLinks.map((link) => {
          const isMainSection = link.type === 'main';
          const isActive = activeSection === link.key;

          return (
            <button
              key={link.key}
              data-section={link.key}
              onClick={() => scrollToSection(link.key)}
              className={cn(
                'group flex h-8 w-full items-center gap-2 rounded-lg p-2 text-left text-sm transition-colors',
                !isMainSection && 'pl-[22px]', // Indent subsections
              )}
            >
              <Body2
                className={cn(
                  'transition-colors line-clamp-1',
                  isActive
                    ? 'font-medium text-zinc-950'
                    : 'text-zinc-500 group-hover:text-zinc-950',
                )}
              >
                {/* Show number prefix for main sections */}
                {isMainSection && `${mainSectionNumbers.get(link.key)}. `}
                {link.text}
              </Body2>
            </button>
          );
        })}
      </nav>
    </div>
  );
});

TableOfContents.displayName = 'TableOfContents';
