package com.example.ui.screens.student.rewards

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.domain.GamificationManager
import com.example.domain.models.Badge

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RewardsScreen(navController: NavController) {
    val state by GamificationManager.state.collectAsState()
    val unlockedCount = state.badges.count { it.unlocked }

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        topBar = {
            TopAppBar(
                title = { Text("المكافآت", fontWeight = FontWeight.ExtraBold) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(imageVector = Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "رجوع")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background)
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            RewardsHeroCard(
                xp = state.xp,
                coins = state.coins,
                unlockedCount = unlockedCount,
                totalCount = state.badges.size
            )

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                StatCard(modifier = Modifier.weight(1f), icon = "⭐", label = "نقاط الخبرة", value = "${state.xp}")
                StatCard(modifier = Modifier.weight(1f), icon = "🪙", label = "العملات", value = "${state.coins}")
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                    Text("شاراتي", fontSize = 21.sp, fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.onBackground)
                    Text("افتح شارات جديدة مع كل إنجاز", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
                Surface(shape = RoundedCornerShape(14.dp), color = MaterialTheme.colorScheme.primary.copy(alpha = 0.10f)) {
                    Text(
                        text = "$unlockedCount/${state.badges.size}",
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 7.dp),
                        fontSize = 12.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
            }

            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                modifier = Modifier.weight(1f),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                contentPadding = PaddingValues(bottom = 18.dp)
            ) {
                items(state.badges) { badge ->
                    RewardBadgeCard(badge = badge)
                }
            }
        }
    }
}

@Composable
private fun RewardsHeroCard(xp: Int, coins: Int, unlockedCount: Int, totalCount: Int) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(30.dp))
            .background(
                Brush.linearGradient(
                    listOf(
                        MaterialTheme.colorScheme.primaryContainer,
                        MaterialTheme.colorScheme.primary.copy(alpha = 0.18f)
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
                    Text(
                        text = "Reward Center",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Text(
                        text = "إنجازاتك ومكافآتك",
                        fontSize = 25.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = MaterialTheme.colorScheme.onPrimaryContainer,
                        lineHeight = 32.sp
                    )
                    Text(
                        text = "استمر في التعلم لفتح الشارات وجمع النقاط والعملات.",
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
                    Text("🏆", fontSize = 36.sp)
                }
            }

            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), verticalAlignment = Alignment.CenterVertically) {
                RewardsHeroChip("$xp", "XP")
                RewardsHeroChip("$coins", "عملات")
                RewardsHeroChip("$unlockedCount/$totalCount", "شارات")
            }
        }
    }
}

@Composable
private fun RewardsHeroChip(value: String, label: String) {
    Surface(
        shape = RoundedCornerShape(15.dp),
        color = Color.White.copy(alpha = 0.55f),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color.White.copy(alpha = 0.40f))
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
fun StatCard(modifier: Modifier = Modifier, icon: String, label: String, value: String) {
    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(22.dp),
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 2.dp,
        border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.55f))
    ) {
        Column(
            modifier = Modifier.padding(vertical = 14.dp, horizontal = 8.dp).fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(5.dp)
        ) {
            Text(icon, fontSize = 26.sp)
            Text(value, fontSize = 22.sp, fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.primary)
            Text(label, fontSize = 11.5.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurfaceVariant, textAlign = TextAlign.Center)
        }
    }
}

@Composable
private fun RewardBadgeCard(badge: Badge) {
    val unlocked = badge.unlocked
    Surface(
        modifier = Modifier.aspectRatio(1f),
        shape = RoundedCornerShape(24.dp),
        color = if (unlocked) Color(0xFFFFF7ED) else MaterialTheme.colorScheme.surface,
        tonalElevation = if (unlocked) 3.dp else 1.dp,
        border = androidx.compose.foundation.BorderStroke(
            1.dp,
            if (unlocked) Color(0xFFFED7AA) else MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.55f)
        )
    ) {
        Column(
            modifier = Modifier.fillMaxSize().padding(14.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Box(
                modifier = Modifier
                    .size(66.dp)
                    .clip(CircleShape)
                    .background(if (unlocked) Color(0xFFFFEDD5) else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.75f)),
                contentAlignment = Alignment.Center
            ) {
                Text(if (unlocked) badge.icon else "🔒", fontSize = 34.sp)
            }
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = badge.name,
                fontWeight = FontWeight.ExtraBold,
                fontSize = 13.sp,
                textAlign = TextAlign.Center,
                color = if (unlocked) Color(0xFF9A3412) else MaterialTheme.colorScheme.onSurfaceVariant,
                lineHeight = 18.sp
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = if (unlocked) "مفتوحة" else "مقفلة",
                fontWeight = FontWeight.SemiBold,
                fontSize = 10.5.sp,
                textAlign = TextAlign.Center,
                color = if (unlocked) Color(0xFFD97706) else MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.72f)
            )
        }
    }
}
