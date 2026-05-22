package com.example.data.mock

import com.example.domain.models.LearningPack
import com.example.domain.models.Subject
import com.example.domain.models.Question
import com.example.domain.models.QuestionType
import com.example.domain.models.UploadJob
import com.example.domain.models.ReviewTask
import com.example.domain.models.AdminAnalytics
import com.example.domain.models.NotificationDraft

object MockData {
    // Grades List
    val grades = mutableStateListOf(
        "الصف الأول المتوسط",
        "الصف الثاني المتوسط",
        "الصف الثالث المتوسط"
    )

    // Subjects List
    val subjects = mutableStateListOf(
        Subject("1", "الرياضيات", "📐", 30, "مبتدئ", 1, 4),
        Subject("2", "العلوم", "🧪", 60, "متوسط", 2, 5),
        Subject("3", "اللغة العربية", "📖", 80, "متقدم", 3, 4),
        Subject("4", "اللغة الإنجليزية", "🔤", 10, "مبتدئ", 0, 5),
        Subject("5", "الدراسات الإسلامية", "🕋", 100, "خبير", 4, 4),
        Subject("6", "الدراسات الاجتماعية", "🌍", 40, "متوسط", 1, 3),
        Subject("7", "المهارات الرقمية", "💻", 0, "مبتدئ", 0, 3)
    )

    // Learning Packs by Subject
    private val learningPacksMap = mutableMapOf<String, MutableList<LearningPack>>()

    // Summaries by Pack
    private val summariesMap = mutableMapOf<String, String>()

    // Questions by Pack
    private val questionsMap = mutableMapOf<String, MutableList<Question>>()

    // Review queue tasks
    val reviewTasks = mutableStateListOf<ReviewTask>()

    // Upload records
    val uploadJobs = mutableStateListOf<UploadJob>()

    // Sent notifications logs
    val sentNotifications = mutableStateListOf<NotificationDraft>()

    // Track read notifications by ID (simulated dynamic local database)
    val readNotificationIds = mutableStateListOf<String>()

    // Gamification settings
    var xpForSummary = 5
    var xpForCorrectAnswer = 2
    var xpForQuizCompletion = 10

