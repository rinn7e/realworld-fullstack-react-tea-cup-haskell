package component.profilethumbnail

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.Dp
import coil3.compose.AsyncImagePainter
import coil3.compose.rememberAsyncImagePainter

/** An avatar: the image at `src`, or a person symbol when there is none or it does not load */
@Composable
fun ProfileThumbnail(src: String?, size: Dp) {
  val painter = rememberAsyncImagePainter(src)
  val state by painter.state.collectAsState()
  if (state is AsyncImagePainter.State.Success) {
    Image(painter, contentDescription = null, contentScale = ContentScale.Crop, modifier = Modifier.size(size).clip(CircleShape))
  } else {
    Icon(Icons.Filled.AccountCircle, contentDescription = null, Modifier.size(size), tint = MaterialTheme.colorScheme.onSurfaceVariant)
  }
}
