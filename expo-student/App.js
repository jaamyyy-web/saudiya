import React, { useEffect, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { I18nManager, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLiveStudentAppData } from './useLiveStudentAppData';
import { demoQuestions, demoSummary, loadPackQuestions, loadPackSummary } from './studentData';
import { savePackCompletion, saveQuizAttempt } from './progressService';
import LearningPackFlowV2 from './LearningPackFlowV2';
import LoginScreenV2 from './LoginScreenV2';
import {
  getDisplayAnalytics,
  getDisplayLeaderboard,
  getDisplayStudent,
  mergeLivePacksWithDemo,
} from './liveContentAdapter';
import { initializePurchases } from './billingService';
import PaywallScreen from './PaywallScreen';

I18nManager.allowRTL(true);

const demoStudent = { id: 'demo-student', name: 'أحمد علي', grade: 'الصف السابع', plan: 'الخطة المجانية', xp: 1250, streak: 8, accuracy: 68, completedPacks: 12 };
const subjects = [
  ['islamic', 'الدراسات الإسلامية', 'moon', 86], ['arabic', 'اللغة العربية', 'language', 74], ['english', 'اللغة الإنجليزية', 'text', 61],
  ['math', 'الرياضيات', 'calculator', 52], ['science', 'العلوم', 'flask', 58], ['social', 'الدراسات الاجتماعية', 'earth', 79],
  ['digital', 'المهارات الرقمية', 'laptop', 68], ['life', 'المهارات الحياتية والأسرية', 'home', 72], ['art', 'التربية الفنية', 'color-palette', 91],
  ['health', 'التربية البدنية والصحية', 'fitness', 83], ['thinking', 'التفكير الناقد', 'bulb', 49],
].map(([id, ar, icon, score]) => ({ id, ar, icon, score }));

const grades = ['الصف السابع', 'الصف الثامن', 'الصف التاسع'];
const demoPacks = grades.flatMap((grade, g) => subjects.map((s, i) => ({
  id: `${g}-${s.id}`, grade, subject: s.ar, subjectId: s.id, title: `${s.ar} - حزمة التعلم ${g + 1}`,
  progress: i % 4 === 0 ? 0 : 20 + ((g + i) * 11) % 75, locked: i > 5 && g > 0, xp: 120, source: 'demo',
})));

const tabs = [
  ['home', 'الرئيسية', 'home'], ['packs', 'الحزم', 'book'], ['challenge', 'التحدي', 'flash'], ['analytics', 'التحليلات', 'stats-chart'], ['profile', 'حسابي', 'person'],
].map(([id, label, icon]) => ({ id, label, icon }));
const flowSteps = [
  ['summary', 'ملخص الدرس', 'document-text', 'استعرض أهم النقاط والمفاهيم الأساسية.'],
  ['mcq', 'اختبار متعدد (MCQ)', 'list', 'اختر الإجابة الصحيحة من بين الخيارات.'],
  ['fib', 'أكمل الفراغ (FIB)', 'remove', 'أكمل العبارات بالكلمة أو العبارة المناسبة.'],
  ['tf', 'صح أو خطأ (TF)', 'checkmark-circle', 'حدد ما إذا كانت العبارة صحيحة أم خاطئة.'],
  ['hoq', 'أسئلة التفكير العليا (HOQ)', 'bulb', 'اختبر مهارات التفكير والتحليل والاستنتاج.'],
  ['comprehensive', 'الاختبار الشامل', 'trophy', 'اختبار شامل على جميع محتويات الباقة.'],
].map(([id, label, icon, desc]) => ({ id, label, icon, desc }));
const demoLeaders = ['سارة محمد', 'أحمد علي', 'نورة صالح', 'فهد خالد', 'ليان عبدالله'];

function normalizeQuestion(raw, index = 0) {
  const type = String(raw?.type || raw?.questionType || 'MCQ').toUpperCase();
  const options = Array.isArray(raw?.options) && raw.options.length ? raw.options : type === 'TF' ? ['صح', 'خطأ'] : ['فهم المفهوم وتطبيقه', 'حفظ الكلمات فقط', 'تخطي التدريب', 'عدم المراجعة'];
  const foundAnswer = options.findIndex((item) => item === raw?.answer || item === raw?.correctAnswer);
  const answerIndex = Number.isInteger(raw?.answerIndex) ? raw.answerIndex : Number.isInteger(raw?.correctIndex) ? raw.correctIndex : foundAnswer;
  return {
    id: raw?.id || `question-${index}`,
    type,
    question: raw?.question || raw?.prompt || 'ما الفكرة الأساسية في هذا الدرس؟',
    options,
    answerIndex: answerIndex >= 0 ? answerIndex : 0,
    explanation: raw?.explanation || raw?.reason || 'الإجابة الصحيحة تساعدك على فهم الفكرة وليس حفظها فقط.',
  };
}

function getQuestionForStep(questions, stepId) {
  const typeMap = { mcq: 'MCQ', fib: 'FIB', tf: 'TF', hoq: 'HOQ' };
  const normalized = (questions?.length ? questions : demoQuestions).map(normalizeQuestion);
  return normalized.find((item) => item.type === typeMap[stepId]) || normalized[0] || normalizeQuestion(demoQuestions[0]);
}

export default function App() {
  const [started, setStarted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState('home');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedPack, setSelectedPack] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);

  const {
    student,
    studentId,
    isPremium,
    livePacks,
    leaderboard,
    analytics,
    completedPackIds,
    loading,
    errors,
  } = useLiveStudentAppData();

  useEffect(() => {
    if (studentId) {
      initializePurchases(studentId);
    }
  }, [studentId]);

  const displayStudent = getDisplayStudent(student, demoStudent);
  const displayPacks = mergeLivePacksWithDemo(livePacks, demoPacks).map((pack) => ({
    ...pack,
    progress: completedPackIds?.has?.(pack.id) ? 100 : pack.progress,
  }));
  const displayLeaderboard = getDisplayLeaderboard(leaderboard, demoLeaders);
  const displayAnalytics = getDisplayAnalytics(analytics, displayStudent);

  if (!started) return <Splash onStart={() => setStarted(true)} />;
  if (!loggedIn) return <LoginScreenV2 onLogin={() => setLoggedIn(true)} />;
  if (loading && displayPacks.length === 0) return <LoadingScreen />;

  if (showPaywall) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.safe}>
          <StatusBar style="dark" />
          <View style={styles.app}>
            <TouchableOpacity style={styles.back} onPress={() => setShowPaywall(false)}>
              <Ionicons name="arrow-forward" size={18} color="#047857" />
              <Text style={styles.backText}>رجوع</Text>
            </TouchableOpacity>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
              <PaywallScreen
                studentId={studentId}
                onDone={() => setShowPaywall(false)}
                onBack={() => setShowPaywall(false)}
                styles={styles}
              />
            </ScrollView>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  const openPacks = (subjectId = null) => { setSelectedSubject(subjectId); setSelectedPack(null); setTab('packs'); };
  const openTab = (next) => { setSelectedPack(null); setTab(next); };

  return <SafeAreaProvider><SafeAreaView style={styles.safe}><StatusBar style="dark" /><View style={styles.app}>
    <Header student={displayStudent} />
    {errors?.length > 0 && <LiveWarning />}
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      {tab === 'home' && <Home packs={displayPacks} analytics={displayAnalytics} openPacks={openPacks} openTab={openTab} />}
      {tab === 'packs' && <Packs packs={displayPacks} student={displayStudent} selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject} selectedPack={selectedPack} setSelectedPack={setSelectedPack} />}
      {tab === 'challenge' && <Challenge student={displayStudent} />}
      {tab === 'analytics' && <Analytics analytics={displayAnalytics} leaderboard={displayLeaderboard} openPacks={openPacks} />}
      {tab === 'profile' && <Profile student={displayStudent} analytics={displayAnalytics} isPremium={isPremium} setShowPaywall={setShowPaywall} />}
    </ScrollView>
    <BottomNav tab={tab} setTab={openTab} />
  </View></SafeAreaView></SafeAreaProvider>;
}

