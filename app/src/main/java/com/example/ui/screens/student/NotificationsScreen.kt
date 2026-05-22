package com.example.ui.screens.student

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.data.mock.MockData
import com.example.domain.models.NotificationDraft

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NotificationsScreen(navController: NavController) {
    val notifications = remember { MockData.sentNotifications }
    val readIds = remember { MockData.readNotificationIds }
    var selectedNotification by remember { mutableStateOf<NotificationDraft?>(null) }
    var showDialog by remember { mutableStateOf(false) }
    val unreadCount = notifications.count { it.id !in readIds }

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        topBar = {
            TopAppBar(
                title = { Text("مركز التنبيهات", fontWeight = FontWeight.ExtraBold) },
                navigationIcon = {
                    IconButton(onClick = { navController.navigateUp() }, modifier = Modifier.testTag("back_button")) {
                        Icon(imageVector = Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "رجوع")
                    }
                },
                actions = {
                    if (notifications.isNotEmpty()) {
                        IconButton(onClick = { notifications.forEach { if (it.id !in readIds) readIds.add(it.id) } }) {
                            Icon(imageVector = Icons.Default.Check, contentDescription = "تحديد الكل كمقروء", tint = MaterialTheme.colorScheme.primary)
                        }
                        IconButton(onClick = { notifications.clear(); readIds.clear() }) {
                            Icon(imageVector = Icons.Default.Delete, contentDescription = "مسح الكل", tint = MaterialTheme.colorScheme.error)
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background)
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .padding(paddingValues)
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            NotificationsHeroCard(unreadCount = unreadCount, totalCount = notifications.size)

            if (notifications.isEmpty()) {
                NotificationsEmptyState(modifier = Modifier.weight(1f))
            } else {
                LazyColumn(
                    modifier = Modifier.weight(1f),
                    contentPadding = PaddingValues(bottom = 18.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(notifications.toList().reversed()) { item ->
                        val isRead = item.id in readIds
                        NotificationItemCard(
                            item = item,
                            isRead = isRead,
                            onClick = {
                                if (!isRead) readIds.add(item.id)
                                selectedNotification = item
                                showDialog = true
                            }
                        )
                    }
                }
            }
        }

        if (showDialog && selectedNotification != null) {
            val item = selectedNotification!!
            PremiumNotificationDialog(
                item = item,
                onDismiss = { showDialog = false },
                onPrimaryAction = {
                    showDialog = false
                    when (item.type.lowercase().trim()) {
                        "badge unlocked" -> navController.navigate("rewards")
                        "daily reminder", "streak reminder" -> navController.navigate("student_main")
                        "weak topic reminder" -> navController.navigate("analytics")
                        "premium reminder" -> navController.navigate("subscription_plans")
                    }
                }
            )
        }
    }
}

@Composable
private fun NotificationsHeroCard(unreadCount: Int, totalCount: Int) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(30.dp))
            .background(
                Brush.linearGradient(
                    listOf(
                        MaterialTheme.colorScheme.primaryContainer,
                        MaterialTheme.colorScheme.primary.copy(alpha = 0.16f)
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

        Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text("Notification Center", fontSize = 13.sp, fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.primary)
                    Text("تنبيهاتك التعليمية", fontSize = 25.sp, fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.onPrimaryContainer, lineHeight = 32.sp)
                    Text(
                        text = "تابع التذكيرات، الشارات، ونقاط التحسين في مكان واحد.",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        lineHeight = 20.sp
                    )
                }
                Box(
                    modifier = Modifier
                        .size(66.dp)
                        .clip(RoundedCornerShape(22.dp))
                        .background(Color.White.copy(alpha = 0.48f)),
                    contentAlignment = Alignment.Center
                ) {
                    Text("🔔", fontSize = 36.sp)
                }
            }

            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), verticalAlignment = Alignment.CenterVertically) {
                NotificationsHeroChip("$unreadCount", "غير مقروء")
                NotificationsHeroChip("$totalCount", "إجمالي")
                NotificationsHeroChip("ذكي", "توجيه")
            }
        }
    }
}

