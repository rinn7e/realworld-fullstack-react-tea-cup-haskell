package teacup

/** A value or why it failed, like `Either` of fp-ts: `Left` the error, `Right` the value. */
sealed interface Either<out E, out A> {
  data class Left<out E>(val value: E) : Either<E, Nothing>

  data class Right<out A>(val value: A) : Either<Nothing, A>
}

inline fun <E, A, B> Either<E, A>.map(f: (A) -> B): Either<E, B> =
  when (this) {
    is Either.Left -> this
    is Either.Right -> Either.Right(f(value))
  }

inline fun <E, A, B> Either<E, A>.flatMap(f: (A) -> Either<E, B>): Either<E, B> =
  when (this) {
    is Either.Left -> this
    is Either.Right -> f(value)
  }

inline fun <E, F, A> Either<E, A>.mapLeft(f: (E) -> F): Either<F, A> =
  when (this) {
    is Either.Left -> Either.Left(f(value))
    is Either.Right -> this
  }
