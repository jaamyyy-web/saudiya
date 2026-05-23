import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { completeGoogleSignIn, signInAsGuest, useGoogleSignInRequest } from './useStudentAuth';
import { hasGoogleOAuthConfigured } from './googleAuthConfig';

export default function GoogleLoginButtons({ onLogin, styles }) {
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

  async function handleGuest() {
    await signInAsGuest();
    onLogin?.();
  }

  return (
    <View>
      <TouchableOpacity style={styles.social} onPress={handleGoogle} disabled={busy}>
        <Ionicons name="logo-google" size={21} />
        <Text style={styles.socialText}>{busy ? 'جاري الدخول...' : 'الدخول بواسطة Google'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.social} onPress={handleGuest} disabled={busy}>
        <Ionicons name="person-circle" size={21} />
        <Text style={styles.socialText}>دخول تجريبي</Text>
      </TouchableOpacity>
    </View>
  );
}
