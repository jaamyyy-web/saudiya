import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth } from './firebase';

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
  };
}
