package com.example.ui.screens.student.subscription

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.domain.SubscriptionManager
import com.example.domain.models.SubscriptionPlanType

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ManageSubscriptionScreen(navController: NavController) {
    val state by SubscriptionManager.state.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("إدارة الاشتراك") },
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
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            val isPremium = state.currentPlanType != SubscriptionPlanType.FREE
            
            if (isPremium) {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(modifier = Modifier.padding(24.dp)) {
                        Text(
                            text = if (state.currentPlanType == SubscriptionPlanType.FAMILY) "باقة العائلة" else "باقة المستخدم الواحد",
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text("الحالة: مفعل", color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("ينتهي في: ${state.expirationDate ?: "غير محدد"}", color = MaterialTheme.colorScheme.onSurfaceVariant)
                        
                        Spacer(modifier = Modifier.height(32.dp))
                        
                        OutlinedButton(
                            onClick = { /* Implement Cancel */ },
                            modifier = Modifier.fillMaxWidth().height(48.dp)
                        ) {
                            Text("إلغاء الاشتراك", color = MaterialTheme.colorScheme.error)
                        }
                    }
                }
            } else {
                Text("أنت الآن على الباقة المجانية.", fontSize = 18.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
    }
}