function Splash({ onStart }) { return <SafeAreaProvider><SafeAreaView style={styles.safe}><View style={styles.center}><View style={styles.logo}><Text style={styles.logoText}>س</Text></View><Text style={styles.splashTitle}>Saudi Edu</Text><Text style={styles.muted}>تعلم بذكاء، اختبر نفسك، وتقدم كل يوم</Text><Button title="ابدأ الآن" onPress={onStart} /></View></SafeAreaView></SafeAreaProvider>; }
// LoginScreenV2 (with real Google / Apple auth) is now used instead of the old inline Login stub.
function LoadingScreen() { return <SafeAreaProvider><SafeAreaView style={styles.safe}><View style={styles.center}><Text style={styles.title}>جاري تحميل المحتوى...</Text><Text style={styles.muted}>يتم الاتصال بقاعدة البيانات</Text></View></SafeAreaView></SafeAreaProvider>; }
function LiveWarning() { return <View style={styles.warning}><Text style={styles.warningText}>تم تشغيل وضع العرض التجريبي عند تعذر تحميل بعض البيانات الحية.</Text></View>; }
function Social({ icon, title, onPress }) { return <TouchableOpacity style={styles.social} onPress={onPress}><Ionicons name={icon} size={21} /><Text style={styles.socialText}>{title}</Text></TouchableOpacity>; }
function Header({ student }) { return <View style={styles.header}><View><Text style={styles.green}>مرحباً {student.name}</Text><Text style={styles.headerTitle}>استمر في التعلم</Text></View><View style={styles.coin}><Ionicons name="diamond" size={16} color="#d97706" /><Text style={styles.coinText}>{student.xp}</Text></View></View>; }
function Button({ title, onPress, gold }) { return <TouchableOpacity style={[styles.btn, gold && styles.goldBtn]} onPress={onPress}><Text style={styles.btnText}>{title}</Text></TouchableOpacity>; }
function SectionTitle({ title }) { return <Text style={styles.section}>{title}</Text>; }
function MiniStat({ title, value }) { return <View style={styles.mini}><Text style={styles.miniValue}>{value}</Text><Text style={styles.miniLabel}>{title}</Text></View>; }
function Tip({ text }) { return <View style={styles.tip}><Ionicons name="sparkles" size={18} color="#4338ca" /><Text style={styles.tipText}>{text}</Text></View>; }

