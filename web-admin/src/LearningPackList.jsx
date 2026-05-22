import React, { useEffect, useState } from 'react';
import { collection, limit, onSnapshot, orderBy, query, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { BookOpen, Eye, EyeOff, FileText, RefreshCw } from 'lucide-react';
import { db } from './firebase';

function formatDate(value) {
  if (!value?.toDate) return 'Just now';
  return value.toDate().toLocaleString();
}

function statusClass(status) {
  if (status === 'published') return 'success';
  if (status === 'draft') return 'warning';
  if (status === 'hidden' || status === 'archived') return 'error';
  return '';
}

export default function LearningPackList() {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');

  useEffect(() => {
    if (!db) {
      setError('Firestore is not connected.');
      setLoading(false);
      return;
    }

    const packsQuery = query(collection(db, 'learning_packs'), orderBy('createdAt', 'desc'), limit(50));
    const unsubscribe = onSnapshot(
      packsQuery,
      (snapshot) => {
        setPacks(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
        setLoading(false);
      },
      (err) => {
        setError(err.message || 'Could not load learning packs. Check Firestore rules.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  async function setPackStatus(packId, status) {
    setBusyId(packId);
    try {
      await updateDoc(doc(db, 'learning_packs', packId), {
        status,
        updatedAt: serverTimestamp(),
      });
    } finally {
      setBusyId('');
    }
  }

  if (loading) {
    return <div className="upload-message uploading"><RefreshCw size={16} /> Loading learning packs...</div>;
  }

  if (error) {
    return <div className="upload-message error">{error}</div>;
  }

  if (packs.length === 0) {
    return <div className="upload-message">No published learning packs yet. Approve and publish an upload first.</div>;
  }

  return (
    <div className="learning-pack-list">
      {packs.map((pack) => {
        const isBusy = busyId === pack.id;
        const status = pack.status || 'draft';
        return (
          <div className="learning-pack-row" key={pack.id}>
            <div className="learning-pack-icon"><BookOpen size={20} /></div>
            <div className="learning-pack-main">
              <div className="upload-row-title">
                <strong>{pack.title || 'Untitled Learning Pack'}</strong>
                <span className={`badge ${statusClass(status)}`}>{status}</span>
              </div>
              <p>{pack.grade} • {pack.subject} • {pack.medium} • {pack.generationStyle || 'Exam Paper'} • {formatDate(pack.createdAt)}</p>
              <p>
                MCQ {pack.questionCounts?.mcq ?? 0} / FIB {pack.questionCounts?.fib ?? 0} / TF {pack.questionCounts?.trueFalse ?? 0} / HOQ {pack.questionCounts?.hoq ?? 0}
              </p>
              <p>Quiz: {pack.quizStatus || 'pending'} • Summary: {pack.summaryStatus || 'pending'}</p>
            </div>
            <div className="upload-row-actions">
              {pack.sourceDownloadURL && (
                <a className="small-link-button" href={pack.sourceDownloadURL} target="_blank" rel="noreferrer">
                  <FileText size={15} /> Source
                </a>
              )}
              <button className="small-button" disabled={isBusy} onClick={() => setPackStatus(pack.id, 'published')}>
                <Eye size={15} /> Show
              </button>
              <button className="small-danger-button" disabled={isBusy} onClick={() => setPackStatus(pack.id, 'hidden')}>
                <EyeOff size={15} /> Hide
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
