package common.api.type

import kotlinx.serialization.Serializable

@Serializable
data class ApiError(val errors: Map<String, List<String>>)

/**
 * A failed request: the HTTP status (0 when the server was not reached), the
 * error of the API when its body is one, and the raw error
 */
data class HttpError(
  val statusCode: Int,
  val err: ApiError?,
  val actualErr: String,
) {
  companion object {
    /** The error of a request made with no token: the screens cannot load anything signed out */
    val notAuthenticated =
      HttpError(
        statusCode = 401,
        err = ApiError(mapOf("body" to listOf("Not authenticated"))),
        actualErr = "Not authenticated",
      )
  }
}
