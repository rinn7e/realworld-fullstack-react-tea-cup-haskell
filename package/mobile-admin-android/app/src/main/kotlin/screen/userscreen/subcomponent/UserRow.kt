package screen.userscreen.subcomponent

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.material3.ListItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import common.api.type.AdminUser
import component.profilethumbnail.ProfileThumbnail
import component.rolebadge.RoleBadge
import androidx.compose.foundation.clickable

/** A user in the list (a row of the web table) */
@Composable
fun UserRow(user: AdminUser, onClick: () -> Unit) {
  ListItem(
    modifier = Modifier.clickable(onClick = onClick),
    leadingContent = { ProfileThumbnail(user.image, 40.dp) },
    headlineContent = {
      Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
        Text(user.username, maxLines = 1, overflow = TextOverflow.Ellipsis, modifier = Modifier.weight(1f, fill = false))
        RoleBadge(user.role)
      }
    },
    supportingContent = {
      Text(
        listOfNotNull(user.email, user.bio?.ifEmpty { null }).joinToString("\n"),
        maxLines = 2,
        overflow = TextOverflow.Ellipsis,
      )
    },
    trailingContent = {
      Text("#${user.id}", style = MaterialTheme.typography.labelSmall, fontFamily = FontFamily.Monospace)
    },
  )
}
