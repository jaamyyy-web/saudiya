import React, { useEffect, useState } from 'react';
import { collection, doc, limit, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { AlertTriangle, CheckCircle2, Clock, RefreshCw, RotateCcw, Sparkles, XCircle } from 'lucide-react';
import { db } from './firebase';

function formatDate(value) {
  if (!value?.toDate) return 'Just now';
  return value.toDate().toLocaleString();
}

function statusClass(status) {
  if (status === 'completed') return 'success';
  if (status === 'failed' || status === 'cancelled') return 'error';
  if (status === 'queued' || status === 'processing') return 'warning';
  return '';
}

function StatusIcon({ status }) {
  if (status === 'completed') return <CheckCircle2 size={18} />;
  if (status === 'failed' || status === 'cancelled') return <XCircle size={18} />;
  if (status === 'processing') return <RefreshCw size={18} />;
  return <Clock size={18} />;
}

export default function GenerationJobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');

  useEffect(() => {
    if (!db) {
      setError('Firestore is not connected.');
      setLoading(false);
      return;
    }

    const jobsQuery = query(collection(db, 'generation_jobs'), orderBy('createdAt', 'desc'), limit(50));
    const unsubscribe = onSnapshot(
      jobsQuery,
      (snapshot) => {
        setJobs(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
        setLoading(false);
      },
      (err) => {
        setError(err.message || 'Could not load generation jobs. Check Firestore rules.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  async function setJobStatus(jobId, status) {
    setBusyId(jobId);
    try {
      await updateDoc(doc(db, 'generation_jobs', jobId), {
        status,
        updatedAt: serverTimestamp(),
        ...(status === 'queued' ? { retryRequestedAt: serverTimestamp() } : {}),
      });
    } finally {
      setBusyId('');
    }
  }

  if (loading) {
    return <div className="upload-message uploading"><RefreshCw size={16} /> Loading AI generation jobs...</div>;
  }

  if (error) {
    return <div className="upload-message error">{error}</div>;
  }

  if (jobs.length === 0) {
    return (
      <div className="empty-review-card">
        <Sparkles size={28} />
        <strong>No AI generation jobs yet</strong>
        <p>After approving an upload, press Queue AI. Jobs will appear here for monitoring.</p>
      </div>
    );
  }

  return (
    <div className="generation-job-list">
      {jobs.map((job) => {
        const status = job.status || 'queued';
        const isBusy = busyId === job.id;
        return (
          <div className="generation-job-row" key={job.id}>
            <div className={`generation-job-icon ${statusClass(status)}`}><StatusIcon status={status} /></div>
            <div className="generation-job-main">
              <div className="upload-row-title">
                <strong>{job.title || 'Untitled AI job'}</strong>
                <span className={`badge ${statusClass(status)}`}>{status}</span>
              </div>
              <p>{job.grade} • {job.subject} • {job.medium} • {job.generationStyle || 'Exam Paper'} • {formatDate(job.createdAt)}</p>
              <p>
                MCQ {job.questionCounts?.mcq ?? 0} / FIB {job.questionCounts?.fib ?? 0} / TF {job.questionCounts?.trueFalse ?? 0} / HOQ {job.questionCounts?.hoq ?? 0}
              </p>
              {job.errorMessage && <p className="job-error"><AlertTriangle size={14} /> {job.errorMessage}</p>}
            </div>
            <div className="upload-row-actions">
              <button className="small-ai-button" disabled={isBusy} onClick={() => setJobStatus(job.id, 'queued')}>
                <RotateCcw size={15} /> Retry
              </button>
              <button className="small-button" disabled={isBusy} onClick={() => setJobStatus(job.id, 'completed')}>
                <CheckCircle2 size={15} /> Mark Done
              </button>
              <button className="small-danger-button" disabled={isBusy} onClick={() => setJobStatus(job.id, 'cancelled')}>
                <XCircle size={15} /> Cancel
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
