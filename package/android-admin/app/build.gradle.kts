plugins {
  alias(libs.plugins.android.application)
  alias(libs.plugins.kotlin.compose)
}

// The API the app talks to, like `VITE_API_BASE`: the emulator reaches the
// backend on this Mac at 10.0.2.2. A phone takes the LAN IP of the Mac:
// `./gradlew installDebug -PapiBase=http://192.168.0.10:3000/api`
val apiBase = providers.gradleProperty("apiBase").getOrElse("http://10.0.2.2:3000/api")

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
  // The types of core are immutable: compare them with equals, so a view skips
  // when its input did not change (the `memo` of the web views)
  stabilityConfigurationFiles.add(project.layout.projectDirectory.file("stability.conf"))
}

dependencies {
  implementation(project(":core"))
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
}
