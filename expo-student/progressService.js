import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { updateStudentStats } from './studentStatsService';

export async function saveQuizAttempt(data) {
  try {
    await addDoc(collection(db, 'quiz_attempts'), {
      studentId: data.studentId || 'demo-student',
      packId: data.packId || null,
      questionId: data.questionId || null,
      questionType: data.questionType || 'MCQ',
      subject: data.subject || null,
      grade: data.grade || null,
      selectedIndex: data.selectedIndex,
      answerIndex: data.answerIndex,
      isCorrect: Boolean(data.isCorrect),
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn('Could not save quiz attempt:', error.message);
  }
}

export async function savePackCompletion(data) {
  try {
    await addDoc(collection(db, 'student_progress'), {
      studentId: data.studentId || 'demo-student',
      packId: data.packId || null,
      subject: data.subject || null,
      grade: data.grade || null,
      status: 'completed',
      progress: 100,
      xpEarned: data.xpEarned || 120,
      correctCount: data.correctCount || 0,
      totalQuestions: data.totalQuestions || 0,
      completedAt: serverTimestamp(),
    });

    await updateStudentStats(data);
  } catch (error) {
    console.warn('Could not save pack completion:', error.message);
  }
}
