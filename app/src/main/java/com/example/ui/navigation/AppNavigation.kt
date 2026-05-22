package com.example.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.LayoutDirection
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.example.ui.screens.admin.AdminDashboardScreen
import com.example.ui.screens.admin.AdminLoginScreen
import com.example.ui.screens.student.LoginScreen
import com.example.ui.screens.student.ProfileSetupScreen
import com.example.ui.screens.student.SplashScreen
import com.example.ui.screens.student.StudentMainScreen
import com.example.ui.screens.student.SubjectDetailScreen
import com.example.ui.screens.student.LearningPackDetailScreen
import com.example.ui.screens.student.SummaryScreen
import com.example.ui.screens.student.quiz.QuizScreen
import com.example.ui.screens.student.quiz.QuizResultScreen

@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route ?: "splash"

    NavHost(navController = navController, startDestination = "splash") {
        
        // --- Student Screens (RTL) ---
        composable("splash") {
            CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                SplashScreen(
                    onNavigateToStudentLogin = { navController.navigate("login") { popUpTo("splash") { inclusive = true } } },
                    onNavigateToAdminLogin = { navController.navigate("admin_login") { popUpTo("splash") { inclusive = true } } }
                )
            }
        }
        
        composable("login") {
            CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                LoginScreen(
                    onNavigateToProfileSetup = { navController.navigate("profile_setup") { popUpTo("login") { inclusive = true } } },
                    onNavigateToHome = { navController.navigate("student_main") { popUpTo("login") { inclusive = true } } },
                    onNavigateToAdmin = { navController.navigate("admin_login") }
                )
            }
        }
        
        composable("profile_setup") {
            CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                ProfileSetupScreen(
                    onNavigateToHome = { navController.navigate("student_main") { popUpTo("profile_setup") { inclusive = true } } }
                )
            }
        }
        
        // We use nested navigation for bottom bar if needed, 
        // or a single screen that hosts the bottom bar and its own state/nav
        composable("student_main") {
            CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                StudentMainScreen(navController)
            }
        }

        composable("subject_detail/{subjectId}") { backStackEntry ->
            val subjectId = backStackEntry.arguments?.getString("subjectId") ?: ""
            CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                SubjectDetailScreen(subjectId = subjectId, navController = navController)
            }
        }
        
        composable("learning_pack_detail/{packId}") { backStackEntry ->
            val packId = backStackEntry.arguments?.getString("packId") ?: ""
            CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                LearningPackDetailScreen(packId = packId, navController = navController)
            }
        }
        
        composable("summary_screen/{packId}") { backStackEntry ->
            val packId = backStackEntry.arguments?.getString("packId") ?: ""
            CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                SummaryScreen(packId = packId, navController = navController)
            }
        }

        composable("quiz_screen/{packId}/{filterType}") { backStackEntry ->
            val packId = backStackEntry.arguments?.getString("packId") ?: ""
            val filterType = backStackEntry.arguments?.getString("filterType") ?: "all"
            CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                QuizScreen(packId = packId, filterType = filterType, navController = navController)
            }
        }

        composable("quiz_result/{correctCount}/{totalCount}/{xpEarned}") { backStackEntry ->
            val correctCount = backStackEntry.arguments?.getString("correctCount")?.toIntOrNull() ?: 0
            val totalCount = backStackEntry.arguments?.getString("totalCount")?.toIntOrNull() ?: 0
            val xpEarned = backStackEntry.arguments?.getString("xpEarned")?.toIntOrNull() ?: 0
            val accuracy = if (totalCount > 0) ((correctCount.toFloat() / totalCount) * 100).toInt() else 0
            val badgeUnlocked = if (accuracy == 100) "ملك الاختبارات" else null // Simple logic for demo
            
            CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                com.example.ui.screens.student.quiz.LearningPackCompletionScreen(
                    xpEarned = xpEarned, 
                    accuracy = accuracy,
                    badgeUnlocked = badgeUnlocked,
                    navController = navController
                )
            }
        }

        composable("rewards") {
            CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                com.example.ui.screens.student.rewards.RewardsScreen(navController = navController)
            }
        }

        composable("notifications") {
            CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                com.example.ui.screens.student.NotificationsScreen(navController = navController)
            }
        }

        composable("analytics") {
            CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                com.example.ui.screens.student.analytics.AnalyticsScreen(navController = navController)
            }
        }

        composable("subscription_plans") {
            CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                com.example.ui.screens.student.subscription.SubscriptionPlansScreen(navController = navController)
            }
        }

        composable("payment_success/{planType}") { backStackEntry ->
            val planType = backStackEntry.arguments?.getString("planType") ?: "FREE"
            CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                com.example.ui.screens.student.subscription.PaymentSuccessScreen(planTypeString = planType, navController = navController)
            }
        }

        composable("payment_failed") {
            CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                com.example.ui.screens.student.subscription.PaymentFailedScreen(navController = navController)
            }
        }

        composable("manage_subscription") {
            CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                com.example.ui.screens.student.subscription.ManageSubscriptionScreen(navController = navController)
            }
        }

        composable("parent_dashboard") {
            CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                com.example.ui.screens.student.subscription.ParentDashboardScreen(navController = navController)
            }
        }

        // --- Admin Screens (LTR) ---
        composable("admin_login") {
            CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr) {
                AdminLoginScreen(
                    onNavigateToDashboard = { navController.navigate("admin_dashboard") { popUpTo("admin_login") { inclusive = true } } }
                )
            }
        }
        
        composable("admin_dashboard") {
            CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr) {
                AdminDashboardScreen(
                    onLogout = { navController.navigate("splash") { popUpTo(navController.graph.startDestinationId) { inclusive = true } } }
                )
            }
        }
    }
}
