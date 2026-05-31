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

// ─── 1. SCIENCE PACK DATA (38 QUESTIONS) ──────────────────────────────────────
const sciencePack = {
  title: 'العلوم - الخلايا وأنواعها ووظائفها',
  grade: 'الصف السابع',
  subject: 'العلوم',
  subjectId: 'science',
  status: 'published',
  order: 2,
  xp: 150,
  source: 'firestore',
  summary: {
    title: 'ملخص درس: الخلايا - لبنات بناء الحياة',
    body: 'تعتبر الخلايا هي الوحدات الأساسية التركيبية والوظيفية في جميع الكائنات الحية. ينقسم الكائنات الحية إلى وحيدة الخلية وعديدة الخلايا، كما تختلف الخلية النباتية عن الحيوانية بوجود جدار خلوي وبلاستيدات خضراء.',
    points: [
      'الخلية هي أصغر وحدة حية قادرة على القيام بجميع العمليات الحيوية.',
      'تتميز الخلية النباتية بوجود الجدار الخلوي، البلاستيدات الخضراء، والفجوة العصارية الكبيرة.',
      'تحتوي الخلية الحيوانية على الغشاء البلازمي، النواة، السيتوبلازم، والميتوكوندريا ولكنها تخلو من الجدار الخلوي.',
      'النواة هي مركز التحكم في الخلية وتحتوي على المادة الوراثية (DNA).',
      'الميتوكوندريا هي مصانع إنتاج الطاقة (ATP) في الخلية من خلال التنفس الخلوي.',
    ]
  },
  questions: [
    // 15 MCQ
    { type: 'MCQ', question: 'ما هو العضي الخلوي المسؤول عن التحكم في جميع أنشطة الخلية؟', options: ['النواة', 'الميتوكوندريا', 'الريبوسوم', 'الجدار الخلوي'], answerIndex: 0, explanation: 'النواة هي مركز إدارة الخلية وتحتوي على المادة الوراثية التي توجه كافة العمليات الحيوية.', difficulty: 'easy' },
    { type: 'MCQ', question: 'أي التراكيب التالية يوجد في الخلية النباتية ولا يوجد في الخلية الحيوانية؟', options: ['الجدار الخلوي والبلاستيدات الخضراء', 'النواة والغشاء البلازمي', 'الميتوكوندريا والسيتوبلازم', 'الفجوة العصارية الصغيرة والريبوسوم'], answerIndex: 0, explanation: 'الجدار الخلوي والبلاستيدات الخضراء هما تركيبان فريدان بالخلية النباتية ليوفران الدعم والتمثيل الضوئي.', difficulty: 'easy' },
    { type: 'MCQ', question: 'ما العضي الخلوي المسؤول عن توليد وإنتاج الطاقة للخلية؟', options: ['الميتوكوندريا', 'جهاز جولجي', 'الشبكة الإندوبلازمية', 'الليسوسوم'], answerIndex: 0, explanation: 'الميتوكوندريا هي مركز التنفس الخلوي وإنتاج الطاقة (ATP) في الخلية.', difficulty: 'easy' },
    { type: 'MCQ', question: 'ما الوظيفة الأساسية للبلاستيدات الخضراء في النبات؟', options: ['القيام بعملية البناء الضوئي', 'إنتاج البروتينات', 'التنفس الخلوي', 'دعم جدار الخلية'], answerIndex: 0, explanation: 'تحتوي البلاستيدات الخضراء على الكلوروفيل الذي يمتص الضوء للقيام بعملية البناء الضوئي وتصنيع الغذاء.', difficulty: 'easy' },
    { type: 'MCQ', question: 'ما هو السائل الهلامي الذي تسبح فيه جميع عضيات الخلية؟', options: ['السيتوبلازم', 'النواة', 'الغشاء الخلوي', 'الماء المقطر'], answerIndex: 0, explanation: 'السيتوبلازم هو سائل شبه هلامي يملأ فراغ الخلية وتسبح وتتحرك فيه العضيات المختلفة.', difficulty: 'easy' },
    { type: 'MCQ', question: 'أي من الكائنات التالية يعد كائناً وحيد الخلية؟', options: ['البكتيريا والبراميسيوم', 'الإنسان والحيوان', 'الأشجار والنباتات', 'الفطريات الكبيرة المشروم'], answerIndex: 0, explanation: 'البكتيريا والبراميسيوم والأميبا هي كائنات تتكون أجسامها من خلية واحدة تقوم بكافة الوظائف الحيوية.', difficulty: 'medium' },
    { type: 'MCQ', question: 'ما وظيفة الغشاء البلازمي المحيط بالخلية؟', options: ['تنظيم مرور المواد من وإلى الخلية', 'بناء البروتين', 'تخزين المادة الوراثية', 'إعطاء الخلية الشكل الصلب الثابت'], answerIndex: 0, explanation: 'الغشاء البلازمي يتميز بخاصية النفاذية الاختيارية التي تسمح بتنظيم ومرور المواد من وإلى الخلية.', difficulty: 'medium' },
    { type: 'MCQ', question: 'ما هي الوظيفة الحيوية للريبوسومات في الخلية؟', options: ['صنع وإنتاج البروتينات', 'توليد الطاقة', 'التخلص من الفضلات', 'تخزين النشا والأملاح'], answerIndex: 0, explanation: 'الريبوسومات هي العضيات الأساسية المسؤولة عن بناء وتصنيع البروتينات في الخلية.', difficulty: 'medium' },
    { type: 'MCQ', question: 'ما المادة الكيميائية الأساسية التي يتكون منها الجدار الخلوي للنبات؟', options: ['السليلوز', 'البروتين', 'الدهون الثنائية', 'النشا الحيواني'], answerIndex: 0, explanation: 'يتكون الجدار الخلوي للنبات من ألياف السليلوز القوية ليعطي الخلية القوة والدعم والصلابة.', difficulty: 'hard' },
    { type: 'MCQ', question: 'ما العضي الذي يقوم بتغليف وتعديل البروتينات وإرسالها لخارج الخلية؟', options: ['أجسام جولجي', 'النواة', 'الفجوة العصارية', 'الريبوسومات الملتصقة'], answerIndex: 0, explanation: 'جهاز أو أجسام جولجي تقوم باستقبال البروتينات وتعديلها وتعبئتها في حويصلات لإفرازها خارج الخلية.', difficulty: 'medium' },
    { type: 'MCQ', question: 'تتميز الفجوات العصارية في الخلايا النباتية بأنها:', options: ['كبيرة الحجم وقليلة العدد', 'صغيرة الحجم وكثيرة العدد', 'تخلو تماماً من الماء والأملاح', 'توجد فقط داخل النواة'], answerIndex: 0, explanation: 'الخلايا النباتية تحتوي على فجوة عصارية مركزية واحدة كبيرة الحجم لتخزين الماء والغذاء والمحافظة على ضغط الخلية.', difficulty: 'medium' },
    { type: 'MCQ', question: 'أي العلماء هو أول من شاهد الخلية وأطلق عليها هذا الاسم؟', options: ['روبرت هوك', 'لويس باستور', 'تسيودور شوان', 'أنتوني ليفنهوك'], answerIndex: 0, explanation: 'العالم الإنجليزي روبرت هوك هو أول من شاهد الخلايا عام 1665م باستخدام مجهر بسيط وفحص شريحة من الفلين.', difficulty: 'medium' },
    { type: 'MCQ', question: 'ما هو الليسوسوم (الجسم المحلل) في الخلية؟', options: ['عضي يحتوي على إنزيمات هاضمة للتخلص من الفضلات', 'عضي لصنع الغذاء بالضوء', 'عضي لتنظيم المادة الوراثية', 'غشاء يحيط بالنواة فقط'], answerIndex: 0, explanation: 'الأجسام المحللة (الليسوسومات) تحتوي على إنزيمات هاضمة قوية تفكك العضيات الهرمة والمواد الغريبة وتخلص الخلية منها.', difficulty: 'hard' },
    { type: 'MCQ', question: 'تعتبر الخلايا العضلية غنية جداً بـ:', options: ['الميتوكوندريا', 'البلاستيدات الخضراء', 'الجدار الخلوي', 'الفجوات الكبيرة'], answerIndex: 0, explanation: 'نظراً لأن العضلات تحتاج إلى طاقة هائلة للقيام بالانقباض والانبساط، فإن خلاياها تحتوي على أعداد ضخمة من الميتوكوندريا.', difficulty: 'hard' },
    { type: 'MCQ', question: 'أي المستويات التالية يمثل الترتيب الصحيح لبناء جسم الكائن الحي من الأصغر للأكبر؟', options: ['خلية -> نسيج -> عضو -> جهاز -> جسم', 'نسيج -> خلية -> عضو -> جهاز -> جسم', 'جهاز -> عضو -> نسيج -> خلية -> جسم', 'عضو -> خلية -> نسيج -> جهاز -> جسم'], answerIndex: 0, explanation: 'الخلايا المتشابهة تشكل نسيجاً، والأنسجة تشكل عضواً، والأعضاء تشكل جهازاً، والأجهزة تشكل جسم الكائن الحي الكامل.', difficulty: 'hard' },

    // 10 FIB
    { type: 'FIB', question: 'تعتبر _______ هي وحدة البناء والوظيفة الأساسية في جسم الكائن الحي.', options: ['الخلية', 'الذرة', 'الأنسجة', 'البروتينات'], answerIndex: 0, explanation: 'الخلية هي أصغر وحدة حية قادرة على الحياة والقيام بجميع وظائف الكائن الحي.', difficulty: 'easy' },
    { type: 'FIB', question: 'يسمى العضي المسؤول عن القيام بالبناء الضوئي في الخلية النباتية بـ _______ .', options: ['البلاستيدة الخضراء', 'الميتوكوندريا', 'النواة', 'الريبوسوم'], answerIndex: 0, explanation: 'البلاستيدات الخضراء هي مصانع الغذاء في النبات وتعمل على امتصاص ضوء الشمس لصنع السكر.', difficulty: 'easy' },
    { type: 'FIB', question: 'تحتوي النواة على المادة الوراثية للخلية وتسمى اختصاراً _______ .', options: ['DNA', 'ATP', 'RNA', 'proteins'], answerIndex: 0, explanation: 'الـ DNA (حمض الديوكسي ريبونوكلييك) هو المادة الوراثية التي تحمل كافة جينات الخلية.', difficulty: 'easy' },
    { type: 'FIB', question: 'يتميز الغشاء البلازمي بخاصية النفاذية _______ التي تسمح بمرور مواد معينة ومنع أخرى.', options: ['الاختيارية', 'الكلية', 'الصلبة', 'المستحيلة'], answerIndex: 0, explanation: 'النفاذية الاختيارية تسمح للغشاء البلازمي بالتحكم التام في البيئة الداخلية للخلية عبر انتقاء ما يدخل ويخرج.', difficulty: 'medium' },
    { type: 'FIB', question: 'العضي الخلوي المسؤول عن توفير الطاقة للخلية هو _______ .', options: ['الميتوكوندريا', 'النواة', 'جهاز جولجي', 'الغشاء البلازمي'], answerIndex: 0, explanation: 'الميتوكوندريا تقوم بعملية التنفس الخلوي لتوليد جزيئات الطاقة ATP للخلية.', difficulty: 'easy' },
    { type: 'FIB', question: 'تحتوي الخلايا النباتية على جدار خلوي سميك يتكون بشكل أساسي من مادة _______ .', options: ['السليلوز', 'البروتين', 'الدهون', 'الجلايكوجين'], answerIndex: 0, explanation: 'السليلوز هو كربوهيدرات معقدة تعطي الجدار الخلوي القوة والصلابة اللازمة لحماية النبات ودعمه.', difficulty: 'medium' },
    { type: 'FIB', question: 'يسمى تجمّع الخلايا المتشابهة في الشكل والوظيفة معاً بـ _______ .', options: ['النسيج', 'العضو', 'الجهاز', 'العضيات'], answerIndex: 0, explanation: 'الخلايا المتشابهة التي تعمل معاً لأداء وظيفة معينة تشكل نسيجاً (مثل النسيج العضلي).', difficulty: 'easy' },
    { type: 'FIB', question: 'تعتبر البكتيريا مثالاً واضحاً للكائنات الحية _______ الخلية.', options: ['وحيدة', 'عديدة', 'ثنائية', 'عديمة'], answerIndex: 0, explanation: 'تتكون البكتيريا من خلية واحدة بسيطة لا تحتوي على نواة محددة بغشاء (بدائية النواة).', difficulty: 'easy' },
    { type: 'FIB', question: 'تسمى العضيات الصغيرة جداً المسؤولة عن بناء وتصنيع البروتينات بالخلايا بـ _______ .', options: ['الريبوسومات', 'الليسوسومات', 'الميتوكوندريا', 'الفجوات'], answerIndex: 0, explanation: 'الريبوسومات هي عضيات خلوية صغيرة جداً غير محاطة بغشاء تقوم بقراءة الحمض النووي لبناء البروتين.', difficulty: 'medium' },
    { type: 'FIB', question: 'العضي الذي يعمل بمثابة "جهاز الهضم والتخلص من السموم والفضلات" في الخلية هو _______ .', options: ['الليسوسوم', 'الريبوسوم', 'البلاستيدات', 'الميتوكوندريا'], answerIndex: 0, explanation: 'الليسوسومات (الأجسام المحللة) غنية بالإنزيمات الهاضمة التي تخلص الخلية من السموم والفضلات والعضيات الهرمة.', difficulty: 'hard' },

    // 10 TF
    { type: 'TF', question: 'جميع الكائنات الحية بلا استثناء تتكون أجسامها من ملايين الخلايا المتعددة.', options: ['خطأ', 'صح'], answerIndex: 0, explanation: 'خطأ! توجد كائنات حية وحيدة الخلية مثل البكتيريا والأميبا والخميرة تتكون من خلية واحدة فقط تقوم بكل العمليات الحيوية.', difficulty: 'easy' },
    { type: 'TF', question: 'تحتوي الخلايا الحيوانية على بلاستيدات خضراء تقوم بالبناء الضوئي.', options: ['خطأ', 'صح'], answerIndex: 0, explanation: 'خطأ! الحيوانات لا تصنع غذائها بنفسها، وتخلو خلاياها تماماً من البلاستيدات الخضراء والجدران الخلوية.', difficulty: 'easy' },
    { type: 'TF', question: 'الخلية النباتية لها شكل هندسي ثابت وصلب بفضل وجود الجدار الخلوي.', options: ['صح', 'خطأ'], answerIndex: 0, explanation: 'صح! الجدار الخلوي السليلوزي يعطي الخلية النباتية القوة والصلابة والدعم ويحفظ شكلها المربع أو المستطيل الثابت.', difficulty: 'easy' },
    { type: 'TF', question: 'النواة هي عضي يحتوي على المادة الوراثية DNA التي توجه انقسام ونمو الخلية.', options: ['صح', 'خطأ'], answerIndex: 0, explanation: 'صح! النواة هي مخزن المادة الوراثية وتتحكم في كافة شؤون وانقسامات الخلية حقيقية النواة.', difficulty: 'easy' },
    { type: 'TF', question: 'الميتوكوندريا توجد بكثرة هائلة في الخلايا العضلية والقلبية لتزويدها بالطاقة المستمرة.', options: ['صح', 'خطأ'], answerIndex: 0, explanation: 'صح! العضلات والقلب تبذل مجهوداً حركياً كبيراً وتحتاج طاقة هائلة، لذا يزداد عدد الميتوكوندريا فيها.', difficulty: 'medium' },
    { type: 'TF', question: 'الريبوسومات هي العضيات المسؤولة عن هضم وتفكيك المواد الغريبة والتالفة بالخلية.', options: ['خطأ', 'صح'], answerIndex: 0, explanation: 'خطأ! الريبوسومات تبني البروتين، بينما الليسوسومات (الأجسام المحللة) هي التي تهضم وتخلص الخلية من التالف.', difficulty: 'medium' },
    { type: 'TF', question: 'تتميز الفجوة العصارية في الخلايا النباتية بأنها كبيرة جداً ومركزية مقارنة بفجوات الخلايا الحيوانية.', options: ['صح', 'خطأ'], answerIndex: 0, explanation: 'صح! الخلية النباتية تحتوي على فجوة مركزية عملاقة لتخزين الماء والمحافظة على الضغط الاسموزي للنبات ليظل واقفاً.', difficulty: 'medium' },
    { type: 'TF', question: 'العالم روبرت هوك هو أول من اخترع المجهر ورأى البكتيريا الحية والدم تحت المجهر.', options: ['خطأ', 'صح'], answerIndex: 0, explanation: 'خطأ! روبرت هوك رأى خلايا الفلين الميتة، أما ليفنهوك فهو أول من رأى كائنات حية مجهرية كالبكتيريا والدم باستخدام مجهر متطور صممه بنفسه.', difficulty: 'hard' },
    { type: 'TF', question: 'يتكون النسيج من مجموعة من الأعضاء المختلفة التي تعمل معاً.', options: ['خطأ', 'صح'], answerIndex: 0, explanation: 'خطأ! النسيج يتكون من خلايا متشابهة، بينما العضو هو الذي يتكون من أنسجة مختلفة تعمل معاً (مثل المعدة).', difficulty: 'medium' },
    { type: 'TF', question: 'الغشاء البلازمي يحيط بالخلية ويتميز بخاصية النفاذية الاختيارية لحماية بيئة الخلية.', options: ['صح', 'خطأ'], answerIndex: 0, explanation: 'صح! النفاذية الاختيارية تسمح للغشاء بالتحكم في توازن ودخول المواد والماء والأملاح للخلية بشكل دقيق.', difficulty: 'easy' },

    // 3 HOQ
    { type: 'HOQ', question: 'ماذا سيحدث للخلية النباتية إذا تم إزالة أو تدمير الجدار الخلوي منها ووضعت في ماء عذب؟', options: [
      'ستمتص الماء وتنتفخ حتى تنفجر لعدم وجود جدار يدعم الضغط',
      'ستنكمش الخلية وتفقد كل الماء المخزن بداخلها',
      'لن تتأثر الخلية إطلاقاً وستستمر في البناء الضوئي كالمعتاد',
      'سيتضاعف حجم النواة لتعويض غياب الجدار الخلوي'
    ], answerIndex: 0, explanation: 'الجدار الخلوي يمنع انفجار الخلية النباتية عند امتلائها بالماء العذب. بدونه، ستستمر الخلية في امتصاص الماء بالخاصية الاسموزية حتى تنفجر تماماً مثل الخلية الحيوانية.', difficulty: 'hard' },
    { type: 'HOQ', question: 'كيف يساهم تركيب جدار الأمعاء الدقيقة في تسهيل امتصاص الغذاء مقارنة بتركيب الجلد؟', options: [
      'يتكون جدار الأمعاء من نسيج طلائي رقيق وبسيط ذو خملات لزيادة مساحة الامتصاص، بينما الجلد سميك للحماية',
      'الجلد يحتوي على خلايا ميتوكوندريا أكثر تمنع نفاذ الغذاء',
      'الأمعاء تخلو تماماً من الغشاء البلازمي لتسمح بمرور الطعام بشكل مباشر وسريع',
      'الجلد نسيج عضلي صلب بينما الأمعاء الدقيقة نسيج عصبي بالكامل'
    ], answerIndex: 0, explanation: 'الأنسجة متخصصة للوظائف: الأمعاء تحتوي على نسيج طلائي رقيق وبسيط وخملات لتسهيل وسرعة نفاذ وامتصاص الغذاء المهضوم للدم، بينما نسيج الجلد مركب وسميك ومغطى بالكيراتين للحماية من العوامل الخارجية والجرثومية.', difficulty: 'hard' },
    { type: 'HOQ', question: 'قارن بين خلايا ورقة نبات خضراء وخلايا جذر النبات من حيث العضيات الخلوية الواردة فيهما:', options: [
      'خلايا الورقة غنية بالبلاستيدات الخضراء للتمثيل الضوئي، بينما خلايا الجذر تخلو منها لعدم وصول الضوء وتخزن الغذاء',
      'خلايا الجذر تحتوي على جدار خلوي بينما خلايا الورقة تفتقر إليه',
      'خلايا الورقة بدائية النواة بينما خلايا الجذور حقيقية النواة',
      'خلايا الجذور تحتوي على ميتوكوندريا وخلايا الورقة لا تحتوي على أي ميتوكوندريا'
    ], answerIndex: 0, explanation: 'البلاستيدات الخضراء تحتاج إلى الضوء لتنشط، ولأن الجذور تنمو تحت الأرض في الظلام الدامس، فإن خلاياها تخلو من البلاستيدات الخضراء (وتحتوي على بلاستيدات عديمة اللون لتخزين النشا)، بينما خلايا الورقة المعرضة للشمس غنية جداً بالبلاستيدات الخضراء للقيام بالبناء الضوئي.', difficulty: 'hard' }
  ]
};

