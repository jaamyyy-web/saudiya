import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { completeGoogleSignIn, signInAsGuest, useGoogleSignInRequest } from './useStudentAuth';
import { hasGoogleOAuthConfigured } from './googleAuthConfig';

export default function GoogleLoginButtons({ onLogin }) {
  const [request, response, promptAsync] = useGoogleSignInRequest();
  const [busy, setBusy] = useState(false);
  const configured = hasGoogleOAuthConfigured();

  useEffect(() => {
    async function finish() {
      if (response?.type !== 'success') return;
      try {
        setBusy(true);
        await completeGoogleSignIn(response.authentication);
        onLogin?.();
      } catch (error) {
        console.warn('Google sign-in failed:', error.message);
      } finally {
        setBusy(false);
      }
    }
    finish();
  }, [response, onLogin]);

  async function handleGoogle() {
    if (!configured || !request) {
      await signInAsGuest();
      onLogin?.();
      return;
    }
    await promptAsync();
  }

  return (
    <TouchableOpacity style={styles.googleBtn} onPress={handleGoogle} disabled={busy}>
      <Ionicons name="logo-google" size={24} color="#DB4437" />
      <Text style={styles.googleBtnText}>{busy ? 'جاري الدخول...' : 'تسجيل الدخول باستخدام Google'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  googleBtnText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#374151',
    marginLeft: 10,
    marginRight: 10,
  }
});
