package screen.articlescreen.subcomponent

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
import common.api.type.Article
import common.type.formatDateTime
import component.detailrow.DetailRow
import component.detailrow.SectionHeader
import component.detailsheet.DetailSheet
import component.profilethumbnail.ProfileThumbnail
import screen.articlescreen.Msg
import teacup.Dispatcher

@Composable
fun ArticleDetailSheet(article: Article, dispatch: Dispatcher<Msg>) {
  DetailSheet("Article Details", onDone = { dispatch(Msg.ClearSelected) }) {
    DetailRow("Title", article.title, isMono = false)
    DetailRow("Slug", article.slug, isMono = true)
    DetailRow("Description", article.description, isMono = false)
    SectionHeader("Author")
    Row(Modifier.padding(horizontal = 16.dp, vertical = 8.dp), horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
      ProfileThumbnail(article.author.image, 44.dp)
      Column {
        Text(article.author.username, style = MaterialTheme.typography.titleMedium)
        Text(article.author.bio?.ifEmpty { null } ?: "No bio", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
      }
    }
    SectionHeader("Body Content")
    SelectionContainer { Text(article.body, style = MaterialTheme.typography.bodyMedium, modifier = Modifier.padding(horizontal = 16.dp)) }
    SectionHeader("Stats")
    DetailRow("Favorites", "${article.favoritesCount}", isMono = false)
    DetailRow("Created", formatDateTime(article.createdAt), isMono = false)
  }
}
