package common.api.type

import kotlinx.serialization.Serializable

@Serializable
data class Profile(
  val username: String,
  val bio: String? = null,
  val image: String? = null,
  val following: Boolean,
)
