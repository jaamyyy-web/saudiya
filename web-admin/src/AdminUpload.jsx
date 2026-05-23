import React, { useMemo, useRef, useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { FileText, UploadCloud, X } from 'lucide-react';
import { db, storage } from './firebase';

const grades = ['Grade 7', 'Grade 8', 'Grade 9'];
const subjects = [
  'Islamic Studies',
  'Arabic Language',
  'English Language',
  'Mathematics',
  'Science',
  'Social Studies',
  'Digital Skills',
  'Life and Family Skills',
  'Art Education',
  'Physical and Health Education',
  'Critical Thinking',
];
const mediums = ['Arabic', 'English', 'Arabic Support'];
const difficulties = ['Easy', 'Medium', 'Hard', 'Mixed'];
const generationStyles = ['Textbook', 'Exam Paper', 'Model Paper', 'Concept Mastery'];
const bloomLevels = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create', 'Mixed'];

export default function AdminUpload({ user }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [grade, setGrade] = useState('Grade 7');
  const [subject, setSubject] = useState('Islamic Studies');
  const [medium, setMedium] = useState('Arabic');
  const [difficulty, setDifficulty] = useState('Mixed');
  const [generationStyle, setGenerationStyle] = useState('Exam Paper');
  const [bloomLevel, setBloomLevel] = useState('Mixed');
  const [learningPackTitle, setLearningPackTitle] = useState('');
  const [mcqCount, setMcqCount] = useState(15);
  const [fibCount, setFibCount] = useState(10);
  const [tfCount, setTfCount] = useState(10);
  const [hoqCount, setHoqCount] = useState(3);
  const [adminNotes, setAdminNotes] = useState('');
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
        difficulty,
        generationStyle,
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
            difficulty,
            generationStyle,
            bloomLevel,
            questionCounts: {
              mcq: Number(mcqCount) || 0,
              fib: Number(fibCount) || 0,
              trueFalse: Number(tfCount) || 0,
              hoq: Number(hoqCount) || 0,
            },
            adminNotes: adminNotes.trim(),
            aiGenerationStatus: 'queued_for_review',
            reviewStatus: 'draft',
            isGoldenCandidate: false,
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
          setMessage('Upload complete. Source saved and queued for AI quiz generation review.');
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
          accept=".pdf,.txt,.csv,.doc,.docx,.png,.jpg,.jpeg"
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
        <strong>{file ? file.name : 'Upload PDF, text, CSV, image, or document'}</strong>
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

      <div className="form-grid upload-form">
        <label className="admin-field"><span>Difficulty</span><select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>{difficulties.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="admin-field"><span>Generation Style</span><select value={generationStyle} onChange={(e) => setGenerationStyle(e.target.value)}>{generationStyles.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="admin-field"><span>Bloom Level</span><select value={bloomLevel} onChange={(e) => setBloomLevel(e.target.value)}>{bloomLevels.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="admin-field"><span>Admin Notes</span><input value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="Optional instruction for AI generation" /></label>
      </div>

      <div className="form-grid upload-form">
        <label className="admin-field"><span>MCQ Count</span><input type="number" min="0" max="50" value={mcqCount} onChange={(e) => setMcqCount(e.target.value)} /></label>
        <label className="admin-field"><span>FIB Count</span><input type="number" min="0" max="50" value={fibCount} onChange={(e) => setFibCount(e.target.value)} /></label>
        <label className="admin-field"><span>True/False Count</span><input type="number" min="0" max="50" value={tfCount} onChange={(e) => setTfCount(e.target.value)} /></label>
        <label className="admin-field"><span>HOQ Count</span><input type="number" min="0" max="20" value={hoqCount} onChange={(e) => setHoqCount(e.target.value)} /></label>
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
        {status === 'uploading' ? 'Uploading...' : 'Upload + Queue AI Review'}
      </button>
    </div>
  );
}
