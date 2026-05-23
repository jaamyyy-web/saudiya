import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth } from './firebase';

async function signInWithProviderPlaceholder(providerName) {
  // Real Google/Apple native provider setup needs Expo OAuth client IDs and store configuration.
  // Until those keys are added, keep the app usable by preserving anonymous Firebase identity.
  console.warn(`${providerName} sign-in is not configured yet. Using anonymous Firebase identity.`);
  if (auth.currentUser) return auth.currentUser;
  const result = await signInAnonymously(auth);
  return result.user;
}

export async function signInWithGoogle() {
  return signInWithProviderPlaceholder('Google');
}

export async function signInWithApple() {
  return signInWithProviderPlaceholder('Apple');
}

export async function signInAsGuest() {
  if (auth.currentUser) return auth.currentUser;
  const result = await signInAnonymously(auth);
  return result.user;
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
