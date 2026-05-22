package com.example.ui.screens.student

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
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
import com.example.data.mock.MockData

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LearningPackDetailScreen(packId: String, navController: NavController) {
    val pack = remember(packId) {
        MockData.subjects.flatMap { s -> MockData.getLearningPacks(s.id) }
            .find { it.id == packId }
    }

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = pack?.title ?: "الحزمة التعليمية",
                        fontWeight = FontWeight.ExtraBold,
                        fontSize = 19.sp
                    )
                },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(imageVector = Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "رجوع")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background)
            )
        }
    ) { padding ->
        Box(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background),
            contentAlignment = Alignment.TopCenter
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .widthIn(max = 620.dp)
                    .verticalScroll(rememberScrollState())
                    .padding(horizontal = 16.dp, vertical = 14.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                LearningPackHeroCard(
                    title = pack?.title ?: "الحزمة التعليمية",
                    description = pack?.description ?: "اختر النشاط التعليمي والنمط الذي تفضل التدرب عليه الآن لتطوير مهاراتك.",
                    progress = pack?.progress ?: 0,
                    isPremium = pack?.isPremium ?: false
                )

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 4.dp, bottom = 2.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                        Text(
                            text = "الأنشطة المتاحة",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = MaterialTheme.colorScheme.onBackground
                        )
                        Text(
                            text = "ابدأ بالملخص ثم اختبر نفسك حسب نوع السؤال",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    Surface(shape = RoundedCornerShape(14.dp), color = MaterialTheme.colorScheme.primary.copy(alpha = 0.10f)) {
                        Text(
                            text = "5 أنشطة",
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 7.dp),
                            fontSize = 12.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                }

                ActivityChoiceCard(
                    icon = "📄",
                    title = "ملخص الدرس الشامل",
                    description = "راجع المفاهيم الأساسية، الأمثلة، والنقاط المهمة قبل الدخول إلى الاختبار.",
                    rewardText = "+5 XP",
                    badgeColor = Color(0xFFE0F2FE),
                    badgeTextColor = Color(0xFF0369A1),
                    accentColor = Color(0xFF0284C7),
                    onClick = { navController.navigate("summary_screen/$packId") }
                )

                ActivityChoiceCard(
                    icon = "❓",
                    title = "تدريب الاختيار المتعدد MCQ",
                    description = "اختبر فهمك من خلال أسئلة مباشرة بأسلوب الامتحانات.",
                    rewardText = "+2 XP لكل سؤال",
                    badgeColor = Color(0xFFF1F5F9),
                    badgeTextColor = Color(0xFF334155),
                    accentColor = Color(0xFF475569),
                    onClick = { navController.navigate("quiz_screen/$packId/mcq") }
                )

                ActivityChoiceCard(
                    icon = "✏️",
                    title = "إكمال الفراغات FIB",
                    description = "ثبّت المصطلحات والكلمات المهمة بكتابة الإجابة الصحيحة.",
                    rewardText = "+2 XP لكل سؤال",
                    badgeColor = Color(0xFFFEF3C7),
                    badgeTextColor = Color(0xFFB45309),
                    accentColor = Color(0xFFD97706),
                    onClick = { navController.navigate("quiz_screen/$packId/fib") }
                )

                ActivityChoiceCard(
                    icon = "✔️",
                    title = "صح أو خطأ TF",
                    description = "أسئلة سريعة للتأكد من القواعد والحقائق الأساسية بدون تشتيت.",
                    rewardText = "+2 XP لكل سؤال",
                    badgeColor = Color(0xFFDCFCE7),
                    badgeTextColor = Color(0xFF15803D),
                    accentColor = Color(0xFF16A34A),
                    onClick = { navController.navigate("quiz_screen/$packId/tf") }
                )

                ActivityChoiceCard(
                    icon = "🧠",
                    title = "مهارات التفكير العليا HOQ",
                    description = "أسئلة تحليلية للطلاب المتفوقين تحتاج فهم وربط واستنتاج.",
                    rewardText = "+2 XP وتفوق ذهني",
                    badgeColor = Color(0xFFF3E8FF),
                    badgeTextColor = Color(0xFF7E22CE),
                    accentColor = Color(0xFF9333EA),
                    onClick = { navController.navigate("quiz_screen/$packId/hoq") }
                )

                FullExamCard(onClick = { navController.navigate("quiz_screen/$packId/all") })

                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}

@Composable
private fun LearningPackHeroCard(title: String, description: String, progress: Int, isPremium: Boolean) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(30.dp))
            .background(
                Brush.linearGradient(
                    listOf(
                        MaterialTheme.colorScheme.primaryContainer,
                        MaterialTheme.colorScheme.primary.copy(alpha = 0.18f)
                    )
                )
            )
            .padding(20.dp)
    ) {
        Box(
            modifier = Modifier
                .size(118.dp)
                .align(Alignment.BottomStart)
                .offset(x = (-34).dp, y = 34.dp)
                .clip(CircleShape)
                .background(Color.White.copy(alpha = 0.22f))
        )

        Column(verticalArrangement = Arrangement.spacedBy(15.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text(
                        text = "بوابة المذاكرة الذكية 🎯",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Text(
                        text = title,
                        fontSize = 25.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = MaterialTheme.colorScheme.onPrimaryContainer,
                        lineHeight = 31.sp
                    )
                    Text(
                        text = description,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        lineHeight = 20.sp
                    )
                }
                Box(
                    modifier = Modifier
                        .size(64.dp)
                        .clip(RoundedCornerShape(20.dp))
                        .background(Color.White.copy(alpha = 0.45f)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(if (isPremium) "👑" else "📘", fontSize = 34.sp)
                }
            }

            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), verticalAlignment = Alignment.CenterVertically) {
                LearningPackHeroChip(value = "Summary", label = "ملخص")
                LearningPackHeroChip(value = "Quiz", label = "اختبار")
                LearningPackHeroChip(value = "+XP", label = "مكافآت")
            }

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(12.dp)
                    .clip(RoundedCornerShape(50))
                    .background(Color.White.copy(alpha = 0.55f))
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth(progress.coerceIn(0, 100) / 100f)
                        .height(12.dp)
                        .clip(RoundedCornerShape(50))
                        .background(MaterialTheme.colorScheme.primary)
                )
            }
        }
    }
}

