package com.example.ui.screens.student

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateListOf
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
import com.example.data.backend.BackendService
import com.example.domain.models.Subject

@Composable
fun SubjectsScreen(navController: NavController) {
    val subjects = remember { mutableStateListOf<Subject>() }

    LaunchedEffect(Unit) {
        val list = BackendService.fetchSubjects()
        subjects.clear()
        subjects.addAll(list)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        SubjectsHeroHeader(totalSubjects = subjects.size)

        LazyColumn(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            contentPadding = PaddingValues(bottom = 18.dp)
        ) {
            items(subjects) { subject ->
                PremiumSubjectCard(
                    subject = subject,
                    onClick = { navController.navigate("subject_detail/${subject.id}") }
                )
            }
        }
    }
}

@Composable
private fun SubjectsHeroHeader(totalSubjects: Int) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(28.dp))
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
                .size(96.dp)
                .align(Alignment.BottomStart)
                .offset(x = (-28).dp, y = 26.dp)
                .clip(RoundedCornerShape(40.dp))
                .background(Color.White.copy(alpha = 0.22f))
        )

        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(
                text = "المواد الدراسية",
                fontSize = 25.sp,
                fontWeight = FontWeight.ExtraBold,
                color = MaterialTheme.colorScheme.onPrimaryContainer
            )
            Text(
                text = "اختر المادة وابدأ من الحزمة المناسبة لمستواك",
                fontSize = 13.5.sp,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                lineHeight = 20.sp
            )
            Row(
                modifier = Modifier.padding(top = 6.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                SubjectsMiniChip(text = "$totalSubjects مواد", icon = "📚")
                SubjectsMiniChip(text = "تقدم ذكي", icon = "📈")
                SubjectsMiniChip(text = "اختبارات", icon = "📝")
            }
        }
    }
}

@Composable
private fun SubjectsMiniChip(text: String, icon: String) {
    Surface(
        shape = RoundedCornerShape(14.dp),
        color = Color.White.copy(alpha = 0.55f),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color.White.copy(alpha = 0.42f))
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 7.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(5.dp)
        ) {
            Text(icon, fontSize = 13.sp)
            Text(
                text = text,
                fontSize = 11.5.sp,
                fontWeight = FontWeight.ExtraBold,
                color = MaterialTheme.colorScheme.primary
            )
        }
    }
}

@Composable
fun PremiumSubjectCard(subject: Subject, onClick: () -> Unit) {
    val progressFraction = subject.progress.coerceIn(0, 100) / 100f

    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(22.dp),
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 2.dp,
        shadowElevation = 2.dp,
        border = androidx.compose.foundation.BorderStroke(
            1.dp,
            MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.55f)
        )
    ) {
        Row(
            modifier = Modifier.padding(15.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(58.dp)
                    .clip(RoundedCornerShape(18.dp))
                    .background(subjectAccentColor(subject.id).copy(alpha = 0.22f)),
                contentAlignment = Alignment.Center
            ) {
                Text(text = subject.icon, fontSize = 29.sp)
            }

            Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(7.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Top
                ) {
                    Text(
                        text = subject.name,
                        fontSize = 17.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = MaterialTheme.colorScheme.onBackground,
                        modifier = Modifier.weight(1f),
                        lineHeight = 23.sp
                    )
                    Text(
                        text = "${subject.progress}%",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = subjectAccentColor(subject.id),
                        textAlign = TextAlign.End
                    )
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "مستوى: ${subject.masteryLevel}",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = "${subject.completedPacks}/${subject.totalPacks} حزم",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                LinearProgressIndicator(
                    progress = { progressFraction },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(8.dp)
                        .clip(RoundedCornerShape(50)),
                    color = subjectAccentColor(subject.id),
                    trackColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.75f)
                )
            }

            Surface(
                shape = RoundedCornerShape(14.dp),
                color = subjectAccentColor(subject.id).copy(alpha = 0.12f)
            ) {
                Text(
                    text = "ابدأ",
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 7.dp),
                    fontSize = 12.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = subjectAccentColor(subject.id)
                )
            }
        }
    }
}

@Composable
fun SubjectCard(subject: Subject, onClick: () -> Unit) {
    PremiumSubjectCard(subject = subject, onClick = onClick)
}

private fun subjectAccentColor(subjectId: String): Color {
    return when (subjectId) {
        "1" -> Color(0xFF7C3AED)
        "2" -> Color(0xFFDC2626)
        "3" -> Color(0xFFDB2777)
        "4" -> Color(0xFF2563EB)
        "5" -> Color(0xFF059669)
        "6" -> Color(0xFFD97706)
        "7" -> Color(0xFF0891B2)
        else -> Color(0xFF0F766E)
    }
}
