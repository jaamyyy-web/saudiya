package com.example.domain.models

enum class SubscriptionPlanType {
    FREE, SINGLE_USER, FAMILY
}

data class SubscriptionPlan(
    val id: String,
    val name: String,
    val type: SubscriptionPlanType,
    val price: String,
    val period: String,
    val features: List<String>,
    val deviceLimit: Int,
    val maxProfiles: Int
)

data class UserSubscriptionState(
    val currentPlanType: SubscriptionPlanType = SubscriptionPlanType.FREE,
    val expirationDate: String? = null,
    val isFamilyParent: Boolean = false,
    val childProfiles: List<ChildProfile> = emptyList(),
    val isRenewing: Boolean = true,
    val isCanceled: Boolean = false
)

data class ChildProfile(
    val id: String,
    val name: String,
    val avatar: String,
    val grade: String
)
