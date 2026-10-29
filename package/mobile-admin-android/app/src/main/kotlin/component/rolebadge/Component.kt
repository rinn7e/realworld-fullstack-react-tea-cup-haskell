package component.rolebadge

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

/** The role of a user as a colored capsule (admins in purple, others in green) */
@Composable
fun RoleBadge(role: String) {
  val isAdmin = role == "AdminRole" || role == "admin"
  Badge(role, if (isAdmin) Color(0xFF9333EA) else Color(0xFF16A34A))
}

/** A short text in a colored capsule */
@Composable
fun Badge(text: String, color: Color) {
  Text(
    text,
    style = MaterialTheme.typography.labelSmall,
    fontWeight = FontWeight.SemiBold,
    color = color,
    maxLines = 1,
    modifier = Modifier.background(color.copy(alpha = 0.15f), CircleShape).padding(horizontal = 8.dp, vertical = 2.dp),
  )
}
