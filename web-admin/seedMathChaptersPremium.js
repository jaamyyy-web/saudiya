import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, doc, updateDoc, deleteDoc, writeBatch, addDoc, serverTimestamp } from 'firebase/firestore';
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

// Helper to shuffle options and keep track of the correct answer index
function shuffle(options, correctIdx) {
  const correctVal = options[correctIdx];
  const opts = [...options];
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  const ansIdx = opts.indexOf(correctVal);
  return { opts, ansIdx: ansIdx >= 0 ? ansIdx : 0 };
}

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate unique power step-by-step explanation
function generatePowerSteps(base, power) {
  let val = base;
  let steps = [`$${base}^1 = ${base}$`];
  for (let p = 2; p <= power; p++) {
    const prev = val;
    val = val * base;
    steps.push(`$${base}^${p} = ${prev} \\times ${base} = ${val}$`);
  }
  return steps.map((s, idx) => `   الخطوة ${idx + 1}: ${s}`).join('\n');
}

// Generate premium step-by-step math chapter questions
function generateMathChapterData(num) {
  const mcqs = [];
  const fibs = [];
  const tfs = [];
  const hoqs = [];
  
  let title = '';
  let summary = {};
  
  if (num === 1) {
    title = 'الرياضيات - الفصل الأول: الجبر والدوال والأسس';
    summary = {
      title: 'ملخص الفصل الأول: الجبر والدوال وقوانين الأسس',
      body: 'يشرح هذا الفصل المبادئ الجبرية الأساسية وحساب القوى والأسس، وتطبيق ترتيب العمليات الرياضية لحل العبارات الجبرية المعقدة.',
      points: [
        'القوى والأسس تعبر عن الضرب المتكرر للعدد في نفسه، مثل $3^5 = 3 \\times 3 \\times 3 \\times 3 \\times 3 = 243$.',
        'ترتيب العمليات الحسابية ضروري: الأقواس أولاً، ثم الأسس، ثم الضرب والقسمة، وأخيراً الجمع والطرح.',
        'المتغير هو رمز (مثل $x$ أو $y$) يمثل قيمة مجهولة غير معلومة.',
        'العبارة الجبرية تتكون من متغيرات وأعداد وعملية حسابية واحدة على الأقل، مثل $2x + 5$.',
        'الخطوات الأربع لحل المسألة هي: افهم، خطط، حل، تحقق.'
      ]
    };
    
    // MCQ (15)
    for (let i = 0; i < 15; i++) {
      const qType = i % 4;
      if (qType === 0) {
        const base = rand(2, 6);
        const power = rand(2, 4);
        const ans = Math.pow(base, power);
        const sh = shuffle([ans.toString(), (ans + rand(3, 7)).toString(), (base * power).toString(), (ans - rand(1, 3)).toString()], 0);
        mcqs.push({
          question: `أوجد قيمة القوة والأس الرياضي التالي: $${base}^${power}$`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية:\n1. الأسس تعبر عن تكرار ضرب الأساس ($${base}$) في نفسه بعدد مرات الأس ($${power}$).\n2. نكتب عملية الضرب المتكرر: $${Array(power).fill(base).join(' \\times ')}$\n3. نحسب ناتج الضرب خطوة بخطوة:\n${generatePowerSteps(base, power)}\nإذن، الناتج النهائي هو $${ans}$.`
        });
      } else if (qType === 1) {
        const a = rand(2, 5);
        const b = rand(3, 6);
        const c = rand(2, 4);
        const d = rand(1, 5);
        const p1 = b + c;
        const p2 = a * p1;
        const ans = p2 - d;
        const sh = shuffle([ans.toString(), (ans + rand(3, 8)).toString(), (a * b + c - d).toString(), (ans - rand(2, 4)).toString()], 0);
        mcqs.push({
          question: `احسب قيمة العبارة العددية التالية باستخدام ترتيب العمليات الحسابية: $${a} \\times (${b} + ${c}) - ${d}$`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية:\n1. نفك ما بداخل الأقواس أولاً كأولوية قصوى: $(${b} + ${c}) = ${p1}$\n2. تصبح العبارة: $${a} \\times ${p1} - ${d}$\n3. نجري عملية الضرب قبل الطرح (أولوية الضرب): $${a} \\times ${p1} = ${p2}$\n4. نجري عملية الطرح أخيراً: $${p2} - ${d} = ${ans}$\nإذن، الناتج الصحيح هو $${ans}$.`
        });
      } else if (qType === 2) {
        const coeff = rand(2, 5);
        const val = rand(2, 5);
        const constant = rand(3, 9);
        const p1 = coeff * val;
        const ans = p1 + constant;
        const sh = shuffle([ans.toString(), (coeff + val + constant).toString(), (ans + rand(2, 6)).toString(), (ans - rand(2, 4)).toString()], 0);
        mcqs.push({
          question: `احسب قيمة العبارة الجبرية التالية: $${coeff}x + ${constant}$ عندما تكون قيمة المتغير $x = ${val}$`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية:\n1. نعوض عن قيمة المتغير $x$ بالعدد $${val}$ في العبارة الجبرية: $${coeff}(${val}) + ${constant}$\n2. نجري عملية الضرب أولاً: $${coeff} \\times ${val} = ${p1}$\n3. نجمع الناتج مع الثابت: $${p1} + ${constant} = ${ans}$\nإذن، القيمة الإجمالية هي $${ans}$.`
        });
      } else {
        const a = rand(2, 6);
        const sh = shuffle([`الخاصية الإبدالية للجمع`, `الخاصية التجميعية للجمع`, `خاصية التوزيع`, `عنصر المحايد الجمعي`], 0);
        mcqs.push({
          question: `العبارة الجبرية $x + ${a} = ${a} + x$ تمثل أي خاصية من الخصائص الرياضية؟`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية:\n1. نلاحظ أن العبارة تبين أن تغيير ترتيب الأعداد المضافة لا يغير من قيمة الناتج النهائي للجمع.\n2. الصيغة العامة هي: $a + b = b + a$.\nإذن، هذه الخاصية تسمى: الخاصية الإبدالية للجمع.`
        });
      }
    }
    
    // FIB (10)
    for (let i = 0; i < 10; i++) {
      const base = rand(2, 5);
      const power = rand(2, 3);
      const ans = Math.pow(base, power);
      fibs.push({
        question: `أكمل الجملة الرياضية التالية بما يناسب: "قيمة القوة والأس للعدد $${base}^${power}$" تساوي _______`,
        options: [ans.toString(), (base * power).toString(), (ans + rand(2, 4)).toString(), (ans - rand(1, 2)).toString()],
        answerIndex: 0,
        explanation: `خطوات الحل المنهجية:\n1. نقوم بتكرار ضرب الأساس ($${base}$) في نفسه بعدد الأس ($${power}$): $${base}^${power} = ${Array(power).fill(base).join(' \\times ')} = ${ans}$\nإذن، الفراغ يجب أن يملأ بالقيمة $${ans}$.`
      });
    }

    // TF (10)
    for (let i = 0; i < 10; i++) {
      const a = rand(2, 4);
      const b = rand(3, 5);
      const ans = a * b;
      const isTrue = i % 2 === 0;
      const qText = isTrue 
        ? `تعتبر العبارة التالية صحيحة: "ناتج ضرب العددين $${a}$ و $${b}$ هو $${ans}$"`
        : `تعتبر العبارة التالية صحيحة: "ناتج ضرب العددين $${a}$ و $${b}$ هو $${ans + rand(2, 5)}$"`;
      tfs.push({
        question: qText,
        options: ['صح', 'خطأ'],
        answerIndex: isTrue ? 0 : 1,
        explanation: `خطوات الحل المنهجية:\n1. نضرب العددين مباشرة: $${a} \\times ${b} = ${ans}$.\n2. نتحقق من صحة العبارة المعروضة ونقارنها مع الناتج الصحيح.\nإذن، العبارة تعتبر ${isTrue ? 'صحيحة (صح)' : 'خاطئة (خطأ)'}.`
      });
    }

    // HOQ (3)
    for (let i = 0; i < 3; i++) {
      const a = rand(2, 3);
      const b = rand(2, 3);
      const c = rand(2, 4);
      const valA = Math.pow(2, a);
      const valB = Math.pow(3, b);
      const ans = valA * c + valB;
      hoqs.push({
        question: `[تفكير ناقد] أوجد القيمة النهائية للمسألة الرياضية المركبة التالية: $2^${a} \\times ${c} + 3^${b}$`,
        options: [ans.toString(), (valA + c + valB).toString(), (ans + rand(4, 9)).toString(), (ans - rand(2, 5)).toString()],
        answerIndex: 0,
        explanation: `خطوات الحل التفصيلية العميقة:\n1. نحسب قيمة الأسس أولاً:\n   - $2^${a} = ${valA}$\n   - $3^${b} = ${valB}$\n2. نعوض في المسألة لتصبح: $${valA} \\times ${c} + ${valB}$\n3. نجري عملية الضرب كأولوية قبل الجمع:\n   $${valA} \\times ${c} = ${valA * c}$\n4. نجمع الناتج مع الأس الآخر:\n   $${valA * c} + ${valB} = ${ans}$\nإذن، الناتج النهائي الصحيح والمنطقي هو $${ans}$.`
      });
    }
  }
  else if (num === 2) {
    title = 'الرياضيات - الفصل الثاني: الأعداد الصحيحة والعمليات عليها';
    summary = {
      title: 'ملخص الفصل الثاني: الأعداد الصحيحة والمستوى الإحداثي',
      body: 'يغطي هذا الفصل الأعداد الموجبة والسالبة، والقيمة المطلقة للأعداد الصحيحة، وإجراء العمليات الحسابية الأربع عليها، مع تمثيل النقاط في المستوى الإحداثي ثنائي الأبعاد.',
      points: [
        'الأعداد الصحيحة تشمل الأعداد الموجبة والسالبة والصفر.',
        'القيمة المطلقة للعدد هي بعده عن الصفر على خط الأعداد وتكون دائماً موجبة، ويرمز لها بـ $|x|$.',
        'عند جمع أعداد صحيحة متشابهة الإشارة نجمع ونضع نفس الإشارة، وإذا كانت مختلفة نطرح ونضع إشارة الأكبر.',
        'عند ضرب أو قسمة أعداد متشابهة الإشارة تكون النتيجة موجبة، وإذا كانت مختلفة الإشارة تكون سالبة.',
        'المستوى الإحداثي يتكون من محور السينات $x$ ومحور الصادات $y$ متقاطعين عند نقطة الأصل $(0,0)$.'
      ]
    };

    // MCQ (15)
    for (let i = 0; i < 15; i++) {
      const qType = i % 4;
      if (qType === 0) {
        const val = rand(5, 15);
        const sh = shuffle([val.toString(), `-${val}`, '0', (val * 2).toString()], 0);
        mcqs.push({
          question: `احسب القيمة المطلقة للعدد الصحيح السالب التالي: $|-${val}|$`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية:\n1. القيمة المطلقة تعبر عن المسافة الهندسية بين العدد والصفر على خط الأعداد.\n2. بما أن المسافة لا يمكن أن تكون سالبة أبداً، فإن القيمة المطلقة تكون موجبة دائماً:\n   $|-${val}| = ${val}$\nإذن، الناتج الصحيح هو $${val}$.`
        });
      } else if (qType === 1) {
        const a = rand(3, 9);
        const b = rand(2, 8);
        const ans = - (a + b);
        const sh = shuffle([ans.toString(), (a + b).toString(), `-${Math.abs(a - b)}`, '0'], 0);
        mcqs.push({
          question: `أوجد ناتج عملية جمع الأعداد الصحيحة التالية: $(-${a}) + (-${b})$`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية:\n1. نلاحظ أن كلا العددين سالبان (متشابهان في الإشارة).\n2. نطبق قاعدة الإشارات للجمع: نجمع قيمتيهما المطلقتين: $${a} + ${b} = ${a + b}$.\n3. نضع الإشارة السالبة المشتركة ليكون الناتج: $${ans}$.`
        });
      } else if (qType === 2) {
        const a = rand(3, 7);
        const b = rand(2, 6);
        const ans = a * b;
        const sh = shuffle([ans.toString(), `-${ans}`, (a + b).toString(), `-${a + b}`], 0);
        mcqs.push({
          question: `أوجد ناتج ضرب الأعداد الصحيحة التالية: $(-${a}) \\times (-${b})$`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية:\n1. نطبق قاعدة إشارات الضرب: ضرب عدد سالب في عدد سالب يعطي دائماً عدداً موجباً:\n   $(- \\times - = +)$\n2. نضرب القيم مباشرة: $${a} \\times ${b} = ${ans}$\nإذن، الناتج النهائي هو $${ans}$ موجب.`
        });
      } else {
        const quadrants = ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'];
        const quadIdx = i % 4;
        let pText = '';
        if (quadIdx === 0) pText = `A(${rand(1, 5)}, ${rand(1, 5)})`;
        else if (quadIdx === 1) pText = `A(-${rand(1, 5)}, ${rand(1, 5)})`;
        else if (quadIdx === 2) pText = `A(-${rand(1, 5)}, -${rand(1, 5)})`;
        else pText = `A(${rand(1, 5)}, -${rand(1, 5)})`;
        
        const sh = shuffle(quadrants, quadIdx);
        mcqs.push({
          question: `في أي ربع من أرباع المستوى الإحداثي تقع النقطة الإحداثية التالية: $${pText}$؟`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية:\n1. الربع الأول: سيني موجب وصادي موجب $(+, +)$\n2. الربع الثاني: سيني سالب وصادي موجب $(-, +)$\n3. الربع الثالث: سيني سالب وصادي سالب $(-, -)$\n4. الربع الرابع: سيني موجب وصادي سالب $(+, -)$\nبالمقارنة مع النقطة المعطاة، نجد أنها تقع في ${quadrants[quadIdx]}.`
        });
      }
    }

    // FIB (10)
    for (let i = 0; i < 10; i++) {
      const a = rand(2, 6);
      const b = rand(2, 6);
      const ans = a * b;
      fibs.push({
        question: `أكمل الجملة الرياضية التالية بما يناسب: "ناتج ضرب العددين الصحيحين السالبيين $(-${a}) \\times (-${b})$" هو _______`,
        options: [ans.toString(), `-${ans}`, (a + b).toString(), '0'],
        answerIndex: 0,
        explanation: `خطوات الحل المنهجية:\n1. ضرب سالب في سالب يعطي موجب.\n2. نضرب القيم المطلقة: $${a} \\times ${b} = ${ans}$.\nإذن، الفراغ يجب ملؤه بالعدد $${ans}$.`
      });
    }

    // TF (10)
    for (let i = 0; i < 10; i++) {
      const val = rand(4, 9);
      const isTrue = i % 2 === 0;
      const qText = isTrue 
        ? `تعتبر العبارة التالية صحيحة: "القيمة المطلقة للعدد $|-${val}|$ هي $${val}$"`
        : `تعتبر العبارة التالية صحيحة: "القيمة المطلقة للعدد $|-${val}|$ هي $-${val}$"`;
      tfs.push({
        question: qText,
        options: ['صح', 'خطأ'],
        answerIndex: isTrue ? 0 : 1,
        explanation: `خطوات الحل المنهجية:\n1. القيمة المطلقة تعطي دائماً قيمة غير سالبة وتساوي بعد العدد عن الصفر.\n2. إذن $|-${val}| = ${val}$.\nالعبارة المعروضة بالتالي تعتبر ${isTrue ? 'صحيحة (صح)' : 'خاطئة (خطأ)'}.`
      });
    }

    // HOQ (3)
    for (let i = 0; i < 3; i++) {
      const a = rand(4, 8);
      const b = rand(2, 5);
      const c = rand(1, 3);
      const ans = - (a * b) + c;
      hoqs.push({
        question: `[تفكير ناقد] أوجد الناتج النهائي للعملية الرياضية العميقة التالية: $(-${a}) \\times ${b} + ${c}$`,
        options: [ans.toString(), (-(a * b) - c).toString(), (a * b + c).toString(), (a * b - c).toString()],
        answerIndex: 0,
        explanation: `خطوات الحل التفصيلية العميقة:\n1. نجري عملية الضرب أولاً كأولوية قصوى: $(-${a}) \\times ${b} = -${a * b}$\n2. نجمع الناتج مع الثابت الموجب: $-${a * b} + ${c}$\n3. بما أن الإشارات مختلفة، نطرح الصغير من الكبير ونضع إشارة الأكبر: $${a * b} - ${c} = ${Math.abs(ans)}$ مع إشارة سالبة: $${ans}$\nإذن، القيمة الإجمالية هي $${ans}$.`
      });
    }
  }
  else if (num === 3) {
    title = 'الرياضيات - الفصل الثالث: الجبر: المعادلات الخطية والدوال';
    summary = {
      title: 'ملخص الفصل الثالث: المعادلات والمتباينات الخطية والدوال',
      body: 'يركز هذا الفصل على كيفية حل المعادلات الخطية ذات الخطوة الواحدة والخطوتين باستخدام العمليات العكسية، وكتابة العبارات الجبرية، والتمثيل البياني للدوال.',
      points: [
        'المعادلة هي جملة رياضية تحتوي على إشارة المساواة (=) وتدل على تساوي طرفين.',
        'نحل المعادلة باستخدام العمليات العكسية للتخلص من الأعداد المحيطة بالمتغير.',
        'عكس عملية الجمع هو الطرح، وعكس عملية الطرح هو الجمع.',
        'عكس عملية الضرب هو القسمة، وعكس عملية القسمة هو الضرب.',
        'المعادلة ذات الخطوتين تتطلب التخلص من الجمع/الطرح أولاً، ثم الضرب/القسمة ثانياً.'
      ]
    };

    // MCQ (15)
    for (let i = 0; i < 15; i++) {
      const qType = i % 4;
      if (qType === 0) {
        const a = rand(3, 10);
        const ans = rand(5, 15);
        const b = ans + a;
        const sh = shuffle([`x = ${ans}`, `x = ${ans + 2}`, `x = ${b + a}`, `x = ${ans - 2}`], 0);
        mcqs.push({
          question: `أوجد حل المعادلة الجبرية التالية ذات الخطوة الواحدة: $x + ${a} = ${b}$`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية:\n1. للتخلص من العدد المضاف ($+${a}$)، نستخدم العملية العكسية للجمع وهي الطرح.\n2. نطرح $${a}$ من طرفي المعادلة:\n   $x + ${a} - ${a} = ${b} - ${a}$\n   $x = ${ans}$\nإذن، الحل الصحيح هو $x = ${ans}$.`
        });
      } else if (qType === 1) {
        const a = rand(2, 8);
        const ans = rand(3, 12);
        const b = ans - a;
        const sh = shuffle([`x = ${ans}`, `x = ${b - a}`, `x = ${ans + a}`, `x = ${ans - a}`], 0);
        mcqs.push({
          question: `أوجد حل المعادلة الخطية التالية: $x - ${a} = ${b}$`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية:\n1. للتخلص من العدد المطروح ($-${a}$)، نستخدم العملية العكسية للطرح وهي الجمع.\n2. نضيف $${a}$ إلى طرفي المعادلة:\n   $x - ${a} + ${a} = ${b} + ${a}$\n   $x = ${ans}$\nإذن، الحل النهائي هو $x = ${ans}$.`
        });
      } else if (qType === 2) {
        const coeff = rand(2, 6);
        const ans = rand(3, 9);
        const b = coeff * ans;
        const sh = shuffle([`x = ${ans}`, `x = ${b + coeff}`, `x = ${b - coeff}`, `x = ${ans + 1}`], 0);
        mcqs.push({
          question: `أوجد حل المعادلة الجبرية التالية التي تحتوي على معامل ضرب: $${coeff}x = ${b}$`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية:\n1. للتخلص من المعامل المضروب ($${coeff}$)، نستخدم العملية العكسية للضرب وهي القسمة.\n2. نقسم طرفي المعادلة على $${coeff}$:\n   $${coeff}x \\div ${coeff} = ${b} \\div ${coeff}$\n   $x = ${ans}$\nإذن، الحل هو $x = ${ans}$.`
        });
      } else {
        const coeff = rand(2, 4);
        const constant = rand(1, 5);
        const ans = rand(2, 6);
        const b = coeff * ans + constant;
        const sh = shuffle([`x = ${ans}`, `x = ${ans + 2}`, `x = ${b - constant}`, `x = ${ans - 1}`], 0);
        mcqs.push({
          question: `أوجد حل المعادلة التالية ذات الخطوتين: $${coeff}x + ${constant} = ${b}$`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية:\n1. نتخلص من الثابت المضاف ($+${constant}$) بطرحه من الطرفين:\n   $${coeff}x + ${constant} - ${constant} = ${b} - ${constant}$\n   $${coeff}x = ${b - constant}$\n2. نقسم الطرفين على معامل المجهول ($${coeff}$):\n   $x = ${b - constant} \\div ${coeff} = ${ans}$\nإذن، قيمة المتغير الصحيحة هي $x = ${ans}$.`
        });
      }
    }

    // FIB (10)
    for (let i = 0; i < 10; i++) {
      const a = rand(2, 5);
      const ans = rand(3, 8);
      const b = ans * a;
      fibs.push({
        question: `أكمل الجملة الرياضية بما يناسب: "حل المعادلة الجبرية التالية: $x \\div ${a} = ${ans}$" هو $x =$ _______`,
        options: [b.toString(), (ans + a).toString(), (ans - a).toString(), '1'],
        answerIndex: 0,
        explanation: `خطوات الحل المنهجية:\n1. للتخلص من المقسوم عليه ($${a}$)، نضرب الطرفين في $${a}$:\n   $x = ${ans} \\times ${a} = ${b}$.\nإذن، الفراغ يملأ بالعدد $${b}$.`
      });
    }

    // TF (10)
    for (let i = 0; i < 10; i++) {
      const a = rand(2, 6);
      const ans = rand(2, 8);
      const b = a + ans;
      const isTrue = i % 2 === 0;
      const qText = isTrue 
        ? `تعتبر العبارة التالية صحيحة: "العدد $x = ${ans}$ هو الحل الصحيح والمعتمد للمعادلة $x + ${a} = ${b}$"`
        : `تعتبر العبارة التالية صحيحة: "العدد $x = ${ans + rand(1, 3)}$ هو الحل الصحيح والمعتمد للمعادلة $x + ${a} = ${b}$"`;
      tfs.push({
        question: qText,
        options: ['صح', 'خطأ'],
        answerIndex: isTrue ? 0 : 1,
        explanation: `خطوات الحل المنهجية:\n1. نعوض بالحل المقترح في الطرف الأيمن ونرى هل يساوي الطرف الأيسر.\n2. بالحل الصحيح: $${ans} + ${a} = ${b}$ وهو صحيح.\nإذن، العبارة تعتبر ${isTrue ? 'صح' : 'خطأ'}.`
      });
    }

    // HOQ (3)
    for (let i = 0; i < 3; i++) {
      const coeff = rand(3, 5);
      const constant = rand(2, 6);
      const ans = rand(2, 5);
      const b = coeff * ans - constant;
      hoqs.push({
        question: `[تفكير ناقد] حل المعادلة الجبرية المركبة التالية وتأكد من خطوات التحليل: $${coeff}x - ${constant} = ${b}$`,
        options: [`x = ${ans}`, `x = ${ans + 1}`, `x = ${b + constant}`, `x = ${ans - 1}`],
        answerIndex: 0,
        explanation: `خطوات الحل التفصيلية العميقة:\n1. للتخلص من المطروح ($-${constant}$)، نضيف $${constant}$ للطرفين:\n   $${coeff}x = ${b} + ${constant} = ${b + constant}$\n2. نقسم الطرفين على المعامل $${coeff}$:\n   $x = ${b + constant} \\div ${coeff} = ${ans}$\nإذن، القيمة الإجمالية الصحيحة هي $x = ${ans}$.`
      });
    }
  }
  else if (num === 4) {
    title = 'الرياضيات - الفصل الرابع: النسبة والتناسب';
    summary = {
      title: 'ملخص الفصل الرابع: النسبة والتناسب ومعدلات الوحدة',
      body: 'يغطي هذا الفصل مفاهيم النسبة والنسب المئوية والكسور المتكافئة، ومعدلات الوحدة وحل التناسبات المنهجية باستخدام الضرب التبادلي ومقياس الرسم.',
      points: [
        'النسبة هي مقارنة بين كميتين باستخدام القسمة وتكتب عادة على شكل كسر.',
        'المعدل هو نسبة تقارن بين كميتين بوحدتين مختلفتين.',
        'معدل الوحدة هو معدل مقامه يساوي ١ بعد تبسيطه.',
        'التناسب هو حالة تساوي نسبتين أو كسرين.',
        'نحل التناسب باستخدام الضرب التبادلي.'
      ]
    };

    // MCQ (15)
    for (let i = 0; i < 15; i++) {
      const qType = i % 4;
      if (qType === 0) {
        const mult = rand(2, 5);
        const ratioA = 2 * mult;
        const ratioB = 3 * mult;
        const sh = shuffle(['2/3', '3/2', '4/5', '1/2'], 0);
        mcqs.push({
          question: `اكتب النسبة التالية في أبسط صورة رياضية ممكنة: ${ratioA} إلى ${ratioB}`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية لدرس (النسبة والمعدل):\n1. نكتب النسبة على هيئة كسر اعتيادي: $\\frac{${ratioA}}{${ratioB}}$\n2. نحدد القاسم المشترك الأكبر للعددين وهو ${mult}.\n3. نقسم البسط والمقام على القاسم المشترك:\n   $\\frac{${ratioA} \\div ${mult}}{${ratioB} \\div ${mult}} = \\frac{2}{3}$\nإذن، النسبة في أبسط صورة هي $\\frac{2}{3}$.`
        });
      } else if (qType === 1) {
        const dist = rand(150, 450);
        const time = rand(3, 5);
        const ans = Math.round(dist / time);
        const sh = shuffle([`${ans} كم/ساعة`, `${ans + 10} كم/ساعة`, `${ans - 15} كم/ساعة`, `${dist} كم/ساعة`], 0);
        mcqs.push({
          question: `احسب معدل الوحدة لسيارة تقطع مسافة ${dist} كيلومتر في ${time} ساعات`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية لدرس (معدل الوحدة):\n1. نكتب النسبة بين المسافة المقطوعة والزمن: $\\frac{${dist}}{${time}}$\n2. نقسم البسط على المقام للحصول على معدل مقامه 1:\n   $${dist} \\div ${time} = ${ans}$\nإذن، معدل الوحدة للسيارة هو ${ans} كيلومتر/ساعة.`
        });
      } else if (qType === 2) {
        const a = rand(2, 4);
        const b = rand(6, 10);
        const c = 2 * b;
        const ans = a * 2;
        const sh = shuffle([`x = ${ans}`, `x = ${ans + 2}`, `x = ${ans - 1}`, `x = 5`], 0);
        mcqs.push({
          question: `أوجد قيمة $x$ المجهولة التي تحقق التناسب التالي: $\\frac{x}{${c}} = \\frac{${a}}{${b}}$`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية لدرس (حل التناسب):\n1. نستخدم طريقة الضرب التبادلي (المقص):\n   $x \\times ${b} = ${a} \\times ${c}$\n2. نجري الضرب في الطرف الأيسر: $${a} \\times ${c} = ${a * c}$\n3. نقسم على معامل $x$ وهو ${b}:\n   $x = \\frac{${a * c}}{${b}} = ${ans}$\nإذن، قيمة $x$ المجهولة هي ${ans}.`
        });
      } else {
        const scale = rand(10, 30);
        const mapDist = rand(2, 8);
        const ans = scale * mapDist;
        const sh = shuffle([`${ans} كم`, `${ans + scale} كم`, `${ans - scale} كم`, `${mapDist} كم`], 0);
        mcqs.push({
          question: `إذا كان مقياس رسم خريطة هو $1$ سم : ${scale} كم، وكانت المسافة على الخريطة بين مدينتين هي ${mapDist} سم، فما المسافة الفعلية بينهما؟`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية لدرس (مقياس الرسم):\n1. نكتب التناسب المنهجي بين مقياس الرسم والنسبة الفعلية:\n   $\\frac{1}{${scale}} = \\frac{${mapDist}}{المسافة الفعلية}$\n2. نستخدم الضرب التبادلي:\n   $المسافة الفعلية = ${scale} \\times ${mapDist} = ${ans}$ كم\nإذن، المسافة الفعلية بين المدينتين هي ${ans} كم.`
        });
      }
    }

    // FIB (10)
    for (let i = 0; i < 10; i++) {
      const qVal = rand(2, 4);
      const ans = qVal * 3;
      fibs.push({
        question: `أكمل الجملة الرياضية التالية بما يناسب: "في التناسب $\\frac{2}{3} = \\frac{${qVal * 2}}{x}$، قيمة $x$ تساوي" _______`,
        options: [ans.toString(), (ans + 2).toString(), (ans - 2).toString(), '0'],
        answerIndex: 0,
        explanation: `خطوات الحل لدرس (حل التناسب):\nمن التناسب $\\frac{2}{3} = \\frac{${qVal * 2}}{x}$، نلاحظ أن البسط تضاعف بمقدار ${qVal} مرات ($2 \\times ${qVal} = ${qVal * 2}$)، إذن يجب ضرب المقام في نفس القيمة: $3 \\times ${qVal} = ${ans}$.`
      });
    }

    // TF (10)
    for (let i = 0; i < 10; i++) {
      const isTrue = i % 2 === 0;
      tfs.push({
        question: isTrue
          ? `تعتبر العبارة التالية صحيحة: "النسبتان $\\frac{2}{5}$ و $\\frac{6}{15}$ تشكلان تناسباً صحيحاً ومتكافئاً"`
          : `تعتبر العبارة التالية صحيحة: "النسبتان $\\frac{2}{5}$ و $\\frac{6}{12}$ تشكلان تناسباً صحيحاً ومتكافئاً"`,
        options: ['صح', 'خطأ'],
        answerIndex: isTrue ? 0 : 1,
        explanation: `خطوات التحقق لدرس (النسبة والتناسب):\nنختبر التكافؤ بالضرب التبادلي:\n- في الحالة الأولى: $2 \\times 15 = 30$ و $5 \\times 6 = 30$. المجموعان متساويان إذن العبارة صحيحة.\n- في الحالة الثانية: $2 \\times 12 = 24$ و $5 \\times 6 = 30$. غير متساويين إذن العبارة خاطئة.`
      });
    }

    // HOQ (3)
    for (let i = 0; i < 3; i++) {
      const a = rand(3, 5);
      const rateA = 60 * a;
      const rateB = 80 * a;
      const sh = shuffle([`${rateB} ريال`, `${rateA} ريال`, `${rateB + 10} ريال`, `${rateB - 10} ريال`], 0);
      hoqs.push({
        question: `[تفكير ناقد] يتقاضى عامل ${rateA} ريالاً لقاء العمل لمدة ${a} ساعات. كم ريالاً يتقاضى إذا عمل لمدة ${a + 1} ساعة بنفس المعدل؟`,
        options: sh.opts,
        answerIndex: sh.ansIdx,
        explanation: `خطوات التحليل الرياضي:\n1. نحسب معدل أجر الساعة الواحدة أولاً (معدل الوحدة):\n   $معدل الوحدة = \\frac{${rateA}}{${a}} = 60$ ريال/ساعة\n2. نحسب الأجر الكلي لمدة ${a + 1} ساعات:\n   $الأجر الكلي = 60 \\times ${a + 1} = ${rateB}$ ريال\nإذن، الأجر الصحيح هو ${rateB} ريال.`
      });
    }
  }
  else if (num === 5) {
    title = 'الرياضيات - الفصل الخامس: التطبيقات على النسبة المئوية';
    summary = {
      title: 'ملخص الفصل الخامس: النسبة المئوية وحساب الفائدة والخصومات والزكاة',
      body: 'يشرح هذا الفصل كيفية حساب النسب المئوية، حل المعادلات المئوية (الجزء والكل والنسبة)، حساب الربح والخصم، الزكاة الشرعية (٢.٥٪) وعلاقتها بالرياضيات المعاصرة.',
      points: [
        'النسبة المئوية هي كسر مقامه يساوي دائماً ١٠٠ وتكتب بالرمز ٪.',
        'المعادلة المئوية صيغتها: الجزء = النسبة المئوية × الكل.',
        'الخصم هو مقدار يطرح من السعر الأصلي، بينما الربح والزيادة تضاف إليه.',
        'الزكاة الشرعية الواجبة في المال تبلغ ٢.٥٪ (أو ربع العشر ١/٤٠) من المال الذي حال عليه الحول.'
      ]
    };

    // MCQ (15)
    for (let i = 0; i < 15; i++) {
      const qType = i % 4;
      if (qType === 0) {
        const base = rand(10, 30) * 10;
        const pct = 10 * rand(1, 4);
        const ans = (base * pct) / 100;
        const sh = shuffle([`${ans}`, `${ans + 5}`, `${ans - 5}`, `${base}`], 0);
        mcqs.push({
          question: `احسب قيمة $${pct}\\%$ من العدد $${base}$`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية لدرس (المعادلة المئوية):\n1. نكتب صيغة المعادلة المئوية: $الجزء = النسبة \\times الكل$\n2. نعوض بالقيم المعطاة: $الجزء = \\frac{${pct}}{100} \\times ${base}$\n3. نحسب ناتج الضرب: $\\frac{${pct} \\times ${base}}{100} = ${ans}$\nإذن، الناتج الصحيح هو ${ans}.`
        });
      } else if (qType === 1) {
        const money = rand(10, 50) * 4000;
        const zakat = money * 0.025;
        const sh = shuffle([`${zakat} ريال`, `${money * 0.1} ريال`, `${zakat - 100} ريال`, `${zakat + 100} ريال`], 0);
        mcqs.push({
          question: `إذا بلغ مال رجل حال عليه الحول مبلغ $${money}$ ريالاً، فما هو مقدار الزكاة الشرعية الواجبة عليه (علماً بأن نسبة الزكاة هي 2.5% أو ربع العشر)؟`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية لدرس (تطبيقات الزكاة):\n1. نسبة الزكاة الشرعية ثابتة وتساوي 2.5% (أو نقسم على 40 مباشرة).\n2. نقوم بحساب مقدار الزكاة:\n   $الزكاة = ${money} \\times 0.025 = \\frac{${money}}{40} = ${zakat}$ ريال\nإذن، مقدار الزكاة الواجب إخراجها هو ${zakat} ريال.`
        });
      } else if (qType === 2) {
        const price = rand(4, 12) * 50;
        const discountPct = 20;
        const discountVal = (price * discountPct) / 100;
        const ans = price - discountVal;
        const sh = shuffle([`${ans} ريال`, `${price} ريال`, `${ans + 10} ريال`, `${price - 10} ريال`], 0);
        mcqs.push({
          question: `حقيبة سعرها الأصلي $${price}$ ريالاً، وعليها خصم بنسبة $${discountPct}\\%$. احسب سعر الحقيبة الجديد بعد تطبيق الخصم؟`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية لدرس (الربح والخصم):\n1. نحسب قيمة الخصم أولاً:\n   $قيمة الخصم = سعر السلعة \\times النسبة = ${price} \\times 0.20 = ${discountVal}$ ريال\n2. نطرح قيمة الخصم من السعر الأصلي:\n   $السعر الجديد = ${price} - ${discountVal} = ${ans}$ ريال\nإذن، السعر الجديد بعد الخصم هو ${ans} ريال.`
        });
      } else {
        const cost = rand(10, 40) * 10;
        const profitPct = 10;
        const profitVal = (cost * profitPct) / 100;
        const ans = cost + profitVal;
        const sh = shuffle([`${ans} ريال`, `${cost} ريال`, `${ans - 5} ريال`, `${cost - profitVal} ريال`], 0);
        mcqs.push({
          question: `اشترى تاجر سلعة بمبلغ $${cost}$ ريالاً وباعها بربح يبلغ $${profitPct}\\%$. ما هو سعر البيع النهائي للسلعة؟`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية لدرس (الربح والخصم):\n1. نحسب قيمة الربح المضاف:\n   $قيمة الربح = ${cost} \\times \\frac{${profitPct}}{100} = ${profitVal}$ ريال\n2. نضيف قيمة الربح للسعر الأصلي:\n   $سعر البيع = ${cost} + ${profitVal} = ${ans}$ ريال\nإذن، سعر البيع النهائي هو ${ans} ريال.`
        });
      }
    }

    // FIB (10)
    for (let i = 0; i < 10; i++) {
      const money = rand(4, 12) * 10000;
      const zakat = money / 40;
      fibs.push({
        question: `أكمل الجملة الرياضية التالية بما يناسب: "إذا كان إجمالي المدخرات المالية لشخص هو $${money}$ ريال، فإن قيمة الزكاة الواجبة عليها" هي _______ ريال`,
        options: [zakat.toString(), (zakat * 2).toString(), (zakat / 2).toString(), '0'],
        answerIndex: 0,
        explanation: `خطوات الحل لدرس (الزكاة):\nمقدار الزكاة الشرعية يعادل قسمة إجمالي المال على 40 (أو ضربه في 2.5%): $${money} \\div 40 = ${zakat}$ ريال.`
      });
    }

    // TF (10)
    for (let i = 0; i < 10; i++) {
      const isTrue = i % 2 === 0;
      tfs.push({
        question: isTrue
          ? `تعتبر العبارة التالية صحيحة: "قيمة الزكاة الشرعية الواجبة على مال قدره 80,000 ريال هي 2,000 ريال"`
          : `تعتبر العبارة التالية صحيحة: "قيمة الزكاة الشرعية الواجبة على مال قدره 80,000 ريال هي 8,000 ريال"`,
        options: ['صح', 'خطأ'],
        answerIndex: isTrue ? 0 : 1,
        explanation: `خطوات التحقق لدرس (الزكاة):\nنحسب الزكاة لـ 80,000 ريال: $\\frac{80000}{40} = 2000$ ريال. إذن العبارة الأولى صحيحة والثانية خاطئة.`
      });
    }

    // HOQ (3)
    for (let i = 0; i < 3; i++) {
      const originalPrice = rand(3, 6) * 500;
      const discountVal = originalPrice * 0.20;
      const salePrice = originalPrice - discountVal;
      const sh = shuffle([`${originalPrice} ريال`, `${salePrice} ريال`, `${originalPrice + 100} ريال`, `${salePrice - 100} ريال`], 0);
      hoqs.push({
        question: `[تفكير ناقد] اشترى طالب جهاز حاسوب محمول بقيمة $${salePrice}$ ريالاً بعد أن حصل على خصم خاص بنسبة 20\\% من سعره الأصلي. فما هو السعر الأصلي للجهاز قبل الخصم؟`,
        options: sh.opts,
        answerIndex: sh.ansIdx,
        explanation: `خطوات التحليل الرياضي:\n1. نسبة سعر البيع تعادل $100\\% - 20\\% = 80\\%$ من السعر الأصلي.\n2. نكتب المعادلة: $0.80 \\times السعر الأصلي = ${salePrice}$\n3. نحسب السعر الأصلي بالقسمة:\n   $السعر الأصلي = \\frac{${salePrice}}{0.80} = ${originalPrice}$ ريال\nإذن، السعر الأصلي للجهاز هو $${originalPrice}$ ريال.`
      });
    }
  }
  else if (num === 6) {
    title = 'الرياضيات - الفصل السادس: الإحصاء';
    summary = {
      title: 'ملخص الفصل السادس: الإحصاء ومقاييس النزعة المركزية والتمثيل بالقطاعات',
      body: 'يغطي هذا الفصل مفاهيم مقاييس النزعة المركزية (المتوسط الحسابي، الوسيط، المنوال) ومقاييس التشتت (المدى)، والتمثيل بالقطاعات الدائرية وحساب زاوية القطاع الدائري.',
      points: [
        'المتوسط الحسابي هو مجموع قيم البيانات مقسوماً على عددها.',
        'الوسيط هو القيمة التي تتوسط البيانات بعد ترتيبها تصاعدياً.',
        'المنوال هو القيمة الأكثر تكراراً وشيوعاً بين قيم البيانات.',
        'المدى هو الفرق الحسابي بين أكبر قيمة وأصغر قيمة.',
        'القطاعات الدائرية تقسم الدائرة إلى أجزاء تمثل نسب مئوية، ومجموع درجات الدائرة كاملة ٣٦٠ درجة.'
      ]
    };

    // MCQ (15)
    for (let i = 0; i < 15; i++) {
      const qType = i % 4;
      if (qType === 0) {
        const val1 = rand(2, 6);
        const val2 = rand(4, 8);
        const val3 = rand(6, 10);
        const val4 = rand(8, 12);
        const sum = val1 + val2 + val3 + val4;
        const mean = sum / 4;
        const sh = shuffle([`${mean}`, `${mean + 2}`, `${mean - 1}`, `${sum}`], 0);
        mcqs.push({
          question: `احسب المتوسط الحسابي للبيانات التالية: $${val1}, ${val2}, ${val3}, ${val4}$`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية لدرس (المتوسط الحسابي):\n1. قانون المتوسط الحسابي = $\\frac{مجموع القيم}{عددها}$\n2. نجمع القيم المعطاة: $${val1} + ${val2} + ${val3} + ${val4} = ${sum}$\n3. نقسم المجموع على عدد القيم (4 قيم):\n   $المتوسط = \\frac{${sum}}{4} = ${mean}$\nإذن، المتوسط الحسابي الصحيح هو ${mean}.`
        });
      } else if (qType === 1) {
        const base = [10, 12, 15, 18, 20];
        const add = rand(1, 5);
        const data = base.map(v => v + add);
        const median = data[2];
        const sh = shuffle([`${median}`, `${data[0]}`, `${data[4]}`, `${data[1]}`], 0);
        mcqs.push({
          question: `أوجد الوسيط لمجموعة البيانات المرتبة التالية: $${data.join(', ')}$`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية لدرس (الوسيط والمنوال والمدى):\n1. البيانات مرتبة تصاعدياً بالفعل: $${data.join(', ')}$\n2. بما أن عدد قيم البيانات فردي (5 قيم)، فإن الوسيط هو القيمة التي تقع في المنتصف تماماً (القيمة الثالثة).\n3. القيمة الوسطى هي ${median}.\nإذن، الوسيط هو ${median}.`
        });
      } else if (qType === 2) {
        const min = rand(5, 10);
        const max = min + rand(10, 20);
        const range = max - min;
        const data = [min, min + 3, min + 5, max];
        const sh = shuffle([`${range}`, `${max}`, `${min}`, `${min + max}`], 0);
        mcqs.push({
          question: `أوجد المدى لمجموعة البيانات التالية: $${data.join(', ')}$`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية لدرس (الوسيط والمنوال والمدى):\n1. قانون المدى = $أكبر قيمة - أصغر قيمة$\n2. نحدد أكبر قيمة في البيانات وهي ${max}، وأصغر قيمة وهي ${min}.\n3. نطرح الأصغر من الأكبر: $${max} - ${min} = ${range}$\nإذن، المدى لهذه البيانات هو ${range}.`
        });
      } else {
        const pct = 10 * rand(1, 4);
        const angle = (pct / 100) * 360;
        const sh = shuffle([`${angle} درجة`, `${angle + 30} درجة`, `${angle - 10} درجة`, '90 درجة'], 0);
        mcqs.push({
          question: `إذا مثلنا البيانات بالقطاعات الدائرية، وكانت نسبة الطلاب المفضلين لمادة العلوم هي $${pct}\\%$. فما قياس زاوية قطاع العلوم بالدرجات في الدائرة؟`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية لدرس (القطاعات الدائرية):\n1. نعلم أن قياس الدائرة الكاملة يساوي 360 درجة.\n2. نحسب زاوية القطاع بضرب النسبة المئوية في 360:\n   $زاوية القطاع = \\frac{${pct}}{100} \\times 360 = ${angle}$ درجة\nإذن، قياس زاوية القطاع هو ${angle} درجة.`
        });
      }
    }

    // FIB (10)
    for (let i = 0; i < 10; i++) {
      const val = rand(2, 6);
      fibs.push({
        question: `أكمل الجملة الإحصائية بما يناسب: "في مجموعة البيانات {${val}, ${val}, ${val + 2}, ${val + 4}}، القيمة الأكثر تكراراً (المنوال) تساوي" _______`,
        options: [val.toString(), (val + 2).toString(), (val + 4).toString(), 'لا يوجد منوال'],
        answerIndex: 0,
        explanation: `خطوات الحل لدرس (المنوال):\nالمنوال هو القيمة الأكثر تكراراً في البيانات، وبما أن العدد $${val}$ تكرر مرتين بينما الباقي تكرر مرة واحدة، فالمنوال هو ${val}.`
      });
    }

    // TF (10)
    for (let i = 0; i < 10; i++) {
      const isTrue = i % 2 === 0;
      tfs.push({
        question: isTrue
          ? `تعتبر العبارة التالية صحيحة: "المتوسط الحسابي للقيم {2, 4, 6} يساوي 4"`
          : `تعتبر العبارة التالية صحيحة: "المتوسط الحسابي للقيم {2, 4, 6} يساوي 6"`,
        options: ['صح', 'خطأ'],
        answerIndex: isTrue ? 0 : 1,
        explanation: `خطوات التحقق لدرس (المتوسط الحسابي):\nالمتوسط = $\\frac{2 + 4 + 6}{3} = \\frac{12}{3} = 4$. إذن العبارة الأولى صحيحة والثانية خاطئة.`
      });
    }

    // HOQ (3)
    for (let i = 0; i < 3; i++) {
      const scoreSum = 4 * 80;
      const newScore = 95;
      const newMean = (scoreSum + newScore) / 5;
      const sh = shuffle([`${newMean} درجة`, `${newMean - 3} درجة`, '80 درجة', '95 درجة'], 0);
      hoqs.push({
        question: `[تفكير ناقد] كان المتوسط الحسابي لدرجات 4 طلاب في اختبار الرياضيات هو 80 درجة. فإذا انضم إليهم طالب خامس حصل على 95 درجة، فما المتوسط الحسابي الجديد للطلاب الخمسة معاً؟`,
        options: sh.opts,
        answerIndex: sh.ansIdx,
        explanation: `خطوات التحليل الرياضي العميق:\n1. نحسب مجموع درجات الطلاب الأربعة الأصليين: $4 \\times 80 = 320$ درجة.\n2. نضيف درجة الطالب الجديد للمجموع: $320 + 95 = 415$ درجة.\n3. نقسم المجموع الجديد على عدد الطلاب الكلي (5 طلاب):\n   $المتوسط الجديد = \\frac{415}{5} = ${newMean}$ درجة\nإذن، المتوسط الحسابي الجديد هو ${newMean} درجة.`
      });
    }
  }
  else if (num === 7) {
    title = 'الرياضيات - الفصل السابع: الاحتمالات';
    summary = {
      title: 'ملخص الفصل السابع: الاحتمالات وفضاء العينة ونظريات العد',
      body: 'يغطي هذا الفصل الاحتمال البسيط للأحداث العشوائية، الاحتمال النظري والتجريبي، فضاء العينة وطرق تمثيله (المخطط الشجري والجدول)، ومبدأ العد الأساسي لعدد الخيارات.',
      points: [
        'الاحتمال هو مقياس لإمكانية حدوث حادثة عشوائية وتتراوح قيمته دائماً بين ٠ و ١.',
        'احتمال الحادثة يعادل قسمة عدد النواتج المواتية على العدد الإجمالي للنواتج الممكنة.',
        'فضاء العينة هو مجموعة جميع النواتج الممكنة لتجربة عشوائية.',
        'ينص مبدأ العد الأساسي على ضرب عدد نواتج الأحداث المستقلة لإيجاد إجمالي عدد النواتج الممكنة.'
      ]
    };

    // MCQ (15)
    for (let i = 0; i < 15; i++) {
      const qType = i % 4;
      if (qType === 0) {
        const sh = shuffle(['1/2', '1/6', '1/3', '2/3'], 0);
        mcqs.push({
          question: 'عند رمي مكعب أرقام منتظم مرقم من 1 إلى 6 مرة واحدة، فما هو احتمال ظهور عدد زوجي؟',
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية لدرس (الاحتمال البسيط):\n1. فضاء العينة الإجمالي يحتوي على 6 أعداد: $\\{1, 2, 3, 4, 5, 6\\}$ (العدد الإجمالي = 6).\n2. الأعداد الزوجية الممكنة هي: $\\{2, 4, 6\\}$ (عدد النواتج المواتية = 3).\n3. نحسب الاحتمال بقسمة المواتي على الإجمالي:\n   $الاحتمال = \\frac{3}{6} = \\frac{1}{2}$\nإذن، الاحتمال الصحيح في أبسط صورة هو $\\frac{1}{2}$.`
        });
      } else if (qType === 1) {
        const c1 = rand(2, 4);
        const c2 = rand(2, 4);
        const c3 = rand(2, 3);
        const ans = c1 * c2 * c3;
        const sh = shuffle([`${ans} طريقة`, `${c1 + c2 + c3} طرق`, `${ans + 4} طريقة`, '10 طرق'], 0);
        mcqs.push({
          question: `إذا كان لدى محمد $${c1}$ قمصان مختلفة، و $${c2}$ بناطيل مختلفة، و $${c3}$ أزواج من الأحذية، فبكم طريقة مختلفة يمكنه اختيار زي كامل مكون من قميص وبنطال وحذاء وفقاً لمبدأ العد الأساسي؟`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية لدرس (مبدأ العد الأساسي):\n1. ينص مبدأ العد الأساسي على أن عدد خيارات فضاء العينة المركب يساوي حاصل ضرب خيارات كل حدث على حدة.\n2. نجري عملية الضرب للخيارات المتوفرة:\n   $إجمالي الطرق = ${c1} \\times ${c2} \\times ${c3} = ${c1 * c2} \\times ${c3} = ${ans}$ طريقة\nإذن، إجمالي عدد الطرق المختلفة هو ${ans} طريقة.`
        });
      } else if (qType === 2) {
        const red = rand(2, 5);
        const blue = rand(4, 7);
        const total = red + blue;
        const sh = shuffle([`\\\\frac{${blue}}{${total}}`, `\\\\frac{${red}}{${total}}`, `\\\\frac{1}{${total}}`, `\\\\frac{${blue - 1}}{${total}}`], 0);
        mcqs.push({
          question: `حقيبة تحتوي على $${red}$ كرات حمراء و $${blue}$ كرات زرقاء متطابقة. إذا سحبنا كرة عشوائياً، فما احتمال أن تكون الكرة المسحوبة زرقاء؟`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية لدرس (الاحتمال النظري والتجريبي):\n1. نحسب إجمالي عدد الكرات في الحقيبة: $${red} + ${blue} = ${total}$ كرة.\n2. عدد الكرات الزرقاء المواتية للحدث هو $${blue}$.\n3. نقسم عدد النواتج المواتية على الإجمالي:\n   $الاحتمال = \\frac{${blue}}{${total}}$\nإذن، الاحتمال المعتمد هو $\\frac{${blue}}{${total}}$.`
        });
      } else {
        const pct = 10 * rand(5, 9);
        const ans = 100 - pct;
        const sh = shuffle([`${ans}\\%`, `${pct}\\%`, `${ans + 10}\\%`, '0%'], 0);
        mcqs.push({
          question: `إذا كان احتمال هطول الأمطار غداً في مدينة الرياض هو $${pct}\\%$. فما هو احتمال عدم هطول الأمطار (الحادثة المتممة)؟`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية لدرس (الاحتمال والعد والحوادث المتممة):\n1. نعلم أن مجموع احتمال حدوث حادثة وعدم حدوثها (المتممة) يساوي دائماً 100% (أو 1 صحيح).\n2. نطرح احتمال الحدوث من 100%:\n   $احتمال المتممة = 100\\% - ${pct}\\% = ${ans}\\%$\nإذن، احتمال عدم هطول الأمطار هو ${ans}%.`
        });
      }
    }

    // FIB (10)
    for (let i = 0; i < 10; i++) {
      fibs.push({
        question: 'أكمل الجملة الرياضية بما يناسب: "الحادثة التي احتمال حدوثها يساوي صفراً تماماً (0) تسمى في فضاء الاحتمالات بالحادثة" _______ ',
        options: ['المستحيلة', 'المؤكدة', 'البسيطة', 'المتممة'],
        answerIndex: 0,
        explanation: `خطوات الحل لدرس (الاحتمال البسيط):\nالحادثة المستحيلة هي الحادثة التي لا يمكن حدوثها نهائياً، واحتمال حدوثها يساوي صفر.`
      });
    }

    // TF (10)
    for (let i = 0; i < 10; i++) {
      const isTrue = i % 2 === 0;
      tfs.push({
        question: 'تعتبر العبارة التالية صحيحة: "مجموع احتمال أي حادثة واحتمال حادثتها المتممة يساوي دائماً 1 صحيح (أو 100%)"',
        options: ['صح', 'خطأ'],
        answerIndex: isTrue ? 0 : 1,
        explanation: `خطوات التحقق لدرس (الحوادث المتممة):\nبما أن الحادثتين تغطيان كامل الاحتمالات، فمجموعهما دائماً هو 1 صحيح (100%). العبارة الأولى صحيحة والثانية خاطئة.`
      });
    }

    // HOQ (3)
    for (let i = 0; i < 3; i++) {
      const red = 3;
      const green = 4;
      const yellow = 5;
      const total = red + green + yellow;
      const notRed = green + yellow;
      const sh = shuffle(['3/4', '1/4', '5/12', '1/2'], 0); // 9/12 = 3/4
      hoqs.push({
        question: 'حقيبة تحتوي على 3 كرات حمراء، و 4 كرات خضراء، و 5 كرات صفراء. إذا سحبنا كرة واحدة عشوائياً، فما احتمال ألا تكون الكرة المسحوبة حمراء؟',
        options: sh.opts,
        answerIndex: sh.ansIdx,
        explanation: `خطوات التحليل الرياضي المتقدم:\n1. نحسب إجمالي عدد الكرات في الحقيبة: $3 + 4 + 5 = 12$ كرات.\n2. نحسب عدد الكرات التي ليست حمراء (خضراء وصفراء): $4 + 5 = 9$ كرات.\n3. نقسم عدد كرات غير الحمراء على إجمالي الكرات:\n   $الاحتمال = \\frac{9}{12}$\n4. نبسط الكسر بقسمة البسط والمقام على 3:\n   $\\frac{9 \\div 3}{12 \\div 3} = \\frac{3}{4}$\nإذن، الاحتمال المعتمد هو $\\frac{3}{4}$.`
      });
    }
  }
  else if (num === 8) {
    title = 'الرياضيات - الفصل الثامن: الهندسة: الزوايا والمضلعات';
    summary = {
      title: 'ملخص الفصل الثامن: الهندسة والعلاقات بين الزوايا وخصائص المضلعات',
      body: 'يغطي هذا الفصل العلاقات الهندسية بين الزوايا (متتامة، متكاملة، متقابلة بالرأس)، تصنيف المثلثات والأشكال الرباعية، حساب مجموع زوايا المضلع، وتشابه المضلعات هندسياً.',
      points: [
        'الزاويتان المتتامتان هما زاويتان مجموع قياسهما يساوي ٩٠ درجة.',
        'الزاويتان المتكاملتان هما زاويتان مجموع قياسهما يساوي ١٨٠ درجة.',
        'مجموع قياسات الزوايا الداخلية لأي مثلث يساوي دائماً ١٨٠ درجة.',
        'مجموع قياسات الزوايا الداخلية لأي شكل رباعي يساوي ٣٦٠ درجة.',
        'يتشابه مضلعان إذا كانت زواياهما المتناظرة متطابقة وأضلاعهما المتناظرة متناسبة.'
      ]
    };

    // MCQ (15)
    for (let i = 0; i < 15; i++) {
      const qType = i % 4;
      if (qType === 0) {
        const a = rand(25, 65);
        const ans = 90 - a;
        const sh = shuffle([`${ans} درجة`, `${180 - a} درجة`, `${a} درجة`, '90 درجة'], 0);
        mcqs.push({
          question: `إذا كانت الزاويتان س و ص متتامتان، وكان قياس زاوية س = $${a}$ درجة، فما هو قياس زاوية ص المتبقية؟`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل الهندسية لدرس (العلاقات بين الزوايا):\n1. القاعدة الهندسية: الزاويتان المتتامتان مجموع قياسهما يساوي دائماً 90 درجة.\n2. لحساب الزاوية المجهولة، نطرح الزاوية المعروفة من 90 درجة:\n   $قياس زاوية ص = 90 - ${a} = ${ans}$ درجة\nإذن، قياس زاوية ص هو ${ans} درجة.`
        });
      } else if (qType === 1) {
        const a = rand(60, 140);
        const ans = 180 - a;
        const sh = shuffle([`${ans} درجة`, `${90 - a} درجة`, `${a} درجة`, '180 درجة'], 0);
        mcqs.push({
          question: `إذا كانت الزاويتان أ و ب متكاملتين، وكان قياس زاوية أ = $${a}$ درجة، فما هو قياس زاوية ب؟`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل الهندسية لدرس (العلاقات بين الزوايا):\n1. القاعدة الهندسية: الزاويتان المتكاملتان مجموع قياسهما يساوي دائماً 180 درجة (على خط مستقيم).\n2. لحساب الزاوية المجهولة، نطرح الزاوية المعروفة من 180 درجة:\n   $قياس زاوية ب = 180 - ${a} = ${ans}$ درجة\nإذن، قياس زاوية ب هو ${ans} درجة.`
        });
      } else if (qType === 2) {
        const a = rand(35, 75);
        const b = rand(35, 75);
        const ans = 180 - (a + b);
        const sh = shuffle([`${ans} درجة`, `${90 - ans} درجة`, `${a + b} درجة`, '180 درجة'], 0);
        mcqs.push({
          question: `في مثلث مستوٍ، إذا كان قياس الزاويتين الأوليين هما $${a}$ درجة و $${b}$ درجة، فما هو قياس الزاوية الثالثة المتبقية؟`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل الهندسية لدرس (المثلثات):\n1. تنص النظرية الأساسية على أن مجموع قياسات الزوايا الداخلية لأي مثلث يساوي دائماً 180 درجة.\n2. نجمع قياس الزاويتين المعروفتين: $${a} + ${b} = ${a + b}$ درجة.\n3. نطرح المجموع من 180 درجة لإيجاد قياس الزاوية الثالثة:\n   $الزاوية الثالثة = 180 - ${a + b} = ${ans}$ درجة\nإذن، قياس الزاوية الثالثة هو ${ans} درجة.`
        });
      } else {
        const a = rand(80, 100);
        const b = rand(80, 100);
        const c = rand(60, 90);
        const ans = 360 - (a + b + c);
        const sh = shuffle([`${ans} درجة`, `${180 - ans} درجة`, '360 درجة', '90 درجة'], 0);
        mcqs.push({
          question: `في شكل رباعي، إذا كان قياس ثلاث زوايا فيه هي $${a}$ درجة، $${b}$ درجة، $${c}$ درجة، فما قياس الزاوية الرابعة المتبقية؟`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل الهندسية لدرس (الأشكال الرباعية):\n1. مجموع قياسات الزوايا الداخلية لأي شكل رباعي يساوي دائماً 360 درجة.\n2. نجمع الزوايا الثلاث المعروفة: $${a} + ${b} + ${c} = ${a + b + c}$ درجة.\n3. نطرح المجموع من 360 درجة لإيجاد قياس الزاوية الرابعة:\n   $الزاوية الرابعة = 360 - ${a + b + c} = ${ans}$ درجة\nإذن، قياس الزاوية الرابعة هو ${ans} درجة.`
        });
      }
    }

    // FIB (10)
    for (let i = 0; i < 10; i++) {
      fibs.push({
        question: 'أكمل الجملة الهندسية بما يناسب: "مجموع قياسات الزوايا الداخلية لأي مثلث مستوٍ" يساوي دائماً _______ درجة',
        options: ['180', '360', '90', '270'],
        answerIndex: 0,
        explanation: `خطوات الحل لدرس (المثلثات):\nالنظرية الهندسية المعتمدة تنص على أن مجموع زوايا المثلث الداخلية هو 180 درجة دائماً.`
      });
    }

    // TF (10)
    for (let i = 0; i < 10; i++) {
      const isTrue = i % 2 === 0;
      tfs.push({
        question: 'تعتبر العبارة التالية صحيحة: "الزاويتان اللتان قياسهما 60 درجة و 30 درجة هما زاويتان متتامتان"',
        options: ['صح', 'خطأ'],
        answerIndex: isTrue ? 0 : 1,
        explanation: `خطوات التحقق لدرس (الزوايا):\nنجمع الزاويتين: $60 + 30 = 90$ درجة. وبما أن المجموع 90 درجة، فهما متتامتان وليستا متكاملتين.`
      });
    }

    // HOQ (3)
    for (let i = 0; i < 3; i++) {
      hoqs.push({
        question: 'في مضلع سداسي منتظم (يتكون من 6 أضلاع)، احسب قياس الزاوية الداخلية الواحدة فيه بالقانون المعتمد؟',
        options: ['120 درجة', '108 درجات', '90 درجة', '135 درجة'],
        answerIndex: 0,
        explanation: `خطوات التحليل الهندسي العميق لدرس (الزوايا في المضلعات):\n1. قانون مجموع زوايا المضلع الداخلية هو: $(ن - 2) \\times 180$ حيث $ن$ هو عدد أضلاع المضلع.\n2. للسداسي ($ن = 6$): $(6 - 2) \\times 180 = 4 \\times 180 = 720$ درجة.\n3. وبما أن المضلع منتظم، فإن زواياه متطابقة، فنقسم المجموع على عدد الزوايا (6 زوايا):\n   $قياس الزاوية الواحدة = 720 \\div 6 = 120$ درجة\nإذن، قياس الزاوية الداخلية للمضلع هو 120 درجة.`
      });
    }
  }
  else {
    title = 'الرياضيات - الفصل التاسع: القياس: الأشكال ثنائية وثلاثية الأبعاد';
    summary = {
      title: 'ملخص الفصل التاسع: القياس والمساحات والحجوم للأشكال الهندسية ثنائية وثلاثية الأبعاد',
      body: 'يغطي هذا الفصل قوانين المساحة للأشكال ثنائية الأبعاد (المثلث وشبه المنحرف والدائرة ومحيطها)، والمجسمات ثلاثية الأبعاد (المنشور والأسطوانة وحساب حجمها ومساحتها السطحية الكلية).',
      points: [
        'مساحة المثلث تحسب بالقانون: المساحة = ٠.٥ × القاعدة × الارتفاع.',
        'مساحة شبه المنحرف = ٠.٥ × (القاعدة الأولى + القاعدة الثانية) × الارتفاع.',
        'مساحة الدائرة تحسب بالقانون: المساحة = ط × نق² (حيث ط ≈ ٣.١٤).',
        'حجم المنشور المستطيل يعادل ضرب أبعاده الثلاثة: الطول × العرض × الارتفاع.',
        'حجم الأسطوانة يعادل مساحة قاعدتها الدائرية ضرب الارتفاع: ط × نق² × ع.'
      ]
    };

    // MCQ (15)
    for (let i = 0; i < 15; i++) {
      const qType = i % 5;
      if (qType === 0) {
        const b = rand(6, 12);
        const h = rand(4, 8);
        const ans = 0.5 * b * h;
        const sh = shuffle([`${ans} سم مربع`, `${ans * 2} سم مربع`, `${b + h} سم مربع`, `${ans - 2} سم مربع`], 0);
        mcqs.push({
          question: `احسب مساحة مثلث طول قاعدته $${b}$ سم وارتفاعه $${h}$ سم`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية لدرس (مساحة المثلث وشبه المنحرف):\n1. قانون مساحة المثلث المعتمد هو: $مساحة المثلث = 0.5 \\times القاعدة \\times الارتفاع$\n2. نعوض بالقيم المعطاة: $مساحة المثلث = 0.5 \\times ${b} \\times ${h}$\n3. نحسب ناتج الضرب: $0.5 \\times ${b} = ${0.5 * b}$، ثم $0.5 * b \\times ${h} = ${ans}$ سم مربع.\nإذن، المساحة هي ${ans} سم مربع.`
        });
      } else if (qType === 1) {
        const r = rand(3, 8) * 2;
        const ans = Math.round(3.14 * r * 2 * 10) / 10;
        const sh = shuffle([`${ans} سم`, `${Math.round(3.14 * r * r * 10) / 10} سم`, `${r * 2} سم`, `${ans + 10} سم`], 0);
        mcqs.push({
          question: `احسب محيط دائرة طول قطرها $${r}$ سم (علماً بأن ط ≈ 3.14)`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية لدرس (محيط الدائرة ومساحتها):\n1. قانون محيط الدائرة المعتمد هو: $المحيط = ط \\times القطر$\n2. نعوض بالقيم المتاحة: $المحيط = 3.14 \\times ${r}$\n3. نحسب ناتج الضرب: $3.14 \\times ${r} = ${ans}$ سم.\nإذن، محيط الدائرة يساوي ${ans} سم.`
        });
      } else if (qType === 2) {
        const b1 = rand(4, 8);
        const b2 = rand(8, 12);
        const h = rand(4, 6);
        const ans = 0.5 * (b1 + b2) * h;
        const sh = shuffle([`${ans} سم مربع`, `${ans * 2} سم مربع`, `${b1 + b2 + h} سم مربع`, `${ans - 3} سم مربع`], 0);
        mcqs.push({
          question: `احسب مساحة شبه منحرف طول قاعدتيه $${b1}$ سم و $${b2}$ سم، وارتفاعه $${h}$ سم`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية لدرس (مساحة المثلث وشبه المنحرف):\n1. نكتب قانون مساحة شبه المنحرف المعتمد:\n   $المساحة = 0.5 \\times (القاعدة الأولى + القاعدة الثانية) \\times الارتفاع$\n2. نعوض بالقيم المتاحة:\n   $المساحة = 0.5 \\times (${b1} + ${b2}) \\times ${h}$\n3. نحسب ناتج جمع القاعدتين أولاً: $${b1} + ${b2} = ${b1 + b2}$\n4. نضرب في بقية العوامل: $0.5 \\times ${b1 + b2} \\times ${h} = ${ans}$ سم مربع.\nإذن، مساحة شبه المنحرف هي ${ans} سم مربع.`
        });
      } else if (qType === 3) {
        const r = rand(2, 4);
        const h = rand(4, 8);
        const ans = Math.round(3.14 * r * r * h * 10) / 10;
        const sh = shuffle([`${ans} سم مكعب`, `${ans + 10} سم مكعب`, `${ans - 5} سم مكعب`, `${r * h} سم مكعب`], 0);
        mcqs.push({
          question: `احسب حجم أسطوانة دائرية قائمة نصف قطر قاعدتها $${r}$ سم وارتفاعها $${h}$ سم (علماً بأن ط ≈ 3.14)`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية لدرس (حجم المنشور والأسطوانة):\n1. قانون حجم الأسطوانة المعتمد هو: $الحجم = مساحة القاعدة \\times الارتفاع = (ط \\times نق^2) \\times ع$\n2. نعوض بالقيم المعطاة: $الحجم = 3.14 \\times ${r}^2 \\times ${h}$\n3. نحسب مساحة القاعدة أولاً: $3.14 \\times ${r * r} = ${3.14 * r * r}$ سم مربع.\n4. نضرب في الارتفاع ${h}: ${3.14 * r * r} \\times ${h} = ${ans} سم مكعب.\nإذن، حجم الأسطوانة هو ${ans} سم مكعب.`
        });
      } else {
        const l = rand(4, 8);
        const w = rand(3, 5);
        const h = rand(2, 4);
        const ans = l * w * h;
        const sh = shuffle([`${ans} سم مكعب`, `${l + w + h} سم مكعب`, `${ans + 10} سم مكعب`, `${ans - 10} سم مكعب`], 0);
        mcqs.push({
          question: `احسب حجم منشور مستطيل (علبة كرتونية) طولها $${l}$ سم، وعرضها $${w}$ سم، وارتفاعها $${h}$ سم`,
          options: sh.opts,
          answerIndex: sh.ansIdx,
          explanation: `خطوات الحل المنهجية لدرس (حجم المنشور والأسطوانة):\n1. قانون حجم المنشور المستطيل هو: $الحجم = الطول \\times العرض \\times الارتفاع$\n2. نعوض بالقيم المعطاة: $الحجم = ${l} \\times ${w} \\times ${h}$\n3. نحسب ناتج الضرب: $${l} \\times ${w} = ${l * w}$، ثم $${l * w} \\times ${h} = ${ans}$ سم مكعب.\nإذن، حجم المنشور هو ${ans} سم مكعب.`
        });
      }
    }

    // FIB (10)
    for (let i = 0; i < 10; i++) {
      const qVal = rand(5, 10);
      const ans = qVal * 10;
      fibs.push({
        question: `أكمل الجملة الهندسية بما يناسب: "حجم منشور مستطيلي مساحة قاعدته $${ans}$ سم مربع وارتفاعه 2 سم" يساوي _______ سم مكعب`,
        options: [(ans * 2).toString(), ans.toString(), '2', (ans / 2).toString()],
        answerIndex: 0,
        explanation: `خطوات الحل لدرس (حجم المنشور والأسطوانة):\nحجم المنشور = مساحة القاعدة ضرب الارتفاع. وبما أن مساحة القاعدة $${ans}$ والارتفاع 2، إذن الحجم = $${ans} \\times 2 = ${ans * 2}$ سم مكعب.`
      });
    }

    // TF (10)
    for (let i = 0; i < 10; i++) {
      const isTrue = i % 2 === 0;
      tfs.push({
        question: 'تعتبر العبارة التالية صحيحة: "مساحة مثلث طول قاعدته 10 سم وارتفاعه 6 سم هي 30 سم مربع"',
        options: ['صح', 'خطأ'],
        answerIndex: isTrue ? 0 : 1,
        explanation: `خطوات التحقق لدرس (مساحة المثلث):\nمساحة المثلث = $0.5 \\times 10 \\times 6 = 30$ سم مربع. إذن، العبارة تعتبر \${isTrue ? 'صحيحة (صح)' : 'خاطئة (خطأ)'}.`
      });
    }

    // HOQ (3)
    for (let i = 0; i < 3; i++) {
      hoqs.push({
        question: 'احسب المساحة السطحية الكلية لعلبة كرتونية على شكل منشور مستطيل طولها 5 سم، وعرضها 4 سم، وارتفاعها 3 سم؟',
        options: ['94 سم مربع', '47 سم مربع', '60 سم مربع', '120 سم مربع'],
        answerIndex: 0,
        explanation: `خطوات التحليل لدرس (المساحة الجانبية والكلية لسطح المنشور والأسطوانة):\n1. قانون المساحة السطحية للمنشور المستطيل هو: $المساحة الكلية = 2 \\times (الطول \\times العرض + الطول \\times الارتفاع + العرض \\times الارتفاع)$\n2. نعوض بالأبعاد المعطاة (5، 4، 3):\n   $المساحة = 2 \\times (5 \\times 4 + 5 \\times 3 + 4 \\times 3)$\n3. نحسب ما بداخل الأقواس: $20 + 15 + 12 = 47$ سم مربع.\n4. نضرب في 2: $2 \\times 47 = 94$ سم مربع.\nإذن، المساحة السطحية الكلية للمنشور هي 94 سم مربع.`
      });
    }
  }

  return { title, summary, mcqs, fibs, tfs, hoqs };
}

