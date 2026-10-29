// A branded type (also called an opaque type, or a newtype in Haskell): a
// value only its owner makes (code-convention.md, "Make Impossible Updates
// Impossible"). `T`, read anywhere as `T`, branded with the owner's `B`. The
// owner declares `B` next to the type and never exports it: a `declare class`
// with one private method (no value, so `_` for the unused-vars rule). No
// other file can make one without a cast, and an object spread drops a class
// method, so `{ ...branded, field: x }` is a plain `T` again, not branded (a
// symbol-keyed brand would survive the spread).
export type Brand<T, B> = T & B
