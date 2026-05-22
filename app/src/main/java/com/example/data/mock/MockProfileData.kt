package com.example.data.mock

import com.example.domain.models.AnalyticsData
import com.example.domain.models.LeaderboardEntry
import com.example.domain.models.UserProfile

object MockProfileData {
    var currentUserProfile = UserProfile(
        id = "user_123",
        name = "أحمد خالد",
        grade = "الصف الثاني المتوسط",
        avatar = "👦",
        subscriptionStatus = "مجاني", // "Free" vs "Premium"
        studyTimeHours = 12,
        masteryPercentage = 75,
        completedPacks = 8
    )

    val currentAnalytics = AnalyticsData(
        overallAccuracy = 82,
        weakTopics = listOf("المعادلات الخطية", "الخلية النباتية"),
        completedLearningPacks = 8,
        studyTimeHours = 12,
        isPremium = false,
        recommendations = listOf("مراجعة درس المعادلات", "اختبار قصير في العلوم")
    )

    val weeklyLeaderboard = listOf(
        LeaderboardEntry(1, "u_456", "سارة محمد", "👧", 4500, 95, 14),
        LeaderboardEntry(2, "user_123", "أحمد خالد", "👦", 3200, 82, 5, true),
        LeaderboardEntry(3, "u_789", "عمر فهد", "👨", 2800, 78, 3),
        LeaderboardEntry(4, "u_101", "نورة سعود", "👩", 2100, 88, 7),
        LeaderboardEntry(5, "u_102", "ياسر علي", "👱", 1950, 70, 2)
    )
}
