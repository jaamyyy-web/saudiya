import React, { useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { I18nManager, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

I18nManager.allowRTL(true);

const packs = [
  { id: '1', title: 'الإيمان والأخلاق', subject: 'الدراسات الإسلامية', grade: 'الصف السابع', progress: 72, locked: false },
  { id: '2', title: 'المعادلات الخطية', subject: 'الرياضيات', grade: 'الصف الثامن', progress: 35, locked: false },
  { id: '3', title: 'التفاعلات الكيميائية', subject: 'العلوم', grade: 'الصف التاسع', progress: 0, locked: true },
];

const tabs = [
  { id: 'home', label: 'الرئيسية', icon: 'home' },
  { id: 'packs', label: 'الحزم', icon: 'book' },
  { id: 'quiz', label: 'اختبار', icon: 'help-circle' },
  { id: 'rank', label: 'الترتيب', icon: 'trophy' },
  { id: 'profile', label: 'حسابي', icon: 'person' },
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState('home');

  if (!started) return <Splash onStart={() => setStarted(true)} />;
  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <StatusBar style="dark" />
        <View style={styles.appShell}>
          <Header />
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {tab === 'home' && <Home setTab={setTab} />}
            {tab === 'packs' && <Packs />}
            {tab === 'quiz' && <Quiz />}
            {tab === 'rank' && <Leaderboard />}
            {tab === 'profile' && <Profile />}
          </ScrollView>
          <BottomNav tab={tab} setTab={setTab} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function Splash({ onStart }) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <View style={styles.splash}>
          <View style={styles.logo}><Text style={styles.logoText}>س</Text></View>
          <Text style={styles.splashTitle}>Saudi Edu</Text>
          <Text style={styles.splashSub}>تعلم بذكاء، اختبر نفسك، وتقدم كل يوم</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={onStart}><Text style={styles.primaryText}>ابدأ الآن</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function Login({ onLogin }) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <View style={styles.loginPage}>
          <Text style={styles.pageTitle}>مرحباً بك</Text>
          <Text style={styles.muted}>سجل الدخول لمتابعة التعلم</Text>
          <View style={styles.loginCard}>
            <TouchableOpacity style={styles.socialBtn} onPress={onLogin}><Ionicons name="logo-google" size={20} /><Text style={styles.socialText}>الدخول بواسطة Google</Text></TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} onPress={onLogin}><Ionicons name="logo-apple" size={22} /><Text style={styles.socialText}>الدخول بواسطة Apple</Text></TouchableOpacity>
            <TouchableOpacity style={styles.primaryBtn} onPress={onLogin}><Text style={styles.primaryText}>دخول تجريبي</Text></TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function Header() {
  return <View style={styles.header}><View><Text style={styles.smallGreen}>مرحباً أحمد</Text><Text style={styles.headerTitle}>استمر في التعلم</Text></View><View style={styles.coinPill}><Ionicons name="diamond" size={16} color="#d97706" /><Text style={styles.coinText}>1250</Text></View></View>;
}

function Home({ setTab }) {
  return <View><View style={styles.hero}><Text style={styles.heroTitle}>أكمل رحلتك التعليمية اليوم</Text><Text style={styles.heroText}>لديك 5 اختبارات مجانية متبقية اليوم</Text><TouchableOpacity style={styles.whiteBtn} onPress={() => setTab('quiz')}><Text style={styles.whiteBtnText}>ابدأ اختبار سريع</Text></TouchableOpacity></View><SectionTitle title="أكمل من حيث توقفت" /><PackCard pack={packs[0]} /><SectionTitle title="المواد المقترحة" /><View style={styles.subjectGrid}>{['الرياضيات','العلوم','الإسلامية','اللغة العربية'].map((s) => <View style={styles.subjectChip} key={s}><Ionicons name="school" size={18} color="#047857" /><Text style={styles.subjectText}>{s}</Text></View>)}</View></View>;
}

function Packs() {
  return <View><SectionTitle title="حزم التعلم" />{packs.map((pack) => <PackCard key={pack.id} pack={pack} />)}</View>;
}

function PackCard({ pack }) {
  return <View style={styles.packCard}><View style={styles.packTop}><View style={styles.packIcon}><Ionicons name={pack.locked ? 'lock-closed' : 'book'} size={20} color="#047857" /></View><View style={{ flex: 1 }}><Text style={styles.packTitle}>{pack.title}</Text><Text style={styles.packMeta}>{pack.grade} • {pack.subject}</Text></View></View><View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${pack.progress}%` }]} /></View><Text style={styles.progressText}>{pack.locked ? 'مغلق - يحتاج Premium' : `اكتمل ${pack.progress}%`}</Text></View>;
}

function Quiz() {
  return <View><SectionTitle title="اختبار سريع" /><View style={styles.quizCard}><Text style={styles.quizType}>MCQ</Text><Text style={styles.quizQuestion}>ما معنى الأمانة في الإسلام؟</Text>{['حفظ الحقوق', 'إضاعة الوقت', 'عدم مساعدة الناس', 'ترك الصلاة'].map((o, i) => <TouchableOpacity key={o} style={[styles.answer, i === 0 && styles.answerCorrect]}><Text style={styles.answerText}>{o}</Text></TouchableOpacity>)}<View style={styles.explainBox}><Text style={styles.explainTitle}>الشرح</Text><Text style={styles.explainText}>الأمانة تعني حفظ الحقوق والقيام بالمسؤولية بصدق.</Text></View></View></View>;
}

function Leaderboard() {
  return <View><SectionTitle title="لوحة الترتيب" />{['سارة محمد','أحمد علي','نورة صالح','فهد خالد'].map((name, i) => <View style={styles.rankRow} key={name}><Text style={styles.rankNo}>{i + 1}</Text><Text style={styles.rankName}>{name}</Text><Text style={styles.rankXp}>{980 - i * 120} XP</Text></View>)}</View>;
}

function Profile() {
  return <View><SectionTitle title="حسابي" /><View style={styles.profileCard}><View style={styles.bigAvatar}><Text style={styles.bigAvatarText}>أ</Text></View><Text style={styles.profileName}>أحمد علي</Text><Text style={styles.muted}>الصف السابع • الخطة المجانية</Text><View style={styles.profileStats}><Stat label="XP" value="1250" /><Stat label="Streak" value="8" /><Stat label="Progress" value="72%" /></View></View></View>;
}

function Stat({ label, value }) { return <View style={styles.statMini}><Text style={styles.statMiniValue}>{value}</Text><Text style={styles.statMiniLabel}>{label}</Text></View>; }
function SectionTitle({ title }) { return <Text style={styles.sectionTitle}>{title}</Text>; }
function BottomNav({ tab, setTab }) { return <View style={styles.bottomNav}>{tabs.map((item) => <TouchableOpacity key={item.id} style={styles.tab} onPress={() => setTab(item.id)}><Ionicons name={item.icon} size={22} color={tab === item.id ? '#047857' : '#94a3b8'} /><Text style={[styles.tabText, tab === item.id && styles.tabActive]}>{item.label}</Text></TouchableOpacity>)}</View>; }

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fb' },
  appShell: { flex: 1, backgroundColor: '#f5f7fb' },
  content: { padding: 18, paddingBottom: 110 },
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, backgroundColor: '#ecfdf5' },
  logo: { width: 92, height: 92, borderRadius: 30, backgroundColor: '#047857', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  logoText: { color: 'white', fontSize: 44, fontWeight: '900' },
  splashTitle: { fontSize: 38, fontWeight: '900', color: '#172033' },
  splashSub: { color: '#64748b', textAlign: 'center', lineHeight: 24, marginVertical: 14, fontWeight: '700' },
  primaryBtn: { height: 52, borderRadius: 18, backgroundColor: '#047857', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22, marginTop: 12 },
  primaryText: { color: 'white', fontWeight: '900', fontSize: 16 },
  loginPage: { flex: 1, justifyContent: 'center', padding: 22 },
  pageTitle: { fontSize: 34, fontWeight: '900', color: '#172033', textAlign: 'right' },
  muted: { color: '#64748b', fontWeight: '700', marginTop: 6, textAlign: 'center' },
  loginCard: { backgroundColor: 'white', borderRadius: 28, padding: 18, marginTop: 24, gap: 12 },
  socialBtn: { height: 52, borderRadius: 18, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 },
  socialText: { fontWeight: '900', color: '#172033' },
  header: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  smallGreen: { color: '#047857', fontWeight: '900', textAlign: 'right' },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#172033' },
  coinPill: { flexDirection: 'row', gap: 6, alignItems: 'center', backgroundColor: '#fef3c7', paddingHorizontal: 12, height: 38, borderRadius: 19 },
  coinText: { color: '#92400e', fontWeight: '900' },
  hero: { backgroundColor: '#047857', borderRadius: 30, padding: 22, marginBottom: 18 },
  heroTitle: { color: 'white', fontSize: 28, fontWeight: '900', textAlign: 'right', lineHeight: 36 },
  heroText: { color: '#ccfbf1', fontWeight: '800', marginVertical: 10, textAlign: 'right' },
  whiteBtn: { backgroundColor: 'white', borderRadius: 16, height: 46, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  whiteBtnText: { color: '#047857', fontWeight: '900' },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#172033', marginVertical: 12, textAlign: 'right' },
  packCard: { backgroundColor: 'white', borderRadius: 24, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  packTop: { flexDirection: 'row-reverse', gap: 12, alignItems: 'center' },
  packIcon: { width: 44, height: 44, borderRadius: 16, backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center' },
  packTitle: { fontSize: 17, fontWeight: '900', color: '#172033', textAlign: 'right' },
  packMeta: { color: '#64748b', fontWeight: '700', marginTop: 4, textAlign: 'right' },
  progressTrack: { height: 10, backgroundColor: '#e2e8f0', borderRadius: 999, overflow: 'hidden', marginTop: 14 },
  progressFill: { height: '100%', backgroundColor: '#047857' },
  progressText: { color: '#64748b', fontSize: 12, fontWeight: '800', marginTop: 8, textAlign: 'right' },
  subjectGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  subjectChip: { backgroundColor: 'white', borderRadius: 18, padding: 14, minWidth: '47%', flexDirection: 'row-reverse', gap: 8, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  subjectText: { fontWeight: '900', color: '#172033' },
  quizCard: { backgroundColor: 'white', borderRadius: 28, padding: 18, borderWidth: 1, borderColor: '#e2e8f0' },
  quizType: { color: '#047857', fontWeight: '900', textAlign: 'right' },
  quizQuestion: { fontSize: 22, fontWeight: '900', color: '#172033', marginVertical: 12, textAlign: 'right', lineHeight: 30 },
  answer: { padding: 14, borderRadius: 16, backgroundColor: '#f8fafc', marginBottom: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  answerCorrect: { backgroundColor: '#dcfce7', borderColor: '#bbf7d0' },
  answerText: { textAlign: 'right', fontWeight: '800', color: '#172033' },
  explainBox: { padding: 14, borderRadius: 18, backgroundColor: '#eef2ff', marginTop: 8 },
  explainTitle: { fontWeight: '900', color: '#3730a3', textAlign: 'right' },
  explainText: { color: '#3730a3', textAlign: 'right', lineHeight: 22, marginTop: 6, fontWeight: '700' },
  rankRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12, backgroundColor: 'white', borderRadius: 20, padding: 16, marginBottom: 10 },
  rankNo: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#fef3c7', textAlign: 'center', lineHeight: 34, fontWeight: '900', color: '#92400e' },
  rankName: { flex: 1, textAlign: 'right', fontWeight: '900', color: '#172033' },
  rankXp: { color: '#047857', fontWeight: '900' },
  profileCard: { alignItems: 'center', backgroundColor: 'white', borderRadius: 28, padding: 22, borderWidth: 1, borderColor: '#e2e8f0' },
  bigAvatar: { width: 86, height: 86, borderRadius: 30, backgroundColor: '#047857', alignItems: 'center', justifyContent: 'center' },
  bigAvatarText: { color: 'white', fontSize: 36, fontWeight: '900' },
  profileName: { fontSize: 24, fontWeight: '900', marginTop: 12, color: '#172033' },
  profileStats: { flexDirection: 'row', gap: 10, marginTop: 18 },
  statMini: { backgroundColor: '#f8fafc', borderRadius: 18, padding: 14, minWidth: 82, alignItems: 'center' },
  statMiniValue: { fontSize: 18, fontWeight: '900', color: '#047857' },
  statMiniLabel: { color: '#64748b', fontSize: 12, fontWeight: '800' },
  bottomNav: { position: 'absolute', left: 14, right: 14, bottom: 16, height: 74, borderRadius: 26, backgroundColor: 'white', flexDirection: 'row-reverse', justifyContent: 'space-around', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  tab: { alignItems: 'center', gap: 4 },
  tabText: { fontSize: 11, color: '#94a3b8', fontWeight: '800' },
  tabActive: { color: '#047857' },
});
