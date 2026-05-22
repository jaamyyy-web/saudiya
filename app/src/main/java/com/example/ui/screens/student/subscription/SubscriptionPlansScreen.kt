package com.example.ui.screens.student.subscription

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.domain.SubscriptionManager
import com.example.domain.models.SubscriptionPlan
import com.example.domain.models.SubscriptionPlanType
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SubscriptionPlansScreen(navController: NavController) {
    val coroutineScope = rememberCoroutineScope()
    val snackbarHostState = remember { SnackbarHostState() }

    val singlePlan = SubscriptionPlan(
        id = "plan_single",
        name = "الباقة الفردية المميزة ⚡",
        type = SubscriptionPlanType.SINGLE_USER,
        price = "39 ريال",
        period = "/ شهرياً",
        features = listOf(
            "ملف شخصي واحد",
            "لا محدود: أسئلة وحزم",
            "تحليلات ذكية ومتقدمة",
            "تعليم متكيف وتوصيات ذكية",
            "نمط الاختبارات (Exam Mode)",
            "أقصى حد: جهازين"
        ),
        deviceLimit = 2,
        maxProfiles = 1
    )

    val familyPlan = SubscriptionPlan(
        id = "plan_family",
        name = "الباقة العائلية الشاملة 👨‍👩‍👧‍👦",
        type = SubscriptionPlanType.FAMILY,
        price = "99 ريال",
        period = "/ شهرياً",
        features = listOf(
            "حتى 4 ملفات شخصية إضافية",
            "لوحة تحكم خاصة بأولياء الأمور",
            "تحليلات منفصلة لكل طفل",
            "جميع ميزات الباقة المميزة",
            "أقصى حد: 6 أجهزة",
            "فاتورة واحدة مشتركة"
        ),
        deviceLimit = 6,
        maxProfiles = 4
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("الاشتراكات المميزة", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(imageVector = Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "رجوع")
                    }
                }
            )
        },
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { padding ->
        Box(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background),
            contentAlignment = Alignment.TopCenter
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .widthIn(max = 580.dp)
                    .verticalScroll(rememberScrollState())
                    .padding(horizontal = 16.dp, vertical = 20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "ارتقِ بمستواك التعليمي 👑",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary,
                    textAlign = TextAlign.Center
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "اختر الباقة المناسبة للوصول غير المحدود إلى كافة الحزم التعليمية، الاختبارات الذكية، وتقارير أولياء الأمور.",
                    fontSize = 14.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    textAlign = TextAlign.Center,
                    lineHeight = 20.sp
                )
                Spacer(modifier = Modifier.height(28.dp))

                PlanCard(plan = singlePlan, onClick = {
                    SubscriptionManager.validateGooglePlayPurchase(
                        userId = "user_dummy_789",
                        purchaseToken = "token_google_play_verify_xyz",
                        productId = "product_single_user",
                        deviceId = "android_device_id_current"
                    ) { success, message ->
                        if (success) {
                            navController.navigate("payment_success/${singlePlan.type.name}")
                        } else {
                            coroutineScope.launch {
                                snackbarHostState.showSnackbar(message)
                            }
                        }
                    }
                })
                
                Spacer(modifier = Modifier.height(20.dp))
                
                PlanCard(plan = familyPlan, onClick = {
                    SubscriptionManager.validateAppleReceipt(
                        userId = "user_dummy_789",
                        receiptData = "receipt_data_apple_verify_abc",
                        deviceId = "android_device_id_current"
                    ) { success, message ->
                        if (success) {
                            navController.navigate("payment_success/${familyPlan.type.name}")
                        } else {
                            coroutineScope.launch {
                                snackbarHostState.showSnackbar(message)
                            }
                        }
                    }
                }, isHighlighted = true)
                
                Spacer(modifier = Modifier.height(24.dp))
                
                // Secure Payment Gateways Badge
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(14.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Text("🛡️", fontSize = 16.sp)
                            Text("دفع آمن ومشفر ١٠٠٪ ومتوافق مع المتاجر الرسمية", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                        Text(
                            text = "🇸🇦 مدى •  Apple Pay • 💳 Visa • 💳 Mastercard • Google Play",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Medium,
                            color = MaterialTheme.colorScheme.primary,
                            textAlign = TextAlign.Center
                        )
                        Text(
                            text = "الاشتراكات تتجدد تلقائياً شهرياً ويمكن إلغاؤها بكل بساطة في أي وقت من إعدادات المتجر بدون أي غرامات.",
                            fontSize = 10.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.8f),
                            textAlign = TextAlign.Center,
                            lineHeight = 14.sp
                        )
                    }
                }
                
                Spacer(modifier = Modifier.height(24.dp))
                
                TextButton(onClick = {
                    SubscriptionManager.restorePastPurchases("user_dummy_789") { success, message ->
                        coroutineScope.launch {
                            snackbarHostState.showSnackbar(message)
                        }
                    }
                }) {
                    Text("استعادة المشتريات السابقة", fontSize = 15.sp, fontWeight = FontWeight.Bold)
                }
                
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "شروط الاستخدام وسياسة الخصوصية لمنصة التعليم المتوسطة السعودية متوفرة على موقعنا الإلكتروني.",
                    fontSize = 10.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f),
                    textAlign = TextAlign.Center
                )
            }
        }
    }
}

