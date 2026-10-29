package screen.homescreen

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyListScope
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bolt
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.Forum
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.Public
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ListItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SegmentedButton
import androidx.compose.material3.SegmentedButtonDefaults
import androidx.compose.material3.SingleChoiceSegmentedButtonRow
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import common.api.type.Log
import common.type.Shared
import common.type.formatTime
import component.detailrow.SectionHeader
import screen.homescreen.subcomponent.LevelBadge
import screen.homescreen.subcomponent.LogDetailSheet
import screen.homescreen.subcomponent.StatCard
import screen.homescreen.subcomponent.VisitorChart
import teacup.Dispatcher
import teacup.RemoteData

private val filters = listOf(TimeFilter.Day to "24h", TimeFilter.Week to "Week", TimeFilter.Month to "Month", TimeFilter.Year to "Year")

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(model: Model, shared: Shared, dispatch: Dispatcher<Msg>, accountButton: @Composable () -> Unit) {
  Scaffold(
    topBar = {
      TopAppBar(
        title = { Text("Overview") },
        actions = {
          IconButton(onClick = { dispatch(Msg.Refresh) }) { Icon(Icons.Filled.Refresh, contentDescription = "Refresh") }
          accountButton()
        },
      )
    },
  ) { padding ->
    // Refreshing while any of the three loads is pending
    val isRefreshing = model.stats is RemoteData.Pending || model.visitorStats is RemoteData.Pending || model.logs is RemoteData.Pending
    PullToRefreshBox(isRefreshing = isRefreshing, onRefresh = { dispatch(Msg.Refresh) }, modifier = Modifier.padding(padding).fillMaxSize()) {
      LazyColumn(Modifier.fillMaxSize()) {
        item { Stats(model) }
        item {
          SectionHeader("Visitor Activity")
          SingleChoiceSegmentedButtonRow(Modifier.fillMaxWidth().padding(horizontal = 16.dp)) {
            filters.forEachIndexed { index, (filter, label) ->
              SegmentedButton(
                selected = model.currentFilter == filter,
                onClick = { dispatch(Msg.ChangeFilter(filter)) },
                shape = SegmentedButtonDefaults.itemShape(index, filters.size),
              ) { Text(label) }
            }
          }
          VisitorActivity(model)
        }
        item { SectionHeader("System Logs") }
        logs(model, dispatch)
      }
    }
  }
  model.selectedLog?.let { log -> LogDetailSheet(log, dispatch) }
}

@Composable
private fun Stats(model: Model) {
  when (val stats = model.stats) {
    RemoteData.Initial, RemoteData.Pending -> Loading()
    is RemoteData.Failure -> ErrorText("Error loading stats: ${stats.error.actualErr}")
    is RemoteData.Success -> {
      val s = stats.value
      val cards =
        listOf(
          Triple("Total Users", "${s.totalUsers}", Icons.Filled.Group to Color(0xFF6366F1)),
          Triple("Total Articles", "${s.totalArticles}", Icons.Filled.Description to Color(0xFF2563EB)),
          Triple("Total Comments", "${s.totalComments}", Icons.Filled.Forum to Color(0xFF9333EA)),
          Triple("Total Visitors", "${s.totalVisitors}", Icons.Filled.Public to Color(0xFFEA580C)),
          Triple("Active Users (24h)", "${s.activeUsers24h}", Icons.Filled.Bolt to Color(0xFF16A34A)),
        )
      Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        for (pair in cards.chunked(2)) {
          Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            for ((label, value, look) in pair) StatCard(label, value, look.first, look.second, Modifier.weight(1f))
            if (pair.size == 1) Spacer(Modifier.weight(1f))
          }
        }
      }
    }
  }
}

@Composable
private fun VisitorActivity(model: Model) {
  Column(Modifier.padding(16.dp)) {
    when (val visitorStats = model.visitorStats) {
      RemoteData.Initial, RemoteData.Pending -> Loading()
      is RemoteData.Failure -> ErrorText("Error loading visitor activity: ${visitorStats.error.actualErr}")
      is RemoteData.Success ->
        if (visitorStats.value.isEmpty()) {
          Text("No visitors in this period.", color = MaterialTheme.colorScheme.onSurfaceVariant)
        } else {
          VisitorChart(visitorStats.value)
        }
    }
  }
}

private fun LazyListScope.logs(model: Model, dispatch: Dispatcher<Msg>) {
  when (val logs = model.logs) {
    RemoteData.Initial, RemoteData.Pending -> item { Loading() }
    is RemoteData.Failure -> item { ErrorText("Error loading logs: ${logs.error.actualErr}") }
    is RemoteData.Success ->
      if (logs.value.isEmpty()) {
        item { Text("No recent activity logs.", color = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.padding(16.dp)) }
      } else {
        items(logs.value, key = { it.id }) { log ->
          LogRow(log, onClick = { dispatch(Msg.SelectLog(log)) })
          HorizontalDivider()
        }
      }
  }
}

@Composable
private fun LogRow(log: Log, onClick: () -> Unit) {
  ListItem(
    modifier = Modifier.clickable(onClick = onClick),
    overlineContent = {
      Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
        LevelBadge(log.level)
        Text(log.source, fontFamily = FontFamily.Monospace, modifier = Modifier.weight(1f))
        Text(formatTime(log.timestamp))
      }
    },
    headlineContent = {
      Text(log.message, style = MaterialTheme.typography.bodyMedium, fontFamily = FontFamily.Monospace, maxLines = 2, overflow = TextOverflow.Ellipsis)
    },
  )
}

@Composable
private fun Loading() {
  Column(Modifier.fillMaxWidth().padding(24.dp), horizontalAlignment = Alignment.CenterHorizontally) { CircularProgressIndicator() }
}

@Composable
private fun ErrorText(text: String) {
  Text(text, color = MaterialTheme.colorScheme.error, modifier = Modifier.padding(16.dp))
}
