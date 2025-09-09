import { useCallback, useEffect, useRef, useState } from 'react';

type SectionLink = {
  key: string;
  text: string;
  element: Element;
  type: 'main' | 'sub';
};

export function useTableOfContents() {
  const [sectionLinks, setSectionLinks] = useState<SectionLink[]>([]);
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [scrollPercentage, setScrollPercentage] = useState<number>(0);

  const lastScrollYRef = useRef<number>(0);
  const scrollDirectionRef = useRef<'up' | 'down'>('down');
  const tickingRef = useRef<boolean>(false);
  const sectionLinksRef = useRef<SectionLink[]>([]);
  const lastScrollPercentageRef = useRef<number>(0);
  const lastActiveSectionRef = useRef<string>('overview');

  const findActiveSection = useCallback(() => {
    if (sectionLinksRef.current.length === 0) return;

    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;
    const offset = viewportHeight * 0.3; // 30% from top of viewport

    let activeSection = sectionLinksRef.current[0];

    for (const section of sectionLinksRef.current) {
      const rect = section.element.getBoundingClientRect();
      const elementTop = rect.top + scrollTop;

      if (scrollDirectionRef.current === 'down') {
        // When scrolling down, activate when section reaches 30% from top
        if (scrollTop + offset >= elementTop) {
          activeSection = section;
        } else {
          break;
        }
      } else {
        // When scrolling up, activate when section is above 70% from top
        if (scrollTop + offset >= elementTop) {
          activeSection = section;
        } else {
          break;
        }
      }
    }

    if (lastActiveSectionRef.current !== activeSection.key) {
      setActiveSection(activeSection.key);
      lastActiveSectionRef.current = activeSection.key;
    }
  }, []);

  const handleScrollAndCalculate = useCallback(() => {
    const scrollTop = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollableHeight = documentHeight - windowHeight;

    // Track scroll direction
    if (scrollTop > lastScrollYRef.current) {
      scrollDirectionRef.current = 'down';
    } else if (scrollTop < lastScrollYRef.current) {
      scrollDirectionRef.current = 'up';
    }
    lastScrollYRef.current = scrollTop;

    // Calculate scroll percentage - only update if it changed by at least 1%
    if (scrollableHeight <= 0) {
      if (lastScrollPercentageRef.current !== 0) {
        setScrollPercentage(0);
        lastScrollPercentageRef.current = 0;
      }
    } else {
      const percentage = Math.round((scrollTop / scrollableHeight) * 100);
      const clampedPercentage = Math.min(100, Math.max(0, percentage));
      if (Math.abs(clampedPercentage - lastScrollPercentageRef.current) >= 1) {
        setScrollPercentage(clampedPercentage);
        lastScrollPercentageRef.current = clampedPercentage;
      }
    }

    // Find active section
    findActiveSection();

    tickingRef.current = false;
  }, [findActiveSection]);

  const handleScroll = useCallback(() => {
    if (!tickingRef.current) {
      requestAnimationFrame(handleScrollAndCalculate);
      tickingRef.current = true;
    }
  }, [handleScrollAndCalculate]);

  useEffect(() => {
    const h2Elements = document.querySelectorAll('#section-title');
    const subheadingElements = document.querySelectorAll('#section-heading');

    const links: SectionLink[] = [
      ...Array.from(h2Elements).map((element) => {
        const text = element.textContent?.trim() || '';
        const key = text.toLowerCase().replace(/\s+/g, '-');
        return {
          key,
          text,
          element,
          type: 'main' as const,
        };
      }),
      ...Array.from(subheadingElements).map((element) => {
        const text = element.textContent?.trim() || '';
        const key = text.toLowerCase().replace(/\s+/g, '-');
        return {
          key,
          text,
          element,
          type: 'sub' as const,
        };
      }),
    ];

    links.sort((a, b) => {
      const aTop = (a.element as HTMLElement).offsetTop;
      const bTop = (b.element as HTMLElement).offsetTop;
      return aTop - bTop;
    });

    setSectionLinks(links);
    sectionLinksRef.current = links;

    // Initialize active section
    if (links.length > 0) {
      findActiveSection();
    }
  }, [findActiveSection]);

  useEffect(() => {
    handleScrollAndCalculate();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScrollAndCalculate, handleScroll]);

  return {
    sectionLinks,
    activeSection,
    scrollPercentage,
  };
}
