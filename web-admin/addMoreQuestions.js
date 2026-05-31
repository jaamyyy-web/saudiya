import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBscnKyw3dldC7UudkzDd3XNBWRFxr9ZM0',
  authDomain: 'saudiedu-3fe68.firebaseapp.com',
  projectId: 'saudiedu-3fe68',
  storageBucket: 'saudiedu-3fe68.firebasestorage.app',
  messagingSenderId: '520109867273',
  appId: '1:520109867273:web:1cf56b39896f81205293d8',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const packId = 'IqlaLtvrRkfmI9Tq4IG0';

const additionalQuestions = [
  // ─── 5 ADDITIONAL MCQS (Orders 29 to 33) ───────────────────────────────────
  {
    type: 'MCQ',
    question: 'ما الاسم المرفوع الذي يقع بعد الفعل المبني للمجهول ويحل محل الفاعل بعد حذفه؟',
    options: ['نائب الفاعل', 'الفاعل', 'المفعول به', 'المبتدأ'],
    answerIndex: 0,
    explanation: 'نائب الفاعل هو اسم مرفوع يحل محل الفاعل بعد حذفه وبناء الفعل للمجهول (مثل: كُتب الدرسُ).',
    difficulty: 'medium',
  },
  {
    type: 'MCQ',
    question: 'أي من الكلمات التالية ملحقة بالمثنى وتُعرب إعرابه بالحروف؟',
    options: ['كلا وكلتا (إذا أضيفتا لضمير)', 'الطالبان', 'الكتابين', 'المعلمان'],
    answerIndex: 0,
    explanation: 'ملحق المثنى مثل "كلا وكلتا" يعرب إعراب المثنى بالألف رفعاً وبالياء نصباً وجراً فقط إذا أضيفتا إلى ضمير (مثل: كلاهما، كلتاهما).',
    difficulty: 'hard',
  },
  {
    type: 'MCQ',
    question: 'ما علامة جزم الفعل المضارع من الأفعال الخمسة في جملة: "الطلاب لم _____"؟',
    options: ['يهملوا', 'يهملون', 'يهملان', 'يهملوا نوناً'],
    answerIndex: 0,
    explanation: 'الأفعال الخمسة تجزم وتنصب بحذف النون من آخرها، لذا نقول "لم يهملوا" ونحذف النون.',
    difficulty: 'medium',
  },
  {
    type: 'MCQ',
    question: 'ما الموقع الإعرابي لكلمة "قائماً" في جملة: "وقف الطالبُ قائماً"؟',
    options: ['حال منصوب', 'مفعول به', 'تمييز منصوب', 'صفة منصوبة'],
    answerIndex: 0,
    explanation: '"قائماً" تبين هيئة صاحب الحال (الطالب) وقت حدوث الفعل، وهي حال منصوب بالفتحة الظاهرة.',
    difficulty: 'medium',
  },
  {
    type: 'MCQ',
    question: 'أي الأسماء التالية يعد من منصوبات الأسماء في قواعد اللغة العربية؟',
    options: ['المفعول به والحال', 'المبتدأ والفاعل', 'المجرور بحرف الجر', 'المضاف إليه'],
    answerIndex: 0,
    explanation: 'المفعول به والحال والتمييز واسم إن وخبر كان هي من منصوبات الأسماء، بينما المبتدأ والفاعل من المرفوعات، والمضاف إليه من المجرورات.',
    difficulty: 'medium',
  },

  // ─── 5 ADDITIONAL FIBS (Orders 34 to 38) ───────────────────────────────────
  {
    type: 'FIB',
    question: 'يرفع جمع المؤنث السالم بالضمة وهي علامة إعراب _______ للمرفوعات.',
    options: ['أصلية', 'فرعية', 'مقدرة', 'محذوفة'],
    answerIndex: 0,
    explanation: 'الضمة هي علامة الرفع الأصلية لجميع الأسماء المفردة وجموع التكسير وجمع المؤنث السالم.',
    difficulty: 'easy',
  },
  {
    type: 'FIB',
    question: 'ينصب الفعل المضارع إذا سبقه حرف من حروف النصب مثل _______ .',
    options: ['أنْ ولنْ', 'لمْ ولا الناهية', 'في وعلى', 'إنّ وأنّ'],
    answerIndex: 0,
    explanation: 'الأدوات "أنْ، لنْ، كي، إذنْ" هي حروف نصب تدخل على الفعل المضارع فتنصبه بالفتحة أو بحذف النون.',
    difficulty: 'easy',
  },
  {
    type: 'FIB',
    question: 'المضاف إليه يقع في التركيب الإضافي ويكون دائماً اسمًا _______ .',
    options: ['مجروراً', 'مرفوعاً', 'منصوباً', 'مجزوماً'],
    answerIndex: 0,
    explanation: 'المضاف إليه يجر دائماً بالكسرة أو الياء، وهو من مجرورات الأسماء الدائمة.',
    difficulty: 'easy',
  },
  {
    type: 'FIB',
    question: 'علامة النصب الفرعية في الاسم المثنى هي _______ نيابة عن الفتحة.',
    options: ['الياء', 'الألف', 'الفتحة', 'الكسرة'],
    answerIndex: 0,
    explanation: 'المثنى ينصب ويجر بالياء (مثل: كافأت الطالبين)، وهي علامة فرعية نائبة عن الفتحة.',
    difficulty: 'easy',
  },
  {
    type: 'FIB',
    question: 'في جملة "كانَ الطالبُ مجتهداً"، الكلمة "مجتهداً" هي خبر كان منصوب وهي من _______ الأسماء.',
    options: ['منصوبات', 'مرفوعات', 'مجرورات', 'توابع'],
    answerIndex: 0,
    explanation: 'كان وأخواتها تدخل على الجملة الاسمية فترفع المبتدأ وتنصب الخبر، لذا خبر كان ينتمي لمنصوبات الأسماء.',
    difficulty: 'medium',
  },
];

async function main() {
  try {
    console.log('Logging in anonymously to add more questions...');
    await signInAnonymously(auth);
    console.log('Authenticated successfully!');

    console.log('Updating Learning Pack counts...');
    const packRef = doc(db, 'learning_packs', packId);
    await updateDoc(packRef, {
      'questionCounts.mcq': 15,
      'questionCounts.fib': 10,
      updatedAt: serverTimestamp(),
    });
    console.log('Learning Pack counts updated to 15 MCQs and 10 FIBs!');

    console.log('Pushing 10 additional questions...');
    for (const [index, q] of additionalQuestions.entries()) {
      const order = 29 + index; // Starting order after the initial 28
      await addDoc(collection(db, 'questions'), {
        packId,
        order,
        type: q.type,
        question: q.question,
        options: q.options,
        answerIndex: q.answerIndex,
        explanation: q.explanation,
        difficulty: q.difficulty,
        status: 'published',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`Additional Question ${order} (${q.type}) pushed!`);
    }

    console.log('\n🎉 ALL 10 ADDITIONAL QUESTIONS SUCCESSFULLY PUSHED AND COUNTS UPDATED!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding questions:', error);
    process.exit(1);
  }
}

main();
