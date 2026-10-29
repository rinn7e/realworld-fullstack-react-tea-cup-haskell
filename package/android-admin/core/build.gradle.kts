plugins {
  alias(libs.plugins.kotlin.multiplatform)
  alias(libs.plugins.kotlin.serialization)
  alias(libs.plugins.android.kotlin.multiplatform.library)
}

kotlin {
  android {
    namespace = "tech.rinn7e.sentinel.core"
    compileSdk = 37
    minSdk = 26
  }
  // The tests run on the JVM, without a device
  jvm()

  sourceSets {
    commonMain.dependencies {
      implementation(libs.kotlinx.coroutines.core)
      implementation(libs.kotlinx.serialization.json)
      implementation(libs.ktor.client.core)
      api(libs.datastore.preferences.core)
    }
    androidMain.dependencies {
      implementation(libs.ktor.client.okhttp)
    }
    commonTest.dependencies {
      implementation(kotlin("test"))
      implementation(libs.kotlinx.coroutines.test)
    }
  }
}
