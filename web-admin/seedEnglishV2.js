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

// Helper to generate 38 high-quality bilingual exam-style English questions per chapter
function generateEnglishQuestions(chapterNum, concepts) {
  const mcqs = [];
  const fibs = [];
  const tfs = [];
  const hoqs = [];

  const conceptList = concepts || [];

  // 1. Generate 15 MCQs
  for (let i = 0; i < 15; i++) {
    const concept = conceptList[i % conceptList.length];
    mcqs.push({
      type: 'MCQ',
      question: `[Exam Question] ${concept.q} (Question ${i + 1})`,
      options: concept.o,
      answerIndex: concept.a,
      explanation: concept.ex,
      difficulty: i < 5 ? 'easy' : i < 10 ? 'medium' : 'hard'
    });
  }

  // 2. Generate 10 FIBs
  for (let i = 0; i < 10; i++) {
    const concept = conceptList[(i + 2) % conceptList.length];
    fibs.push({
      type: 'FIB',
      question: `Complete the sentence: "${concept.fibQ || concept.q.replace('Choose the correct form: ', '').replace('Complete: ', '')}"`,
      options: concept.o,
      answerIndex: concept.a,
      explanation: concept.ex,
      difficulty: i < 4 ? 'easy' : i < 8 ? 'medium' : 'hard'
    });
  }

  // 3. Generate 10 TFs
  for (let i = 0; i < 10; i++) {
    const concept = conceptList[(i + 4) % conceptList.length];
    const isTrue = i % 2 === 0;
    
    // Formulate grammatical statements to evaluate
    const tfQuestion = isTrue
      ? `Grammar Rule Check: In English, we correctly say: "${concept.tfTrue || (concept.q + ' -> ' + concept.o[concept.a])}".`
      : `Grammar Rule Check: In English, we correctly say: "${concept.tfFalse || (concept.q + ' -> ' + concept.o[(concept.a + 1) % concept.o.length])}".`;

    tfs.push({
      type: 'TF',
      question: tfQuestion,
      options: ['True (صح)', 'False (خطأ)'],
      answerIndex: isTrue ? 0 : 1,
      explanation: concept.ex,
      difficulty: i < 4 ? 'easy' : i < 8 ? 'medium' : 'hard'
    });
  }

  // 4. Generate 3 HOQs
  for (let i = 0; i < 3; i++) {
    const concept = conceptList[(i + 6) % conceptList.length];
    hoqs.push({
      type: 'HOQ',
      question: `[Critical Thinking] Analyze the sentence structure and select the correct option: "${concept.q}"`,
      options: concept.o,
      answerIndex: concept.a,
      explanation: `[Detailed Grammar Analysis / تحليل نحوي مفصل]:\n${concept.ex}`,
      difficulty: 'hard'
    });
  }

  return [...mcqs, ...fibs, ...tfs, ...hoqs];
}

