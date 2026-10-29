package theme

import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import common.cache.Store
import kotlinx.coroutines.flow.first

// The choices are kept in the store of the app (the web app keeps them in
// `localStorage`). The loads run at boot, the saves in commands.

private val COLOR_SCHEME_KEY = stringPreferencesKey("admin-color-scheme")
private val THEME_KEY = stringPreferencesKey("admin-theme")

suspend fun loadColorScheme(): Theme.ColorScheme {
  val value = Store.dataStore.data.first()[COLOR_SCHEME_KEY]
  return Theme.ColorScheme.entries.firstOrNull { it.value == value } ?: Theme.ColorScheme.Auto
}

suspend fun saveColorScheme(scheme: Theme.ColorScheme) {
  Store.dataStore.edit { it[COLOR_SCHEME_KEY] = scheme.value }
}

suspend fun loadThemeId(): String? = Store.dataStore.data.first()[THEME_KEY]

suspend fun saveTheme(theme: Theme) {
  Store.dataStore.edit { it[THEME_KEY] = theme.id }
}

fun themeOfId(id: String?): Theme = themes.firstOrNull { it.id == id } ?: defaultTheme