function Home({ packs, analytics, openPacks, openTab }) {
  const firstPack = packs[0] || demoPacks[0];
  return <View><View style={styles.hero}><Text style={styles.heroTitle}>أكمل رحلتك التعليمية اليوم</Text><Text style={styles.heroText}>اقتراح ذكي: راجع المواد الضعيفة اليوم</Text><TouchableOpacity style={styles.whiteBtn} onPress={() => openTab('challenge')}><Text style={styles.whiteBtnText}>ابدأ تحدي اليوم</Text></TouchableOpacity></View><View style={styles.row}><MiniStat title="الدقة" value={`${analytics.accuracy || 68}%`} /><MiniStat title="الحزم" value={String(analytics.completedPacks || 12)} /><MiniStat title="السلسلة" value={String(analytics.streak || 8)} /></View><SectionTitle title="أكمل من حيث توقفت" /><PackCard pack={firstPack} onPress={() => openPacks(firstPack.subjectId)} /><SectionTitle title="اقتراحات ذكية" /><Tip text="راجع المواد الأقل نتيجة لمدة 10 دقائق اليوم." /><Tip text="أكمل حزمة جديدة لتحصل على نقاط XP إضافية." /><SectionTitle title="كل المواد" /><SubjectGrid onPress={openPacks} /></View>;
}
function SubjectGrid({ onPress }) { return <View style={styles.grid}>{subjects.map(s => <TouchableOpacity key={s.id} style={styles.subject} onPress={() => onPress(s.id)}><Ionicons name={s.icon} size={18} color="#047857" /><Text style={styles.subjectText}>{s.ar}</Text></TouchableOpacity>)}</View>; }
function Packs({ packs, student, selectedSubject, setSelectedSubject, selectedPack, setSelectedPack }) {
  const filtered = useMemo(() => selectedSubject ? packs.filter(p => p.subjectId === selectedSubject) : packs, [packs, selectedSubject]);
  if (selectedPack) return <LearningPackFlowV2 pack={selectedPack} student={student} goBack={() => setSelectedPack(null)} flowSteps={flowSteps} styles={styles} Button={Button} Back={Back} SummaryStep={SummaryStep} QuestionStep={QuestionStep} Completion={Completion} Locked={Locked} />;
  return <View><SectionTitle title="حزم التعلم" /><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>{[{ id: null, ar: 'الكل' }, ...subjects].map(item => <TouchableOpacity key={item.id || 'all'} style={[styles.filter, selectedSubject === item.id && styles.filterActive]} onPress={() => setSelectedSubject(item.id)}><Text style={[styles.filterText, selectedSubject === item.id && styles.filterTextActive]}>{item.ar}</Text></TouchableOpacity>)}</ScrollView>{filtered.map(pack => <PackCard key={pack.id} pack={pack} onPress={() => setSelectedPack(pack)} />)}</View>;
}
function PackCard({ pack, onPress }) { return <TouchableOpacity style={styles.pack} onPress={onPress}><View style={styles.packTop}><View style={styles.packIcon}><Ionicons name={pack.locked ? 'lock-closed' : 'book'} size={20} color="#047857" /></View><View style={{ flex: 1 }}><Text style={styles.packTitle}>{pack.title}</Text><Text style={styles.packMeta}>{pack.grade} • {pack.subject} {pack.source === 'firestore' ? '• مباشر' : ''}</Text></View></View><View style={styles.bar}><View style={[styles.fill, { width: `${pack.progress || 0}%` }]} /></View><Text style={styles.progress}>{pack.locked ? 'مغلق - يحتاج Premium' : `اكتمل ${pack.progress || 0}%`}</Text></TouchableOpacity>; }

