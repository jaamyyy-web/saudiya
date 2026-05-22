package com.example.ui.screens.student.subscription

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.domain.SubscriptionManager
import com.example.domain.models.SubscriptionPlanType
import kotlinx.coroutines.delay

@Composable
fun PaymentSuccessScreen(planTypeString: String, navController: NavController) {
    
    LaunchedEffect(Unit) {
        val planType = try {
            SubscriptionPlanType.valueOf(planTypeString)
        } catch (e: Exception) {
            SubscriptionPlanType.FREE
        }
        SubscriptionManager.upgradeToPlan(planType)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Surface(
            shape = CircleShape,
            color = Color(0xFFDCFCE7),
            modifier = Modifier.size(120.dp)
        ) {
            Box(contentAlignment = Alignment.Center) {
                Text("✅", fontSize = 60.sp)
            }
        }
        
        Spacer(modifier = Modifier.height(32.dp))
        
        Text(
            text = "تم الاشتراك بنجاح!",
            fontSize = 28.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary,
            textAlign = TextAlign.Center
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        Text(
            text = "تهانينا! حسابك الآن مفعّل بخدمات Premium. يمكنك الاستمتاع بجميع الحزم والمميزات الذكية.",
            fontSize = 16.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center
        )
        
        Spacer(modifier = Modifier.height(48.dp))
        
        Button(
            onClick = { navController.navigate("home") { popUpTo("home") { inclusive = true } } },
            modifier = Modifier.fillMaxWidth().height(56.dp)
        ) {
            Text("العودة إلى الرئيسية", fontSize = 18.sp, fontWeight = FontWeight.Bold)
        }
    }
}
