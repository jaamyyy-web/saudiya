import React, { useEffect, useMemo, useState } from 'react';
import { collection, doc, limit, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Ban, CheckCircle2, RefreshCw, Search, UserRound } from 'lucide-react';
import { db } from './firebase';

function statusClass(status) {
  if (status === 'active') return 'success';
  if (status === 'blocked' || status === 'disabled') return 'error';
  return 'warning';
}

export default function StudentList({ externalSearch = '' }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [internalSearch, setInternalSearch] = useState('');
  const [busyId, setBusyId] = useState('');

  // Use topbar global search when provided, otherwise internal search box
  const search = externalSearch || internalSearch;

  useEffect(() => {
    if (!db) {
      setError('Firestore is not connected.');
      setLoading(false);
      return;
    }

    const studentsQuery = query(collection(db, 'students'), orderBy('createdAt', 'desc'), limit(100));
    const unsubscribe = onSnapshot(
      studentsQuery,
      (snapshot) => {
        setStudents(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
        setLoading(false);
      },
      (err) => {
        setError(err.message || 'Could not load students. Check Firestore rules.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredStudents = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return students;
    return students.filter((student) => {
      const text = `${student.name || ''} ${student.email || ''} ${student.grade || ''} ${student.plan || ''}`.toLowerCase();
      return text.includes(keyword);
    });
  }, [students, search]);

  async function setStudentStatus(studentId, status) {
    setBusyId(studentId);
    try {
      await updateDoc(doc(db, 'students', studentId), {
        status,
        updatedAt: serverTimestamp(),
      });
    } finally {
      setBusyId('');
    }
  }

  if (loading) {
    return <div className="upload-message uploading"><RefreshCw size={16} /> Loading students...</div>;
  }

  if (error) {
    return <div className="upload-message error">{error}</div>;
  }

  return (
    <div className="student-live-wrap">
      {/* Show internal search box only when not driven by topbar global search */}
      {!externalSearch && (
        <div className="student-search-row">
          <Search size={17} />
          <input value={internalSearch} onChange={(e) => setInternalSearch(e.target.value)} placeholder="Search by name, email, grade, or plan..." />
        </div>
      )}

      {filteredStudents.length === 0 ? (
        <div className="empty-review-card">
          <UserRound size={28} />
          <strong>No students found</strong>
          <p>When students register in the mobile app, their records should appear in Firestore collection students.</p>
        </div>
      ) : (
        <div className="student-live-list">
          {filteredStudents.map((student) => {
            const status = student.status || 'active';
            const isBusy = busyId === student.id;
            return (
              <div className="student-live-row" key={student.id}>
                <div className="avatar">{(student.name || student.email || 'S').charAt(0).toUpperCase()}</div>
                <div className="student-live-main">
                  <div className="upload-row-title">
                    <strong>{student.name || 'Unnamed student'}</strong>
                    <span className={`badge ${statusClass(status)}`}>{status}</span>
                  </div>
                  <p>{student.email || student.phone || 'No contact'} • {student.grade || 'No grade'} • {student.plan || 'Free'}</p>
                  <p>XP {student.xp ?? 0} • Streak {student.streak ?? 0} days • Progress {student.progress ?? 0}% • Devices {student.deviceCount ?? 0}</p>
                </div>
                <div className="upload-row-actions">
                  <button className="small-button" disabled={isBusy} onClick={() => setStudentStatus(student.id, 'active')}>
                    <CheckCircle2 size={15} /> Activate
                  </button>
                  <button className="small-danger-button" disabled={isBusy} onClick={() => setStudentStatus(student.id, 'blocked')}>
                    <Ban size={15} /> Block
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