@Composable
fun PlanCard(plan: SubscriptionPlan, onClick: () -> Unit, isHighlighted: Boolean = false) {
    val borderColor = if (isHighlighted) Color(0xFFFFD700) else MaterialTheme.colorScheme.outlineVariant
    val containerColor = if (isHighlighted) Color(0xFFFFFDF0) else MaterialTheme.colorScheme.surface
    val highlightBorderWidth = if (isHighlighted) 2.5.dp else 1.dp

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .border(highlightBorderWidth, borderColor, RoundedCornerShape(24.dp))
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = containerColor),
        elevation = CardDefaults.cardElevation(
            defaultElevation = if (isHighlighted) 4.dp else 1.dp
        )
    ) {
        Column(modifier = Modifier.padding(24.dp)) {
            if (isHighlighted) {
                Box(
                    modifier = Modifier
                        .background(Color(0xFFFFD700), RoundedCornerShape(8.dp))
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                ) {
                    Text("الباقة العائلية الأكثر توفيراً 🔥", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.Black)
                }
                Spacer(modifier = Modifier.height(14.dp))
            }
            
            Text(
                text = plan.name, 
                fontSize = 22.sp, 
                fontWeight = FontWeight.Bold, 
                color = if (isHighlighted) Color(0xFFD97706) else MaterialTheme.colorScheme.primary
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Row(verticalAlignment = Alignment.Bottom) {
                Text(plan.price, fontSize = 34.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurface)
                Spacer(modifier = Modifier.width(4.dp))
                Text(plan.period, fontSize = 15.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.padding(bottom = 6.dp))
            }
            
            Spacer(modifier = Modifier.height(20.dp))
            HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.5f))
            Spacer(modifier = Modifier.height(20.dp))
            
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                plan.features.forEach { feature ->
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(20.dp)
                                .background(Color(0xFFDCFCE7), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("✓", color = Color(0xFF15803D), fontWeight = FontWeight.Bold, fontSize = 11.sp)
                        }
                        Text(feature, fontSize = 13.5.sp, color = MaterialTheme.colorScheme.onSurface)
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(26.dp))
            
            Button(
                onClick = onClick,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isHighlighted) Color(0xFFFFD700) else MaterialTheme.colorScheme.primary,
                    contentColor = if (isHighlighted) Color.Black else MaterialTheme.colorScheme.onPrimary
                )
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(if (isHighlighted) "تفعيل باقة العائلة الأفضل 👨‍👩‍👧‍👦" else "تفعيل الباقة المميزة ⚡", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                }
            }
        }
    }
}
