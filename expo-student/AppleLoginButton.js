import React, { useState } from 'react';
import { Platform, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import { OAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './firebase';
import { signInAsGuest } from './useStudentAuth';

export default function AppleLoginButton({ onLogin, styles }) {
  const [busy, setBusy] = useState(false);

  async function handleAppleSignIn() {
    try {
      setBusy(true);

      if (Platform.OS !== 'ios') {
        await signInAsGuest();
        onLogin?.();
        return;
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error('Apple identity token missing');
      }

      const provider = new OAuthProvider('apple.com');
      const firebaseCredential = provider.credential({
        idToken: credential.identityToken,
      });

      await signInWithCredential(auth, firebaseCredential);
      onLogin?.();
    } catch (error) {
      console.warn('Apple sign-in failed:', error.message);
      await signInAsGuest();
      onLogin?.();
    } finally {
      setBusy(false);
    }
  }

  return (
    <TouchableOpacity style={styles.social} onPress={handleAppleSignIn} disabled={busy}>
      <Ionicons name="logo-apple" size={21} />
      <Text style={styles.socialText}>{busy ? 'جاري الدخول...' : 'الدخول بواسطة Apple'}</Text>
    </TouchableOpacity>
  );
}
