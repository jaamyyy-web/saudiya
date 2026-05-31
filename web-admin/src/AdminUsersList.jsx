import React, { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { ShieldCheck, UserPlus, X } from 'lucide-react';
import { db } from './firebase';

const ROLES = ['editor', 'admin', 'super_admin'];

export default function AdminUsersList() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newUid, setNewUid] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('editor');
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');
  const [busyId, setBusyId] = useState('');

  useEffect(() => {
    if (!db) {
      setError('Firestore is not connected.');
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, 'admin_users'),
      (snap) => {
        setAdmins(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        setError(err.message || 'Could not load admin users.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  async function addAdmin(event) {
    event.preventDefault();
    const uid = newUid.trim();
    if (!uid) {
      setMessage('Firebase UID is required.');
      return;
    }

    setAdding(true);
    setMessage('');

    try {
      await setDoc(
        doc(db, 'admin_users', uid),
        {
          email: newEmail.trim() || null,
          role: newRole,
          active: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      setNewUid('');
      setNewEmail('');
      setNewRole('editor');
      setMessage(`Admin user ${uid} added successfully.`);
    } catch (err) {
      setMessage(err.message || 'Failed to add admin user.');
    } finally {
      setAdding(false);
    }
  }

  async function toggleActive(admin) {
    setBusyId(admin.id);
    try {
      await setDoc(
        doc(db, 'admin_users', admin.id),
        { active: !admin.active, updatedAt: serverTimestamp() },
        { merge: true }
      );
    } finally {
      setBusyId('');
    }
  }

  async function changeRole(admin, role) {
    setBusyId(admin.id);
    try {
      await setDoc(
        doc(db, 'admin_users', admin.id),
        { role, updatedAt: serverTimestamp() },
        { merge: true }
      );
    } finally {
      setBusyId('');
    }
  }

  if (loading) return <div className="upload-message uploading">Loading admin users...</div>;
  if (error) return <div className="upload-message error">{error}</div>;

  return (
    <div>
      <form className="form-grid upload-form" onSubmit={addAdmin} style={{ marginBottom: 16 }}>
        <label className="admin-field">
          <span>Firebase UID</span>
          <input
            value={newUid}
            onChange={(e) => setNewUid(e.target.value)}
            placeholder="uid from Firebase Auth Console"
            required
          />
        </label>
        <label className="admin-field">
          <span>Email (display only)</span>
          <input
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="admin@example.com"
          />
        </label>
        <label className="admin-field">
          <span>Role</span>
          <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
        <div className="admin-field" style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button className="primary-button" type="submit" disabled={adding} style={{ width: '100%' }}>
            <UserPlus size={16} /> {adding ? 'Adding...' : 'Add Admin'}
          </button>
        </div>
      </form>

      {message && <div className={`upload-message ${message.includes('success') ? 'success' : 'error'}`}>{message}</div>}

      {admins.length === 0 ? (
        <div className="empty-review-card">
          <ShieldCheck size={28} />
          <strong>No admin users in Firestore</strong>
          <p>Add a Firebase UID above, or set <code>VITE_ADMIN_EMAILS</code> in your environment variables to allow access by email without a Firestore record.</p>
        </div>
      ) : (
        <div className="student-live-list">
          {admins.map((admin) => {
            const isBusy = busyId === admin.id;
            return (
              <div className="student-live-row" key={admin.id}>
                <div className="avatar" style={{ background: admin.active ? '#047857' : '#94a3b8' }}>
                  <ShieldCheck size={18} color="white" />
                </div>
                <div className="student-live-main">
                  <div className="upload-row-title">
                    <strong>{admin.email || admin.id}</strong>
                    <span className={`badge ${admin.active ? 'success' : 'error'}`}>{admin.role || 'admin'}</span>
                    <span className={`badge ${admin.active ? 'success' : 'error'}`}>{admin.active ? 'active' : 'revoked'}</span>
                  </div>
                  <p>UID: <code>{admin.id}</code></p>
                </div>
                <div className="upload-row-actions">
                  <select
                    value={admin.role || 'editor'}
                    disabled={isBusy}
                    onChange={(e) => changeRole(admin, e.target.value)}
                    className="small-button"
                    style={{ cursor: 'pointer' }}
                  >
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <button
                    className={admin.active ? 'small-danger-button' : 'small-button'}
                    disabled={isBusy}
                    onClick={() => toggleActive(admin)}
                  >
                    {admin.active ? <><X size={15} /> Revoke</> : <><ShieldCheck size={15} /> Activate</>}
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
