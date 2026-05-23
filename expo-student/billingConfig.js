export const BILLING_PRODUCTS = {
  singleMonthly: {
    id: 'saudiedu_single_monthly',
    plan: 'single',
    title: 'Single Premium',
    priceLabel: '39 SAR / month',
    profilesAllowed: 1,
    deviceLimit: 2,
  },
  familyMonthly: {
    id: 'saudiedu_family_monthly',
    plan: 'family',
    title: 'Family Premium',
    priceLabel: '99 SAR / month',
    profilesAllowed: 4,
    deviceLimit: 6,
  },
};

export const BILLING_PRODUCT_IDS = Object.values(BILLING_PRODUCTS).map((product) => product.id);

export function getBillingProductByPlan(plan = 'single') {
  return Object.values(BILLING_PRODUCTS).find((product) => product.plan === plan) || BILLING_PRODUCTS.singleMonthly;
}
