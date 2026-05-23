import { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, onAuthStateChanged, signInAnonymously, signInWithCredential } from 'firebase/auth';
import { auth } from './firebase';
import { GOOGLE_AUTH_CONFIG, hasGoogleOAuthConfigured } from './googleAuthConfig';

WebBrowser.maybeCompleteAuthSession();

async function ensureGuestUser() {
  if (auth.currentUser) return auth.currentUser;

  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    // Anonymous auth may be disabled during MVP testing.
    // Keep the app usable with local demo student fallback.
    return null;
  }
}

async function signInWithProviderPlaceholder() {
  return ensureGuestUser();
}

export function useGoogleSignInRequest() {
  return Google.useAuthRequest({
    expoClientId: GOOGLE_AUTH_CONFIG.expoClientId || undefined,
    iosClientId: GOOGLE_AUTH_CONFIG.iosClientId || undefined,
    androidClientId: GOOGLE_AUTH_CONFIG.androidClientId || undefined,
    webClientId: GOOGLE_AUTH_CONFIG.webClientId || undefined,
  });
}

export async function completeGoogleSignIn(authentication) {
  if (!authentication?.idToken && !authentication?.accessToken) {
    return ensureGuestUser();
  }

  const credential = GoogleAuthProvider.credential(authentication.idToken || null, authentication.accessToken || null);
  const result = await signInWithCredential(auth, credential);
  return result.user;
}

export async function signInWithGoogle() {
  if (!hasGoogleOAuthConfigured()) return signInWithProviderPlaceholder();
  return ensureGuestUser();
}

export async function signInWithApple() {
  return signInWithProviderPlaceholder();
}

export async function signInAsGuest() {
  return ensureGuestUser();
}

export function useStudentAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (nextUser) {
        setUser(nextUser);
        setLoading(false);
        return;
      }

      const guestUser = await ensureGuestUser();
      setUser(guestUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    studentId: user?.uid || 'demo-student',
    isGuest: user?.isAnonymous !== false,
  };
}
