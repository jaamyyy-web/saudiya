package com.example

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.blur
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import com.example.data.mock.MockData
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.BottomNavActiveBg
import com.example.ui.theme.PackIconGreen
import com.example.ui.theme.PinkAccent
import com.example.ui.theme.PurpleAccent
import com.example.ui.theme.RedAccent
import com.example.ui.theme.SurfaceContainerLowLight

import com.example.domain.GamificationManager
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.navigation.NavController

@Composable
fun StudentHomeScreen(navController: NavController, modifier: Modifier = Modifier) {
  val gamificationState by GamificationManager.state.collectAsState()
  
  Column(
    modifier = modifier
      .fillMaxSize()
      .verticalScroll(rememberScrollState())
      .padding(horizontal = 16.dp, vertical = 8.dp),
    verticalArrangement = Arrangement.spacedBy(24.dp)
  ) {
    TopAppBarSection(gamificationState.xp, gamificationState.coins, gamificationState.level, navController)
    ProgressHighlightCard()
    LearningPacksSection()
    Spacer(modifier = Modifier.height(16.dp))
  }
}

@Composable
fun TopAppBarSection(xp: Int, coins: Int, level: Int, navController: NavController) {
  Row(
    modifier = Modifier
      .fillMaxWidth()
      .padding(vertical = 8.dp),
    horizontalArrangement = Arrangement.SpaceBetween,
    verticalAlignment = Alignment.CenterVertically
  ) {
    Row(
      horizontalArrangement = Arrangement.spacedBy(16.dp),
      verticalAlignment = Alignment.CenterVertically
    ) {
      Box(
        modifier = Modifier
          .size(48.dp)
          .clip(CircleShape)
          .background(MaterialTheme.colorScheme.primaryContainer),
        contentAlignment = Alignment.Center
      ) {
        Text(
          text = "أ",
          color = MaterialTheme.colorScheme.onPrimaryContainer,
          fontWeight = FontWeight.Bold,
          fontSize = 20.sp
        )
      }
      Column {
        Text(
          text = "مرحباً، أحمد",
          style = MaterialTheme.typography.titleMedium,
          fontWeight = FontWeight.SemiBold,
          color = MaterialTheme.colorScheme.onBackground
        )
        Text(
          text = "مستوى $level",
          style = MaterialTheme.typography.bodySmall,
          color = MaterialTheme.colorScheme.primary,
          fontWeight = FontWeight.Bold
        )
      }
    }
    val unreadCount = MockData.sentNotifications.count { it.id !in MockData.readNotificationIds }

    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        Box(
          modifier = Modifier
            .background(MaterialTheme.colorScheme.surfaceVariant, RoundedCornerShape(16.dp))
            .clickable { navController.navigate("rewards") }
            .padding(horizontal = 12.dp, vertical = 6.dp),
          contentAlignment = Alignment.Center
        ) {
          Row(verticalAlignment = Alignment.CenterVertically) {
              Text(text = "⭐ $xp", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color(0xFFD97706))
              Spacer(modifier = Modifier.width(8.dp))
              Text(text = "🪙 $coins", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color(0xFF16A34A))
          }
        }
        Box(
          modifier = Modifier
            .size(40.dp)
            .clip(CircleShape)
            .background(SurfaceContainerLowLight)
            .clickable { navController.navigate("notifications") },
          contentAlignment = Alignment.Center
        ) {
          Box(modifier = Modifier.padding(2.dp)) {
            Text(text = "🔔", fontSize = 20.sp)
            if (unreadCount > 0) {
              Box(
                modifier = Modifier
                  .size(9.dp)
                  .align(Alignment.TopEnd)
                  .clip(CircleShape)
                  .background(Color.Red)
              )
            }
          }
        }
    }
  }
}

@Composable
fun ProgressHighlightCard() {
  Box(
    modifier = Modifier
      .fillMaxWidth()
      .clip(RoundedCornerShape(24.dp))
      .background(MaterialTheme.colorScheme.primaryContainer)
      .padding(20.dp)
  ) {
    // Decorative element
    Box(
      modifier = Modifier
        .size(96.dp)
        .align(Alignment.BottomStart)
        .clip(CircleShape)
        .background(MaterialTheme.colorScheme.primary.copy(alpha = 0.1f))
    )

    Column(
      verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
      Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
        Text(
          text = "نظرة عامة",
          color = MaterialTheme.colorScheme.onPrimaryContainer,
          fontSize = 14.sp,
          fontWeight = FontWeight.Bold,
          letterSpacing = 1.sp
        )
        Text(
          text = "أكملت ٦٥٪",
          color = MaterialTheme.colorScheme.onPrimaryContainer,
          fontSize = 24.sp,
          fontWeight = FontWeight.Bold
        )
        Text(
          text = "من حزمة الرياضيات لهذا الأسبوع",
          color = MaterialTheme.colorScheme.onSurfaceVariant,
          fontSize = 14.sp
        )
      }

      // Progress bar
      Box(
        modifier = Modifier
          .fillMaxWidth()
          .height(12.dp)
          .clip(RoundedCornerShape(50))
          .background(Color.White.copy(alpha = 0.5f))
      ) {
        Box(
          modifier = Modifier
            .fillMaxWidth(0.65f)
            .height(12.dp)
            .clip(RoundedCornerShape(50))
            .background(MaterialTheme.colorScheme.primary)
        )
      }
    }
  }
}

