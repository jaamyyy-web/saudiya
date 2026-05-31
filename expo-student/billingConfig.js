// ─── RevenueCat API Keys ────────────────────────────────────────────────────
// Get these from https://app.revenuecat.com → Project → API Keys
// Leave empty to run in demo mode (no real charges).
export const REVENUECAT_API_KEYS = {
  ios: '',      // appl_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  android: '',  // goog_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
};

// Entitlement identifier — must match exactly what you create in RevenueCat dashboard
export const PREMIUM_ENTITLEMENT_ID = 'premium';

// ─── Product Identifiers ────────────────────────────────────────────────────
// These MUST match the product IDs you create in:
//   iOS:     App Store Connect → In-App Purchases
//   Android: Google Play Console → Monetization → Products
//
// RevenueCat Offering ID:   "default"
// RevenueCat Package IDs:   "$rc_monthly" for each product
export const BILLING_PRODUCTS = {
  singleMonthly: {
    id: 'saudiedu_single_monthly',   // App Store / Play Store product ID
    plan: 'single',
    title: 'Single Premium',
    priceLabel: '39 SAR / شهر',
    profilesAllowed: 1,
    deviceLimit: 2,
  },
  familyMonthly: {
    id: 'saudiedu_family_monthly',   // App Store / Play Store product ID
    plan: 'family',
    title: 'Family Premium',
    priceLabel: '99 SAR / شهر',
    profilesAllowed: 4,
    deviceLimit: 6,
  },
};

export const BILLING_PRODUCT_IDS = Object.values(BILLING_PRODUCTS).map((p) => p.id);

export function getBillingProductByPlan(plan = 'single') {
  return Object.values(BILLING_PRODUCTS).find((p) => p.plan === plan) || BILLING_PRODUCTS.singleMonthly;
}