    init {
        // Initialize mock learning packs
        subjects.forEach { subject ->
            val packs = mutableListOf(
                LearningPack("${subject.id}_1", subject.id, "الحزمة الأولى", "أساسيات ومقدمة", false, false, 100, true),
                LearningPack("${subject.id}_2", subject.id, "الحزمة الثانية", "مفاهيم متقدمة", false, true, 0, false),
                LearningPack("${subject.id}_3", subject.id, "الحزمة الثالثة", "تطبيقات عملية", true, true, 0, false),
                LearningPack("${subject.id}_4", subject.id, "الحزمة الرابعة", "اختبارات شاملة", true, true, 0, false)
            )
            learningPacksMap[subject.id] = packs
        }

        // Initialize review tasks
        reviewTasks.addAll(
            listOf(
                ReviewTask(
                    id = "task_1",
                    packId = "1_5",
                    packTitle = "المعادلات التربيعية",
                    subjectName = "الرياضيات",
                    gradeName = "الصف الثالث المتوسط",
                    summaryDraft = "هذا هو ملخص المعادلات التربيعية المولد بواسطة الذكاء الاصطناعي. يناقش القانون العام لحل المعادلة التربيعية بأسلوب ميسر ومبسط مع الخطوات التوضيحية والأمثلة التطبيقية لطلاب المتوسطة.",
                    questionsDraft = mutableListOf(
                        Question("q_rev_1", "حل المعادلة التالية: س^2 - 4 = 2", QuestionType.MCQ, listOf("2, -2", "1", "3", "0"), "2, -2", "الخطوة الأولى: أعد ترتيب المعادلة.\n\nالخطوة الثانية: احسب الجذر التربيعي."),
                        Question("q_rev_2", "هل المعادلة س^2 + 1 = 0 لها حل حقيقي؟", QuestionType.TF, listOf("صح", "خطأ"), "خطأ", "الخطوة الأولى: بسط المعادلة.\n\nالخطوة الثانية: لا توجد جذور حقيقية للأعداد السالبة.")
                    ),
                    rubricScore = 94,
                    rubricDetails = "ممتاز جداً - صياغة دقيقة وواضحة تلبي شروط مناهج المملكة وتوفر شروحات متدرجة.",
                    isPremium = true
                ),
                ReviewTask(
                    id = "task_2",
                    packId = "2_5",
                    packTitle = "عملية البناء الضوئي",
                    subjectName = "العلوم",
                    gradeName = "الصف الثاني المتوسط",
                    summaryDraft = "يغطي هذا الملخص بالتفصيل عملية البناء الضوئي في الأوراق الخضراء التي تحتوي على مادة الكلوروفيل باستخدام الطاقة الشمسية والماء وثاني أكسيد الكربون لإنتاج الغذاء والأكسجين.",
                    questionsDraft = mutableListOf(
                        Question("q_rev_3", "تنتج النباتات غاز الأكسجين أثناء عملية البناء الضوئي بشكل رئيسي.", QuestionType.TF, listOf("صح", "خطأ"), "صح", "الخطوة الأولى: تذكر معادلة البناء الضوئي.\n\nالخطوة الثانية: الأكسجين هو ناتج ثانوي أساسي ينطلق في الجو.")
                    ),
                    rubricScore = 88,
                    rubricDetails = "جيد جداً - جودة المحتوى ممتازة ولكن الشروحات تحتاج تذكير بسيط بفوائد الضوء.",
                    isPremium = false
                )
            )
        )

        // Initialize upload jobs
        uploadJobs.addAll(
            listOf(
                UploadJob("up_1", "grade7-math-ch3.pdf", "PDF Book", "Completed", "الصف الأول المتوسط", "الرياضيات"),
                UploadJob("up_2", "science-photosynthesis.png", "Image Diagram", "Completed", "الصف الثاني المتوسط", "العلوم"),
                UploadJob("up_3", "arabic-grammar-notes.docx", "Text Document", "Pending Review", "الصف الثالث المتوسط", "اللغة العربية")
            )
        )

        // Initialize notification logs
        sentNotifications.addAll(
            listOf(
                NotificationDraft("not_1", "تحدي اليوم بالانتظار 🎯", "لا تنسَ حل تحدي اليوم للمحافظة على السلسلة!", "daily reminder", "2026-05-22 09:00"),
                NotificationDraft("not_2", "تهانينا! حصلت على شارة جديدة 🏆", "تهانينا بطلنا! لقد حصلت على شارة عبقري العلوم لتميزك الباهر في مادة العلوم.", "badge unlocked", "2026-05-21 18:30"),
                NotificationDraft("not_3", "مشاركات المنهج الدراسي 📚", "مستواك في العلوم يتحسن. ننصحك بإجراء مراجعة سريعة لحزمة الكيمياء.", "weak topic reminder", "2026-05-21 12:45"),
                NotificationDraft("not_4", "حافظ على سلسلتك اليومية 🔥", "حافظ على سلسلتك اليومية. يتبقى لك درس وتحدٍ واحد لليوم لتأمين التتابع الدائم!", "streak reminder", "2026-05-21 08:30"),
                NotificationDraft("not_5", "تحديث قائمة المتصدرين 📈", "تراجع ترتيبك للمركز الثالث في مادة الرياضيات! زملائك يتنافسون بقوة، عد لتصدر القائمة.", "leaderboard movement", "2026-05-20 15:40"),
                NotificationDraft("not_6", "ترقية الحساب المميز ⭐", "باقة الاشتراك الكامل متوفرة الآن لعائلتك! احصل على وصول غير محدود لجميع التمارين والمميزات الأكاديمية.", "premium reminder", "2026-05-19 11:00"),
                NotificationDraft("not_7", "إعلان هام من الإدارة 📣", "سيتم تحديث دروس المهارات الرقمية المضافة حديثاً للمرحلة المتوسطة غداً صباحاً.", "admin announcement", "2026-05-19 08:00")
            )
        )
    }

    fun getLearningPacks(subjectId: String): List<LearningPack> {
        return learningPacksMap[subjectId] ?: emptyList()
    }

    fun addSubject(subject: Subject) {
        subjects.add(subject)
    }

    fun addGrade(gradeName: String) {
        if (!grades.contains(gradeName)) {
            grades.add(gradeName)
        }
    }

