import { collection, doc, getDocs, limit, query, serverTimestamp, where, writeBatch } from 'firebase/firestore';
import { db } from './firebase';

export async function publishPackLive(packId) {
  const batch = writeBatch(db);
  const now = serverTimestamp();

  batch.update(doc(db, 'learning_packs', packId), {
    status: 'published',
    publishedAt: now,
    updatedAt: now,
  });

  const summaries = await getDocs(query(collection(db, 'summaries'), where('packId', '==', packId), limit(20)));
  summaries.forEach((item) => {
    batch.update(item.ref, { status: 'published', publishedAt: now, updatedAt: now });
  });

  const questions = await getDocs(query(collection(db, 'questions'), where('packId', '==', packId), limit(200)));
  questions.forEach((item) => {
    batch.update(item.ref, { status: 'published', publishedAt: now, updatedAt: now });
  });

  await batch.commit();
}

export async function hidePackLive(packId) {
  const batch = writeBatch(db);
  const now = serverTimestamp();

  batch.update(doc(db, 'learning_packs', packId), {
    status: 'hidden',
    updatedAt: now,
  });

  const summaries = await getDocs(query(collection(db, 'summaries'), where('packId', '==', packId), limit(20)));
  summaries.forEach((item) => {
    batch.update(item.ref, { status: 'hidden', updatedAt: now });
  });

  const questions = await getDocs(query(collection(db, 'questions'), where('packId', '==', packId), limit(200)));
  questions.forEach((item) => {
    batch.update(item.ref, { status: 'hidden', updatedAt: now });
  });

  await batch.commit();
}
