package common.api.type

import kotlinx.serialization.Serializable

enum class UserSortAttr(val value: String) {
  Id("id"),
  Username("username"),
  Email("email"),
}

@Serializable
data class AdminUser(
  val id: Int,
  val username: String,
  val email: String,
  val bio: String? = null,
  val image: String? = null,
  val role: String,
)

@Serializable
data class AdminUserListResponse(
  val users: List<AdminUser>,
  val totalCount: Int,
)

@Serializable
data class LoginRequest(val user: User) {
  @Serializable
  data class User(val email: String, val password: String)
}

@Serializable
data class UserResponse(val user: User) {
  @Serializable
  data class User(
    val email: String,
    val token: String,
    val username: String,
    val bio: String? = null,
    val image: String? = null,
  )
}
