const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');

admin.initializeApp();

const db = admin.firestore();
const GEMINI_MODEL = 'gemini-1.5-flash';

function buildGenerationPrompt(job) {
  const grade = job.grade || 'الصف السابع';
  const subject = job.subject || 'العلوم';
  const medium = job.medium || 'Arabic';
  const difficulty = job.difficulty || 'easy';
  const sourceText = (job.extractedText || job.sourceText || '').slice(0, 30000);

  return `
You are SaudiEdu AI quiz generator.
Create syllabus-aligned student content in clean Arabic RTL.

Grade: ${grade}
Subject: ${subject}
Medium: ${medium}
Difficulty: ${difficulty}

Rules:
- Output ONLY valid JSON.
- No markdown.
- No extra explanation outside JSON.
- Use age-appropriate simple Arabic.
- Questions must be exam-style and educational.
- Each question must have a clear explanation.
- Include MCQ, FIB, TF, and HOQ.
- For MCQ/FIB/HOQ use 4 options.
- For TF use ["صح", "خطأ"].
- answerIndex must be zero-based.

Return JSON format:
{
  "summary": {
    "title": "string",
    "body": "string",
    "points": ["string", "string", "string"]
  },
  "questions": [
    {
      "type": "MCQ|FIB|TF|HOQ",
      "question": "string",
      "options": ["string"],
      "answerIndex": 0,
      "explanation": "string",
      "difficulty": "easy|medium|hard"
    }
  ]
}

Source text:
${sourceText || 'No source text provided yet. Generate safe demo content for the selected subject.'}
`;
}

function fallbackGeneratedContent(job) {
  const subject = job.subject || 'العلوم';
  return {
    summary: {
      title: `ملخص ${subject}`,
      body: 'هذا ملخص تعليمي مبسط للحزمة. اقرأ الفكرة الأساسية ثم انتقل إلى الأسئلة لتثبيت الفهم.',
      points: ['افهم المفهوم قبل الحفظ.', 'راجع الأمثلة القصيرة.', 'أجب عن الأسئلة بدون استعجال.'],
    },
    questions: [
      {
        type: 'MCQ',
        question: 'ما الهدف من هذا الدرس؟',
        options: ['الفهم والتطبيق', 'الحفظ فقط', 'عدم الدراسة', 'تجاهل التدريب'],
        answerIndex: 0,
        explanation: 'الهدف هو فهم الفكرة ثم تطبيقها في أسئلة جديدة.',
        difficulty: 'easy',
      },
      {
        type: 'FIB',
        question: 'الفهم الصحيح يعني معرفة المعنى ثم ____ في سؤال جديد.',
        options: ['تطبيقه', 'نسيانه', 'تركه', 'حذفه'],
        answerIndex: 0,
        explanation: 'التطبيق يساعد الطالب على تثبيت الفكرة.',
        difficulty: 'easy',
      },
      {
        type: 'TF',
        question: 'المراجعة اليومية تساعد على تثبيت المعلومة.',
        options: ['صح', 'خطأ'],
        answerIndex: 0,
        explanation: 'المراجعة القصيرة اليومية تساعد على التذكر والفهم.',
        difficulty: 'easy',
      },
      {
        type: 'HOQ',
        question: 'كيف يمكن استخدام هذا الدرس في حياتك اليومية؟',
        options: ['أطبقه في موقف عملي', 'أحفظه فقط', 'أتجاهله', 'أترك التدريب'],
        answerIndex: 0,
        explanation: 'أسئلة التفكير تساعدك على ربط الدرس بالحياة اليومية.',
        difficulty: 'medium',
      },
    ],
  };
}

function sanitizeGeneratedContent(content, job) {
  const fallback = fallbackGeneratedContent(job);
  const summary = content && content.summary ? content.summary : fallback.summary;
  const questions = Array.isArray(content && content.questions) && content.questions.length ? content.questions : fallback.questions;

  return {
    summary: {
      title: summary.title || fallback.summary.title,
      body: summary.body || fallback.summary.body,
      points: Array.isArray(summary.points) && summary.points.length ? summary.points.slice(0, 6) : fallback.summary.points,
    },
    questions: questions.slice(0, 40).map((q, index) => {
      const type = ['MCQ', 'FIB', 'TF', 'HOQ'].includes(q.type) ? q.type : 'MCQ';
      const options = Array.isArray(q.options) && q.options.length ? q.options : fallback.questions[0].options;
      return {
        type,
        question: q.question || `سؤال ${index + 1}`,
        options: type === 'TF' ? ['صح', 'خطأ'] : options.slice(0, 4),
        answerIndex: Number.isInteger(q.answerIndex) ? q.answerIndex : 0,
        explanation: q.explanation || 'شرح مبسط للإجابة الصحيحة.',
        difficulty: q.difficulty || job.difficulty || 'easy',
      };
    }),
  };
}

async function generateWithGemini(job) {
  const apiKey = process.env.GEMINI_API_KEY || functions.config()?.gemini?.key;
  if (!apiKey) return fallbackGeneratedContent(job);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  const result = await model.generateContent(buildGenerationPrompt(job));
  const text = result.response.text().trim().replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/i, '').trim();
  return JSON.parse(text);
}

exports.processGenerationJob = functions.firestore
  .document('generation_jobs/{jobId}')
  .onCreate(async (snap, context) => {
    const job = snap.data();
    const jobId = context.params.jobId;

    try {
      await db.collection('generation_jobs').doc(jobId).update({
        status: 'processing',
        startedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      const generated = sanitizeGeneratedContent(await generateWithGemini(job), job);

      const learningPackRef = await db.collection('learning_packs').add({
        title: job.title || generated.summary.title || 'Generated Learning Pack',
        grade: job.grade || 'الصف السابع',
        subject: job.subject || 'العلوم',
        medium: job.medium || 'Arabic',
        difficulty: job.difficulty || 'easy',
        status: 'draft',
        sourceFile: job.fileName || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        generatedFromJob: jobId,
        order: job.order || 999,
      });

      await db.collection('summaries').add({
        packId: learningPackRef.id,
        status: 'draft',
        ...generated.summary,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      for (const [index, question] of generated.questions.entries()) {
        await db.collection('questions').add({
          packId: learningPackRef.id,
          status: 'draft',
          order: index + 1,
          ...question,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      await db.collection('generation_jobs').doc(jobId).update({
        status: 'completed',
        learningPackId: learningPackRef.id,
        questionCount: generated.questions.length,
        completedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error('Generation job failed:', error);
      await db.collection('generation_jobs').doc(jobId).update({
        status: 'failed',
        errorMessage: error.message,
        failedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  });
