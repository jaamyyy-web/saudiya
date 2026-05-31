import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
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

const questions = [
  // ─── 10 MCQ QUESTIONS ────────────────────────────────────────────────────────
  {
    type: 'MCQ',
    question: 'ما هي علامة الرفع الأصلية لجميع الأسماء المفردة وجمع التكسير؟',
    options: ['الضمة', 'الألف', 'الواو', 'الفتحة'],
    answerIndex: 0,
    explanation: 'الضمة هي علامة الرفع الأصلية، بينما الألف والواو هما علامتان فرعيتان تنوبان عنها في حالات التثنية والجمع.',
    difficulty: 'easy',
  },
  {
    type: 'MCQ',
    question: 'بماذا ينصب جمع المؤنث السالم؟ (علامة فرعية)',
    options: ['الكسرة نيابة عن الفتحة', 'الفتحة الظاهرة', 'الياء', 'الألف'],
    answerIndex: 0,
    explanation: 'ينصب جمع المؤنث السالم بالكسرة نيابة عن الفتحة، وتعتبر الكسرة هنا علامة إعراب فرعية لأنها نابت عن الفتحة في حالة النصب.',
    difficulty: 'medium',
  },
  {
    type: 'MCQ',
    question: 'ما علامة رفع المثنى (مثل: الطالبان مجتهدان)؟',
    options: ['الألف', 'الضمة المقدرة', 'الواو', 'ثبوت النون'],
    answerIndex: 0,
    explanation: 'المثنى يرفع بالألف نيابة عن الضمة، وينصب ويجر بالياء.',
    difficulty: 'easy',
  },
  {
    type: 'MCQ',
    question: 'أي من الأسماء التالية يرفع بالواو لأنه جمع مذكر سالم؟',
    options: ['المعلمون', 'المعلمان', 'المعلمات', 'المعلم'],
    answerIndex: 0,
    explanation: 'جمع المذكر السالم يرفع بالواو (المعلمون)، بينما المثنى يرفع بالألف (المعلمان)، والمفرد وجمع المؤنث يرفعان بالضمة.',
    difficulty: 'easy',
  },
  {
    type: 'MCQ',
    question: 'ما علامة جر الأسماء الخمسة (أبوك، أخوك، حموك، فوك، ذو مال)؟',
    options: ['الياء', 'الكسرة الظاهرة', 'الألف', 'الفتحة المقدرة'],
    answerIndex: 0,
    explanation: 'تجر الأسماء الخمسة بالياء (مثل: مررت بأبيك)، وترفع بالواو (أبوك)، وتصنب بالألف (أباك).',
    difficulty: 'medium',
  },
  {
    type: 'MCQ',
    question: 'ما علامة جزم الفعل المضارع المعتل الآخر (مثل: لم يسعَ، لم يرمِ)؟',
    options: ['حذف حرف العلة', 'السكون', 'حذف النون', 'الفتحة المقدرة'],
    answerIndex: 0,
    explanation: 'يجزم الفعل المضارع معتل الآخر بحذف حرف العلة من آخره، وتوضع حركة مناسبة للحرف المحذوف (فتحة للفتة، كسرة للياء، ضمة للواو).',
    difficulty: 'medium',
  },
  {
    type: 'MCQ',
    question: 'ما علامة نصب الأسماء الخمسة في جملة: "رأيتُ ____ في المسجد"؟',
    options: ['أباك', 'أبوك', 'أبيك', 'أبوك ومحمد'],
    answerIndex: 0,
    explanation: 'تنصب الأسماء الخمسة بالألف، ونظراً لوقوع الكلمة في محل نصب مفعول به للفعل "رأيت"، فإن الاختيار الصحيح هو "أباك".',
    difficulty: 'medium',
  },
  {
    type: 'MCQ',
    question: 'أي من الأفعال المضارعة التالية يعد من الأفعال الخمسة؟',
    options: ['يكتبون', 'يكتب', 'كتبوا', 'اكتبوا'],
    answerIndex: 0,
    explanation: 'الأفعال الخمسة هي كل فعل مضارع اتصلت به واو الجماعة (يكتبون/تكتبون)، أو ألف الاثنين (يكتبان)، أو ياء المخاطبة (تكتبين).',
    difficulty: 'easy',
  },
  {
    type: 'MCQ',
    question: 'ما علامة رفع الأفعال الخمسة؟',
    options: ['ثبوت النون', 'الضمة الظاهرة', 'الواو', 'حذف النون'],
    answerIndex: 0,
    explanation: 'ترفع الأفعال الخمسة بثبوت النون (مثل: الطلاب يكتبون)، وتنصب وتجزم بحذفها (مثل: لن يكتبوا، لم يكتبوا).',
    difficulty: 'easy',
  },
  {
    type: 'MCQ',
    question: 'ما علامة جر الاسم الممنوع من الصرف إذا لم يكن مضافاً أو معرفاً بأل (مثل: مررتُ بمساجدَ كثيرة)؟',
    options: ['الفتحة نيابة عن الكسرة', 'الكسرة الظاهرة', 'الياء', 'السكون'],
    answerIndex: 0,
    explanation: 'الاسم الممنوع من الصرف يجر بالفتحة نيابة عن الكسرة كعلامة فرعية بشرط خلوه من "أل" التعريف والإضافة.',
    difficulty: 'hard',
  },

  // ─── 5 FIB QUESTIONS ────────────────────────────────────────────────────────
  {
    type: 'FIB',
    question: 'علامة الرفع الفرعية في الأسماء الخمسة هي _______ وهي تنوب عن الضمة.',
    options: ['الواو', 'الألف', 'الضمة', 'الياء'],
    answerIndex: 0,
    explanation: 'الأسماء الخمسة ترفع بالواو (مثل: جاء أبوك) نيابة عن العلامة الأصلية وهي الضمة.',
    difficulty: 'easy',
  },
  {
    type: 'FIB',
    question: 'ينصب ويجر جمع المذكر السالم بالياء وهي علامة إعراب _______ نائبة عن الحركات الأصلية.',
    options: ['فرعية', 'أصلية', 'مقدرة', 'ظاهرة'],
    answerIndex: 0,
    explanation: 'الياء هي علامة إعراب فرعية في جمع المذكر السالم والمثنى لأنها تنوب عن الفتحة في النصب والكسرة في الجر.',
    difficulty: 'easy',
  },
  {
    type: 'FIB',
    question: 'يجزم الفعل المضارع صحيح الآخر بالسكون وهي علامة جزم _______ للغة العربية.',
    options: ['أصلية', 'فرعية', 'مقدرة', 'حذف'],
    answerIndex: 0,
    explanation: 'السكون هو علامة الجزم الأصلية في الأفعال المضارعة صحيحة الآخر، بينما حذف حرف العلة وحذف النون علامتان فرعيتان.',
    difficulty: 'easy',
  },
  {
    type: 'FIB',
    question: 'يرفع الفعل المضارع المعتل الآخر بضمة _______ لثقل النطق أو تعذره.',
    options: ['مقدرة', 'ظاهرة', 'فرعية', 'محذوفة'],
    answerIndex: 0,
    explanation: 'يعرب المعتل الآخر بالحركات المقدرة في الرفع والنصب لعدم إمكانية أو ثقل نطق الحركة على حروف العلة (الألف، الواو، الياء).',
    difficulty: 'medium',
  },
  {
    type: 'FIB',
    question: 'المبتدأ والخبر دائماً من مرفوعات الأسماء وتكون علامة رفعهما الأصلية هي _______ .',
    options: ['الضمة', 'الفتحة', 'الكسرة', 'الواو'],
    answerIndex: 0,
    explanation: 'المبتدأ والخبر مرفوعان دائماً، وتكون علامة الرفع الأصلية هي الضمة الظاهرة أو المقدرة.',
    difficulty: 'easy',
  },

  // ─── 10 TF QUESTIONS ────────────────────────────────────────────────────────
  {
    type: 'TF',
    question: 'الكسرة هي علامة الجر الأصلية الوحيدة في اللغة العربية.',
    options: ['صح', 'خطأ'],
    answerIndex: 0,
    explanation: 'نعم، الكسرة هي علامة الجر الأصلية للمفرد وجمع التكسير وجمع المؤنث السالم. الياء والفتحة علامتان فرعيتان للجر.',
    difficulty: 'easy',
  },
  {
    type: 'TF',
    question: 'المثنى يرفع بالضمة وينصب بالفتحة كالمفرد تماماً.',
    options: ['خطأ', 'صح'],
    answerIndex: 0,
    explanation: 'خطأ! المثنى يعرب بالعلامات الفرعية؛ يرفع بالألف وينصب ويجر بالياء.',
    difficulty: 'easy',
  },
  {
    type: 'TF',
    question: 'يرفع جمع المؤنث السالم (مثل: المعلماتُ مخلصاتٌ) بالضمة الظاهرة.',
    options: ['صح', 'خطأ'],
    answerIndex: 0,
    explanation: 'نعم، جمع المؤنث السالم يرفع بالضمة كعلامة إعراب أصلية، لكنه يعرب بعلامة فرعية في النصب حيث ينصب بالكسرة.',
    difficulty: 'easy',
  },
  {
    type: 'TF',
    question: 'الأفعال الخمسة تجزم بحذف النون من آخرها.',
    options: ['صح', 'خطأ'],
    answerIndex: 0,
    explanation: 'نعم، تجزم وتنصب الأفعال الخمسة بحذف النون (مثل: لم يذهبوا، لن يذهبوا)، وترفع بثبوتها.',
    difficulty: 'medium',
  },
  {
    type: 'TF',
    question: 'الفتحة هي علامة النصب الأصلية للمفرد وجمع التكسير.',
    options: ['صح', 'خطأ'],
    answerIndex: 0,
    explanation: 'نعم، الفتحة هي علامة النصب الأصلية لجميع الأسماء المفردة وجموع التكسير.',
    difficulty: 'easy',
  },
  {
    type: 'TF',
    question: 'تجر الأسماء الخمسة بالألف وتكتب بصورة أباك.',
    options: ['خطأ', 'صح'],
    answerIndex: 0,
    explanation: 'خطأ! تجر الأسماء الخمسة بالياء وتكتب "أبيك"، وتنصب بالألف وتكتب "أباك"، وترفع بالواو "أبوك".',
    difficulty: 'medium',
  },
  {
    type: 'TF',
    question: 'الفعل المضارع صحيح الآخر يجزم بحذف حرف العلة من آخره.',
    options: ['خطأ', 'صح'],
    answerIndex: 0,
    explanation: 'خطأ! الفعل المضارع صحيح الآخر يجزم بالسكون، أما المعتل الآخر (ينتهي بـ ا، و، ي) فهو الذي يجزم بحذف حرف العلة.',
    difficulty: 'medium',
  },
  {
    type: 'TF',
    question: 'جمع التكسير (مثل: كتب، مساجد، رجال) يعرب بالحركات الأصلية في جميع الحالات مثل المفرد.',
    options: ['صح', 'خطأ'],
    answerIndex: 0,
    explanation: 'نعم، جمع التكسير يعرب بالضمة رفعاً، والفتحة نصباً، والكسرة جراً (إلا إذا كان ممنوعاً من الصرف فيجر بالفتحة).',
    difficulty: 'easy',
  },
  {
    type: 'TF',
    question: 'كلمة "أخيك" في جملة "جاء أخيك" مكتوبة بشكل صحيح لغوياً وإعرابياً.',
    options: ['خطأ', 'صح'],
    answerIndex: 0,
    explanation: 'خطأ! كلمة "جاء" تتطلب فاعلاً مرفوعاً، والأسماء الخمسة ترفع بالواو، لذا الصحيح إعرابياً هو "جاء أخوك".',
    difficulty: 'hard',
  },
  {
    type: 'TF',
    question: 'الواو تنوب عن الضمة في الرفع في كل من جمع المذكر السالم والأسماء الخمسة.',
    options: ['صح', 'خطأ'],
    answerIndex: 0,
    explanation: 'نعم، تنوب الواو عن الضمة كعلامة رفع فرعية في جمع المذكر السالم (المعلمون) والأسماء الخمسة (أبوك).',
    difficulty: 'medium',
  },

  // ─── 3 HOQ QUESTIONS ────────────────────────────────────────────────────────
  {
    type: 'HOQ',
    question: 'ما هو التغيير الإعرابي الصحيح الذي يحدث للجملة الاسمية "المعلمان مخلصان" عند دخول الحرف الناسخ "إنّ" عليها؟',
    options: ['إنّ المعلمين مخلصان', 'إنّ المعلمان مخلصين', 'إنّ المعلمين مخلصين', 'إنّ المعلمان مخلصان'],
    answerIndex: 0,
    explanation: 'إنّ تنصب المبتدأ اسماً لها وترفع الخبر خبراً لها. المثنى ينصب بالياء (المعلمين) ويرفع بالألف (مخلصان)، فينتج "إنّ المعلمين مخلصان".',
    difficulty: 'hard',
  },
  {
    type: 'HOQ',
    question: 'لماذا أعربت كلمة "أبناء" بالكسرة في "مررتُ بأبناءِ محمد" بينما أعربت كلمة "مساجد" بالفتحة في "مررتُ بمساجدَ كثيرة"؟',
    options: [
      'لأن مساجد ممنوعة من الصرف وأبناء اسم منصرف يجر بالكسرة',
      'لأن أبناء جمع مؤنث سالم ومساجد جمع تكسير',
      'لأن مساجد مثنى وأبناء مفرد في الإعراب',
      'لأن أبناء معرفة بأل ومساجد نكرة مضافة',
    ],
    answerIndex: 0,
    explanation: 'كلمة "مساجد" ممنوعة من الصرف على صيغة منتهى الجموع فجرت بالفتحة نيابة عن الكسرة، أما "أبناء" فهي جمع تكسير منصرف يجر بالكسرة.',
    difficulty: 'hard',
  },
  {
    type: 'HOQ',
    question: 'ما وجه الشبه والارتباط الإعرابي بين الأفعال الخمسة في الأفعال، وجمع المذكر السالم في الأسماء؟',
    options: [
      'كلاهما يستخدم علامات إعراب فرعية تعتمد على الحروف (الواو والياء لجمع المذكر، وثبوت وحذف النون للأفعال الخمسة)',
      'كلاهما يعرب بالحركات الأصلية دائماً في جميع مواقع الجملة',
      'لا يوجد أي وجه تشابه أو صلة إعرابية بينهما إطلاقاً',
      'جمع المذكر السالم يجزم بالسكون بينما الأفعال الخمسة تجر بالياء',
    ],
    answerIndex: 0,
    explanation: 'كلاهما يعرب بعلامات فرعية تعتمد على الحروف بدلاً من الحركات: جمع المذكر السالم يستخدم الواو والياء، والأفعال الخمسة تستخدم ثبوت وحذف النون.',
    difficulty: 'hard',
  },
];

