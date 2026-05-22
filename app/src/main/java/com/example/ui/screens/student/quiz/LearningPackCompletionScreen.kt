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
import com.example.ui.components.ConfettiAnimation

@Composable
fun LearningPackCompletionScreen(
    xpEarned: Int,
    accuracy: Int,
    badgeUnlocked: String?,
    navController: NavController
) {
    Box(modifier = Modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text("🎉", fontSize = 80.sp)
            Spacer(modifier = Modifier.height(16.dp))
            Text("مكتمل!", fontSize = 32.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
            Text("أنهيت الحزمة التعليمية بنجاح!", fontSize = 18.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Spacer(modifier = Modifier.height(32.dp))

            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                shape = RoundedCornerShape(24.dp)
            ) {
                Column(modifier = Modifier.padding(24.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("إجمالي XP", fontSize = 16.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Text("+$xpEarned", fontSize = 48.sp, fontWeight = FontWeight.Bold, color = Color(0xFFFFB300))
                    
                    Spacer(modifier = Modifier.height(24.dp))
                    
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceEvenly) {
                        ResultStat(label = "الدقة", value = "%$accuracy", color = MaterialTheme.colorScheme.primary)
                        ResultStat(label = "عملات", value = "+${xpEarned / 2}", color = Color(0xFFF59E0B))
                    }
                }
            }

            if (!badgeUnlocked.isNullOrEmpty()) {
                Spacer(modifier = Modifier.height(24.dp))
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFFEF3C7)),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("🏅", fontSize = 40.sp)
                        Spacer(modifier = Modifier.width(16.dp))
                        Column {
                            Text("شارة جديدة!", fontWeight = FontWeight.Bold, color = Color(0xFFD97706))
                            Text(badgeUnlocked, fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFF92400E))
                        }
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(48.dp))
            
            Button(
                onClick = { navController.popBackStack("subject_detail", inclusive = false) }, 
                modifier = Modifier.fillMaxWidth().height(56.dp)
            ) {
                Text("استمر في التعلم", fontSize = 18.sp, fontWeight = FontWeight.Bold)
            }
        }
        
        // Overlay Confetti
        ConfettiAnimation()
    }
}
