// Module: Common_Cache

import Foundation
import Security

// The token is kept in the Keychain, the iOS place for credentials (the web app
// keeps it in `localStorage`). Called from commands only.

private let TOKEN_ACCOUNT = "jwtToken"
private let TOKEN_SERVICE = "tech.rinn7e.sentinel-admin"

private func tokenQuery() -> [String: Any] {
  [
    kSecClass as String: kSecClassGenericPassword,
    kSecAttrService as String: TOKEN_SERVICE,
    kSecAttrAccount as String: TOKEN_ACCOUNT,
  ]
}

public func saveToken(_ token: String) {
  removeToken()
  var query = tokenQuery()
  query[kSecValueData as String] = Data(token.utf8)
  query[kSecAttrAccessible as String] = kSecAttrAccessibleAfterFirstUnlock
  SecItemAdd(query as CFDictionary, nil)
}

public func getToken() -> String? {
  var query = tokenQuery()
  query[kSecReturnData as String] = true
  query[kSecMatchLimit as String] = kSecMatchLimitOne
  var item: CFTypeRef?
  guard SecItemCopyMatching(query as CFDictionary, &item) == errSecSuccess,
    let data = item as? Data
  else { return nil }
  return String(data: data, encoding: .utf8)
}

public func removeToken() {
  SecItemDelete(tokenQuery() as CFDictionary)
}
