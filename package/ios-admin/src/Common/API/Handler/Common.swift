import Common_API_Type
import Common_Env
import Common_Type
import Foundation

/// The raw answer of a request, or why it failed (the `fetchToTaskEither` pair)
struct FetchToTaskEitherSuccess {
  let ok: Bool
  let status: Int
  let data: Data
}

struct FetchToTaskEitherError: Error {
  let err: String
  let status: Int?
}

/// Sends a request to `API_BASE + path`. The query drops the params that are nil.
func fetchApi(
  _ path: String,
  method: String = "GET",
  token: String? = nil,
  query: [(String, String?)] = [],
  body: (any Encodable)? = nil
) async -> Result<FetchToTaskEitherSuccess, FetchToTaskEitherError> {
  guard var components = URLComponents(string: API_BASE + path) else {
    return .failure(FetchToTaskEitherError(err: "Bad URL: \(path)", status: nil))
  }
  let items = query.compactMap { name, value in value.map { URLQueryItem(name: name, value: $0) } }
  if !items.isEmpty { components.queryItems = items }
  guard let url = components.url else {
    return .failure(FetchToTaskEitherError(err: "Bad URL: \(path)", status: nil))
  }

  var request = URLRequest(url: url)
  request.httpMethod = method
  if let token { request.setValue("Token \(token)", forHTTPHeaderField: "Authorization") }
  if let body {
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.httpBody = try? JSONEncoder().encode(body)
  }

  do {
    let (data, response) = try await URLSession.shared.data(for: request)
    let status = (response as? HTTPURLResponse)?.statusCode ?? 0
    return .success(FetchToTaskEitherSuccess(ok: (200..<300).contains(status), status: status, data: data))
  } catch {
    return .failure(FetchToTaskEitherError(err: String(describing: error), status: nil))
  }
}

func decodeSuccess<A: Decodable>(_ type: A.Type) -> (FetchToTaskEitherSuccess) -> Result<A, FetchToTaskEitherError> {
  { s in
    let text = String(decoding: s.data, as: UTF8.self)
    guard s.ok else { return .failure(FetchToTaskEitherError(err: text, status: s.status)) }
    let decoder = JSONDecoder()
    decoder.dateDecodingStrategy = dateDecodingStrategy
    do {
      return .success(try decoder.decode(A.self, from: s.data))
    } catch {
      return .failure(FetchToTaskEitherError(err: "Decode error: \(error)", status: s.status))
    }
  }
}

func ensureIsOk<A>(_ value: A) -> (FetchToTaskEitherSuccess) -> Result<A, FetchToTaskEitherError> {
  { s in
    s.ok ? .success(value) : .failure(FetchToTaskEitherError(err: String(decoding: s.data, as: UTF8.self), status: s.status))
  }
}

func decodeApiError(_ e: FetchToTaskEitherError) -> HttpError {
  let apiError = e.err.data(using: .utf8).flatMap { try? JSONDecoder().decode(ApiError.self, from: $0) }
  return HttpError(statusCode: e.status ?? 0, err: apiError, actualErr: e.err)
}

/// A request through the steps of the web handlers: fetch, check, decode, and an
/// `HttpError` on the way out
func runApi<A>(
  _ fetched: Result<FetchToTaskEitherSuccess, FetchToTaskEitherError>,
  _ decode: (FetchToTaskEitherSuccess) -> Result<A, FetchToTaskEitherError>
) -> Result<A, HttpError> {
  fetched.flatMap(decode).mapError(decodeApiError)
}
