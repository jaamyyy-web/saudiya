package com.example.domain.models

data class Badge(
    val id: String,
    val name: String,
    val icon: String,
    val description: String,
    val unlocked: Boolean = false
)

data class UserGamificationState(
    val xp: Int = 0,
    val coins: Int = 0,
    val level: Int = 1,
    val dailyStreak: Int = 1,
    val comboCount: Int = 0,
    val badges: List<Badge> = emptyList()
)
