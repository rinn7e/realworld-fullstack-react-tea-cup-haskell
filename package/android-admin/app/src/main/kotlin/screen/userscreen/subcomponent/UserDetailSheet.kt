package screen.userscreen.subcomponent

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.unit.dp
import common.api.type.AdminUser
import component.detailrow.DetailRow
import component.detailrow.SectionHeader
import component.detailsheet.DetailSheet
import component.profilethumbnail.ProfileThumbnail
import component.rolebadge.RoleBadge
import screen.userscreen.Msg
import teacup.Dispatcher

@Composable
fun UserDetailSheet(user: AdminUser, dispatch: Dispatcher<Msg>) {
  DetailSheet("User Profile", onDone = { dispatch(Msg.ClearSelected) }) {
    Row(Modifier.padding(16.dp), horizontalArrangement = Arrangement.spacedBy(16.dp), verticalAlignment = Alignment.CenterVertically) {
      ProfileThumbnail(user.image, 72.dp)
      Column {
        Text(user.username, style = MaterialTheme.typography.titleLarge)
        Text(user.email, color = MaterialTheme.colorScheme.onSurfaceVariant)
      }
    }
    DetailRow("User ID", "${user.id}", isMono = true)
    DetailRow("Role") { RoleBadge(user.role) }
    DetailRow("Account Status", "Active", isMono = false)
    SectionHeader("Biography")
    Text(
      "\"${user.bio?.ifEmpty { null } ?: "This user has not written a bio yet."}\"",
      fontStyle = FontStyle.Italic,
      color = MaterialTheme.colorScheme.onSurfaceVariant,
      modifier = Modifier.padding(horizontal = 16.dp),
    )
    // TODO: Member since and Total Articles are currently mock values since the AdminUser API does not return them
    SectionHeader("Account Meta")
    DetailRow("Member since", "Jan 2024", isMono = false)
    DetailRow("Total Articles", "12", isMono = false)
  }
}
