package com.example.ui.screens.student

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.data.mock.MockData
import com.example.domain.GamificationManager

@Composable
fun PremiumStudentHomeScreen(navController: NavController, modifier: Modifier = Modifier) {
    val gamificationState by GamificationManager.state.collectAsState()

    Column(
        modifier = modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        PremiumHomeHeader(
            xp = gamificationState.xp,
            coins = gamificationState.coins,
            level = gamificationState.level,
            navController = navController
        )
        PremiumProgressCard()
        PremiumDailyMissionCard(navController)
        PremiumLearningPacksSection()
        Spacer(modifier = Modifier.height(18.dp))
    }
}

@Composable
private fun PremiumHomeHeader(xp: Int, coins: Int, level: Int, navController: NavController) {
    val unreadCount = MockData.sentNotifications.count { it.id !in MockData.readNotificationIds }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.weight(1f)
        ) {
            Box(
                modifier = Modifier
                    .size(52.dp)
                    .clip(CircleShape)
                    .background(
                        Brush.linearGradient(
                            listOf(
                                MaterialTheme.colorScheme.primaryContainer,
                                Color(0xFFFFD166).copy(alpha = 0.42f)
                            )
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "أ",
                    color = MaterialTheme.colorScheme.onPrimaryContainer,
                    fontWeight = FontWeight.ExtraBold,
                    fontSize = 21.sp
                )
            }
            Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                Text(
                    text = "مرحباً، أحمد 👋",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.ExtraBold,
                    color = MaterialTheme.colorScheme.onBackground
                )
                Text(
                    text = "استمر اليوم لتحافظ على تقدمك • مستوى $level",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    fontWeight = FontWeight.SemiBold,
                    lineHeight = 17.sp
                )
            }
        }

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
            Surface(
                modifier = Modifier.clickable { navController.navigate("rewards") },
                shape = RoundedCornerShape(18.dp),
                color = MaterialTheme.colorScheme.surface,
                tonalElevation = 3.dp,
                border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.45f))
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 7.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(7.dp)
                ) {
                    Text(text = "⭐ $xp", fontSize = 13.sp, fontWeight = FontWeight.ExtraBold, color = Color(0xFFD97706))
                    Text(text = "🪙 $coins", fontSize = 13.sp, fontWeight = FontWeight.ExtraBold, color = Color(0xFF16A34A))
                }
            }

            Box(
                modifier = Modifier
                    .size(42.dp)
                    .clip(CircleShape)
                    .background(MaterialTheme.colorScheme.surface)
                    .border(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.5f), CircleShape)
                    .clickable { navController.navigate("notifications") },
                contentAlignment = Alignment.Center
            ) {
                Box(modifier = Modifier.padding(2.dp)) {
                    Text(text = "🔔", fontSize = 20.sp)
                    if (unreadCount > 0) {
                        Box(
                            modifier = Modifier
                                .size(10.dp)
                                .align(Alignment.TopEnd)
                                .clip(CircleShape)
                                .background(Color(0xFFEF4444))
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun PremiumProgressCard() {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(28.dp))
            .background(
                Brush.linearGradient(
                    listOf(
                        MaterialTheme.colorScheme.primaryContainer,
                        MaterialTheme.colorScheme.primary.copy(alpha = 0.20f)
                    )
                )
            )
            .padding(20.dp)
    ) {
        Box(
            modifier = Modifier
                .size(110.dp)
                .align(Alignment.BottomStart)
                .offset(x = (-26).dp, y = 30.dp)
                .clip(CircleShape)
                .background(Color.White.copy(alpha = 0.22f))
        )

        Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(5.dp), modifier = Modifier.weight(1f)) {
                    Text(
                        text = "نظرة اليوم",
                        color = MaterialTheme.colorScheme.primary,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.ExtraBold,
                        letterSpacing = 1.sp
                    )
                    Text(
                        text = "أكملت ٦٥٪",
                        color = MaterialTheme.colorScheme.onPrimaryContainer,
                        fontSize = 26.sp,
                        fontWeight = FontWeight.ExtraBold
                    )
                    Text(
                        text = "من حزمة الرياضيات لهذا الأسبوع",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.SemiBold,
                        lineHeight = 20.sp
                    )
                }

                Surface(shape = RoundedCornerShape(18.dp), color = Color.White.copy(alpha = 0.48f)) {
                    Text(
                        text = "🔥 5 أيام",
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                        fontSize = 13.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
            }

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(13.dp)
                    .clip(RoundedCornerShape(50))
                    .background(Color.White.copy(alpha = 0.55f))
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth(0.65f)
                        .height(13.dp)
                        .clip(RoundedCornerShape(50))
                        .background(MaterialTheme.colorScheme.primary)
                )
            }
        }
    }
}

