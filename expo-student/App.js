import React, { useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { I18nManager, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

I18nManager.allowRTL(true);

const subjects = [
  ['islamic', 'الدراسات الإسلامية', 'moon', 86],
  ['arabic', 'اللغة العربية', 'language', 74],
  ['english', 'اللغة الإنجليزية', 'text', 61],
  ['math', 'الرياضيات', 'calculator', 52],
  ['science', 'العلوم', 'flask', 58],
  ['social', 'الدراسات الاجتماعية', 'earth', 79],
  ['digital', 'المهارات الرقمية', 'laptop', 68],
  ['life', 'المهارات الحياتية والأسرية', 'home', 72],
  ['art', 'التربية الفنية', 'color-palette', 91],
  ['health', 'التربية البدنية والصحية', 'fitness', 83],
  ['thinking', 'التفكير الناقد', 'bulb', 49],
].map(([id, ar, icon, score]) => ({ id, ar, icon, score }));

const grades = ['الصف السابع', 'الصف الثامن', 'الصف التاسع'];
const packs = grades.flatMap((grade, g) => subjects.map((s, i) => ({
  id: `${g}-${s.id}`,
  grade,
  subject: s.ar,
  subjectId: s.id,
  title: `${s.ar} - حزمة التعلم ${g + 1}`,
  progress: i % 4 === 0 ? 0 : 20 + ((g + i) * 11) % 75,
  locked: i > 5 && g > 0,
  xp: 120,
})));

const tabs = [
  ['home', 'الرئيسية', 'home'],
  ['packs', 'الحزم', 'book'],
  ['challenge', 'التحدي', 'flash'],
  ['analytics', 'التحليلات', 'stats-chart'],
  ['profile', 'حسابي', 'person'],
].map(([id, label, icon]) => ({ id, label, icon }));

const flowSteps = [
  ['summary', 'الملخص', 'document-text'],
  ['mcq', 'MCQ', 'checkmark-circle'],
  ['fib', 'املأ الفراغ', 'create'],
  ['tf', 'صح / خطأ', 'help-circle'],
  ['hoq', 'أسئلة تفكير', 'bulb'],
].map(([id, label, icon]) => ({ id, label, icon }));

const leaders = ['سارة محمد', 'أحمد علي', 'نورة صالح', 'فهد خالد', 'ليان عبدالله'];
const baseQuestion = {
  question: 'ما الفكرة الأساسية في هذا الدرس؟',
  options: ['فهم المفهوم وتطبيقه', 'حفظ الكلمات فقط', 'تخطي التدريب', 'عدم المراجعة'],
  answer: 0,
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
        <View style={styles.app}>
          <Header />
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {tab === 'home' && <Home openPacks={openPacks} openTab={openTab} />}
            {tab === 'packs' && <Packs selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject} selectedPack={selectedPack} setSelectedPack={setSelectedPack} />}
            {tab === 'challenge' && <Challenge />}
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
  return <SafeAreaProvider><SafeAreaView style={styles.safe}><View style={styles.center}><View style={styles.logo}><Text style={styles.logoText}>س</Text></View><Text style={styles.splashTitle}>Saudi Edu</Text><Text style={styles.muted}>تعلم بذكاء، اختبر نفسك، وتقدم كل يوم</Text><Button title="ابدأ الآن" onPress={onStart} /></View></SafeAreaView></SafeAreaProvider>;
}

function Login({ onLogin }) {
  return <SafeAreaProvider><SafeAreaView style={styles.safe}><View style={styles.login}><Text style={styles.title}>مرحباً بك</Text><Text style={styles.muted}>سجل الدخول لمتابعة التعلم</Text><View style={styles.card}><Social icon="logo-google" title="الدخول بواسطة Google" onPress={onLogin} /><Social icon="logo-apple" title="الدخول بواسطة Apple" onPress={onLogin} /><Button title="دخول تجريبي" onPress={onLogin} /></View></View></SafeAreaView></SafeAreaProvider>;
}

function Social({ icon, title, onPress }) { return <TouchableOpacity style={styles.social} onPress={onPress}><Ionicons name={icon} size={21} /><Text style={styles.socialText}>{title}</Text></TouchableOpacity>; }
function Header() { return <View style={styles.header}><View><Text style={styles.green}>مرحباً أحمد</Text><Text style={styles.headerTitle}>استمر في التعلم</Text></View><View style={styles.coin}><Ionicons name="diamond" size={16} color="#d97706" /><Text style={styles.coinText}>1250</Text></View></View>; }
function Button({ title, onPress, gold }) { return <TouchableOpacity style={[styles.btn, gold && styles.goldBtn]} onPress={onPress}><Text style={styles.btnText}>{title}</Text></TouchableOpacity>; }
function SectionTitle({ title }) { return <Text style={styles.section}>{title}</Text>; }
function MiniStat({ title, value }) { return <View style={styles.mini}><Text style={styles.miniValue}>{value}</Text><Text style={styles.miniLabel}>{title}</Text></View>; }
function Tip({ text }) { return <View style={styles.tip}><Ionicons name="sparkles" size={18} color="#4338ca" /><Text style={styles.tipText}>{text}</Text></View>; }

function Home({ openPacks, openTab }) {
  return <View><View style={styles.hero}><Text style={styles.heroTitle}>أكمل رحلتك التعليمية اليوم</Text><Text style={styles.heroText}>اقتراح ذكي: راجع الرياضيات والعلوم اليوم</Text><TouchableOpacity style={styles.whiteBtn} onPress={() => openTab('challenge')}><Text style={styles.whiteBtnText}>ابدأ تحدي اليوم</Text></TouchableOpacity></View><View style={styles.row}><MiniStat title="الدقة" value="68%" /><MiniStat title="الحزم" value="12" /><MiniStat title="السلسلة" value="8" /></View><SectionTitle title="أكمل من حيث توقفت" /><PackCard pack={packs[0]} onPress={() => openPacks(packs[0].subjectId)} /><SectionTitle title="اقتراحات ذكية" /><Tip text="راجع الرياضيات 10 دقائق اليوم؛ نتيجتك أقل من 60%." /><Tip text="أكمل حزمة العلوم لتحصل على +50 XP." /><SectionTitle title="كل المواد" /><SubjectGrid onPress={openPacks} /></View>;
}

function SubjectGrid({ onPress }) {
  return <View style={styles.grid}>{subjects.map(s => <TouchableOpacity key={s.id} style={styles.subject} onPress={() => onPress(s.id)}><Ionicons name={s.icon} size={18} color="#047857" /><Text style={styles.subjectText}>{s.ar}</Text></TouchableOpacity>)}</View>;
}

function Packs({ selectedSubject, setSelectedSubject, selectedPack, setSelectedPack }) {
  const filtered = useMemo(() => selectedSubject ? packs.filter(p => p.subjectId === selectedSubject) : packs, [selectedSubject]);
  if (selectedPack) return <LearningPackFlow pack={selectedPack} goBack={() => setSelectedPack(null)} />;
  return <View><SectionTitle title="حزم التعلم" /><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>{[{ id: null, ar: 'الكل' }, ...subjects].map(item => <TouchableOpacity key={item.id || 'all'} style={[styles.filter, selectedSubject === item.id && styles.filterActive]} onPress={() => setSelectedSubject(item.id)}><Text style={[styles.filterText, selectedSubject === item.id && styles.filterTextActive]}>{item.ar}</Text></TouchableOpacity>)}</ScrollView>{filtered.map(pack => <PackCard key={pack.id} pack={pack} onPress={() => setSelectedPack(pack)} />)}</View>;
}

function PackCard({ pack, onPress }) {
  return <TouchableOpacity style={styles.pack} onPress={onPress}><View style={styles.packTop}><View style={styles.packIcon}><Ionicons name={pack.locked ? 'lock-closed' : 'book'} size={20} color="#047857" /></View><View style={{ flex: 1 }}><Text style={styles.packTitle}>{pack.title}</Text><Text style={styles.packMeta}>{pack.grade} • {pack.subject}</Text></View></View><View style={styles.bar}><View style={[styles.fill, { width: `${pack.progress}%` }]} /></View><Text style={styles.progress}>{pack.locked ? 'مغلق - يحتاج Premium' : `اكتمل ${pack.progress}%`}</Text></TouchableOpacity>;
}

function LearningPackFlow({ pack, goBack }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [completed, setCompleted] = useState(false);
  const step = flowSteps[stepIndex];
  const percent = completed ? 100 : Math.round((stepIndex / flowSteps.length) * 100);
  const next = () => { setSelected(null); stepIndex >= flowSteps.length - 1 ? setCompleted(true) : setStepIndex(stepIndex + 1); };
  if (pack.locked) return <Locked goBack={goBack} />;
  if (completed) return <Completion pack={pack} goBack={goBack} restart={() => { setCompleted(false); setStepIndex(0); }} />;
  return <View><Back onPress={goBack} /><View style={styles.detail}><View style={styles.bigIcon}><Ionicons name="book" size={32} color="#047857" /></View><Text style={styles.detailTitle}>{pack.title}</Text><Text style={styles.packMeta}>{pack.grade} • {pack.subject}</Text><View style={styles.bar}><View style={[styles.fill, { width: `${percent}%` }]} /></View><Text style={styles.progress}>تقدم الحزمة: {percent}%</Text><View style={styles.stepRow}>{flowSteps.map((item, i) => <View key={item.id} style={[styles.stepDot, i <= stepIndex && styles.stepActive]}><Ionicons name={item.icon} size={15} color={i <= stepIndex ? 'white' : '#94a3b8'} /></View>)}</View><View style={styles.lesson}>{step.id === 'summary' ? <SummaryStep pack={pack} /> : <QuestionStep selected={selected} setSelected={setSelected} type={step.label} />}</View><Button title={stepIndex === flowSteps.length - 1 ? 'إنهاء الحزمة' : 'التالي'} onPress={next} /></View></View>;
}

function Back({ onPress }) { return <TouchableOpacity style={styles.back} onPress={onPress}><Ionicons name="arrow-forward" size={18} color="#047857" /><Text style={styles.backText}>رجوع</Text></TouchableOpacity>; }
function Locked({ goBack }) { return <View><Back onPress={goBack} /><View style={styles.locked}><Ionicons name="lock-closed" size={52} color="#d97706" /><Text style={styles.detailTitle}>هذه الحزمة Premium</Text><Text style={styles.centerText}>افتح الخطة المدفوعة للوصول إلى الملخص والاختبارات الكاملة.</Text><Button title="افتح Premium" gold /></View></View>; }
function SummaryStep({ pack }) { return <View><Text style={styles.quizType}>الملخص</Text><Text style={styles.summaryTitle}>{pack.subject}</Text><Text style={styles.summaryText}>اقرأ الفكرة الأساسية، ثم انتقل إلى الأسئلة لتثبيت الفهم. الهدف ليس الحفظ فقط، بل فهم المفهوم وتطبيقه.</Text>{['افهم المفهوم قبل الحفظ.', 'راجع الأمثلة القصيرة.', 'أجب بدون استعجال.'].map(x => <View key={x} style={styles.point}><Ionicons name="checkmark-circle" size={19} color="#047857" /><Text style={styles.pointText}>{x}</Text></View>)}</View>; }

function QuestionStep({ type, selected, setSelected }) {
  const options = type === 'صح / خطأ' ? ['صح', 'خطأ'] : baseQuestion.options;
  const answer = 0;
  const answered = selected !== null;
  const question = type === 'املأ الفراغ' ? 'الفهم الصحيح يعني معرفة المعنى ثم ____ في سؤال جديد.' : type === 'أسئلة تفكير' ? 'كيف يمكن استخدام هذا الدرس في حياتك اليومية؟' : baseQuestion.question;
  return <View><Text style={styles.quizType}>{type}</Text><Text style={styles.quizQuestion}>{question}</Text>{options.map((o, i) => <TouchableOpacity key={o} onPress={() => setSelected(i)} style={[styles.answer, answered && i === answer && styles.correct, answered && selected === i && i !== answer && styles.wrong]}><Text style={styles.answerText}>{o}</Text></TouchableOpacity>)}{answered && <View style={styles.explain}><Text style={styles.explainTitle}>الشرح</Text><Text style={styles.explainText}>الإجابة الصحيحة تساعدك على فهم الفكرة وليس حفظها فقط.</Text></View>}</View>;
}

function Completion({ pack, goBack, restart }) {
  return <View><View style={styles.complete}><Ionicons name="trophy" size={64} color="#d97706" /><Text style={styles.completeTitle}>أحسنت!</Text><Text style={styles.centerText}>أكملت {pack.title}</Text><View style={styles.reward}><Text style={styles.rewardBig}>+{pack.xp} XP</Text><Text style={styles.rewardSmall}>تمت إضافة النقاط إلى حسابك</Text></View><Button title="إعادة التدريب" onPress={restart} /><TouchableOpacity style={styles.secondary} onPress={goBack}><Text style={styles.secondaryText}>العودة للحزم</Text></TouchableOpacity></View></View>;
}

function Challenge() {
  const [selected, setSelected] = useState(null);
  return <View><View style={styles.challengeHero}><Text style={styles.challengeTitle}>تحدي اليوم</Text><Text style={styles.challengeText}>3 أسئلة من نقاطك الضعيفة: الرياضيات والعلوم</Text><View style={styles.challengeReward}><Ionicons name="gift" size={18} color="#92400e" /><Text style={styles.rewardText}>+50 XP عند الإكمال</Text></View></View><View style={styles.card}><QuestionStep type="MCQ" selected={selected} setSelected={setSelected} />{selected !== null && <Button title="سؤال جديد" onPress={() => setSelected(null)} />}</View></View>;
}

function Analytics({ openPacks }) {
  const weak = subjects.filter(s => s.score < 60);
  return <View><SectionTitle title="تقدّمك الدراسي" /><View style={styles.analyticsHero}><Text style={styles.analyticsBig}>68%</Text><Text style={styles.analyticsText}>متوسط الدقة هذا الأسبوع</Text><Text style={styles.analyticsSub}>تحسن +12% مقارنة بالأسبوع الماضي</Text></View><View style={styles.row}><MiniStat title="وقت الدراسة" value="2.5h" /><MiniStat title="حزم مكتملة" value="12" /><MiniStat title="إجابات صحيحة" value="148" /></View><SectionTitle title="ترتيبك بين الطلاب" /><View style={styles.rankCard}><Text style={styles.rankTitle}>#12 في الصف السابع</Text>{leaders.map((name, i) => <View key={name} style={styles.rankRow}><Text style={styles.rankNo}>{i + 1}</Text><Text style={styles.rankName}>{name}</Text><Text style={styles.rankXp}>{980 - i * 90} XP</Text></View>)}</View><SectionTitle title="أداء المواد" />{subjects.map(s => <TouchableOpacity key={s.id} style={styles.analyticsRow} onPress={() => openPacks(s.id)}><View style={styles.analyticsIcon}><Ionicons name={s.icon} size={19} color="#047857" /></View><View style={{ flex: 1 }}><Text style={styles.analyticsSubject}>{s.ar}</Text><View style={styles.bar}><View style={[styles.fill, { width: `${s.score}%`, backgroundColor: s.score < 60 ? '#d97706' : '#047857' }]} /></View></View><Text style={styles.analyticsScore}>{s.score}%</Text></TouchableOpacity>)}<SectionTitle title="نقاط تحتاج مراجعة" />{weak.map(s => <Tip key={s.id} text={`راجع ${s.ar}: النتيجة الحالية ${s.score}%.`} />)}</View>;
}

function Profile() {
  return <View><SectionTitle title="حسابي" /><View style={styles.profile}><View style={styles.avatar}><Text style={styles.avatarText}>أ</Text></View><Text style={styles.profileName}>أحمد علي</Text><Text style={styles.muted}>الصف السابع • الخطة المجانية</Text><View style={styles.row}><MiniStat title="XP" value="1250" /><MiniStat title="Streak" value="8" /><MiniStat title="Progress" value="72%" /></View><SectionTitle title="الشارات والشهادات" /><View style={styles.badgeRow}>{['المجتهد', 'سلسلة 7 أيام', 'متقن MCQ'].map(x => <View key={x} style={styles.badge}><Ionicons name="ribbon" size={20} color="#d97706" /><Text style={styles.badgeText}>{x}</Text></View>)}</View>{['اللغة: العربية', 'التنبيهات', 'وضع ولي الأمر', 'إدارة الأجهزة'].map((x, i) => <TouchableOpacity key={x} style={styles.setting}><Ionicons name={['language','notifications','people','phone-portrait'][i]} size={19} color="#047857" /><Text style={styles.settingText}>{x}</Text></TouchableOpacity>)}<Button title="ترقية إلى Premium" gold /></View></View>;
}

function BottomNav({ tab, setTab }) { return <View style={styles.bottom}>{tabs.map(item => <TouchableOpacity key={item.id} style={styles.tab} onPress={() => setTab(item.id)}><Ionicons name={item.icon} size={22} color={tab === item.id ? '#047857' : '#94a3b8'} /><Text style={[styles.tabText, tab === item.id && styles.tabActive]}>{item.label}</Text></TouchableOpacity>)}</View>; }

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:'#f5f7fb'},app:{flex:1,backgroundColor:'#f5f7fb'},content:{padding:18,paddingBottom:110},center:{flex:1,alignItems:'center',justifyContent:'center',padding:28,backgroundColor:'#ecfdf5'},logo:{width:92,height:92,borderRadius:30,backgroundColor:'#047857',alignItems:'center',justifyContent:'center',marginBottom:18},logoText:{color:'white',fontSize:44,fontWeight:'900'},splashTitle:{fontSize:38,fontWeight:'900',color:'#172033'},muted:{color:'#64748b',fontWeight:'700',marginTop:6,textAlign:'center'},login:{flex:1,justifyContent:'center',padding:22},title:{fontSize:34,fontWeight:'900',color:'#172033',textAlign:'right'},card:{backgroundColor:'white',borderRadius:28,padding:18,marginTop:18,gap:12,borderWidth:1,borderColor:'#e2e8f0'},social:{height:52,borderRadius:18,borderWidth:1,borderColor:'#e2e8f0',alignItems:'center',justifyContent:'center',flexDirection:'row',gap:10},socialText:{fontWeight:'900',color:'#172033'},btn:{minHeight:52,borderRadius:18,backgroundColor:'#047857',alignItems:'center',justifyContent:'center',paddingHorizontal:22,marginTop:12},goldBtn:{backgroundColor:'#d97706'},btnText:{color:'white',fontWeight:'900',fontSize:16},header:{paddingHorizontal:18,paddingTop:8,paddingBottom:12,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},green:{color:'#047857',fontWeight:'900',textAlign:'right'},headerTitle:{fontSize:24,fontWeight:'900',color:'#172033'},coin:{flexDirection:'row',gap:6,alignItems:'center',backgroundColor:'#fef3c7',paddingHorizontal:12,height:38,borderRadius:19},coinText:{color:'#92400e',fontWeight:'900'},hero:{backgroundColor:'#047857',borderRadius:30,padding:22,marginBottom:18},heroTitle:{color:'white',fontSize:28,fontWeight:'900',textAlign:'right',lineHeight:36},heroText:{color:'#ccfbf1',fontWeight:'800',marginVertical:10,textAlign:'right'},whiteBtn:{backgroundColor:'white',borderRadius:16,height:46,alignItems:'center',justifyContent:'center',marginTop:10},whiteBtnText:{color:'#047857',fontWeight:'900'},section:{fontSize:24,fontWeight:'900',color:'#172033',marginVertical:14,textAlign:'right'},row:{flexDirection:'row',gap:10,marginBottom:6},mini:{flex:1,backgroundColor:'white',borderRadius:20,padding:14,alignItems:'center',borderWidth:1,borderColor:'#e2e8f0'},miniValue:{fontSize:20,fontWeight:'900',color:'#047857'},miniLabel:{color:'#64748b',fontSize:12,fontWeight:'800',marginTop:4},tip:{flexDirection:'row-reverse',gap:10,alignItems:'center',backgroundColor:'#eef2ff',borderRadius:18,padding:14,marginBottom:10},tipText:{flex:1,textAlign:'right',color:'#3730a3',fontWeight:'800',lineHeight:22},grid:{flexDirection:'row',flexWrap:'wrap',gap:10},subject:{backgroundColor:'white',borderRadius:18,padding:14,minWidth:'47%',flexDirection:'row-reverse',gap:8,alignItems:'center',borderWidth:1,borderColor:'#e2e8f0'},subjectText:{fontWeight:'900',color:'#172033',flex:1,textAlign:'right'},filterRow:{gap:8,paddingVertical:8,flexDirection:'row-reverse'},filter:{paddingHorizontal:14,height:38,borderRadius:19,backgroundColor:'white',justifyContent:'center',borderWidth:1,borderColor:'#e2e8f0'},filterActive:{backgroundColor:'#047857',borderColor:'#047857'},filterText:{color:'#64748b',fontWeight:'900'},filterTextActive:{color:'white'},pack:{backgroundColor:'white',borderRadius:24,padding:16,marginBottom:12,borderWidth:1,borderColor:'#e2e8f0'},packTop:{flexDirection:'row-reverse',gap:12,alignItems:'center'},packIcon:{width:44,height:44,borderRadius:16,backgroundColor:'#dcfce7',alignItems:'center',justifyContent:'center'},packTitle:{fontSize:16,fontWeight:'900',color:'#172033',textAlign:'right'},packMeta:{color:'#64748b',fontWeight:'700',marginTop:4,textAlign:'right'},bar:{height:10,backgroundColor:'#e2e8f0',borderRadius:999,overflow:'hidden',marginTop:14},fill:{height:'100%',backgroundColor:'#047857'},progress:{color:'#64748b',fontSize:12,fontWeight:'800',marginTop:8,textAlign:'right'},back:{flexDirection:'row-reverse',gap:8,alignItems:'center',alignSelf:'flex-end',marginBottom:10},backText:{color:'#047857',fontWeight:'900'},detail:{backgroundColor:'white',borderRadius:28,padding:20,borderWidth:1,borderColor:'#e2e8f0'},locked:{backgroundColor:'white',borderRadius:28,padding:24,alignItems:'center',borderWidth:1,borderColor:'#e2e8f0'},bigIcon:{width:74,height:74,borderRadius:24,backgroundColor:'#dcfce7',alignItems:'center',justifyContent:'center',alignSelf:'flex-end',marginBottom:12},detailTitle:{fontSize:25,fontWeight:'900',color:'#172033',textAlign:'right',lineHeight:34},centerText:{color:'#64748b',fontWeight:'800',textAlign:'center',lineHeight:24,marginTop:8},stepRow:{flexDirection:'row-reverse',gap:8,justifyContent:'center',marginVertical:16},stepDot:{width:34,height:34,borderRadius:17,backgroundColor:'#e2e8f0',alignItems:'center',justifyContent:'center'},stepActive:{backgroundColor:'#047857'},lesson:{backgroundColor:'#f8fafc',borderRadius:22,padding:16,borderWidth:1,borderColor:'#e2e8f0'},quizType:{color:'#047857',fontWeight:'900',textAlign:'right'},summaryTitle:{fontSize:22,fontWeight:'900',color:'#172033',textAlign:'right',marginVertical:10},summaryText:{color:'#475569',fontWeight:'800',textAlign:'right',lineHeight:25},point:{flexDirection:'row-reverse',gap:8,alignItems:'center',marginTop:12},pointText:{flex:1,color:'#172033',fontWeight:'800',textAlign:'right'},quizQuestion:{fontSize:22,fontWeight:'900',color:'#172033',marginVertical:12,textAlign:'right',lineHeight:30},answer:{padding:14,borderRadius:16,backgroundColor:'white',marginBottom:10,borderWidth:1,borderColor:'#e2e8f0'},correct:{backgroundColor:'#dcfce7',borderColor:'#bbf7d0'},wrong:{backgroundColor:'#fee2e2',borderColor:'#fecaca'},answerText:{textAlign:'right',fontWeight:'800',color:'#172033'},explain:{padding:14,borderRadius:18,backgroundColor:'#eef2ff',marginTop:8},explainTitle:{fontWeight:'900',color:'#3730a3',textAlign:'right'},explainText:{color:'#3730a3',textAlign:'right',lineHeight:22,marginTop:6,fontWeight:'700'},complete:{backgroundColor:'white',borderRadius:30,padding:26,alignItems:'center',borderWidth:1,borderColor:'#e2e8f0'},completeTitle:{fontSize:34,fontWeight:'900',color:'#172033',marginTop:12},reward:{backgroundColor:'#fef3c7',borderRadius:24,padding:18,width:'100%',alignItems:'center',marginVertical:18},rewardBig:{fontSize:32,color:'#92400e',fontWeight:'900'},rewardSmall:{color:'#92400e',fontWeight:'800',marginTop:4},secondary:{minHeight:52,borderRadius:18,backgroundColor:'#ecfdf5',alignItems:'center',justifyContent:'center',paddingHorizontal:22,marginTop:10,borderWidth:1,borderColor:'#bbf7d0',width:'100%'},secondaryText:{color:'#047857',fontWeight:'900'},challengeHero:{backgroundColor:'#0f766e',borderRadius:30,padding:22,marginBottom:16},challengeTitle:{color:'white',fontSize:30,fontWeight:'900',textAlign:'right'},challengeText:{color:'#ccfbf1',fontWeight:'800',textAlign:'right',marginTop:8,lineHeight:23},challengeReward:{alignSelf:'flex-end',flexDirection:'row-reverse',gap:8,backgroundColor:'#fef3c7',borderRadius:999,paddingHorizontal:12,paddingVertical:8,marginTop:14},rewardText:{color:'#92400e',fontWeight:'900'},analyticsHero:{backgroundColor:'white',borderRadius:28,padding:22,alignItems:'center',borderWidth:1,borderColor:'#e2e8f0',marginBottom:12},analyticsBig:{fontSize:52,fontWeight:'900',color:'#047857'},analyticsText:{color:'#172033',fontWeight:'900',fontSize:18},analyticsSub:{color:'#64748b',fontWeight:'700',marginTop:6},analyticsRow:{flexDirection:'row-reverse',alignItems:'center',gap:12,backgroundColor:'white',borderRadius:20,padding:14,marginBottom:10,borderWidth:1,borderColor:'#e2e8f0'},analyticsIcon:{width:42,height:42,borderRadius:15,backgroundColor:'#dcfce7',alignItems:'center',justifyContent:'center'},analyticsSubject:{textAlign:'right',fontWeight:'900',color:'#172033'},analyticsScore:{color:'#047857',fontWeight:'900',minWidth:42},rankCard:{backgroundColor:'white',borderRadius:24,padding:16,borderWidth:1,borderColor:'#e2e8f0'},rankTitle:{fontSize:20,fontWeight:'900',color:'#047857',textAlign:'center',marginBottom:10},rankRow:{flexDirection:'row-reverse',alignItems:'center',gap:10,paddingVertical:8},rankNo:{width:30,height:30,borderRadius:15,backgroundColor:'#fef3c7',textAlign:'center',lineHeight:30,color:'#92400e',fontWeight:'900'},rankName:{flex:1,textAlign:'right',fontWeight:'900',color:'#172033'},rankXp:{color:'#047857',fontWeight:'900'},profile:{alignItems:'center',backgroundColor:'white',borderRadius:28,padding:22,borderWidth:1,borderColor:'#e2e8f0'},avatar:{width:86,height:86,borderRadius:30,backgroundColor:'#047857',alignItems:'center',justifyContent:'center'},avatarText:{color:'white',fontSize:36,fontWeight:'900'},profileName:{fontSize:24,fontWeight:'900',marginTop:12,color:'#172033'},badgeRow:{flexDirection:'row',flexWrap:'wrap',gap:8,justifyContent:'center'},badge:{backgroundColor:'#fef3c7',borderRadius:16,padding:10,alignItems:'center',gap:5},badgeText:{fontSize:12,fontWeight:'900',color:'#92400e'},setting:{marginTop:12,width:'100%',flexDirection:'row-reverse',alignItems:'center',gap:10,backgroundColor:'#f8fafc',borderRadius:16,padding:14},settingText:{flex:1,textAlign:'right',fontWeight:'900',color:'#172033'},bottom:{position:'absolute',left:14,right:14,bottom:16,height:74,borderRadius:26,backgroundColor:'white',flexDirection:'row-reverse',justifyContent:'space-around',alignItems:'center',borderWidth:1,borderColor:'#e2e8f0'},tab:{alignItems:'center',gap:4},tabText:{fontSize:11,color:'#94a3b8',fontWeight:'800'},tabActive:{color:'#047857'}
});
