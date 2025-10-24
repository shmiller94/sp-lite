import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { SuperpowerLogo } from '@/components/icons/superpower-logo';
import { ContentLayout } from '@/components/layouts';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Body1, Body2, H3 } from '@/components/ui/typography';
import { HEARD_ABOUT_US_CATEGORIES } from '@/features/onboarding/const/heard-about-us';
import { useAnalytics } from '@/hooks/use-analytics';
import { cn } from '@/lib/utils';

import { useOnboardingStepper } from './onboarding-stepper';

type SelectedOption = {
  category: string;
  option: string;
};

export const HeardAboutUsStep = () => {
  const [selectedOption, setSelectedOption] = useState<SelectedOption | null>(
    null,
  );
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);

  const { track } = useAnalytics();
  const { next } = useOnboardingStepper();

  const handleNext = () => {
    if (!selectedOption) return;

    track('answered_survey_hdyhau', {
      category: selectedOption.category,
      option: selectedOption.option,
      $set: {
        hdyhau_category: selectedOption.category,
        hdyhau_option: selectedOption.option,
      },
    });

    next();
  };

  const handleSelectOption = (categoryTitle: string, optionLabel: string) => {
    setSelectedOption({ category: categoryTitle, option: optionLabel });
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <nav className="mx-auto w-full max-w-6xl p-7">
        <SuperpowerLogo />
      </nav>

      <ContentLayout
        title="How did you hear about us?"
        className="pt-0 sm:pt-0"
      >
        <div
          className="mx-auto w-full max-w-xl space-y-8"
          role="form"
          aria-label="How did you hear about us survey"
        >
          <H3>How did you hear about us?</H3>

          <div className="flex w-full flex-col items-center gap-8">
            <RadioGroup
              value={
                selectedOption
                  ? `${selectedOption.category}-${selectedOption.option}`
                  : undefined
              }
              className="w-full gap-3"
              role="radiogroup"
              aria-label="Survey options"
            >
              {HEARD_ABOUT_US_CATEGORIES.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  selectedOption={selectedOption}
                  isOpen={openCategoryId === category.id}
                  onOpenChange={() =>
                    setOpenCategoryId(
                      openCategoryId === category.id ? null : category.id,
                    )
                  }
                  onSelectOption={handleSelectOption}
                />
              ))}
            </RadioGroup>
            <div className="flex w-full flex-col gap-2">
              <Button
                disabled={!selectedOption?.option?.trim()}
                onClick={handleNext}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </ContentLayout>
    </div>
  );
};

type CategoryCardProps = {
  category: (typeof HEARD_ABOUT_US_CATEGORIES)[number];
  selectedOption: SelectedOption | null;
  isOpen: boolean;
  onOpenChange: () => void;
  onSelectOption: (category: string, option: string) => void;
};

const CategoryCard = ({
  category,
  selectedOption,
  isOpen,
  onOpenChange,
  onSelectOption,
}: CategoryCardProps) => {
  const isCategorySelected = selectedOption?.category === category.title;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onOpenChange}
      className="w-full rounded-2xl border border-zinc-200 bg-white"
    >
      <CollapsibleTrigger
        className="flex w-full items-center justify-between gap-3 rounded-2xl px-6 py-5 text-left outline-inherit"
        aria-expanded={isOpen}
        aria-controls={`category-${category.id}-options`}
      >
        <Body1
          className={cn(
            isCategorySelected &&
              'text-vermillion-900 transition-all duration-200',
          )}
        >
          {category.title}
        </Body1>
        <ChevronRight
          className={cn(
            'size-5 text-zinc-400 transition-transform duration-200 ease-out',
            isOpen ? 'rotate-90' : 'rotate-0',
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-6 pb-5">
          {!category.options?.length ? (
            <div className="border-t border-zinc-200 pt-4">
              <Textarea
                placeholder="Please tell us more..."
                value={
                  selectedOption?.category === category.title
                    ? selectedOption.option
                    : ''
                }
                onChange={(e) => onSelectOption(category.title, e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
          ) : (
            <ul className="-mb-4 divide-y divide-zinc-200 border-t border-zinc-200">
              {category.options.map((option) => {
                const OptionIcon = option.icon;
                const value = `${category.title}-${option.label}`;

                return (
                  <li key={option.value}>
                    <Label
                      htmlFor={value}
                      onClick={() =>
                        onSelectOption(category.title, option.label)
                      }
                      className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left text-sm"
                    >
                      <div className="flex items-center gap-4">
                        <OptionIcon
                          className="size-4 text-zinc-400"
                          aria-hidden={true}
                        />
                        <Body2>{option.label}</Body2>
                      </div>
                      <RadioGroupItem
                        id={value}
                        value={value}
                        variant="vermillion"
                        className="size-4"
                        aria-label={option.label}
                      />
                    </Label>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
