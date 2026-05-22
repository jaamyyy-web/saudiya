package com.example.ui.screens.student.analytics

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.data.mock.MockProfileData
import com.example.domain.SubscriptionManager
import com.example.domain.models.SubscriptionPlanType

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AnalyticsScreen(navController: NavController) {
    val analytics = MockProfileData.currentAnalytics
    val subscriptionState by SubscriptionManager.state.collectAsState()
    val isPremium = subscriptionState.currentPlanType != SubscriptionPlanType.FREE

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("التحليلات") },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(imageVector = Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "رجوع")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(24.dp)
        ) {
            // Overall Accuracy Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
            ) {
                Column(
                    modifier = Modifier.padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text("الدقة الإجمالية", fontSize = 16.sp)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("%${analytics.overallAccuracy}", fontSize = 48.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                }
            }

            // Stats
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                AnalyticsStatCard(modifier = Modifier.weight(1f), title = "وقت الدراسة", value = "${analytics.studyTimeHours} ساعة")
                AnalyticsStatCard(modifier = Modifier.weight(1f), title = "حزم مكتملة", value = "${analytics.completedLearningPacks}")
            }

            // Weak Topics
            if (analytics.weakTopics.isNotEmpty()) {
                Column {
                    Text("المواضيع الضعيفة", fontSize = 20.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(8.dp))
                    analytics.weakTopics.forEach { topic ->
                        Card(
                            modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.errorContainer)
                        ) {
                            Text(
                                text = "⚠️ $topic",
                                modifier = Modifier.padding(16.dp),
                                color = MaterialTheme.colorScheme.onErrorContainer,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }

            // Recommendations (Premium)
            Column {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("التوصيات الذكية", fontSize = 20.sp, fontWeight = FontWeight.Bold)
                    if (!isPremium) {
                        Spacer(modifier = Modifier.width(8.dp))
                        Surface(color = Color(0xFFFFD700), shape = RoundedCornerShape(8.dp)) {
                            Text("Premium", modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp), fontSize = 10.sp, color = Color.Black)
                        }
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))
                
                if (isPremium) {
                    analytics.recommendations.forEach { idea ->
                        Card(
                            modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
                        ) {
                            Text(
                                text = "💡 $idea",
                                modifier = Modifier.padding(16.dp),
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                } else {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
                    ) {
                        Column(modifier = Modifier.padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("🔒 اشترك في Premium لفتح التوصيات الذكية وتحليل الإتقان.", textAlign = androidx.compose.ui.text.style.TextAlign.Center)
                            Spacer(modifier = Modifier.height(8.dp))
                            Button(onClick = { navController.navigate("subscription_plans") }) {
                                Text("الترقية الآن")
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun AnalyticsStatCard(modifier: Modifier = Modifier, title: String, value: String) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
    ) {
        Column(
            modifier = Modifier.padding(16.dp).fillMaxWidth()
        ) {
            Text(title, fontSize = 14.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Spacer(modifier = Modifier.height(8.dp))
            Text(value, fontSize = 24.sp, fontWeight = FontWeight.Bold)
        }
    }
}
