package screen.settingscreen

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.Logout
import androidx.compose.material.icons.filled.Brightness4
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.DarkMode
import androidx.compose.material.icons.filled.LightMode
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ListItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import common.type.AuthUser
import component.detailrow.SectionHeader
import component.profilethumbnail.ProfileThumbnail
import component.rolebadge.Badge
import teacup.Dispatcher
import theme.Theme
import theme.themes

private val schemeOptions =
  listOf(
    Triple(Theme.ColorScheme.Light, "Light" to "Always use light interface", Icons.Filled.LightMode),
    Triple(Theme.ColorScheme.Dark, "Dark" to "Always use dark interface", Icons.Filled.DarkMode),
    Triple(Theme.ColorScheme.Auto, "Auto" to "Follow your OS setting", Icons.Filled.Brightness4),
  )

/** The settings, opened from the account button of the top bar. Back (or the arrow) is a move to the overview. */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingScreen(user: AuthUser?, colorScheme: Theme.ColorScheme, theme: Theme, dispatch: Dispatcher<Msg>, onBack: () -> Unit) {
  Scaffold(
    topBar = {
      TopAppBar(
        title = { Text("Settings") },
        navigationIcon = { IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back") } },
      )
    },
  ) { padding ->
    Column(Modifier.padding(padding).fillMaxSize().verticalScroll(rememberScrollState())) {
      // Account Profile Section
      if (user != null) {
        SectionHeader("Account")
        Account(user)
      }
      // Appearance Section
      SectionHeader("Appearance")
      for ((value, text, icon) in schemeOptions) {
        ListItem(
          modifier = Modifier.clickable { dispatch(Msg.SetColorScheme(value)) },
          leadingContent = { Icon(icon, contentDescription = null, tint = MaterialTheme.colorScheme.primary) },
          headlineContent = { Text(text.first) },
          supportingContent = { Text(text.second) },
          trailingContent = { RadioButton(selected = colorScheme == value, onClick = { dispatch(Msg.SetColorScheme(value)) }) },
        )
      }
      // Theme Section
      SectionHeader("Color Theme")
      for (option in themes) {
        ListItem(
          modifier = Modifier.clickable { dispatch(Msg.SwitchTheme(option)) },
          leadingContent = {
            Box(Modifier.size(24.dp).background(Color(option.primaryColor), CircleShape).border(3.dp, Color(option.secondaryColor), CircleShape))
          },
          headlineContent = { Text(option.name) },
          trailingContent = { if (theme == option) Icon(Icons.Filled.Check, contentDescription = "Selected", tint = MaterialTheme.colorScheme.primary) },
        )
      }
      ListItem(
        modifier = Modifier.padding(top = 16.dp).clickable { dispatch(Msg.Logout) },
        leadingContent = { Icon(Icons.AutoMirrored.Filled.Logout, contentDescription = null, tint = MaterialTheme.colorScheme.error) },
        headlineContent = { Text("Sign Out", color = MaterialTheme.colorScheme.error) },
      )
    }
  }
}

@Composable
private fun Account(user: AuthUser) {
  Row(Modifier.fillMaxWidth().padding(16.dp), horizontalArrangement = Arrangement.spacedBy(16.dp), verticalAlignment = Alignment.CenterVertically) {
    if (user.image != null) {
      ProfileThumbnail(user.image, 64.dp)
    } else {
      Box(Modifier.size(64.dp).background(MaterialTheme.colorScheme.primary.copy(alpha = 0.15f), CircleShape), contentAlignment = Alignment.Center) {
        Text(user.username.take(2).uppercase(), style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Black, color = MaterialTheme.colorScheme.primary)
      }
    }
    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
      Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
        Text(user.username, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
        Badge("ADMINISTRATOR", MaterialTheme.colorScheme.primary)
      }
      Text(user.email, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
      if (!user.bio.isNullOrEmpty()) {
        Text("\"${user.bio}\"", style = MaterialTheme.typography.bodySmall, fontStyle = FontStyle.Italic, color = MaterialTheme.colorScheme.onSurfaceVariant)
      }
    }
  }
}
