import React from 'react';

import { AtHomeNoticeSection } from '@/features/onboarding/components/configurator/at-home-notice-section';

import {
  SectionBilling,
  SectionSubscriptions,
} from '../components/configurator';

export const CONFIGURATOR_ITEMS = [
  {
    component: <SectionSubscriptions />,
  },
  {
    component: <AtHomeNoticeSection />,
  },
  {
    component: <SectionBilling />,
  },
];
