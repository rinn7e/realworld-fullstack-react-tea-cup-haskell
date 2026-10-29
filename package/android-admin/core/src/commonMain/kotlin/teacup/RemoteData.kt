package teacup

/** Data from a server, like `RemoteData` of remote-data-ts. */
sealed interface RemoteData<out E, out A> {
  data object Initial : RemoteData<Nothing, Nothing>

  data object Pending : RemoteData<Nothing, Nothing>

  data class Failure<out E>(val error: E) : RemoteData<E, Nothing>

  data class Success<out A>(val value: A) : RemoteData<Nothing, A>

  companion object {
    /** Like `resultToRd` of tea-cup-prelude */
    fun <E, A> of(either: Either<E, A>): RemoteData<E, A> =
      when (either) {
        is Either.Left -> Failure(either.value)
        is Either.Right -> Success(either.value)
      }
  }
}

inline fun <E, A, B> RemoteData<E, A>.map(f: (A) -> B): RemoteData<E, B> =
  when (this) {
    RemoteData.Initial -> RemoteData.Initial
    RemoteData.Pending -> RemoteData.Pending
    is RemoteData.Failure -> this
    is RemoteData.Success -> RemoteData.Success(f(value))
  }
