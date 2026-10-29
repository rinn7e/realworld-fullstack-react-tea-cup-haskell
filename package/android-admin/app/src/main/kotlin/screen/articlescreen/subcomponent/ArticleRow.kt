package screen.articlescreen.subcomponent

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material3.Icon
import androidx.compose.material3.ListItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import common.api.type.Article
import common.type.formatDate

@Composable
fun ArticleRow(article: Article, onClick: () -> Unit) {
  ListItem(
    modifier = Modifier.clickable(onClick = onClick),
    headlineContent = { Text(article.title, maxLines = 2, overflow = TextOverflow.Ellipsis) },
    supportingContent = {
      Column {
        Text(article.slug, fontFamily = FontFamily.Monospace, style = MaterialTheme.typography.bodySmall, maxLines = 1, overflow = TextOverflow.Ellipsis)
        Row(horizontalArrangement = Arrangement.spacedBy(4.dp), verticalAlignment = Alignment.CenterVertically) {
          Icon(Icons.Outlined.Person, contentDescription = null, Modifier.size(14.dp))
          Text(article.author.username, style = MaterialTheme.typography.bodySmall)
          Spacer(Modifier.size(8.dp))
          Icon(Icons.Outlined.FavoriteBorder, contentDescription = null, Modifier.size(14.dp))
          Text("${article.favoritesCount}", style = MaterialTheme.typography.bodySmall)
          Spacer(Modifier.weight(1f))
          Text(formatDate(article.createdAt), style = MaterialTheme.typography.bodySmall)
        }
      }
    },
  )
}
