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
      ? query(base, where('grade', '==', grade), orderBy('order', 'asc'), limit(100))
      : query(base, orderBy('order', 'asc'), limit(100));
    const snap = await getDocs(q);
    return snap.docs.map((item) => ({ id: item.id, ...item.data() }));
  } catch (error) {
    console.warn('Could not load learning packs:', error.message);
    return [];
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
