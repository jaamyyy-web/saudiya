import React, { useEffect, useState } from 'react';
import { addDoc, collection, doc, limit, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { CheckCircle2, ExternalLink, FileText, RefreshCw, Send, Sparkles, XCircle } from 'lucide-react';
import { db } from './firebase';

function formatDate(value) {
  if (!value?.toDate) return 'Just now';
  return value.toDate().toLocaleString();
}

function statusClass(status) {
  if (status === 'approved' || status === 'published' || status === 'ready_to_publish' || status === 'ai_job_queued') return 'success';
  if (status === 'rejected') return 'error';
  if (status === 'queued_for_review' || status === 'draft') return 'warning';
  return '';
}

function makeSlug(value = '') {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || `pack-${Date.now()}`;
}

export default function UploadList() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');

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
    setBusyId(uploadId);
    try {
      await updateDoc(doc(db, 'admin_uploads', uploadId), {
        reviewStatus,
        aiGenerationStatus: reviewStatus === 'approved' ? 'ready_to_publish' : reviewStatus,
        updatedAt: serverTimestamp(),
      });
    } finally {
      setBusyId('');
    }
  }

  async function publishLearningPack(item) {
    setBusyId(item.id);
    try {
      const packRef = await addDoc(collection(db, 'learning_packs'), {
        title: item.title || item.fileName || 'Untitled Learning Pack',
        slug: makeSlug(`${item.grade}-${item.subject}-${item.title || item.fileName}`),
        grade: item.grade,
        subject: item.subject,
        medium: item.medium,
        difficulty: item.difficulty || 'Mixed',
        generationStyle: item.generationStyle || 'Exam Paper',
        bloomLevel: item.bloomLevel || 'Mixed',
        questionCounts: item.questionCounts || { mcq: 0, fib: 0, trueFalse: 0, hoq: 0 },
        summaryStatus: 'pending',
        quizStatus: 'pending_generation',
        status: 'published',
        sourceUploadId: item.id,
        sourceFileName: item.fileName || null,
        sourceStoragePath: item.storagePath || null,
        sourceDownloadURL: item.downloadURL || null,
        createdFrom: 'admin_uploads',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await updateDoc(doc(db, 'admin_uploads', item.id), {
        reviewStatus: 'published',
        aiGenerationStatus: 'published_to_learning_packs',
        learningPackId: packRef.id,
        publishedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } finally {
      setBusyId('');
    }
  }

  async function queueAiGeneration(item) {
    setBusyId(item.id);
    try {
      const jobRef = await addDoc(collection(db, 'generation_jobs'), {
        type: 'learning_pack_quiz_generation',
        status: 'queued',
        sourceUploadId: item.id,
        learningPackId: item.learningPackId || null,
        title: item.title || item.fileName || 'Untitled Learning Pack',
        grade: item.grade,
        subject: item.subject,
        medium: item.medium,
        difficulty: item.difficulty || 'Mixed',
        generationStyle: item.generationStyle || 'Exam Paper',
        bloomLevel: item.bloomLevel || 'Mixed',
        questionCounts: item.questionCounts || { mcq: 15, fib: 10, trueFalse: 10, hoq: 3 },
        sourceStoragePath: item.storagePath || null,
        sourceDownloadURL: item.downloadURL || null,
        instructions: item.adminNotes || '',
        model: 'gemini',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await updateDoc(doc(db, 'admin_uploads', item.id), {
        aiGenerationStatus: 'ai_job_queued',
        generationJobId: jobRef.id,
        updatedAt: serverTimestamp(),
      });
    } finally {
      setBusyId('');
    }
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
      {uploads.map((item) => {
        const currentStatus = item.reviewStatus || item.aiGenerationStatus || item.status || 'uploaded';
        const canPublish = currentStatus === 'approved' || currentStatus === 'ready_to_publish';
        const canQueueAi = ['approved', 'ready_to_publish', 'published', 'published_to_learning_packs'].includes(currentStatus);
        const isBusy = busyId === item.id;

        return (
          <div className="upload-row" key={item.id}>
            <div className="upload-file-icon"><FileText size={20} /></div>
            <div className="upload-row-main">
              <div className="upload-row-title">
                <strong>{item.title || item.fileName || 'Untitled upload'}</strong>
                <span className={`badge ${statusClass(currentStatus)}`}>{currentStatus}</span>
              </div>
              <p>
                {item.grade} • {item.subject} • {item.medium} • {item.generationStyle || 'Exam Paper'} • {formatDate(item.createdAt)}
              </p>
              <p>
                MCQ {item.questionCounts?.mcq ?? 0} / FIB {item.questionCounts?.fib ?? 0} / TF {item.questionCounts?.trueFalse ?? 0} / HOQ {item.questionCounts?.hoq ?? 0}
              </p>
              {item.learningPackId && <p>Learning Pack ID: {item.learningPackId}</p>}
              {item.generationJobId && <p>AI Job ID: {item.generationJobId}</p>}
            </div>
            <div className="upload-row-actions">
              {item.downloadURL && (
                <a className="small-link-button" href={item.downloadURL} target="_blank" rel="noreferrer">
                  <ExternalLink size={15} /> File
                </a>
              )}
              <button className="small-button" disabled={isBusy} onClick={() => updateReviewStatus(item.id, 'approved')}>
                <CheckCircle2 size={15} /> Approve
              </button>
              <button className="small-publish-button" disabled={!canPublish || isBusy} onClick={() => publishLearningPack(item)}>
                <Send size={15} /> Publish
              </button>
              <button className="small-ai-button" disabled={!canQueueAi || isBusy} onClick={() => queueAiGeneration(item)}>
                <Sparkles size={15} /> Queue AI
              </button>
              <button className="small-danger-button" disabled={isBusy} onClick={() => updateReviewStatus(item.id, 'rejected')}>
                <XCircle size={15} /> Reject
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
