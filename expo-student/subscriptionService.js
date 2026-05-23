import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export function subscribeStudentSubscription(studentId, onData, onError) {
  if (!studentId) {
    onData?.(null);
    return () => {};
  }

  return onSnapshot(
    doc(db, 'subscriptions', studentId),
    (snapshot) => {
      if (!snapshot.exists()) {
        onData?.({
          plan: 'free',
          active: false,
          profilesAllowed: 1,
          quizLimits: {
            mcq: 5,
            fib: 3,
            tf: 2,
          },
        });
        return;
      }

      onData?.({ id: snapshot.id, ...snapshot.data() });
    },
    onError
  );
}

export async function activateDemoPremium(studentId, plan = 'single') {
  if (!studentId) return;

  return setDoc(doc(db, 'subscriptions', studentId), {
    studentId,
    plan,
    active: true,
    provider: 'demo',
    profilesAllowed: plan === 'family' ? 4 : 1,
    premiumUnlocked: true,
    startedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
}
