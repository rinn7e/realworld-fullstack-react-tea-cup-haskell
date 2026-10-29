pluginManagement {
  repositories {
    google()
    mavenCentral()
    gradlePluginPortal()
  }
}

dependencyResolutionManagement {
  repositories {
    google()
    mavenCentral()
  }
}

rootProject.name = "android-admin"

// core: the TEA runtime, the types, the updates and the API, in Kotlin
// Multiplatform (Android now, the JVM for the tests; iOS can be added later).
// app: the Android app, the Compose views of core.
include(":core", ":app")
