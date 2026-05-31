import { Platform } from 'react-native';
import { BILLING_PRODUCTS, PREMIUM_ENTITLEMENT_ID, REVENUECAT_API_KEYS } from './billingConfig';
import { activateDemoPremium } from './subscriptionService';

// ─── Lazy-load react-native-purchases ──────────────────────────────────────
// This prevents crashes in Expo Go (which can't run native modules).
// In a real EAS Build, the module will be available and real billing works.
let _Purchases = null;
let _LOG_LEVEL = null;

function getPurchases() {
  if (_Purchases) return _Purchases;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const rc = require('react-native-purchases');
    _Purchases = rc.default;
    _LOG_LEVEL = rc.LOG_LEVEL;
    return _Purchases;
  } catch {
    // react-native-purchases not available (Expo Go, simulator without build, web)
    return null;
  }
}

function getApiKey() {
  return Platform.OS === 'ios' ? REVENUECAT_API_KEYS.ios : REVENUECAT_API_KEYS.android;
}

function isRevenueCatReady() {
  return Boolean(getPurchases()) && Boolean(getApiKey());
}

// ─── Initialize ─────────────────────────────────────────────────────────────
// Call this once after the user authenticates (in App.js).
export function initializePurchases(userId) {
  const Purchases = getPurchases();
  const apiKey = getApiKey();

  if (!Purchases || !apiKey) {
    console.warn(
      '[Billing] Running in DEMO mode.\n' +
      '  • Set REVENUECAT_API_KEYS in billingConfig.js for real billing.\n' +
      '  • Run via EAS Build (not Expo Go) for native billing to work.'
    );
    return;
  }

  try {
    Purchases.setLogLevel(__DEV__ ? _LOG_LEVEL.DEBUG : _LOG_LEVEL.ERROR);
    Purchases.configure({ apiKey, appUserID: userId || null });
  } catch (error) {
    console.warn('[Billing] RevenueCat init failed:', error.message);
  }
}

// ─── Get products to show on the Paywall ────────────────────────────────────
// Returns RevenueCat Package objects (real prices from store) when configured,
// or static fallback products for demo / Expo Go.
export async function getAvailableProducts() {
  if (!isRevenueCatReady()) {
    return Object.values(BILLING_PRODUCTS).map((p) => ({ ...p, isDemo: true }));
  }

  const Purchases = getPurchases();
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current && offerings.current.availablePackages.length > 0) {
      return offerings.current.availablePackages; // RevenueCat Package objects
    }
    // No offerings configured in RevenueCat dashboard yet — use static fallback
    return Object.values(BILLING_PRODUCTS).map((p) => ({ ...p, isDemo: true }));
  } catch (error) {
    console.warn('[Billing] Could not fetch offerings:', error.message);
    return Object.values(BILLING_PRODUCTS).map((p) => ({ ...p, isDemo: true }));
  }
}

// ─── Purchase a subscription ─────────────────────────────────────────────────
// rcPackage: the RevenueCat Package object from getAvailableProducts().
//            Pass null in demo mode (falls through to activateDemoPremium).
export async function purchaseSubscription({ studentId, plan = 'single', rcPackage = null }) {
  // Demo mode: activate immediately, no real payment
  if (!isRevenueCatReady()) {
    await activateDemoPremium(studentId, plan);
    return { success: true, mode: 'demo' };
  }

  if (!rcPackage) {
    throw new Error('اختر خطة للمتابعة.');
  }

  const Purchases = getPurchases();

  // Real purchase through App Store / Play Store
  const { customerInfo } = await Purchases.purchasePackage(rcPackage);
  const isActive = Boolean(customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]);

  if (isActive) {
    // Sync the active entitlement to Firestore so the app knows this user is premium
    const pkgPlan = rcPackage.product?.identifier?.includes('family') ? 'family' : 'single';
    await activateDemoPremium(studentId, pkgPlan);
    return { success: true, mode: 'revenuecat', customerInfo };
  }

  throw new Error('اكتمل الشراء لكن لم يُفعَّل الاشتراك بعد. جرب استعادة الاشتراك.');
}

// ─── Restore purchases (required by App Store / Play Store guidelines) ───────
export async function restorePurchases(studentId) {
  if (!isRevenueCatReady()) {
    return { restored: false, mode: 'demo', message: 'وضع تجريبي — لا يوجد اشتراك لاستعادته.' };
  }

  const Purchases = getPurchases();
  const customerInfo = await Purchases.restorePurchases();
  const isActive = Boolean(customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]);

  if (isActive && studentId) {
    await activateDemoPremium(studentId, 'single');
  }

  return { restored: isActive, mode: 'revenuecat', customerInfo };
}

// ─── Check current entitlement (call on app resume) ─────────────────────────
export async function checkCurrentEntitlement() {
  if (!isRevenueCatReady()) return false;

  const Purchases = getPurchases();
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return Boolean(customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]);
  } catch {
    return false;
  }
}
