package com.example.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext

private val SophisticatedDarkColorScheme = darkColorScheme(
    primary = SophisticatedDarkPrimary,
    onPrimary = SophisticatedDarkOnPrimary,
    primaryContainer = SophisticatedDarkPrimaryContainer,
    onPrimaryContainer = SophisticatedDarkOnPrimaryContainer,
    secondary = SophisticatedDarkPrimary,
    onSecondary = SophisticatedDarkOnPrimary,
    secondaryContainer = SophisticatedDarkSurface,
    onSecondaryContainer = SophisticatedDarkOnSurfaceVariant,
    background = SophisticatedDarkBg,
    onBackground = SophisticatedDarkOnSurface,
    surface = SophisticatedDarkSurface,
    onSurface = SophisticatedDarkOnSurface,
    surfaceVariant = SophisticatedDarkBottomNavBg,
    onSurfaceVariant = SophisticatedDarkOnSurfaceVariant,
    outline = SophisticatedDarkBorder,
    outlineVariant = SophisticatedDarkBorder
)

@Composable
fun MyApplicationTheme(
  darkTheme: Boolean = isSystemInDarkTheme(),
  dynamicColor: Boolean = false, // Enforce the Sophisticated Dark theme identity
  content: @Composable () -> Unit,
) {
  val colorScheme = SophisticatedDarkColorScheme

  MaterialTheme(colorScheme = colorScheme, typography = Typography, content = content)
}