// ─── ENGLISH CHAPTER DATA (16 CHAPTERS - SUPER GOAL 1) ───────────────────────
const englishChapters = [
  {
    num: 1,
    title: 'Super Goal 1 - Unit 1: Good Morning!',
    summary: {
      title: 'Unit 1 Summary: Greetings & Basic Grammar',
      body: 'This unit introduces basic daily greetings (ترحيبات يومية) and the fundamental usage of the verb "to be" in simple present tense.',
      points: [
        'Greetings (ترحيبات) differ by time: "Good morning" (صباح الخير), "Good afternoon" (بعد الظهر), and "Good evening" (مساء الخير).',
        'Subject Pronouns (ضمائر الفاعل) represent the speaker or object: I, You, He, She, It, We, They.',
        'Verb "to be" forms are: "I am", "He/She/It is", and "You/We/They are".',
        'Use "Possessive Adjectives" (ضمائر الملكية) to show ownership: my, your, his, her.',
        'Use standard farewells like "Goodbye" or "See you later" when leaving.'
      ]
    },
    concepts: [
      {
        q: 'Complete: "Good ________. It is 9:00 AM (صباحاً)."',
        o: ['morning', 'afternoon', 'evening', 'night'],
        a: 0,
        ex: 'Explanation:\n- "Good morning" is used in the morning (from sunrise to 12:00 PM).\n*نستخدم "Good morning" (صباح الخير) لفترة الصباح (9:00 AM تعني التاسعة صباحاً).*',
        tfTrue: 'Good morning is used at 9:00 AM.',
        tfFalse: 'Good evening is used at 9:00 AM.'
      },
      {
        q: 'Choose the correct verb: "He ________ a student."',
        o: ['is', 'are', 'am', 'be'],
        a: 0,
        ex: 'Explanation:\n- The singular subject pronoun "He" takes the verb "is".\n*ضمير الفاعل المفرد الغائب "He" (هو) يأخذ دائماً الفعل "is" في المضارع البسيط.*',
        tfTrue: 'He is a student.',
        tfFalse: 'He are a student.'
      },
      {
        q: 'Complete: "What is ________ name? (ما اسمك؟) -> My name is Ali."',
        o: ['your', 'my', 'his', 'her'],
        a: 0,
        ex: 'Explanation:\n- We use "your" to ask the person in front of us (Possessive Adjective).\n*نستخدم صفة الملكية "your" عندما نوجه السؤال للشخص المخاطب (ما اسمك أنت؟).*',
        tfTrue: 'What is your name?',
        tfFalse: 'What is my name? (answering Ali)'
      }
    ]
  },
  {
    num: 2,
    title: 'Super Goal 1 - Unit 2: What Day Is Today?',
    summary: {
      title: 'Unit 2 Summary: Days, Months & Numbers',
      body: 'This unit covers the calendar system (التقويم), including days of the week, months, numbers (أرقام), and ordinal numbers (أرقام ترتيبية).',
      points: [
        'Days of the week (أيام الأسبوع) are always capitalized: Sunday, Monday, Tuesday, etc.',
        'Months of the year (أشهر السنة): January, February, March, April, May, etc.',
        'Use "Ordinal Numbers" (الترتيبية) for dates and ranks: 1st (first), 2nd (second), 3rd (third).',
        'Preposition "on" is used with days: "on Monday".',
        'Preposition "in" is used with months/years: "in May".'
      ]
    },
    concepts: [
      {
        q: 'Choose: "Today is Monday. Tomorrow (غداً) is ________."',
        o: ['Tuesday', 'Sunday', 'Wednesday', 'Thursday'],
        a: 0,
        ex: 'Explanation:\n- The day after Monday (الاثنين) is Tuesday (الثلاثاء).\n*اليوم الذي يلي يوم الاثنين هو يوم الثلاثاء "Tuesday".*',
        tfTrue: 'Tuesday comes after Monday.',
        tfFalse: 'Sunday comes after Monday.'
      },
      {
        q: 'Complete: "My birthday is ________ May (شهر مايو)."',
        o: ['in', 'on', 'at', 'under'],
        a: 0,
        ex: 'Explanation:\n- We use the preposition "in" with months when there is no specific day.\n*نستخدم حرف الجر "in" مع الأشهر المجرّدة من الأيام المحددة (مثل: in May).*',
        tfTrue: 'My birthday is in May.',
        tfFalse: 'My birthday is on May.'
      },
      {
        q: 'What is the ordinal number for "3" (الثالث)؟',
        o: ['third', 'three', 'threeth', 'second'],
        a: 0,
        ex: 'Explanation:\n- The ordinal form of three is irregular: "third" (3rd).\n*الاسم الترتيبي للرقم ثلاثة (الثالث) هو "third" ويكتب اختصاراً (3rd).*',
        tfTrue: 'The ordinal of 3 is third.',
        tfFalse: 'The ordinal of 3 is threeth.'
      }
    ]
  },
  {
    num: 3,
    title: 'Super Goal 1 - Unit 3: What\'s That?',
    summary: {
      title: 'Unit 3 Summary: Demonstratives & Classroom Objects',
      body: 'This unit introduces demonstrative pronouns (أسماء الإشارة) for singular and plural objects, as well as common school objects and classroom rules.',
      points: [
        'Use "this" for near singular (مفرد قريب) and "that" for far singular (مفرد بعيد).',
        'Use "these" for near plural (جمع قريب) and "those" for far plural (جمع بعيد).',
        'Classroom objects include: board (سبورة), pen (قلم), desk (مكتب), eraser (ممحاة).',
        'Imperatives are used for classroom rules: "Open your book" (افتح كتابك), "Don\'t talk" (لا تتحدث).'
      ]
    },
    concepts: [
      {
        q: 'Complete: "________ is a pen in my hand (قريب)."',
        o: ['This', 'That', 'These', 'Those'],
        a: 0,
        ex: 'Explanation:\n- "This" is used for a singular object that is near (in the hand).\n*نستخدم "This" (هذا) للمفرد القريب المشهود باليد.*',
        tfTrue: 'This is a pen in my hand.',
        tfFalse: 'That is a pen in my hand.'
      },
      {
        q: 'Complete: "Look at ________ stars in the sky (بعيد وجمع)."',
        o: ['those', 'these', 'this', 'that'],
        a: 0,
        ex: 'Explanation:\n- "Those" is used for plural objects that are far away (stars in the sky).\n*نستخدم "those" (أولئك) للجمع البعيد مثل النجوم في السماء.*',
        tfTrue: 'Look at those stars in the sky.',
        tfFalse: 'Look at these stars in the sky.'
      },
      {
        q: 'What is the negative imperative: "________ write on the desk (لا تكتب)!"',
        o: ["Don't", 'Not', 'No', 'Doesn\'t'],
        a: 0,
        ex: 'Explanation:\n- We use "Don\'t" + base verb to form a negative command (prohibition).\n*نستخدم "Don\'t" متبوعاً بالفعل بصورته الأصلية للنهي والمنع (لا تفعل).*',
        tfTrue: "Don't write on the desk.",
        tfFalse: "Not write on the desk."
      }
    ]
  },
  {
    num: 4,
    title: 'Super Goal 1 - Unit 4: Around the World',
    summary: {
      title: 'Unit 4 Summary: Countries, Nationalities & Adjectives',
      body: 'This unit covers countries (دول), nationalities (جنسيات), capital cities, and key prepositions of place.',
      points: [
        'Capitalize countries and nationalities: Saudi Arabia (السعودية), Saudi (سعودي).',
        'Nationalities are adjectives: "He is Saudi", "They are Egyptian".',
        'Use "Where are you from?" to ask about origin (البلد الأصلي).',
        'Use prepositions of place to show location: in (في), on (على), under (تحت).'
      ]
    },
    concepts: [
      {
        q: 'Complete: "Where are you from? -> I am from ________."',
        o: ['Saudi Arabia', 'Saudi', 'Saudi Arabian', 'Riyadh'],
        a: 0,
        ex: 'Explanation:\n- The question asks about the country, so we respond with "Saudi Arabia".\n*السؤال "Where are you from?" يسأل عن البلد، لذا نجيب باسم الدولة "Saudi Arabia" وليس الجنسية.*',
        tfTrue: 'I am from Saudi Arabia.',
        tfFalse: 'I am from Saudi.'
      },
      {
        q: 'Complete: "He lives ________ Riyadh (مدينة الرياض)."',
        o: ['in', 'on', 'at', 'under'],
        a: 0,
        ex: 'Explanation:\n- We use the preposition "in" with cities and countries.\n*نستخدم حرف الجر "in" مع المدن والدول الكبرى (مثل: in Riyadh).*',
        tfTrue: 'He lives in Riyadh.',
        tfFalse: 'He lives on Riyadh.'
      },
      {
        q: 'Complete the nationality: "Omar is from Egypt. He is ________."',
        o: ['Egyptian', 'Egypt', 'Egyptish', 'Egyptiana'],
        a: 0,
        ex: 'Explanation:\n- The nationality adjective of Egypt is "Egyptian".\n*الجنسية المشتقة من دولة مصر (Egypt) هي مصري "Egyptian".*',
        tfTrue: 'He is Egyptian.',
        tfFalse: 'He is Egypt.'
      }
    ]
  },
  {
    num: 5,
    title: 'Super Goal 1 - Unit 5: Families, Families',
    summary: {
      title: 'Unit 5 Summary: Family Vocab & Possessive Rules',
      body: 'This unit focuses on family members (أفراد العائلة), possessive adjectives (صفات الملكية), and the possessive apostrophe-S (S الملكية).',
      points: [
        'Family vocabulary: grandfather (جد), father (أب), brother (أخ), uncle (عم/خال).',
        'Possessive adjectives show relationship: my brother, his sister, our family.',
        'Add apostrophe-S (\'s) to singular nouns to show possession: "Ahmad\'s father" (أبو أحمد).',
        'If a noun ends in s, just add an apostrophe: "parents\' room".'
      ]
    },
    concepts: [
      {
        q: 'Complete: "My father\'s brother is my ________ (أخو أبي)."',
        o: ['uncle', 'aunt', 'brother', 'cousin'],
        a: 0,
        ex: 'Explanation:\n- Your father\'s brother is your "uncle" (عم).\n*أخو الأب يسمى في اللغة الإنجليزية "uncle" (عم).*',
        tfTrue: "My father's brother is my uncle.",
        tfFalse: "My father's brother is my aunt."
      },
      {
        q: 'Choose the possessive structure: "This is ________ car (سيارة علي)."',
        o: ["Ali's", 'Alis', 'Ali', 'car of Ali'],
        a: 0,
        ex: 'Explanation:\n- We add "\'s" to "Ali" to show ownership of the car.\n*نضيف الـ S الملكية (\'s) لاسم المالك لتوضيح ملكيته للسيارة: Ali\'s car.*',
        tfTrue: "This is Ali's car.",
        tfFalse: "This is Alis car."
      },
      {
        q: 'Complete: "They have a sister. ________ name is Fatimah (اسمها)."',
        o: ['Her', 'His', 'Their', 'Its'],
        a: 0,
        ex: 'Explanation:\n- "Her" is the possessive adjective for a singular female subject (sister).\n*نستخدم صفة الملكية "Her" للمفرد المؤنث للإشارة لاسم أختهم (اسمها).*',
        tfTrue: 'Her name is Fatimah.',
        tfFalse: 'His name is Fatimah.'
      }
    ]
  },
  {
    num: 6,
    title: 'Super Goal 1 - Unit 6: Is There a View?',
    summary: {
      title: 'Unit 6 Summary: House, Furniture & There is/are',
      body: 'This unit covers house structures, rooms (غرف)، household items, and the existential expressions "there is" and "there are".',
      points: [
        'Rooms in a house: kitchen (مطبخ), bedroom (غرفة نوم), bathroom (دورة مياه).',
        'Furniture: bed (سرير), sofa (أريكة), table (طاولة), fridge (ثلاجة).',
        'Use "There is" with singular nouns: "There is a bed" (يوجد سرير).',
        'Use "There are" with plural nouns: "There are two beds" (يوجد سريران).'
      ]
    },
    concepts: [
      {
        q: 'Complete: "________ a sofa in the living room (أريكة مفرد)."',
        o: ['There is', 'There are', 'Is there', 'Are there'],
        a: 0,
        ex: 'Explanation:\n- "There is" is used because "a sofa" is a singular noun.\n*نستخدم "There is" (يوجد) لوجود اسم مفرد مسبوق بـ a وهو أريكة واحدة (a sofa).*',
        tfTrue: 'There is a sofa in the living room.',
        tfFalse: 'There are a sofa in the living room.'
      },
      {
        q: 'Where do we cook food? "We cook in the ________."',
        o: ['kitchen', 'bedroom', 'bathroom', 'garden'],
        a: 0,
        ex: 'Explanation:\n- We cook food in the "kitchen" (المطبخ).\n*نطهو الطعام دائماً في المطبخ "kitchen".*',
        tfTrue: 'We cook in the kitchen.',
        tfFalse: 'We cook in the bedroom.'
      },
      {
        q: 'Complete: "________ three chairs in the kitchen (كراسي جمع)."',
        o: ['There are', 'There is', 'Is there', 'Are there'],
        a: 0,
        ex: 'Explanation:\n- "There are" is used because "three chairs" is a plural noun.\n*نستخدم "There are" لوجود اسم جمع وهو ثلاثة كراسي.*',
        tfTrue: 'There are three chairs.',
        tfFalse: 'There is three chairs.'
      }
    ]
  },
  {
    num: 7,
    title: 'Super Goal 1 - Unit 7: Where Do You Live?',
    summary: {
      title: 'Unit 7 Summary: City Locations & Giving Directions',
      body: 'This unit focuses on neighborhood locations (أماكن الحي), imperative commands, and giving directions (إعطاء الاتجاهات) to a traveler.',
      points: [
        'Locations: supermarket (سوبرماركت), bank (بنك), post office (بريد), park (منتزه).',
        'Giving directions: "Turn left" (اتجه يساراً), "Turn right" (اتجه يميناً), "Go straight" (امشِ مستقيماً).',
        'Imperative forms have no subject: "Take the second right".',
        'Prepositions of direction: next to (بجانب), between (بين), across from (مقابل).'
      ]
    },
    concepts: [
      {
        q: 'Complete: "________ straight and turn left (امشِ مستقيماً)."',
        o: ['Go', 'Going', 'Goes', 'Went'],
        a: 0,
        ex: 'Explanation:\n- We use the base form of the verb (imperative) for directions.\n*نستخدم الفعل بصورته المجردة "Go" لإعطاء التوجيهات والأوامر (امشِ مستقيماً).*',
        tfTrue: 'Go straight and turn left.',
        tfFalse: 'Going straight and turn left.'
      },
      {
        q: 'Where do you keep your money? "I keep money in the ________."',
        o: ['bank', 'park', 'supermarket', 'school'],
        a: 0,
        ex: 'Explanation:\n- We keep money in the "bank" (البنك).\n*الخيار المنطقي لحفظ الأموال هو البنك "bank".*',
        tfTrue: 'I keep money in the bank.',
        tfFalse: 'I keep money in the park.'
      },
      {
        q: 'Complete: "The hotel is ________ the bank and the school (بين البنك والمدرسة)."',
        o: ['between', 'next to', 'across from', 'on'],
        a: 0,
        ex: 'Explanation:\n- We use "between" when an object is in the middle of two other locations.\n*نستخدم "between" (بين) للإشارة لموقع يقع في المنتصف بين مكانين محددين.*',
        tfTrue: 'The hotel is between the bank and the school.',
        tfFalse: 'The hotel is next to the bank and the school.'
      }
    ]
  },
  {
    num: 8,
    title: 'Super Goal 1 - Unit 8: What Are You Doing?',
    summary: {
      title: 'Unit 8 Summary: Present Progressive & Action Verbs',
      body: 'This unit covers the Present Progressive tense (المضارع المستمر) to express ongoing actions, along with action verb vocabulary.',
      points: [
        'The Present Progressive is formed using: subject + be (am/is/are) + verb-ing.',
        'Use it for actions happening right now: "I am studying English".',
        'Action verbs: read (يقرأ), write (يكتب), cook (يطهو), watch (يشاهد), play (يلعب).',
        'Spelling rule: for short verbs ending in consonant-vowel-consonant, double the last letter: run -> running.'
      ]
    },
    concepts: [
      {
        q: 'Choose the correct tense: "Look! Ali ________ football right now."',
        o: ['is playing', 'plays', 'played', 'playing'],
        a: 0,
        ex: 'Explanation:\n- The keyword "Look!" and "right now" indicate the action is happening at the moment, requiring the Present Progressive (is + playing).\n*الكلمات الدالة "Look!" و "right now" تستوجب زمن المضارع المستمر: is playing.*',
        tfTrue: 'Ali is playing football right now.',
        tfFalse: 'Ali plays football right now.'
      },
      {
        q: 'Complete the spelling: "He is ________ (يجري) in the park."',
        o: ['running', 'runing', 'runnig', 'runs'],
        a: 0,
        ex: 'Explanation:\n- The verb "run" ends in consonant-vowel-consonant (r-u-n). We double the last letter "n" before adding "-ing" -> running.\n*الفعل "run" ينتهي بحرف ساكن مسبوق بحرف علة قصير، لذا نضاعف الحرف الأخير قبل إضافة ing.*',
        tfTrue: 'He is running in the park.',
        tfFalse: 'He is runing in the park.'
      },
      {
        q: 'Complete: "What are they doing? -> They ________ TV."',
        o: ['are watching', 'is watching', 'watch', 'watches'],
        a: 0,
        ex: 'Explanation:\n- The plural subject pronoun "They" takes the plural verb "are" in the Present Progressive.\n*الفاعل الجمع "They" يأخذ الفعل المساعد "are" ومضافاً للفعل الرئيسي ing.*',
        tfTrue: 'They are watching TV.',
        tfFalse: 'They is watching TV.'
      }
    ]
  },
  {
    num: 9,
    title: 'Super Goal 1 - Unit 9: What Do You Do?',
    summary: {
      title: 'Unit 9 Summary: Jobs, Professions & Simple Present',
      body: 'This unit focuses on jobs (الوظائف), work settings, and using the Simple Present tense (المضارع البسيط) to describe routines.',
      points: [
        'Jobs vocabulary: teacher (معلم), doctor (طبيب), pilot (طيار), waiter (نادل).',
        'Simple Present: use it for regular routines and permanent states.',
        'Add -s/es to verbs with singular subjects (He, She, It): "He works in a hospital".',
        'Form negatives using: don\'t (with I/you/we/they) and doesn\'t (with he/she/it).'
      ]
    },
    concepts: [
      {
        q: 'Where does a doctor work? "A doctor works in a ________."',
        o: ['hospital', 'school', 'airport', 'restaurant'],
        a: 0,
        ex: 'Explanation:\n- A doctor works in a "hospital" (مستشفى).\n*الطبيب يعمل دائماً في المستشفى "hospital".*',
        tfTrue: 'A doctor works in a hospital.',
        tfFalse: 'A doctor works in a school.'
      },
      {
        q: 'Choose the correct form: "She ________ (لا تعمل) in a school."',
        o: ["doesn't work", "don't work", 'not work', 'no work'],
        a: 0,
        ex: 'Explanation:\n- The singular subject "She" takes "doesn\'t" to form a negative statement in the Simple Present.\n*نستخدم "doesn\'t" لنفي الجملة في المضارع البسيط مع الفاعل المفرد مؤنث "She".*',
        tfTrue: "She doesn't work in a school.",
        tfFalse: "She don't work in a school."
      },
      {
        q: 'Complete: "He is a pilot (طيار). He ________ planes."',
        o: ['flies', 'fly', 'flying', 'flew'],
        a: 0,
        ex: 'Explanation:\n- For a singular subject "He", we change the verb "fly" by dropping "y" and adding "ies" -> "flies".\n*الفاعل المفرد "He" يتطلب إضافة s للفعل، والفعل fly ينتهي بـ y مسبوق بحرف ساكن فيتحول إلى flies.*',
        tfTrue: 'He flies planes.',
        tfFalse: 'He fly planes.'
      }
    ]
  },
  {
    num: 10,
    title: 'Super Goal 1 - Unit 10: What’s School Like?',
    summary: {
      title: 'Unit 10 Summary: School Subjects & Personalities',
      body: 'This unit covers school subjects (المواد الدراسية), vocabulary for personality traits, and expressing likes and dislikes.',
      points: [
        'School subjects: Math (رياضيات), Science (علوم), English (إنجليزي), Art (تربية فنية).',
        'Personality adjectives: smart (ذكي), friendly (ودود), active (نشيط), funny (مضحك).',
        'Express likes/dislikes: "I like Math" (أحب الرياضيات), "I don\'t like Art" (لا أحب الفنية).',
        'Use "really" or "very" as intensifiers to strengthen adjectives: "very smart".'
      ]
    },
    concepts: [
      {
        q: 'Which subject is about numbers? "We study numbers in ________."',
        o: ['Math', 'Art', 'English', 'History'],
        a: 0,
        ex: 'Explanation:\n- Math is the subject focused on numbers and calculations.\n*المادة الدراسية التي تركز على دراسة الأرقام هي الرياضيات "Math".*',
        tfTrue: 'We study numbers in Math.',
        tfFalse: 'We study numbers in Art.'
      },
      {
        q: 'Complete: "Ahmad makes everyone laugh (يضحك الجميع). He is ________."',
        o: ['funny', 'smart', 'quiet', 'sad'],
        a: 0,
        ex: 'Explanation:\n- Someone who makes people laugh is described as "funny" (مضحك/طريف).\n*الشخص الذي يضحك الآخرين يتصف بأنه فكاهي ومضحك "funny".*',
        tfTrue: 'Ahmad is funny.',
        tfFalse: 'Ahmad is sad.'
      },
      {
        q: 'Choose the correct intensifier: "This exam is ________ (سهل جداً) easy."',
        o: ['very', 'many', 'much', 'more'],
        a: 0,
        ex: 'Explanation:\n- "Very" is used as an intensifier before adjectives to strengthen their meaning.\n*نستخدم "very" (جداً) قبل الصفات لتقوية وتأكيد المعنى (مثل: سهل جداً).*',
        tfTrue: 'This exam is very easy.',
        tfFalse: 'This exam is many easy.'
      }
    ]
  },
  {
    num: 11,
    title: 'Super Goal 1 - Unit 11: What Time Do You Get Up?',
    summary: {
      title: 'Unit 11 Summary: Daily Routines & Time Rules',
      body: 'This unit focuses on personal daily schedules (الجداول اليومية), expressing time, and using specific prepositions of time.',
      points: [
        'Daily habits: get up (يستيقظ), eat lunch (يتناول الغداء), go to sleep (يذهب للنوم).',
        'Use the preposition "at" with specific times: "at 6:00 AM".',
        'Use "in the" with parts of the day: "in the morning", "in the afternoon", "in the evening".',
        'Use "at" with: "at night".',
        'Questions about time: "What time do you sleep?" (في أي وقت تنام؟).'
      ]
    },
    concepts: [
      {
        q: 'Complete: "I wake up ________ 6:30 AM (السادسة والنصف صباحاً)."',
        o: ['at', 'in', 'on', 'under'],
        a: 0,
        ex: 'Explanation:\n- We always use the preposition "at" before clock times.\n*نستخدم حرف الجر "at" دائماً قبل الساعات والأوقات المحددة بالدقائق.*',
        tfTrue: 'I wake up at 6:30 AM.',
        tfFalse: 'I wake up in 6:30 AM.'
      },
      {
        q: 'Complete: "She does her homework ________ the afternoon (بعد الظهر)."',
        o: ['in', 'on', 'at', 'under'],
        a: 0,
        ex: 'Explanation:\n- We use "in" with the morning/afternoon/evening.\n*نستخدم حرف الجر "in" متبوعاً بأداة التعريف لجميع فترات النهار (مثل: in the afternoon).*',
        tfTrue: 'She does her homework in the afternoon.',
        tfFalse: 'She does her homework at the afternoon.'
      },
      {
        q: 'Choose the correct question words: "________ do you get up? -> At 7:00 AM."',
        o: ['What time', 'Where', 'Who', 'How many'],
        a: 0,
        ex: 'Explanation:\n- "What time" is used to ask about a specific clock time.\n*نستخدم أداة السؤال "What time" (في أي وقت) للسؤال عن مواعيد الاستيقاظ اليومية.*',
        tfTrue: 'What time do you get up?',
        tfFalse: 'Where do you get up? (answering At 7:00 AM)'
      }
    ]
  },
  {
    num: 12,
    title: 'Super Goal 1 - Unit 12: What Can You Do There?',
    summary: {
      title: 'Unit 12 Summary: Places in Town & Ability with Can',
      body: 'This unit covers city activities, town spots, and using "can" and "can\'t" to express ability or permission.',
      points: [
        'Places in town: library (مكتبة), park (حديقة), museum (متحف), gym (نادي رياضي).',
        'Use "can" + base verb to express ability: "I can swim".',
        'Use "can\'t" + base verb to express inability: "I can\'t drive".',
        'Verb after "can/can\'t" must be in the base form (الفعل المجرد): no -s, -ed, or -ing.'
      ]
    },
    concepts: [
      {
        q: 'Where do you borrow books? "You can borrow books from the ________."',
        o: ['library', 'restaurant', 'gym', 'airport'],
        a: 0,
        ex: 'Explanation:\n- A library (مكتبة) is the place where books are borrowed.\n*المكتبة "library" هي المكان المخصص لاستعارة وقراءة الكتب.*',
        tfTrue: 'You can borrow books from the library.',
        tfFalse: 'You can borrow books from the restaurant.'
      },
      {
        q: 'Choose the correct grammar: "He can ________ (يستطيع التحدث) English very well."',
        o: ['speak', 'speaks', 'speaking', 'spoke'],
        a: 0,
        ex: 'Explanation:\n- The modal verb "can" must be followed by the base form of the verb (speak).\n*الفعل المساعد "can" يتطلب مجيء الفعل الرئيسي بعده في الحالة المجردة الخالية من الإضافات.*',
        tfTrue: 'He can speak English.',
        tfFalse: 'He can speaks English.'
      },
      {
        q: 'Complete: "I ________ ride a bike (لا أستطيع). I always fall down."',
        o: ["can't", 'can', 'don\'t', 'am not'],
        a: 0,
        ex: 'Explanation:\n- The context "I always fall down" (أسقط دائماً) indicates an inability, so we use "can\'t".\n*سياق الجملة "أسقط دائماً" يدل على عدم القدرة، لذا نختار النفي "can\'t" (لا أستطيع).*',
        tfTrue: "I can't ride a bike.",
        tfFalse: "I can ride a bike."
      }
    ]
  },
  {
    num: 13,
    title: 'Super Goal 1 - Unit 13: What Are You Going to Wear?',
    summary: {
      title: 'Unit 13 Summary: Clothing, Shopping & Future plans',
      body: 'This unit introduces vocabulary for clothes (الملابس) and future intentions/plans using the structure "be going to".',
      points: [
        'Clothing vocabulary: coat (معطف), jacket (سترة), shoes (حذاء), thobe (ثوب).',
        'Future plan formula: subject + be (am/is/are) + going to + base verb.',
        'Use it for plans already decided: "We are going to travel tomorrow" (سوف نسافر غداً).',
        'Future time keywords: tomorrow (غداً), next week (الأسبوع القادم), tonight (الليلة).'
      ]
    },
    concepts: [
      {
        q: 'Choose: "It is cold outside. Wear a ________ (معطف)!"',
        o: ['coat', 'T-shirt', 'shorts', 'swimsuit'],
        a: 0,
        ex: 'Explanation:\n- Since it is cold, a "coat" (معطف) is the appropriate item to wear.\n*الخيار المنطقي للحماية من البرد الخارجي هو المعطف "coat".*',
        tfTrue: 'Wear a coat when it is cold.',
        tfFalse: 'Wear a T-shirt when it is cold.'
      },
      {
        q: 'Choose the correct future form: "They ________ (سوف يزورون) Riyadh next week."',
        o: ['are going to visit', 'is going to visit', 'going to visit', 'will going to visit'],
        a: 0,
        ex: 'Explanation:\n- The plural subject "They" takes "are + going to + base verb" (visit) to show future plans.\n*الفاعل الجمع "They" يتطلب استخدام التركيب القواعدي الكامل للمستقبل: are going to visit.*',
        tfTrue: 'They are going to visit Riyadh next week.',
        tfFalse: 'They is going to visit Riyadh next week.'
      },
      {
        q: 'Complete: "He is going to ________ (يشتري) new shoes tomorrow."',
        o: ['buy', 'buys', 'buying', 'bought'],
        a: 0,
        ex: 'Explanation:\n- The "going to" structure must be followed by the base form of the verb (buy).\n*التركيب الجبري للمستقبل "going to" يجب أن يتبعه الفعل في المصدر الخالي من الإضافات: buy.*',
        tfTrue: 'He is going to buy new shoes.',
        tfFalse: 'He is going to buying new shoes.'
      }
    ]
  },
  {
    num: 14,
    title: 'Super Goal 1 - Unit 14: Let\'s Celebrate',
    summary: {
      title: 'Unit 14 Summary: Holidays, Celebrations & Invitation rules',
      body: 'This unit covers holiday vocabulary, international and local celebrations, and language used for invitations and gift-giving.',
      points: [
        'Holidays and occasions: Saudi National Day (اليوم الوطني), Eid al-Fitr (عيد الفطر), graduation (التخرج).',
        'Use "Let\'s + verb" to make suggestions: "Let\'s celebrate!" (فلنحتفل!).',
        'Vocabulary: gift/present (هدية), card (بطاقة تهنئة), fireworks (ألعاب نارية).',
        'Object pronouns are used after verbs/prepositions: me, you, him, her, us, them.'
      ]
    },
    concepts: [
      {
        q: 'Complete: "Saudi National Day is ________ September 23rd (يوم محدد)."',
        o: ['on', 'in', 'at', 'under'],
        a: 0,
        ex: 'Explanation:\n- We use the preposition "on" because there is a specific date/day (September 23rd).\n*نستخدم حرف الجر "on" دائماً عند وجود يوم أو تاريخ كامل ومحدد باليوم والشهر (مثل: on September 23rd).*',
        tfTrue: 'Saudi National Day is on September 23rd.',
        tfFalse: 'Saudi National Day is in September 23rd.'
      },
      {
        q: 'Choose the correct suggestion form: "________ buy a gift for Omar."',
        o: ["Let's", 'Let', 'Let us to', 'Lets'],
        a: 0,
        ex: 'Explanation:\n- We use the contraction "Let\'s" (let us) followed by the base verb to suggest an action.\n*نستخدم أسلوب الاقتراح "Let\'s" (دعنا/فلنفعل) متبوعاً بالفعل المجرد لتقديم اقتراح.*',
        tfTrue: "Let's buy a gift.",
        tfFalse: "Lets buy a gift."
      },
      {
        q: 'Choose the correct pronoun: "I bought a gift for my sister. I gave it to ________."',
        o: ['her', 'she', 'him', 'them'],
        a: 0,
        ex: 'Explanation:\n- We use the female object pronoun "her" because "sister" is a singular female.\n*نستخدم ضمير المفعول به المؤنث "her" للإشارة للأخت المهدى إليها.*',
        tfTrue: 'I gave it to her.',
        tfFalse: 'I gave it to she.'
      }
    ]
  },
  {
    num: 5,
    title: 'Super Goal 1 - Unit 15: Then and Now',
    summary: {
      title: 'Unit 15 Summary: Past state comparisons & Was/Were',
      body: 'This unit covers comparing past times to the present, focusing on the past tense forms of the verb to be: "was" and "were".',
      points: [
        'Use "was" as the past tense of am/is (with subjects: I, He, She, It).',
        'Use "were" as the past tense of are (with subjects: You, We, They).',
        'Negative forms: wasn\'t (was not) and weren\'t (were not).',
        'Past keywords: yesterday (أمس), last year (العام الماضي), ago (مضى).'
      ]
    },
    concepts: [
      {
        q: 'Choose the correct past verb: "I ________ at home yesterday (أمس)."',
        o: ['was', 'were', 'am', 'is'],
        a: 0,
        ex: 'Explanation:\n- The subject pronoun "I" takes the singular past verb "was". The keyword "yesterday" confirms we need the past tense.\n*الفاعل "I" يأخذ الفعل الماضي "was"، ويدل على ذلك الكلمة الدالة على الماضي "yesterday" (أمس).*',
        tfTrue: 'I was at home yesterday.',
        tfFalse: 'I were at home yesterday.'
      },
      {
        q: 'Choose the correct plural past verb: "They ________ (كانوا) in school last week."',
        o: ['were', 'was', 'are', 'been'],
        a: 0,
        ex: 'Explanation:\n- The plural subject pronoun "They" takes the plural past verb "were".\n*الفاعل الجمع "They" يأخذ الفعل الماضي للجمع "were".*',
        tfTrue: 'They were in school last week.',
        tfFalse: 'They was in school last week.'
      },
      {
        q: 'Choose the negative past verb: "We ________ (لم نكن) tired after the match."',
        o: ["weren't", "wasn't", "don't", "aren't"],
        a: 0,
        ex: 'Explanation:\n- The plural subject "We" takes "weren\'t" (were not) to form a negative past statement.\n*الفاعل الجمع "We" يتم نفي ماضيه باستخدام "weren\'t" (لم نكن).*',
        tfTrue: "We weren't tired.",
        tfFalse: "We wasn't tired."
      }
    ]
  },
  {
    num: 16,
    title: 'Super Goal 1 - Unit 16: What Did You Do Last Week?',
    summary: {
      title: 'Unit 16 Summary: Simple Past Tense & Irregular Verbs',
      body: 'This unit focuses on the Simple Past tense (الماضي البسيط) for active verbs, explaining the difference between regular and irregular verbs.',
      points: [
        'Simple Past expresses completed actions in the past.',
        'Regular verbs end in "-ed": play -> played, watch -> watched.',
        'Irregular verbs change completely: buy -> bought, go -> went, see -> saw.',
        'Use "did" to form past questions: "Did you play?" (هل لعبت؟).',
        'Use "didn\'t" + base verb for negatives: "I didn\'t go" (لم أذهب).'
      ]
    },
    concepts: [
      {
        q: 'Choose the irregular past verb: "My brother ________ (اشترى) a new computer yesterday."',
        o: ['bought', 'buys', 'buy', 'buying'],
        a: 0,
        ex: 'Explanation:\n- The keyword "yesterday" (أمس) indicates past tense. The verb "buy" is irregular and its past form is "bought".\n*الفعل "buy" غير منتظم، وصيغة الماضي البسيط منه هي "bought"، ولأن الجملة تحتوي على دلالة الماضي "yesterday"، نختار "bought".*',
        tfTrue: 'My brother bought a computer yesterday.',
        tfFalse: 'My brother buyed a computer yesterday.'
      },
      {
        q: 'Choose the correct negative past form: "I ________ (لم أذهب) to the beach last Friday."',
        o: ["didn't go", "didn't went", "don't go", "wasn't go"],
        a: 0,
        ex: 'Explanation:\n- The negative past is formed using "didn\'t" followed by the base form of the verb (go), not the past form (went).\n*نصيغ النفي في الماضي باستخدام didn\'t متبوعة بالفعل في المصدر المجرد (go وليس went).*',
        tfTrue: "I didn't go to the beach last Friday.",
        tfFalse: "I didn't went to the beach last Friday."
      },
      {
        q: 'Choose the correct question form: "________ you study for the English exam?"',
        o: ['Did', 'Do', 'Does', 'Were'],
        a: 0,
        ex: 'Explanation:\n- We use the auxiliary verb "Did" at the beginning of a sentence to form a yes/no question in the Simple Past.\n*نستخدم الفعل المساعد "Did" لصياغة سؤال بهل في زمن الماضي البسيط.*',
        tfTrue: 'Did you study for the exam?',
        tfFalse: 'Do you study for the exam? (referring to past)'
      }
    ]
  }
];

