const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

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

      const learningPackRef = await db.collection('learning_packs').add({
        title: job.title || 'Generated Learning Pack',
        grade: job.grade || 'الصف السابع',
        subject: job.subject || 'العلوم',
        status: 'draft',
        sourceFile: job.fileName || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        generatedFromJob: jobId,
      });

      await db.collection('summaries').add({
        packId: learningPackRef.id,
        status: 'draft',
        title: 'ملخص الدرس',
        body: 'هذا ملخص تجريبي تم إنشاؤه من نظام الذكاء الاصطناعي.',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      const sampleQuestions = [
        {
          type: 'MCQ',
          question: 'ما الهدف من هذا الدرس؟',
          options: ['الفهم والتطبيق', 'الحفظ فقط', 'عدم الدراسة', 'تجاهل التدريب'],
          answerIndex: 0,
        },
        {
          type: 'TF',
          question: 'المراجعة اليومية تساعد على تثبيت المعلومة.',
          options: ['صح', 'خطأ'],
          answerIndex: 0,
        },
      ];

      for (const [index, question] of sampleQuestions.entries()) {
        await db.collection('questions').add({
          packId: learningPackRef.id,
          status: 'draft',
          order: index + 1,
          ...question,
          explanation: 'شرح تجريبي تم إنشاؤه بواسطة النظام.',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      await db.collection('generation_jobs').doc(jobId).update({
        status: 'completed',
        learningPackId: learningPackRef.id,
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
