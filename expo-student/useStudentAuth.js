import { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, onAuthStateChanged, signInAnonymously, signInWithCredential } from 'firebase/auth';
import { auth } from './firebase';
import { GOOGLE_AUTH_CONFIG, hasGoogleOAuthConfigured } from './googleAuthConfig';

WebBrowser.maybeCompleteAuthSession();

async function ensureGuestUser() {
  if (auth.currentUser) return auth.currentUser;
  const result = await signInAnonymously(auth);
  return result.user;
}

async function signInWithProviderPlaceholder(providerName) {
  console.warn(`${providerName} sign-in is not configured yet. Using anonymous Firebase identity.`);
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
  if (!hasGoogleOAuthConfigured()) return signInWithProviderPlaceholder('Google');
  return ensureGuestUser();
}

export async function signInWithApple() {
  return signInWithProviderPlaceholder('Apple');
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

      try {
        const result = await signInAnonymously(auth);
        setUser(result.user);
      } catch (error) {
        console.error('Anonymous auth failed', error);
      } finally {
        setLoading(false);
      }
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
