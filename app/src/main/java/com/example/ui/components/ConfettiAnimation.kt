package com.example.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import kotlinx.coroutines.isActive
import kotlin.random.Random

class Particle(
    var x: Float,
    var y: Float,
    var vx: Float,
    var vy: Float,
    val color: Color,
    val size: Float
) {
    fun update() {
        x += vx
        y += vy
        vy += 0.5f // gravity
    }
}

@Composable
fun ConfettiAnimation() {
    val particles = remember { mutableStateListOf<Particle>() }
    val colors = listOf(Color.Red, Color.Green, Color.Blue, Color.Yellow, Color.Magenta, Color.Cyan)
    
    var time by remember { mutableStateOf(0f) }
    
    LaunchedEffect(Unit) {
        for (i in 0..100) {
            particles.add(
                Particle(
                    x = 500f, // Center-ish starting point (will be distributed in Canvas)
                    y = 500f,
                    vx = Random.nextFloat() * 20 - 10,
                    vy = Random.nextFloat() * -20 - 10,
                    color = colors.random(),
                    size = Random.nextFloat() * 15 + 10
                )
            )
        }
        
        while (isActive) {
            withFrameNanos {
                particles.forEach { it.update() }
                time = it.toFloat() // Trigger recomposition
            }
        }
    }
    
    Canvas(modifier = Modifier.fillMaxSize()) {
        // Read time to ensure recomposition
        val currentTime = time 
        val centerX = size.width / 2
        val centerY = size.height / 2
        
        // Offset starting position
        if (particles.isNotEmpty() && particles[0].x == 500f) {
             particles.forEach { 
                 it.x = centerX
                 it.y = centerY
             }
        }

        particles.forEach { particle ->
            drawCircle(
                color = particle.color,
                radius = particle.size,
                center = Offset(particle.x, particle.y)
            )
        }
    }
}
