package teacup

/**
 * Sends a message to the runtime, like `Dispatcher` of tea-cup-fp.
 *
 * Every dispatcher is equal to every other one, like `EqAlways` on the
 * `dispatch` prop: a view that takes one still skips when the rest of its input
 * did not change (the `memo` of the web views), even though a mapped dispatcher
 * is a new object on every render.
 */
class Dispatcher<in Msg>(private val send: (Msg) -> Unit) {
  operator fun invoke(msg: Msg) = send(msg)

  /** A dispatcher for a child, like `(subMsg) => dispatch({ _tag: 'XMsg', subMsg })` */
  fun <Child> map(toMsg: (Child) -> Msg): Dispatcher<Child> = Dispatcher { child -> send(toMsg(child)) }

  override fun equals(other: Any?): Boolean = other is Dispatcher<*>

  override fun hashCode(): Int = 0
}
