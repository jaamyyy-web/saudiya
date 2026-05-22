package com.example.ui.screens.student.quiz

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.data.backend.BackendService
import com.example.domain.models.Question
import com.example.domain.models.QuestionType
import com.example.domain.models.QuizSession

import com.example.domain.GamificationManager

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
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator()
        }
        return
    }

    if (questions.isEmpty()) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("لا توجد أسئلة لهذه الحزمة في الوقت الحالي.")
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
            xpEarned += 10 // Quiz completion bonus
            if (accuracy >= 80f) xpEarned += 15 // Score above 80% bonus
            xpEarned += 25 // Learning Pack Completion
            
            GamificationManager.addXP(xpEarned - (correctCount * 2)) // Add remaining bonuses
            GamificationManager.addCoins(xpEarned / 2) // Bonus coins
            
            // Post achievements to backend
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

    Box(modifier = Modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
        ) {
            TopAppBar(
                title = {
                    LinearProgressIndicator(
                        progress = { progress },
                        modifier = Modifier.fillMaxWidth().height(8.dp).padding(end = 16.dp),
                        color = MaterialTheme.colorScheme.primary,
                        trackColor = MaterialTheme.colorScheme.surfaceVariant
                    )
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
                    .padding(16.dp),
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "السؤال ${currentQuestionIndex + 1} من ${questions.size}",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        fontSize = 14.sp
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = question.text,
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Spacer(modifier = Modifier.height(32.dp))

                    when (question.type) {
                        QuestionType.MCQ, QuestionType.TF, QuestionType.HOQ -> {
                            question.options.forEach { option ->
                                val isSelected = selectedAnswer == option
                                val isCorrect = option == question.correctAnswer
                                
                                val bgColor = if (isAnswerEvaluated) {
                                    if (isCorrect) Color(0xFFDCFCE7) // Valid Green
                                    else if (isSelected) Color(0xFFFEE2E2) // Error Red
                                    else MaterialTheme.colorScheme.surface
                                } else if (isSelected) {
                                    MaterialTheme.colorScheme.primaryContainer
                                } else {
                                    MaterialTheme.colorScheme.surface
                                }

                                val borderColor = if (isAnswerEvaluated) {
                                    if (isCorrect) Color(0xFF16A34A)
                                    else if (isSelected) Color(0xFFDC2626)
                                    else MaterialTheme.colorScheme.outline.copy(alpha = 0.5f)
                                } else if (isSelected) {
                                    MaterialTheme.colorScheme.primary
                                } else {
                                    MaterialTheme.colorScheme.outline.copy(alpha = 0.5f)
                                }

                                Card(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(vertical = 8.dp)
                                        .border(2.dp, borderColor, RoundedCornerShape(12.dp))
                                        .clickable(enabled = !isAnswerEvaluated) {
                                            selectedAnswer = option
                                        },
                                    colors = CardDefaults.cardColors(containerColor = bgColor),
                                    shape = RoundedCornerShape(12.dp)
                                ) {
                                    Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                                        Text(
                                            text = option,
                                            fontSize = 18.sp,
                                            modifier = Modifier.weight(1f),
                                            color = if (isAnswerEvaluated && isCorrect) Color(0xFF16A34A)
                                                    else if (isAnswerEvaluated && isSelected) Color(0xFFDC2626)
                                                    else MaterialTheme.colorScheme.onBackground
                                        )
                                        if (isAnswerEvaluated) {
                                            if (isCorrect) {
                                                Text("✓", color = Color(0xFF16A34A), fontWeight = FontWeight.Bold)
                                            } else if (isSelected) {
                                                Text("✗", color = Color(0xFFDC2626), fontWeight = FontWeight.Bold)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        QuestionType.FIB -> {
                            OutlinedTextField(
                                value = fibAnswer,
                                onValueChange = { if (!isAnswerEvaluated) fibAnswer = it },
                                modifier = Modifier.fillMaxWidth(),
                                placeholder = { Text("اكتب الإجابة هنا...") },
                                enabled = !isAnswerEvaluated,
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = if (isAnswerEvaluated && fibAnswer == question.correctAnswer) Color(0xFF16A34A)
                                                        else if (isAnswerEvaluated) Color(0xFFDC2626)
                                                        else MaterialTheme.colorScheme.primary,
                                    unfocusedBorderColor = if (isAnswerEvaluated && fibAnswer == question.correctAnswer) Color(0xFF16A34A)
                                                        else if (isAnswerEvaluated) Color(0xFFDC2626)
                                                        else MaterialTheme.colorScheme.outline
                                )
                            )
                        }
                    }
                    
                    AnimatedVisibility(visible = isAnswerEvaluated) {
                        Column(modifier = Modifier.padding(top = 24.dp).fillMaxWidth()) {
                            val isCorrect = if (question.type == QuestionType.FIB) fibAnswer == question.correctAnswer else selectedAnswer == question.correctAnswer
                            Text(
                                text = if (isCorrect) "إجابة صحيحة! 🎉" else "إجابة خاطئة",
                                color = if (isCorrect) Color(0xFF16A34A) else Color(0xFFDC2626),
                                fontWeight = FontWeight.Bold,
                                fontSize = 18.sp
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Card(
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Column(modifier = Modifier.padding(16.dp)) {
                                    if (isCorrect) {
                                        val correctTextParts = question.correctExplanation.split("\n\n")
                                        correctTextParts.forEachIndexed { index, part ->
                                            if (part.isNotBlank()) {
                                                val title = part.substringBefore(":")
                                                val content = part.substringAfter(":", "").trim()
                                                
                                                Text(
                                                    text = title + (if (content.isNotEmpty()) ":" else ""),
                                                    fontWeight = FontWeight.Bold,
                                                    fontSize = 14.sp,
                                                    color = if (index == 0) Color(0xFF16A34A) else MaterialTheme.colorScheme.onSurface
                                                )
                                                if (content.isNotEmpty()) {
                                                    Spacer(modifier = Modifier.height(2.dp))
                                                    Text(text = content, fontSize = 14.sp)
                                                }
                                                if (index < correctTextParts.size - 1) {
                                                    Spacer(modifier = Modifier.height(12.dp))
                                                }
                                            }
                                        }
                                    } else {
                                        val ans = if (question.type == QuestionType.FIB) fibAnswer else selectedAnswer ?: ""
                                        Text(text = "الإجابة التي اخترتها:", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                        Spacer(modifier = Modifier.height(2.dp))
                                        Text(text = ans.ifEmpty { "لم تُدخل إجابة" }, color = Color(0xFFDC2626), fontSize = 14.sp)
                                        Spacer(modifier = Modifier.height(12.dp))
                                        
                                        Text(text = "لماذا هذه الإجابة غير صحيحة:", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                        Spacer(modifier = Modifier.height(2.dp))
                                        Text(text = "الإجابة المختارة لا تتوافق مع القواعد والمعطيات للسؤال.", fontSize = 14.sp)
                                        Spacer(modifier = Modifier.height(12.dp))
                                        
                                        HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f))
                                        Spacer(modifier = Modifier.height(12.dp))
                                        
                                        val wrongTextParts = question.explanation.split("\n\n")
                                        wrongTextParts.forEachIndexed { index, part ->
                                            if (part.isNotBlank()) {
                                                val title = part.substringBefore(":")
                                                val content = part.substringAfter(":", "").trim()
                                                
                                                Text(
                                                    text = title + (if (content.isNotEmpty()) ":" else ""),
                                                    fontWeight = FontWeight.Bold,
                                                    fontSize = 14.sp
                                                )
                                                if (content.isNotEmpty()) {
                                                    Spacer(modifier = Modifier.height(2.dp))
                                                    Text(text = content, fontSize = 14.sp)
                                                }
                                                if (index < wrongTextParts.size - 1) {
                                                    Spacer(modifier = Modifier.height(12.dp))
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
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
                                val isCorrect = if (question.type == QuestionType.FIB) ans == question.correctAnswer else ans == question.correctAnswer
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
                    modifier = Modifier.fillMaxWidth().height(56.dp),
                    enabled = selectedAnswer != null || fibAnswer.isNotEmpty()
                ) {
                    Text(
                        text = if (isAnswerEvaluated) (if (currentQuestionIndex == questions.size - 1) "إنهاء الاختبار" else "السؤال التالي") else "تحقق من الإجابة",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold
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
                color = Color(0xFFF59E0B),
                fontSize = 28.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier
                    .align(Alignment.Center)
                    .offset(y = offsetY.dp)
                    .padding(bottom = 100.dp)
            )
        }
    }
}
