import React, { useState } from 'react';
import { Platform, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import { OAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './firebase';
import { signInAsGuest } from './useStudentAuth';

export default function AppleLoginButton({ onLogin }) {
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
    <TouchableOpacity style={styles.appleBtn} onPress={handleAppleSignIn} disabled={busy}>
      <Ionicons name="logo-apple" size={24} color="#FFFFFF" />
      <Text style={styles.appleBtnText}>{busy ? 'جاري الدخول...' : 'تسجيل الدخول باستخدام Apple'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  appleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    paddingVertical: 14,
    borderRadius: 12,
  },
  appleBtnText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 10,
    marginRight: 10,
  }
});
