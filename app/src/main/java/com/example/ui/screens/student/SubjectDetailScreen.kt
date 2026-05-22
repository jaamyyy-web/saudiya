package com.example.ui.screens.student

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.navigation.NavController
import com.example.data.backend.BackendService
import com.example.data.mock.MockData
import com.example.domain.models.LearningPack

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SubjectDetailScreen(subjectId: String, navController: NavController) {
    val subject = remember { MockData.subjects.find { it.id == subjectId } }
    val packs = remember { mutableStateListOf<LearningPack>() }
    var showPremiumDialog by remember { mutableStateOf(false) }

    LaunchedEffect(subjectId) {
        val fetchedList = BackendService.fetchLearningPacks(subjectId)
        packs.clear()
        packs.addAll(fetchedList)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        TopAppBar(
            title = { 
                Text(
                    text = subject?.name ?: "المادة",
                    fontWeight = FontWeight.Bold,
                    fontSize = 20.sp
                ) 
            },
            navigationIcon = {
                IconButton(onClick = { navController.popBackStack() }) {
                    Icon(imageVector = Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "رجوع")
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background)
        )

        Box(
            modifier = Modifier
                .fillMaxSize()
                .weight(1f),
            contentAlignment = Alignment.TopCenter
        ) {
            LazyColumn(
                modifier = Modifier
                    .fillMaxWidth()
                    .widthIn(max = 600.dp)
                    .padding(horizontal = 16.dp),
                contentPadding = PaddingValues(top = 16.dp, bottom = 32.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                items(packs) { pack ->
                    LearningPackCard(
                        pack = pack,
                        onClick = {
                            if (pack.isLocked) {
                                showPremiumDialog = true
                            } else {
                                navController.navigate("learning_pack_detail/${pack.id}")
                            }
                        }
                    )
                }
            }
        }
    }
    
    if (showPremiumDialog) {
        PremiumPopup(
            onDismiss = { showPremiumDialog = false },
            onUpgradeClick = {
                showPremiumDialog = false
                navController.navigate("subscription_plans")
            }
        )
    }
}

@Composable
fun LearningPackCard(pack: LearningPack, onClick: () -> Unit) {
    val cardBgColor = if (pack.isLocked) {
        MaterialTheme.colorScheme.surface.copy(alpha = 0.95f)
    } else {
        MaterialTheme.colorScheme.surface
    }

    val cardBorderColor = if (pack.isLocked) {
        Color(0xFFFFD700).copy(alpha = 0.35f)
    } else {
        MaterialTheme.colorScheme.outline.copy(alpha = 0.15f)
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .border(
                width = if (pack.isLocked) 1.5.dp else 1.dp,
                color = cardBorderColor,
                shape = RoundedCornerShape(20.dp)
            ),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = cardBgColor),
        elevation = CardDefaults.cardElevation(
            defaultElevation = if (pack.isLocked) 1.dp else 2.dp
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(18.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(
                modifier = Modifier
                    .weight(1f)
                    .padding(end = 8.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = pack.title,
                        fontSize = 17.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (pack.isLocked) MaterialTheme.colorScheme.onBackground.copy(alpha = 0.8f) else MaterialTheme.colorScheme.onBackground
                    )
                    
                    if (pack.isPremium) {
                        Box(
                            modifier = Modifier
                                .background(Color(0xFFFEF3C7), RoundedCornerShape(6.dp))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(
                                "باقة مميزة ⭐", 
                                fontSize = 9.sp, 
                                fontWeight = FontWeight.Bold, 
                                color = Color(0xFFD97706)
                            )
                        }
                    }
                }
                
                Spacer(modifier = Modifier.height(4.dp))
                
                Text(
                    text = pack.description,
                    fontSize = 13.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    lineHeight = 18.sp
                )
                
                Spacer(modifier = Modifier.height(14.dp))
                
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    if (pack.isCompleted) {
                        Box(
                            modifier = Modifier
                                .background(Color(0xFFDCFCE7), RoundedCornerShape(6.dp))
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text("مكتملة ✓", color = Color(0xFF15803D), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    } else if (!pack.isLocked) {
                        LinearProgressIndicator(
                            progress = { pack.progress / 100f },
                            modifier = Modifier
                                .width(80.dp)
                                .height(5.dp)
                                .clip(RoundedCornerShape(50)),
                            color = MaterialTheme.colorScheme.primary,
                            trackColor = MaterialTheme.colorScheme.surfaceVariant
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("الإنجاز: %${pack.progress}", fontSize = 11.sp, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.SemiBold)
                    } else {
                        Text("يرجى الترقية لفتح المذاكرة والاختبارات", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f))
                    }
                }
            }
            
            Spacer(modifier = Modifier.width(8.dp))

            if (pack.isPremium) {
                Button(
                    onClick = onClick,
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFFFFD700), 
                        contentColor = Color.Black
                    ),
                    contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp),
                    modifier = Modifier.height(38.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Text("👑", fontSize = 12.sp)
                        Text("ترقية وتفعيل", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }
            } else {
                Button(
                    onClick = onClick,
                    shape = RoundedCornerShape(12.dp),
                    contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp),
                    modifier = Modifier.height(38.dp)
                ) {
                    Text("فتح الحزمة", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun PremiumPopup(onDismiss: () -> Unit, onUpgradeClick: () -> Unit) {
    Dialog(onDismissRequest = onDismiss) {
        Card(
            shape = RoundedCornerShape(28.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 12.dp)
        ) {
            Column(
                modifier = Modifier
                    .widthIn(max = 380.dp)
                    .background(
                        brush = androidx.compose.ui.graphics.Brush.verticalGradient(
                            colors = listOf(
                                Color(0xFFFFFBEB), // Very soft amber tint top
                                MaterialTheme.colorScheme.surface
                            )
                        )
                    )
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Box(
                    modifier = Modifier
                        .size(68.dp)
                        .background(Color(0xFFFEF3C7), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = "👑", fontSize = 36.sp)
                }
                
                Spacer(modifier = Modifier.height(18.dp))
                
                Text(
                    text = "اشترك في الباقة المميزة",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFFD97706),
                    textAlign = TextAlign.Center
                )
                
                Spacer(modifier = Modifier.height(10.dp))
                
                Text(
                    text = "افتح كافة الحزم التعليمية لجميع المواد، واستفد من الذكاء الاصطناعي وتقارير الأداء المتقدمة.",
                    fontSize = 13.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    lineHeight = 20.sp,
                    textAlign = TextAlign.Center
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                // Elegant benefit bullets
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    val benefits = listOf(
                        "🔒 جميع حزم المنهج الدراسي للمرحلة المتوسطة",
                        "🧠 اختبارات غير محدودة وتصحيح تفصيلي ذكي",
                        "📈 تحليلات ونقاط الضعف وخطة علاج مخصصة",
                        "👨‍👩‍👧‍👦 خيار باقة العائلة لمتابعة أولياء الأمور بسهولة"
                    )
                    benefits.forEach { feat ->
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text("✨", fontSize = 12.sp, modifier = Modifier.padding(horizontal = 4.dp))
                            Text(feat, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface, fontWeight = FontWeight.Medium)
                        }
                    }
                }
                
                Spacer(modifier = Modifier.height(24.dp))
                
                Button(
                    onClick = onUpgradeClick,
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFFFFD700),
                        contentColor = Color.Black
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp)
                ) {
                    Text("اشترك الآن بفترة مريحة", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                }
                
                Spacer(modifier = Modifier.height(8.dp))
                
                TextButton(onClick = onDismiss) {
                    Text("ربما لاحقاً", color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 13.sp)
                }
            }
        }
    }
}
