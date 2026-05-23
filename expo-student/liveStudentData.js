import { collection, doc, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { demoQuestions, demoStudent, demoSummary } from './studentData';

export function subscribeStudentProfile(studentId = 'demo-student', onData, onError) {
  return onSnapshot(
    doc(db, 'students', studentId),
    (snap) => {
      onData(snap.exists() ? { id: snap.id, ...snap.data() } : demoStudent);
    },
    (error) => {
      console.warn('Student profile listener failed:', error.message);
      onData(demoStudent);
      if (onError) onError(error);
    }
  );
}

export function subscribePublishedLearningPacks({ grade = null, subject = null } = {}, onData, onError) {
  const filters = [where('status', '==', 'published')];
  if (grade) filters.push(where('grade', '==', grade));
  if (subject) filters.push(where('subject', '==', subject));

  const q = query(
    collection(db, 'learning_packs'),
    ...filters,
    orderBy('order', 'asc'),
    limit(100)
  );

  return onSnapshot(
    q,
    (snap) => {
      onData(snap.docs.map((item) => ({ id: item.id, ...item.data() })));
    },
    (error) => {
      console.warn('Learning packs listener failed:', error.message);
      onData([]);
      if (onError) onError(error);
    }
  );
}

export function subscribePackSummary(packId, onData, onError) {
  if (!packId) {
    onData(demoSummary);
    return () => {};
  }

  const q = query(
    collection(db, 'summaries'),
    where('packId', '==', packId),
    where('status', '==', 'published'),
    limit(1)
  );

  return onSnapshot(
    q,
    (snap) => {
      onData(snap.empty ? demoSummary : { id: snap.docs[0].id, ...snap.docs[0].data() });
    },
    (error) => {
      console.warn('Summary listener failed:', error.message);
      onData(demoSummary);
      if (onError) onError(error);
    }
  );
}

export function subscribePackQuestions(packId, onData, onError) {
  if (!packId) {
    onData(demoQuestions);
    return () => {};
  }

  const q = query(
    collection(db, 'questions'),
    where('packId', '==', packId),
    where('status', '==', 'published'),
    orderBy('order', 'asc'),
    limit(100)
  );

  return onSnapshot(
    q,
    (snap) => {
      const questions = snap.docs.map((item) => ({ id: item.id, ...item.data() }));
      onData(questions.length ? questions : demoQuestions);
    },
    (error) => {
      console.warn('Questions listener failed:', error.message);
      onData(demoQuestions);
      if (onError) onError(error);
    }
  );
}

export function subscribeLeaderboard({ grade = null } = {}, onData, onError) {
  const q = grade
    ? query(collection(db, 'students'), where('grade', '==', grade), orderBy('xp', 'desc'), limit(20))
    : query(collection(db, 'students'), orderBy('xp', 'desc'), limit(20));

  return onSnapshot(
    q,
    (snap) => {
      onData(snap.docs.map((item, index) => ({ rank: index + 1, id: item.id, ...item.data() })));
    },
    (error) => {
      console.warn('Leaderboard listener failed:', error.message);
      onData([]);
      if (onError) onError(error);
    }
  );
}

export function subscribeStudentProgress(studentId = 'demo-student', onData, onError) {
  const q = query(
    collection(db, 'student_progress'),
    where('studentId', '==', studentId),
    limit(200)
  );

  return onSnapshot(
    q,
    (snap) => {
      onData(snap.docs.map((item) => ({ id: item.id, ...item.data() })));
    },
    (error) => {
      console.warn('Progress listener failed:', error.message);
      onData([]);
      if (onError) onError(error);
    }
  );
}
