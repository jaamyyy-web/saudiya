import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import GoogleLoginButtons from './GoogleLoginButtons';
import AppleLoginButton from './AppleLoginButton';
import { signInAsGuest } from './useStudentAuth';

export default function LoginScreenV2({ onLogin }) {
  const [busy, setBusy] = useState(false);

  async function handleGuest() {
    setBusy(true);
    await signInAsGuest();
    onLogin?.();
    setBusy(false);
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          
          {/* Top Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoIconContainer}>
              <Ionicons name="book" size={45} color="#134E4A" />
              <View style={styles.logoStar}>
                <Ionicons name="star" size={14} color="#D97706" />
              </View>
            </View>
            <Text style={styles.brandTitle}>منصة العلم</Text>
            <Text style={styles.brandSubtitle}>تعلم يرتقي بك</Text>
          </View>

          {/* Main Titles */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>بوابة الطلاب الذكية</Text>
            <Text style={styles.mainSubtitle}>منصتك التعليمية للوصول إلى الدروس والمهام وتتبع تطورك الأكاديمي</Text>
          </View>

          {/* Badges */}
          <View style={styles.badgesRow}>
            <View style={styles.badge}>
               <Ionicons name="shield-checkmark" size={14} color="#134E4A" />
               <Text style={styles.badgeText}>آمن وموثوق</Text>
            </View>
            <View style={styles.badge}>
               <Ionicons name="ribbon" size={14} color="#D97706" />
               <Text style={styles.badgeText}>جودة تعليمية</Text>
            </View>
            <View style={styles.badge}>
               <Ionicons name="lock-closed" size={14} color="#134E4A" />
               <Text style={styles.badgeText}>خصوصيتك أولاً</Text>
            </View>
          </View>

          {/* Login Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="diamond" size={10} color="#D97706" />
              <Text style={styles.cardTitle}>سجل دخولك للمتابعة</Text>
              <Ionicons name="diamond" size={10} color="#D97706" />
            </View>
            
            <GoogleLoginButtons onLogin={onLogin} />
            <AppleLoginButton onLogin={onLogin} />
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>أو</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Admin / Guest Portal */}
          <TouchableOpacity style={styles.guestButton} onPress={handleGuest} disabled={busy}>
            <Ionicons name="settings-outline" size={24} color="#134E4A" />
            <Text style={styles.guestText}>{busy ? 'جاري الدخول...' : 'دخول تجريبي'}</Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAF8F5' },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Logo
  logoSection: { alignItems: 'center', marginBottom: 30 },
  logoIconContainer: {
    width: 70, height: 70, 
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 8
  },
  logoStar: { position: 'absolute', top: 12, right: 24 },
  brandTitle: { fontSize: 24, fontWeight: '900', color: '#134E4A', marginBottom: 4 },
  brandSubtitle: { fontSize: 14, fontWeight: 'bold', color: '#D97706' },
  
  // Titles
  titleSection: { alignItems: 'center', marginBottom: 24 },
  mainTitle: { fontSize: 28, fontWeight: '900', color: '#134E4A', marginBottom: 12, textAlign: 'center' },
  mainSubtitle: { fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 24, paddingHorizontal: 20 },
  
  // Badges
  badgesRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 32, flexWrap: 'wrap' },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F0EA', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, marginHorizontal: 4, marginBottom: 8 },
  badgeText: { fontSize: 11, fontWeight: 'bold', color: '#374151', marginLeft: 4 },
  
  // Card
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 24
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#134E4A', marginHorizontal: 8 },
  
  // Divider
  dividerRow: { flexDirection: 'row', alignItems: 'center', width: '60%', marginBottom: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { marginHorizontal: 12, color: '#9CA3AF', fontSize: 14, fontWeight: 'bold' },
  
  // Guest Button
  guestButton: { alignItems: 'center' },
  guestText: { fontSize: 16, fontWeight: 'bold', color: '#134E4A', textDecorationLine: 'underline', marginTop: 4 }
});
