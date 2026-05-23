import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { demoQuestions, demoSummary, loadPackQuestions, loadPackSummary } from './studentData';
import { savePackCompletion, saveQuizAttempt } from './progressService';
import SectionProgressDots from './SectionProgressDots';
import PaywallScreen from './PaywallScreen';
import { getNextSectionId, getSectionIndex, markSectionComplete } from './learningFlowService';

function normalizeQuestion(raw, index = 0) {
  const type = String(raw?.type || raw?.questionType || 'MCQ').toUpperCase();
  const options = Array.isArray(raw?.options) && raw.options.length
    ? raw.options
    : type === 'TF'
      ? ['صح', 'خطأ']
      : ['فهم المفهوم وتطبيقه', 'حفظ الكلمات فقط', 'تخطي التدريب', 'عدم المراجعة'];

  const foundAnswer = options.findIndex((item) => item === raw?.answer || item === raw?.correctAnswer);

  const answerIndex = Number.isInteger(raw?.answerIndex)
    ? raw.answerIndex
    : Number.isInteger(raw?.correctIndex)
      ? raw.correctIndex
      : foundAnswer;

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
  const typeMap = {
    mcq: 'MCQ',
    fib: 'FIB',
    tf: 'TF',
    hoq: 'HOQ',
  };

  const normalized = (questions?.length ? questions : demoQuestions).map(normalizeQuestion);

  return normalized.find((item) => item.type === typeMap[stepId]) || normalized[0] || normalizeQuestion(demoQuestions[0]);
}

export default function LearningPackFlowV2({
  pack,
  student,
  goBack,
  flowSteps,
  styles,
  Button,
  Back,
  SummaryStep,
  QuestionStep,
  Completion,
  Locked,
}) {
  const [activeSectionId, setActiveSectionId] = useState('summary');
  const [selected, setSelected] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [summary, setSummary] = useState(demoSummary);
  const [questions, setQuestions] = useState(demoQuestions);
  const [contentLoading, setContentLoading] = useState(false);
  const [attempts, setAttempts] = useState({});
  const [completedSectionIds, setCompletedSectionIds] = useState([]);

  const stepIndex = getSectionIndex(activeSectionId);
  const step = flowSteps[stepIndex] || flowSteps[0];
  const currentQuestion = getQuestionForStep(questions, step.id);
  const percent = completed ? 100 : Math.round((stepIndex / flowSteps.length) * 100);

  useEffect(() => {
    let active = true;

    setContentLoading(true);
    setSummary(demoSummary);
    setQuestions(demoQuestions);
    setAttempts({});
    setActiveSectionId('summary');
    setCompletedSectionIds([]);
    setSelected(null);
    setCompleted(false);

    Promise.all([
      loadPackSummary(pack.id),
      loadPackQuestions(pack.id),
    ])
      .then(([nextSummary, nextQuestions]) => {
        if (!active) return;

        setSummary(nextSummary || demoSummary);
        setQuestions(Array.isArray(nextQuestions) && nextQuestions.length ? nextQuestions : demoQuestions);
      })
      .catch(() => {
        if (!active) return;

        setSummary(demoSummary);
        setQuestions(demoQuestions);
      })
      .finally(() => {
        if (active) setContentLoading(false);
      });

    return () => {
      active = false;
    };
  }, [pack.id]);

  const chooseAnswer = (index) => {
    if (selected !== null) return;

    setSelected(index);

    const isCorrect = index === currentQuestion.answerIndex;

    setAttempts((current) => ({
      ...current,
      [currentQuestion.id]: {
        isCorrect,
        questionType: currentQuestion.type,
      },
    }));

    saveQuizAttempt({
      studentId: student?.id || 'demo-student',
      packId: pack.id,
      questionId: currentQuestion.id,
      questionType: currentQuestion.type,
      subject: pack.subject,
      grade: pack.grade,
      selectedIndex: index,
      answerIndex: currentQuestion.answerIndex,
      isCorrect,
    });
  };

  const finishPack = () => {
    const values = Object.values(attempts);
    const correctCount = values.filter((item) => item.isCorrect).length;

    savePackCompletion({
      studentId: student?.id || 'demo-student',
      studentName: student?.name,
      packId: pack.id,
      subject: pack.subject,
      grade: pack.grade,
      xpEarned: pack.xp || 120,
      correctCount,
      totalQuestions: values.length,
    });

    setCompleted(true);
  };

  const next = () => {
    setSelected(null);

    const nextCompleted = markSectionComplete(completedSectionIds, step.id);
    setCompletedSectionIds(nextCompleted);

    const nextSectionId = getNextSectionId(step.id);

    if (!nextSectionId) {
      finishPack();
      return;
    }

    setActiveSectionId(nextSectionId);
  };

  const selectSection = (sectionId) => {
    setSelected(null);
    setActiveSectionId(sectionId);
  };

  if (pack.locked) {
    return (
      <PaywallScreen
        studentId={student?.id || 'demo-student'}
        onDone={goBack}
        onBack={goBack}
        styles={styles}
      />
    );
  }

  if (completed) {
    return (
      <Completion
        pack={pack}
        goBack={goBack}
        restart={() => {
          setCompleted(false);
          setActiveSectionId('summary');
          setCompletedSectionIds([]);
          setAttempts({});
        }}
      />
    );
  }

  return (
    <View>
      <Back onPress={goBack} />

      <View style={styles.detail}>
        {contentLoading && (
          <Text style={styles.loadingInline}>جاري تحميل محتوى الحزمة...</Text>
        )}

        <View style={styles.bigIcon}>
          <Ionicons name="book" size={32} color="#047857" />
        </View>

        <Text style={styles.detailTitle}>{pack.title}</Text>
        <Text style={styles.packMeta}>{pack.grade} • {pack.subject}</Text>

        <View style={styles.bar}>
          <View style={[styles.fill, { width: `${percent}%` }]} />
        </View>

        <Text style={styles.progress}>تقدم الحزمة: {percent}%</Text>

        <SectionProgressDots
          flowSteps={flowSteps}
          stepIndex={stepIndex}
          completedSectionIds={completedSectionIds}
          onSelectSection={selectSection}
          styles={styles}
        />

        <View style={styles.lesson}>
          {step.id === 'summary'
            ? <SummaryStep pack={pack} summary={summary} />
            : <QuestionStep selected={selected} setSelected={chooseAnswer} type={step.label} questionData={currentQuestion} />}
        </View>

        <Button
          title={stepIndex === flowSteps.length - 1 ? 'إنهاء الحزمة' : 'التالي'}
          onPress={next}
        />
      </View>
    </View>
  );
}
