import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export async function createDemoLearningPack() {
  const packRef = await addDoc(collection(db, 'learning_packs'), {
    title: 'الحروف العربية الأساسية',
    grade: 'Grade 7',
    subject: 'Arabic Language',
    medium: 'Arabic',
    difficulty: 'Easy',
    status: 'published',
    order: 1,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await addDoc(collection(db, 'summaries'), {
    packId: packRef.id,
    status: 'published',
    title: 'ملخص الدرس',
    body: 'يتعلم الطالب في هذا الدرس أساسيات الحروف العربية وطريقة استخدامها في الكلمات البسيطة.',
    points: [
      'التعرف على الحروف الأساسية',
      'قراءة الكلمات القصيرة',
      'التدرب على النطق الصحيح'
    ],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const questions = [
    {
      type: 'MCQ',
      question: 'ما أول حرف في اللغة العربية؟',
      options: ['أ', 'ب', 'ت', 'ث'],
      answerIndex: 0,
      explanation: 'حرف الألف هو أول الحروف العربية.',
      difficulty: 'easy',
    },
    {
      type: 'FIB',
      question: 'الحرف الذي يأتي بعد الألف هو ____.',
      options: ['ب', 'ت', 'ث', 'ج'],
      answerIndex: 0,
      explanation: 'الباء يأتي بعد الألف مباشرة.',
      difficulty: 'easy',
    },
    {
      type: 'TF',
      question: 'عدد الحروف العربية 28 حرفاً.',
      options: ['صح', 'خطأ'],
      answerIndex: 0,
      explanation: 'اللغة العربية تحتوي على 28 حرفاً.',
      difficulty: 'easy',
    },
  ];

  for (const [index, question] of questions.entries()) {
    await addDoc(collection(db, 'questions'), {
      packId: packRef.id,
      status: 'published',
      order: index + 1,
      ...question,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  return packRef.id;
}
