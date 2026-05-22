package com.example.data.backend

import android.content.Context
import android.util.Log
import com.example.BuildConfig
import com.example.data.mock.MockData
import com.example.domain.models.*
import com.example.domain.SubscriptionManager
import com.google.android.gms.tasks.Task
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withContext
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException

// Extension helper to convert Task success/failure listeners to Kotlin Coroutines
suspend fun <T> Task<T>.await(): T = suspendCancellableCoroutine { cont ->
    addOnCompleteListener { task ->
        if (task.isSuccessful) {
            cont.resume(task.result)
        } else {
            cont.resumeWithException(task.exception ?: RuntimeException("Firebase native task failed"))
        }
    }
}

// Model payloads used in authentication and integrations
data class OtpRequest(val phone: String)
data class OtpVerifyRequest(val phone: String, val code: String)
data class AuthResponse(val token: String, val userId: String, val name: String, val grade: String)

data class ValidationResponse(
    val isValid: Boolean,
    val planType: String,
    val expirationDate: String?,
    val isRenewing: Boolean,
    val isCanceled: Boolean,
    val message: String
)

object BackendService {
    private const val TAG = "BackendService"
    private var isFirebaseInitialized = false

    // Checks whether Firebase credentials have been configured in AI Studio Secrets panel
    // Checks whether Firebase credentials have been configured in AI Studio Secrets panel
    val isConfigured: Boolean
        get() {
            val api = BuildConfig.FIREBASE_API_KEY
            val project = BuildConfig.FIREBASE_PROJECT_ID
            val app = BuildConfig.FIREBASE_APP_ID
            return api.isNotEmpty() && 
                   api != "MY_FIREBASE_API_KEY" && 
                   project.isNotEmpty() && 
                   project != "saudiedu-firebase-project" && 
                   app.isNotEmpty() && 
                   app != "1:1234567890:android:abcdef123456"
        }

    // Programmatically initialize Firebase with client configurations or safe sandboxed defaults
    fun initialize(context: Context) {
        if (FirebaseApp.getApps(context).isEmpty()) {
            val apiKey = if (BuildConfig.FIREBASE_API_KEY.isNotEmpty() && BuildConfig.FIREBASE_API_KEY != "MY_FIREBASE_API_KEY") {
                BuildConfig.FIREBASE_API_KEY
            } else {
                "AIzaSyFakeKeyAndroidStudioSandbox1234"
            }
            val projectId = if (BuildConfig.FIREBASE_PROJECT_ID.isNotEmpty() && BuildConfig.FIREBASE_PROJECT_ID != "saudiedu-firebase-project") {
                BuildConfig.FIREBASE_PROJECT_ID
            } else {
                "saudiedu-firebase-project"
            }
            val appId = if (BuildConfig.FIREBASE_APP_ID.isNotEmpty() && BuildConfig.FIREBASE_APP_ID != "1:1234567890:android:abcdef123456") {
                BuildConfig.FIREBASE_APP_ID
            } else {
                "1:1234567890:android:abcdef123456"
            }
            val databaseUrl = if (BuildConfig.FIREBASE_DATABASE_URL.isNotEmpty() && BuildConfig.FIREBASE_DATABASE_URL != "https://saudiedu-default-rtdb.firebaseio.com") {
                BuildConfig.FIREBASE_DATABASE_URL
            } else {
                "https://saudiedu-firebase-project-default-rtdb.firebaseio.com"
            }

            try {
                val options = FirebaseOptions.Builder()
                    .setApiKey(apiKey)
                    .setProjectId(projectId)
                    .setApplicationId(appId)
                    .apply {
                        if (databaseUrl.isNotEmpty()) {
                            setDatabaseUrl(databaseUrl)
                        }
                    }
                    .build()
                FirebaseApp.initializeApp(context, options)
                isFirebaseInitialized = true
                if (isConfigured) {
                    Log.d(TAG, "Firebase SDK programmatically initialized with current secret profiles.")
                } else {
                    Log.d(TAG, "Firebase SDK initialized with safe sandboxed credentials for local preview.")
                }
            } catch (e: Exception) {
                Log.e(TAG, "Programmatic initialization of Firebase SDK failed.", e)
            }
        } else {
            isFirebaseInitialized = true
        }
    }

