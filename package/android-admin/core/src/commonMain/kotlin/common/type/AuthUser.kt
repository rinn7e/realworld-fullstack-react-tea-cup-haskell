package common.type

data class AuthUser(
  val username: String,
  val email: String,
  val token: String,
  val bio: String?,
  val image: String?,
)