// LearningPackFlow V1 removed — LearningPackFlowV2 is used everywhere.

function Back({ onPress }) { return <TouchableOpacity style={styles.back} onPress={onPress}><Ionicons name="arrow-forward" size={18} color="#047857" /><Text style={styles.backText}>رجوع</Text></TouchableOpacity>; }
function Locked({ goBack }) { return <View><Back onPress={goBack} /><View style={styles.locked}><Ionicons name="lock-closed" size={52} color="#d97706" /><Text style={styles.detailTitle}>هذه الحزمة Premium</Text><Text style={styles.centerText}>افتح الخطة المدفوعة للوصول إلى الملخص والاختبارات الكاملة.</Text><Button title="افتح Premium" gold /></View></View>; }
function SummaryStep({ pack, summary }) { const points = Array.isArray(summary?.points) && summary.points.length ? summary.points : demoSummary.points; return <View><Text style={styles.quizType}>الملخص</Text><Text style={styles.summaryTitle}>{summary?.title || pack.subject}</Text><Text style={styles.summaryText}>{summary?.body || summary?.content || demoSummary.body}</Text>{points.map((x) => <View key={x} style={styles.point}><Ionicons name="checkmark-circle" size={19} color="#047857" /><Text style={styles.pointText}>{x}</Text></View>)}</View>; }
function QuestionStep({ type, selected, setSelected, questionData }) { const q = normalizeQuestion(questionData); const answered = selected !== null; return <View><Text style={styles.quizType}>{type}</Text><Text style={styles.quizQuestion}>{q.question}</Text>{q.options.map((o, i) => <TouchableOpacity key={`${q.id}-${i}`} onPress={() => setSelected(i)} style={[styles.answer, answered && i === q.answerIndex && styles.correct, answered && selected === i && i !== q.answerIndex && styles.wrong]}><Text style={styles.answerText}>{o}</Text></TouchableOpacity>)}{answered && <View style={styles.explain}><Text style={styles.explainTitle}>الشرح</Text><Text style={styles.explainText}>{q.explanation}</Text></View>}</View>; }
function Completion({ pack, goBack, restart }) { return <View><View style={styles.complete}><Ionicons name="trophy" size={64} color="#d97706" /><Text style={styles.completeTitle}>أحسنت!</Text><Text style={styles.centerText}>أكملت {pack.title}</Text><View style={styles.reward}><Text style={styles.rewardBig}>+{pack.xp} XP</Text><Text style={styles.rewardSmall}>تم حفظ تقدمك في قاعدة البيانات</Text></View><Button title="إعادة التدريب" onPress={restart} /><TouchableOpacity style={styles.secondary} onPress={goBack}><Text style={styles.secondaryText}>العودة للحزم</Text></TouchableOpacity></View></View>; }

