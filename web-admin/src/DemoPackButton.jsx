import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { createDemoLearningPack } from './createDemoLearningPack';

export default function DemoPackButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleCreate() {
    try {
      setLoading(true);
      setMessage('Creating demo learning pack...');
      const packId = await createDemoLearningPack();
      setMessage(`Demo pack created successfully: ${packId}`);
    } catch (error) {
      setMessage(error.message || 'Could not create demo learning pack.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <button className="primary-button" disabled={loading} onClick={handleCreate}>
        <Sparkles size={18} />
        {loading ? 'Creating Demo Pack...' : 'Create Demo Learning Pack'}
      </button>
      {message ? <div className="upload-message">{message}</div> : null}
    </div>
  );
}
