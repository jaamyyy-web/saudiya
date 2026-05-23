import React, { useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { I18nManager, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

I18nManager.allowRTL(true);

const subjects = [
  { id: 'islamic', ar: 'الدراسات الإسلامية', icon: 'moon', score: 86 },
  { id: 'arabic', ar: 'اللغة العربية', icon: 'language', score: 74 },
  { id: 'english', ar: 'اللغة الإنجليزية', icon: 'text', score: 61 },
  { id: 'math', ar: 'الرياضيات', icon: 'calculator', score: 52 },
  { id: 'science', ar: 'العلوم', icon: 'flask', score: 58 },
  { id: 'social', ar: 'الدراسات الاجتماعية', icon: 'earth', score: 79 },
  { id: 'digital', ar: 'المهارات الرقمية', icon: 'laptop', score: 68 },
  { id: 'life', ar: 'المهارات الحياتية والأسرية', icon: 'home', score: 72 },
  { id: 'art', ar: 'التربية الفنية', icon: 'color-palette', score: 91 },
  { id: 'health', ar: 'التربية البدنية والصحية', icon: 'fitness', score: 83 },
  { id: 'thinking', ar: 'التفكير الناقد', icon: 'bulb', score: 49 },
];

const grades = ['الصف السابع', 'الصف الثامن', 'الصف التاسع'];
const packs = grades.flatMap((grade, gradeIndex) => subjects.map((subject, subjectIndex) => ({
  id: `${gradeIndex}-${subject.id}`,
  grade,
  subject: subject.ar,
  subjectId: subject.id,
  title: `${subject.ar} - حزمة التعلم ${gradeIndex + 1}`,
  progress: subjectIndex % 4 === 0 ? 0 : 20 + ((gradeIndex + subjectIndex) * 11) % 75,
  locked: subjectIndex > 5 && gradeIndex > 0,
  xp: 120,
})));

const tabs = [
  { id: 'home', label: 'الرئيسية', icon: 'home' },
  { id: 'packs', label: 'الحزم', icon: 'book' },
  { id: 'challenge', label: 'التحدي', icon: 'flash' },
  { id: 'analytics', label: 'التحليلات', icon: 'stats-chart' },
  { id: 'profile', label: 'حسابي', icon: 'person' },
];

const sampleMcq = {
  question: 'ما الفكرة الأساسية في هذا الدرس؟',
  options: ['فهم المفهوم وتطبيقه', 'حفظ الكلمات فقط', 'تخطي التدريب', 'عدم المراجعة'],
  answer: 0,
  explanation: 'الفهم الصحيح يعني معرفة المعنى ثم استخدامه في سؤال جديد.',
};

export default function App() {
  const [started, setStarted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState('home');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedPack, setSelectedPack] = useState(null);

  if (!started) return <Splash onStart={() => setStarted(true)} />;
  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  const openPacks = (subjectId = null) => {
    setSelectedSubject(subjectId);
    setSelectedPack(null);
    setTab('packs');
  };

  const openTab = (next) => {
    setSelectedPack(null);
    setTab(next);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <StatusBar style="dark" />
        <View style={styles.appShell}>
          <Header />
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {tab === 'home' && <Home openPacks={openPacks} openTab={openTab} />}
            {tab === 'packs' && <Packs selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject} selectedPack={selectedPack} setSelectedPack={setSelectedPack} />}
            {tab === 'challenge' && <DailyChallenge />}
            {tab === 'analytics' && <Analytics openPacks={openPacks} />}
            {tab === 'profile' && <Profile />}
          </ScrollView>
          <BottomNav tab={tab} setTab={openTab} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function Splash({ onStart }) {
  return <SafeAreaProvider><SafeAreaView style={styles.safe}><View style={styles.splash}><View style={styles.logo}><Text style={styles.logoText}>س</Text></View><Text style={styles.splashTitle}>Saudi Edu</Text><Text style={styles.splashSub}>تعلم بذكاء، اختبر نفسك، وتقدم كل يوم</Text><TouchableOpacity style={styles.primaryBtn} onPress={onStart}><Text style={styles.primaryText}>ابدأ الآن</Text></TouchableOpacity></View></SafeAreaView></SafeAreaProvider>;
}

function Login({ onLogin }) {
  return <SafeAreaProvider><SafeAreaView style={styles.safe}><View style={styles.loginPage}><Text style={styles.pageTitle}>مرحباً بك</Text><Text style={styles.muted}>سجل الدخول لمتابعة التعلم</Text><View style={styles.loginCard}><TouchableOpacity style={styles.socialBtn} onPress={onLogin}><Ionicons name="logo-google" size={20} /><Text style={styles.socialText}>الدخول بواسطة Google</Text></TouchableOpacity><TouchableOpacity style={styles.socialBtn} onPress={onLogin}><Ionicons name="logo-apple" size={22} /><Text style={styles.socialText}>الدخول بواسطة Apple</Text></TouchableOpacity><TouchableOpacity style={styles.primaryBtn} onPress={onLogin}><Text style={styles.primaryText}>دخول تجريبي</Text></TouchableOpacity></View></View></SafeAreaView></SafeAreaProvider>;
}

function Header() {
  return <View style={styles.header}><View><Text style={styles.smallGreen}>مرحباً أحمد</Text><Text style={styles.headerTitle}>استمر في التعلم</Text></View><View style={styles.coinPill}><Ionicons name="diamond" size={16} color="#d97706" /><Text style={styles.coinText}>1250</Text></View></View>;
}

function Home({ openPacks, openTab }) {
  return <View><View style={styles.hero}><Text style={styles.heroTitle}>أكمل رحلتك التعليمية اليوم</Text><Text style={styles.heroText}>الذكاء التعليمي يقترح لك مراجعة الرياضيات والعلوم اليوم</Text><TouchableOpacity style={styles.whiteBtn} onPress={() => openTab('challenge')}><Text style={styles.whiteBtnText}>ابدأ تحدي اليوم</Text></TouchableOpacity></View><View style={styles.snapshotRow}><MiniStat title="الدقة" value="68%" /><MiniStat title="الحزم" value="12" /><MiniStat title="السلسلة" value="8" /></View><SectionTitle title="أكمل من حيث توقفت" /><PackCard pack={packs[0]} onPress={() => openPacks(packs[0].subjectId)} /><SectionTitle title="اقتراحات ذكية" /><AiTip text="راجع الرياضيات 10 دقائق اليوم؛ نتيجتك أقل من 60%." /><AiTip text="أكمل حزمة العلوم لتحصل على +50 XP." /><SectionTitle title="كل المواد" /><SubjectGrid onPress={openPacks} /></View>;
}

function MiniStat({ title, value }) { return <View style={styles.miniStat}><Text style={styles.miniValue}>{value}</Text><Text style={styles.miniLabel}>{title}</Text></View>; }
function AiTip({ text }) { return <View style={styles.tipCard}><Ionicons name="sparkles" size={19} color="#4338ca" /><Text style={styles.tipText}>{text}</Text></View>; }
function SectionTitle({ title }) { return <Text style={styles.sectionTitle}>{title}</Text>; }

function SubjectGrid({ onPress }) {
  return <View style={styles.subjectGrid}>{subjects.map((subject) => <TouchableOpacity key={subject.id} style={styles.subjectChip} onPress={() => onPress(subject.id)}><Ionicons name={subject.icon} size={18} color="#047857" /><Text style={styles.subjectText}>{subject.ar}</Text></TouchableOpacity>)}</View>;
}

function Packs({ selectedSubject, setSelectedSubject, selectedPack, setSelectedPack }) {
  const filtered = useMemo(() => selectedSubject ? packs.filter((pack) => pack.subjectId === selectedSubject) : packs, [selectedSubject]);
  if (selectedPack) return <LearningPackFlow pack={selectedPack} goBack={() => setSelectedPack(null)} />;
  return <View><SectionTitle title="حزم التعلم" /><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>{[{ id: null, ar: 'الكل' }, ...subjects].map((item) => <TouchableOpacity key={item.id || 'all'} style={[styles.filterChip, selectedSubject === item.id && styles.filterActive]} onPress={() => setSelectedSubject(item.id)}><Text style={[styles.filterText, selectedSubject === item.id && styles.filterTextActive]}>{item.ar}</Text></TouchableOpacity>)}</ScrollView>{filtered.map((pack) => <PackCard key={pack.id} pack={pack} onPress={() => setSelectedPack(pack)} />)}</View>;
}

function PackCard({ pack, onPress }) {
  return <TouchableOpacity style={styles.packCard} onPress={onPress}><View style={styles.packTop}><View style={styles.packIcon}><Ionicons name={pack.locked ? 'lock-closed' : 'book'} size={20} color="#047857" /></View><View style={{ flex: 1 }}><Text style={styles.packTitle}>{pack.title}</Text><Text style={styles.packMeta}>{pack.grade} • {pack.subject}</Text></View></View><View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${pack.progress}%` }]} /></View><Text style={styles.progressText}>{pack.locked ? 'مغلق - يحتاج Premium' : `اكتمل ${pack.progress}%`}</Text></TouchableOpacity>;
}

const flowSteps = [
  { id: 'summary', label: 'الملخص', icon: 'document-text' },
  { id: 'mcq', label: 'MCQ', icon: 'checkmark-circle' },
  { id: 'fib', label: 'املأ الفراغ', icon: 'create' },
  { id: 'tf', label: 'صح / خطأ', icon: 'help-circle' },
  { id: 'hoq', label: 'أسئلة تفكير', icon: 'bulb' },
];

function LearningPackFlow({ pack, goBack }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [completed, setCompleted] = useState(false);
  const step = flowSteps[stepIndex];
  const percent = completed ? 100 : Math.round((stepIndex / flowSteps.length) * 100);

  const next = () => {
    setSelected(null);
    if (stepIndex >= flowSteps.length - 1) setCompleted(true);
    else setStepIndex(stepIndex + 1);
  };

  if (pack.locked) {
    return <View><TouchableOpacity style={styles.backBtn} onPress={goBack}><Ionicons name="arrow-forward" size={18} color="#047857" /><Text style={styles.backText}>رجوع</Text></TouchableOpacity><View style={styles.lockedCard}><Ionicons name="lock-closed" size={52} color="#d97706" /><Text style={styles.detailTitle}>هذه الحزمة Premium</Text><Text style={styles.centerText}>افتح الخطة المدفوعة للوصول إلى الملخص والاختبارات الكاملة.</Text><TouchableOpacity style={styles.premiumBtn}><Text style={styles.primaryText}>افتح Premium</Text></TouchableOpacity></View></View>;
  }

  if (completed) {
    return <Completion pack={pack} goBack={goBack} restart={() => { setCompleted(false); setStepIndex(0); }} />;
  }

  return <View><TouchableOpacity style={styles.backBtn} onPress={goBack}><Ionicons name="arrow-forward" size={18} color="#047857" /><Text style={styles.backText}>رجوع</Text></TouchableOpacity><View style={styles.detailCard}><View style={styles.packIconBig}><Ionicons name="book" size={32} color="#047857" /></View><Text style={styles.detailTitle}>{pack.title}</Text><Text style={styles.packMeta}>{pack.grade} • {pack.subject}</Text><View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${percent}%` }]} /></View><Text style={styles.progressText}>تقدم الحزمة: {percent}%</Text><View style={styles.stepRow}>{flowSteps.map((item, index) => <View key={item.id} style={[styles.stepDot, index <= stepIndex && styles.stepDotActive]}><Ionicons name={item.icon} size={15} color={index <= stepIndex ? 'white' : '#94a3b8'} /></View>)}</View></View><View style={styles.lessonCard}>{step.id === 'summary' && <SummaryStep pack={pack} />}{step.id === 'mcq' && <QuestionStep selected={selected} setSelected={setSelected} type="MCQ" question="ما الفكرة الأساسية في هذا الدرس؟" options={sampleMcq.options} answer={0} />}{step.id === 'fib' && <QuestionStep selected={selected} setSelected={setSelected} type="FIB" question="الفهم الصحيح يعني معرفة المعنى ثم ____ في سؤال جديد." options={['تطبيقه', 'نسيانه', 'تركه', 'حذفه']} answer={0} />}{step.id === 'tf' && <QuestionStep selected={selected} setSelected={setSelected} type="صح / خطأ" question="المراجعة القصيرة اليومية تساعد على تثبيت المعلومة." options={['صح', 'خطأ']} answer={0} />}{step.id === 'hoq' && <QuestionStep selected={selected} setSelected={setSelected} type="HOQ" question="كيف يمكن استخدام هذا الدرس في حياتك اليومية؟" options={['أطبقه في موقف عملي', 'أحفظه فقط', 'أتجاهله', 'أترك التدريب']} answer={0} />}</View><TouchableOpacity style={styles.primaryBtn} onPress={next}><Text style={styles.primaryText}>{stepIndex === flowSteps.length - 1 ? 'إنهاء الحزمة' : 'التالي'}</Text></TouchableOpacity></View>;
}

