package com.example.ui.screens.student.profile

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
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
import com.example.data.mock.MockProfileData
import com.example.domain.GamificationManager
import com.example.domain.SubscriptionManager
import com.example.domain.models.SubscriptionPlanType

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(navController: NavController) {
    val gamificationState by GamificationManager.state.collectAsState()
    val subscriptionState by SubscriptionManager.state.collectAsState()
    val userProfile = MockProfileData.currentUserProfile

    val subscriptionText = when (subscriptionState.currentPlanType) {
        SubscriptionPlanType.FREE -> "مجاني"
        SubscriptionPlanType.SINGLE_USER -> "Premium فردي"
        SubscriptionPlanType.FAMILY -> "Premium عائلي"
    }
    val isPremium = subscriptionState.currentPlanType != SubscriptionPlanType.FREE

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        topBar = {
            TopAppBar(
                title = { Text("حسابي", fontWeight = FontWeight.ExtraBold) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background)
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 16.dp, vertical = 12.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            ProfileHeroCard(
                avatar = userProfile.avatar,
                name = userProfile.name.ifBlank { "طالب جديد" },
                grade = userProfile.grade.ifBlank { "اختر الصف الدراسي" },
                schoolName = userProfile.schoolName,
                subscriptionText = subscriptionText,
                isPremium = isPremium
            )

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                ProfileStatCard(modifier = Modifier.weight(1f), icon = "⭐", value = "${gamificationState.xp}", label = "XP")
                ProfileStatCard(modifier = Modifier.weight(1f), icon = "🔥", value = "${gamificationState.dailyStreak}", label = "أيام")
                ProfileStatCard(modifier = Modifier.weight(1f), icon = "👑", value = "${gamificationState.level}", label = "المستوى")
            }

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                ProfileStatCard(modifier = Modifier.weight(1f), icon = "⏱️", value = "${userProfile.studyTimeHours}h", label = "دراسة")
                ProfileStatCard(modifier = Modifier.weight(1f), icon = "📈", value = "%${userProfile.masteryPercentage}", label = "إتقان")
                ProfileStatCard(modifier = Modifier.weight(1f), icon = "📚", value = "${userProfile.completedPacks}", label = "حزم")
            }

            ProfileBadgesPreview(navController = navController)

            ProfileActionCard(
                title = "تحليلات الأداء",
                subtitle = "شاهد مستوى التقدم ونقاط القوة والضعف",
                icon = "📊",
                buttonText = "عرض التحليلات",
                onClick = { navController.navigate("analytics") }
            )

            if (!isPremium) {
                Button(
                    onClick = { navController.navigate("subscription_plans") },
                    modifier = Modifier.fillMaxWidth().height(58.dp),
                    shape = RoundedCornerShape(18.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFFD700), contentColor = Color.Black)
                ) {
                    Text("الترقية إلى Premium 👑", fontSize = 16.sp, fontWeight = FontWeight.ExtraBold)
                }
            } else {
                OutlinedButton(
                    onClick = { navController.navigate("manage_subscription") },
                    modifier = Modifier.fillMaxWidth().height(56.dp),
                    shape = RoundedCornerShape(18.dp)
                ) {
                    Text("إدارة الاشتراك", fontSize = 16.sp, fontWeight = FontWeight.ExtraBold)
                }
            }

            if (subscriptionState.isFamilyParent) {
                Button(
                    onClick = { navController.navigate("parent_dashboard") },
                    modifier = Modifier.fillMaxWidth().height(56.dp),
                    shape = RoundedCornerShape(18.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondary)
                ) {
                    Text("لوحة تحكم ولي الأمر", fontSize = 16.sp, fontWeight = FontWeight.ExtraBold)
                }
            }

            Spacer(modifier = Modifier.height(18.dp))
        }
    }
}

