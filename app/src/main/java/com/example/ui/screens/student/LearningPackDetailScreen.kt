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
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = pack?.title ?: "الحزمة التعليمية",
                        fontWeight = FontWeight.Bold,
                        fontSize = 20.sp
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
                    .widthIn(max = 600.dp)
                    .verticalScroll(rememberScrollState())
                    .padding(horizontal = 16.dp, vertical = 20.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Header card
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.4f)
                    )
                ) {
                    Column(
                        modifier = Modifier.padding(20.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "بوابة المذاكرة والاختبار الذكي 🎯",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary,
                            textAlign = TextAlign.Center
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = pack?.description ?: "اختر النشاط التعليمي والنمط الذي تفضل التدرب عليه الآن لتطوير مهاراتك.",
                            fontSize = 13.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            textAlign = TextAlign.Center,
                            lineHeight = 18.sp
                        )
                    }
                }

                Text(
                    text = "الأنشطة المتاحة في الحزمة 💫",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onBackground,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 4.dp),
                    textAlign = TextAlign.Start
                )

                // 1. Summary Card
                ActivityChoiceCard(
                    icon = "📄",
                    title = "ملخص الدرس الشامل والمفاهيم",
                    description = "استعراض ملخص ذكي، مراجعة المصطلحات الأساسية والخرائط الميسرة للحفظ السريع.",
                    rewardText = "+5 XP فوري",
                    badgeColor = Color(0xFFE0F2FE),
                    badgeTextColor = Color(0xFF0369A1),
                    onClick = { navController.navigate("summary_screen/$packId") }
                )

                // 2. MCQ Card
                ActivityChoiceCard(
                    icon = "❓",
                    title = "تدريب الخيار المتعدد (MCQ)",
                    description = "مجموعة أسئلة تختار فيها إجابة واحدة صحيحة لاختبار الفهم النظري والمفاهيمي.",
                    rewardText = "+2 XP لكل سؤال",
                    badgeColor = Color(0xFFF1F5F9),
                    badgeTextColor = Color(0xFF334155),
                    onClick = { navController.navigate("quiz_screen/$packId/mcq") }
                )

                // 3. FIB Card
                ActivityChoiceCard(
                    icon = "✏️",
                    title = "تحدي إكمال الفراغات (FIB)",
                    description = "اكتب الكلمة أو المصطلح الصحيح في الفراغ لتثبيت المصطلحات العلمية بدقة هائلة.",
                    rewardText = "+2 XP لكل سؤال",
                    badgeColor = Color(0xFFFEF3C7),
                    badgeTextColor = Color(0xFFB45309),
                    onClick = { navController.navigate("quiz_screen/$packId/fib") }
                )

                // 4. TF Card
                ActivityChoiceCard(
                    icon = "✔️",
                    title = "مبارزة الصح والخطأ (TF)",
                    description = "أسئلة سريعة وممتعة للتأكد من المبرهنات والقواعد والمسلمات دون تشتيت.",
                    rewardText = "+2 XP لكل سؤال",
                    badgeColor = Color(0xFFDCFCE7),
                    badgeTextColor = Color(0xFF15803D),
                    onClick = { navController.navigate("quiz_screen/$packId/tf") }
                )

                // 5. HOQ Card
                ActivityChoiceCard(
                    icon = "🧠",
                    title = "مهارات التفكير العليا (HOQ)",
                    description = "أسئلة ذكية للطلاب المتفوقين تتطلب التحليل، التركيب والتطبيق الرياضي العميق.",
                    rewardText = "+2 XP وتفوق ذهني",
                    badgeColor = Color(0xFFF3E8FF),
                    badgeTextColor = Color(0xFF7E22CE),
                    onClick = { navController.navigate("quiz_screen/$packId/hoq") }
                )

                Spacer(modifier = Modifier.height(8.dp))

                // 6. Full Exam Card (Highlighted)
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(
                            width = 2.dp,
                            brush = Brush.horizontalGradient(
                                colors = listOf(Color(0xFFFFD700), Color(0xFFF59E0B))
                            ),
                            shape = RoundedCornerShape(24.dp)
                        )
                        .clickable { navController.navigate("quiz_screen/$packId/all") },
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = Color(0xFFFFFDF0)
                    )
                ) {
                    Column(
                        modifier = Modifier.padding(20.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(48.dp)
                                    .background(Color(0xFFFEF3C7), CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                Text("⚡", fontSize = 24.sp)
                            }
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = "الاختبار التقييمي المتكامل (شامل)",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFF92400E)
                                )
                                Text(
                                    text = "جميع الأنماط مجتمعة للتأكد التام من استحقاق الشارات والتميز الدراسي.",
                                    fontSize = 11.sp,
                                    color = Color(0xFFB45309),
                                    lineHeight = 15.sp
                                )
                            }
                        }
                        
                        Spacer(modifier = Modifier.height(14.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .background(Color(0xFFFEF3C7), RoundedCornerShape(8.dp))
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text(
                                    text = "🏆 اختبار شامل: MCQ + FIB + TF + HOQ",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFF92400E)
                                )
                            }
                            Text(
                                text = "حتى +50 XP وكومبو ⚡",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFFD97706)
                            )
                        }
                    }
                }
                
                Spacer(modifier = Modifier.height(24.dp))
            }
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
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.5f))
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .background(MaterialTheme.colorScheme.surfaceVariant, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Text(text = icon, fontSize = 22.sp)
            }

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = description,
                    fontSize = 11.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    lineHeight = 15.sp
                )
                Spacer(modifier = Modifier.height(6.dp))
                Box(
                    modifier = Modifier
                        .background(badgeColor, RoundedCornerShape(6.dp))
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = rewardText,
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        color = badgeTextColor
                    )
                }
            }
        }
    }
}
