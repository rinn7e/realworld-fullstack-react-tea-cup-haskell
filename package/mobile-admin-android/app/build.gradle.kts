plugins {
  alias(libs.plugins.android.application)
  alias(libs.plugins.kotlin.compose)
  alias(libs.plugins.kotlin.serialization)
}

// The API the app talks to, like `VITE_API_BASE`: the emulator reaches the
// backend on this Mac at 10.0.2.2. A phone takes the LAN IP of the Mac:
// `./gradlew installDebug -PapiBase=http://192.168.0.10:3000/api`
val apiBase = providers.gradleProperty("apiBase").getOrElse("http://10.0.2.2:3000/api")

// The frame rate counter, in a debug build always, in a release build with
// `-PfpsOverlay` (to judge a lag on an optimized build)
val fpsOverlay = providers.gradleProperty("fpsOverlay").isPresent

android {
  namespace = "tech.rinn7e.sentinel.admin"
  compileSdk = 37

  defaultConfig {
    applicationId = "tech.rinn7e.sentinel.admin"
    minSdk = 26
    targetSdk = 36
    versionCode = 1
    versionName = "1.0"
    buildConfigField("String", "API_BASE", "\"$apiBase\"")
    buildConfigField("boolean", "FPS_OVERLAY", "$fpsOverlay")
  }

  buildFeatures {
    compose = true
    buildConfig = true
  }

  buildTypes {
    release {
      isMinifyEnabled = true
      proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
      // Signed with the debug key so an optimized build installs for testing
      // (there is no store release yet)
      signingConfig = signingConfigs.getByName("debug")
    }
  }
}

composeCompiler {
  // The types of the app are immutable: compare them with equals, so a view skips
  // when its input did not change (the `memo` of the web views)
  stabilityConfigurationFiles.add(project.layout.projectDirectory.file("stability.conf"))
}

dependencies {
  implementation(libs.kotlinx.coroutines.core)
  implementation(libs.kotlinx.serialization.json)
  implementation(libs.ktor.client.core)
  implementation(libs.ktor.client.okhttp)
  implementation(libs.datastore.preferences.core)
  implementation(platform(libs.compose.bom))
  implementation(libs.compose.material3)
  implementation(libs.compose.material.icons.extended)
  implementation(libs.activity.compose)
  implementation(libs.coil.compose)
  implementation(libs.coil.network.okhttp)
  implementation(libs.vico.compose)
  implementation(libs.vico.compose.m3)
  implementation(libs.kotlinx.coroutines.android)
  debugImplementation(libs.compose.ui.tooling)

  // The TEA logic (TeaCup, the pagination, the navigation, the updates, the
  // JSON) is tested on the JVM, with no device: ./gradlew testDebugUnitTest
  testImplementation(kotlin("test-junit"))
  testImplementation(libs.junit)
  testImplementation(libs.kotlinx.coroutines.test)
}
