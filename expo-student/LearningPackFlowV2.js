import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { demoQuestions, demoSummary, loadPackQuestions, loadPackSummary } from './studentData';
import { savePackCompletion, saveQuizAttempt } from './progressService';
import SectionProgressDots from './SectionProgressDots';
import PaywallScreen from './PaywallScreen';
import { getNextSectionId, getSectionIndex, markSectionComplete } from './learningFlowService';

function normalizeQuestion(raw, index = 0) {
  const type = String(raw?.type || raw?.questionType || 'MCQ').toUpperCase();
  const options = Array.isArray(raw?.options) && raw.options.length ? raw.options : type === 'TF' ? ['صح', 'خطأ'] : ['فهم المفهوم وتطبيقه', 'حفظ الكلمات فقط', 'تخطي التدريب', 'عدم المراجعة'];
  const foundAnswer = options.findIndex((item) => item === raw?.answer || item === raw?.correctAnswer);
  const answerIndex = Number.isInteger(raw?.answerIndex) ? raw.answerIndex : Number.isInteger(raw?.correctIndex) ? raw.correctIndex : foundAnswer;
  return { id: raw?.id || `question-${index}`, type, question: raw?.question || raw?.prompt || 'ما الفكرة الأساسية في هذا الدرس؟', options, answerIndex: answerIndex >= 0 ? answerIndex : 0, explanation: raw?.explanation || raw?.reason || 'الإجابة الصحيحة تساعدك على فهم الفكرة وليس حفظها فقط.' };
}

function getQuestionForStep(questions, stepId) {
  const typeMap = { mcq: 'MCQ', fib: 'FIB', tf: 'TF', hoq: 'HOQ', comprehensive: 'MCQ' };
  const normalized = (questions?.length ? questions : demoQuestions).map(normalizeQuestion);
  return normalized.find((item) => item.type === typeMap[stepId]) || normalized[0] || normalizeQuestion(demoQuestions[0]);
}