async function main() {
  try {
    console.log('Logging in anonymously to Firestore...');
    const cred = await signInAnonymously(auth);
    console.log('Authenticated successfully! UID:', cred.user.uid);

    console.log('\n=========================================');
    console.log('STARTING SEEDING OF ALL 9 PREMIUM MATH CHAPTERS');
    console.log('=========================================');

    // 1. Get all learning packs under 'math'
    const packsQuery = query(collection(db, 'learning_packs'), where('subjectId', '==', 'math'));
    const querySnapshot = await getDocs(packsQuery);
    
    console.log(`Found ${querySnapshot.size} math learning packs in the database.`);

    for (const packDoc of querySnapshot.docs) {
      const packData = packDoc.data();
      const chNum = packData.order; // Using 'order' to map the chapter number
      
      if (chNum >= 1 && chNum <= 9) {
        console.log(`\n--- Seeding Math Chapter ${chNum} ---`);
        const { title, summary, mcqs, fibs, tfs, hoqs } = generateMathChapterData(chNum);
        
        // 1. Update Learning Pack Title
        console.log('1. Updating Learning Pack Title...');
        await updateDoc(doc(db, 'learning_packs', packDoc.id), {
          title: title,
          updatedAt: serverTimestamp()
        });

        // 2. Clear old summary and write new summary
        console.log('2. Seeding Chapter Summary...');
        const summariesQuery = query(collection(db, 'summaries'), where('packId', '==', packDoc.id));
        const summarySnapshot = await getDocs(summariesQuery);
        for (const sDoc of summarySnapshot.docs) {
          await deleteDoc(doc(db, 'summaries', sDoc.id));
        }
        await addDoc(collection(db, 'summaries'), {
          packId: packDoc.id,
          subjectId: 'math',
          title: summary.title,
          body: summary.body,
          points: summary.points,
          status: 'published',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        console.log('   Summary successfully seeded!');

        // 3. Clear old questions
        console.log('3. Clearing old questions...');
        const questionsQuery = query(collection(db, 'questions'), where('packId', '==', packDoc.id));
        const questionsSnapshot = await getDocs(questionsQuery);
        console.log(`   Deleting ${questionsSnapshot.size} old questions...`);
        for (const qDoc of questionsSnapshot.docs) {
          await deleteDoc(doc(db, 'questions', qDoc.id));
        }

        // 4. Seed all 38 unique premium questions
        console.log('4. Seeding 38 unique premium questions...');
        const allQuestions = [];
        
        // 15 MCQ
        mcqs.forEach((q, idx) => {
          allQuestions.push({
            packId: packDoc.id,
            subjectId: 'math',
            type: 'MCQ',
            question: `[سؤال اختبار] ${q.question} (سؤال ${idx + 1})؟`,
            options: q.options,
            answerIndex: q.answerIndex,
            explanation: q.explanation,
            order: idx + 1,
            difficulty: idx < 5 ? 'easy' : idx < 10 ? 'medium' : 'hard',
            status: 'published',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        });

        // 10 FIB
        fibs.forEach((q, idx) => {
          allQuestions.push({
            packId: packDoc.id,
            subjectId: 'math',
            type: 'FIB',
            question: q.question,
            options: q.options,
            answerIndex: q.answerIndex,
            explanation: q.explanation,
            order: 15 + idx + 1,
            difficulty: idx < 4 ? 'easy' : idx < 8 ? 'medium' : 'hard',
            status: 'published',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        });

        // 10 TF
        tfs.forEach((q, idx) => {
          allQuestions.push({
            packId: packDoc.id,
            subjectId: 'math',
            type: 'TF',
            question: q.question,
            options: q.options,
            answerIndex: q.answerIndex,
            explanation: q.explanation,
            order: 25 + idx + 1,
            difficulty: idx < 4 ? 'easy' : idx < 8 ? 'medium' : 'hard',
            status: 'published',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        });

        // 3 HOQ
        hoqs.forEach((q, idx) => {
          allQuestions.push({
            packId: packDoc.id,
            subjectId: 'math',
            type: 'HOQ',
            question: q.question,
            options: q.options,
            answerIndex: q.answerIndex,
            explanation: q.explanation,
            order: 35 + idx + 1,
            difficulty: 'hard',
            status: 'published',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        });

        // Batch upload questions in groups of 10 to avoid Firestore limits and keep connection stable
        const batchSize = 10;
        for (let i = 0; i < allQuestions.length; i += batchSize) {
          const batch = writeBatch(db);
          const chunk = allQuestions.slice(i, i + batchSize);
          for (const qItem of chunk) {
            const newQRef = doc(collection(db, 'questions'));
            batch.set(newQRef, qItem);
          }
          await batch.commit();
        }

        console.log(`   Successfully seeded exactly ${allQuestions.length} unique questions for Math Chapter ${chNum}!`);
      }
    }

    console.log('\n🎉 ALL 9 MATH CHAPTERS FULLY RE-SEEDED WITH 38 UNIQUE PREMIUM QUESTIONS EACH!');
    process.exit(0);
  } catch (error) {
    console.error('Error during Math re-seeding script execution:', error);
    process.exit(1);
  }
}

main();
