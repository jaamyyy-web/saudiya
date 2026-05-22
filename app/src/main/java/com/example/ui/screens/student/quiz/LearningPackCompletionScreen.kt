package com.example.ui.screens.student.quiz

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
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
import com.example.ui.components.ConfettiAnimation

@Composable
fun LearningPackCompletionScreen(
    xpEarned: Int,
    accuracy: Int,
    badgeUnlocked: String?,
    navController: NavController
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        Box(
            modifier = Modifier
                .size(260.dp)
                .align(Alignment.TopEnd)
                .offset(x = 90.dp, y = (-70).dp)
                .clip(CircleShape)
                .background(MaterialTheme.colorScheme.primary.copy(alpha = 0.08f))
        )
        Box(
            modifier = Modifier
                .size(220.dp)
                .align(Alignment.BottomStart)
                .offset(x = (-80).dp, y = 80.dp)
                .clip(CircleShape)
                .background(Color(0xFFFFD166).copy(alpha = 0.12f))
        )

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 22.dp, vertical = 24.dp)
                .windowInsetsPadding(WindowInsets.safeDrawing),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            CompletionHeroCard(
                xpEarned = xpEarned,
                accuracy = accuracy,
                coins = xpEarned / 2,
                badgeUnlocked = badgeUnlocked
            )

            Spacer(modifier = Modifier.height(22.dp))

            CompletionInsightCard(accuracy = accuracy)

            Spacer(modifier = Modifier.height(30.dp))

            Button(
                onClick = { navController.navigate("student_main") { popUpTo("student_main") { inclusive = true } } },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(58.dp),
                shape = RoundedCornerShape(18.dp)
            ) {
                Text("العودة للرئيسية", fontSize = 17.sp, fontWeight = FontWeight.ExtraBold)
            }

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedButton(
                onClick = { navController.popBackStack() },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(18.dp)
            ) {
                Text("متابعة الحزمة", fontSize = 16.sp, fontWeight = FontWeight.ExtraBold)
            }
        }

        ConfettiAnimation()
    }
}

@Composable
private fun CompletionHeroCard(
    xpEarned: Int,
    accuracy: Int,
    coins: Int,
    badgeUnlocked: String?
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(34.dp))
            .background(
                Brush.verticalGradient(
                    listOf(
                        MaterialTheme.colorScheme.primaryContainer,
                        MaterialTheme.colorScheme.surface
                    )
                )
            )
            .padding(22.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(92.dp)
                    .clip(CircleShape)
                    .background(Color.White.copy(alpha = 0.55f)),
                contentAlignment = Alignment.Center
            ) {
                Text("🎉", fontSize = 54.sp)
            }

            Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Text(
                    text = completionTitle(accuracy),
                    fontSize = 30.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = MaterialTheme.colorScheme.primary,
                    textAlign = TextAlign.Center
                )
                Text(
                    text = "أنهيت الاختبار بنجاح وجمعت مكافآت جديدة",
                    fontSize = 13.5.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    textAlign = TextAlign.Center,
                    lineHeight = 20.sp
                )
            }

            Surface(
                shape = RoundedCornerShape(26.dp),
                color = Color.White.copy(alpha = 0.72f),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color.White.copy(alpha = 0.45f))
            ) {
                Column(
                    modifier = Modifier.padding(horizontal = 26.dp, vertical = 16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text("إجمالي XP", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Text("+$xpEarned", fontSize = 46.sp, fontWeight = FontWeight.ExtraBold, color = Color(0xFFF59E0B))
                }
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                CompletionStatCard(label = "الدقة", value = "$accuracy%", icon = "🎯", color = MaterialTheme.colorScheme.primary, modifier = Modifier.weight(1f))
                CompletionStatCard(label = "عملات", value = "+$coins", icon = "🪙", color = Color(0xFFD97706), modifier = Modifier.weight(1f))
            }

            if (!badgeUnlocked.isNullOrEmpty()) {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(20.dp),
                    color = Color(0xFFFEF3C7),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFFACC15).copy(alpha = 0.55f))
                ) {
                    Row(
                        modifier = Modifier.padding(15.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Text("🏅", fontSize = 36.sp)
                        Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                            Text("شارة جديدة!", fontSize = 13.sp, fontWeight = FontWeight.ExtraBold, color = Color(0xFFD97706))
                            Text(badgeUnlocked, fontSize = 17.sp, fontWeight = FontWeight.ExtraBold, color = Color(0xFF92400E))
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun CompletionStatCard(
    label: String,
    value: String,
    icon: String,
    color: Color,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(20.dp),
        color = Color.White.copy(alpha = 0.72f),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color.White.copy(alpha = 0.45f))
    ) {
        Column(
            modifier = Modifier.padding(vertical = 13.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Text(icon, fontSize = 22.sp)
            Text(value, fontSize = 22.sp, fontWeight = FontWeight.ExtraBold, color = color)
            Text(label, fontSize = 11.5.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable
private fun CompletionInsightCard(accuracy: Int) {
    val message = when {
        accuracy >= 90 -> "ممتاز! مستواك قوي جداً. استمر بنفس الحماس وانتقل للحزمة التالية."
        accuracy >= 70 -> "أداء جيد. راجع الأسئلة التي أخطأت فيها ثم حاول الاختبار الشامل."
        else -> "لا تقلق. ارجع إلى الملخص أولاً، ثم أعد المحاولة خطوة بخطوة."
    }

    Surface(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(22.dp),
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 2.dp,
        border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.55f))
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(MaterialTheme.colorScheme.primary.copy(alpha = 0.12f)),
                contentAlignment = Alignment.Center
            ) {
                Text("💡", fontSize = 25.sp)
            }
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text("نصيحة ذكية", fontSize = 15.sp, fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.onBackground)
                Text(message, fontSize = 12.5.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurfaceVariant, lineHeight = 18.sp)
            }
        }
    }
}

private fun completionTitle(accuracy: Int): String {
    return when {
        accuracy == 100 -> "إنجاز كامل!"
        accuracy >= 80 -> "أداء رائع!"
        accuracy >= 60 -> "أحسنت!"
        else -> "استمر بالتعلم!"
    }
}
