package com.example.ui.screens.admin

import android.app.Activity
import android.content.pm.ActivityInfo
import androidx.compose.ui.platform.LocalContext
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.mock.MockData
import com.example.domain.models.LearningPack
import com.example.domain.models.Question
import com.example.domain.models.QuestionType
import com.example.domain.models.Subject
import com.example.domain.models.UploadJob
import com.example.domain.models.ReviewTask
import com.example.domain.models.NotificationDraft
import com.example.data.backend.GeminiPipelineService
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AdminDashboardScreen(
    onLogout: () -> Unit
) {
    val context = LocalContext.current
    DisposableEffect(Unit) {
        val activity = context as? Activity
        val originalOrientation = activity?.requestedOrientation ?: ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED
        activity?.requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE
        onDispose {
            // Restore original orientation on exit
            activity?.requestedOrientation = originalOrientation
        }
    }

    // Current Admin Tab Selection
    var selectedTab by remember { mutableStateOf("Dashboard") }
    
    val menuItems = listOf(
        "Dashboard",
        "Grades & Subjects",
        "Learning Packs",
        "Upload Center",
        "Quiz Editor",
        "Summary Editor",
        "Review Queue",
        "Users",
        "Analytics",
        "Subscription Mgr",
        "Gamification Rules",
        "Notification Mgr"
    )

    val coroutineScope = rememberCoroutineScope()
    val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)

    BoxWithConstraints(modifier = Modifier.fillMaxSize()) {
        val isWideScreen = maxWidth >= 750.dp

        if (isWideScreen) {
            // Desktop/Tablet Landscape Layout
            Row(
                modifier = Modifier
                    .fillMaxSize()
                    .background(MaterialTheme.colorScheme.surface)
            ) {
                // Lateral Navigation Rail Drawer (English, LTR layout)
                Column(
                    modifier = Modifier
                        .width(260.dp)
                        .fillMaxHeight()
                        .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
                        .border(1.dp, MaterialTheme.colorScheme.outlineVariant)
                        .padding(16.dp),
                    verticalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        // Header
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(vertical = 16.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(40.dp)
                                    .clip(CircleShape)
                                    .background(MaterialTheme.colorScheme.primary),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Settings,
                                    contentDescription = "Admin",
                                    tint = MaterialTheme.colorScheme.onPrimary
                                )
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = "Saudi Learning",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 16.sp
                                )
                                Text(
                                    text = "Admin Control",
                                    fontSize = 12.sp,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                        
                        Divider(modifier = Modifier.padding(vertical = 8.dp))

                        // Menu Entries
                        Column(
                            verticalArrangement = Arrangement.spacedBy(4.dp),
                            modifier = Modifier.verticalScroll(rememberScrollState())
                        ) {
                            menuItems.forEach { tab ->
                                val isSelected = selectedTab == tab
                                val background = if (isSelected) MaterialTheme.colorScheme.primary else Color.Transparent
                                val textColor = if (isSelected) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurface
                                
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(background)
                                        .clickable { selectedTab = tab }
                                        .padding(horizontal = 12.dp, vertical = 10.dp)
                                ) {
                                    Text(
                                        text = tab,
                                        color = textColor,
                                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                        fontSize = 14.sp
                                    )
                                }
                            }
                        }
                    }

                    // Bottom logout button
                    Button(
                        onClick = onLogout,
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(44.dp)
                    ) {
                        Icon(imageVector = Icons.Default.ExitToApp, contentDescription = "Logout")
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Logout")
                    }
                }

                // Active Workspace Screen Rendered Dynamically
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxHeight()
                        .padding(24.dp)
                ) {
                    when (selectedTab) {
                        "Dashboard" -> AdminStatsDashboard()
                        "Grades & Subjects" -> AdminGradesAndSubjects()
                        "Learning Packs" -> AdminLearningPacksManager()
                        "Upload Center" -> AdminUploadCenter()
                        "Quiz Editor" -> AdminQuizEditor()
                        "Summary Editor" -> AdminSummaryEditor()
                        "Review Queue" -> AdminReviewQueue()
                        "Users" -> AdminUsersDirectory()
                        "Analytics" -> AdminAnalyticsDashboard()
                        "Subscription Mgr" -> AdminSubscriptionManager()
                        "Gamification Rules" -> AdminGamificationRules()
                        "Notification Mgr" -> AdminNotificationManager()
                    }
                }
            }
        } else {
            // Portrait Mobile Friendly Screen Layout
            ModalNavigationDrawer(
                drawerState = drawerState,
                drawerContent = {
                    ModalDrawerSheet(
                        modifier = Modifier
                            .width(280.dp)
                            .fillMaxHeight(),
                        drawerContainerColor = MaterialTheme.colorScheme.surface
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(16.dp),
                            verticalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column {
                                // Header
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier.padding(vertical = 16.dp)
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(40.dp)
                                            .clip(CircleShape)
                                            .background(MaterialTheme.colorScheme.primary),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.Settings,
                                            contentDescription = "Admin",
                                            tint = MaterialTheme.colorScheme.onPrimary
                                        )
                                    }
                                    Spacer(modifier = Modifier.width(12.dp))
                                    Column {
                                        Text(
                                            text = "Saudi Learning",
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 16.sp
                                        )
                                        Text(
                                            text = "Admin Control",
                                            fontSize = 12.sp,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                    }
                                }

                                Divider(modifier = Modifier.padding(vertical = 8.dp))

                                // Menu Entries
                                Column(
                                    verticalArrangement = Arrangement.spacedBy(4.dp),
                                    modifier = Modifier
                                        .weight(1f)
                                        .verticalScroll(rememberScrollState())
                                ) {
                                    menuItems.forEach { tab ->
                                        val isSelected = selectedTab == tab
                                        val background = if (isSelected) MaterialTheme.colorScheme.primary else Color.Transparent
                                        val textColor = if (isSelected) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurface

                                        Box(
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .clip(RoundedCornerShape(8.dp))
                                                .background(background)
                                                .clickable {
                                                    selectedTab = tab
                                                    coroutineScope.launch { drawerState.close() }
                                                }
                                                .padding(horizontal = 12.dp, vertical = 10.dp)
                                        ) {
                                            Text(
                                                text = tab,
                                                color = textColor,
                                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                                fontSize = 14.sp
                                            )
                                        }
                                    }
                                }
                            }

                            // Bottom logout button inside drawer
                            Button(
                                onClick = onLogout,
                                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(44.dp)
                            ) {
                                Icon(imageVector = Icons.Default.ExitToApp, contentDescription = "Logout")
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("Logout")
                            }
                        }
                    }
                }
            ) {
                Scaffold(
                    topBar = {
                        TopAppBar(
                            title = {
                                Text(
                                    text = selectedTab,
                                    fontSize = 18.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            },
                            navigationIcon = {
                                IconButton(onClick = {
                                    coroutineScope.launch { drawerState.open() }
                                }) {
                                    Icon(
                                        imageVector = Icons.Default.Menu,
                                        contentDescription = "Open Navigation Menu"
                                    )
                                }
                            },
                            colors = TopAppBarDefaults.topAppBarColors(
                                containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                            )
                        )
                    }
                ) { paddingValues ->
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(paddingValues)
                            .padding(16.dp)
                    ) {
                        when (selectedTab) {
                            "Dashboard" -> AdminStatsDashboard()
                            "Grades & Subjects" -> AdminGradesAndSubjects()
                            "Learning Packs" -> AdminLearningPacksManager()
                            "Upload Center" -> AdminUploadCenter()
                            "Quiz Editor" -> AdminQuizEditor()
                            "Summary Editor" -> AdminSummaryEditor()
                            "Review Queue" -> AdminReviewQueue()
                            "Users" -> AdminUsersDirectory()
                            "Analytics" -> AdminAnalyticsDashboard()
                            "Subscription Mgr" -> AdminSubscriptionManager()
                            "Gamification Rules" -> AdminGamificationRules()
                            "Notification Mgr" -> AdminNotificationManager()
                        }
                    }
                }
            }
        }
    }
}

// ==========================================
// 1. STATS DASHBOARD
// ==========================================
@Composable
fun AdminStatsDashboard() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        Column {
            Text("Admin Dashboard Overview", fontSize = 28.sp, fontWeight = FontWeight.Bold)
            Text("Aggregated statistics and learning activities across the Kingdom.", fontSize = 14.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }

        // Stats Cards Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            StatItemCard(modifier = Modifier.weight(1f), title = "Active Students", value = "1,842", subtitle = "Middle grades 7-9", color = MaterialTheme.colorScheme.primaryContainer)
            StatItemCard(modifier = Modifier.weight(1f), title = "Premium Ratio", value = "28.5%", subtitle = "82 Paid subscriptions", color = Color(0xFFFFF9C4))
            StatItemCard(modifier = Modifier.weight(1f), title = "AI Generated Packs", value = "42", subtitle = "9 pending approval", color = MaterialTheme.colorScheme.secondaryContainer)
            StatItemCard(modifier = Modifier.weight(1f), title = "Review Tasks", value = "${MockData.reviewTasks.filter { it.status == "Pending" }.size}", subtitle = "Action items", color = MaterialTheme.colorScheme.errorContainer)
        }

        // Quick Actions
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f))
        ) {
            Column(modifier = Modifier.paddings()) {
                Text("Content Generation Flow Summary", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(12.dp))
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                    StepIndicator(modifier = Modifier.weight(1f), num = "1", title = "Upload PDF", desc = "Upload textbook in Upload Center")
                    StepIndicator(modifier = Modifier.weight(1f), num = "2", title = "AI Pipeline", desc = "Extract concepts, generate quizzes")
                    StepIndicator(modifier = Modifier.weight(1f), num = "3", title = "Review", desc = "Approve drafts in Review Queue")
                    StepIndicator(modifier = Modifier.weight(1f), num = "4", title = "Publish", desc = "Pushed instantly to student application")
                }
            }
        }
    }
}

