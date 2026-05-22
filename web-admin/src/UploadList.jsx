import React, { useEffect, useState } from 'react';
import { collection, limit, onSnapshot, orderBy, query, updateDoc, doc } from 'firebase/firestore';
import { CheckCircle2, ExternalLink, FileText, RefreshCw, XCircle } from 'lucide-react';
import { db } from './firebase';

function formatDate(value) {
  if (!value?.toDate) return 'Just now';
  return value.toDate().toLocaleString();
}

function statusClass(status) {
  if (status === 'approved' || status === 'published') return 'success';
  if (status === 'rejected') return 'error';
  if (status === 'queued_for_review' || status === 'draft') return 'warning';
  return '';
}

export default function UploadList() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!db) {
      setError('Firestore is not connected.');
      setLoading(false);
      return;
    }

    const uploadsQuery = query(collection(db, 'admin_uploads'), orderBy('createdAt', 'desc'), limit(30));
    const unsubscribe = onSnapshot(
      uploadsQuery,
      (snapshot) => {
        setUploads(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
        setLoading(false);
      },
      (err) => {
        setError(err.message || 'Could not load uploads. Check Firestore rules.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  async function updateReviewStatus(uploadId, reviewStatus) {
    await updateDoc(doc(db, 'admin_uploads', uploadId), {
      reviewStatus,
      aiGenerationStatus: reviewStatus === 'approved' ? 'ready_to_publish' : reviewStatus,
      updatedAt: new Date(),
    });
  }

  if (loading) {
    return <div className="upload-message uploading"><RefreshCw size={16} /> Loading uploaded files...</div>;
  }

  if (error) {
    return <div className="upload-message error">{error}</div>;
  }

  if (uploads.length === 0) {
    return <div className="upload-message">No uploaded files yet. Upload a source file to create the first review item.</div>;
  }

  return (
    <div className="upload-list">
      {uploads.map((item) => (
        <div className="upload-row" key={item.id}>
          <div className="upload-file-icon"><FileText size={20} /></div>
          <div className="upload-row-main">
            <div className="upload-row-title">
              <strong>{item.title || item.fileName || 'Untitled upload'}</strong>
              <span className={`badge ${statusClass(item.reviewStatus || item.aiGenerationStatus || item.status)}`}>
                {item.reviewStatus || item.aiGenerationStatus || item.status || 'uploaded'}
              </span>
            </div>
            <p>
              {item.grade} • {item.subject} • {item.medium} • {item.generationStyle || 'Exam Paper'} • {formatDate(item.createdAt)}
            </p>
            <p>
              MCQ {item.questionCounts?.mcq ?? 0} / FIB {item.questionCounts?.fib ?? 0} / TF {item.questionCounts?.trueFalse ?? 0} / HOQ {item.questionCounts?.hoq ?? 0}
            </p>
          </div>
          <div className="upload-row-actions">
            {item.downloadURL && (
              <a className="small-link-button" href={item.downloadURL} target="_blank" rel="noreferrer">
                <ExternalLink size={15} /> File
              </a>
            )}
            <button className="small-button" onClick={() => updateReviewStatus(item.id, 'approved')}>
              <CheckCircle2 size={15} /> Approve
            </button>
            <button className="small-danger-button" onClick={() => updateReviewStatus(item.id, 'rejected')}>
              <XCircle size={15} /> Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