// ─── 2. MATH PACK DATA (38 QUESTIONS) ─────────────────────────────────────────
const mathPack = {
  title: 'الرياضيات - الجبر: المعادلات والمتباينات',
  grade: 'الصف السابع',
  subject: 'الرياضيات',
  subjectId: 'math',
  status: 'published',
  order: 3,
  xp: 150,
  source: 'firestore',
  summary: {
    title: 'ملخص درس: المعادلات والمتباينات الجبرية',
    body: 'يتناول هذا الدرس كيفية صياغة العبارات اللفظية إلى معادلات ومتباينات جبرية وحلها باستخدام العمليات العكسية للمساواة وخصائص التباين في الرياضيات.',
    points: [
      'المعادلة هي جملة رياضية تحتوي على إشارة المساواة (=) وتدل على تساوي كميتين.',
      'حل المعادلة يعني إيجاد قيمة المتغير (المجهول) الذي يجعل الجملة الرياضية صحيحة.',
      'نستخدم العمليات العكسية لحل المعادلات: عكس الجمع هو الطرح، وعكس الضرب هو القسمة.',
      'المتباينة هي جملة رياضية تحتوي على أحد رموز التباين (أكبر من >، أصغر من <، أكبر من أو يساوي >=، أصغر من أو يساوي <=).',
      'عند ضرب أو قسمة طرفي المتباينة في عدد سالب، يجب عكس اتجاه رمز التباين فوراً.',
    ]
  },
  questions: [
    // 15 MCQ
    { type: 'MCQ', question: 'ما هو حل المعادلة الجبرية التالية: س + ٧ = ١٥؟', options: ['س = ٨', 'س = ٢٢', 'س = ٧', 'س = ١٠'], answerIndex: 0, explanation: 'نطرح ٧ من طرفي المعادلة باستخدام العملية العكسية للجمع: س = ١٥ - ٧ = ٨.', difficulty: 'easy' },
    { type: 'MCQ', question: 'ما حل المعادلة الجبرية التالية: ٤ ص = ٢٤؟', options: ['ص = ٦', 'ص = ٢٠', 'ص = ٢٨', 'ص = ٩٦'], answerIndex: 0, explanation: 'نقسم طرفي المعادلة على ٤ (عكس الضرب): ص = ٢٤ ÷ ٤ = ٦.', difficulty: 'easy' },
    { type: 'MCQ', question: 'ما حل المعادلة التالية التي تتكون من خطوتين: ٢ أ - ٣ = ١١؟', options: ['أ = ٧', 'أ = ٤', 'أ = ٨', 'أ = ١٤'], answerIndex: 0, explanation: 'أولاً نتخلص من -٣ بإضافة ٣ للطرفين: ٢ أ = ١٤. ثانياً نقسم على ٢: أ = ٧.', difficulty: 'medium' },
    { type: 'MCQ', question: 'ما هي صياغة العبارة اللفظية التالية إلى معادلة جبرية: "أقل من عدد بمقدار ٥ يساوي ١٢"؟', options: ['س - ٥ = ١٢', 'س + ٥ = ١٢', '٥ - س = ١٢', 'س = ١٢ - ٥'], answerIndex: 0, explanation: '"أقل من عدد بمقدار ٥" تعني طرح ٥ من المتغير (س)، "يساوي ١٢" تعني = ١٢، فينتج: س - ٥ = ١٢.', difficulty: 'medium' },
    { type: 'MCQ', question: 'ما حل المعادلة الجبرية التالية: س ÷ ٣ = ٩؟', options: ['س = ٢٧', 'س = ٣', 'س = ١٢', 'س = ٦'], answerIndex: 0, explanation: 'نضرب طرفي المعادلة في ٣ (العملية العكسية للقسمة): س = ٩ × ٣ = ٢٧.', difficulty: 'easy' },
    { type: 'MCQ', question: 'أي من القيم التالية تمثل حلاً للمتباينة: س + ٢ > ٥؟', options: ['٤', '٣', '٢', '١'], answerIndex: 0, explanation: 'نطرح ٢ من الطرفين: س > ٣. القيمة الوحيدة الأكبر من ٣ في الخيارات هي ٤.', difficulty: 'medium' },
    { type: 'MCQ', question: 'ما هي صياغة العبارة اللفظية التالية: "ثلاثة أمثال عدد مضافاً إليه ٤ يساوي ١٩"؟', options: ['٣س + ٤ = ١٩', 'س/٣ + ٤ = ١٩', '٣(س + ٤) = ١٩', '٣س - ٤ = ١٩'], answerIndex: 0, explanation: '"ثلاثة أمثال عدد" هي ٣س، "مضافاً إليه ٤" تعني + ٤، فينتج: ٣س + ٤ = ١٩.', difficulty: 'medium' },
    { type: 'MCQ', question: 'ما حل المعادلة الجبرية التالية: ٥ - س = ٢؟', options: ['س = ٣', 'س = ٧', 'س = -٣', 'س = ٢'], answerIndex: 0, explanation: 'نطرح ٥ من الطرفين: -س = -٣، بالضرب في -١ ينتج: س = ٣.', difficulty: 'medium' },
    { type: 'MCQ', question: 'عند حل المتباينة: -٢س < ٨، وقسمة الطرفين على -٢، ما المتباينة الناتجة؟', options: ['س > -٤', 'س < -٤', 'س < ٤', 'س > ٤'], answerIndex: 0, explanation: 'عند قسمة طرفي المتباينة على عدد سالب (-٢)، يجب قلب رمز التباين من أصغر من (<) إلى أكبر من (>)، فينتج: س > -٤.', difficulty: 'hard' },
    { type: 'MCQ', question: 'ما هو حل المعادلة الجبرية التالية: ٣س + ١ = ٢س + ٥؟', options: ['س = ٤', 'س = ٦', 'س = ٢', 'س = ٨'], answerIndex: 0, explanation: 'نطرح ٢س من الطرفين: س + ١ = ٥. نطرح ١ من الطرفين: س = ٤.', difficulty: 'hard' },
    { type: 'MCQ', question: 'ما حل المتباينة الجبرية التالية: ٢س - ٤ <= ٦؟', options: ['س <= ٥', 'س <= ٢', 'س >= ٥', 'س <= ١٠'], answerIndex: 0, explanation: 'نضيف ٤ للطرفين: ٢س <= ١٠. نقسم على ٢: س <= ٥.', difficulty: 'medium' },
    { type: 'MCQ', question: 'ما قيمة ص التي تحقق المعادلة: ص/٢ - ٥ = -١؟', options: ['ص = ٨', 'ص = ١٢', 'ص = -١٢', 'ص = ٤'], answerIndex: 0, explanation: 'نضيف ٥ للطرفين: ص/٢ = ٤. نضرب في ٢ للطرفين: ص = ٨.', difficulty: 'medium' },
    { type: 'MCQ', question: 'ما صياغة الجملة: "يجب ألا يقل عمر المشترك عن ١٥ سنة" إلى متباينة جبرية؟', options: ['ع >= ١٥', 'ع <= ١٥', 'ع > ١٥', 'ع < ١٥'], answerIndex: 0, explanation: '"ألا يقل" تعني أن العمر يجب أن يكون ١٥ سنة أو أكثر، ورمزها الرياضي هو أكبر من أو يساوي (>=)، فينتج: ع >= ١٥.', difficulty: 'hard' },
    { type: 'MCQ', question: 'ما حل المعادلة الجبرية التالية: ٤ (س - ٢) = ١٦؟', options: ['س = ٦', 'س = ٤', 'س = ٨', 'س = ٢'], answerIndex: 0, explanation: 'نقسم الطرفين أولاً على ٤: س - ٢ = ٤. نضيف ٢ للطرفين: س = ٦.', difficulty: 'hard' },
    { type: 'MCQ', question: 'أي الجمل الرياضية التالية تعتبر متباينة؟', options: ['س + ٥ > ٩', 'س + ٥ = ٩', 'س + ٥', '٩ = ٩'], answerIndex: 0, explanation: 'المتباينة هي الجملة التي تحتوي على رمز التباين مثل اكبر من (>)، بينما المعادلة تحتوي على (=) والعبارة الجبرية تخلو منهما.', difficulty: 'easy' },

    // 10 FIB
    { type: 'FIB', question: 'تسمى الجملة الرياضية التي تحتوي على إشارة المساواة (=) بـ _______ .', options: ['المعادلة', 'المتباينة', 'العبارة الجبرية', 'المتغير'], answerIndex: 0, explanation: 'المعادلة هي جملة رياضية تفصل بين كفتين متساويتين برمز المساواة (=).', difficulty: 'easy' },
    { type: 'FIB', question: 'تسمى القيمة التي تجعل المعادلة صحيحة عند التعويض بها بـ _______ المعادلة.', options: ['حل', 'معامل', 'مجهول', 'طرف'], answerIndex: 0, explanation: 'حل المعادلة هو القيمة العددية للمتغير المجهول التي تجعل الطرف الأيمن مساوياً للطرف الأيسر.', difficulty: 'easy' },
    { type: 'FIB', question: 'عند ضرب أو قسمة طرفي متباينة في عدد سالب، يجب _______ اتجاه رمز التباين.', options: ['عكس', 'تثبيت', 'حذف', 'مضاعفة'], answerIndex: 0, explanation: 'الضرب أو القسمة في سالب يغير إشارة القيم وبالتالي يجب قلب اتجاه المتباينة فوراً للمحافظة على صحتها.', difficulty: 'medium' },
    { type: 'FIB', question: 'للتخلص من العدد المجموع مع المتغير في المعادلة نستخدم عملية _______ للطرفين.', options: ['الطرح', 'الجمع', 'الضرب', 'القسمة'], answerIndex: 0, explanation: 'العملية العكسية للجمع هي الطرح للتخلص من الأعداد المضافة إلى المتغير المجهول.', difficulty: 'easy' },
    { type: 'FIB', question: 'الرمز الرياضي الذي يعبر عن الجملة "أصغر من أو يساوي" هو _______ .', options: ['<=', '>=', '<', '>'], answerIndex: 0, explanation: 'أصغر من أو يساوي يرمز لها بالرمز (<=) في الرياضيات والبرمجة.', difficulty: 'easy' },
    { type: 'FIB', question: 'حل المعادلة: ٢س = ١٠ هو س تساوي _______ .', options: ['٥', '٢٠', '٨', '١٢'], answerIndex: 0, explanation: 'نقسم طرفي المعادلة على ٢ للحصول على قيمة س: س = ١٠ ÷ ٢ = ٥.', difficulty: 'easy' },
    { type: 'FIB', question: 'الجملة الرياضية التي تشتمل على أحد الرموز (>، <، >=، <=) تسمى بـ _______ .', options: ['المتباينة', 'المعادلة', 'المتطابقة', 'النسبة المئوية'], answerIndex: 0, explanation: 'المتباينة هي الجملة التي تبين عدم التساوي بين كميتين باستخدام رموز التباين.', difficulty: 'easy' },
    { type: 'FIB', question: 'قيمة المتغير ص في المعادلة: ص - ٤ = -٣ هي ص تساوي _______ .', options: ['١', '٧', '-٧', '-١'], answerIndex: 0, explanation: 'نضيف ٤ للطرفين: ص = -٣ + ٤ = ١.', difficulty: 'medium' },
    { type: 'FIB', question: 'لحل المعادلة: س ÷ ٥ = ٣، نضرب طرفي المعادلة في العدد _______ .', options: ['٥', '٣', '١٥', '١'], answerIndex: 0, explanation: 'نستخدم العملية العكسية للقسمة وهي الضرب في نفس المقام للتخلص منه: س = ٣ × ٥ = ١٥.', difficulty: 'easy' },
    { type: 'FIB', question: 'المتباينة التي تمثل الجملة "الحد الأدنى لدرجة النجاح هو ٥٠" هي د _______ ٥٠.', options: ['>=', '<=', '>', '<'], answerIndex: 0, explanation: '"الحد الأدنى" يعني ٥٠ درجة أو أكثر، ورمزها الرياضي هو أكبر من أو يساوي (>=).', difficulty: 'hard' },

    // 10 TF
    { type: 'TF', question: 'حل المعادلة س + ٨ = ٥ هو س = ٣.', options: ['خطأ', 'صح'], answerIndex: 0, explanation: 'خطأ! نطرح ٨ من الطرفين: س = ٥ - ٨ = -٣، وليس ٣.', difficulty: 'easy' },
    { type: 'TF', question: 'العبارة س + ٩ تعتبر معادلة جبرية كاملة.', options: ['خطأ', 'صح'], answerIndex: 0, explanation: 'خطأ! العبارة س + ٩ تسمى عبارة جبرية وتخلو من علامة المساواة (=) والطرف الثاني، لذا فهي ليست معادلة.', difficulty: 'easy' },
    { type: 'TF', question: 'عند ضرب طرفي المتباينة في عدد موجب، لا يتغير اتجاه رمز التباين.', options: ['صح', 'خطأ'], answerIndex: 0, explanation: 'صح! اتجاه التباين يتغير فقط عند الضرب أو القسمة في عدد سالب، أما الأعداد الموجبة فتحافظ على الاتجاه.', difficulty: 'easy' },
    { type: 'TF', question: 'العدد ٥ يعتبر حلاً صحيحاً للمتباينة س < ٥.', options: ['خطأ', 'صح'], answerIndex: 0, explanation: 'خطأ! المتباينة س < ٥ تعني الأعداد الأصغر تماماً من ٥، والعدد ٥ ليس أصغر من نفسه. لو كانت س <= ٥ لكانت صحيحة.', difficulty: 'medium' },
    { type: 'TF', question: 'حل المعادلة ٣س - ٢ = ١٠ هو س = ٤.', options: ['صح', 'خطأ'], answerIndex: 0, explanation: 'صح! نضيف ٢ للطرفين: ٣س = ١٢. نقسم على ٣: س = ٤.', difficulty: 'easy' },
    { type: 'TF', question: 'المعادلة والعبارة الجبرية هما مصطلحان يدلان على نفس الشيء الرياضي تماماً.', options: ['خطأ', 'صح'], answerIndex: 0, explanation: 'خطأ! المعادلة تحتوي على علامة مساوية وطرفين (مثل س+١=٥)، أما العبارة الجبرية فهي مجرد مقدار رياضي لا مساواة فيه (مثل س+١).', difficulty: 'easy' },
    { type: 'TF', question: 'حل المتباينة س/٢ > ٦ هو س > ١٢.', options: ['صح', 'خطأ'], answerIndex: 0, explanation: 'صح! نضرب طرفي المتباينة في ٢ للتخلص من المقام، فينتج: س > ١٢.', difficulty: 'medium' },
    { type: 'TF', question: 'في المتباينة -س > ٤، يكون الحل النهائي هو س > -٤.', options: ['خطأ', 'صح'], answerIndex: 0, explanation: 'خطأ! بضرب الطرفين في -١ للتخلص من السالب، يجب قلب رمز التباين من أكبر من إلى أصغر من، فينتج: س < -٤.', difficulty: 'hard' },
    { type: 'TF', question: 'المعادلة ٤س = ٠ ليس لها حل في مجموعة الأعداد الحقيقية.', options: ['خطأ', 'صح'], answerIndex: 0, explanation: 'خطأ! لها حل وحيد وصحيح وهو س = ٠، لأن ٤ × ٠ = ٠.', difficulty: 'medium' },
    { type: 'TF', question: 'العبارة اللفظية "مثلا عدد يساوي ١٠" تكتب رياضياً بصورة: ٢س = ١٠.', options: ['صح', 'خطأ'], answerIndex: 0, explanation: 'صح! "مثلا عدد" يعني مثلي العدد (ضعفاه) أي ٢س، "يساوي ١٠" تعني = ١٠.', difficulty: 'easy' },

    // 3 HOQ
    { type: 'HOQ', question: 'أوجد العدد الذي إذا أضفت ثلاثة أمثاله إلى ٥، كان الناتج مساوياً لطرح هذا العدد من ١٧؟', options: ['٣', '٤', '٢', '٥'], answerIndex: 0, explanation: 'نصيغها كمعادلة: ٣س + ٥ = ١٧ - س. نضيف س للطرفين: ٤س + ٥ = ١٧. نطرح ٥ من الطرفين: ٤س = ١٢. نقسم على ٤: س = ٣.', difficulty: 'hard' },
    { type: 'HOQ', question: 'مستطيل محيطه ٢٤ سم، إذا كان طوله يزيد عن عرضه بمقدار ٢ سم، فما هي مساحة المستطيل الجبرية؟', options: ['٣٥ سم مربع', '٢٤ سم مربع', '٤٨ سم مربع', '١٥ سم مربع'], answerIndex: 0, explanation: 'نفرض العرض س، والطول س+٢. المحيط = ٢ (العرض + الطول) -> ٢٤ = ٢ (س + س + ٢) -> ١٢ = ٢س + ٢ -> ٢س = ١٠ -> س (العرض) = ٥ سم. الطول = ٧ سم. المساحة = الطول × العرض = ٧ × ٥ = ٣٥ سم مربع.', difficulty: 'hard' },
    { type: 'HOQ', question: 'حل المتباينة الجبرية المركبة التالية وحدد مجموعة قيمها الصحيحة: -٣ < ٢س + ١ <= ٧؟', options: ['-٢ < س <= ٣', '-٣ < س <= ٧', '-٢ <= س < ٣', '١ < س <= ٤'], answerIndex: 0, explanation: 'لحل المتباينة المركبة، نطرح ١ من جميع الأطراف: -٤ < ٢س <= ٦. ثم نقسم جميع الأطراف على ٢: -٢ < س <= ٣. وهذه هي قيم س الممكنة.', difficulty: 'hard' }
  ]
};

