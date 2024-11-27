import { ArrowRight } from 'lucide-react';
import { ReactNode } from 'react';

import { HealthGradeComponent } from '@/components/ui/health-grade';
import { AnnualReportBiomarkersTable } from '@/features/action-plan/components/biomarkers/annual-report-biomarkers-table';
import { BlockAccordion } from '@/features/action-plan/components/block-accordion';
import { cn } from '@/lib/utils';
import { Block, BlockGroup, BlockGroupItem } from '@/types/api';

const renderItemRefs = (itemRefs: BlockGroupItem['ref']) => {
  if (!itemRefs) return null;
  return (
    <div className="flex h-full justify-end gap-2">
      {itemRefs.map((ref) => {
        if (ref.type === 'TEXT_LINK' || ref.type === 'BUTTON_LINK') {
          return <RefLink key={ref.id} text={ref.text} href={ref.value} />;
        }
        return null;
      })}
    </div>
  );
};

const renderOtherItemComponent = (item: BlockGroupItem) => {
  return (
    <div className="flex h-full flex-col justify-between">
      {renderItemRefs(item.ref)}
    </div>
  );
};

export const BlockGroupComponent = ({
  blockGroup,
  className,
  children,
}: {
  blockGroup: BlockGroup;
  className?: string;
  children?: ReactNode;
}) => {
  let healthGrade: string = blockGroup.score;

  if (healthGrade === 'UNSET') {
    healthGrade = '-';
  }

  return (
    <div className={cn('health-grade-card p-5', className)}>
      <div className="flex flex-col gap-4">
        <div className=" flex items-center gap-4">
          <HealthGradeComponent grade={healthGrade} />
          <p className="text-zinc-900">{blockGroup.name}</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export const RefLink = ({
  text,
  href,
  className,
}: {
  text: string;
  href: string;
  className?: string;
}) => {
  return (
    <a
      className={cn(
        'inline-flex h-7 w-fit items-center gap-1 rounded-[8px] bg-zinc-50 pl-2 pr-[10px] cursor-pointer hover:bg-gray-300 transition-all duration-200 self-end',
        className,
      )}
      href={href}
    >
      <span className="text-xs text-zinc-500 hover:text-zinc-700">{text}</span>
      <ArrowRight className="size-3 -rotate-45 text-zinc-500 hover:text-zinc-700" />
    </a>
  );
};

export const PhilosophyBlocks = ({
  philosophyBlocks,
  className,
}: {
  philosophyBlocks: Block[];
  className?: string;
}) => {
  return (
    <section
      className={cn('flex flex-col items-center justify-center', className)}
    >
      <div className="flex w-full flex-col items-center gap-1">
        {philosophyBlocks.map((block) => (
          <BlockAccordion key={block.id} block={block}>
            {block.blockGroup.map((group, groupIndex) => {
              const biomarkers = group.blockGroupItem.filter(
                (item) => item.type === 'BIOMARKER',
              );

              return (
                <BlockGroupComponent
                  key={groupIndex}
                  blockGroup={group}
                  className={cn(
                    {
                      'border-none': groupIndex === block.blockGroup.length - 1,
                    },
                    'border-b border-zinc-200',
                  )}
                >
                  {biomarkers.length > 0 ? (
                    <AnnualReportBiomarkersTable blockGroupItems={biomarkers} />
                  ) : (
                    group.blockGroupItem.map((item) => (
                      <div key={item.id}>{renderOtherItemComponent(item)}</div>
                    ))
                  )}
                </BlockGroupComponent>
              );
            })}
          </BlockAccordion>
        ))}
      </div>
      <div className="text-sm bg-zinc-50 p-4 rounded-lg mt-2">
        <p className="mb-2">Disclaimer</p>
        <p className="text-zinc-500">
          The scores generated under Health Optimization, Environmental,
          Nutrition, Look and Feel are system-generated using unique data shared
          about your medical history and health background. This report is
          exclusively intended to be used for health optimization and wellness
          purposes. These scores are not intended to diagnose or treat disease,
          or to substitute a physicianʼs consultation. These insights are
          determined by evaluating current research and may change over time to
          reflect the most up to date research available.
        </p>
      </div>
    </section>
  );
};
