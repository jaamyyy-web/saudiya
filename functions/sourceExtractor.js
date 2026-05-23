const admin = require('firebase-admin');
const pdfParse = require('pdf-parse');

function getStoragePath(job) {
  return job.storagePath || job.filePath || job.uploadPath || job.path || null;
}

function getFileName(job) {
  return String(job.fileName || getStoragePath(job) || '').toLowerCase();
}

async function extractTextFromStorage(job) {
  const fallbackText = job.extractedText || job.sourceText || '';
  const storagePath = getStoragePath(job);
  if (!storagePath) return fallbackText;

  const bucket = admin.storage().bucket();
  const file = bucket.file(storagePath);
  const [exists] = await file.exists();
  if (!exists) {
    console.warn(`Source file not found in Firebase Storage: ${storagePath}`);
    return fallbackText;
  }

  const [buffer] = await file.download();
  const fileName = getFileName(job);

  if (fileName.endsWith('.pdf')) {
    const parsed = await pdfParse(buffer);
    return parsed.text || fallbackText;
  }

  if (fileName.endsWith('.txt') || fileName.endsWith('.csv') || fileName.endsWith('.json')) {
    return buffer.toString('utf8');
  }

  return buffer.toString('utf8').slice(0, 30000) || fallbackText;
}

module.exports = {
  extractTextFromStorage,
  getStoragePath,
};
