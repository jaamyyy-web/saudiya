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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
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
        name = "الباقة الفردية",
        type = SubscriptionPlanType.SINGLE_USER,
        price = "39 ريال",
        period = "/ شهرياً",
        features = listOf(
            "ملف شخصي واحد",
            "فتح جميع الحزم التعليمية",
            "اختبارات غير محدودة",
            "تحليلات ذكية وتوصيات",
            "نمط الاختبارات Exam Mode",
            "استخدام حتى جهازين"
        ),
        deviceLimit = 2,
        maxProfiles = 1
    )

    val familyPlan = SubscriptionPlan(
        id = "plan_family",
        name = "الباقة العائلية",
        type = SubscriptionPlanType.FAMILY,
        price = "99 ريال",
        period = "/ شهرياً",
        features = listOf(
            "حتى 4 ملفات للطلاب",
            "لوحة ولي الأمر",
            "تقارير منفصلة لكل طفل",
            "كل ميزات الباقة الفردية",
            "استخدام حتى 6 أجهزة",
            "فاتورة واحدة للعائلة"
        ),
        deviceLimit = 6,
        maxProfiles = 4
    )

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        topBar = {
            TopAppBar(
                title = { Text("الاشتراكات", fontWeight = FontWeight.ExtraBold) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(imageVector = Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "رجوع")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background)
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
                    .widthIn(max = 600.dp)
                    .verticalScroll(rememberScrollState())
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                SubscriptionHeroCard()

                PremiumUnlockStrip()

                PlanCard(plan = singlePlan, onClick = {
                    SubscriptionManager.validateGooglePlayPurchase(
                        userId = "user_dummy_789",
                        purchaseToken = "token_google_play_verify_xyz",
                        productId = "product_single_user",
                        deviceId = "android_device_id_current"
                    ) { success, message ->
                        if (success) navController.navigate("payment_success/${singlePlan.type.name}")
                        else coroutineScope.launch { snackbarHostState.showSnackbar(message) }
                    }
                })

                PlanCard(plan = familyPlan, onClick = {
                    SubscriptionManager.validateAppleReceipt(
                        userId = "user_dummy_789",
                        receiptData = "receipt_data_apple_verify_abc",
                        deviceId = "android_device_id_current"
                    ) { success, message ->
                        if (success) navController.navigate("payment_success/${familyPlan.type.name}")
                        else coroutineScope.launch { snackbarHostState.showSnackbar(message) }
                    }
                }, isHighlighted = true)

                SecurePaymentCard()

                TextButton(onClick = {
                    SubscriptionManager.restorePastPurchases("user_dummy_789") { _, message ->
                        coroutineScope.launch { snackbarHostState.showSnackbar(message) }
                    }
                }) {
                    Text("استعادة المشتريات السابقة", fontSize = 15.sp, fontWeight = FontWeight.ExtraBold)
                }

                Text(
                    text = "يمكن إدارة الاشتراك أو إلغاؤه من إعدادات متجر Google Play أو App Store.",
                    fontSize = 10.5.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.68f),
                    textAlign = TextAlign.Center,
                    lineHeight = 16.sp
                )

                Spacer(modifier = Modifier.height(16.dp))
            }
        }
    }
}

@Composable
private fun SubscriptionHeroCard() {
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
                .size(120.dp)
                .align(Alignment.BottomStart)
                .offset(x = (-36).dp, y = 32.dp)
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
                        text = "Premium Learning",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Text(
                        text = "افتح كل الحزم التعليمية",
                        fontSize = 25.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = MaterialTheme.colorScheme.onPrimaryContainer,
                        lineHeight = 32.sp
                    )
                    Text(
                        text = "وصول كامل للملخصات، الاختبارات، التحليلات، وخطة التعلّم الذكية.",
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
                    Text("👑", fontSize = 36.sp)
                }
            }

            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), verticalAlignment = Alignment.CenterVertically) {
                SubscriptionHeroChip("كل الحزم", "مفتوحة")
                SubscriptionHeroChip("AI", "توصيات")
                SubscriptionHeroChip("Family", "عائلة")
            }
        }
    }
}

