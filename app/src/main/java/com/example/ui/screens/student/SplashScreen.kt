package com.example.ui.screens.student

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay

@Composable
fun SplashScreen(
    onNavigateToStudentLogin: () -> Unit,
    onNavigateToAdminLogin: () -> Unit
) {
    val infiniteTransition = rememberInfiniteTransition(label = "premium-pulse")
    val scale by infiniteTransition.animateFloat(
        initialValue = 0.94f,
        targetValue = 1.06f,
        animationSpec = infiniteRepeatable(
            animation = tween(1300, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "logo-scale"
    )

    LaunchedEffect(Unit) {
        delay(1600)
        onNavigateToStudentLogin()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        MaterialTheme.colorScheme.primary.copy(alpha = 0.18f),
                        MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.22f),
                        MaterialTheme.colorScheme.background
                    )
                )
            )
            .windowInsetsPadding(WindowInsets.safeDrawing),
        contentAlignment = Alignment.Center
    ) {
        Box(
            modifier = Modifier
                .size(260.dp)
                .align(Alignment.TopEnd)
                .offset(x = 90.dp, y = (-70).dp)
                .background(
                    MaterialTheme.colorScheme.primary.copy(alpha = 0.08f),
                    CircleShape
                )
        )
        Box(
            modifier = Modifier
                .size(220.dp)
                .align(Alignment.BottomStart)
                .offset(x = (-80).dp, y = 70.dp)
                .background(
                    Color(0xFFFFD166).copy(alpha = 0.10f),
                    CircleShape
                )
        )

        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 28.dp)
        ) {
            Box(
                modifier = Modifier
                    .scale(scale)
                    .size(124.dp)
                    .background(
                        brush = Brush.linearGradient(
                            colors = listOf(
                                MaterialTheme.colorScheme.primary.copy(alpha = 0.18f),
                                Color(0xFFFFD166).copy(alpha = 0.22f)
                            )
                        ),
                        shape = RoundedCornerShape(36.dp)
                    ),
                contentAlignment = Alignment.Center
            ) {
                Text(text = "🎓", fontSize = 58.sp)
            }

            Spacer(modifier = Modifier.height(30.dp))

            Text(
                text = "منصة التعليم الذكية",
                fontSize = 31.sp,
                fontWeight = FontWeight.ExtraBold,
                color = MaterialTheme.colorScheme.primary,
                textAlign = TextAlign.Center,
                lineHeight = 38.sp
            )

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = "تعلم يومياً • اختبر نفسك • اجمع النقاط",
                fontSize = 15.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "للمرحلة المتوسطة بالمملكة العربية السعودية 🇸🇦",
                fontSize = 13.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.82f),
                textAlign = TextAlign.Center,
                lineHeight = 20.sp
            )

            Spacer(modifier = Modifier.height(46.dp))

            CircularProgressIndicator(
                modifier = Modifier.size(34.dp),
                color = MaterialTheme.colorScheme.primary,
                strokeWidth = 3.dp
            )

            Spacer(modifier = Modifier.height(14.dp))

            Text(
                text = "جاري تجهيز رحلتك التعليمية...",
                fontSize = 12.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.72f),
                fontWeight = FontWeight.SemiBold
            )
        }
    }
}
