package com.example.ui.screens.student.quiz

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController

@Composable
fun QuizResultScreen(correctCount: Int, totalCount: Int, xpEarned: Int, navController: NavController) {
    val accuracy = if (totalCount > 0) ((correctCount.toFloat() / totalCount) * 100).toInt() else 0
    val wrongCount = totalCount - correctCount

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("🏆", fontSize = 64.sp)
        Spacer(modifier = Modifier.height(16.dp))
        Text("اكتمل الاختبار!", fontSize = 28.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
        Spacer(modifier = Modifier.height(32.dp))

        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            shape = RoundedCornerShape(24.dp)
        ) {
            Column(modifier = Modifier.padding(24.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                Text("الدقة", fontSize = 16.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                Text("%$accuracy", fontSize = 48.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                
                Spacer(modifier = Modifier.height(24.dp))
                
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceEvenly) {
                    ResultStat(label = "صحيحة", value = "$correctCount", color = Color(0xFF16A34A))
                    ResultStat(label = "خاطئة", value = "$wrongCount", color = Color(0xFFDC2626))
                    ResultStat(label = "XP مكاسب", value = "+$xpEarned", color = Color(0xFFFFB300))
                }
            }
        }
        
        Spacer(modifier = Modifier.height(48.dp))
        
        Button(
            onClick = { navController.popBackStack() }, // Return to Learning Pack (which is prior to Quiz in backstack)
            modifier = Modifier.fillMaxWidth().height(56.dp)
        ) {
            Text("العودة للحزمة", fontSize = 18.sp, fontWeight = FontWeight.Bold)
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        OutlinedButton(
            onClick = { /* Placeholder for Review Answers route, could pop back or navigate */ },
            modifier = Modifier.fillMaxWidth().height(56.dp)
        ) {
            Text("مراجعة الإجابات", fontSize = 18.sp, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun ResultStat(label: String, value: String, color: Color) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(value, fontSize = 24.sp, fontWeight = FontWeight.Bold, color = color)
        Text(label, fontSize = 14.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}
