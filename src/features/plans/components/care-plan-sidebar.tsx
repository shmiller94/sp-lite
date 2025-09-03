import { ChevronLeft } from '@/components/icons/chevron-left-icon';
import { Link } from '@/components/ui/link';
import { Body2 } from '@/components/ui/typography';

import { useTableOfContents } from '../hooks/use-table-of-contents';

export const CarePlanSidebar = () => {
  const { sectionLinks, activeSection } = useTableOfContents();

  const activeIndex = sectionLinks.findIndex(
    (link) => link.key === activeSection,
  );

  const scrollToSection = (key: string) => {
    const targetLink = sectionLinks.find((link) => link.key === key);
    if (targetLink) {
      const elementRect = targetLink.element.getBoundingClientRect();

      // custom offset for the section titles to not be behind the nav bar
      const offsetPosition = elementRect.top + window.scrollY - 128;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <aside className="top-20 w-full max-w-48 shrink-0 space-y-4 lg:sticky lg:h-96 lg:pl-5 xl:pl-0">
      <Link to="/" className="group -ml-1.5 flex items-center gap-0.5 p-0">
        <ChevronLeft className="-mt-px w-[15px] text-zinc-400 transition-all duration-150 group-hover:-translate-x-0.5 group-hover:text-zinc-600" />
        <Body2 className="text-zinc-500 transition-all duration-150 group-hover:text-zinc-700">
          Home
        </Body2>
      </Link>
      <div className="hidden space-y-2 lg:block">
        <nav className="relative pl-1.5">
          <div
            className="absolute left-0 mt-1.5 h-5 w-[1.5px] bg-vermillion-900 transition-all duration-200 ease-out"
            style={{
              transform: `translateY(${activeIndex >= 0 ? activeIndex * 32 : 0}px)`,
            }}
          />
          {sectionLinks.map((link, index) => (
            <button
              key={link.key}
              data-section={link.key}
              onClick={() => scrollToSection(link.key)}
              className="group flex h-8 w-full items-center gap-2 rounded-lg p-2 text-left text-sm transition-colors"
            >
              <Body2
                className={`transition-colors ${
                  activeSection === link.key
                    ? 'font-medium text-zinc-950'
                    : 'text-zinc-500 group-hover:text-zinc-950'
                }`}
              >
                {index + 1}. {link.text}
              </Body2>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};
