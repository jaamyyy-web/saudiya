import React, { useMemo, useRef, useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { FileText, UploadCloud, X } from 'lucide-react';
import { db, storage } from './firebase';

const grades = ['Grade 7', 'Grade 8', 'Grade 9'];
const subjects = ['Islamic Studies', 'Science', 'Math', 'English', 'Arabic', 'Social Studies'];
const mediums = ['Arabic', 'English', 'Arabic Support'];

export default function AdminUpload({ user }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [grade, setGrade] = useState('Grade 7');
  const [subject, setSubject] = useState('Islamic Studies');
  const [medium, setMedium] = useState('Arabic');
  const [learningPackTitle, setLearningPackTitle] = useState('');
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  const canUpload = useMemo(() => Boolean(file && learningPackTitle.trim() && db && storage), [file, learningPackTitle]);

  function resetUpload() {
    setFile(null);
    setProgress(0);
    setStatus('idle');
    setMessage('');
    if (inputRef.current) inputRef.current.value = '';
  }

  async function uploadFile() {
    if (!canUpload) {
      setMessage('Please choose a file and enter a learning pack title.');
      return;
    }

    setStatus('uploading');
    setMessage('Uploading file to Firebase Storage...');

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `admin_uploads/${grade}/${subject}/${Date.now()}_${safeName}`;
    const storageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type || 'application/octet-stream',
      customMetadata: {
        grade,
        subject,
        medium,
        uploadedBy: user?.email || 'unknown',
      },
    });

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(pct);
      },
      (error) => {
        setStatus('error');
        setMessage(error.message || 'Upload failed. Check Firebase Storage rules.');
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, 'admin_uploads'), {
            title: learningPackTitle.trim(),
            grade,
            subject,
            medium,
            fileName: file.name,
            fileType: file.type || 'unknown',
            fileSize: file.size,
            storagePath: filePath,
            downloadURL,
            status: 'uploaded',
            uploadedBy: user?.email || null,
            uploadedByUid: user?.uid || null,
            createdAt: serverTimestamp(),
          });
          setStatus('success');
          setMessage('Upload complete. File saved to Firebase Storage and Firestore.');
        } catch (error) {
          setStatus('error');
          setMessage(error.message || 'File uploaded, but Firestore record failed.');
        }
      }
    );
  }

  return (
    <div className="upload-manager">
      <div className="upload-drop" onClick={() => inputRef.current?.click()}>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg"
          hidden
          onChange={(event) => {
            const selected = event.target.files?.[0];
            if (selected) {
              setFile(selected);
              setStatus('idle');
              setMessage('');
              setProgress(0);
            }
          }}
        />
        <UploadCloud size={34} />
        <strong>{file ? file.name : 'Upload PDF, text, image, or document'}</strong>
        <p>{file ? `${Math.round(file.size / 1024)} KB` : 'Click here to choose a textbook, lesson note, or worksheet file.'}</p>
      </div>

      {file && (
        <button className="clear-file" onClick={resetUpload} type="button">
          <X size={16} /> Remove file
        </button>
      )}

      <div className="form-grid upload-form">
        <label className="admin-field"><span>Grade</span><select value={grade} onChange={(e) => setGrade(e.target.value)}>{grades.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="admin-field"><span>Subject</span><select value={subject} onChange={(e) => setSubject(e.target.value)}>{subjects.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="admin-field"><span>Medium</span><select value={medium} onChange={(e) => setMedium(e.target.value)}>{mediums.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="admin-field"><span>Learning Pack Title</span><input value={learningPackTitle} onChange={(e) => setLearningPackTitle(e.target.value)} placeholder="Example: Faith and Good Character" /></label>
      </div>

      {status === 'uploading' && (
        <div className="upload-progress">
          <div><span style={{ width: `${progress}%` }} /></div>
          <strong>{progress}%</strong>
        </div>
      )}

      {message && <div className={`upload-message ${status}`}>{message}</div>}

      <button className="primary-button upload-submit" disabled={!canUpload || status === 'uploading'} onClick={uploadFile}>
        <FileText size={18} />
        {status === 'uploading' ? 'Uploading...' : 'Upload to Firebase'}
      </button>
    </div>
  );
}