function SummaryStep({ pack }) {
  return <View><Text style={styles.quizType}>الملخص</Text><Text style={styles.summaryTitle}>{pack.subject}</Text><Text style={styles.summaryText}>هذه الصفحة تعرض ملخصاً مبسطاً للحزمة التعليمية. اقرأ الفكرة الأساسية، ثم انتقل إلى الأسئلة لتثبيت الفهم.</Text><View style={styles.summaryPoint}><Ionicons name="checkmark-circle" size={19} color="#047857" /><Text style={styles.summaryPointText}>افهم المفهوم قبل الحفظ.</Text></View><View style={styles.summaryPoint}><Ionicons name="checkmark-circle" size={19} color="#047857" /><Text style={styles.summaryPointText}>راجع الأمثلة القصيرة.</Text></View><View style={styles.summaryPoint}><Ionicons name="checkmark-circle" size={19} color="#047857" /><Text style={styles.summaryPointText}>أجب عن الأسئلة بدون استعجال.</Text></View></View>;
}

function QuestionStep({ type, question, options, answer, selected, setSelected }) {
  const answered = selected !== null;
  return <View><Text style={styles.quizType}>{type}</Text><Text style={styles.quizQuestion}>{question}</Text>{options.map((option, index) => <TouchableOpacity key={option} onPress={() => setSelected(index)} style={[styles.answer, answered && index === answer && styles.answerCorrect, answered && selected === index && index !== answer && styles.answerWrong]}><Text style={styles.answerText}>{option}</Text></TouchableOpacity>)}{answered && <View style={styles.explainBox}><Text style={styles.explainTitle}>الشرح</Text><Text style={styles.explainText}>الإجابة الصحيحة تساعدك على فهم الفكرة وليس حفظها فقط.</Text></View>}</View>;
}

