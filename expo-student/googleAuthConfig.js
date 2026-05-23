export const GOOGLE_AUTH_CONFIG = {
  expoClientId: '',
  iosClientId: '',
  androidClientId: '',
  webClientId: '',
};

export function hasGoogleOAuthConfigured() {
  return Boolean(
    GOOGLE_AUTH_CONFIG.expoClientId ||
    GOOGLE_AUTH_CONFIG.iosClientId ||
    GOOGLE_AUTH_CONFIG.androidClientId ||
    GOOGLE_AUTH_CONFIG.webClientId
  );
}
