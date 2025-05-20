import { CampaignData } from '@/types/campaign';

interface AnalyticsWindow extends Window {
  analytics?: {
    addSourceMiddleware: (middleware: any) => void;
    user?: {
      anonymousId: () => string;
    };
  };
}

/**
 * Add Segment source middleware to attach UTM parameters to all events
 */
export const addUtmMiddleware = (): void => {
  const win = window as AnalyticsWindow;

  if (!win.analytics) {
    // Silently ignore when analytics is not available
    return;
  }

  win.analytics.addSourceMiddleware(
    ({ payload, next }: { payload: any; next: (payload: any) => void }) => {
      const match = /sp_utm=([^;]+)/.exec(document.cookie || '');
      if (match) {
        try {
          payload.context = {
            ...payload.context,
            campaign: JSON.parse(decodeURIComponent(match[1])),
          };
        } catch (e) {
          // Silently ignore UTM data parsing errors
        }
      }
      next(payload);
    },
  );
};

/**
 * Get UTM data from cookie
 * @returns UTM data object or empty object
 */
export const getUtmData = (): CampaignData => {
  const match = /sp_utm=([^;]+)/.exec(document.cookie || '');
  let campaignData: CampaignData = {};

  if (match) {
    try {
      campaignData = JSON.parse(decodeURIComponent(match[1])) as CampaignData;
    } catch (e) {
      // Silently ignore UTM data parsing errors
    }
  }

  // Safer fallback approach for Segment anonymous ID
  const win = window as any;
  const segmentAnonymousId =
    win.analytics?.user?.anonymousId?.() ||
    localStorage.getItem('ajs_anonymous_id');

  if (segmentAnonymousId) {
    campaignData.segment_anonymous_id = segmentAnonymousId.replace(/"/g, ''); // Remove quotes if present
  }

  return campaignData;
};
