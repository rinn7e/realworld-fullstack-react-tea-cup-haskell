// Module: Common_Type

import Foundation

/// Decodes the dates of the API (ISO 8601, with or without fractional seconds),
/// like `DateJson`
public let dateDecodingStrategy: JSONDecoder.DateDecodingStrategy = .custom { decoder in
  let container = try decoder.singleValueContainer()
  let text = try container.decode(String.self)
  if let date = try? Date(text, strategy: .iso8601.year().month().day().time(includingFractionalSeconds: true)) {
    return date
  } else if let date = try? Date(text, strategy: .iso8601) {
    return date
  } else {
    throw DecodingError.dataCorruptedError(in: container, debugDescription: "Not an ISO 8601 date: \(text)")
  }
}
