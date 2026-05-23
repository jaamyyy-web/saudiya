import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from './firebase';

export const demoStudent = {
  id: 'demo-student',
  name: 'أحمد علي',
  grade: 'الصف السابع',
  plan: 'free',
  xp: 1250,
  streak: 8,
  accuracy: 68,
  completedPacks: 12,
  studyTime: '2.5h',
};

export const demoSummary = {
  title: 'ملخص الحزمة',
  body: 'اقرأ الفكرة الأساسية، ثم انتقل إلى الأسئلة لتثبيت الفهم. الهدف ليس الحفظ فقط، بل فهم المفهوم وتطبيقه.',
  points: ['افهم المفهوم قبل الحفظ.', 'راجع الأمثلة القصيرة.', 'أجب بدون استعجال.'],
};

export const demoQuestions = [
  {
    id: 'demo-mcq-1',
    type: 'MCQ',
    question: 'ما الفكرة الأساسية في هذا الدرس؟',
    options: ['فهم المفهوم وتطبيقه', 'حفظ الكلمات فقط', 'تخطي التدريب', 'عدم المراجعة'],
    answerIndex: 0,
    explanation: 'الفهم الصحيح يعني معرفة المعنى ثم استخدامه في سؤال جديد.',
  },
  {
    id: 'demo-fib-1',
    type: 'FIB',
    question: 'الفهم الصحيح يعني معرفة المعنى ثم ____ في سؤال جديد.',
    options: ['تطبيقه', 'نسيانه', 'تركه', 'حذفه'],
    answerIndex: 0,
    explanation: 'التطبيق يساعد الطالب على تثبيت الفكرة.',
  },
  {
    id: 'demo-tf-1',
    type: 'TF',
    question: 'المراجعة القصيرة اليومية تساعد على تثبيت المعلومة.',
    options: ['صح', 'خطأ'],
    answerIndex: 0,
    explanation: 'المراجعة اليومية القصيرة أفضل من الحفظ المتأخر.',
  },
  {
    id: 'demo-hoq-1',
    type: 'HOQ',
    question: 'كيف يمكن استخدام هذا الدرس في حياتك اليومية؟',
    options: ['أطبقه في موقف عملي', 'أحفظه فقط', 'أتجاهله', 'أترك التدريب'],
    answerIndex: 0,
    explanation: 'السؤال العالي يساعد الطالب على ربط الدرس بالحياة اليومية.',
  },
];

export async function loadStudentProfile(studentId = 'demo-student') {
  try {
    const snap = await getDoc(doc(db, 'students', studentId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : demoStudent;
  } catch (error) {
    console.warn('Using demo student profile:', error.message);
    return demoStudent;
  }
}

export async function loadLearningPacks(grade = null) {
  try {
    const base = collection(db, 'learning_packs');
    const q = grade
      ? query(base, where('grade', '==', grade), where('status', '==', 'published'), orderBy('order', 'asc'), limit(100))
      : query(base, where('status', '==', 'published'), orderBy('order', 'asc'), limit(100));
    const snap = await getDocs(q);
    return snap.docs.map((item) => ({ id: item.id, ...item.data() }));
  } catch (error) {
    console.warn('Could not load learning packs:', error.message);
    return [];
  }
}

export async function loadPackSummary(packId) {
  try {
    const q = query(collection(db, 'summaries'), where('packId', '==', packId), where('status', '==', 'published'), limit(1));
    const snap = await getDocs(q);
    return snap.empty ? demoSummary : { id: snap.docs[0].id, ...snap.docs[0].data() };
  } catch (error) {
    console.warn('Could not load pack summary:', error.message);
    return demoSummary;
  }
}

export async function loadPackQuestions(packId) {
  try {
    const q = query(collection(db, 'questions'), where('packId', '==', packId), where('status', '==', 'published'), orderBy('order', 'asc'), limit(100));
    const snap = await getDocs(q);
    const questions = snap.docs.map((item) => ({ id: item.id, ...item.data() }));
    return questions.length ? questions : demoQuestions;
  } catch (error) {
    console.warn('Could not load pack questions:', error.message);
    return demoQuestions;
  }
}

export async function loadStudentProgress(studentId = 'demo-student') {
  try {
    const q = query(collection(db, 'student_progress'), where('studentId', '==', studentId), limit(200));
    const snap = await getDocs(q);
    return snap.docs.map((item) => ({ id: item.id, ...item.data() }));
  } catch (error) {
    console.warn('Could not load student progress:', error.message);
    return [];
  }
}
