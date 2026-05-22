package com.example.ui.screens.student.quiz

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.data.backend.BackendService
import com.example.domain.GamificationManager
import com.example.domain.models.Question
import com.example.domain.models.QuestionType

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun QuizScreen(packId: String, filterType: String, navController: NavController) {
    val questions = remember { mutableStateListOf<Question>() }
    var isLoadingQuestions by remember { mutableStateOf(true) }
    var currentQuestionIndex by remember { mutableStateOf(0) }
    var selectedAnswer by remember { mutableStateOf<String?>(null) }
    var fibAnswer by remember { mutableStateOf("") }
    var isAnswerEvaluated by remember { mutableStateOf(false) }
    val userAnswers = remember { mutableMapOf<String, String>() }
    var showXPAnimation by remember { mutableStateOf(false) }
    var floatingXPText by remember { mutableStateOf("") }

    LaunchedEffect(packId, filterType) {
        isLoadingQuestions = true
        val list = BackendService.fetchQuestions(packId)
        val filtered = if (filterType == "all") {
            list
        } else {
            list.filter { q ->
                when (filterType.lowercase()) {
                    "mcq" -> q.type == QuestionType.MCQ
                    "fib" -> q.type == QuestionType.FIB
                    "tf" -> q.type == QuestionType.TF
                    "hoq" -> q.type == QuestionType.HOQ
                    else -> true
                }
            }
        }
        questions.clear()
        questions.addAll(filtered)
        isLoadingQuestions = false
    }

    if (isLoadingQuestions) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(14.dp)) {
                CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
                Text("جاري تجهيز الاختبار...", fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
        return
    }

    if (questions.isEmpty()) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
                .padding(24.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "لا توجد أسئلة لهذه الحزمة في الوقت الحالي.",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center
            )
        }
        return
    }

    LaunchedEffect(currentQuestionIndex) {
        if (currentQuestionIndex >= questions.size) {
            var correctCount = 0
            questions.forEach { q ->
                if (userAnswers[q.id] == q.correctAnswer) correctCount++
            }
            var xpEarned = correctCount * 2
            val accuracy = if (questions.isNotEmpty()) (correctCount.toFloat() / questions.size) * 100 else 0f
            xpEarned += 10
            if (accuracy >= 80f) xpEarned += 15
            xpEarned += 25

            GamificationManager.addXP(xpEarned - (correctCount * 2))
            GamificationManager.addCoins(xpEarned / 2)

            BackendService.submitQuizAttempt("user_dummy_789", packId, correctCount, questions.size, accuracy.toInt(), xpEarned)
            BackendService.submitXpLog("user_dummy_789", "quiz_completion", xpEarned)

            navController.navigate("quiz_result/${correctCount}/${questions.size}/${xpEarned}") {
                popUpTo("learning_pack_detail/$packId") { inclusive = false }
            }
        }
    }

    val displayIndex = if (currentQuestionIndex >= questions.size) questions.size - 1 else currentQuestionIndex
    val question = questions[displayIndex]
    val progress = (currentQuestionIndex + 1).toFloat() / questions.size
    val selectedOrTyped = selectedAnswer != null || fibAnswer.isNotEmpty()

    Box(modifier = Modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
        ) {
            TopAppBar(
                title = {
                    Column(verticalArrangement = Arrangement.spacedBy(5.dp), modifier = Modifier.padding(end = 16.dp)) {
                        Text(
                            text = quizTypeLabel(filterType),
                            fontSize = 13.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = MaterialTheme.colorScheme.primary
                        )
                        LinearProgressIndicator(
                            progress = { progress },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(8.dp)
                                .clip(RoundedCornerShape(50)),
                            color = MaterialTheme.colorScheme.primary,
                            trackColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.75f)
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(imageVector = Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "إنهاء")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background)
            )

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 16.dp, vertical = 10.dp),
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    QuizQuestionHero(
                        index = currentQuestionIndex + 1,
                        total = questions.size,
                        questionType = question.type,
                        questionText = question.text
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    when (question.type) {
                        QuestionType.MCQ, QuestionType.TF, QuestionType.HOQ -> {
                            question.options.forEachIndexed { optionIndex, option ->
                                QuizOptionCard(
                                    option = option,
                                    optionLabel = optionLetter(optionIndex),
                                    isSelected = selectedAnswer == option,
                                    isCorrect = option == question.correctAnswer,
                                    isAnswerEvaluated = isAnswerEvaluated,
                                    onClick = { selectedAnswer = option }
                                )
                            }
                        }
                        QuestionType.FIB -> {
                            OutlinedTextField(
                                value = fibAnswer,
                                onValueChange = { if (!isAnswerEvaluated) fibAnswer = it },
                                modifier = Modifier.fillMaxWidth(),
                                placeholder = { Text("اكتب الإجابة هنا...") },
                                enabled = !isAnswerEvaluated,
                                shape = RoundedCornerShape(18.dp),
                                singleLine = true,
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = if (isAnswerEvaluated && fibAnswer == question.correctAnswer) Color(0xFF16A34A)
                                    else if (isAnswerEvaluated) Color(0xFFDC2626)
                                    else MaterialTheme.colorScheme.primary,
                                    unfocusedBorderColor = if (isAnswerEvaluated && fibAnswer == question.correctAnswer) Color(0xFF16A34A)
                                    else if (isAnswerEvaluated) Color(0xFFDC2626)
                                    else MaterialTheme.colorScheme.outlineVariant
                                )
                            )
                        }
                    }

                    AnimatedVisibility(visible = isAnswerEvaluated) {
                        QuizFeedbackCard(question = question, selectedAnswer = selectedAnswer, fibAnswer = fibAnswer)
                    }
                }

                Button(
                    onClick = {
                        if (isAnswerEvaluated) {
                            currentQuestionIndex++
                            isAnswerEvaluated = false
                            selectedAnswer = null
                            fibAnswer = ""
                            showXPAnimation = false
                        } else {
                            val ans = if (question.type == QuestionType.FIB) fibAnswer else selectedAnswer ?: ""
                            if (ans.isNotEmpty()) {
                                userAnswers[question.id] = ans
                                isAnswerEvaluated = true
                                val isCorrect = ans == question.correctAnswer
                                if (isCorrect) {
                                    GamificationManager.addXP(2)
                                    GamificationManager.addCoins(1)
                                    val isCombo = GamificationManager.incrementCombo()
                                    floatingXPText = if (isCombo) "+12 XP كومبو!" else "+2 XP"
                                    showXPAnimation = true
                                } else {
                                    GamificationManager.resetCombo()
                                }
                            }
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(58.dp),
                    enabled = selectedOrTyped,
                    shape = RoundedCornerShape(18.dp)
                ) {
                    Text(
                        text = if (isAnswerEvaluated) {
                            if (currentQuestionIndex == questions.size - 1) "إنهاء الاختبار" else "السؤال التالي"
                        } else {
                            "تحقق من الإجابة"
                        },
                        fontSize = 17.sp,
                        fontWeight = FontWeight.ExtraBold
                    )
                }
            }
        }

        if (showXPAnimation) {
            var offsetY by remember { mutableStateOf(0f) }
            var alpha by remember { mutableStateOf(1f) }

            LaunchedEffect(Unit) {
                androidx.compose.animation.core.animate(
                    initialValue = 0f,
                    targetValue = 1f,
                    animationSpec = androidx.compose.animation.core.tween(1500)
                ) { value, _ ->
                    offsetY = -150f * value
                    alpha = 1f - value
                }
                showXPAnimation = false
            }

            Text(
                text = floatingXPText,
                color = Color(0xFFF59E0B).copy(alpha = alpha),
                fontSize = 28.sp,
                fontWeight = FontWeight.ExtraBold,
                modifier = Modifier
                    .align(Alignment.Center)
                    .offset(y = offsetY.dp)
                    .padding(bottom = 100.dp)
            )
        }
    }
}

