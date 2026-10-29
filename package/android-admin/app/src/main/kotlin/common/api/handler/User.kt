package common.api.handler

import common.api.type.AdminUser
import common.api.type.AdminUserListResponse
import common.api.type.HttpError
import common.api.type.LoginRequest
import common.api.type.UserResponse
import io.ktor.http.HttpMethod
import kotlinx.serialization.Serializable
import teacup.Either

suspend fun login(request: LoginRequest): Either<HttpError, UserResponse> =
  runApi(fetchApi("/admin/login", method = HttpMethod.Post, body = json.encodeToString(request)), decodeSuccess())

suspend fun getCurrentUser(token: String): Either<HttpError, UserResponse> =
  runApi(fetchApi("/admin/user", token = token), decodeSuccess())

suspend fun getAdminUsers(
  token: String,
  limit: Int? = null,
  offset: Int? = null,
  username: String? = null,
  email: String? = null,
  sort: String? = null,
  direction: String? = null,
): Either<HttpError, AdminUserListResponse> =
  runApi(
    fetchApi(
      "/admin/users",
      token = token,
      query =
        listOf(
          "limit" to limit?.toString(), "offset" to offset?.toString(),
          "username" to username, "email" to email, "sort" to sort, "direction" to direction,
        ),
    ),
    decodeSuccess(),
  )

suspend fun deleteUser(token: String, id: Int): Either<HttpError, Boolean> =
  runApi(fetchApi("/admin/users/$id", method = HttpMethod.Delete, token = token), ensureIsOk(true))

@Serializable
private data class UpdateUserRoleRequest(val role: String)

suspend fun updateUserRole(token: String, id: Int, role: String): Either<HttpError, AdminUser> =
  runApi(
    fetchApi("/admin/users/$id/role", method = HttpMethod.Put, token = token, body = json.encodeToString(UpdateUserRoleRequest(role))),
    decodeSuccess(),
  )