@Composable
private fun SubscriptionHeroChip(value: String, label: String) {
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
private fun PremiumUnlockStrip() {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(22.dp),
        color = Color(0xFFFFF7ED),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFFED7AA))
    ) {
        Row(
            modifier = Modifier.padding(15.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(Color(0xFFFFEDD5)),
                contentAlignment = Alignment.Center
            ) {
                Text("🔓", fontSize = 25.sp)
            }
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text("النسخة المجانية محدودة", fontSize = 15.sp, fontWeight = FontWeight.ExtraBold, color = Color(0xFF9A3412))
                Text(
                    text = "أول حزمة في كل مادة مجانية. باقي الحزم تحتاج Premium.",
                    fontSize = 12.5.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFF9A3412),
                    lineHeight = 18.sp
                )
            }
        }
    }
}

@Composable
fun PlanCard(plan: SubscriptionPlan, onClick: () -> Unit, isHighlighted: Boolean = false) {
    val borderColor = if (isHighlighted) Color(0xFFFFD700) else MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.65f)
    val containerColor = if (isHighlighted) Color(0xFFFFFDF0) else MaterialTheme.colorScheme.surface
    val actionColor = if (isHighlighted) Color(0xFFFFD700) else MaterialTheme.colorScheme.primary

    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(28.dp),
        color = containerColor,
        tonalElevation = if (isHighlighted) 4.dp else 2.dp,
        shadowElevation = if (isHighlighted) 4.dp else 2.dp,
        border = androidx.compose.foundation.BorderStroke(if (isHighlighted) 2.dp else 1.dp, borderColor)
    ) {
        Column(modifier = Modifier.padding(22.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
            if (isHighlighted) {
                Surface(shape = RoundedCornerShape(10.dp), color = Color(0xFFFFD700)) {
                    Text(
                        text = "الأكثر توفيراً للعائلة 🔥",
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = Color.Black
                    )
                }
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(5.dp)) {
                    Text(
                        text = plan.name,
                        fontSize = 22.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = if (isHighlighted) Color(0xFFD97706) else MaterialTheme.colorScheme.primary
                    )
                    Text(
                        text = if (isHighlighted) "للأهل والأبناء" else "لطالب واحد",
                        fontSize = 12.5.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                Box(
                    modifier = Modifier
                        .size(54.dp)
                        .clip(RoundedCornerShape(18.dp))
                        .background(actionColor.copy(alpha = if (isHighlighted) 0.35f else 0.13f)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(if (isHighlighted) "👨‍👩‍👧‍👦" else "⚡", fontSize = 25.sp)
                }
            }

            Row(verticalAlignment = Alignment.Bottom) {
                Text(plan.price, fontSize = 34.sp, fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.onSurface)
                Spacer(modifier = Modifier.width(4.dp))
                Text(plan.period, fontSize = 14.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.padding(bottom = 7.dp))
            }

            HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.50f))

            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                plan.features.forEach { feature ->
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        Box(
                            modifier = Modifier
                                .size(22.dp)
                                .clip(CircleShape)
                                .background(Color(0xFFDCFCE7)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("✓", color = Color(0xFF15803D), fontWeight = FontWeight.ExtraBold, fontSize = 12.sp)
                        }
                        Text(
                            text = feature,
                            fontSize = 13.5.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = MaterialTheme.colorScheme.onSurface,
                            lineHeight = 19.sp
                        )
                    }
                }
            }

            Button(
                onClick = onClick,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(54.dp),
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = actionColor,
                    contentColor = if (isHighlighted) Color.Black else MaterialTheme.colorScheme.onPrimary
                )
            ) {
                Text(
                    text = if (isHighlighted) "تفعيل باقة العائلة" else "تفعيل الباقة الفردية",
                    fontWeight = FontWeight.ExtraBold,
                    fontSize = 14.sp
                )
            }
        }
    }
}

@Composable
private fun SecurePaymentCard() {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(22.dp),
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 2.dp,
        border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.55f))
    ) {
        Column(
            modifier = Modifier.padding(15.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(7.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("🛡️", fontSize = 17.sp)
                Text(
                    text = "دفع آمن عبر المتاجر الرسمية",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = MaterialTheme.colorScheme.onSurface
                )
            }
            Text(
                text = "Apple Pay • Google Play • Visa • Mastercard",
                fontSize = 11.5.sp,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.primary,
                textAlign = TextAlign.Center
            )
            Text(
                text = "يمكن إلغاء الاشتراك في أي وقت من إعدادات المتجر.",
                fontSize = 10.5.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center,
                lineHeight = 15.sp
            )
        }
    }
}
