package screen.commentscreen.subcomponent

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.material3.ListItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import common.api.type.Comment
import common.type.formatDate
import component.profilethumbnail.ProfileThumbnail

@Composable
fun CommentRow(comment: Comment, onClick: () -> Unit) {
  ListItem(
    modifier = Modifier.clickable(onClick = onClick),
    leadingContent = { ProfileThumbnail(comment.author.image, 32.dp) },
    overlineContent = { Text("${comment.author.username} · ${formatDate(comment.createdAt)}") },
    headlineContent = { Text(comment.body, maxLines = 3, overflow = TextOverflow.Ellipsis) },
    supportingContent = {
      Column {
        Text(comment.articleSlug, fontFamily = FontFamily.Monospace, style = MaterialTheme.typography.bodySmall, maxLines = 1, overflow = TextOverflow.Ellipsis)
      }
    },
  )
}