function Completion({ pack, goBack, restart }) {
  return <View><View style={styles.completeCard}><Ionicons name="trophy" size={64} color="#d97706" /><Text style={styles.completeTitle}>أحسنت!</Text><Text style={styles.centerText}>أكملت {pack.title}</Text><View style={styles.rewardBox}><Text style={styles.rewardBig}>+{pack.xp} XP</Text><Text style={styles.rewardSmall}>تمت إضافة النقاط إلى حسابك</Text></View><TouchableOpacity style={styles.primaryBtn} onPress={restart}><Text style={styles.primaryText}>إعادة التدريب</Text></TouchableOpacity><TouchableOpacity style={styles.secondaryBtn} onPress={goBack}><Text style={styles.secondaryText}>العودة للحزم</Text></TouchableOpacity></View></View>;
}

function DailyChallenge() {
  const [selected, setSelected] = useState(null);
  const answered = selected !== null;
  return <View><View style={styles.challengeHero}><Text style={styles.challengeTitle}>تحدي اليوم</Text><Text style={styles.challengeText}>3 أسئلة من نقاطك الضعيفة: الرياضيات والعلوم</Text><View style={styles.challengeReward}><Ionicons name="gift" size={18} color="#92400e" /><Text style={styles.rewardText}>+50 XP عند الإكمال</Text></View></View><View style={styles.quizCard}><QuestionStep type="MCQ" question={sampleMcq.question} options={sampleMcq.options} answer={sampleMcq.answer} selected={selected} setSelected={setSelected} />{answered && <TouchableOpacity style={styles.primaryBtn} onPress={() => setSelected(null)}><Text style={styles.primaryText}>سؤال جديد</Text></TouchableOpacity>}</View></View>;
}

