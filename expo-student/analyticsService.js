import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from './firebase';

export async function loadLeaderboard(grade = null) {
  try {
    const base = collection(db, 'students');
    const q = grade
      ? query(base, where('grade', '==', grade), orderBy('xp', 'desc'), limit(20))
      : query(base, orderBy('xp', 'desc'), limit(20));

    const snap = await getDocs(q);
    return snap.docs.map((item, index) => ({
      rank: index + 1,
      id: item.id,
      ...item.data(),
    }));
  } catch (error) {
    console.warn('Could not load leaderboard:', error.message);
    return [];
  }
}

export async function loadStudentAnalytics(studentId = 'demo-student') {
  try {
    const attemptsSnap = await getDocs(query(collection(db, 'quiz_attempts'), where('studentId', '==', studentId), limit(500)));
    const progressSnap = await getDocs(query(collection(db, 'student_progress'), where('studentId', '==', studentId), limit(200)));

    const attempts = attemptsSnap.docs.map((item) => ({ id: item.id, ...item.data() }));
    const progress = progressSnap.docs.map((item) => ({ id: item.id, ...item.data() }));

    const correct = attempts.filter((item) => item.isCorrect).length;
    const total = attempts.length;
    const accuracy = total ? Math.round((correct / total) * 100) : 0;

    const bySubject = {};
    attempts.forEach((item) => {
      const subject = item.subject || 'General';
      if (!bySubject[subject]) bySubject[subject] = { subject, total: 0, correct: 0, accuracy: 0 };
      bySubject[subject].total += 1;
      if (item.isCorrect) bySubject[subject].correct += 1;
    });

    const subjectStats = Object.values(bySubject).map((item) => ({
      ...item,
      accuracy: item.total ? Math.round((item.correct / item.total) * 100) : 0,
    }));

    return {
      attempts,
      progress,
      accuracy,
      correct,
      total,
      completedPacks: progress.filter((item) => item.status === 'completed').length,
      subjectStats,
      weakSubjects: subjectStats.filter((item) => item.accuracy < 60),
    };
  } catch (error) {
    console.warn('Could not load student analytics:', error.message);
    return {
      attempts: [],
      progress: [],
      accuracy: 0,
      correct: 0,
      total: 0,
      completedPacks: 0,
      subjectStats: [],
      weakSubjects: [],
    };
  }
}