// ==========================================
// 2. GRADES AND SUBJECTS
// ==========================================
@Composable
fun AdminGradesAndSubjects() {
    var newGradeName by remember { mutableStateOf("") }
    var selectedGradeForSubject by remember { mutableStateOf(MockData.grades.firstOrNull() ?: "") }
    var newSubjectName by remember { mutableStateOf("") }
    var newSubjectIcon by remember { mutableStateOf("📐") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        Text("Grades & Subjects Management", fontSize = 28.sp, fontWeight = FontWeight.Bold)

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(24.dp)) {
            // Grades Column
            Card(
                modifier = Modifier.weight(1f),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(modifier = Modifier.paddings(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                    Text("Grades Directory", fontSize = 20.sp, fontWeight = FontWeight.Bold)
                    
                    MockData.grades.forEach { grade ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(MaterialTheme.colorScheme.surfaceVariant, RoundedCornerShape(8.dp))
                                .padding(12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(grade, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                            Text("Active", fontSize = 12.sp, color = Color(0xFF16A34A))
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                    Text("Add New Academic Grade", fontSize = 14.sp, fontWeight = FontWeight.Bold)
                    OutlinedTextField(
                        value = newGradeName,
                        onValueChange = { newGradeName = it },
                        label = { Text("e.g. الصف الأول الثانوي") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Button(
                        onClick = {
                            if (newGradeName.isNotEmpty()) {
                                MockData.addGrade(newGradeName)
                                newGradeName = ""
                            }
                        },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Add Grade")
                    }
                }
            }

            // Subjects Column
            Card(
                modifier = Modifier.weight(1.2f),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(modifier = Modifier.paddings(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                    Text("Subjects Directory", fontSize = 20.sp, fontWeight = FontWeight.Bold)
                    
                    Column(
                        modifier = Modifier
                            .height(240.dp)
                            .verticalScroll(rememberScrollState()),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        MockData.subjects.forEach { subject ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(MaterialTheme.colorScheme.surfaceVariant, RoundedCornerShape(8.dp))
                                    .padding(12.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(subject.icon, fontSize = 20.sp)
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(subject.name, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                                }
                                Text("Packs: ${subject.totalPacks}", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                    Text("Create New Subject", fontSize = 16.sp, fontWeight = FontWeight.Bold)
                    
                    OutlinedTextField(
                        value = newSubjectName,
                        onValueChange = { newSubjectName = it },
                        label = { Text("Subject Name (Arabic, e.g. الفقه)") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                        OutlinedTextField(
                            value = newSubjectIcon,
                            onValueChange = { newSubjectIcon = it },
                            label = { Text("Emoji Icon") },
                            modifier = Modifier.weight(1f)
                        )
                        Box(modifier = Modifier.weight(1.5f)) {
                            // Dummy grade selection selector
                            Text("Target Grade:\n${selectedGradeForSubject.take(15)}...", fontSize = 12.sp, color = MaterialTheme.colorScheme.primary)
                        }
                    }

                    Button(
                        onClick = {
                            if (newSubjectName.isNotEmpty()) {
                                MockData.addSubject(
                                    Subject(
                                        id = "${MockData.subjects.size + 1}",
                                        name = newSubjectName,
                                        icon = newSubjectIcon,
                                        progress = 0,
                                        masteryLevel = "مبتدئ",
                                        completedPacks = 0,
                                        totalPacks = 0
                                    )
                                )
                                newSubjectName = ""
                            }
                        },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Create Subject")
                    }
                }
            }
        }
    }
}

// ==========================================
// 3. LEARNING PACKS MANAGER
// ==========================================
@Composable
fun AdminLearningPacksManager() {
    var selectedSubject by remember { mutableStateOf(MockData.subjects.firstOrNull()) }
    var newPackName by remember { mutableStateOf("") }
    var newPackDesc by remember { mutableStateOf("") }
    var isNewPackPremium by remember { mutableStateOf(true) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        Text("Learning Packs Management", fontSize = 28.sp, fontWeight = FontWeight.Bold)

        // Select Subject Row
        Column {
            Text("Select Subject to Manage", fontSize = 14.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState())
                    .height(60.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                MockData.subjects.forEach { subject ->
                    val isSelected = selectedSubject?.id == subject.id
                    Button(
                        onClick = { selectedSubject = subject },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant,
                            contentColor = if (isSelected) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    ) {
                        Text("${subject.icon} ${subject.name}")
                    }
                }
            }
        }

        selectedSubject?.let { subject ->
            val packsRef = MockData.getLearningPacks(subject.id)

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(24.dp)) {
                
                // Existing learning packs list
                Card(
                    modifier = Modifier.weight(1.2f),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Column(modifier = Modifier.paddings(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                        Text("Existing Packs for ${subject.name}", fontSize = 18.sp, fontWeight = FontWeight.Bold)

                        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                            packsRef.forEachIndexed { index, pack ->
                                Card(
                                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Row(
                                        modifier = Modifier.padding(16.dp),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Column(modifier = Modifier.weight(1f)) {
                                            Text(pack.title, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                                            Text(pack.description, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                            Spacer(modifier = Modifier.height(4.dp))
                                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                                Box(
                                                    modifier = Modifier
                                                        .background(if (pack.isPremium) Color(0xFFFFD700) else Color(0xFFDCFCE7), RoundedCornerShape(4.dp))
                                                        .padding(horizontal = 6.dp, vertical = 2.dp)
                                                ) {
                                                    Text(if (pack.isPremium) "Premium" else "Free Starter", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color.Black)
                                                }
                                                if (pack.isLocked) {
                                                    Text("🔒 Locked Locked", fontSize = 10.sp, color = MaterialTheme.colorScheme.error)
                                                }
                                            }
                                        }

                                        // Toggle premium status button
                                        Switch(
                                            checked = pack.isPremium,
                                            onCheckedChange = { isPrem ->
                                                MockData.updateLearningPackLock(subject.id, pack.id, isPrem, isPrem)
                                            }
                                        )
                                    }
                                }
                            }
                        }
                    }
                }

                // Add Learning Pack Form
                Card(
                    modifier = Modifier.weight(1f),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Column(modifier = Modifier.paddings(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                        Text("Add Learning Pack", fontSize = 18.sp, fontWeight = FontWeight.Bold)

                        OutlinedTextField(
                            value = newPackName,
                            onValueChange = { newPackName = it },
                            label = { Text("Pack name (Arabic)") },
                            modifier = Modifier.fillMaxWidth()
                        )

                        OutlinedTextField(
                            value = newPackDesc,
                            onValueChange = { newPackDesc = it },
                            label = { Text("Short description (Arabic)") },
                            modifier = Modifier.fillMaxWidth()
                        )

                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Checkbox(
                                checked = isNewPackPremium,
                                onCheckedChange = { isNewPackPremium = it }
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Mark as Premium (Locked for free tier)")
                        }

                        Button(
                            onClick = {
                                if (newPackName.isNotEmpty()) {
                                    MockData.addLearningPack(
                                        subjectId = subject.id,
                                        packName = newPackName,
                                        description = newPackDesc,
                                        isPremium = isNewPackPremium,
                                        isLocked = isNewPackPremium
                                    )
                                    newPackName = ""
                                    newPackDesc = ""
                                }
                            },
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text("Add Learning Pack")
                        }
                    }
                }
            }
        }
    }
}

// ==========================================
// 4. UPLOAD CENTER
// ==========================================
@Composable
fun AdminUploadCenter() {
    var inputText by remember { mutableStateOf("") }
    var uploadFileName by remember { mutableStateOf("math-grade8-equations.pdf") }
    var uploadFileType by remember { mutableStateOf("PDF Textbook") }
    var manualSubject by remember { mutableStateOf<String?>("الرياضيات") }
    var manualGrade by remember { mutableStateOf<String?>("الصف الثاني المتوسط") }
    var isPremiumSelected by remember { mutableStateOf(true) }

    var isLoading by remember { mutableStateOf(false) }
    var currentStageIndex by remember { mutableStateOf(0) }
    var successMessage by remember { mutableStateOf<String?>(null) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    val processingStages = listOf(
        "استخلاص وتحليل البيانات من الملف المرفق...",
        "التصنيف التلقائي وتحديد المادة والصف الدراسي...",
        "إنشاء ملخص احترافي مبسط بأسلوب تفاعلي...",
        "صياغة 33 سؤالاً (15 MCQ، 10 FIB، 5 TF، 3 HOQ)...",
        "توليد شروحات نموذجية متدرجة تتبع معايير الوزارة...",
        "احتساب جودة التدريس بالمعيار الذهبي (Gold Rubric)...",
        "حفظ المسودة وإرسالها لجدول مراجعة المحتوى النهائي..."
    )

    // Simulate stage updates while AI background thread is running
    LaunchedEffect(isLoading) {
        if (isLoading) {
            currentStageIndex = 0
            while (currentStageIndex < processingStages.size - 1) {
                kotlinx.coroutines.delay(2000)
                currentStageIndex++
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        Column {
            Text("AI Content Upload Center & Pipeline", fontSize = 28.sp, fontWeight = FontWeight.Bold)
            Text(
                "نظام توليد المحتوى الذكي: استخلص البيانات لإنشاء ملخصات وأسئلة تفاعلية فورية.",
                fontSize = 14.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        if (successMessage != null) {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFFDCFCE7)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(imageVector = Icons.Default.CheckCircle, contentDescription = "Success", tint = Color(0xFF16A34A))
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text("تم بنجاح!", fontWeight = FontWeight.Bold, color = Color(0xFF166534))
                        Text(successMessage!!, fontSize = 13.sp, color = Color(0xFF166534))
                    }
                    Spacer(modifier = Modifier.weight(1f))
                    IconButton(onClick = { successMessage = null }) {
                        Icon(imageVector = Icons.Default.Close, contentDescription = "Close", tint = Color(0xFF166534))
                    }
                }
            }
        }

        if (errorMessage != null) {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.errorContainer),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(imageVector = Icons.Default.Warning, contentDescription = "Error", tint = MaterialTheme.colorScheme.error)
                    Spacer(modifier = Modifier.width(12.dp))
                    Text(errorMessage!!, fontSize = 13.sp, color = MaterialTheme.colorScheme.onErrorContainer)
                    Spacer(modifier = Modifier.weight(1f))
                    IconButton(onClick = { errorMessage = null }) {
                        Icon(imageVector = Icons.Default.Close, contentDescription = "Close", tint = MaterialTheme.colorScheme.onErrorContainer)
                    }
                }
            }
        }

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(24.dp)) {
            // Form Column
            Column(modifier = Modifier.weight(1.2f), verticalArrangement = Arrangement.spacedBy(20.dp)) {
                
                // Shortcut Templates Zone (Awesome for testing)
                Card(
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f))
                ) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("💡 نماذج سريعة للتجربة المنهجية (تحميل فوري لدروس حقيقية):", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = MaterialTheme.colorScheme.primary)
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Button(
                                onClick = {
                                    inputText = "درس مادة العلوم للمرحلة المتوسطة: التركيب الضوئي هو عملية حيوية بالغة الأهمية تستخدمها النباتات والطحالب لإنتاج الغذاء والأكسجين من غاز ثاني أكسيد الكربون والماء بمساعدة ضوء الشمس الممتص عبر مادة الكلوروفيل الخضراء الموجودة في البلاستيدات الخضراء بالأوراق."
                                    uploadFileName = "science-photosynthesis-lesson.png"
                                    uploadFileType = "High-res Image"
                                    manualSubject = "العلوم"
                                    manualGrade = "الصف الثاني المتوسط"
                                },
                                modifier = Modifier.weight(1f),
                                contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondaryContainer, contentColor = MaterialTheme.colorScheme.onSecondaryContainer)
                            ) {
                                Text("🧪 العلوم (ثاني)", fontSize = 11.sp)
                            }

                            Button(
                                onClick = {
                                    inputText = "درس مادة الرياضيات للمرحلة المتوسطة: حل المعادلات من خطوة واحدة والجمع والطرح. المفهوم الأساسي هو جعل المتغير x منفرداً في طرف واحد للمعادلة لتحديد قيمته الصائبة بموازنة الكفتين عن طريق استخدام كرت التدريب أو تحويل الطرف الرياضي الآخر."
                                    uploadFileName = "math-algebra-grade7.pdf"
                                    uploadFileType = "PDF Textbook"
                                    manualSubject = "الرياضيات"
                                    manualGrade = "الصف الأول المتوسط"
                                },
                                modifier = Modifier.weight(1f),
                                contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondaryContainer, contentColor = MaterialTheme.colorScheme.onSecondaryContainer)
                            ) {
                                Text("📐 الرياضيات (أول)", fontSize = 11.sp)
                            }

                            Button(
                                onClick = {
                                    inputText = "درس الدراسات الإسلامية للمتوسطة: توحيد الألوهية وإفراد الله بالعبادة. وهو أهم الواجبات على العباد قاطبة وهو الغاية من إرسال الرسل عليهم السلام وكشفت النصوص الصحيحة وجوب الصلاة والصوم والذبح والنسك والتوجه والدعاء لله سبحانه لوحده لا شريك له."
                                    uploadFileName = "deen-tawheed-grade9.docx"
                                    uploadFileType = "Rich Text Field"
                                    manualSubject = "الدراسات الإسلامية"
                                    manualGrade = "الصف الثالث المتوسط"
                                },
                                modifier = Modifier.weight(1f),
                                contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondaryContainer, contentColor = MaterialTheme.colorScheme.onSecondaryContainer)
                            ) {
                                Text("🕋 الإسلامية (ثالث)", fontSize = 11.sp)
                            }
                        }
                    }
                }

                Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)) {
                    Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                        Text("بيانات ومرفقات الدرس", fontSize = 18.sp, fontWeight = FontWeight.Bold)

                        // Mock Upload Zone Styling
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(120.dp)
                                .border(1.dp, MaterialTheme.colorScheme.primary.copy(alpha = 0.5f), RoundedCornerShape(12.dp))
                                .background(MaterialTheme.colorScheme.primary.copy(alpha = 0.05f))
                                .clip(RoundedCornerShape(12.dp))
                                .clickable {
                                    // Simulated selection of standard text-file setup
                                    if (uploadFileName.isEmpty()) {
                                        uploadFileName = "curriculum-textbook.pdf"
                                    }
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Icon(
                                    imageVector = Icons.Default.Share,
                                    contentDescription = "Upload Icon",
                                    tint = MaterialTheme.colorScheme.primary,
                                    modifier = Modifier.size(36.dp)
                                )
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    if (uploadFileName.isNotEmpty()) "الملف المختار: $uploadFileName" else "اسحب وأفلت الكتب المدرسية أو المرفقات هنا (PDF، صور، نصوص)",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.primary
                                )
                                Text("صيغ المدخلات الشاملة مدعومة تلقائياً", fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                        }

                        // File properties fields
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                            OutlinedTextField(
                                value = uploadFileName,
                                onValueChange = { uploadFileName = it },
                                label = { Text("اسم الملف الافتراضي") },
                                modifier = Modifier.weight(1.5f)
                            )
                            OutlinedTextField(
                                value = uploadFileType,
                                onValueChange = { uploadFileType = it },
                                label = { Text("نوع المستند") },
                                modifier = Modifier.weight(1f)
                            )
                        }

                        // Textbook text or context area
                        OutlinedTextField(
                            value = inputText,
                            onValueChange = { inputText = it },
                            label = { Text("محتوى الدرس أو النص المستخلص (مسح ضوئي ومسودات)") },
                            modifier = Modifier.fillMaxWidth(),
                            minLines = 4,
                            placeholder = { Text("انسخ والصق محتوى الدرس هنا لتأسيس الأسئلة والملخص على ضوئه...") }
                        )

                        // Meta detection settings
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                            // Subject Selector dropdown simulation
                            OutlinedTextField(
                                value = manualSubject ?: "تصنيف تلقائي بالذكاء الاصطناعي",
                                onValueChange = { manualSubject = if (it.isEmpty() || it == "AI") null else it },
                                label = { Text("المادة الدراسية المستهدفة") },
                                modifier = Modifier.weight(1f),
                                trailingIcon = {
                                    IconButton(onClick = { manualSubject = "العلوم" }) {
                                        Icon(imageVector = Icons.Default.ArrowDropDown, contentDescription = "dropdown")
                                    }
                                }
                            )

                            // Grade Selector dropdown simulation
                            OutlinedTextField(
                                value = manualGrade ?: "تعرف تلقائي بالذكاء الاصطناعي",
                                onValueChange = { manualGrade = if (it.isEmpty() || it == "AI") null else it },
                                label = { Text("الصف الدراسي المستهدف") },
                                modifier = Modifier.weight(1f),
                                trailingIcon = {
                                    IconButton(onClick = { manualGrade = "الصف الثاني المتوسط" }) {
                                        Icon(imageVector = Icons.Default.ArrowDropDown, contentDescription = "dropdown")
                                    }
                                }
                            )
                        }

                        // Target configuration: Free tier vs Premium
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .border(1.dp, MaterialTheme.colorScheme.outlineVariant, RoundedCornerShape(8.dp))
                                .padding(12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text("نوع ترقية الحزمة المولدة لطلاب المتوسطة", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                Text("تحديد ما إذا كانت الحزمة مجانية بالكامل أم مغلقة للمشتركين لترقية الحساب.", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                Text(if (isPremiumSelected) "⭐️ متميزة (Premium)" else "🔓 تجريبية (Free)", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                                Switch(
                                    checked = isPremiumSelected,
                                    onCheckedChange = { isPremiumSelected = it }
                                )
                            }
                        }

                        // Trigger Pipeline Button
                        Button(
                            onClick = {
                                if (inputText.trim().isEmpty()) {
                                    errorMessage = "يرجى تعبئة محتوى الدرس أولاً لتأسيس المحتوى التعليمي بنجاح."
                                    return@Button
                                }
                                isLoading = true
                                errorMessage = null
                                successMessage = null

                                scope.launch {
                                    try {
                                        // Execute the robust pipeline
                                        val task = GeminiPipelineService.generateContentPipeline(
                                            inputText = inputText,
                                            manualSubjectName = manualSubject,
                                            manualGradeName = manualGrade,
                                            fileName = uploadFileName
                                        )

                                        // Set premium preference selected in the form
                                        task.isPremium = isPremiumSelected

                                        // Register Upload Job
                                        MockData.addUploadJob(
                                            UploadJob(
                                                id = "up_${System.currentTimeMillis()}",
                                                fileName = uploadFileName,
                                                fileType = uploadFileType,
                                                status = "Pending Review",
                                                grade = task.gradeName,
                                                subject = task.subjectName
                                            )
                                        )

                                        // Add to the moderator review queue
                                        MockData.reviewTasks.add(task)

                                        successMessage = "تم الانتهاء بنجاح! تم استخلاص النص وتصنيف المادة (${task.subjectName}) والصف (${task.gradeName}) وتوليد ملخص المعيار الذهبي بالاختبارات (33 سؤالاً) وإرسالها لمشرفي التقويم بتقدير علمي (${task.rubricScore}/100)."
                                        inputText = ""
                                    } catch (e: Exception) {
                                        errorMessage = "حدث خطأ أثناء الاتصال بمعالج الذكاء الاصطناعي: ${e.message}. يرجى المحاولة لاحقاً."
                                    } finally {
                                        isLoading = false
                                    }
                                }
                            },
                            enabled = !isLoading,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(52.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                        ) {
                            if (isLoading) {
                                CircularProgressIndicator(color = MaterialTheme.colorScheme.onPrimary, modifier = Modifier.size(24.dp))
                                Spacer(modifier = Modifier.width(12.dp))
                                Text("جاري المعالجة الرقمية...", fontWeight = FontWeight.Bold)
                            } else {
                                Icon(imageVector = Icons.Default.Share, contentDescription = "Run pipeline")
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("توليد المحتوى بالذكاء الاصطناعي ✦ (تشغيل المسار المترابط)", fontWeight = FontWeight.Bold)
                            }
                        }
                        
                        // Status prompt about API
                        Text(
                            text = if (GeminiPipelineService.isConfigured) "⚡️ متصل بـ Google Vertex AI (Gemini 3.5 Flash Model)" else "🛡️ وضع المحاكاة عالي الدقة نشط (أدخل مفتاح GEMINI_API_KEY في لوحة الأسرار للاتصال المباشر)",
                            fontSize = 11.sp,
                            color = if (GeminiPipelineService.isConfigured) Color(0xFF16A34A) else MaterialTheme.colorScheme.secondary,
                            textAlign = TextAlign.Center,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
            }

            // Real-time Pipeline Visual Logging (Beautiful responsive feedback card)
            Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                
                if (isLoading) {
                    Card(
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                CircularProgressIndicator(modifier = Modifier.size(28.dp), strokeWidth = 3.dp)
                                Spacer(modifier = Modifier.width(12.dp))
                                Text("مراحل المعالجة الذكية في المنهج", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = MaterialTheme.colorScheme.onPrimaryContainer)
                            }
                            
                            processingStages.forEachIndexed { idx, stage ->
                                val isCurrent = idx == currentStageIndex
                                val isPassed = idx < currentStageIndex
                                val icon = when {
                                    isPassed -> "✅"
                                    isCurrent -> "⚡️"
                                    else -> "⏳"
                                }
                                val weight = if (isCurrent) FontWeight.Bold else FontWeight.Normal
                                val color = if (isCurrent) MaterialTheme.colorScheme.primary else if (isPassed) Color(0xFF16A34A) else MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f)

                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(vertical = 4.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(icon, fontSize = 14.sp)
                                    Spacer(modifier = Modifier.width(10.dp))
                                    Text(
                                        text = stage,
                                        fontSize = 12.sp,
                                        fontWeight = weight,
                                        color = color
                                    )
                                }
                            }
                            
                            LinearProgressIndicator(
                                progress = (currentStageIndex + 1).toFloat() / processingStages.size,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(top = 8.dp)
                            )
                        }
                    }
                }

                Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)) {
                    Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                        Text("سجل عمليات التوليد الأخيرة", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                        Text("تتبع الأنشطة وحالة النشر الفوري للحزم التعليمية المولدة بالوزارة.", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)

                        Divider()

                        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                            MockData.uploadJobs.reversed().take(5).forEach { job ->
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .background(MaterialTheme.colorScheme.surfaceVariant, RoundedCornerShape(8.dp))
                                        .padding(12.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(job.fileName, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                        Text(
                                            "نوع: ${job.fileType} | مادة: ${job.subject} | صف: ${job.grade}",
                                            fontSize = 10.sp,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                    }
                                    Box(
                                        modifier = Modifier
                                            .background(
                                                color = when (job.status) {
                                                    "Completed" -> Color(0xFFDCFCE7)
                                                    "Pending Review" -> Color(0xFFFEF08A)
                                                    else -> MaterialTheme.colorScheme.primaryContainer
                                                },
                                                shape = RoundedCornerShape(4.dp)
                                            )
                                            .padding(horizontal = 8.dp, vertical = 4.dp)
                                    ) {
                                        Text(
                                            text = if(job.status == "Completed") "منشور ومكتمل" else "بانتظار المراجعة",
                                            fontSize = 9.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = Color.Black
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// ==========================================
// 5. QUIZ EDITOR
// ==========================================
@Composable
fun AdminQuizEditor() {
    var selectedSubject by remember { mutableStateOf(MockData.subjects.firstOrNull()) }
    var selectedPack by remember { mutableStateOf<LearningPack?>(null) }
    
    var questionText by remember { mutableStateOf("") }
    var questionType by remember { mutableStateOf(QuestionType.MCQ) }
    var option1 by remember { mutableStateOf("") }
    var option2 by remember { mutableStateOf("") }
    var option3 by remember { mutableStateOf("") }
    var option4 by remember { mutableStateOf("") }
    var correctAns by remember { mutableStateOf("") }
    var explanationText by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        Text("Quiz Editor", fontSize = 28.sp, fontWeight = FontWeight.Bold)

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            // Column left: selectors
            Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                Text("Select Target Pack", fontSize = 14.sp, fontWeight = FontWeight.Bold)
                
                // Subject Dropdown mock
                Card {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text("Current Subject:", fontSize = 11.sp, color = MaterialTheme.colorScheme.primary)
                        MockData.subjects.forEach { s ->
                            Text(
                                text = "${s.icon} ${s.name}",
                                fontSize = 14.sp,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable { 
                                        selectedSubject = s 
                                        selectedPack = MockData.getLearningPacks(s.id).firstOrNull()
                                    }
                                    .background(if (selectedSubject?.id == s.id) MaterialTheme.colorScheme.secondaryContainer else Color.Transparent)
                                    .padding(8.dp)
                            )
                        }
                    }
                }

                // Pack Selector Dropdown
                selectedSubject?.let { subj ->
                    val packs = MockData.getLearningPacks(subj.id)
                    Card {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text("Current Pack:", fontSize = 11.sp, color = MaterialTheme.colorScheme.primary)
                            packs.forEach { p ->
                                Text(
                                    text = p.title,
                                    fontSize = 14.sp,
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable { selectedPack = p }
                                        .background(if (selectedPack?.id == p.id) MaterialTheme.colorScheme.primaryContainer else Color.Transparent)
                                        .padding(8.dp)
                                )
                            }
                        }
                    }
                }
            }

            // Column center: Questions List & Add form
            selectedPack?.let { pack ->
                val questionsList = MockData.getQuestionsForPack(pack.id)

                Column(modifier = Modifier.weight(2.5f), verticalArrangement = Arrangement.spacedBy(24.dp)) {
                    Card(modifier = Modifier.fillMaxWidth()) {
                        Column(modifier = Modifier.paddings(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                            Text("Quiz Questions in: ${pack.title}", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                            
                            questionsList.forEachIndexed { i, q ->
                                Column(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .background(MaterialTheme.colorScheme.surfaceVariant, RoundedCornerShape(8.dp))
                                        .padding(12.dp)
                                ) {
                                    Text("Q${i+1}: ${q.text}", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                    Text("Type: ${q.type.name} | Answer: ${q.correctAnswer}", fontSize = 12.sp, color = MaterialTheme.colorScheme.primary)
                                    if (q.options.isNotEmpty()) {
                                        Text("Options: ${q.options.joinToString()}", fontSize = 12.sp)
                                    }
                                }
                            }
                        }
                    }

                    // Form to append new question
                    Card(modifier = Modifier.fillMaxWidth()) {
                        Column(modifier = Modifier.paddings(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                            Text("Add Graded Question", fontSize = 18.sp, fontWeight = FontWeight.Bold)

                            OutlinedTextField(
                                value = questionText,
                                onValueChange = { questionText = it },
                                label = { Text("Question Text (Arabic / English)") },
                                modifier = Modifier.fillMaxWidth()
                              )

                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                                Button(onClick = { questionType = QuestionType.MCQ }, colors = ButtonDefaults.buttonColors(containerColor = if (questionType == QuestionType.MCQ) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant)) {
                                    Text("MCQ")
                                }
                                Button(onClick = { questionType = QuestionType.TF }, colors = ButtonDefaults.buttonColors(containerColor = if (questionType == QuestionType.TF) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant)) {
                                    Text("True/False")
                                }
                                Button(onClick = { questionType = QuestionType.FIB }, colors = ButtonDefaults.buttonColors(containerColor = if (questionType == QuestionType.FIB) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant)) {
                                    Text("Fill blank")
                                }
                            }

                            if (questionType == QuestionType.MCQ) {
                                Text("Provide standard multiple choice fields:", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    OutlinedTextField(value = option1, onValueChange = { option1 = it }, label = { Text("Opt 1") }, modifier = Modifier.weight(1f))
                                    OutlinedTextField(value = option2, onValueChange = { option2 = it }, label = { Text("Opt 2") }, modifier = Modifier.weight(1f))
                                    OutlinedTextField(value = option3, onValueChange = { option3 = it }, label = { Text("Opt 3") }, modifier = Modifier.weight(1f))
                                    OutlinedTextField(value = option4, onValueChange = { option4 = it }, label = { Text("Opt 4") }, modifier = Modifier.weight(1f))
                                }
                            }

                            OutlinedTextField(
                                value = correctAns,
                                onValueChange = { correctAns = it },
                                label = { Text("Exact Correct Answer Match") },
                                modifier = Modifier.fillMaxWidth()
                            )

                            OutlinedTextField(
                                value = explanationText,
                                onValueChange = { explanationText = it },
                                label = { Text("Step-by-step Gold Rubric Explanation (Arabic)") },
                                modifier = Modifier.fillMaxWidth(),
                                minLines = 2
                            )

                            Button(
                                onClick = {
                                    if (questionText.isNotEmpty() && correctAns.isNotEmpty()) {
                                        val opts = if (questionType == QuestionType.MCQ) listOf(option1, option2, option3, option4) else emptyList()
                                        MockData.addQuestionToPack(
                                            packId = pack.id,
                                            question = Question(
                                                id = "q_${System.currentTimeMillis()}",
                                                text = questionText,
                                                type = questionType,
                                                options = opts,
                                                correctAnswer = correctAns,
                                                explanation = explanationText,
                                                correctExplanation = "مؤكد! إجابتك ممتازة."
                                            )
                                        )
                                        questionText = ""
                                        correctAns = ""
                                        option1 = ""
                                        option2 = ""
                                        option3 = ""
                                        option4 = ""
                                        explanationText = ""
                                    }
                                },
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text("Append Question to App Database")
                            }
                        }
                    }
                }
            }
        }
    }
}

// ==========================================
// 6. SUMMARY EDITOR
// ==========================================
@Composable
fun AdminSummaryEditor() {
    var selectedSubject by remember { mutableStateOf(MockData.subjects.firstOrNull()) }
    var selectedPack by remember { mutableStateOf<LearningPack?>(null) }
    var summaryTextState by remember { mutableStateOf("") }

    // Synchronize selector changes
    LaunchedEffect(selectedSubject) {
        selectedSubject?.let { subj ->
            selectedPack = MockData.getLearningPacks(subj.id).firstOrNull()
        }
    }

    LaunchedEffect(selectedPack) {
        selectedPack?.let { pack ->
            summaryTextState = MockData.getSummary(pack.id)
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        Text("Summary Content Editor", fontSize = 28.sp, fontWeight = FontWeight.Bold)

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(24.dp)) {
            // Selectors column
            Card(modifier = Modifier.weight(1f)) {
                Column(modifier = Modifier.paddings(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                    Text("Select Subject", fontSize = 16.sp, fontWeight = FontWeight.Bold)
                    MockData.subjects.forEach { s ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(if (selectedSubject?.id == s.id) MaterialTheme.colorScheme.primaryContainer else Color.Transparent, RoundedCornerShape(8.dp))
                                .clickable { selectedSubject = s }
                                .padding(12.dp)
                        ) {
                            Text("${s.icon} ${s.name}")
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    selectedSubject?.let { subj ->
                        Text("Select Learning Pack", fontSize = 16.sp, fontWeight = FontWeight.Bold)
                        val packs = MockData.getLearningPacks(subj.id)
                        packs.forEach { p ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(if (selectedPack?.id == p.id) MaterialTheme.colorScheme.secondaryContainer else Color.Transparent, RoundedCornerShape(8.dp))
                                    .clickable { selectedPack = p }
                                    .padding(12.dp)
                            ) {
                                Text(p.title)
                            }
                        }
                    }
                }
            }

            // Editor column
            Card(modifier = Modifier.weight(2f)) {
                Column(modifier = Modifier.paddings(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                    selectedPack?.let { pack ->
                        Text("Summary Text for ${pack.title}", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                        Text("This text is rendered in the student App Summary Screen in real-time.", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)

                        OutlinedTextField(
                            value = summaryTextState,
                            onValueChange = { summaryTextState = it },
                            label = { Text("Arabic Summary Context (Html supported)") },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(300.dp),
                            minLines = 6
                        )

                        Button(
                            onClick = {
                                MockData.updateSummary(pack.id, summaryTextState)
                            },
                            modifier = Modifier.fillMaxWidth().height(48.dp)
                        ) {
                            Text("Save Summary")
                        }
                    } ?: Text("Select a learning pack to edit its summary.", modifier = Modifier.fillMaxWidth(), textAlign = TextAlign.Center)
                }
            }
        }
    }
}

// ==========================================
// 7. REVIEW QUEUE
// ==========================================
@Composable
fun AdminReviewQueue() {
    val pendingTasks = remember { MockData.reviewTasks }
    var editingTaskId by remember { mutableStateOf<String?>(null) }
    var isRegeneratingId by remember { mutableStateOf<String?>(null) }

    // Backup states for inline editing
    var editTitle by remember { mutableStateOf("") }
    var editSummary by remember { mutableStateOf("") }
    var editIsPremium by remember { mutableStateOf(true) }
    
    val scope = rememberCoroutineScope()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        Column {
            Text("AI Content Moderator & Auditor Panel", fontSize = 28.sp, fontWeight = FontWeight.Bold)
            Text(
                "لوحة مراجعة وتقويم المحتوى: اعتمد الملخصات والأسئلة المولدة بالذكاء الاصطناعي مع تقييم المعيار الذهبي.",
                fontSize = 14.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        val activeTasks = pendingTasks.filter { it.status == "Pending" }

        if (activeTasks.isEmpty()) {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                modifier = Modifier.fillMaxWidth()
            ) {
                Box(modifier = Modifier.padding(32.dp), contentAlignment = Alignment.Center) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("🎉 مكتمل بالكامل! لا توجد حزم معلقة في صف الانتظار حالياً.", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = MaterialTheme.colorScheme.primary)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text("جميع المخرجات تم مراجعتها واعتمادها لطلاب المرحلة المتوسطة بالمملكة.", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
            }
        } else {
            activeTasks.forEach { task ->
                val isEditing = editingTaskId == task.id
                val isRegenerating = isRegeneratingId == task.id

                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                        
                        // Header metadata Row
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                            Column {
                                if (isEditing) {
                                    OutlinedTextField(
                                        value = editTitle,
                                        onValueChange = { editTitle = it },
                                        label = { Text("عنوان الحزمة التعليمية (بالعربية)") },
                                        modifier = Modifier.width(320.dp)
                                    )
                                } else {
                                    Text("عنوان المسودة: ${task.packTitle}", fontSize = 20.sp, fontWeight = FontWeight.Bold)
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                                    Box(
                                        modifier = Modifier
                                            .background(MaterialTheme.colorScheme.primaryContainer, RoundedCornerShape(4.dp))
                                            .padding(horizontal = 8.dp, vertical = 2.dp)
                                    ) {
                                        Text(task.subjectName, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onPrimaryContainer)
                                    }
                                    Box(
                                        modifier = Modifier
                                            .background(MaterialTheme.colorScheme.secondaryContainer, RoundedCornerShape(4.dp))
                                            .padding(horizontal = 8.dp, vertical = 2.dp)
                                    ) {
                                        Text(task.gradeName, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSecondaryContainer)
                                    }
                                }
                            }

                            // Gold Rubric Score Badge
                            Column(horizontalAlignment = Alignment.End) {
                                val rubricColor = when {
                                    task.rubricScore >= 90 -> Color(0xFF16A34A) // ممتاز - Green
                                    task.rubricScore >= 80 -> Color(0xFFCA8A04) // جيد جداً - Yellow
                                    else -> Color(0xFFDC2626) // مراجعة / ضعيف - Red
                                }
                                val rubricLabel = when {
                                    task.rubricScore >= 90 -> "ممتاز (معيار ذهبي)"
                                    task.rubricScore >= 80 -> "جيد جداً (مقبول)"
                                    else -> "يحتاج مراجعة علمية"
                                }

                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(
                                        text = "${task.rubricScore}/100",
                                        fontSize = 28.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = rubricColor
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Box(
                                        modifier = Modifier
                                            .background(rubricColor.copy(alpha = 0.15f), RoundedCornerShape(4.dp))
                                            .padding(horizontal = 8.dp, vertical = 4.dp)
                                    ) {
                                        Text(rubricLabel, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = rubricColor)
                                    }
                                }
                                Text("تقييم الاعتماد الأكاديمي السعودي", fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                        }

                        // Detailed Rubric Explanation block
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f), RoundedCornerShape(8.dp))
                                .padding(12.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("📋 تقرير الجودة:", fontWeight = FontWeight.Bold, fontSize = 11.sp, color = MaterialTheme.colorScheme.secondary)
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(task.rubricDetails, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                        }

                        Divider()

                        // Free or Premium Setting Selector
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .border(1.dp, MaterialTheme.colorScheme.outlineVariant, RoundedCornerShape(8.dp))
                                .padding(12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text("تخصيص الحزمة التعليمية المنشورة لطلاب المملكة", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                Text("حدد باقة الحزمة التي ترغب بنشرها على منصة المدارس حالياً.", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                            if (isEditing) {
                                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    FilterChip(
                                        selected = !editIsPremium,
                                        onClick = { editIsPremium = false },
                                        label = { Text("🆓 عينة مجانية (Free)", fontSize = 11.sp) }
                                    )
                                    FilterChip(
                                        selected = editIsPremium,
                                        onClick = { editIsPremium = true },
                                        label = { Text("⭐ متميزة (Premium)", fontSize = 11.sp) }
                                    )
                                }
                            } else {
                                Text(
                                    text = if (task.isPremium) "⭐️ حزمة متميزة (خاضعة لاشتراك أهلي)" else "🆓 عينة مجانية (مفتوحة لجميع المدارس)",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (task.isPremium) MaterialTheme.colorScheme.primary else Color(0xFF16A34A)
                                )
                            }
                        }

                        // Summary Content Editor
                        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            Text("📝 ملخص الدرس المنهجي:", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                            if (isEditing) {
                                OutlinedTextField(
                                    value = editSummary,
                                    onValueChange = { editSummary = it },
                                    modifier = Modifier.fillMaxWidth(),
                                    minLines = 4,
                                    label = { Text("محتوى الملخص التعليمي (RTL Arabic)") }
                                )
                            } else {
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .background(MaterialTheme.colorScheme.surfaceVariant, RoundedCornerShape(8.dp))
                                        .padding(16.dp)
                                ) {
                                    Text(task.summaryDraft, fontSize = 13.sp, lineHeight = 20.sp)
                                }
                            }
                        }

                        // Questions Editor / Review List
                        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                                Text("🧠 بنك الأسئلة المولد (${task.questionsDraft.size} سؤال):", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                                Text("(15 اختبار متعدد، 10 إكمال فراغ، 5 صح وخطأ، 3 تفكير عليا)", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }

                            // Render editable questions or static previews
                            task.questionsDraft.forEachIndexed { qIdx, question ->
                                Card(
                                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween,
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Row(verticalAlignment = Alignment.CenterVertically) {
                                                Box(
                                                    modifier = Modifier
                                                        .size(24.dp)
                                                        .clip(CircleShape)
                                                        .background(MaterialTheme.colorScheme.secondary),
                                                    contentAlignment = Alignment.Center
                                                ) {
                                                    Text("${qIdx + 1}", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSecondary)
                                                }
                                                Spacer(modifier = Modifier.width(8.dp))
                                                Text(
                                                    text = when (question.type) {
                                                        QuestionType.MCQ -> "متعدد خيارات - MCQ"
                                                        QuestionType.FIB -> "إكمال فراغ - FIB"
                                                        QuestionType.TF -> "صح أم خطأ - TF"
                                                        QuestionType.HOQ -> "مهارات تفكير عليا - HOQ"
                                                    },
                                                    fontSize = 11.sp,
                                                    fontWeight = FontWeight.Bold,
                                                    color = MaterialTheme.colorScheme.secondary
                                                )
                                            }
                                        }

                                        if (isEditing) {
                                            // Editable question text
                                            OutlinedTextField(
                                                value = question.text,
                                                onValueChange = {
                                                    val updatedQ = question.copy(text = it)
                                                    task.questionsDraft[qIdx] = updatedQ
                                                    // Force recompose hack
                                                    editTitle = editTitle
                                                },
                                                label = { Text("صياغة السؤال") },
                                                modifier = Modifier.fillMaxWidth()
                                            )

                                            // If MCQ or HOQ, list options editable
                                            if (question.options.isNotEmpty() && question.type != QuestionType.TF) {
                                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                                    question.options.forEachIndexed { oIdx, opt ->
                                                        OutlinedTextField(
                                                            value = opt,
                                                            onValueChange = {
                                                                val newOpts = question.options.toMutableList()
                                                                newOpts[oIdx] = it
                                                                task.questionsDraft[qIdx] = question.copy(options = newOpts)
                                                                editTitle = editTitle
                                                            },
                                                            label = { Text("خيار ${oIdx + 1}") },
                                                            modifier = Modifier.weight(1f)
                                                        )
                                                    }
                                                }
                                            }

                                            // Correct Answer editable
                                            OutlinedTextField(
                                                value = question.correctAnswer,
                                                onValueChange = {
                                                    task.questionsDraft[qIdx] = question.copy(correctAnswer = it)
                                                    editTitle = editTitle
                                                },
                                                label = { Text("الجواب الصحيح المطابق") },
                                                modifier = Modifier.fillMaxWidth()
                                            )

                                            // Explanation editable
                                            OutlinedTextField(
                                                value = question.explanation,
                                                onValueChange = {
                                                    task.questionsDraft[qIdx] = question.copy(explanation = it)
                                                    editTitle = editTitle
                                                },
                                                label = { Text("شرح الجواب بالمعيار الذهبي") },
                                                modifier = Modifier.fillMaxWidth()
                                            )

                                        } else {
                                            // Static Preview
                                            Text(question.text, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                            
                                            if (question.options.isNotEmpty()) {
                                                Row(
                                                    modifier = Modifier.fillMaxWidth(),
                                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                                ) {
                                                    question.options.forEach { opt ->
                                                        val isCorrect = opt.trim() == question.correctAnswer.trim()
                                                        Box(
                                                            modifier = Modifier
                                                                .background(
                                                                    color = if (isCorrect) Color(0xFFDCFCE7) else MaterialTheme.colorScheme.surface,
                                                                    shape = RoundedCornerShape(4.dp)
                                                                )
                                                                .border(
                                                                    width = 1.dp,
                                                                    color = if (isCorrect) Color(0xFF16A34A) else MaterialTheme.colorScheme.outlineVariant,
                                                                    shape = RoundedCornerShape(4.dp)
                                                                )
                                                                .padding(horizontal = 8.dp, vertical = 4.dp)
                                                        ) {
                                                            Text(opt, fontSize = 11.sp, color = if (isCorrect) Color(0xFF166534) else MaterialTheme.colorScheme.onSurface)
                                                        }
                                                    }
                                                }
                                            } else {
                                                Text("الإجابة النموذجية للفراغ: (${question.correctAnswer})", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color(0xFF16A34A))
                                            }

                                            // STEP-BY-STEP Explanation preview
                                            Column(
                                                modifier = Modifier
                                                    .fillMaxWidth()
                                                    .background(MaterialTheme.colorScheme.surface.copy(alpha = 0.6f), RoundedCornerShape(6.dp))
                                                    .padding(8.dp)
                                            ) {
                                                Text("💡 التفسير المتدرج (Gold Rubric):", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.secondary)
                                                Text(question.explanation, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        Divider()

                        // Action Buttons Bar
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            // Reject Button (Leftmost)
                            OutlinedButton(
                                onClick = {
                                    task.status = "Rejected"
                                    // Remove from listing completely
                                    MockData.reviewTasks.remove(task)
                                },
                                colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFFDC2626)),
                                modifier = Modifier.height(44.dp)
                            ) {
                                Icon(imageVector = Icons.Default.Delete, contentDescription = "Reject", tint = Color(0xFFDC2626))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("رفض وحذف الحزمة")
                            }

                            // Secondary Actions & Approval (Rightmost)
                            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                                
                                if (isRegenerating) {
                                    CircularProgressIndicator(modifier = Modifier.size(24.dp), strokeWidth = 2.dp)
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text("جاري إعادة التوليد...", fontSize = 12.sp)
                                } else {
                                    // Regenerate AI Button
                                    OutlinedButton(
                                        onClick = {
                                            isRegeneratingId = task.id
                                            scope.launch {
                                                try {
                                                    // Trigger direct backend rewrite with task context
                                                    val regeneratedTask = GeminiPipelineService.generateContentPipeline(
                                                        inputText = "إعادة صياغة الدرس التعليمي وتغيير تركيز الأسئلة: ${task.packTitle} ${task.summaryDraft}",
                                                        manualSubjectName = task.subjectName,
                                                        manualGradeName = task.gradeName,
                                                        fileName = "regenerated_curriculum.pdf"
                                                    )
                                                    
                                                    // Update in items
                                                    val idx = MockData.reviewTasks.indexOfFirst { it.id == task.id }
                                                    if (idx != -1) {
                                                        MockData.reviewTasks[idx] = regeneratedTask
                                                    }
                                                } catch (e: Exception) {
                                                    // Rollback gracefully
                                                } finally {
                                                    isRegeneratingId = null
                                                }
                                            }
                                        },
                                        modifier = Modifier.height(44.dp)
                                    ) {
                                        Icon(imageVector = Icons.Default.Refresh, contentDescription = "Regenerate")
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text("إعادة التوليد الفوري ✦")
                                    }
                                }

                                // Edit Toggle Button
                                if (isEditing) {
                                    Button(
                                        onClick = {
                                            // Save local updates back into the task variables
                                            val idx = MockData.reviewTasks.indexOfFirst { it.id == task.id }
                                            if (idx != -1) {
                                                val originalTask = MockData.reviewTasks[idx]
                                                val updatedMockTask = originalTask.copy(
                                                    packTitle = editTitle,
                                                    summaryDraft = editSummary,
                                                    isPremium = editIsPremium
                                                )
                                                MockData.reviewTasks[idx] = updatedMockTask
                                            }
                                            editingTaskId = null
                                        },
                                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondary),
                                        modifier = Modifier.height(44.dp)
                                    ) {
                                        Icon(imageVector = Icons.Default.Done, contentDescription = "Save edit")
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text("حفظ التعديلات")
                                    }
                                } else {
                                    OutlinedButton(
                                        onClick = {
                                            editTitle = task.packTitle
                                            editSummary = task.summaryDraft
                                            editIsPremium = task.isPremium
                                            editingTaskId = task.id
                                        },
                                        modifier = Modifier.height(44.dp)
                                    ) {
                                        Icon(imageVector = Icons.Default.Edit, contentDescription = "Edit draft")
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text("تعديل يدوي")
                                    }
                                }

                                // Publish Button
                                Button(
                                    onClick = {
                                        // Set status approved and publish to matching database lists
                                        MockData.approveReviewTask(task.id)
                                        
                                        // Update corresponding simulated Upload Job to completed
                                        val matchingJobIdx = MockData.uploadJobs.indexOfFirst { it.fileName.substringBefore(".") == task.packTitle }
                                        if (matchingJobIdx != -1) {
                                            val originalJob = MockData.uploadJobs[matchingJobIdx]
                                            MockData.uploadJobs[matchingJobIdx] = originalJob.copy(status = "Completed")
                                        }
                                        
                                        // Remove task from listing
                                        MockData.reviewTasks.remove(task)
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF16A34A)),
                                    modifier = Modifier.height(44.dp)
                                ) {
                                    Icon(imageVector = Icons.Default.Check, contentDescription = "Publish", tint = Color.White)
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text("اعتماد ونشر للطلاب ✅")
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// ==========================================
// 8. USERS DIRECTORY
// ==========================================
@Composable
fun AdminUsersDirectory() {
    var searchQuery by remember { mutableStateOf("") }
    
    val mockStudents = remember {
        mutableStateListOf(
            Triple("أحمد خالد", "Grade 8", "Free"),
            Triple("سارة محمد", "Grade 7", "Premium"),
            Triple("ياسر علي", "Grade 9", "Free"),
            Triple("نورة سعود", "Grade 8", "Premium"),
            Triple("عمر فهد", "Grade 7", "Free")
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        Text("Students Directory", fontSize = 28.sp, fontWeight = FontWeight.Bold)

        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            label = { Text("Search by student name...") },
            modifier = Modifier.fillMaxWidth(),
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Search") }
        )

        Card(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.paddings(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                Text("Registered Profiles (${mockStudents.size})", fontSize = 18.sp, fontWeight = FontWeight.Bold)

                mockStudents.filter { it.first.contains(searchQuery) || searchQuery.isEmpty() }.forEachIndexed { index, student ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(MaterialTheme.colorScheme.surfaceVariant, RoundedCornerShape(8.dp))
                            .padding(12.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(student.first, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                            Text("Current Level: ${student.second}", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .background(if (student.third == "Premium") Color(0xFFFFD700) else Color.LightGray, RoundedCornerShape(8.dp))
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text(student.third, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.Black)
                            }
                            Spacer(modifier = Modifier.width(16.dp))
                            // Action button to mock change status
                            TextButton(
                                onClick = {
                                    val current = mockStudents[index]
                                    val nextStatus = if (current.third == "Premium") "Free" else "Premium"
                                    mockStudents[index] = Triple(current.first, current.second, nextStatus)
                                }
                            ) {
                                Text("Toggle Plan")
                            }
                        }
                    }
                }
            }
        }
    }
}

// ==========================================
// 9. SYSTEM ANALYTICS
// ==========================================
@Composable
fun AdminAnalyticsDashboard() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        Text("System Learning Analytics", fontSize = 28.sp, fontWeight = FontWeight.Bold)

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            StatItemCard(modifier = Modifier.weight(1f), title = "Average Score", value = "%82.4", subtitle = "Statewide exam index", color = MaterialTheme.colorScheme.primaryContainer)
            StatItemCard(modifier = Modifier.weight(1f), title = "Engagement Index", value = "4.2 hrs/wk", subtitle = "Average study time", color = MaterialTheme.colorScheme.secondaryContainer)
            StatItemCard(modifier = Modifier.weight(1f), title = "Active Streaks", value = "🔥 14 Days", subtitle = "Peer top record", color = Color(0xFFFBCFE8))
        }

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(24.dp)) {
            // Difficulty hot topics
            Card(modifier = Modifier.weight(1f)) {
                Column(modifier = Modifier.paddings(), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text("Top Weak Subjects Heatmap", fontSize = 18.sp, fontWeight = FontWeight.Bold)

                    Text("1. الرياضيات - المعادلات الخطية (48% Accuracy)", fontSize = 13.sp, color = MaterialTheme.colorScheme.error)
                    LinearProgressIndicator(progress = 0.48f, color = MaterialTheme.colorScheme.error, modifier = Modifier.fillMaxWidth())

                    Text("2. العلوم - الخلايا الحية (62% Accuracy)", fontSize = 13.sp, color = MaterialTheme.colorScheme.primary)
                    LinearProgressIndicator(progress = 0.62f, color = MaterialTheme.colorScheme.primary, modifier = Modifier.fillMaxWidth())

                    Text("3. اللغة العربية - النواسخ (75% Accuracy)", fontSize = 13.sp, color = MaterialTheme.colorScheme.secondary)
                    LinearProgressIndicator(progress = 0.75f, color = MaterialTheme.colorScheme.secondary, modifier = Modifier.fillMaxWidth())
                }
            }

            // Interactive chart placeholder
            Card(modifier = Modifier.weight(1f)) {
                Column(modifier = Modifier.paddings(), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text("Conversion Analytics (Last 30 Days)", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    Text("Conversions: 42 users became Premium this month", fontSize = 13.sp)
                    
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(140.dp)
                            .background(MaterialTheme.colorScheme.surfaceVariant),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("Conversion Graph (Exponential Growth Up!)")
                    }
                }
            }
        }
    }
}

// ==========================================
// 10. SUBSCRIPTIONS PRICING
// ==========================================
@Composable
fun AdminSubscriptionManager() {
    var singlePrice by remember { mutableStateOf("39 SAR") }
    var familyPrice by remember { mutableStateOf("99 SAR") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        Text("Store Subscription Billing Manager", fontSize = 28.sp, fontWeight = FontWeight.Bold)
        Text("Configure Google Play Store and Apple App Store in-app purchase credentials and local pricing options.", fontSize = 14.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(24.dp)) {
            Card(
                modifier = Modifier.weight(1f),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(modifier = Modifier.paddings(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                    Text("Google Play Billing", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                    
                    OutlinedTextField(
                        value = singlePrice,
                        onValueChange = { singlePrice = it },
                        label = { Text("Single User Plan Price") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = familyPrice,
                        onValueChange = { familyPrice = it },
                        label = { Text("Family Plan Price (up to 4 profiles)") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    Button(
                        onClick = { /* Updates play billing mock */ },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Sync Pricing to Play Store Console")
                    }
                }
            }

            Card(
                modifier = Modifier.weight(1f),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(modifier = Modifier.paddings(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                    Text("App Store Connect Integrations", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFFA21CAF))
                    
                    Text("IAP Product Identifiers Active:", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    Text("- com.saudilearning.intermediate.single (Single User)", fontSize = 12.sp)
                    Text("- com.saudilearning.intermediate.family (Family Shared)", fontSize = 12.sp)

                    Divider()

                    Text("Purchase restorations are handled automatically in the mobile app via local JWT receipt verifications.", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
        }
    }
}

// ==========================================
// 11. GAMIFICATION SETTINGS
// ==========================================
@Composable
fun AdminGamificationRules() {
    var summaryXp by remember { mutableStateOf("${MockData.xpForSummary}") }
    var correctXp by remember { mutableStateOf("${MockData.xpForCorrectAnswer}") }
    var quizXp by remember { mutableStateOf("${MockData.xpForQuizCompletion}") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        Text("Gamification Rules Editor", fontSize = 28.sp, fontWeight = FontWeight.Bold)

        Card(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.paddings(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                Text("Configure Points Allocation Scale", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                Text("Modify points parameters to let the backend Gamification engine update daily rewards and streak milestones.", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)

                OutlinedTextField(
                    value = summaryXp,
                    onValueChange = { summaryXp = it },
                    label = { Text("XP Gained for Reading Summary") },
                    modifier = Modifier.fillMaxWidth()
                )

                OutlinedTextField(
                    value = correctXp,
                    onValueChange = { correctXp = it },
                    label = { Text("XP Gained per Correct Answer") },
                    modifier = Modifier.fillMaxWidth()
                )

                OutlinedTextField(
                    value = quizXp,
                    onValueChange = { quizXp = it },
                    label = { Text("XP Gained upon completing full Quiz") },
                    modifier = Modifier.fillMaxWidth()
                )

                Button(
                    onClick = {
                        MockData.xpForSummary = summaryXp.toIntOrNull() ?: MockData.xpForSummary
                        MockData.xpForCorrectAnswer = correctXp.toIntOrNull() ?: MockData.xpForCorrectAnswer
                        MockData.xpForQuizCompletion = quizXp.toIntOrNull() ?: MockData.xpForQuizCompletion
                    },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Apply System XP Metrics")
                }
            }
        }
    }
}

// ==========================================
// 12. NOTIFICATION BROADCASTER
// ==========================================
@Composable
fun AdminNotificationManager() {
    var title by remember { mutableStateOf("") }
    var body by remember { mutableStateOf("") }
    var type by remember { mutableStateOf("admin announcement") } // default type
    var showSuccessBanner by remember { mutableStateOf(false) }
    var successMessage by remember { mutableStateOf("") }

    // Preset templates for easy campaign, announcements and reminders broadcasts
    val templates = listOf(
        com.example.ui.screens.admin.TemplateData(
            label = "تذكير يومي دراسي 🎯",
            type = "daily reminder",
            title = "تحدي اليوم بالانتظار 🎯",
            body = "لا تنسَ حل تحدي اليوم للمحافظة على السلسلة والتقدم الدائم!"
        ),
        com.example.ui.screens.admin.TemplateData(
            label = "تذكير حماسة السلسلة 🔥",
            type = "streak reminder",
            title = "حافظ على سلسلتك اليومية 🔥",
            body = "حافظ على سلسلتك اليومية. يتبقى لك درس وتحدٍ واحد لليوم لتأمين التتابع الدائم وتحقيق اللقب الأسبوعي!"
        ),
        com.example.ui.screens.admin.TemplateData(
            label = "فتح شارة إنجاز مكتشف 🏆",
            type = "badge unlocked",
            title = "تهانينا! حصلت على شارة جديدة 🏆",
            body = "تهانينا بطلنا! لقد حصلت على شارة عبقري العلوم لتميزك الباهر وسرعة إنجازك في مادة العلوم!"
        ),
        com.example.ui.screens.admin.TemplateData(
            label = "مراجعة نقاط ضعف علمية 📚",
            type = "weak topic reminder",
            title = "مشاركات المنهج الدراسي 📚",
            body = "مستواك في مادة العلوم يحتاج إلى تعزيز بسيط. ننصحك بإجراء مراجعة سريعة لحزمة التفاعلات الكيميائية غداً."
        ),
        com.example.ui.screens.admin.TemplateData(
            label = "تغير مركز المتصدرين 📈",
            type = "leaderboard movement",
            title = "تحديث قائمة المتصدرين 📈",
            body = "تراجع ترتيبك للمركز الثالث في مادة الرياضيات! زملائك يتنافسون بقوة، عد لتصدر القائمة وجني النجوم!"
        ),
        com.example.ui.screens.admin.TemplateData(
            label = "تذكير عروض البريميوم ⭐",
            type = "premium reminder",
            title = "ترقية الحساب المميز للوصول الكامل ⭐",
            body = "باقة الاشتراك الكامل متوفرة الآن لعائلتكم! احصل على وصول غير محدود لجميع التمارين والميزات والأوراق الأكاديمية."
        ),
        com.example.ui.screens.admin.TemplateData(
            label = "إعلان الإدارة الرسمي 📣",
            type = "admin announcement",
            title = "إعلان هام من إدارة المنصة 📣",
            body = "سيتم تحديث دروس المهارات الرقمية المضافة حديثاً للمرحلة المتوسطة غداً صباحاً لتحسين تجربتكم التعليمية."
        )
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text("Notification & Campaign Manager", fontSize = 28.sp, fontWeight = FontWeight.Bold)
                Text("Compose administrative announcements, campaigns, and reminders for Saudi intermediate school students.", fontSize = 14.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }

        if (showSuccessBanner) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(successMessage, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onPrimaryContainer, modifier = Modifier.weight(1f))
                    TextButton(onClick = { showSuccessBanner = false }) {
                        Text("Dismiss", color = MaterialTheme.colorScheme.primary)
                    }
                }
            }
        }

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(24.dp)) {
            // Compose Section
            Card(modifier = Modifier.weight(1f)) {
                Column(modifier = Modifier.paddings(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                    Text("1. Select Campaign Category", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    
                    // Simple select chips LTR to LTR
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        val typesList = listOf(
                            "Reminders" to "daily reminder",
                            "Campaigns" to "premium reminder",
                            "Announcements" to "admin announcement"
                        )
                        typesList.forEach { (label, value) ->
                            val isSelected = type == value
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant)
                                    .clickable { type = value }
                                    .border(1.dp, if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outlineVariant, RoundedCornerShape(12.dp))
                                    .padding(horizontal = 12.dp, vertical = 8.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = label,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (isSelected) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(4.dp))
                    Text("2. Quick Preset Templates (Arabic)", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    Text("Click on a template to automatically fill in the heading and message body below:", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)

                    // Scrollable presets block
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        val filteredList = templates.filter { 
                            when (type) {
                                "daily reminder" -> it.type in listOf("daily reminder", "streak reminder", "badge unlocked")
                                "premium reminder" -> it.type in listOf("premium reminder", "leaderboard movement")
                                else -> it.type in listOf("admin announcement", "weak topic reminder")
                            }
                        }
                        
                        filteredList.forEach { temp ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(MaterialTheme.colorScheme.secondaryContainer, RoundedCornerShape(12.dp))
                                    .clickable {
                                        title = temp.title
                                        body = temp.body
                                        type = temp.type
                                    }
                                    .padding(horizontal = 12.dp, vertical = 8.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(temp.label, fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSecondaryContainer)
                                Text("Use Template →", fontSize = 10.sp, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(4.dp))
                    Text("3. Customize Message Details", fontSize = 18.sp, fontWeight = FontWeight.Bold)

                    Text("Selected Type: ${type.uppercase()}", fontSize = 11.sp, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)

                    OutlinedTextField(
                        value = title,
                        onValueChange = { title = it },
                        label = { Text("Short Heading (In Arabic)") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = body,
                        onValueChange = { body = it },
                        label = { Text("Message Body (In Arabic, e.g. لا تنسَ حل تحدي اليوم!)") },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 3
                    )

                    Button(
                        onClick = {
                            if (title.isNotEmpty() && body.isNotEmpty()) {
                                MockData.sendNotification(
                                    NotificationDraft(
                                        id = "not_${System.currentTimeMillis()}",
                                        title = title,
                                        body = body,
                                        type = type,
                                        sentAt = "2026-05-22 10:48"
                                    )
                                )
                                successMessage = "Campaign broadcasted to all intermediate devices!"
                                showSuccessBanner = true
                                title = ""
                                body = ""
                            }
                        },
                        enabled = title.isNotEmpty() && body.isNotEmpty(),
                        modifier = Modifier.fillMaxWidth().height(48.dp)
                    ) {
                        Text("Broadcast Live to Saudi Devices")
                    }
                }
            }

            // Logs Row
            Card(modifier = Modifier.weight(1.3f)) {
                Column(modifier = Modifier.paddings(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Sent Notifications Logs History", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                        Text("${MockData.sentNotifications.size} Broadcasts", fontSize = 12.sp, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.SemiBold)
                    }

                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        MockData.sentNotifications.reversed().forEach { log ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(MaterialTheme.colorScheme.surfaceVariant, RoundedCornerShape(12.dp))
                                    .padding(12.dp),
                                horizontalArrangement = Arrangement.spacedBy(12.dp),
                                verticalAlignment = Alignment.Top
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(32.dp)
                                        .background(Color.White.copy(alpha = 0.5f), CircleShape),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        when (log.type.lowercase().trim()) {
                                            "daily reminder" -> "🎯"
                                            "streak reminder" -> "🔥"
                                            "badge unlocked" -> "🏆"
                                            "leaderboard movement" -> "📈"
                                            "weak topic reminder" -> "📚"
                                            "premium reminder" -> "⭐"
                                            "admin announcement" -> "📣"
                                            else -> "🔔"
                                        },
                                        fontSize = 14.sp
                                    )
                                }

                                Column(modifier = Modifier.weight(1f)) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(
                                            text = when (log.type.lowercase().trim()) {
                                                "daily reminder" -> "تذكير يومي"
                                                "streak reminder" -> "حافظ على السلسلة"
                                                "badge unlocked" -> "إنجاز جديد"
                                                "leaderboard movement" -> "لوحة الصدارة"
                                                "weak topic reminder" -> "نقاط تحسين"
                                                "premium reminder" -> "عرض متميز"
                                                "admin announcement" -> "إعلان هام"
                                                else -> "تنبيه عام"
                                            },
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 11.sp,
                                            color = MaterialTheme.colorScheme.primary
                                        )
                                        Text(log.sentAt, fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                    }
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(log.title, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = MaterialTheme.colorScheme.onSurface)
                                    Spacer(modifier = Modifier.height(2.dp))
                                    Text(log.body, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// Support model inside package scope
data class TemplateData(
    val label: String,
    val type: String,
    val title: String,
    val body: String
)

// ==========================================
// UTILITY HELPERS
// ==========================================
@Composable
fun StatItemCard(
    modifier: Modifier = Modifier,
    title: String,
    value: String,
    subtitle: String,
    color: Color
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = color)
    ) {
        Column(modifier = Modifier.paddings()) {
            Text(title, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.Black.copy(alpha = 0.6f))
            Spacer(modifier = Modifier.height(8.dp))
            Text(value, fontSize = 28.sp, fontWeight = FontWeight.Bold, color = Color.Black)
            Spacer(modifier = Modifier.height(4.dp))
            Text(subtitle, fontSize = 11.sp, color = Color.Black.copy(alpha = 0.6f))
        }
    }
}

@Composable
fun StepIndicator(
    modifier: Modifier = Modifier,
    num: String,
    title: String,
    desc: String
) {
    Column(
        modifier = modifier.padding(12.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .size(36.dp)
                .clip(CircleShape)
                .background(MaterialTheme.colorScheme.primary),
            contentAlignment = Alignment.Center
        ) {
            Text(num, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onPrimary)
        }
        Spacer(modifier = Modifier.height(8.dp))
        Text(title, fontWeight = FontWeight.Bold, fontSize = 14.sp)
        Text(desc, fontSize = 11.sp, textAlign = TextAlign.Center, color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

// Standard Padding multiplier
fun Modifier.paddings(): Modifier = this.padding(16.dp)