function Challenge({ student }) { const [selected, setSelected] = useState(null); return <View><View style={styles.challengeHero}><Text style={styles.challengeTitle}>تحدي اليوم</Text><Text style={styles.challengeText}>3 أسئلة من نقاطك الضعيفة</Text><View style={styles.challengeReward}><Ionicons name="gift" size={18} color="#92400e" /><Text style={styles.rewardText}>+50 XP عند الإكمال</Text></View></View><View style={styles.card}><QuestionStep type="MCQ" selected={selected} setSelected={(i) => { setSelected(i); const q = normalizeQuestion(demoQuestions[0]); saveQuizAttempt({ studentId: student?.id || 'demo-student', packId: 'daily-challenge', questionId: q.id, questionType: q.type, selectedIndex: i, answerIndex: q.answerIndex, isCorrect: i === q.answerIndex }); }} questionData={demoQuestions[0]} />{selected !== null && <Button title="سؤال جديد" onPress={() => setSelected(null)} />}</View></View>; }
function Analytics({ analytics, leaderboard, openPacks }) { const weak = subjects.filter(s => s.score < 60); return <View><SectionTitle title="تقدّمك الدراسي" /><View style={styles.analyticsHero}><Text style={styles.analyticsBig}>{analytics.accuracy || 68}%</Text><Text style={styles.analyticsText}>متوسط الدقة هذا الأسبوع</Text><Text style={styles.analyticsSub}>البيانات الحية تظهر عند توفر تقدم الطالب</Text></View><View style={styles.row}><MiniStat title="XP" value={String(analytics.xp || 1250)} /><MiniStat title="حزم مكتملة" value={String(analytics.completedPacks || 12)} /><MiniStat title="السلسلة" value={String(analytics.streak || 8)} /></View><SectionTitle title="ترتيبك بين الطلاب" /><View style={styles.rankCard}><Text style={styles.rankTitle}>لوحة المتصدرين</Text>{leaderboard.map(item => <View key={`${item.rank}-${item.name}`} style={styles.rankRow}><Text style={styles.rankNo}>{item.rank}</Text><Text style={styles.rankName}>{item.name}</Text><Text style={styles.rankXp}>{item.xp} XP</Text></View>)}</View><SectionTitle title="أداء المواد" />{subjects.map(s => <TouchableOpacity key={s.id} style={styles.analyticsRow} onPress={() => openPacks(s.id)}><View style={styles.analyticsIcon}><Ionicons name={s.icon} size={19} color="#047857" /></View><View style={{ flex: 1 }}><Text style={styles.analyticsSubject}>{s.ar}</Text><View style={styles.bar}><View style={[styles.fill, { width: `${s.score}%`, backgroundColor: s.score < 60 ? '#d97706' : '#047857' }]} /></View></View><Text style={styles.analyticsScore}>{s.score}%</Text></TouchableOpacity>)}<SectionTitle title="نقاط تحتاج مراجعة" />{weak.map(s => <Tip key={s.id} text={`راجع ${s.ar}: النتيجة الحالية ${s.score}%.`} />)}</View>; }
function Profile({ student, analytics, isPremium, setShowPaywall }) { return <View><SectionTitle title="حسابي" /><View style={styles.profile}><View style={styles.avatar}><Text style={styles.avatarText}>{student.name?.[0] || 'أ'}</Text></View><Text style={styles.profileName}>{student.name}</Text><Text style={styles.muted}>{student.grade} • {isPremium ? 'عضو Premium نشط' : student.plan || 'الخطة المجانية'}</Text><View style={styles.row}><MiniStat title="XP" value={String(analytics.xp || student.xp)} /><MiniStat title="Streak" value={String(analytics.streak || student.streak)} /><MiniStat title="Accuracy" value={`${analytics.accuracy || student.accuracy}%`} /></View><SectionTitle title="الشارات والشهادات" /><View style={styles.badgeRow}>{['المجتهد', 'سلسلة 7 أيام', 'متقن MCQ'].map(x => <View key={x} style={styles.badge}><Ionicons name="ribbon" size={20} color="#d97706" /><Text style={styles.badgeText}>{x}</Text></View>)}</View>{['اللغة: العربية', 'التنبيهات', 'وضع ولي الأمر', 'إدارة الأجهزة'].map((x, i) => <TouchableOpacity key={x} style={styles.setting}><Ionicons name={['language','notifications','people','phone-portrait'][i]} size={19} color="#047857" /><Text style={styles.settingText}>{x}</Text></TouchableOpacity>)}{isPremium ? ( <View style={styles.tip}><Ionicons name="sparkles" size={18} color="#4338ca" /><Text style={styles.tipText}>اشتراك Premium مفعّل ونشط على جميع أجهزتك!</Text></View> ) : ( <Button title="ترقية إلى Premium" gold onPress={() => setShowPaywall(true)} /> )}</View></View>; }
function BottomNav({ tab, setTab }) { return <View style={styles.bottom}>{tabs.map(item => <TouchableOpacity key={item.id} style={styles.tab} onPress={() => setTab(item.id)}><Ionicons name={item.icon} size={22} color={tab === item.id ? '#047857' : '#94a3b8'} /><Text style={[styles.tabText, tab === item.id && styles.tabActive]}>{item.label}</Text></TouchableOpacity>)}</View>; }

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:'#f5f7fb'}, app:{flex:1,backgroundColor:'#f5f7fb'}, content:{padding:18,paddingBottom:110}, center:{flex:1,alignItems:'center',justifyContent:'center',padding:28,backgroundColor:'#ecfdf5'},
  logo:{width:92,height:92,borderRadius:30,backgroundColor:'#047857',alignItems:'center',justifyContent:'center',marginBottom:18}, logoText:{color:'white',fontSize:44,fontWeight:'900'}, splashTitle:{fontSize:38,fontWeight:'900',color:'#172033'}, muted:{color:'#64748b',fontWeight:'700',marginTop:6,textAlign:'center'},
  login:{flex:1,justifyContent:'center',padding:22}, title:{fontSize:34,fontWeight:'900',color:'#172033',textAlign:'right'}, card:{backgroundColor:'white',borderRadius:28,padding:18,marginTop:18,gap:12,borderWidth:1,borderColor:'#e2e8f0'},
  social:{height:52,borderRadius:18,borderWidth:1,borderColor:'#e2e8f0',alignItems:'center',justifyContent:'center',flexDirection:'row',gap:10}, socialText:{fontWeight:'900',color:'#172033'},
  btn:{minHeight:52,borderRadius:18,backgroundColor:'#047857',alignItems:'center',justifyContent:'center',paddingHorizontal:22,marginTop:12}, goldBtn:{backgroundColor:'#d97706'}, btnText:{color:'white',fontWeight:'900',fontSize:16},
  warning:{backgroundColor:'#fef3c7',padding:9,marginHorizontal:18,borderRadius:14}, warningText:{color:'#92400e',fontWeight:'800',textAlign:'center',fontSize:12}, loadingInline:{backgroundColor:'#ecfdf5',color:'#047857',fontWeight:'900',textAlign:'center',padding:8,borderRadius:12,marginBottom:10},
  header:{paddingHorizontal:18,paddingTop:8,paddingBottom:12,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}, green:{color:'#047857',fontWeight:'900',textAlign:'right'}, headerTitle:{fontSize:24,fontWeight:'900',color:'#172033'}, coin:{flexDirection:'row',gap:6,alignItems:'center',backgroundColor:'#fef3c7',paddingHorizontal:12,height:38,borderRadius:19}, coinText:{color:'#92400e',fontWeight:'900'},
  hero:{backgroundColor:'#047857',borderRadius:30,padding:22,marginBottom:18}, heroTitle:{color:'white',fontSize:28,fontWeight:'900',textAlign:'right',lineHeight:36}, heroText:{color:'#ccfbf1',fontWeight:'800',marginVertical:10,textAlign:'right'}, whiteBtn:{backgroundColor:'white',borderRadius:16,height:46,alignItems:'center',justifyContent:'center',marginTop:10}, whiteBtnText:{color:'#047857',fontWeight:'900'},
  section:{fontSize:24,fontWeight:'900',color:'#172033',marginVertical:14,textAlign:'right'}, row:{flexDirection:'row',gap:10,marginBottom:6}, mini:{flex:1,backgroundColor:'white',borderRadius:20,padding:14,alignItems:'center',borderWidth:1,borderColor:'#e2e8f0'}, miniValue:{fontSize:20,fontWeight:'900',color:'#047857'}, miniLabel:{color:'#64748b',fontSize:12,fontWeight:'800',marginTop:4},
  tip:{flexDirection:'row-reverse',gap:10,alignItems:'center',backgroundColor:'#eef2ff',borderRadius:18,padding:14,marginBottom:10}, tipText:{flex:1,textAlign:'right',color:'#3730a3',fontWeight:'800',lineHeight:22}, grid:{flexDirection:'row',flexWrap:'wrap',gap:10}, subject:{backgroundColor:'white',borderRadius:18,padding:14,minWidth:'47%',flexDirection:'row-reverse',gap:8,alignItems:'center',borderWidth:1,borderColor:'#e2e8f0'}, subjectText:{fontWeight:'900',color:'#172033',flex:1,textAlign:'right'},
  filterRow:{gap:8,paddingVertical:8,flexDirection:'row-reverse'}, filter:{paddingHorizontal:14,height:38,borderRadius:19,backgroundColor:'white',justifyContent:'center',borderWidth:1,borderColor:'#e2e8f0'}, filterActive:{backgroundColor:'#047857',borderColor:'#047857'}, filterText:{color:'#64748b',fontWeight:'900'}, filterTextActive:{color:'white'},
  pack:{backgroundColor:'white',borderRadius:24,padding:16,marginBottom:12,borderWidth:1,borderColor:'#e2e8f0'}, packTop:{flexDirection:'row-reverse',gap:12,alignItems:'center'}, packIcon:{width:44,height:44,borderRadius:16,backgroundColor:'#dcfce7',alignItems:'center',justifyContent:'center'}, packTitle:{fontSize:16,fontWeight:'900',color:'#172033',textAlign:'right'}, packMeta:{color:'#64748b',fontWeight:'700',marginTop:4,textAlign:'right'},
  bar:{height:10,backgroundColor:'#e2e8f0',borderRadius:999,overflow:'hidden',marginTop:14}, fill:{height:'100%',backgroundColor:'#047857'}, progress:{color:'#64748b',fontSize:12,fontWeight:'800',marginTop:8,textAlign:'right'}, back:{flexDirection:'row-reverse',gap:8,alignItems:'center',alignSelf:'flex-end',marginBottom:10}, backText:{color:'#047857',fontWeight:'900'},
  detail:{backgroundColor:'white',borderRadius:28,padding:20,borderWidth:1,borderColor:'#e2e8f0'}, locked:{backgroundColor:'white',borderRadius:28,padding:24,alignItems:'center',borderWidth:1,borderColor:'#e2e8f0'}, bigIcon:{width:74,height:74,borderRadius:24,backgroundColor:'#dcfce7',alignItems:'center',justifyContent:'center',alignSelf:'flex-end',marginBottom:12}, detailTitle:{fontSize:25,fontWeight:'900',color:'#172033',textAlign:'right',lineHeight:34}, centerText:{color:'#64748b',fontWeight:'800',textAlign:'center',lineHeight:24,marginTop:8},
  stepRow:{flexDirection:'row-reverse',gap:8,justifyContent:'center',marginVertical:16}, stepDot:{width:34,height:34,borderRadius:17,backgroundColor:'#e2e8f0',alignItems:'center',justifyContent:'center'}, stepActive:{backgroundColor:'#047857'}, lesson:{backgroundColor:'#f8fafc',borderRadius:22,padding:16,borderWidth:1,borderColor:'#e2e8f0'},
  quizType:{color:'#047857',fontWeight:'900',textAlign:'right'}, summaryTitle:{fontSize:22,fontWeight:'900',color:'#172033',textAlign:'right',marginVertical:10}, summaryText:{color:'#475569',fontWeight:'800',textAlign:'right',lineHeight:25}, point:{flexDirection:'row-reverse',gap:8,alignItems:'center',marginTop:12}, pointText:{flex:1,color:'#172033',fontWeight:'800',textAlign:'right'},
  quizQuestion:{fontSize:22,fontWeight:'900',color:'#172033',marginVertical:12,textAlign:'right',lineHeight:30}, answer:{padding:14,borderRadius:16,backgroundColor:'white',marginBottom:10,borderWidth:1,borderColor:'#e2e8f0'}, correct:{backgroundColor:'#dcfce7',borderColor:'#bbf7d0'}, wrong:{backgroundColor:'#fee2e2',borderColor:'#fecaca'}, answerText:{textAlign:'right',fontWeight:'800',color:'#172033'}, explain:{padding:14,borderRadius:18,backgroundColor:'#eef2ff',marginTop:8}, explainTitle:{fontWeight:'900',color:'#3730a3',textAlign:'right'}, explainText:{color:'#3730a3',textAlign:'right',lineHeight:22,marginTop:6,fontWeight:'700'},
  complete:{backgroundColor:'white',borderRadius:30,padding:26,alignItems:'center',borderWidth:1,borderColor:'#e2e8f0'}, completeTitle:{fontSize:34,fontWeight:'900',color:'#172033',marginTop:12}, reward:{backgroundColor:'#fef3c7',borderRadius:24,padding:18,width:'100%',alignItems:'center',marginVertical:18}, rewardBig:{fontSize:32,color:'#92400e',fontWeight:'900'}, rewardSmall:{color:'#92400e',fontWeight:'800',marginTop:4}, secondary:{minHeight:52,borderRadius:18,backgroundColor:'#ecfdf5',alignItems:'center',justifyContent:'center',paddingHorizontal:22,marginTop:10,borderWidth:1,borderColor:'#bbf7d0',width:'100%'}, secondaryText:{color:'#047857',fontWeight:'900'},
  challengeHero:{backgroundColor:'#0f766e',borderRadius:30,padding:22,marginBottom:16}, challengeTitle:{color:'white',fontSize:30,fontWeight:'900',textAlign:'right'}, challengeText:{color:'#ccfbf1',fontWeight:'800',textAlign:'right',marginTop:8,lineHeight:23}, challengeReward:{alignSelf:'flex-end',flexDirection:'row-reverse',gap:8,backgroundColor:'#fef3c7',borderRadius:999,paddingHorizontal:12,paddingVertical:8,marginTop:14}, rewardText:{color:'#92400e',fontWeight:'900'},
  analyticsHero:{backgroundColor:'white',borderRadius:28,padding:22,alignItems:'center',borderWidth:1,borderColor:'#e2e8f0',marginBottom:12}, analyticsBig:{fontSize:52,fontWeight:'900',color:'#047857'}, analyticsText:{color:'#172033',fontWeight:'900',fontSize:18}, analyticsSub:{color:'#64748b',fontWeight:'700',marginTop:6}, analyticsRow:{flexDirection:'row-reverse',alignItems:'center',gap:12,backgroundColor:'white',borderRadius:20,padding:14,marginBottom:10,borderWidth:1,borderColor:'#e2e8f0'}, analyticsIcon:{width:42,height:42,borderRadius:15,backgroundColor:'#dcfce7',alignItems:'center',justifyContent:'center'}, analyticsSubject:{textAlign:'right',fontWeight:'900',color:'#172033'}, analyticsScore:{color:'#047857',fontWeight:'900',minWidth:42},
  rankCard:{backgroundColor:'white',borderRadius:24,padding:16,borderWidth:1,borderColor:'#e2e8f0'}, rankTitle:{fontSize:20,fontWeight:'900',color:'#047857',textAlign:'center',marginBottom:10}, rankRow:{flexDirection:'row-reverse',alignItems:'center',gap:10,paddingVertical:8}, rankNo:{width:30,height:30,borderRadius:15,backgroundColor:'#fef3c7',textAlign:'center',lineHeight:30,color:'#92400e',fontWeight:'900'}, rankName:{flex:1,textAlign:'right',fontWeight:'900',color:'#172033'}, rankXp:{color:'#047857',fontWeight:'900'},
  profile:{alignItems:'center',backgroundColor:'white',borderRadius:28,padding:22,borderWidth:1,borderColor:'#e2e8f0'}, avatar:{width:86,height:86,borderRadius:30,backgroundColor:'#047857',alignItems:'center',justifyContent:'center'}, avatarText:{color:'white',fontSize:36,fontWeight:'900'}, profileName:{fontSize:24,fontWeight:'900',marginTop:12,color:'#172033'}, badgeRow:{flexDirection:'row',flexWrap:'wrap',gap:8,justifyContent:'center'}, badge:{backgroundColor:'#fef3c7',borderRadius:16,padding:10,alignItems:'center',gap:5}, badgeText:{fontSize:12,fontWeight:'900',color:'#92400e'}, setting:{marginTop:10,width:'100%',backgroundColor:'#f8fafc',borderRadius:16,padding:14,flexDirection:'row-reverse',gap:10,alignItems:'center'}, settingText:{flex:1,textAlign:'right',fontWeight:'900',color:'#172033'},
  bottom:{position:'absolute',bottom:0,left:0,right:0,backgroundColor:'white',borderTopWidth:1,borderTopColor:'#e2e8f0',flexDirection:'row-reverse',paddingTop:8,paddingBottom:16,paddingHorizontal:6}, tab:{flex:1,alignItems:'center',gap:3}, tabText:{fontSize:11,fontWeight:'900',color:'#94a3b8'}, tabActive:{color:'#047857'},
});