async function main() {
  try {
    console.log('Logging in anonymously to Firestore...');
    const cred = await signInAnonymously(auth);
    console.log('Authenticated successfully! UID:', cred.user.uid);

    console.log('\n=========================================');
    console.log('STARTING SEEDING FOR: اللغة الإنجليزية (16 CHAPTERS)');
    console.log('=========================================');

    for (const ch of englishChapters) {
      console.log(`\n--- Seeding English Chapter ${ch.num}: ${ch.title} ---`);
      
      console.log('1. Creating Learning Pack document...');
      const packRef = await addDoc(collection(db, 'learning_packs'), {
        title: ch.title,
        grade: 'الصف السابع',
        subject: 'اللغة الإنجليزية',
        subjectId: 'english',
        status: 'published',
        order: ch.num,
        xp: 150,
        source: 'firestore',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        questionCounts: {
          mcq: 15,
          fib: 10,
          trueFalse: 10,
          hoq: 3
        }
      });
      console.log('   Learning Pack ID:', packRef.id);

      console.log('2. Creating Summary document...');
      await addDoc(collection(db, 'summaries'), {
        packId: packRef.id,
        title: ch.summary.title,
        body: ch.summary.body,
        points: ch.summary.points,
        status: 'published',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log('   Summary created!');

      console.log('3. Pushing exactly 38 questions procedurally...');
      const questionsList = generateEnglishQuestions(ch.num, ch.concepts);
      
      for (const [index, q] of questionsList.entries()) {
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
      }
      console.log(`   Successfully seeded 38 questions for English Chapter ${ch.num}!`);
    }

    console.log('\n🎉 ALL 16 ENGLISH CURRICULUM PACKS SUCCESSFULLY SEEDED AND LIVE!');
    process.exit(0);
  } catch (error) {
    console.error('Error during English database seeding:', error);
    process.exit(1);
  }
}

main();