@Composable
private fun LearningPackHeroChip(value: String, label: String) {
    Surface(
        shape = RoundedCornerShape(15.dp),
        color = Color.White.copy(alpha = 0.55f),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color.White.copy(alpha = 0.40f))
    ) {
        Column(
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 7.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(value, fontSize = 12.5.sp, fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.primary)
            Text(label, fontSize = 10.5.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable
fun ActivityChoiceCard(
    icon: String,
    title: String,
    description: String,
    rewardText: String,
    badgeColor: Color,
    badgeTextColor: Color,
    accentColor: Color,
    onClick: () -> Unit
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(22.dp),
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 2.dp,
        shadowElevation = 2.dp,
        border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.55f))
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(52.dp)
                    .clip(RoundedCornerShape(17.dp))
                    .background(accentColor.copy(alpha = 0.14f)),
                contentAlignment = Alignment.Center
            ) {
                Text(text = icon, fontSize = 25.sp)
            }

            Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(5.dp)) {
                Text(
                    text = title,
                    fontSize = 14.5.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = MaterialTheme.colorScheme.onSurface,
                    lineHeight = 20.sp
                )
                Text(
                    text = description,
                    fontSize = 11.5.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    lineHeight = 16.sp
                )
                Surface(shape = RoundedCornerShape(7.dp), color = badgeColor) {
                    Text(
                        text = rewardText,
                        modifier = Modifier.padding(horizontal = 7.dp, vertical = 3.dp),
                        fontSize = 9.5.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = badgeTextColor
                    )
                }
            }

            Surface(shape = RoundedCornerShape(14.dp), color = accentColor.copy(alpha = 0.12f)) {
                Text(
                    text = "ابدأ",
                    modifier = Modifier.padding(horizontal = 11.dp, vertical = 8.dp),
                    fontSize = 12.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = accentColor
                )
            }
        }
    }
}

@Composable
private fun FullExamCard(onClick: () -> Unit) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .border(
                width = 1.5.dp,
                brush = Brush.horizontalGradient(listOf(Color(0xFFFFD700), Color(0xFFF59E0B))),
                shape = RoundedCornerShape(26.dp)
            )
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(26.dp),
        color = Color(0xFFFFFDF0),
        tonalElevation = 3.dp,
        shadowElevation = 3.dp
    ) {
        Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(14.dp)) {
                Box(
                    modifier = Modifier
                        .size(54.dp)
                        .background(Color(0xFFFEF3C7), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text("⚡", fontSize = 27.sp)
                }
                Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Text(
                        text = "الاختبار الشامل",
                        fontSize = 17.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = Color(0xFF92400E)
                    )
                    Text(
                        text = "MCQ + FIB + TF + HOQ في اختبار واحد لتقييم فهمك بالكامل.",
                        fontSize = 11.5.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color(0xFFB45309),
                        lineHeight = 16.sp
                    )
                }
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Surface(shape = RoundedCornerShape(9.dp), color = Color(0xFFFEF3C7)) {
                    Text(
                        text = "🏆 أفضل خيار قبل الامتحان",
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 5.dp),
                        fontSize = 10.5.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = Color(0xFF92400E)
                    )
                }
                Text(
                    text = "حتى +50 XP",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = Color(0xFFD97706)
                )
            }
        }
    }
}
