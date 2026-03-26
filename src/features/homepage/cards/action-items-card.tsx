import { useNavigate } from '@tanstack/react-router';
import { type ReactElement } from 'react';

import {
  ActionableAccordion,
  ActionableAccordionItem,
} from '@/components/shared/actionable-accordion';
import { useUser } from '@/lib/auth';
import { shouldShowImportMemory } from '@/utils/show-action-conditions';

interface ActionItem {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  onClick: () => void;
}

export const ActionItemsCard = () => {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const showImportMemory = shouldShowImportMemory(user?.createdAt);

  const actions: ActionItem[] = [
    {
      id: 'upload-labs',
      title: 'Upload past test records',
      description: 'See trends from your past labs.',
      imageSrc: '/data/file-stack.webp',
      onClick: () => {
        void navigate({
          to: '/concierge',
          search: { preset: 'upload-labs' },
        });
      },
    },
  ];

  if (showImportMemory) {
    actions.push({
      id: 'import-memory-superpower-ai',
      title: 'Continue from another AI',
      description: 'Import your conversations and deepen your health story.',
      imageSrc: '/concierge/other_llms.webp',
      onClick: () => {
        void navigate({
          to: '/concierge',
          search: { preset: 'import-memory' },
        });
      },
    });
  }

  const shouldForceOpen = actions.length < 3;

  const items: ReactElement[] = [];
  for (const action of actions) {
    items.push(
      <ActionableAccordionItem
        key={action.id}
        title={action.title}
        description={action.description}
        imageSrc={action.imageSrc}
        onClick={action.onClick}
      />,
    );
  }

  return (
    <ActionableAccordion
      title="Action Items"
      defaultOpen={shouldForceOpen}
      allowCollapse={!shouldForceOpen}
      highlighted={false}
      showHeaderIndicator={false}
      showTopSeparator={false}
    >
      {items}
    </ActionableAccordion>
  );
};
