package common.type.destination

import common.env.URL_SCHEME

// The only code that knows how a destination is spelled in a URL. The deep link
// `sentinel://users` is the `/users` of the web app: its host is the first
// piece of the path.

private fun pathPieces(url: String): List<String> =
  url
    .substringAfter("://", url)
    .substringBefore('?')
    .substringBefore('#')
    .split('/')
    .filter { it.isNotEmpty() }

fun parseDestination(url: String): Destination {
  val screen =
    when (pathPieces(url)) {
      emptyList<String>() -> Screen.HomeScreen
      listOf("login") -> Screen.LoginScreen
      listOf("articles") -> Screen.ArticleScreen
      listOf("users") -> Screen.UserScreen
      listOf("comments") -> Screen.CommentScreen
      listOf("visitors") -> Screen.VisitorScreen
      listOf("settings") -> Screen.SettingScreen
      else -> Screen.NotFoundScreen
    }
  return destinationOfScreen(screen)
}

fun toUrlString(destination: Destination): String {
  val path =
    when (destination.screen) {
      Screen.HomeScreen -> ""
      Screen.LoginScreen -> "login"
      Screen.ArticleScreen -> "articles"
      Screen.UserScreen -> "users"
      Screen.CommentScreen -> "comments"
      Screen.VisitorScreen -> "visitors"
      Screen.SettingScreen -> "settings"
      Screen.NotFoundScreen -> "404"
    }
  return "$URL_SCHEME://$path"
}
