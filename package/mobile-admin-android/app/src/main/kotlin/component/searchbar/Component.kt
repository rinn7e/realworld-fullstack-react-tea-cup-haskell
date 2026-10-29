package component.searchbar

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Sort
import androidx.compose.material.icons.filled.ArrowDownward
import androidx.compose.material.icons.filled.ArrowUpward
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import common.type.Direction
import teacup.Dispatcher

// The search bar as two native parts: a search field above the list and a sort
// menu in the top bar.

/**
 * The search field. The search key of the keyboard sends `Submit`, as the Enter
 * of the web field does. Clearing it also submits, so the list comes back
 * without the search, as users expect.
 */
@Composable
fun <Sort> SearchField(model: Model<Sort>, placeholder: String, dispatch: Dispatcher<Msg<Sort>>) {
  val focusManager = LocalFocusManager.current
  OutlinedTextField(
    value = model.searchText,
    onValueChange = { dispatch(Msg.ChangeSearchText(it)) },
    placeholder = { Text(placeholder) },
    leadingIcon = { Icon(Icons.Filled.Search, contentDescription = null) },
    trailingIcon = {
      if (model.searchText.isNotEmpty()) {
        IconButton(onClick = {
          dispatch(Msg.ChangeSearchText(""))
          dispatch(Msg.Submit)
        }) { Icon(Icons.Filled.Clear, contentDescription = "Clear search") }
      }
    },
    singleLine = true,
    keyboardOptions =
      KeyboardOptions(
        capitalization = KeyboardCapitalization.None,
        autoCorrectEnabled = false,
        keyboardType = KeyboardType.Text,
        imeAction = ImeAction.Search,
      ),
    keyboardActions =
      KeyboardActions(onSearch = {
        focusManager.clearFocus()
        dispatch(Msg.Submit)
      }),
    modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 8.dp),
  )
}

/** The sort menu: the field to sort by, then the order */
@Composable
fun <Sort> SortMenu(model: Model<Sort>, sortOptions: List<Option<Sort>>, dispatch: Dispatcher<Msg<Sort>>) {
  // Whether the menu is open is the state of the menu, not of the app
  var isOpen by remember { mutableStateOf(false) }
  Box {
    IconButton(onClick = { isOpen = true }) { Icon(Icons.AutoMirrored.Filled.Sort, contentDescription = "Sort") }
    DropdownMenu(expanded = isOpen, onDismissRequest = { isOpen = false }) {
      for (option in sortOptions) {
        DropdownMenuItem(
          text = { Text(option.label) },
          onClick = {
            isOpen = false
            dispatch(Msg.ChangeSort(option.value))
          },
          trailingIcon = { if (option.value == model.sort) Icon(Icons.Filled.Check, contentDescription = null) },
        )
      }
      HorizontalDivider()
      for ((direction, label) in listOf(Direction.Asc to "Ascending", Direction.Desc to "Descending")) {
        DropdownMenuItem(
          text = { Text(label) },
          leadingIcon = {
            Icon(if (direction == Direction.Asc) Icons.Filled.ArrowUpward else Icons.Filled.ArrowDownward, contentDescription = null)
          },
          onClick = {
            isOpen = false
            dispatch(Msg.ChangeDirection(direction))
          },
          trailingIcon = { if (direction == model.direction) Icon(Icons.Filled.Check, contentDescription = null) },
        )
      }
    }
  }
}
