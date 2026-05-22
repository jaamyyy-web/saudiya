package com.example.ui.screens.student

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.StudentHomeScreen
import com.example.ui.theme.BottomNavActiveBg
import com.example.ui.theme.SurfaceContainerLowLight

@Composable
fun StudentMainScreen(rootNavController: NavController) {
    var selectedTab by remember { mutableStateOf("home") }

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        containerColor = MaterialTheme.colorScheme.background,
        bottomBar = {
            StudentBottomNavigation(
                selectedTab = selectedTab,
                onTabSelected = { selectedTab = it }
            )
        }
    ) { innerPadding ->
        Box(modifier = Modifier.padding(innerPadding)) {
            when (selectedTab) {
                "home" -> StudentHomeScreen(rootNavController)
                "subjects" -> SubjectsScreen(rootNavController)
                "practice" -> com.example.ui.screens.student.analytics.AnalyticsScreen(rootNavController)
                "leaderboard" -> com.example.ui.screens.student.leaderboard.LeaderboardScreen(rootNavController)
                "profile" -> com.example.ui.screens.student.profile.ProfileScreen(rootNavController)
            }
        }
    }
}

@Composable
fun PlaceholderScreen(title: String) {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Text(text = title, style = MaterialTheme.typography.titleLarge)
    }
}

@Composable
fun StudentBottomNavigation(selectedTab: String, onTabSelected: (String) -> Unit) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .navigationBarsPadding()
            .padding(horizontal = 14.dp, vertical = 10.dp),
        shape = RoundedCornerShape(28.dp),
        color = SurfaceContainerLowLight,
        tonalElevation = 8.dp,
        shadowElevation = 8.dp,
        border = androidx.compose.foundation.BorderStroke(
            1.dp,
            MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.55f)
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 9.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            BottomNavItem("🏠", "الرئيسية", selectedTab == "home") { onTabSelected("home") }
            BottomNavItem("📚", "المواد", selectedTab == "subjects") { onTabSelected("subjects") }
            BottomNavItem("📝", "تدريب", selectedTab == "practice") { onTabSelected("practice") }
            BottomNavItem("🏆", "ترتيب", selectedTab == "leaderboard") { onTabSelected("leaderboard") }
            BottomNavItem("👤", "حسابي", selectedTab == "profile") { onTabSelected("profile") }
        }
    }
}

@Composable
fun BottomNavItem(icon: String, label: String, isActive: Boolean, onClick: () -> Unit) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(4.dp),
        modifier = Modifier
            .clip(RoundedCornerShape(18.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 3.dp, vertical = 2.dp)
    ) {
        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(18.dp))
                .background(if (isActive) BottomNavActiveBg else Color.Transparent)
                .padding(horizontal = if (isActive) 17.dp else 12.dp, vertical = 6.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(text = icon, fontSize = if (isActive) 21.sp else 19.sp)
        }
        Text(
            text = label,
            fontSize = 11.sp,
            fontWeight = if (isActive) FontWeight.ExtraBold else FontWeight.SemiBold,
            color = if (isActive) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.78f)
        )
    }
}