@Composable
private fun PremiumDailyMissionCard(navController: NavController) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { navController.navigate("analytics") },
        shape = RoundedCornerShape(22.dp),
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 2.dp,
        border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.5f))
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(Color(0xFFFFD166).copy(alpha = 0.30f)),
                contentAlignment = Alignment.Center
            ) {
                Text("🎯", fontSize = 25.sp)
            }
            Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(3.dp)) {
                Text(
                    text = "مهمة اليوم",
                    fontWeight = FontWeight.ExtraBold,
                    fontSize = 15.sp,
                    color = MaterialTheme.colorScheme.onBackground
                )
                Text(
                    text = "حل ٥ أسئلة لتحصل على نقاط إضافية وتفتح شارة جديدة",
                    fontSize = 12.5.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    fontWeight = FontWeight.SemiBold,
                    lineHeight = 18.sp
                )
            }
            Text("ابدأ", fontSize = 13.sp, fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.primary)
        }
    }
}

@Composable
private fun PremiumLearningPacksSection() {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                Text(
                    text = "حزمي التعليمية",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.ExtraBold,
                    color = MaterialTheme.colorScheme.onBackground
                )
                Text(
                    text = "تابع من حيث توقفت",
                    fontSize = 12.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    fontWeight = FontWeight.SemiBold
                )
            }
            Text(
                text = "عرض الكل",
                color = MaterialTheme.colorScheme.primary,
                fontSize = 14.sp,
                fontWeight = FontWeight.ExtraBold,
                modifier = Modifier.clickable { }
            )
        }

        PremiumPackItem(
            title = "الرياضيات: الهندسة التحليلية",
            subtitle = "الحزمة الأولى • متاح الآن",
            icon = "📐",
            iconBg = Color(0xFFD8CCFF),
            actionText = "ابدأ",
            isLocked = false
        )
        PremiumPackItem(
            title = "العلوم: التفاعلات الكيميائية",
            subtitle = "الحزمة الثانية • Premium",
            icon = "🧪",
            iconBg = Color(0xFFFFCDD2),
            actionText = "ترقية",
            isLocked = true
        )
        PremiumPackItem(
            title = "اللغة العربية: القواعد",
            subtitle = "الحزمة الثانية • Premium",
            icon = "📖",
            iconBg = Color(0xFFFFD6E7),
            actionText = "ترقية",
            isLocked = true
        )
    }
}

@Composable
private fun PremiumPackItem(
    title: String,
    subtitle: String,
    icon: String,
    iconBg: Color,
    actionText: String,
    isLocked: Boolean
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .alpha(if (isLocked) 0.78f else 1f)
            .clickable(enabled = !isLocked) { },
        shape = RoundedCornerShape(20.dp),
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = if (isLocked) 0.dp else 2.dp,
        border = androidx.compose.foundation.BorderStroke(
            1.dp,
            if (isLocked) Color(0xFFFFD166).copy(alpha = 0.55f) else MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.55f)
        )
    ) {
        Row(
            modifier = Modifier.padding(15.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(50.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(iconBg.copy(alpha = if (isLocked) 0.60f else 1f)),
                contentAlignment = Alignment.Center
            ) {
                Text(text = icon, fontSize = 24.sp)
            }
            Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(5.dp)) {
                Text(
                    text = title,
                    fontWeight = FontWeight.ExtraBold,
                    color = MaterialTheme.colorScheme.onBackground,
                    fontSize = 14.5.sp,
                    lineHeight = 20.sp
                )
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = subtitle,
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        fontWeight = FontWeight.SemiBold
                    )
                    if (isLocked) {
                        Surface(shape = RoundedCornerShape(7.dp), color = Color(0xFFFFD700).copy(alpha = 0.85f)) {
                            Text(
                                text = "Premium",
                                modifier = Modifier.padding(horizontal = 7.dp, vertical = 2.dp),
                                fontSize = 9.5.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = Color.Black
                            )
                        }
                    }
                }
            }
            Surface(
                shape = RoundedCornerShape(14.dp),
                color = if (isLocked) Color(0xFFFFD166).copy(alpha = 0.22f) else MaterialTheme.colorScheme.primary.copy(alpha = 0.12f)
            ) {
                Text(
                    text = if (isLocked) "🔒 $actionText" else actionText,
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 7.dp),
                    fontSize = 12.sp,
                    textAlign = TextAlign.Center,
                    fontWeight = FontWeight.ExtraBold,
                    color = if (isLocked) Color(0xFF92400E) else MaterialTheme.colorScheme.primary
                )
            }
        }
    }
}