function Analytics({ openPacks }) {
  const weak = subjects.filter((subject) => subject.score < 60);
  return <View><SectionTitle title="تقدّمك الدراسي" /><View style={styles.analyticsHero}><Text style={styles.analyticsBig}>68%</Text><Text style={styles.analyticsText}>متوسط الدقة هذا الأسبوع</Text><Text style={styles.analyticsSub}>تحسن +12% مقارنة بالأسبوع الماضي</Text></View><View style={styles.snapshotRow}><MiniStat title="وقت الدراسة" value="2.5h" /><MiniStat title="حزم مكتملة" value="12" /><MiniStat title="إجابات صحيحة" value="148" /></View><SectionTitle title="أداء المواد" />{subjects.map((subject) => <TouchableOpacity key={subject.id} style={styles.analyticsRow} onPress={() => openPacks(subject.id)}><View style={styles.analyticsIcon}><Ionicons name={subject.icon} size={19} color="#047857" /></View><View style={{ flex: 1 }}><Text style={styles.analyticsSubject}>{subject.ar}</Text><View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${subject.score}%`, backgroundColor: subject.score < 60 ? '#d97706' : '#047857' }]} /></View></View><Text style={styles.analyticsScore}>{subject.score}%</Text></TouchableOpacity>)}<SectionTitle title="نقاط تحتاج مراجعة" />{weak.map((subject) => <AiTip key={subject.id} text={`راجع ${subject.ar}: النتيجة الحالية ${subject.score}%.`} />)}</View>;
}

function Profile() {
  return <View><SectionTitle title="حسابي" /><View style={styles.profileCard}><View style={styles.bigAvatar}><Text style={styles.bigAvatarText}>أ</Text></View><Text style={styles.profileName}>أحمد علي</Text><Text style={styles.muted}>الصف السابع • الخطة المجانية</Text><View style={styles.profileStats}><Stat label="XP" value="1250" /><Stat label="Streak" value="8" /><Stat label="Progress" value="72%" /></View><TouchableOpacity style={styles.settingRow}><Ionicons name="language" size={19} color="#047857" /><Text style={styles.settingText}>اللغة: العربية</Text></TouchableOpacity><TouchableOpacity style={styles.settingRow}><Ionicons name="notifications" size={19} color="#047857" /><Text style={styles.settingText}>التنبيهات</Text></TouchableOpacity><TouchableOpacity style={styles.settingRow}><Ionicons name="people" size={19} color="#047857" /><Text style={styles.settingText}>وضع ولي الأمر</Text></TouchableOpacity><TouchableOpacity style={styles.premiumBtn}><Text style={styles.primaryText}>ترقية إلى Premium</Text></TouchableOpacity></View></View>;
}

function Stat({ label, value }) { return <View style={styles.statMini}><Text style={styles.statMiniValue}>{value}</Text><Text style={styles.statMiniLabel}>{label}</Text></View>; }
function BottomNav({ tab, setTab }) { return <View style={styles.bottomNav}>{tabs.map((item) => <TouchableOpacity key={item.id} style={styles.tab} onPress={() => setTab(item.id)}><Ionicons name={item.icon} size={22} color={tab === item.id ? '#047857' : '#94a3b8'} /><Text style={[styles.tabText, tab === item.id && styles.tabActive]}>{item.label}</Text></TouchableOpacity>)}</View>; }

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fb' }, appShell: { flex: 1, backgroundColor: '#f5f7fb' }, content: { padding: 18, paddingBottom: 110 }, splash: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, backgroundColor: '#ecfdf5' }, logo: { width: 92, height: 92, borderRadius: 30, backgroundColor: '#047857', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }, logoText: { color: 'white', fontSize: 44, fontWeight: '900' }, splashTitle: { fontSize: 38, fontWeight: '900', color: '#172033' }, splashSub: { color: '#64748b', textAlign: 'center', lineHeight: 24, marginVertical: 14, fontWeight: '700' },
  primaryBtn: { minHeight: 52, borderRadius: 18, backgroundColor: '#047857', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22, marginTop: 12 }, primaryText: { color: 'white', fontWeight: '900', fontSize: 16 }, secondaryBtn: { minHeight: 52, borderRadius: 18, backgroundColor: '#ecfdf5', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22, marginTop: 10, borderWidth: 1, borderColor: '#bbf7d0' }, secondaryText: { color: '#047857', fontWeight: '900', fontSize: 16 }, premiumBtn: { minHeight: 52, borderRadius: 18, backgroundColor: '#d97706', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22, marginTop: 16 },
  loginPage: { flex: 1, justifyContent: 'center', padding: 22 }, pageTitle: { fontSize: 34, fontWeight: '900', color: '#172033', textAlign: 'right' }, muted: { color: '#64748b', fontWeight: '700', marginTop: 6, textAlign: 'center' }, loginCard: { backgroundColor: 'white', borderRadius: 28, padding: 18, marginTop: 24, gap: 12 }, socialBtn: { height: 52, borderRadius: 18, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 }, socialText: { fontWeight: '900', color: '#172033' },
  header: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, smallGreen: { color: '#047857', fontWeight: '900', textAlign: 'right' }, headerTitle: { fontSize: 24, fontWeight: '900', color: '#172033' }, coinPill: { flexDirection: 'row', gap: 6, alignItems: 'center', backgroundColor: '#fef3c7', paddingHorizontal: 12, height: 38, borderRadius: 19 }, coinText: { color: '#92400e', fontWeight: '900' },
  hero: { backgroundColor: '#047857', borderRadius: 30, padding: 22, marginBottom: 18 }, heroTitle: { color: 'white', fontSize: 28, fontWeight: '900', textAlign: 'right', lineHeight: 36 }, heroText: { color: '#ccfbf1', fontWeight: '800', marginVertical: 10, textAlign: 'right' }, whiteBtn: { backgroundColor: 'white', borderRadius: 16, height: 46, alignItems: 'center', justifyContent: 'center', marginTop: 10 }, whiteBtnText: { color: '#047857', fontWeight: '900' }, sectionTitle: { fontSize: 24, fontWeight: '900', color: '#172033', marginVertical: 14, textAlign: 'right' },
  snapshotRow: { flexDirection: 'row', gap: 10, marginBottom: 6 }, miniStat: { flex: 1, backgroundColor: 'white', borderRadius: 20, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' }, miniValue: { fontSize: 20, fontWeight: '900', color: '#047857' }, miniLabel: { color: '#64748b', fontSize: 12, fontWeight: '800', marginTop: 4 }, tipCard: { flexDirection: 'row-reverse', gap: 10, alignItems: 'center', backgroundColor: '#eef2ff', borderRadius: 18, padding: 14, marginBottom: 10 }, tipText: { flex: 1, textAlign: 'right', color: '#3730a3', fontWeight: '800', lineHeight: 22 },
  packCard: { backgroundColor: 'white', borderRadius: 24, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' }, packTop: { flexDirection: 'row-reverse', gap: 12, alignItems: 'center' }, packIcon: { width: 44, height: 44, borderRadius: 16, backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center' }, packTitle: { fontSize: 16, fontWeight: '900', color: '#172033', textAlign: 'right' }, packMeta: { color: '#64748b', fontWeight: '700', marginTop: 4, textAlign: 'right' }, progressTrack: { height: 10, backgroundColor: '#e2e8f0', borderRadius: 999, overflow: 'hidden', marginTop: 14 }, progressFill: { height: '100%', backgroundColor: '#047857' }, progressText: { color: '#64748b', fontSize: 12, fontWeight: '800', marginTop: 8, textAlign: 'right' },
  subjectGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }, subjectChip: { backgroundColor: 'white', borderRadius: 18, padding: 14, minWidth: '47%', flexDirection: 'row-reverse', gap: 8, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' }, subjectText: { fontWeight: '900', color: '#172033', flex: 1, textAlign: 'right' }, filterRow: { gap: 8, paddingVertical: 8, flexDirection: 'row-reverse' }, filterChip: { paddingHorizontal: 14, height: 38, borderRadius: 19, backgroundColor: 'white', justifyContent: 'center', borderWidth: 1, borderColor: '#e2e8f0' }, filterActive: { backgroundColor: '#047857', borderColor: '#047857' }, filterText: { color: '#64748b', fontWeight: '900' }, filterTextActive: { color: 'white' },
  detailCard: { backgroundColor: 'white', borderRadius: 28, padding: 20, borderWidth: 1, borderColor: '#e2e8f0' }, lockedCard: { backgroundColor: 'white', borderRadius: 28, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' }, packIconBig: { width: 74, height: 74, borderRadius: 24, backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end', marginBottom: 12 }, detailTitle: { fontSize: 25, fontWeight: '900', color: '#172033', textAlign: 'right', lineHeight: 34 }, centerText: { color: '#64748b', fontWeight: '800', textAlign: 'center', lineHeight: 24, marginTop: 8 }, backBtn: { flexDirection: 'row-reverse', gap: 8, alignItems: 'center', alignSelf: 'flex-end', marginBottom: 10 }, backText: { color: '#047857', fontWeight: '900' }, stepRow: { flexDirection: 'row-reverse', gap: 8, justifyContent: 'center', marginVertical: 16 }, stepDot: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' }, stepDotActive: { backgroundColor: '#047857' }, lessonCard: { backgroundColor: '#f8fafc', borderRadius: 22, padding: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  summaryTitle: { fontSize: 22, fontWeight: '900', color: '#172033', textAlign: 'right', marginVertical: 10 }, summaryText: { color: '#475569', fontWeight: '800', textAlign: 'right', lineHeight: 25 }, summaryPoint: { flexDirection: 'row-reverse', gap: 8, alignItems: 'center', marginTop: 12 }, summaryPointText: { flex: 1, color: '#172033', fontWeight: '800', textAlign: 'right' },
  challengeHero: { backgroundColor: '#0f766e', borderRadius: 30, padding: 22, marginBottom: 16 }, challengeTitle: { color: 'white', fontSize: 30, fontWeight: '900', textAlign: 'right' }, challengeText: { color: '#ccfbf1', fontWeight: '800', textAlign: 'right', marginTop: 8, lineHeight: 23 }, challengeReward: { alignSelf: 'flex-end', flexDirection: 'row-reverse', gap: 8, backgroundColor: '#fef3c7', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, marginTop: 14 }, rewardText: { color: '#92400e', fontWeight: '900' },
  quizCard: { backgroundColor: 'white', borderRadius: 28, padding: 18, borderWidth: 1, borderColor: '#e2e8f0' }, quizType: { color: '#047857', fontWeight: '900', textAlign: 'right' }, quizQuestion: { fontSize: 22, fontWeight: '900', color: '#172033', marginVertical: 12, textAlign: 'right', lineHeight: 30 }, answer: { padding: 14, borderRadius: 16, backgroundColor: 'white', marginBottom: 10, borderWidth: 1, borderColor: '#e2e8f0' }, answerCorrect: { backgroundColor: '#dcfce7', borderColor: '#bbf7d0' }, answerWrong: { backgroundColor: '#fee2e2', borderColor: '#fecaca' }, answerText: { textAlign: 'right', fontWeight: '800', color: '#172033' }, explainBox: { padding: 14, borderRadius: 18, backgroundColor: '#eef2ff', marginTop: 8 }, explainTitle: { fontWeight: '900', color: '#3730a3', textAlign: 'right' }, explainText: { color: '#3730a3', textAlign: 'right', lineHeight: 22, marginTop: 6, fontWeight: '700' },
  completeCard: { backgroundColor: 'white', borderRadius: 30, padding: 26, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' }, completeTitle: { fontSize: 34, fontWeight: '900', color: '#172033', marginTop: 12 }, rewardBox: { backgroundColor: '#fef3c7', borderRadius: 24, padding: 18, width: '100%', alignItems: 'center', marginVertical: 18 }, rewardBig: { fontSize: 32, color: '#92400e', fontWeight: '900' }, rewardSmall: { color: '#92400e', fontWeight: '800', marginTop: 4 },
  analyticsHero: { backgroundColor: 'white', borderRadius: 28, padding: 22, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 12 }, analyticsBig: { fontSize: 52, fontWeight: '900', color: '#047857' }, analyticsText: { color: '#172033', fontWeight: '900', fontSize: 18 }, analyticsSub: { color: '#64748b', fontWeight: '700', marginTop: 6 }, analyticsRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12, backgroundColor: 'white', borderRadius: 20, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#e2e8f0' }, analyticsIcon: { width: 42, height: 42, borderRadius: 15, backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center' }, analyticsSubject: { textAlign: 'right', fontWeight: '900', color: '#172033' }, analyticsScore: { color: '#047857', fontWeight: '900', minWidth: 42 },
  profileCard: { alignItems: 'center', backgroundColor: 'white', borderRadius: 28, padding: 22, borderWidth: 1, borderColor: '#e2e8f0' }, bigAvatar: { width: 86, height: 86, borderRadius: 30, backgroundColor: '#047857', alignItems: 'center', justifyContent: 'center' }, bigAvatarText: { color: 'white', fontSize: 36, fontWeight: '900' }, profileName: { fontSize: 24, fontWeight: '900', marginTop: 12, color: '#172033' }, profileStats: { flexDirection: 'row', gap: 10, marginTop: 18 }, statMini: { backgroundColor: '#f8fafc', borderRadius: 18, padding: 14, minWidth: 82, alignItems: 'center' }, statMiniValue: { fontSize: 18, fontWeight: '900', color: '#047857' }, statMiniLabel: { color: '#64748b', fontSize: 12, fontWeight: '800' }, settingRow: { marginTop: 12, width: '100%', flexDirection: 'row-reverse', alignItems: 'center', gap: 10, backgroundColor: '#f8fafc', borderRadius: 16, padding: 14 }, settingText: { flex: 1, textAlign: 'right', fontWeight: '900', color: '#172033' },
  bottomNav: { position: 'absolute', left: 14, right: 14, bottom: 16, height: 74, borderRadius: 26, backgroundColor: 'white', flexDirection: 'row-reverse', justifyContent: 'space-around', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' }, tab: { alignItems: 'center', gap: 4 }, tabText: { fontSize: 11, color: '#94a3b8', fontWeight: '800' }, tabActive: { color: '#047857' },
});
