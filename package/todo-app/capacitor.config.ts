import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.teacup.todo',
  appName: 'TeaCup Todo',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
}

export default config
