package screen.commentscreen.subcomponent

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.selection.SelectionContainer
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import common.api.type.Comment
import common.type.formatDateTime
import component.detailrow.DetailRow
import component.detailrow.SectionHeader
import component.detailsheet.DetailSheet
import component.profilethumbnail.ProfileThumbnail
import screen.commentscreen.Msg
import teacup.Dispatcher

@Composable
fun CommentDetailSheet(comment: Comment, dispatch: Dispatcher<Msg>) {
  DetailSheet("Comment Details", onDone = { dispatch(Msg.ClearSelected) }) {
    SectionHeader("Author")
    Row(Modifier.padding(horizontal = 16.dp, vertical = 8.dp), horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
      ProfileThumbnail(comment.author.image, 44.dp)
      Column {
        Text(comment.author.username, style = MaterialTheme.typography.titleMedium)
        Text(comment.author.bio?.ifEmpty { null } ?: "No bio", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
      }
    }
    SectionHeader("Comment")
    SelectionContainer { Text(comment.body, modifier = Modifier.padding(horizontal = 16.dp)) }
    SectionHeader("Details")
    DetailRow("Comment ID", "${comment.id}", isMono = true)
    DetailRow("Article", comment.articleSlug, isMono = true)
    DetailRow("Created At", formatDateTime(comment.createdAt), isMono = false)
  }
}
