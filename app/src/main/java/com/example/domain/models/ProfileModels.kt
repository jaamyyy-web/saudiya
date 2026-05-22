package com.example.domain.models

data class UserProfile(
    val id: String,
    val name: String,
    val grade: String,
    val avatar: String,
    val subscriptionStatus: String,
    val studyTimeHours: Int,
    val masteryPercentage: Int,
    val completedPacks: Int,
    val schoolName: String = ""
)

data class AnalyticsData(
    val overallAccuracy: Int,
    val weakTopics: List<String>,
    val completedLearningPacks: Int,
    val studyTimeHours: Int,
    val isPremium: Boolean,
    val recommendations: List<String>
)

data class LeaderboardEntry(
    val rank: Int,
    val userId: String,
    val name: String,
    val avatar: String,
    val xp: Int,
    val accuracy: Int,
    val streak: Int,
    val isCurrentUser: Boolean = false
)
