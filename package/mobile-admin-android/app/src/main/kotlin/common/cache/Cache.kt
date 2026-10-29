package common.cache

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import kotlinx.coroutines.flow.first

// The token is kept in a DataStore of the app, private to it (the web app
// keeps it in `localStorage`). Called from commands only.

/** The store of the app, set once at startup by the activity (its file is in the files of the app) */
object Store {
  lateinit var dataStore: DataStore<Preferences>
    private set

  // One store per file in a process: an activity made again keeps the first
  fun ensure(create: () -> DataStore<Preferences>) {
    if (!::dataStore.isInitialized) dataStore = create()
  }
}

private val TOKEN_KEY = stringPreferencesKey("jwtToken")

suspend fun saveToken(token: String) {
  Store.dataStore.edit { it[TOKEN_KEY] = token }
}

suspend fun getToken(): String? = Store.dataStore.data.first()[TOKEN_KEY]

suspend fun removeToken() {
  Store.dataStore.edit { it.remove(TOKEN_KEY) }
}
