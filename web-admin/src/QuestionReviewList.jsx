import React, { useEffect, useState } from 'react';
import { collection, doc, limit, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { CheckCircle2, Sparkles, Star, XCircle, RefreshCw, Brain } from 'lucide-react';
import { db } from './firebase';

function statusClass(status) {
  if (status === 'approved' || status === 'published') return 'success';
  if (status === 'rejected') return 'error';
  if (status === 'draft' || status === 'pending_review') return 'warning';
  return '';
}

function optionLabel(index) {
  return ['A', 'B', 'C', 'D', 'E'][index] || `${index + 1}`;
}

export default function QuestionReviewList() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');

  useEffect(() => {
    if (!db) {
      setError('Firestore is not connected.');
      setLoading(false);
      return;
    }

    const questionsQuery = query(collection(db, 'questions'), orderBy('createdAt', 'desc'), limit(50));
    const unsubscribe = onSnapshot(
      questionsQuery,
      (snapshot) => {
        setQuestions(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
        setLoading(false);
      },
      (err) => {
        setError(err.message || 'Could not load questions. Check Firestore rules.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  async function setQuestionStatus(questionId, status) {
    setBusyId(questionId);
    try {
      await updateDoc(doc(db, 'questions', questionId), {
        reviewStatus: status,
        updatedAt: serverTimestamp(),
      });
    } finally {
      setBusyId('');
    }
  }

  async function markGolden(question) {
    setBusyId(question.id);
    try {
      await updateDoc(doc(db, 'questions', question.id), {
        isGolden: !question.isGolden,
        updatedAt: serverTimestamp(),
      });
    } finally {
      setBusyId('');
    }
  }

  if (loading) {
    return <div className="upload-message uploading"><RefreshCw size={16} /> Loading question review bank...</div>;
  }

  if (error) {
    return <div className="upload-message error">{error}</div>;
  }

  if (questions.length === 0) {
    return (
      <div className="empty-review-card">
        <Brain size={28} />
        <strong>No generated questions yet</strong>
        <p>When the AI generation pipeline creates MCQ, FIB, True/False, and HOQ questions, they will appear here for admin review.</p>
      </div>
    );
  }

  return (
    <div className="question-review-list">
      {questions.map((question) => {
        const isBusy = busyId === question.id;
        const status = question.reviewStatus || 'pending_review';
        const options = Array.isArray(question.options) ? question.options : [];

        return (
          <div className="question-review-card" key={question.id}>
            <div className="question-review-top">
              <div>
                <div className="question-meta-row">
                  <span className="badge">{question.type || 'MCQ'}</span>
                  <span className={`badge ${statusClass(status)}`}>{status}</span>
                  {question.isGolden && <span className="badge success">Golden</span>}
                </div>
                <h3>{question.question || question.prompt || 'Untitled question'}</h3>
                <p>{question.grade} • {question.subject} • {question.medium} • {question.difficulty || 'Mixed'} • {question.bloomLevel || 'Mixed'}</p>
              </div>
              <div className="question-score"><Sparkles size={16} /> {question.qualityScore ?? '-'}%</div>
            </div>

            {options.length > 0 && (
              <div className="option-grid">
                {options.map((option, index) => (
                  <div className={`option-chip ${question.correctAnswer === option || question.correctIndex === index ? 'correct' : ''}`} key={`${option}-${index}`}>
                    <strong>{optionLabel(index)}</strong>
                    <span>{option}</span>
                  </div>
                ))}
              </div>
            )}

            {question.explanation && <div className="explanation-box"><strong>Explanation:</strong> {question.explanation}</div>}

            <div className="upload-row-actions question-actions">
              <button className="small-button" disabled={isBusy} onClick={() => setQuestionStatus(question.id, 'approved')}>
                <CheckCircle2 size={15} /> Approve
              </button>
              <button className="small-publish-button" disabled={isBusy} onClick={() => markGolden(question)}>
                <Star size={15} /> {question.isGolden ? 'Remove Golden' : 'Mark Golden'}
              </button>
              <button className="small-danger-button" disabled={isBusy} onClick={() => setQuestionStatus(question.id, 'rejected')}>
                <XCircle size={15} /> Reject
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
