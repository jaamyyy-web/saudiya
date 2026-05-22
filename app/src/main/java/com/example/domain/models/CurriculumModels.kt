package com.example.domain.models

data class Subject(
    val id: String,
    val name: String,
    val icon: String,
    val progress: Int,
    val masteryLevel: String,
    val completedPacks: Int,
    val totalPacks: Int
)

data class LearningPack(
    val id: String,
    val subjectId: String,
    val title: String,
    val description: String,
    val isLocked: Boolean,
    val isPremium: Boolean = false,
    val progress: Int,
    val isCompleted: Boolean,
    val isFree: Boolean = true,
    val premiumLocked: Boolean = false,
    val subscriptionRequired: Boolean = false
)
