plugins {
  alias(libs.plugins.android.application) apply false
  // Not applied (AGP 9 builds Kotlin itself): it puts this Kotlin version on
  // the classpath, for the compiler and its plugins
  alias(libs.plugins.kotlin.android) apply false
  alias(libs.plugins.kotlin.serialization) apply false
  alias(libs.plugins.kotlin.compose) apply false
}
