import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import GoogleLoginButtons from './GoogleLoginButtons';
import AppleLoginButton from './AppleLoginButton';

export default function LoginScreenV2({ onLogin, styles }) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <View style={styles.login}>
          <Text style={styles.title}>مرحباً بك</Text>
          <Text style={styles.muted}>سجل الدخول لمتابعة التعلم</Text>
          <View style={styles.card}>
            <GoogleLoginButtons onLogin={onLogin} styles={styles} />
            <AppleLoginButton onLogin={onLogin} styles={styles} />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
