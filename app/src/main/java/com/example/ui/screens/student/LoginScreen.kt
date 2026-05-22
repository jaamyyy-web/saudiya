package com.example.ui.screens.student

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.mock.MockProfileData
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoginScreen(
    onNavigateToProfileSetup: () -> Unit,
    onNavigateToHome: () -> Unit,
    onNavigateToAdmin: () -> Unit = {}
) {
    var isLoading by remember { mutableStateOf(false) }
    var successToast by remember { mutableStateOf("") }
    
    val coroutineScope = rememberCoroutineScope()
    val focusManager = LocalFocusManager.current

    // Triggered under-the-hood login mechanism mapped to Google & Apple clicks
    fun performSocialLogin(emailAddress: String) {
        isLoading = true
        focusManager.clearFocus()

        coroutineScope.launch {
            delay(1500) // Simulated premium verification speed
            isLoading = false
            
            if (emailAddress == "jaamyyy@gmail.com") {
                // Route to Profile Setup so the student can create name, grade and school name as requested
                successToast = "تم تسجيل الدخول بنجاح! جاري توجيهك لتأكيد وتهيئة حسابك الدراسي... 🚀"
                MockProfileData.currentUserProfile = MockProfileData.currentUserProfile.copy(
                    id = "user_jaamyyy",
                    name = "جميل الحربي",
                    grade = "الصف الثاني المتوسط",
                    subscriptionStatus = "مميز 👑"
                )
                delay(1000)
                onNavigateToProfileSetup()
            } else {
                // Testing Account: greet2233@gmail.com (New login -> Route to Profile Setup)
                successToast = "تم التحقق بنجاح! جاري توجيهك لتهيئة حسابك الدراسي... 🚀"
                MockProfileData.currentUserProfile = MockProfileData.currentUserProfile.copy(
                    id = "user_greet",
                    name = "",
                    grade = "",
                    subscriptionStatus = "مجاني"
                )
                delay(1000)
                onNavigateToProfileSetup()
            }
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(
                        MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.35f),
                        MaterialTheme.colorScheme.background
                    )
                )
            )
            .windowInsetsPadding(WindowInsets.safeDrawing),
        contentAlignment = Alignment.TopCenter
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .widthIn(max = 500.dp)
                .verticalScroll(rememberScrollState())
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(22.dp)
        ) {
            Spacer(modifier = Modifier.height(36.dp))

            // Beautiful Islamic School Emblem Circle
            Box(
                modifier = Modifier
                    .size(90.dp)
                    .background(
                        color = MaterialTheme.colorScheme.primary.copy(alpha = 0.12f),
                        shape = RoundedCornerShape(28.dp)
                    ),
                contentAlignment = Alignment.Center
            ) {
                Text("🧠", fontSize = 48.sp)
            }

            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                Text(
                    text = "بوابة الطلاب الذكية",
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary,
                    textAlign = TextAlign.Center
                )
                Text(
                    text = "البوابة الموحدة للمرحلة المتوسطة بالمملكة 🇸🇦",
                    fontSize = 14.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    textAlign = TextAlign.Center,
                    fontWeight = FontWeight.Bold
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Dynamic Success Feedback Panel
            AnimatedVisibility(
                visible = successToast.isNotEmpty(),
                enter = fadeIn() + expandVertically(),
                exit = fadeOut() + shrinkVertically()
            ) {
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFDCFCE7)),
                    shape = RoundedCornerShape(14.dp),
                    modifier = Modifier.fillMaxWidth(),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF86EFAC))
                ) {
                    Text(
                        text = successToast,
                        color = Color(0xFF15803D),
                        fontSize = 13.5.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(14.dp),
                        textAlign = TextAlign.Center,
                        lineHeight = 18.sp
                    )
                }
            }

            // High Fidelity Social Login Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(28.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.6f))
            ) {
                Column(
                    modifier = Modifier.padding(24.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Text(
                        text = "تسجيل دخول آمن وفوري 🔒",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface,
                        modifier = Modifier.align(Alignment.CenterHorizontally)
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    // 1. Google Button -> Maps to 'jaamyyy@gmail.com' for seamless profile bypass demo
                    Button(
                        onClick = { 
                            if (!isLoading) {
                                performSocialLogin("jaamyyy@gmail.com") 
                            }
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(54.dp),
                        shape = RoundedCornerShape(16.dp),
                        enabled = !isLoading,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color(0xFFF3F4F6),
                            contentColor = Color.Black
                        ),
                        border = androidx.compose.foundation.BorderStroke(1.2.dp, Color(0xFFE5E7EB))
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            Text("🌐", fontSize = 18.sp)
                            Text(
                                "المتابعة باستخدام Google",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    // 2. Apple Button -> Maps to 'greet2233@gmail.com' for new profile generation flow
                    Button(
                        onClick = { 
                            if (!isLoading) {
                                performSocialLogin("greet2233@gmail.com") 
                            }
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(54.dp),
                        shape = RoundedCornerShape(16.dp),
                        enabled = !isLoading,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color.Black,
                            contentColor = Color.White
                        )
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            Text("🍏", fontSize = 18.sp)
                            Text(
                                "المتابعة باستخدام Apple",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    if (isLoading) {
                        Spacer(modifier = Modifier.height(8.dp))
                        Box(
                            modifier = Modifier.fillMaxWidth(),
                            contentAlignment = Alignment.Center
                        ) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(28.dp),
                                color = MaterialTheme.colorScheme.primary,
                                strokeWidth = 3.dp
                            )
                        }
                    }

                    HorizontalDivider(
                        modifier = Modifier.padding(vertical = 8.dp),
                        color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.5f)
                    )

                    TextButton(
                        onClick = onNavigateToAdmin,
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text(
                            text = "الدخول كمسؤول (Admin Portal) ⚙️",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = MaterialTheme.colorScheme.secondary
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Encryption Trust & Privacy Policy Info
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Text(
                    text = "جميع الاتصالات مشفرة بالكامل ومتوافقة مع أنظمة وزارة التعليم 🇸🇦",
                    fontSize = 11.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.8f),
                    textAlign = TextAlign.Center
                )
                Text(
                    text = "باستخدامك للمنصة، فإنك توافق على شروط الخدمة وسياسة الخصوصية.",
                    fontSize = 10.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f),
                    textAlign = TextAlign.Center
                )
            }
        }
    }
}