const summary = {
  title: 'قواعد النحو: علامات الإعراب الأصلية والفرعية',
  body: 'يتناول هذا الدرس بالتفصيل علامات الإعراب الأصلية التي تُعرب بها الكلمات المفردة، وعلامات الإعراب الفرعية التي تنوب عنها في المثنى والجمع والأسماء والأفعال الخمسة.',
  points: [
    'الضمة هي علامة الرفع الأصلية، والفتحة للنصب، والكسرة للجر، والسكون للجزم.',
    'تنوب الواو عن الضمة في رفع جمع المذكر السالم والأسماء الخمسة، والألف في رفع المثنى.',
    'تنوب الياء عن الفتحة والكسرة في نصب وجر المثنى وجمع المذكر السالم.',
    'الأسماء الخمسة تعرب بالحروف: ترفع بالواو، وتنصب بالألف، وتجر بالياء.',
    'الأفعال الخمسة ترفع بثبوت النون، وتنصب وتجزم بحذف النون.',
  ],
};

async function main() {
  try {
    console.log('Logging in anonymously to Firestore...');
    const cred = await signInAnonymously(auth);
    console.log('Successfully authenticated! User ID:', cred.user.uid);

    console.log('Creating Learning Pack document...');
    const packRef = await addDoc(collection(db, 'learning_packs'), {
      title: 'اللغة العربية - علامات الإعراب الأصلية والفرعية',
      grade: 'الصف السابع',
      subject: 'اللغة العربية',
      subjectId: 'arabic',
      status: 'published',
      order: 1,
      xp: 150,
      source: 'firestore',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      questionCounts: {
        mcq: 10,
        fib: 5,
        trueFalse: 10,
        hoq: 3,
      },
    });
    console.log('Learning Pack created! ID:', packRef.id);

    console.log('Creating Summary document...');
    await addDoc(collection(db, 'summaries'), {
      packId: packRef.id,
      title: summary.title,
      body: summary.body,
      points: summary.points,
      status: 'published',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log('Summary created successfully!');

    console.log('Pushing 28 questions in order...');
    for (const [index, q] of questions.entries()) {
      await addDoc(collection(db, 'questions'), {
        packId: packRef.id,
        order: index + 1,
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
      console.log(`Question ${index + 1} (${q.type}) pushed!`);
    }

    console.log('\n🎉 ALL CONTENT SUCCESSFULLY PUSHED TO THE LIVE FIREBASE DATABASE!');
    process.exit(0);
  } catch (error) {
    console.error('Error pushing data:', error);
    process.exit(1);
  }
}

main();
