/**
 * Campaign data interface for tracking marketing attribution
 */
export interface CampaignData {
  // UTM Parameters
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  // Platform-specific click IDs
  fbclid?: string; // Facebook Click ID
  ttclid?: string; // TikTok Click ID
  tt_conv_id?: string; // TikTok Conversion ID
  gclid?: string; // Google Click ID
  gbraid?: string; // Google BRAID (for Performance Max)
  wbraid?: string; // Google WBRAID (for Performance Max)
  msclkid?: string; // Microsoft Click ID (Bing Ads)
  li_fat_id?: string; // LinkedIn Click ID
  // Routing parameters
  via?: string; // Optional routing/pixel flag
  // Coupon code
  coupon?: string; // Promotion or discount code
  // Rewardful
  rewardfulCode?: string; // Rewardful referral code
  // Segment
  segment_anonymous_id?: string; // Segment anonymous ID
}
