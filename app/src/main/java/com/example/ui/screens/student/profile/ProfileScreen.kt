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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
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
        SubscriptionPlanType.SINGLE_USER -> "حساب فردي (Premium)"
        SubscriptionPlanType.FAMILY -> "حساب العائلة (Premium)"
    }

    val isPremium = subscriptionState.currentPlanType != SubscriptionPlanType.FREE

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("حسابي") },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background)
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Avatar & Name
            Box(
                modifier = Modifier
                    .size(100.dp)
                    .clip(CircleShape)
                    .background(MaterialTheme.colorScheme.primaryContainer),
                contentAlignment = Alignment.Center
            ) {
                Text(userProfile.avatar, fontSize = 50.sp)
            }
            Spacer(modifier = Modifier.height(16.dp))
            Text(userProfile.name, fontSize = 24.sp, fontWeight = FontWeight.Bold)
            Text(userProfile.grade, fontSize = 16.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            if (userProfile.schoolName.isNotBlank()) {
                Spacer(modifier = Modifier.height(4.dp))
                Text("🏫 ${userProfile.schoolName}", fontSize = 14.sp, color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.8f))
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            Surface(
                color = if (!isPremium) MaterialTheme.colorScheme.surfaceVariant else Color(0xFFFFD700),
                shape = RoundedCornerShape(16.dp)
            ) {
                Text(
                    text = "الاشتراك: $subscriptionText",
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                    fontSize = 14.sp,
                    color = if (!isPremium) MaterialTheme.colorScheme.onSurfaceVariant else Color.Black,
                    fontWeight = FontWeight.Bold
                )
            }

            Spacer(modifier = Modifier.height(32.dp))

            // Gamification Stats
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                ProfileStatCard(modifier = Modifier.weight(1f), icon = "⭐", value = "${gamificationState.xp}", label = "XP")
                ProfileStatCard(modifier = Modifier.weight(1f), icon = "🔥", value = "${gamificationState.dailyStreak}", label = "أيام متتالية")
                ProfileStatCard(modifier = Modifier.weight(1f), icon = "👑", value = "${gamificationState.level}", label = "المستوى")
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Learning Stats
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                ProfileStatCard(modifier = Modifier.weight(1f), icon = "⏱️", value = "${userProfile.studyTimeHours}h", label = "وقت الدراسة")
                ProfileStatCard(modifier = Modifier.weight(1f), icon = "📈", value = "%${userProfile.masteryPercentage}", label = "الإتقان")
                ProfileStatCard(modifier = Modifier.weight(1f), icon = "📚", value = "${userProfile.completedPacks}", label = "حزم مكتملة")
            }

            Spacer(modifier = Modifier.height(32.dp))

            // Badges Preview
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("أحدث الشارات", fontSize = 20.sp, fontWeight = FontWeight.Bold)
                TextButton(onClick = { navController.navigate("rewards") }) {
                    Text("عرض الكل")
                }
            }
            Spacer(modifier = Modifier.height(8.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                gamificationState.badges.filter { it.unlocked }.take(3).forEach { badge ->
                    Card(
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
                        modifier = Modifier.size(80.dp)
                    ) {
                        Column(
                            modifier = Modifier.fillMaxSize(),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Center
                        ) {
                            Text(badge.icon, fontSize = 32.sp)
                        }
                    }
                }
                if (gamificationState.badges.none { it.unlocked }) {
                    Text("لم يتم فتح أي شارة بعد.", color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
            
            Spacer(modifier = Modifier.height(32.dp))
            
            Button(
                onClick = { navController.navigate("analytics") },
                modifier = Modifier.fillMaxWidth().height(56.dp)
            ) {
                Text("عرض التحليلات المتقدمة", fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }
            
            if (!isPremium) {
                Spacer(modifier = Modifier.height(16.dp))
                Button(
                    onClick = { navController.navigate("subscription_plans") },
                    modifier = Modifier.fillMaxWidth().height(56.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFFD700), contentColor = Color.Black)
                ) {
                    Text("الترقية إلى Premium", fontSize = 16.sp, fontWeight = FontWeight.Bold)
                }
            } else {
                Spacer(modifier = Modifier.height(16.dp))
                OutlinedButton(
                    onClick = { navController.navigate("manage_subscription") },
                    modifier = Modifier.fillMaxWidth().height(56.dp)
                ) {
                    Text("إدارة الاشتراك", fontSize = 16.sp, fontWeight = FontWeight.Bold)
                }
            }
            
            if (subscriptionState.isFamilyParent) {
                Spacer(modifier = Modifier.height(16.dp))
                Button(
                    onClick = { navController.navigate("parent_dashboard") },
                    modifier = Modifier.fillMaxWidth().height(56.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondary)
                ) {
                    Text("لوحة تحكم ولي الأمر", fontSize = 16.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun ProfileStatCard(modifier: Modifier = Modifier, icon: String, value: String, label: String) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp).fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(icon, fontSize = 24.sp)
            Spacer(modifier = Modifier.height(8.dp))
            Text(value, fontSize = 20.sp, fontWeight = FontWeight.Bold)
            Text(label, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}
