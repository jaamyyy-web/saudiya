import React, { useState } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Crown } from 'lucide-react';
import { db } from './firebase';

export default function TestAccessCreator() {
  const [studentId, setStudentId] = useState('demo-student');
  const [plan, setPlan] = useState('single');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function grantAccess() {
    if (!studentId.trim()) return;
    try {
      setLoading(true);
      await setDoc(doc(db, 'subscriptions', studentId.trim()), {
        studentId: studentId.trim(),
        plan,
        status: 'active',
        paymentStatus: 'paid',
        provider: 'test',
        active: true,
        premiumUnlocked: true,
        profilesAllowed: plan === 'family' ? 4 : 1,
        deviceLimit: plan === 'family' ? 6 : 2,
        startedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setMessage('Test access activated.');
    } catch (error) {
      setMessage(error.message || 'Could not activate test access.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel-card wide">
      <div className="panel-header">
        <div><p className="eyebrow">Test Mode</p><h3>Activate Test Access</h3></div>
        <span className="badge success">access</span>
      </div>
      <div className="form-grid upload-form">
        <label className="admin-field"><span>Student ID</span><input value={studentId} onChange={(e) => setStudentId(e.target.value)} /></label>
        <label className="admin-field"><span>Plan</span><select value={plan} onChange={(e) => setPlan(e.target.value)}><option value="single">Single</option><option value="family">Family</option></select></label>
      </div>
      {message ? <div className="upload-message">{message}</div> : null}
      <button className="primary-button" disabled={loading} onClick={grantAccess}><Crown size={18} />{loading ? 'Activating...' : 'Activate Test Access'}</button>
    </div>
  );
}