function PackDetailsScreen({ pack, flowSteps, onStart, goBack }) {
  return (
    <View style={localStyles.container}>
      <View style={localStyles.header}>
        <View style={{ width: 24 }} />
        <Text style={localStyles.headerTitle}>تفاصيل الباقة</Text>
        <TouchableOpacity onPress={goBack}>
          <Ionicons name="chevron-forward" size={28} color="#064E3B" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={localStyles.scrollContent}>
        <View style={localStyles.heroCard}>
          <View style={localStyles.heroTop}>
             <Ionicons name="moon" size={32} color="#D97706" style={{position:'absolute', top:10, left:20, opacity:0.8}} />
             <Ionicons name="library" size={70} color="#A7F3D0" style={{alignSelf:'center', marginVertical:10, opacity: 0.9}} />
          </View>
          
          <Text style={localStyles.heroTitle}>{pack.title || 'الباقة الأساسية'}</Text>
          <Text style={localStyles.heroSubtitle}>{pack.subject} - {pack.grade}</Text>
          <Text style={localStyles.heroDesc}>
            باقة متكاملة تساعدك على فهم الدروس وتثبيت المعلومات من خلال أنشطة تفاعلية متنوعة.
          </Text>

          <View style={localStyles.statsRow}>
            <View style={localStyles.statBox}>
              <Ionicons name="star" size={14} color="#D97706" />
              <View style={localStyles.statTextCol}>
                 <Text style={localStyles.statVal}>{flowSteps.length}</Text>
                 <Text style={localStyles.statLabel}>نشاط تعليمي</Text>
              </View>
            </View>
            <View style={localStyles.statBox}>
              <View style={localStyles.xpBadge}><Text style={localStyles.xpText}>XP</Text></View>
              <View style={localStyles.statTextCol}>
                 <Text style={localStyles.statVal}>{pack.xp || 120}</Text>
                 <Text style={localStyles.statLabel}>نقاط الخبرة</Text>
              </View>
            </View>
            <View style={localStyles.statBox}>
              <View style={localStyles.coinBadge}><Ionicons name="logo-bitcoin" size={12} color="#D97706" /></View>
              <View style={localStyles.statTextCol}>
                 <Text style={localStyles.statVal}>{Math.round((pack.xp || 120) * 7.9)}</Text>
                 <Text style={localStyles.statLabel}>عملات</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={localStyles.sectionHeader}>
           <Ionicons name="flower" size={20} color="#D97706" />
           <Text style={localStyles.sectionTitle}>أنشطة الباقة</Text>
        </View>

        {flowSteps.map((step, index) => {
          const isLast = index === flowSteps.length - 1;
          const numStr = (index + 1).toString().padStart(2, '0');
          
          if (isLast) {
            return (
              <View key={step.id} style={localStyles.lastCard}>
                 <View style={localStyles.premiumTag}>
                    <Ionicons name="star" size={10} color="#92400E" />
                    <Text style={localStyles.premiumTagText}>مميز</Text>
                 </View>
                 <View style={localStyles.lastCardInner}>
                    <View style={localStyles.numberCircleGold}>
                       <Text style={localStyles.numberTextGold}>{numStr}</Text>
                    </View>
                    <View style={localStyles.lastIconCircle}>
                       <Ionicons name={step.icon} size={28} color="#D97706" />
                    </View>
                    <View style={localStyles.lastCardContent}>
                       <Text style={localStyles.lastCardTitle}>{step.label}</Text>
                       <Text style={localStyles.lastCardDesc}>{step.desc}</Text>
                    </View>
                 </View>
                 <TouchableOpacity style={localStyles.goldBtn} onPress={() => onStart(step.id)}>
                    <Text style={localStyles.goldBtnText}>ابدأ الاختبار</Text>
                 </TouchableOpacity>
              </View>
            );
          }

          return (
            <View key={step.id} style={localStyles.activityCard}>
               <View style={localStyles.numberCircle}>
                  <Text style={localStyles.numberText}>{numStr}</Text>
               </View>
               <View style={localStyles.activityIconBox}>
                  <Ionicons name={step.icon} size={22} color="#FFFFFF" />
               </View>
               <View style={localStyles.activityContent}>
                  <Text style={localStyles.activityTitle}>{step.label}</Text>
                  <Text style={localStyles.activityDesc}>{step.desc}</Text>
               </View>
               <TouchableOpacity style={localStyles.startBtn} onPress={() => onStart(step.id)}>
                  <Text style={localStyles.startBtnText}>ابدأ</Text>
               </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default function LearningPackFlowV2({ pack, student, goBack, flowSteps, styles, Button, Back, SummaryStep, QuestionStep, Completion, Locked }) {
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [summary, setSummary] = useState(demoSummary);
  const [questions, setQuestions] = useState(demoQuestions);
  const [contentLoading, setContentLoading] = useState(false);
  const [attempts, setAttempts] = useState({});
  const [completedSectionIds, setCompletedSectionIds] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);

  const stepIndex = activeSectionId ? getSectionIndex(activeSectionId) : 0;
  const step = flowSteps[stepIndex] || flowSteps[0];

  // Filter questions that belong to the active step/section
  const sectionQuestions = React.useMemo(() => {
    if (!step || step.id === 'summary') return [];
    
    const typeMap = { mcq: 'MCQ', fib: 'FIB', tf: 'TF', hoq: 'HOQ' };
    const normalized = (questions?.length ? questions : demoQuestions).map(normalizeQuestion);
    
    if (step.id === 'comprehensive') {
      // Comprehensive takes up to 8 questions from all categories for a final review
      return normalized.slice(0, 8);
    }
    
    const targetType = typeMap[step.id];
    return normalized.filter((q) => q.type === targetType);
  }, [questions, step?.id]);

  const currentQuestion = sectionQuestions[questionIndex] || sectionQuestions[0] || normalizeQuestion(demoQuestions[0]);
  
  // Calculate exact completion percentage based on both the sections and the question progress
  const percent = completed ? 100 : Math.round((stepIndex / flowSteps.length) * 100);

  useEffect(() => {
    let active = true;
    setContentLoading(true);
    setSummary(demoSummary);
    setQuestions(demoQuestions);
    setAttempts({});
    setActiveSectionId(null);
    setCompletedSectionIds([]);
    setSelected(null);
    setQuestionIndex(0);
    setCompleted(false);

    Promise.all([loadPackSummary(pack.id), loadPackQuestions(pack.id)]).then(([nextSummary, nextQuestions]) => {
      if (!active) return;
      setSummary(nextSummary || demoSummary);
      setQuestions(Array.isArray(nextQuestions) && nextQuestions.length ? nextQuestions : demoQuestions);
    }).catch(() => {
      if (!active) return;
      setSummary(demoSummary);
      setQuestions(demoQuestions);
    }).finally(() => {
      if (active) setContentLoading(false);
    });

    return () => { active = false; };
  }, [pack.id]);

  const chooseAnswer = (index) => {
    if (selected !== null) return;
    setSelected(index);
    const isCorrect = index === currentQuestion.answerIndex;
    setAttempts((current) => ({ ...current, [currentQuestion.id]: { isCorrect, questionType: currentQuestion.type } }));
    saveQuizAttempt({ studentId: student?.id || 'demo-student', packId: pack.id, questionId: currentQuestion.id, questionType: currentQuestion.type, subject: pack.subject, grade: pack.grade, selectedIndex: index, answerIndex: currentQuestion.answerIndex, isCorrect });
  };

  const finishPack = () => {
    const values = Object.values(attempts);
    const correctCount = values.filter((item) => item.isCorrect).length;
    savePackCompletion({ studentId: student?.id || 'demo-student', studentName: student?.name, packId: pack.id, subject: pack.subject, grade: pack.grade, xpEarned: pack.xp || 120, correctCount, totalQuestions: values.length });
    setCompleted(true);
  };

  const next = () => {
    // If the student is in a quiz section and hasn't answered, don't allow skipping
    if (step.id !== 'summary' && selected === null) {
      return;
    }

    // If there are more questions in the current section, move to the next question
    if (step.id !== 'summary' && questionIndex < sectionQuestions.length - 1) {
      setSelected(null);
      setQuestionIndex((prev) => prev + 1);
      return;
    }

    // Otherwise, move to the next section/step
    setSelected(null);
    setQuestionIndex(0);
    const nextCompleted = markSectionComplete(completedSectionIds, step.id);
    setCompletedSectionIds(nextCompleted);
    const nextSectionId = getNextSectionId(step.id);
    if (!nextSectionId) { finishPack(); return; }
    setActiveSectionId(nextSectionId);
  };

  const selectSection = (sectionId) => { 
    setSelected(null); 
    setQuestionIndex(0);
    setActiveSectionId(sectionId); 
  };

  if (pack.locked) { return <PaywallScreen studentId={student?.id || 'demo-student'} onDone={goBack} onBack={goBack} styles={styles} />; }
  if (completed) { return <Completion pack={pack} goBack={goBack} restart={() => { setCompleted(false); setActiveSectionId(null); setCompletedSectionIds([]); setAttempts({}); setQuestionIndex(0); }} />; }
  if (activeSectionId === null) { return <PackDetailsScreen pack={pack} flowSteps={flowSteps} onStart={selectSection} goBack={goBack} />; }

  const showFinishBtn = stepIndex === flowSteps.length - 1 && (step.id === 'summary' || questionIndex === sectionQuestions.length - 1);

  return (
    <View style={{flex:1}}>
      <Back onPress={() => setActiveSectionId(null)} />
      <View style={styles.detail}>
        {contentLoading && <Text style={styles.loadingInline}>جاري تحميل محتوى الحزمة...</Text>}
        <Text style={styles.detailTitle}>{pack.title}</Text>
        <Text style={styles.packMeta}>{pack.grade} • {pack.subject}</Text>
        <View style={styles.bar}><View style={[styles.fill, { width: `${percent}%` }]} /></View>
        <Text style={styles.progress}>تقدم الحزمة: {percent}%</Text>
        <SectionProgressDots flowSteps={flowSteps} stepIndex={stepIndex} completedSectionIds={completedSectionIds} onSelectSection={selectSection} styles={styles} />
        <View style={styles.lesson}>
          {step.id === 'summary' ? (
            <SummaryStep pack={pack} summary={summary} />
          ) : (
            <QuestionStep 
              selected={selected} 
              setSelected={chooseAnswer} 
              type={`${step.label} (${questionIndex + 1} من ${sectionQuestions.length})`} 
              questionData={currentQuestion} 
            />
          )}
        </View>
        <Button title={showFinishBtn ? 'إنهاء الحزمة' : 'التالي'} onPress={next} />
      </View>
    </View>
  );
}


const localStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF8F5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#064E3B' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  
  heroCard: { backgroundColor: '#064E3B', borderRadius: 24, padding: 24, marginBottom: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 5 },
  heroTop: { alignItems: 'center', marginBottom: 12 },
  heroTitle: { fontSize: 26, fontWeight: '900', color: '#FFFFFF', textAlign: 'right', marginBottom: 6 },
  heroSubtitle: { fontSize: 14, color: '#A7F3D0', textAlign: 'right', marginBottom: 16, fontWeight: 'bold' },
  heroDesc: { fontSize: 13, color: '#D1FAE5', textAlign: 'right', lineHeight: 22, marginBottom: 24 },
  
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statBox: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#047857', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: 'rgba(4, 120, 87, 0.3)' },
  statTextCol: { alignItems: 'center' },
  statVal: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  statLabel: { color: '#A7F3D0', fontSize: 10, fontWeight: 'bold' },
  xpBadge: { backgroundColor: '#047857', borderRadius: 4, paddingHorizontal: 4, paddingVertical: 2 },
  xpText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' },
  coinBadge: { backgroundColor: '#FDE68A', borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  
  sectionHeader: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'flex-start', gap: 8, marginBottom: 16, paddingHorizontal: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#064E3B' },
  
  activityCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 12, flexDirection: 'row-reverse', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: '#F3F4F6' },
  numberCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FAF8F5', alignItems: 'center', justifyContent: 'center', marginLeft: 12, borderWidth: 1, borderColor: '#F3F0EA' },
  numberText: { color: '#D97706', fontSize: 14, fontWeight: '900' },
  activityIconBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#064E3B', alignItems: 'center', justifyContent: 'center', marginLeft: 16 },
  activityContent: { flex: 1, alignItems: 'flex-end' },
  activityTitle: { fontSize: 16, fontWeight: '900', color: '#064E3B', marginBottom: 4, textAlign: 'right' },
  activityDesc: { fontSize: 11, color: '#6B7280', textAlign: 'right', lineHeight: 16 },
  startBtn: { borderWidth: 1, borderColor: '#064E3B', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8, marginLeft: 8 },
  startBtnText: { color: '#064E3B', fontWeight: '900', fontSize: 12 },
  
  lastCard: { backgroundColor: '#064E3B', borderRadius: 24, padding: 20, marginTop: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 4 },
  premiumTag: { position: 'absolute', top: 0, left: 16, backgroundColor: '#FDE68A', flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
  premiumTagText: { color: '#92400E', fontSize: 10, fontWeight: '900' },
  lastCardInner: { flexDirection: 'row-reverse', alignItems: 'center', marginTop: 16 },
  numberCircleGold: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(253, 230, 138, 0.1)', alignItems: 'center', justifyContent: 'center', marginLeft: 12, borderWidth: 1, borderColor: '#D97706' },
  numberTextGold: { color: '#FDE68A', fontSize: 14, fontWeight: '900' },
  lastIconCircle: { width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#D97706', alignItems: 'center', justifyContent: 'center', marginLeft: 16 },
  lastCardContent: { flex: 1, alignItems: 'flex-end' },
  lastCardTitle: { fontSize: 18, fontWeight: '900', color: '#FFFFFF', marginBottom: 4 },
  lastCardDesc: { fontSize: 12, color: '#A7F3D0', textAlign: 'right', lineHeight: 18 },
  goldBtn: { backgroundColor: '#D97706', borderRadius: 14, paddingVertical: 12, alignItems: 'center', marginTop: 20 },
  goldBtnText: { color: '#FFFFFF', fontWeight: '900', fontSize: 15 }
});
