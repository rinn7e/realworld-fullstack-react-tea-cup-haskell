package common.api.handler

import common.api.type.ApiError
import common.api.type.HttpError
import common.env.Env
import io.ktor.client.HttpClient
import io.ktor.client.request.header
import io.ktor.client.request.parameter
import io.ktor.client.request.request
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.HttpMethod
import io.ktor.http.contentType
import io.ktor.http.isSuccess
import kotlinx.coroutines.CancellationException
import kotlinx.serialization.json.Json
import teacup.Either
import teacup.flatMap
import teacup.mapLeft

// The steps of the web handlers: fetch, check, decode, and an `HttpError` on
// the way out. `internal`: only the handlers of this folder use them (Kotlin has
// no visibility per folder, so `internal` is the module; the rest of `core` is
// asked not to call them).

// The engine is the one of the platform (OkHttp on Android), found at runtime
private val client by lazy { HttpClient() }

internal val json = Json { ignoreUnknownKeys = true }

/** The raw answer of a request, or why it failed (the `fetchToTaskEither` pair) */
internal data class FetchToTaskEitherSuccess(val ok: Boolean, val status: Int, val text: String)

internal data class FetchToTaskEitherError(val err: String, val status: Int?)

/** Sends a request to `Env.apiBase + path`. The query drops the params that are null. */
internal suspend fun fetchApi(
  path: String,
  method: HttpMethod = HttpMethod.Get,
  token: String? = null,
  query: List<Pair<String, String?>> = emptyList(),
  body: String? = null,
): Either<FetchToTaskEitherError, FetchToTaskEitherSuccess> =
  try {
    val response =
      client.request(Env.apiBase + path) {
        this.method = method
        for ((name, value) in query) if (value != null) parameter(name, value)
        if (token != null) header("Authorization", "Token $token")
        if (body != null) {
          contentType(ContentType.Application.Json)
          setBody(body)
        }
      }
    Either.Right(FetchToTaskEitherSuccess(response.status.isSuccess(), response.status.value, response.bodyAsText()))
  } catch (e: CancellationException) {
    throw e
  } catch (e: Exception) {
    Either.Left(FetchToTaskEitherError(e.toString(), null))
  }

internal inline fun <reified A> decodeSuccess(): (FetchToTaskEitherSuccess) -> Either<FetchToTaskEitherError, A> =
  { s ->
    if (!s.ok) {
      Either.Left(FetchToTaskEitherError(s.text, s.status))
    } else {
      try {
        Either.Right(json.decodeFromString<A>(s.text))
      } catch (e: Exception) {
        Either.Left(FetchToTaskEitherError("Decode error: $e", s.status))
      }
    }
  }

internal fun <A> ensureIsOk(value: A): (FetchToTaskEitherSuccess) -> Either<FetchToTaskEitherError, A> = { s ->
  if (s.ok) Either.Right(value) else Either.Left(FetchToTaskEitherError(s.text, s.status))
}

private fun decodeApiError(e: FetchToTaskEitherError): HttpError {
  val apiError = runCatching { json.decodeFromString<ApiError>(e.err) }.getOrNull()
  return HttpError(statusCode = e.status ?: 0, err = apiError, actualErr = e.err)
}

internal fun <A> runApi(
  fetched: Either<FetchToTaskEitherError, FetchToTaskEitherSuccess>,
  decode: (FetchToTaskEitherSuccess) -> Either<FetchToTaskEitherError, A>,
): Either<HttpError, A> = fetched.flatMap(decode).mapLeft(::decodeApiError)
