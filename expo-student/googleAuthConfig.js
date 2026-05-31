// ─── Google OAuth Credentials ───────────────────────────────────────────────
// Register your application in the Google Cloud Console (https://console.cloud.google.com)
// Create OAuth 2.0 Client IDs for each platform:
//
// 1. Web Client ID: Required for Firebase Auth to authenticate the Google credential.
// 2. Android Client ID: Create an Android credential using your app's package name (e.g., com.saudiedu.student)
//    and your SHA-1 certificate fingerprint.
// 3. iOS Client ID: Create an iOS credential using your app's iOS Bundle ID (e.g., com.saudiedu.student).
// 4. Expo Client ID: Required for Expo Go testing.
//
// After registering, paste the client IDs below:
export const GOOGLE_AUTH_CONFIG = {
  expoClientId: '',      // e.g. '1234567890-expo-id.apps.googleusercontent.com'
  iosClientId: '',       // e.g. '1234567890-ios-id.apps.googleusercontent.com'
  androidClientId: '',   // e.g. '1234567890-android-id.apps.googleusercontent.com'
  webClientId: '',       // e.g. '1234567890-web-id.apps.googleusercontent.com'
};

export function hasGoogleOAuthConfigured() {
  return Boolean(
    GOOGLE_AUTH_CONFIG.expoClientId ||
    GOOGLE_AUTH_CONFIG.iosClientId ||
    GOOGLE_AUTH_CONFIG.androidClientId ||
    GOOGLE_AUTH_CONFIG.webClientId
  );
}

