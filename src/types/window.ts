type DataLayerEvent = {
  event: string;
  value: number;
  referralId: string | null;
  [key: string]: any;
};

export type RewardfulWindow = Window & {
  Rewardful?: {
    referral: string;
    coupon?: {
      id: string;
    };
  };
  dataLayer?: DataLayerEvent[];
};
