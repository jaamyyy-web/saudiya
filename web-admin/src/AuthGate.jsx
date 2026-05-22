import React, { useEffect, useMemo, useState } from 'react';
import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { auth, db, firebaseConfigMissing, getAllowedAdminEmails, googleProvider, missingFirebaseKeys } from './firebase';

async function checkAdminAccess(user) {
  const allowedEmails = getAllowedAdminEmails();
  const email = user?.email?.toLowerCase() || '';

  if (allowedEmails.length > 0 && allowedEmails.includes(email)) {
    return true;
  }

  if (!db || !user?.uid) return false;

  const adminDoc = await getDoc(doc(db, 'admin_users', user.uid));
  if (!adminDoc.exists()) return false;

  const data = adminDoc.data();
  return data?.active === true && ['admin', 'super_admin', 'editor'].includes(data?.role);
}

export default function AuthGate({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(!firebaseConfigMissing);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const allowedAdminEmails = useMemo(() => getAllowedAdminEmails(), []);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setError('');
      setUser(currentUser);

      if (!currentUser) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const allowed = await checkAdminAccess(currentUser);
        setIsAdmin(allowed);
        if (!allowed) {
          setError('This account is not allowed to access the admin panel. Add it to VITE_ADMIN_EMAILS or admin_users collection.');
        }
      } catch (err) {
        setIsAdmin(false);
        setError(err.message || 'Unable to verify admin permission.');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  async function loginWithEmail(event) {
    event.preventDefault();
    setError('');
    if (!auth) return;

    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setError(firebaseErrorMessage(err));
    }
  }

  async function loginWithGoogle() {
    setError('');
    if (!auth) return;

    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError(firebaseErrorMessage(err));
    }
  }

  async function logout() {
    if (auth) await signOut(auth);
  }

  if (firebaseConfigMissing) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-icon warning"><Lock size={34} /></div>
          <h1>Firebase config required</h1>
          <p>Add Firebase Web App environment variables in Vercel before using the admin URL.</p>
          <div className="missing-box">
            {missingFirebaseKeys.map((key) => <code key={key}>VITE_FIREBASE_{key.toUpperCase()}</code>)}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-card small">
          <div className="auth-icon"><Sparkles size={34} /></div>
          <h1>Checking admin access...</h1>
          <p>Please wait while Firebase verifies this account.</p>
        </div>
      </div>
    );
  }

  if (user && isAdmin) {
    return children({ user, logout });
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-icon"><ShieldCheck size={34} /></div>
        <p className="eyebrow">Secure Admin URL</p>
        <h1>SAD Admin Login</h1>
        <p>Use an authorised Firebase admin account to manage the education app from PC.</p>

        {user && !isAdmin && (
          <div className="auth-error">
            Logged in as <strong>{user.email}</strong>, but this email is not authorised.
          </div>
        )}

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={loginWithEmail}>
          <label>
            <span>Email</span>
            <div className="auth-input"><Mail size={17} /><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="admin@example.com" required /></div>
          </label>
          <label>
            <span>Password</span>
            <div className="auth-input"><Lock size={17} /><input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" required /></div>
          </label>
          <button className="primary-button auth-submit" type="submit">Login with Email</button>
        </form>

        <button className="secondary-button auth-google" onClick={loginWithGoogle}>Login with Google</button>

        {allowedAdminEmails.length > 0 && (
          <div className="allowed-box">
            Allowed emails: {allowedAdminEmails.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
}

function firebaseErrorMessage(err) {
  const code = err?.code || '';
  if (code.includes('auth/invalid-credential')) return 'Invalid email or password.';
  if (code.includes('auth/popup-closed-by-user')) return 'Google login popup was closed.';
  if (code.includes('auth/unauthorized-domain')) return 'This domain is not added in Firebase Authentication authorised domains.';
  return err?.message || 'Login failed. Please try again.';
}