@Composable
private fun ProfileHeroCard(
    avatar: String,
    name: String,
    grade: String,
    schoolName: String,
    subscriptionText: String,
    isPremium: Boolean
) {
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
                .size(110.dp)
                .align(Alignment.BottomStart)
                .offset(x = (-30).dp, y = 30.dp)
                .clip(CircleShape)
                .background(Color.White.copy(alpha = 0.22f))
        )

        Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
            Box(
                modifier = Modifier
                    .size(98.dp)
                    .clip(CircleShape)
                    .background(Color.White.copy(alpha = 0.55f)),
                contentAlignment = Alignment.Center
            ) {
                Text(avatar, fontSize = 50.sp)
            }

            Spacer(modifier = Modifier.height(14.dp))

            Text(name, fontSize = 25.sp, fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.onPrimaryContainer, textAlign = TextAlign.Center)
            Text(grade, fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurfaceVariant, textAlign = TextAlign.Center)

            if (schoolName.isNotBlank()) {
                Spacer(modifier = Modifier.height(4.dp))
                Text("🏫 $schoolName", fontSize = 12.5.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.82f), textAlign = TextAlign.Center)
            }

            Spacer(modifier = Modifier.height(14.dp))

            Surface(
                color = if (isPremium) Color(0xFFFFD700) else Color.White.copy(alpha = 0.55f),
                shape = RoundedCornerShape(18.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color.White.copy(alpha = 0.45f))
            ) {
                Text(
                    text = if (isPremium) "👑 $subscriptionText" else "الاشتراك: $subscriptionText",
                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 7.dp),
                    fontSize = 13.sp,
                    color = if (isPremium) Color.Black else MaterialTheme.colorScheme.primary,
                    fontWeight = FontWeight.ExtraBold
                )
            }
        }
    }
}

@Composable
fun ProfileStatCard(modifier: Modifier = Modifier, icon: String, value: String, label: String) {
    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(22.dp),
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 2.dp,
        border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.55f))
    ) {
        Column(
            modifier = Modifier.padding(vertical = 14.dp, horizontal = 8.dp).fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(5.dp)
        ) {
            Text(icon, fontSize = 24.sp)
            Text(value, fontSize = 20.sp, fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.primary, textAlign = TextAlign.Center)
            Text(label, fontSize = 11.5.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurfaceVariant, textAlign = TextAlign.Center)
        }
    }
}

@Composable
private fun ProfileBadgesPreview(navController: NavController) {
    val gamificationState by GamificationManager.state.collectAsState()

    Surface(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(24.dp),
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 2.dp,
        border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.55f))
    ) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                    Text("أحدث الشارات", fontSize = 18.sp, fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.onBackground)
                    Text("اكسب شارات جديدة مع كل إنجاز", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
                TextButton(onClick = { navController.navigate("rewards") }) {
                    Text("عرض الكل", fontWeight = FontWeight.ExtraBold)
                }
            }

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                val unlocked = gamificationState.badges.filter { it.unlocked }.take(3)
                if (unlocked.isEmpty()) {
                    Text("لم يتم فتح أي شارة بعد.", color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                } else {
                    unlocked.forEach { badge ->
                        Surface(
                            modifier = Modifier.size(78.dp).weight(1f),
                            shape = RoundedCornerShape(20.dp),
                            color = Color(0xFFFFF7ED),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFFED7AA))
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text(badge.icon, fontSize = 33.sp)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun ProfileActionCard(title: String, subtitle: String, icon: String, buttonText: String, onClick: () -> Unit) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(24.dp),
        color = Color(0xFFFFF7ED),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFFED7AA))
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(50.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(Color(0xFFFFEDD5)),
                contentAlignment = Alignment.Center
            ) {
                Text(icon, fontSize = 25.sp)
            }
            Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text(title, fontSize = 15.sp, fontWeight = FontWeight.ExtraBold, color = Color(0xFF9A3412))
                Text(subtitle, fontSize = 12.5.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF9A3412), lineHeight = 18.sp)
            }
            TextButton(onClick = onClick) {
                Text(buttonText, fontSize = 12.sp, fontWeight = FontWeight.ExtraBold, color = Color(0xFF9A3412))
            }
        }
    }
}
