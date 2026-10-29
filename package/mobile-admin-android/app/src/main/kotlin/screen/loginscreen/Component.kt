package screen.loginscreen

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Error
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.autofill.ContentType
import androidx.compose.ui.semantics.contentType
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import teacup.Dispatcher

@Composable
fun LoginScreen(model: Model, dispatch: Dispatcher<Msg>) {
  Surface(Modifier.fillMaxSize()) {
    Column(
      Modifier.safeDrawingPadding().imePadding().verticalScroll(rememberScrollState()).padding(24.dp),
      horizontalAlignment = Alignment.CenterHorizontally,
      verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
      Icon(Icons.Filled.Shield, contentDescription = null, Modifier.size(64.dp).padding(top = 24.dp), tint = MaterialTheme.colorScheme.primary)
      Text("Sentinel Admin", style = MaterialTheme.typography.headlineLarge, fontWeight = FontWeight.Bold)
      Text(
        "Sign in to manage the RealWorld platform telemetry.",
        style = MaterialTheme.typography.bodyMedium,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
        textAlign = TextAlign.Center,
      )
      Column(Modifier.widthIn(max = 480.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        OutlinedTextField(
          value = model.email,
          onValueChange = { dispatch(Msg.ChangeEmail(it)) },
          label = { Text("Email Address") },
          singleLine = true,
          keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email, autoCorrectEnabled = false, imeAction = ImeAction.Next),
          modifier = Modifier.fillMaxWidth().semantics { contentType = ContentType.Username },
        )
        OutlinedTextField(
          value = model.password,
          onValueChange = { dispatch(Msg.ChangePassword(it)) },
          label = { Text("Password") },
          singleLine = true,
          visualTransformation = PasswordVisualTransformation(),
          keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password, imeAction = ImeAction.Go),
          keyboardActions = KeyboardActions(onGo = { dispatch(Msg.Submit) }),
          modifier = Modifier.fillMaxWidth().semantics { contentType = ContentType.Password },
        )
        model.error?.let { error ->
          Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
            Icon(Icons.Filled.Error, contentDescription = null, tint = MaterialTheme.colorScheme.error)
            Text(error, color = MaterialTheme.colorScheme.error)
          }
        }
        Button(onClick = { dispatch(Msg.Submit) }, enabled = !model.isSubmitting, modifier = Modifier.fillMaxWidth()) {
          if (model.isSubmitting) CircularProgressIndicator(Modifier.size(20.dp), strokeWidth = 2.dp) else Text("Sign In")
        }
      }
    }
  }
}