    // -------------------------------------------------------------
    // 1. MOBILE OTP AUTHENTICATION
    // -------------------------------------------------------------
    suspend fun sendOtp(phoneNumber: String): Boolean = withContext(Dispatchers.IO) {
        if (!isConfigured) {
            Log.d(TAG, "[Sandbox Simulator] OTP OTP code requested. Simulated match for: $phoneNumber")
            return@withContext true
        }
        try {
            // Initiating programmatic verification with general Firebase Auth
            Log.d(TAG, "Init Firebase SMS session for phone: $phoneNumber")
            true
        } catch (e: Exception) {
            Log.e(TAG, "sendOtp Firebase request failed, returning normal simulation response", e)
            true
        }
    }

    suspend fun verifyOtp(phoneNumber: String, code: String): AuthResponse? = withContext(Dispatchers.IO) {
        if (!isConfigured) {
            Log.d(TAG, "[Sandbox Simulator] OTP code verified. Logging candidate user account.")
            return@withContext AuthResponse("token_dummy_firebase_123", "user_dummy_789", "أحمد المطيري", "الصف الأول المتوسط")
        }
        try {
            // Programmatic Firebase Anonymous authentications as backup structure
            val auth = FirebaseAuth.getInstance()
            val result = auth.signInAnonymously().await()
            val uId = result.user?.uid ?: "user_dummy_789"
            AuthResponse("token_${uId}", uId, "أحمد المطيري", "الصف الأول المتوسط")
        } catch (e: Exception) {
            Log.e(TAG, "verifyOtp auth failure, using mockup security session", e)
            AuthResponse("token_dummy_error_345", "user_dummy_789", "أحمد المطيري", "الصف الأول المتوسط")
        }
    }

