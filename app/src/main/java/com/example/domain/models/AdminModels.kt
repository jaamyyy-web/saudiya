package com.example.domain.models

data class UploadJob(
    val id: String,
    val fileName: String,
    val fileType: String,
    val status: String, // "Processing" | "Pending Review" | "Completed"
    val grade: String,
    val subject: String
)

data class ReviewTask(
    val id: String,
    val packId: String,
    val packTitle: String,
    val subjectName: String,
    val gradeName: String = "الصف الثاني المتوسط",
    var summaryDraft: String,
    val questionsDraft: MutableList<Question>,
    var status: String = "Pending", // "Pending" | "Approved" | "Rejected" | "Regenerated"
    var rubricScore: Int = 90,
    var rubricDetails: String = "ممتاز - صياغات عربية متوافقة بالكامل مع لغة الطلاب وسنهم.",
    var isPremium: Boolean = true
)

data class AdminAnalytics(
    val activeUsersCount: Int,
    val premiumUsersCount: Int,
    val uploadJobsCount: Int,
    val conversionRate: String,
    val popularSubject: String
)

data class NotificationDraft(
    val id: String,
    val title: String,
    val body: String,
    val type: String,
    val sentAt: String
)
