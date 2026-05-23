import React, { useEffect, useState } from 'react';
import { collection, doc, limit, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { CheckCircle2, Crown, PauseCircle, RefreshCw } from 'lucide-react';
import { db } from './firebase';
import TestAccessCreator from './TestAccessCreator.jsx';

function formatDate(value) {
  if (!value?.toDate) return value || 'No date';
  return value.toDate().toLocaleDateString();
}

function statusClass(status) {
  if (status === 'active' || status === 'paid') return 'success';
  if (status === 'expired' || status === 'cancelled' || status === 'failed') return 'error';
  return 'warning';
}

export default function SubscriptionList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');

  useEffect(() => {
    if (!db) {
      setError('Firestore is not connected.');
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'subscriptions'), orderBy('createdAt', 'desc'), limit(100));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() })));
      setLoading(false);
    }, (err) => {
      setError(err.message || 'Could not load subscriptions.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function setStatus(id, status) {
    setBusyId(id);
    try {
      await updateDoc(doc(db, 'subscriptions', id), { status, updatedAt: serverTimestamp() });
    } finally {
      setBusyId('');
    }
  }

  if (loading) return <><TestAccessCreator /><div className="upload-message uploading"><RefreshCw size={16} /> Loading subscriptions...</div></>;
  if (error) return <><TestAccessCreator /><div className="upload-message error">{error}</div></>;
  if (items.length === 0) return <><TestAccessCreator /><div className="empty-review-card"><Crown size={28} /><strong>No subscriptions found</strong><p>Premium and Family records should appear in Firestore collection subscriptions.</p></div></>;

  return (
    <>
      <TestAccessCreator />
      <div className="subscription-live-list">
        {items.map((item) => {
          const status = item.status || 'active';
          const paymentStatus = item.paymentStatus || 'paid';
          const isBusy = busyId === item.id;
          return (
            <div className="subscription-live-row" key={item.id}>
              <div className="subscription-icon"><Crown size={20} /></div>
              <div className="subscription-live-main">
                <div className="upload-row-title">
                  <strong>{item.studentName || item.email || 'Unnamed subscriber'}</strong>
                  <span className={`badge ${statusClass(status)}`}>{status}</span>
                  <span className={`badge ${statusClass(paymentStatus)}`}>{paymentStatus}</span>
                </div>
                <p>{item.email || item.phone || 'No contact'} • {item.plan || 'Free'} • {item.amount || 0} SAR</p>
                <p>Start: {formatDate(item.startedAt)} • Expiry: {formatDate(item.expiresAt)} • Devices: {item.deviceLimit ?? '-'}</p>
              </div>
              <div className="upload-row-actions">
                <button className="small-button" disabled={isBusy} onClick={() => setStatus(item.id, 'active')}><CheckCircle2 size={15} /> Activate</button>
                <button className="small-danger-button" disabled={isBusy} onClick={() => setStatus(item.id, 'cancelled')}><PauseCircle size={15} /> Cancel</button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
