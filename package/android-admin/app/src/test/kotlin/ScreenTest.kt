import common.api.type.ArticleListResponse
import common.api.type.HttpError
import component.liststate.formatListError
import component.paginationnav.PageItem
import component.paginationnav.getPaginationPageItems
import kotlinx.serialization.json.Json
import teacup.Either
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNull
import screen.loginscreen.Msg as LoginMsg
import screen.loginscreen.initial as loginInitial
import screen.loginscreen.update as loginUpdate

class ScreenTest {
  @Test
  fun loginNeedsBothFields() {
    val (model, _) = loginUpdate(LoginMsg.Submit, loginInitial().first)
    assertEquals("Please fill in all fields.", model.error)
  }

  @Test
  fun loginWithAWrongPasswordSaysSo() {
    val submitting = loginInitial().first.copy(email = "a@b.c", password = "x", isSubmitting = true)
    val (model, _) = loginUpdate(LoginMsg.SubmitResult(Either.Left(HttpError(401, null, ""))), submitting)
    assertEquals("Invalid email or password.", model.error)
    assertEquals(false, model.isSubmitting)
  }

  @Test
  fun userSearchReadsItsPrefixes() {
    assertEquals("jake", screen.userscreen.getSearchParams("@jake").username)
    assertEquals("a@b.c", screen.userscreen.getSearchParams("email: a@b.c").email)
    assertNull(screen.userscreen.getSearchParams("").username)
  }

  @Test
  fun visitorSearchTellsAPathFromAnIp() {
    assertEquals("/users", screen.visitorscreen.getSearchParams(" /users ").path)
    assertEquals("10.0.0.1", screen.visitorscreen.getSearchParams("10.0.0.1").ip)
  }

  @Test
  fun pageItemsFoldTheMiddle() {
    assertEquals((1..5).map(PageItem::Page), getPaginationPageItems(1, 5))
    assertEquals(
      listOf(PageItem.Page(1), PageItem.Ellipsis(1), PageItem.Page(9), PageItem.Page(10), PageItem.Page(11), PageItem.Ellipsis(2), PageItem.Page(20)),
      getPaginationPageItems(10, 20),
    )
  }

  @Test
  fun listErrorsShowTheApiFields() {
    val err = HttpError(422, common.api.type.ApiError(mapOf("b" to listOf("y"), "a" to listOf("x", "z"))), "")
    assertEquals("a: x, z; b: y", formatListError(err))
  }

  @Test
  fun decodesDatesWithAndWithoutFractions() {
    val text =
      """{"articles":[{"id":1,"slug":"s","title":"t","description":"d","body":"b","tagList":[],
        "createdAt":"2024-01-02T03:04:05.123Z","updatedAt":"2024-01-02T03:04:05Z","favorited":false,
        "favoritesCount":0,"author":{"id":1,"username":"u","email":"e","role":"UserRole","extra":true}}],"articlesCount":1}"""
    val response = Json { ignoreUnknownKeys = true }.decodeFromString<ArticleListResponse>(text)
    assertEquals(1704164645123, response.articles[0].createdAt.toEpochMilliseconds())
  }
}
