package com.example.domain

import com.example.domain.models.Badge
import com.example.domain.models.UserGamificationState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

object GamificationManager {
    private val allBadges = listOf(
        Badge("1", "نجم الرياضيات", "⭐", "أكمل الحزمة الأولى بنجاح"),
        Badge("2", "عبقري العلوم", "🧬", "أجب على 10 أسئلة بشكل صحيح"),
        Badge("3", "متفوق الأسبوع", "🏆", "حافظ على سلسلة 7 أيام"),
        Badge("4", "ملك الاختبارات", "👑", "احصل على نسبة 100% في اختبار")
    )

    private val _state = MutableStateFlow(
        UserGamificationState(
            badges = allBadges
        )
    )
    val state: StateFlow<UserGamificationState> = _state.asStateFlow()

    fun addXP(amount: Int) {
        _state.update { current ->
            val newXp = current.xp + amount
            val newLevel = calculateLevel(newXp)
            current.copy(xp = newXp, level = newLevel)
        }
    }

    fun addCoins(amount: Int) {
        _state.update { current ->
            current.copy(coins = current.coins + amount)
        }
    }

    fun incrementCombo(): Boolean {
        var comboReached = false
        _state.update { current ->
            val newCombo = current.comboCount + 1
            if (newCombo % 5 == 0) {
                comboReached = true
            }
            current.copy(comboCount = newCombo)
        }
        if (comboReached) {
            addXP(10)
        }
        return comboReached
    }

    fun resetCombo() {
        _state.update { it.copy(comboCount = 0) }
    }

    fun unlockBadge(badgeId: String): Boolean {
        var unlockedNow = false
        _state.update { current ->
            val updatedBadges = current.badges.map { badge ->
                if (badge.id == badgeId && !badge.unlocked) {
                    unlockedNow = true
                    badge.copy(unlocked = true)
                } else badge
            }
            current.copy(badges = updatedBadges)
        }
        return unlockedNow
    }

    private fun calculateLevel(xp: Int): Int {
        return (xp / 100) + 1
    }
}
