export type DrawState =
  | 'scheduled'
  | 'needs-scheduling'
  | 'multi-panel'
  | 'pending-baseline'
  | 'pending-custom'
  | 'delayed';

export const DRAW_STATE_LABELS: Record<DrawState, string> = {
  scheduled: 'Scheduled',
  'needs-scheduling': 'Needs Scheduling',
  'multi-panel': 'Multi-Panel',
  'pending-baseline': 'Pending (Baseline)',
  'pending-custom': 'Pending (Custom)',
  delayed: 'Delayed',
};

export const DRAW_STATES: DrawState[] = [
  'scheduled',
  'needs-scheduling',
  'multi-panel',
  'pending-baseline',
  'pending-custom',
  'delayed',
];

export interface PrepTip {
  title: string;
  description: string;
}

export interface ScheduledData {
  panelName: string;
  location: string;
  address: string;
  date: string;
  time: string;
  daysUntil: number;
  prepTips: PrepTip[];
}

export interface BiomarkerFlag {
  name: string;
  value: string;
  unit: string;
  status: 'borderline' | 'abnormal' | 'normal';
  note: string;
}

export interface PanelRecommendation {
  panelName: string;
  priority: number;
  reason: string;
  biomarkerFlag?: BiomarkerFlag;
}

export interface NeedsSchedulingData {
  recommendations: PanelRecommendation[];
}

export interface MultiPanelData {
  panels: PanelRecommendation[];
}

export interface EscalationStep {
  day: number;
  date: string;
  label: string;
  reached: boolean;
}

export interface ResultsPendingData {
  panelName: string;
  panelType: 'baseline' | 'advanced' | 'custom';
  sampleReceivedDate: string;
  currentStep: 'received' | 'processing' | 'ready';
  escalationSteps: EscalationStep[];
}

export interface ResultsDelayedData {
  panelName: string;
  panelType: 'baseline' | 'advanced' | 'custom';
  sampleReceivedDate: string;
  nextFollowUpDate: string;
  escalationSteps: EscalationStep[];
}

export const MOCK_SCHEDULED: ScheduledData = {
  panelName: 'Superpower Baseline Panel',
  location: 'Quest Diagnostics',
  address: '123 Broadway, New York, NY 10006',
  date: 'April 18, 2026',
  time: '9:30 AM',
  daysUntil: 6,
  prepTips: [
    {
      title: 'Fast for 12 hours',
      description:
        'Have a light, healthy meal beforehand, then start your fast 12 hours before your appointment.',
    },
    {
      title: 'Stay hydrated',
      description:
        'Drink at least 1L (4 cups) of water the day before and the morning of your visit. Good hydration makes blood draws easier.',
    },
    {
      title: 'Stop taking Biotin supplements',
      description:
        'Stop taking supplements with biotin, commonly found in multivitamins, B-complex, or hair skin and nail vitamins at least 48 hours before.',
    },
    {
      title: 'Avoid heavy, fatty foods',
      description:
        'Avoid heavy, fatty foods such as ice cream and coconut cream before your fast as these can influence results.',
    },
    {
      title: 'No caffeine or alcohol',
      description:
        'Skip alcohol and caffeine the day before. Avoid all exercise for 24 hours, as it can affect your results.',
    },
    {
      title: 'Keep your arms warm',
      description:
        'Warm arms help your veins dilate, making the draw quicker and more comfortable.',
    },
  ],
};

export const MOCK_NEEDS_SCHEDULING: NeedsSchedulingData = {
  recommendations: [
    {
      panelName: 'Thyroid Panel',
      priority: 1,
      reason:
        'Based on your last results, your thyroid markers were borderline. We recommend scheduling this first so your clinician has the freshest data.',
      biomarkerFlag: {
        name: 'TSH',
        value: '4.2',
        unit: 'mIU/L',
        status: 'borderline',
        note: 'Borderline high from last draw',
      },
    },
    {
      panelName: 'Superpower Advanced Panel',
      priority: 2,
      reason:
        'Your advanced markers were within range last time. This can wait until after your thyroid panel.',
    },
  ],
};

export const MOCK_MULTI_PANEL: MultiPanelData = {
  panels: [
    {
      panelName: 'Thyroid Panel',
      priority: 1,
      reason:
        'Your TSH was borderline at 4.2 mIU/L in your last draw. Complete this first for the freshest data.',
      biomarkerFlag: {
        name: 'TSH',
        value: '4.2',
        unit: 'mIU/L',
        status: 'borderline',
        note: 'Borderline high',
      },
    },
    {
      panelName: 'Metabolic Panel',
      priority: 2,
      reason:
        'All metabolic markers were normal in your last panel. Lower clinical urgency.',
    },
  ],
};

export const MOCK_PENDING_BASELINE: ResultsPendingData = {
  panelName: 'Superpower Baseline Panel',
  panelType: 'baseline',
  sampleReceivedDate: 'April 10, 2026',
  currentStep: 'processing',
  escalationSteps: [
    { day: 1, date: 'April 10', label: 'Sample received', reached: true },
    {
      day: 5,
      date: 'April 15',
      label: "We'll send you an update on your results",
      reached: false,
    },
    {
      day: 10,
      date: 'April 20',
      label: "If results aren't ready, we'll follow up again",
      reached: false,
    },
  ],
};

export const MOCK_PENDING_CUSTOM: ResultsPendingData = {
  panelName: 'Custom Blood Panel',
  panelType: 'custom',
  sampleReceivedDate: 'April 8, 2026',
  currentStep: 'processing',
  escalationSteps: [
    { day: 1, date: 'April 8', label: 'Sample received', reached: true },
    {
      day: 5,
      date: 'April 13',
      label: "We'll send you an update on your results",
      reached: false,
    },
    {
      day: 14,
      date: 'April 22',
      label: "If results aren't ready, we'll follow up again",
      reached: false,
    },
  ],
};

export const MOCK_DELAYED: ResultsDelayedData = {
  panelName: 'Lipid Panel',
  panelType: 'baseline',
  sampleReceivedDate: 'April 1, 2026',
  nextFollowUpDate: 'April 13, 2026',
  escalationSteps: [
    { day: 1, date: 'April 1', label: 'Sample received', reached: true },
    {
      day: 5,
      date: 'April 6',
      label: 'Update sent',
      reached: true,
    },
    {
      day: 10,
      date: 'April 11',
      label: 'Follow-up sent',
      reached: true,
    },
  ],
};