    fun addLearningPack(subjectId: String, packName: String, description: String, isPremium: Boolean, isLocked: Boolean) {
        val currentPacks = learningPacksMap[subjectId] ?: mutableListOf()
        val newId = "${subjectId}_${currentPacks.size + 1}"
        val newPack = LearningPack(
            id = newId,
            subjectId = subjectId,
            title = packName,
            description = description,
            isLocked = isLocked,
            isPremium = isPremium,
            progress = 0,
            isCompleted = false
        )
        currentPacks.add(newPack)
        learningPacksMap[subjectId] = currentPacks

        // Update the total packs count on the subject itself
        val subjIdx = subjects.indexOfFirst { it.id == subjectId }
        if (subjIdx != -1) {
            val sub = subjects[subjIdx]
            subjects[subjIdx] = sub.copy(totalPacks = sub.totalPacks + 1)
        }
    }

    fun updateLearningPackLock(subjectId: String, packId: String, isPremium: Boolean, isLocked: Boolean) {
        val currentPacks = learningPacksMap[subjectId] ?: return
        val idx = currentPacks.indexOfFirst { it.id == packId }
        if (idx != -1) {
            val pack = currentPacks[idx]
            currentPacks[idx] = pack.copy(isPremium = isPremium, isLocked = isLocked)
        }
    }

    fun getSummary(packId: String): String {
        return summariesMap[packId] ?: "هذا هو الملخص التعليمي لهذه الحزمة الكريمة. تفاصيل شاملة ودقيقة للطلاب في المرحلة المتوسطة."
    }

    fun updateSummary(packId: String, summaryText: String) {
        summariesMap[packId] = summaryText
    }

    fun getQuestionsForPack(packId: String): List<Question> {
        val qList = questionsMap[packId]
        if (qList != null) return qList

        // Default list from old static implementation as a fallback
        val defaultList = mutableListOf(
            Question(
                id = "${packId}_q1",
                text = "اختر الإجابة الصحيحة: ناتج جمع 5 + 7 هو؟",
                type = QuestionType.MCQ,
                options = listOf("10", "11", "12", "13"),
                correctAnswer = "12",
                explanation = "الخطوة 1: الإجابة الصحيحة هي 12.\n\nالخطوة 2: السبب هو أننا نضيف العدد 5 إلى العدد 7 فنحصل على 12.\n\nالخطوة 3: مثال بسيط إذا جمعت 5 تفاحات مع 7 تفاحات سيصبح معك 12 تفاحة.\n\nنصيحة: تذكر أن التدريب المستمر يسهل عليك الجمع الذهني.",
                correctExplanation = "تأكيد: إجابة صحيحة رائعة!\n\nلماذا الإجابة صحيحة: لأن ناتج إضافة 5 إلى 7 يساوي 12.\n\nشرح مبسط: جمع 5 أشياء مع 7 أشياء يعطي 12.\n\nمعلومة إضافية: عملية الجمع في الرياضيات هي عملية تبادلية (5+7 هي نفسها 7+5)."
            ),
            Question(
                id = "${packId}_q2",
                text = "صح أم خطأ: الأرض تدور حول الشمس.",
                type = QuestionType.TF,
                options = listOf("صح", "خطأ"),
                correctAnswer = "صح",
                explanation = "الخطوة 1: الإجابة الصحيحة هي (صح).\n\nالخطوة 2: السبب هو أن الأرض كوكب يدور في مدار حول الشمس بفضل الجاذبية.\n\nالخطوة 3: مثال بسيط مثل دوران شيء مربوط بخيط حول يدك.\n\nنصيحة: تذكر أن الشمس نجم مركزي والكواكب تدور حولها.",
                correctExplanation = "تأكيد: لقد أصبت الهدف!\n\nلماذا الإجابة صحيحة: الأرض تدور حول الشمس في مدارها.\n\nشرح مبسط: الجاذبية الهائلة للشمس تجعل كوكب الأرض يدور حولها.\n\nمعلومة إضافية: تدور الأرض حول الشمس دورة كاملة كل 365 يوماً تقريباً لإنتاج الفصول الأربعة."
            ),
            Question(
                id = "${packId}_q3",
                text = "أكمل الفراغ: عاصمة المملكة العربية السعودية هي ___.",
                type = QuestionType.FIB,
                correctAnswer = "الرياض",
                explanation = "الخطوة 1: الإجابة الصحيحة هي الرياض.\n\nالخطوة 2: السبب هو أن الرياض مدينة مركزية وتضم الهيئات الحكومية الرئيسية.\n\nالخطوة 3: مثال بسيط كما أن باريس عاصمة فرنسا، الرياض هي العاصمة هنا.\n\nنصيحة: تذكر أن كلمة \"الرياض\" تعني المروج الخضراء والحدائق الجميلة.",
                correctExplanation = "تأكيد: إجابتك دقيقة وممتازة!\n\nلماذا الإجابة صحيحة: لأن الرياض هي العاصمة الرسمية والسياسية.\n\nشرح مبسط: الرياض هي المقر الرئيسي لاتخاذ القرار في المملكة.\n\nمعلومة إضافية: تقع مدينة الرياض في وسط شبه الجزيرة العربية وهي من أسرع المدن نمواً."
            ),
            Question(
                id = "${packId}_q4",
                text = "تفكير عليا: لماذا تعتبر الأشجار مهمة للبيئة؟",
                type = QuestionType.HOQ,
                options = listOf("تنتج الأكسجين وتستهلك ثاني أكسيد الكربون", "لأن لونها أخضر", "تعطينا الخشب فقط", "لا فائدة لها"),
                correctAnswer = "تنتج الأكسجين وتستهلك ثاني أكسيد الكربون",
                explanation = "الخطوة 1: الإجابة الصحيحة هي أنها تنتج الأكسجين وتستهلك ثاني أكسيد الكربون.\n\nالخطوة 2: السبب هو قيام الأشجار بعملية البناء الضوئي لتنقية الهواء.\n\nالخطوة 3: مثال بسيط تُسمى الغابات (رئتي كوكب الأرض).\n\nنصيحة: تذكر أن زراعة الأشجار ضرورية لمحاربة التلوث البيئي.",
                correctExplanation = "تأكيد: إجابة نموذجية، أحسنت!\n\nلماذا الإجابة صحيحة: لأن النباتات هي المصدر الأساسي لإنتاج الأكسجين.\n\nشرح مبسط: الأشجار تأخذ الغاز الضار (ثاني أكسيد الكربون) لتعطينا الهواء النقي للعيش.\n\nمعلومة إضافية: شجرة واحدة قادرة على تنظيف كميات كبيرة من الهواء الملوث بفضل التبادل الغازي الدائم."
            )
        )
        questionsMap[packId] = defaultList
        return defaultList
    }

