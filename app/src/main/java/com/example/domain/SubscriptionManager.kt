package com.example.domain

import android.util.Log
import com.example.data.backend.BackendService
import com.example.domain.models.ChildProfile
import com.example.domain.models.SubscriptionPlanType
import com.example.domain.models.UserSubscriptionState
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

object SubscriptionManager {
    private const val TAG = "SubscriptionManager"
    private val scope = CoroutineScope(Dispatchers.Main)

    private val _state = MutableStateFlow(
        UserSubscriptionState(
            currentPlanType = SubscriptionPlanType.FREE,
            expirationDate = null,
            isFamilyParent = false
        )
    )
    val state: StateFlow<UserSubscriptionState> = _state.asStateFlow()

    fun upgradeToPlan(planType: SubscriptionPlanType) {
        _state.update { current ->
            current.copy(
                currentPlanType = planType,
                expirationDate = "2027-01-01",
                isFamilyParent = planType == SubscriptionPlanType.FAMILY,
                isRenewing = true,
                isCanceled = false
            )
        }
    }

    // --- Backend Receipt Validation & Integration Services ---

    fun validateAppleReceipt(userId: String, receiptData: String, deviceId: String, onComplete: (Boolean, String) -> Unit) {
        scope.launch {
            val response = BackendService.validateAppleReceipt(userId, receiptData, deviceId)
            if (response.isValid) {
                val plan = try { 
                    SubscriptionPlanType.valueOf(response.planType) 
                } catch (e: Exception) { 
                    SubscriptionPlanType.SINGLE_USER 
                }
                
                // Track device limits before finalizing validation
                val deviceAllowed = BackendService.checkDeviceLimit(userId, deviceId, plan)
                if (deviceAllowed) {
                    _state.update { current ->
                        current.copy(
                            currentPlanType = plan,
                            expirationDate = response.expirationDate ?: "2027-01-01",
                            isFamilyParent = plan == SubscriptionPlanType.FAMILY,
                            isRenewing = response.isRenewing,
                            isCanceled = response.isCanceled
                        )
                    }
                    onComplete(true, "تم تفعيل الاشتراك بنجاح عبر نظام Apple Store")
                } else {
                    onComplete(false, "عذراً، لقد تجاوزت الحد المسموح به للأجهزة لهذا الاشتراك")
                }
            } else {
                onComplete(false, response.message)
            }
        }
    }

    fun validateGooglePlayPurchase(userId: String, purchaseToken: String, productId: String, deviceId: String, onComplete: (Boolean, String) -> Unit) {
        scope.launch {
            val response = BackendService.validateGooglePlayPurchase(userId, purchaseToken, productId, deviceId)
            if (response.isValid) {
                val plan = try { 
                    SubscriptionPlanType.valueOf(response.planType) 
                } catch (e: Exception) { 
                    SubscriptionPlanType.SINGLE_USER 
                }
                
                // Track device limits
                val deviceAllowed = BackendService.checkDeviceLimit(userId, deviceId, plan)
                if (deviceAllowed) {
                    _state.update { current ->
                        current.copy(
                            currentPlanType = plan,
                            expirationDate = response.expirationDate ?: "2026-12-22",
                            isFamilyParent = plan == SubscriptionPlanType.FAMILY,
                            isRenewing = response.isRenewing,
                            isCanceled = response.isCanceled
                        )
                    }
                    onComplete(true, "تم التحقق وتنشيط اشتراكك على Google Play")
                } else {
                    onComplete(false, "خطأ: تجاوز عدد الأجهزة المسموح به (الحد: ${if (plan == SubscriptionPlanType.FAMILY) 6 else 2})")
                }
            } else {
                onComplete(false, response.message)
            }
        }
    }

    fun restorePastPurchases(userId: String, onComplete: (Boolean, String) -> Unit) {
        scope.launch {
            try {
                val restoredState = BackendService.restorePurchase(userId)
                _state.update { current ->
                    current.copy(
                        currentPlanType = restoredState.currentPlanType,
                        expirationDate = restoredState.expirationDate,
                        isFamilyParent = restoredState.isFamilyParent,
                        isRenewing = restoredState.isRenewing,
                        isCanceled = restoredState.isCanceled
                    )
                }
                onComplete(true, "تم استعادة مشترياتك السابقة بنجاح!")
            } catch (e: Exception) {
                Log.e(TAG, "Error restoring purchases", e)
                onComplete(false, "لا توجد اشتراكات سابقة مسجلة لهذا الحساب")
            }
        }
    }

    fun cancelSubscription() {
        _state.update { current ->
            current.copy(
                isCanceled = true,
                isRenewing = false
            )
        }
        Log.d(TAG, "Subscription canceled by user on Google Play / Apple Store. Will expire on: ${_state.value.expirationDate}")
    }

    // --- Profile & Family Limits (Max 4 Children Verification) ---

    fun addChildProfile(name: String, grade: String) {
        scope.launch {
            val allowed = BackendService.checkFamilyProfileLimit("parent_user_id")
            if (allowed) {
                _state.update { current ->
                    if (current.currentPlanType == SubscriptionPlanType.FAMILY && current.childProfiles.size < 4) {
                        val newChild = ChildProfile(
                            id = "child_${System.currentTimeMillis()}",
                            name = name,
                            avatar = "👶",
                            grade = grade
                        )
                        current.copy(childProfiles = current.childProfiles + newChild)
                    } else {
                        current
                    }
                }
            } else {
                Log.w(TAG, "Family profile creation rejected: limit of 4 active children reached.")
            }
        }
    }
}
