package com.example.domain.models

enum class QuestionType {
    MCQ,
    FIB,
    TF,
    HOQ
}

data class Question(
    val id: String,
    val text: String,
    val type: QuestionType,
    val options: List<String> = emptyList(),
    val correctAnswer: String,
    val explanation: String,
    val correctExplanation: String = ""
)

data class QuizSession(
    val questions: List<Question>,
    val userAnswers: MutableMap<String, String> = mutableMapOf(),
    var currentQuestionIndex: Int = 0,
    var isFinished: Boolean = false
)