async function main() {
  try {
    console.log('Logging in anonymously to Firestore...');
    const cred = await signInAnonymously(auth);
    console.log('Authenticated! User UID:', cred.user.uid);

    // ─── PUSH SCIENCE PACK ───────────────────────────────────────────────────
    console.log('\n--- Science Pack ---');
    console.log('Creating Science Pack document...');
    const sciPackRef = await addDoc(collection(db, 'learning_packs'), {
      title: sciencePack.title,
      grade: sciencePack.grade,
      subject: sciencePack.subject,
      subjectId: sciencePack.subjectId,
      status: sciencePack.status,
      order: sciencePack.order,
      xp: sciencePack.xp,
      source: sciencePack.source,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      questionCounts: {
        mcq: 15,
        fib: 10,
        trueFalse: 10,
        hoq: 3
      }
    });
    console.log('Science Pack created! ID:', sciPackRef.id);

    console.log('Creating Science Summary...');
    await addDoc(collection(db, 'summaries'), {
      packId: sciPackRef.id,
      title: sciencePack.summary.title,
      body: sciencePack.summary.body,
      points: sciencePack.summary.points,
      status: 'published',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log('Science Summary created!');

    console.log('Pushing 38 Science Questions...');
    for (const [index, q] of sciencePack.questions.entries()) {
      await addDoc(collection(db, 'questions'), {
        packId: sciPackRef.id,
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
    }
    console.log('All 38 Science Questions pushed!');

    // ─── PUSH MATH PACK ──────────────────────────────────────────────────────
    console.log('\n--- Math Pack ---');
    console.log('Creating Math Pack document...');
    const mathPackRef = await addDoc(collection(db, 'learning_packs'), {
      title: mathPack.title,
      grade: mathPack.grade,
      subject: mathPack.subject,
      subjectId: mathPack.subjectId,
      status: mathPack.status,
      order: mathPack.order,
      xp: mathPack.xp,
      source: mathPack.source,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      questionCounts: {
        mcq: 15,
        fib: 10,
        trueFalse: 10,
        hoq: 3
      }
    });
    console.log('Math Pack created! ID:', mathPackRef.id);

    console.log('Creating Math Summary...');
    await addDoc(collection(db, 'summaries'), {
      packId: mathPackRef.id,
      title: mathPack.summary.title,
      body: mathPack.summary.body,
      points: mathPack.summary.points,
      status: 'published',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log('Math Summary created!');

    console.log('Pushing 38 Math Questions...');
    for (const [index, q] of mathPack.questions.entries()) {
      await addDoc(collection(db, 'questions'), {
        packId: mathPackRef.id,
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
    }
    console.log('All 38 Math Questions pushed!');

    console.log('\n🎉 ALL SCIENCE & MATH CURRICULUM PACKS SUCCESSFULLY PUSHED AND LIVE!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding curriculum packs:', error);
    process.exit(1);
  }
}

main();
