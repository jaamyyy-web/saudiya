package com.example.ui.screens.student

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.data.backend.BackendService
import com.example.domain.GamificationManager

import androidx.compose.runtime.rememberCoroutineScope
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SummaryScreen(packId: String, navController: NavController) {
    var summaryContent by remember { mutableStateOf("جاري تحميل الملخص من الخادم...") }
    val coroutineScope = rememberCoroutineScope()

    LaunchedEffect(packId) {
        summaryContent = BackendService.fetchSummary(packId)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        TopAppBar(
            title = { Text("الملخص") },
            navigationIcon = {
                IconButton(onClick = { navController.popBackStack() }) {
                    Icon(imageVector = Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "رجوع")
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background)
        )

        Column(
            modifier = Modifier
                .weight(1f)
                .padding(16.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text(text = "المفاهيم الأساسية", fontSize = 22.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
            
            Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface), modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = summaryContent,
                    modifier = Modifier.padding(16.dp),
                    fontSize = 16.sp,
                    lineHeight = 24.sp
                )
            }
            
            Text(text = "ملاحظات إضافية", fontSize = 22.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
            
            Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant), modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "نصيحة للمذاكرة: ركّز على قراءة الشرح والخطوات بالتفصيل وحاول كتابة المفاهيم بأسلوبك الخاص لتسهيل الحفظ المتقن.",
                    modifier = Modifier.padding(16.dp),
                    fontSize = 16.sp
                )
            }
            
            Spacer(modifier = Modifier.height(32.dp))
            
            Button(
                onClick = {
                    GamificationManager.addXP(5)
                    GamificationManager.addCoins(1)
                    coroutineScope.launch {
                        BackendService.submitXpLog("user_dummy_789", "summary_reading", 5)
                    }
                    navController.popBackStack() 
                },
                modifier = Modifier.fillMaxWidth().height(56.dp)
            ) {
                Text("إكمال (+5 XP)", fontSize = 18.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}