    fun addQuestionToPack(packId: String, question: Question) {
        val currentQs = questionsMap[packId] ?: mutableListOf()
        currentQs.add(question)
        questionsMap[packId] = currentQs
    }

    fun editQuestionInPack(packId: String, questionId: String, updatedQ: Question) {
        val currentQs = questionsMap[packId] ?: return
        val idx = currentQs.indexOfFirst { it.id == questionId }
        if (idx != -1) {
            currentQs[idx] = updatedQ
        }
    }

    fun addUploadJob(job: UploadJob) {
        uploadJobs.add(job)
    }

    fun approveReviewTask(taskId: String) {
        val idx = reviewTasks.indexOfFirst { it.id == taskId }
        if (idx != -1) {
            val task = reviewTasks[idx]
            task.status = "Approved"

            // Look up the actual matching subject by Arabic name
            val matchedSubject = subjects.find { it.name.trim() == task.subjectName.trim() }
            val subjectId = matchedSubject?.id ?: "1"

            // On approval, we inject the generated draft as a real Learning Pack
            addLearningPack(
                subjectId = subjectId,
                packName = task.packTitle,
                description = if (task.isPremium) "حزمة متميزة من المحتوى المولد بالذكاء الاصطناعي." else "حزمة تجريبية مجانية لجميع الطلاب.",
                isPremium = task.isPremium,
                isLocked = task.isPremium
            )

            val newlyCreatedPacks = getLearningPacks(subjectId)
            if (newlyCreatedPacks.isNotEmpty()) {
                val newPackId = newlyCreatedPacks.last().id
                updateSummary(newPackId, task.summaryDraft)
                task.questionsDraft.forEach { q ->
                    addQuestionToPack(newPackId, q.copy(id = "${newPackId}_${q.id.substringAfter("_")}"))
                }
            }
        }
    }

    fun sendNotification(notif: NotificationDraft) {
        sentNotifications.add(notif)
    }
}

// Custom Extension to make Compose tracking super simple
private fun <T> mutableStateListOf(vararg elements: T): androidx.compose.runtime.snapshots.SnapshotStateList<T> {
    val list = androidx.compose.runtime.mutableStateListOf<T>()
    list.addAll(elements)
    return list
}