@Composable
private fun NotificationsHeroChip(value: String, label: String) {
    Surface(
        shape = RoundedCornerShape(15.dp),
        color = Color.White.copy(alpha = 0.55f),
        border = BorderStroke(1.dp, Color.White.copy(alpha = 0.40f))
    ) {
        Column(
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 7.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(value, fontSize = 12.5.sp, fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.primary)
            Text(label, fontSize = 10.5.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable
private fun NotificationsEmptyState(modifier: Modifier = Modifier) {
    Column(
        modifier = modifier.fillMaxWidth().padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Box(
            modifier = Modifier
                .size(104.dp)
                .clip(CircleShape)
                .background(MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.45f)),
            contentAlignment = Alignment.Center
        ) {
            Text("🔔", fontSize = 50.sp)
        }
        Spacer(modifier = Modifier.height(22.dp))
        Text("صندوق التنبيهات فارغ", fontSize = 20.sp, fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.onBackground)
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "عندما تصلك تذكيرات تعليمية أو شارات جديدة ستظهر هنا مباشرة.",
            fontSize = 13.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center,
            lineHeight = 20.sp,
            fontWeight = FontWeight.SemiBold
        )
    }
}

@Composable
fun NotificationItemCard(item: NotificationDraft, isRead: Boolean, onClick: () -> Unit) {
    val accent = getNotificationBgColor(item.type)
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .testTag("notification_item_${item.id}"),
        color = if (isRead) MaterialTheme.colorScheme.surface else accent.copy(alpha = 0.08f),
        shape = RoundedCornerShape(22.dp),
        tonalElevation = if (isRead) 1.dp else 3.dp,
        border = BorderStroke(1.dp, if (isRead) MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.55f) else accent.copy(alpha = 0.45f))
    ) {
        Row(
            modifier = Modifier.padding(15.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(13.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(52.dp)
                    .clip(RoundedCornerShape(17.dp))
                    .background(accent.copy(alpha = 0.14f)),
                contentAlignment = Alignment.Center
            ) {
                Text(text = getNotificationLabelIcon(item.type), fontSize = 26.sp)
            }

            Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(5.dp)) {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                    Text(getNotificationTypeArabicName(item.type), fontSize = 11.sp, fontWeight = FontWeight.ExtraBold, color = accent)
                    Text(item.sentAt, fontSize = 10.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
                Text(item.title, fontWeight = FontWeight.ExtraBold, fontSize = 14.sp, color = MaterialTheme.colorScheme.onSurface, lineHeight = 19.sp)
                Text(item.body, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, maxLines = 2, lineHeight = 17.sp, fontWeight = FontWeight.SemiBold)
            }

            if (!isRead) {
                Box(modifier = Modifier.size(10.dp).clip(CircleShape).background(accent))
            }
        }
    }
}

@Composable
private fun PremiumNotificationDialog(item: NotificationDraft, onDismiss: () -> Unit, onPrimaryAction: () -> Unit) {
    val accent = getNotificationBgColor(item.type)
    AlertDialog(
        onDismissRequest = onDismiss,
        shape = RoundedCornerShape(28.dp),
        icon = {
            Box(
                modifier = Modifier
                    .size(64.dp)
                    .clip(RoundedCornerShape(22.dp))
                    .background(accent.copy(alpha = 0.14f)),
                contentAlignment = Alignment.Center
            ) {
                Text(getNotificationLabelIcon(item.type), fontSize = 34.sp)
            }
        },
        title = {
            Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Text(getNotificationTypeArabicName(item.type), fontSize = 13.sp, fontWeight = FontWeight.ExtraBold, color = accent)
                Text(item.title, fontSize = 19.sp, fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.onSurface, textAlign = TextAlign.Center)
            }
        },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(item.body, fontSize = 14.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, lineHeight = 22.sp, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.Center)
                Surface(shape = RoundedCornerShape(12.dp), color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.70f)) {
                    Text(
                        text = "تاريخ الإرسال: ${item.sentAt}",
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 7.dp),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        textAlign = TextAlign.Center
                    )
                }
            }
        },
        confirmButton = {
            Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Button(
                    onClick = onPrimaryAction,
                    modifier = Modifier.fillMaxWidth().height(50.dp),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Text(primaryActionText(item.type), fontWeight = FontWeight.ExtraBold)
                }
                OutlinedButton(
                    onClick = onDismiss,
                    modifier = Modifier.fillMaxWidth().height(48.dp),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Text("إغلاق", fontWeight = FontWeight.ExtraBold)
                }
            }
        }
    )
}

private fun primaryActionText(type: String): String {
    return when (type.lowercase().trim()) {
        "badge unlocked" -> "عرض الشارات"
        "daily reminder", "streak reminder" -> "ابدأ المذاكرة الآن"
        "weak topic reminder" -> "تفقد التقدم"
        "premium reminder" -> "استكشف Premium"
        else -> "موافق"
    }
}

fun getNotificationBgColor(type: String): Color {
    return when (type.lowercase().trim()) {
        "daily reminder" -> Color(0xFFE28743)
        "streak reminder" -> Color(0xFFDC2626)
        "badge unlocked" -> Color(0xFFCA8A04)
        "leaderboard movement" -> Color(0xFF8B5CF6)
        "weak topic reminder" -> Color(0xFF2563EB)
        "premium reminder" -> Color(0xFFD946EF)
        "admin announcement" -> Color(0xFF0D9488)
        else -> Color(0xFF4B5563)
    }
}

fun getNotificationLabelIcon(type: String): String {
    return when (type.lowercase().trim()) {
        "daily reminder" -> "🎯"
        "streak reminder" -> "🔥"
        "badge unlocked" -> "🏆"
        "leaderboard movement" -> "📈"
        "weak topic reminder" -> "📚"
        "premium reminder" -> "⭐"
        "admin announcement" -> "📣"
        else -> "🔔"
    }
}

fun getNotificationTypeArabicName(type: String): String {
    return when (type.lowercase().trim()) {
        "daily reminder" -> "تذكير يومي"
        "streak reminder" -> "حافظ على السلسلة"
        "badge unlocked" -> "إنجاز جديد"
        "leaderboard movement" -> "لوحة الصدارة"
        "weak topic reminder" -> "نقاط تحسين"
        "premium reminder" -> "عرض متميز"
        "admin announcement" -> "إعلان هام"
        else -> "تنبيه عام"
    }
}
