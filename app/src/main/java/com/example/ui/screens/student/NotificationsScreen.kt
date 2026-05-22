package com.example.ui.screens.student

import androidx.compose.animation.*
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
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

    // Helper counts
    val unreadCount = notifications.count { it.id !in readIds }

    Scaffold(
        topBar = {
            MediumTopAppBar(
                title = {
                    Column {
                        Text(
                            text = "مركز التنبيهات",
                            fontWeight = FontWeight.Bold,
                            fontSize = 20.sp,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = "لديك $unreadCount تنبيه غير مقروء",
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                navigationIcon = {
                    IconButton(
                        onClick = { navController.navigateUp() },
                        modifier = Modifier.testTag("back_button")
                    ) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "رجوع"
                        )
                    }
                },
                actions = {
                    if (notifications.isNotEmpty()) {
                        // Mark all as read
                        IconButton(
                            onClick = {
                                notifications.forEach {
                                    if (it.id !in readIds) {
                                        readIds.add(it.id)
                                    }
                                }
                            }
                        ) {
                            Icon(
                                imageVector = Icons.Default.Check,
                                contentDescription = "تحديد الكل كمقروء",
                                tint = MaterialTheme.colorScheme.primary
                            )
                        }
                        // Clear all
                        IconButton(
                            onClick = {
                                notifications.clear()
                                readIds.clear()
                            }
                        ) {
                            Icon(
                                imageVector = Icons.Default.Delete,
                                contentDescription = "مسح الكل",
                                tint = MaterialTheme.colorScheme.error
                            )
                        }
                    }
                },
                colors = TopAppBarDefaults.mediumTopAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(MaterialTheme.colorScheme.background)
        ) {
            if (notifications.isEmpty()) {
                // Empty state list view
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Box(
                        modifier = Modifier
                            .size(100.dp)
                            .clip(CircleShape)
                            .background(MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("🔔", fontSize = 48.sp)
                    }
                    Spacer(modifier = Modifier.height(24.dp))
                    Text(
                        text = "صندوق التنبيهات فارغ",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "عندما يرسل لك المعلمون أو النظام تنبيهات تعليمية مهمة، ستظهر هنا مباشرة.",
                        fontSize = 13.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        textAlign = TextAlign.Center,
                        lineHeight = 20.sp
                    )
                }
            } else {
                // Content active list RTL
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(notifications.toList().reversed()) { item ->
                        val isRead = item.id in readIds
                        NotificationItemCard(
                            item = item,
                            isRead = isRead,
                            onClick = {
                                if (!isRead) {
                                    readIds.add(item.id)
                                }
                                selectedNotification = item
                                showDialog = true
                            }
                        )
                    }
                }
            }

            // Notification Detail Dialog
            if (showDialog && selectedNotification != null) {
                val item = selectedNotification!!
                AlertDialog(
                    onDismissRequest = { showDialog = false },
                    title = {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(getNotificationBgColor(item.type).copy(alpha = 0.15f)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    getNotificationLabelIcon(item.type),
                                    fontSize = 18.sp
                                )
                            }
                            Text(
                                text = getNotificationTypeArabicName(item.type),
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary
                            )
                        }
                    },
                    text = {
                        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                            Text(
                                text = item.title,
                                fontWeight = FontWeight.Bold,
                                fontSize = 18.sp,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Text(
                                text = item.body,
                                fontSize = 14.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                lineHeight = 22.sp
                            )
                            Text(
                                text = "تاريخ الإرسال: ${item.sentAt}",
                                fontSize = 11.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    },
                    confirmButton = {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            // Conditional primary action based on type for deep links
                            Button(
                                onClick = {
                                    showDialog = false
                                    when (item.type.lowercase().trim()) {
                                        "badge unlocked" -> navController.navigate("rewards")
                                        "daily reminder", "streak reminder" -> navController.navigate("student_main") // Takes home
                                        "weak topic reminder" -> navController.navigate("analytics")
                                        "premium reminder" -> navController.navigate("subscription_plans")
                                        else -> {} // Stay
                                    }
                                },
                                modifier = Modifier.weight(1f)
                            ) {
                                Text(
                                    text = when (item.type.lowercase().trim()) {
                                        "badge unlocked" -> "عرض الشارات الحاصل عليها"
                                        "daily reminder", "streak reminder" -> "ابدأ المذاكرة الآن"
                                        "weak topic reminder" -> "تفقد لوحة التقدم العلمي"
                                        "premium reminder" -> "استكشف الباقة البريميوم"
                                        else -> "موافق"
                                    }
                                )
                            }
                            if (item.type.lowercase().trim() in listOf("badge unlocked", "daily reminder", "streak reminder", "weak topic reminder", "premium reminder")) {
                                OutlinedButton(
                                    onClick = { showDialog = false },
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Text("إغلاق")
                                }
                            }
                        }
                    }
                )
            }
        }
    }
}

@Composable
fun NotificationItemCard(
    item: NotificationDraft,
    isRead: Boolean,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .testTag("notification_item_${item.id}"),
        colors = CardDefaults.cardColors(
            containerColor = if (isRead) MaterialTheme.colorScheme.surface else MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.15f)
        ),
        shape = RoundedCornerShape(16.dp),
        border = BorderStroke(
            width = if (isRead) 1.dp else 2.dp,
            color = if (isRead) MaterialTheme.colorScheme.outlineVariant else MaterialTheme.colorScheme.primary.copy(alpha = 0.5f)
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Icon Badge Based on Type
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(getNotificationBgColor(item.type).copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = getNotificationLabelIcon(item.type),
                    fontSize = 24.sp
                )
            }

            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = getNotificationTypeArabicName(item.type),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = getNotificationBgColor(item.type)
                    )
                    Text(
                        text = item.sentAt,
                        fontSize = 10.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                Text(
                    text = item.title,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = MaterialTheme.colorScheme.onSurface
                )

                Text(
                    text = item.body,
                    fontSize = 12.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 2,
                    lineHeight = 16.sp
                )
            }

            // Unread Dot Indicator
            if (!isRead) {
                Box(
                    modifier = Modifier
                        .size(10.dp)
                        .clip(CircleShape)
                        .background(MaterialTheme.colorScheme.primary)
                )
            }
        }
    }
}

// Visual category helpers
fun getNotificationBgColor(type: String): Color {
    return when (type.lowercase().trim()) {
        "daily reminder" -> Color(0xFFE28743) // Warm orange
        "streak reminder" -> Color(0xFFDC2626) // Hot Streak Red
        "badge unlocked" -> Color(0xFFCA8A04) // Shiny Yellow Gold
        "leaderboard movement" -> Color(0xFF8B5CF6) // Royal Violet
        "weak topic reminder" -> Color(0xFF2563EB) // Royal Blue
        "premium reminder" -> Color(0xFFD946EF) // Pink Magenta Premium
        "admin announcement" -> Color(0xFF0D9488) // Corporate Teal
        else -> Color(0xFF4B5563) // Slate Gray
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