@Composable
private fun QuizQuestionHero(index: Int, total: Int, questionType: QuestionType, questionText: String) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(28.dp))
            .background(
                Brush.linearGradient(
                    listOf(
                        MaterialTheme.colorScheme.primaryContainer,
                        MaterialTheme.colorScheme.primary.copy(alpha = 0.14f)
                    )
                )
            )
            .padding(18.dp)
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Surface(shape = RoundedCornerShape(15.dp), color = Color.White.copy(alpha = 0.55f)) {
                    Text(
                        text = "السؤال $index من $total",
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 7.dp),
                        fontSize = 12.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
                Surface(shape = CircleShape, color = Color.White.copy(alpha = 0.50f)) {
                    Text(
                        text = questionTypeIcon(questionType),
                        modifier = Modifier.padding(12.dp),
                        fontSize = 23.sp
                    )
                }
            }

            Text(
                text = questionText,
                fontSize = 21.sp,
                fontWeight = FontWeight.ExtraBold,
                color = MaterialTheme.colorScheme.onPrimaryContainer,
                lineHeight = 30.sp
            )
        }
    }
}

@Composable
private fun QuizOptionCard(
    option: String,
    optionLabel: String,
    isSelected: Boolean,
    isCorrect: Boolean,
    isAnswerEvaluated: Boolean,
    onClick: () -> Unit
) {
    val bgColor = when {
        isAnswerEvaluated && isCorrect -> Color(0xFFDCFCE7)
        isAnswerEvaluated && isSelected -> Color(0xFFFEE2E2)
        isSelected -> MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.75f)
        else -> MaterialTheme.colorScheme.surface
    }
    val borderColor = when {
        isAnswerEvaluated && isCorrect -> Color(0xFF16A34A)
        isAnswerEvaluated && isSelected -> Color(0xFFDC2626)
        isSelected -> MaterialTheme.colorScheme.primary
        else -> MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.60f)
    }
    val textColor = when {
        isAnswerEvaluated && isCorrect -> Color(0xFF15803D)
        isAnswerEvaluated && isSelected -> Color(0xFFDC2626)
        else -> MaterialTheme.colorScheme.onBackground
    }

    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 7.dp)
            .clickable(enabled = !isAnswerEvaluated, onClick = onClick),
        shape = RoundedCornerShape(20.dp),
        color = bgColor,
        tonalElevation = if (isSelected) 2.dp else 0.dp,
        border = androidx.compose.foundation.BorderStroke(1.5.dp, borderColor)
    ) {
        Row(
            modifier = Modifier.padding(15.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(34.dp)
                    .clip(CircleShape)
                    .background(if (isSelected || isCorrect) Color.White.copy(alpha = 0.7f) else MaterialTheme.colorScheme.surfaceVariant),
                contentAlignment = Alignment.Center
            ) {
                Text(optionLabel, fontSize = 13.sp, fontWeight = FontWeight.ExtraBold, color = textColor)
            }
            Text(
                text = option,
                fontSize = 16.sp,
                modifier = Modifier.weight(1f),
                color = textColor,
                fontWeight = FontWeight.Bold,
                lineHeight = 22.sp
            )
            if (isAnswerEvaluated) {
                if (isCorrect) Text("✓", color = Color(0xFF16A34A), fontWeight = FontWeight.ExtraBold, fontSize = 20.sp)
                else if (isSelected) Text("✗", color = Color(0xFFDC2626), fontWeight = FontWeight.ExtraBold, fontSize = 20.sp)
            }
        }
    }
}

