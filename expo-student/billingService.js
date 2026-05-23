import { Platform } from 'react-native';
import { BILLING_PRODUCTS, getBillingProductByPlan } from './billingConfig';
import { activateDemoPremium } from './subscriptionService';

export function isNativeBillingSupported() {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

export async function getAvailableProducts() {
  return Object.values(BILLING_PRODUCTS);
}

export async function purchaseSubscription({ studentId, plan = 'single' }) {
  const product = getBillingProductByPlan(plan);

  // Placeholder architecture.
  // Real App Store / Play Store billing can later be connected here.
  // For MVP testing we activate Firestore premium immediately.

  await activateDemoPremium(studentId, plan);

  return {
    success: true,
    mode: 'demo',
    product,
  };
}