@Composable
fun LearningPacksSection() {
  Column(
    verticalArrangement = Arrangement.spacedBy(12.dp)
  ) {
    Row(
      modifier = Modifier.fillMaxWidth(),
      horizontalArrangement = Arrangement.SpaceBetween,
      verticalAlignment = Alignment.CenterVertically
    ) {
      Text(
        text = "حزمي التعليمية",
        style = MaterialTheme.typography.titleLarge,
        fontWeight = FontWeight.Bold,
        color = MaterialTheme.colorScheme.onBackground
      )
      Text(
        text = "عرض الكل",
        color = MaterialTheme.colorScheme.primary,
        fontSize = 14.sp,
        fontWeight = FontWeight.SemiBold,
        modifier = Modifier.clickable { }
      )
    }

    PackItem(
      title = "الرياضيات: الهندسة التحليلية",
      subtitle = "الحزمة الأولى",
      icon = "📐",
      iconBg = PurpleAccent,
      actionIcon = "◀",
      actionColor = MaterialTheme.colorScheme.primary,
      isCompleted = false,
      isLocked = false
    )
    PackItem(
      title = "العلوم: التفاعلات الكيميائية",
      subtitle = "الحزمة الثانية",
      icon = "🧪",
      iconBg = RedAccent,
      actionIcon = "◀",
      actionColor = MaterialTheme.colorScheme.primary,
      isCompleted = false,
      isLocked = true
    )
    PackItem(
      title = "اللغة العربية: القواعد",
      subtitle = "الحزمة الثانية",
      icon = "📖",
      iconBg = PinkAccent,
      actionIcon = "✓",
      actionColor = PackIconGreen,
      isCompleted = false,
      isLocked = true
    )
  }
}

@Composable
fun PackItem(
  title: String,
  subtitle: String,
  icon: String,
  iconBg: Color,
  actionIcon: String,
  actionColor: Color,
  isCompleted: Boolean,
  isLocked: Boolean
) {
  Row(
    modifier = Modifier
      .fillMaxWidth()
      .alpha(if (isCompleted || isLocked) 0.6f else 1f)
      .clip(RoundedCornerShape(16.dp))
      .background(MaterialTheme.colorScheme.surface)
      .border(1.dp, MaterialTheme.colorScheme.outline, RoundedCornerShape(16.dp))
      .clickable(enabled = !isLocked) { }
      .padding(16.dp),
    verticalAlignment = Alignment.CenterVertically,
    horizontalArrangement = Arrangement.spacedBy(16.dp)
  ) {
    Box(
      modifier = Modifier
        .size(48.dp)
        .clip(RoundedCornerShape(12.dp))
        .background(iconBg),
      contentAlignment = Alignment.Center
    ) {
      Text(text = icon, fontSize = 24.sp)
    }
    Column(modifier = Modifier.weight(1f)) {
      Text(
        text = title,
        fontWeight = FontWeight.Bold,
        color = MaterialTheme.colorScheme.onBackground
      )
      Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp)
      ) {
        Text(
          text = subtitle,
          fontSize = 12.sp,
          color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        if (isLocked) {
          Box(
            modifier = Modifier
              .background(Color(0xFFFFD700), RoundedCornerShape(4.dp))
              .padding(horizontal = 6.dp, vertical = 2.dp)
          ) {
            Text(
              text = "Premium",
              fontSize = 10.sp,
              fontWeight = FontWeight.Bold,
              color = Color.Black
            )
          }
        }
      }
    }
    if (isLocked) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(text = "🔒", fontSize = 16.sp)
            Text(
                text = "ترقية",
                fontSize = 10.sp,
                color = MaterialTheme.colorScheme.primary,
                fontWeight = FontWeight.Bold
            )
        }
    } else {
        Text(
          text = actionIcon,
          color = actionColor,
          fontWeight = FontWeight.Bold
        )
    }
  }
}