@Composable
private fun QuizFeedbackCard(question: Question, selectedAnswer: String?, fibAnswer: String) {
    val isCorrect = if (question.type == QuestionType.FIB) fibAnswer == question.correctAnswer else selectedAnswer == question.correctAnswer
    Column(modifier = Modifier.padding(top = 18.dp).fillMaxWidth()) {
        Surface(
            shape = RoundedCornerShape(22.dp),
            color = if (isCorrect) Color(0xFFDCFCE7) else Color(0xFFFFF1F2),
            border = androidx.compose.foundation.BorderStroke(1.dp, if (isCorrect) Color(0xFF86EFAC) else Color(0xFFFCA5A5))
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text(
                    text = if (isCorrect) "إجابة صحيحة! 🎉" else "إجابة تحتاج مراجعة",
                    color = if (isCorrect) Color(0xFF15803D) else Color(0xFFDC2626),
                    fontWeight = FontWeight.ExtraBold,
                    fontSize = 17.sp
                )
                Text(
                    text = if (isCorrect) question.correctExplanation else question.explanation,
                    fontSize = 13.5.sp,
                    color = MaterialTheme.colorScheme.onSurface,
                    fontWeight = FontWeight.SemiBold,
                    lineHeight = 20.sp
                )
                if (!isCorrect) {
                    Surface(shape = RoundedCornerShape(12.dp), color = Color.White.copy(alpha = 0.70f)) {
                        Text(
                            text = "الإجابة الصحيحة: ${question.correctAnswer}",
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp),
                            color = Color(0xFF15803D),
                            fontSize = 13.sp,
                            fontWeight = FontWeight.ExtraBold
                        )
                    }
                }
            }
        }
    }
}

private fun quizTypeLabel(filterType: String): String {
    return when (filterType.lowercase()) {
        "mcq" -> "اختبار MCQ"
        "fib" -> "إكمال الفراغات"
        "tf" -> "صح أو خطأ"
        "hoq" -> "تفكير عليا"
        else -> "اختبار شامل"
    }
}

private fun questionTypeIcon(type: QuestionType): String {
    return when (type) {
        QuestionType.MCQ -> "❓"
        QuestionType.FIB -> "✏️"
        QuestionType.TF -> "✔️"
        QuestionType.HOQ -> "🧠"
    }
}

private fun optionLetter(index: Int): String {
    return listOf("أ", "ب", "ج", "د", "هـ").getOrElse(index) { "${index + 1}" }
}
