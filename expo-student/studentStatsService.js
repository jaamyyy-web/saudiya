import { doc, increment, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export function calculateAccuracy(correctCount = 0, totalQuestions = 0) {
  if (!totalQuestions) return 0;
  return Math.round((correctCount / totalQuestions) * 100);
}

export async function updateStudentStats(data = {}) {
  const studentId = data.studentId || 'demo-student';
  const xpEarned = data.xpEarned || 120;
  const correctCount = data.correctCount || 0;
  const totalQuestions = data.totalQuestions || 0;
  const accuracy = calculateAccuracy(correctCount, totalQuestions);

  return setDoc(doc(db, 'students', studentId), {
    id: studentId,
    name: data.studentName || 'طالب جديد',
    grade: data.grade || null,
    xp: increment(xpEarned),
    completedPacks: increment(1),
    streak: increment(1),
    lastAccuracy: accuracy,
    lastSubject: data.subject || null,
    lastPackId: data.packId || null,
    lastActiveAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
}
