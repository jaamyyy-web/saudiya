package com.example.ui.screens.student

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
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
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(SurfaceContainerLowLight)
            .border(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.5f))
            .padding(horizontal = 8.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceEvenly,
        verticalAlignment = Alignment.CenterVertically
    ) {
        BottomNavItem(
            icon = "🏠", label = "الرئيسية", 
            isActive = selectedTab == "home",
            onClick = { onTabSelected("home") }
        )
        BottomNavItem(
            icon = "📚", label = "المواد", 
            isActive = selectedTab == "subjects",
            onClick = { onTabSelected("subjects") }
        )
        BottomNavItem(
            icon = "📝", label = "التدريب", 
            isActive = selectedTab == "practice",
            onClick = { onTabSelected("practice") }
        )
        BottomNavItem(
            icon = "🏆", label = "المتصدرون", 
            isActive = selectedTab == "leaderboard",
            onClick = { onTabSelected("leaderboard") }
        )
        BottomNavItem(
            icon = "👤", label = "حسابي", 
            isActive = selectedTab == "profile",
            onClick = { onTabSelected("profile") }
        )
    }
}

@Composable
fun BottomNavItem(icon: String, label: String, isActive: Boolean, onClick: () -> Unit) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(4.dp),
        modifier = Modifier.clickable(onClick = onClick)
    ) {
        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(50))
                .background(if (isActive) BottomNavActiveBg else Color.Transparent)
                .padding(horizontal = 20.dp, vertical = 4.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(text = icon, fontSize = 20.sp)
        }
        Text(
            text = label,
            fontSize = 12.sp,
            fontWeight = if (isActive) FontWeight.Bold else FontWeight.Normal,
            color = if (isActive) MaterialTheme.colorScheme.onPrimaryContainer else MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}