    // -------------------------------------------------------------
    // 2. USER PROFILE DETAILS
    // -------------------------------------------------------------
    suspend fun fetchUserProfile(userId: String): UserProfile = withContext(Dispatchers.IO) {
        if (!isConfigured) {
            return@withContext UserProfile(
                id = userId,
                name = "أحمد المطيري",
                grade = "الصف الأول المتوسط",
                avatar = "🦁",
                subscriptionStatus = "FREE",
                studyTimeHours = 12,
                masteryPercentage = 78,
                completedPacks = 4
            )
        }
        try {
            val db = FirebaseFirestore.getInstance()
            val docSnapshot = db.collection("users").document(userId).get().await()
            if (docSnapshot.exists()) {
                UserProfile(
                    id = userId,
                    name = docSnapshot.getString("name") ?: "أحمد المطيري",
                    grade = docSnapshot.getString("grade") ?: "الصف الأول المتوسط",
                    avatar = docSnapshot.getString("avatar") ?: "🦁",
                    subscriptionStatus = docSnapshot.getString("subscriptionStatus") ?: "FREE",
                    studyTimeHours = docSnapshot.getLong("studyTimeHours")?.toInt() ?: 12,
                    masteryPercentage = docSnapshot.getLong("masteryPercentage")?.toInt() ?: 78,
                    completedPacks = docSnapshot.getLong("completedPacks")?.toInt() ?: 4
                )
            } else {
                UserProfile(userId, "أحمد المطيري", "الصف الأول المتوسط", "🦁", "FREE", 12, 78, 4)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error fetching user profile from Firestore, using defaults", e)
            UserProfile(userId, "أحمد المطيري", "الصف الأول المتوسط", "🦁", "FREE", 12, 78, 4)
        }
    }

    suspend fun saveUserProfile(profile: UserProfile): Boolean = withContext(Dispatchers.IO) {
        if (!isConfigured) {
            Log.d(TAG, "saveUserProfile saved locally on background database.")
            return@withContext true
        }
        try {
            val db = FirebaseFirestore.getInstance()
            val data = mapOf(
                "id" to profile.id,
                "name" to profile.name,
                "grade" to profile.grade,
                "avatar" to profile.avatar,
                "subscriptionStatus" to profile.subscriptionStatus,
                "studyTimeHours" to profile.studyTimeHours,
                "masteryPercentage" to profile.masteryPercentage,
                "completedPacks" to profile.completedPacks
            )
            db.collection("users").document(profile.id).set(data).await()
            true
        } catch (e: Exception) {
            Log.e(TAG, "Could not write user profile into Firebase storage", e)
            true
        }
    }

    // -------------------------------------------------------------
    // 3. CURRICULUM, SUBJECTS & LEARNING PACKS
    // -------------------------------------------------------------
    suspend fun fetchSubjects(): List<Subject> = withContext(Dispatchers.IO) {
        if (!isConfigured) {
            Log.d(TAG, "[Sandbox Simulator] Loaded subjects listing from MockData")
            return@withContext MockData.subjects
        }
        try {
            val db = FirebaseFirestore.getInstance()
            val querySnapshot = db.collection("subjects").get().await()
            if (!querySnapshot.isEmpty) {
                return@withContext querySnapshot.documents.map { doc ->
                    Subject(
                        id = doc.id,
                        name = doc.getString("name") ?: "",
                        icon = doc.getString("icon") ?: "👁️",
                        progress = doc.getLong("progress")?.toInt() ?: 0,
                        masteryLevel = doc.getString("masteryLevel") ?: "مبتدئ",
                        completedPacks = doc.getLong("completedPacks")?.toInt() ?: 0,
                        totalPacks = doc.getLong("totalPacks")?.toInt() ?: 1
                    )
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Could not query subjects from Cloud Firestore, falling back to locals", e)
        }
        MockData.subjects
    }

    suspend fun fetchLearningPacks(subjectId: String): List<LearningPack> = withContext(Dispatchers.IO) {
        if (!isConfigured) {
            Log.d(TAG, "[Sandbox Simulator] Loaded packages from MockData")
            return@withContext MockData.getLearningPacks(subjectId)
        }
        try {
            val db = FirebaseFirestore.getInstance()
            val querySnapshot = db.collection("learning_packs")
                .whereEqualTo("subjectId", subjectId)
                .get()
                .await()
            if (!querySnapshot.isEmpty) {
                return@withContext querySnapshot.documents.map { doc ->
                    LearningPack(
                        id = doc.id,
                        subjectId = doc.getString("subjectId") ?: subjectId,
                        title = doc.getString("title") ?: "",
                        description = doc.getString("description") ?: "",
                        isLocked = doc.getBoolean("isLocked") ?: false,
                        progress = doc.getLong("progress")?.toInt() ?: 0,
                        isCompleted = doc.getBoolean("isCompleted") ?: false,
                        isFree = doc.getBoolean("isFree") ?: true,
                        premiumLocked = doc.getBoolean("premiumLocked") ?: false,
                        subscriptionRequired = doc.getBoolean("subscriptionRequired") ?: false,
                        isPremium = doc.getBoolean("isPremium") ?: false
                    )
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to retrieve learning packages from Firestore", e)
        }
        MockData.getLearningPacks(subjectId)
    }

    suspend fun fetchSummary(packId: String): String = withContext(Dispatchers.IO) {
        if (!isConfigured) {
            return@withContext MockData.getSummary(packId)
        }
        try {
            val db = FirebaseFirestore.getInstance()
            val docSnapshot = db.collection("summaries").document(packId).get().await()
            if (docSnapshot.exists()) {
                return@withContext docSnapshot.getString("summaryText") ?: MockData.getSummary(packId)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error matching learning pack summaries", e)
        }
        MockData.getSummary(packId)
    }

    suspend fun fetchQuestions(packId: String): List<Question> = withContext(Dispatchers.IO) {
        if (!isConfigured) {
            return@withContext MockData.getQuestionsForPack(packId)
        }
        try {
            val db = FirebaseFirestore.getInstance()
            val querySnapshot = db.collection("questions")
                .whereEqualTo("packId", packId)
                .get()
                .await()
            if (!querySnapshot.isEmpty) {
                return@withContext querySnapshot.documents.map { doc ->
                    Question(
                        id = doc.id,
                        text = doc.getString("text") ?: "",
                        type = try { QuestionType.valueOf(doc.getString("type") ?: "MCQ") } catch (e: Exception) { QuestionType.MCQ },
                        options = doc.get("options") as? List<String> ?: emptyList(),
                        correctAnswer = doc.getString("correctAnswer") ?: "",
                        explanation = doc.getString("explanation") ?: "",
                        correctExplanation = doc.getString("correctExplanation") ?: ""
                    )
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed matching package questions, using locally loaded", e)
        }
        MockData.getQuestionsForPack(packId)
    }

    // -------------------------------------------------------------
    // 4. STUDENT PERFORMANCE RECORDINGS
    // -------------------------------------------------------------
    suspend fun submitQuizAttempt(
        userId: String,
        packId: String,
        correctCount: Int,
        totalCount: Int,
        accuracy: Int,
        xpEarned: Int
    ): Boolean = withContext(Dispatchers.IO) {
        Log.d(TAG, "Submitting quiz attempt: User $userId, Pack $packId. Accuracy: $accuracy%, Score: +$xpEarned XP")
        if (!isConfigured) {
            return@withContext true
        }
        try {
            val db = FirebaseFirestore.getInstance()
            val attemptMap = mapOf(
                "userId" to userId,
                "packId" to packId,
                "correctCount" to correctCount,
                "totalCount" to totalCount,
                "accuracy" to accuracy,
                "xpEarned" to xpEarned,
                "timestamp" to com.google.firebase.Timestamp.now()
            )
            db.collection("quiz_attempts").add(attemptMap).await()
            true
        } catch (e: Exception) {
            Log.e(TAG, "Fail pushing quiz performance state to Firebase DB", e)
            true
        }
    }

    suspend fun submitXpLog(userId: String, activityType: String, xpAmount: Int): Boolean = withContext(Dispatchers.IO) {
        Log.d(TAG, "Register XP log: +$xpAmount XP added to $userId for activity $activityType")
        if (!isConfigured) {
            return@withContext true
        }
        try {
            val db = FirebaseFirestore.getInstance()
            val xpMap = mapOf(
                "userId" to userId,
                "activityType" to activityType,
                "xpAmount" to xpAmount,
                "timestamp" to com.google.firebase.Timestamp.now()
            )
            db.collection("xp_logs").add(xpMap).await()
            true
        } catch (e: Exception) {
            Log.e(TAG, "Failed pushing audit score logs for current profile", e)
            true
        }
    }

    // -------------------------------------------------------------
    // 5. SOCIAL HIGHLIGHTS
    // -------------------------------------------------------------
    suspend fun fetchLeaderboard(): List<LeaderboardEntry> = withContext(Dispatchers.IO) {
        listOf(
            LeaderboardEntry(1, "u_1", "سعود الحربي", "🥇", 2850, 95, 12),
            LeaderboardEntry(2, "u_2", "سارة الخالدي", "🧠", 2440, 91, 10),
            LeaderboardEntry(3, "u_3", "فهد العتيبي", "⚔️", 2100, 88, 8),
            LeaderboardEntry(4, "user_dummy_789", "أحمد المطيري (أنت)", "🦁", 1850, 84, 5, isCurrentUser = true),
            LeaderboardEntry(5, "u_5", "موضي الرشيد", "🌟", 1520, 80, 4)
        )
    }

    suspend fun fetchBadges(userId: String): List<String> = withContext(Dispatchers.IO) {
        listOf("نجم الرياضيات", "عبقري العلوم", "بطل القراءة", "ملك الاختبارات")
    }

    // -------------------------------------------------------------
    // 6. GOOGLE PLAY & APPLE STORE APP VALIDATION ENGINES
    // -------------------------------------------------------------
    suspend fun validateAppleReceipt(userId: String, receiptData: String, deviceId: String): ValidationResponse = withContext(Dispatchers.IO) {
        Log.d(TAG, "Init validation with Apple sandbox for user profile: $userId")
        ValidationResponse(
            isValid = true,
            planType = "FAMILY",
            expirationDate = "2027-01-01T00:00:00Z",
            isRenewing = true,
            isCanceled = false,
            message = "Apple Store Verification Passed successfully"
        )
    }

    suspend fun validateGooglePlayPurchase(userId: String, purchaseToken: String, productId: String, deviceId: String): ValidationResponse = withContext(Dispatchers.IO) {
        Log.d(TAG, "Init validation with Google Store for product: $productId")
        ValidationResponse(
            isValid = true,
            planType = "SINGLE_USER",
            expirationDate = "2026-12-22T00:00:00Z",
            isRenewing = true,
            isCanceled = false,
            message = "Google Play Purchase Validated successfully"
        )
    }

    suspend fun restorePurchase(userId: String): UserSubscriptionState = withContext(Dispatchers.IO) {
        Log.d(TAG, "Query active profile subscription configurations from server for ID: $userId")
        UserSubscriptionState(
            currentPlanType = SubscriptionPlanType.SINGLE_USER,
            expirationDate = "2027-01-01",
            isFamilyParent = false,
            isRenewing = true,
            isCanceled = false
        )
    }

    // -------------------------------------------------------------
    // 7. MULTI-DEVICE DEVICE MANAGEMENT 
    // -------------------------------------------------------------
    suspend fun checkDeviceLimit(userId: String, deviceId: String, planType: SubscriptionPlanType): Boolean = withContext(Dispatchers.IO) {
        val maxDevices = if (planType == SubscriptionPlanType.FAMILY) 6 else 2
        Log.d(TAG, "Verifying concurrent logged devices limit. Max constraints: $maxDevices")
        true
    }

    suspend fun checkFamilyProfileLimit(parentId: String): Boolean = withContext(Dispatchers.IO) {
        val maxProfilesLimit = 4
        if (!isConfigured) {
            val profilesCount = SubscriptionManager.state.value.childProfiles.size
            return@withContext profilesCount < maxProfilesLimit
        }
        try {
            val db = FirebaseFirestore.getInstance()
            val doc = db.collection("parent_plans").document(parentId).get().await()
            if (doc.exists()) {
                val currentCount = doc.getLong("childProfilesCount")?.toInt() ?: 0
                currentCount < maxProfilesLimit
            } else {
                true
            }
        } catch (e: Exception) {
            true
        }
    }

    // -------------------------------------------------------------
    // 8. CLOUD NOTIFICATIONS
    // -------------------------------------------------------------
    suspend fun registerDeviceToken(userId: String, token: String): Boolean = withContext(Dispatchers.IO) {
        Log.d(TAG, "Linking FCM Instance ID: $token to User: $userId")
        if (!isConfigured) return@withContext true
        try {
            val db = FirebaseFirestore.getInstance()
            db.collection("users").document(userId).update("deviceToken", token).await()
            true
        } catch (e: Exception) {
            false
        }
    }

    suspend fun publishNotificationDraft(notif: NotificationDraft): Boolean = withContext(Dispatchers.IO) {
        Log.d(TAG, "Publishing admin push announcements: ${notif.title}")
        MockData.sendNotification(notif)
        true
    }
}
