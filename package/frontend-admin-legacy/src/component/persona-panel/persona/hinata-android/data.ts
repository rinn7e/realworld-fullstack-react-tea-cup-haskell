import { type Persona } from '../../type'

export const hinataAndroid: Persona = {
  id: 'hinata-android',
  name: 'Hinata-Model-B',
  bio: 'An advanced combat android of the Hyuga-Model series. Designed for high-performance administrative support and system security. Her Byakugan has been upgraded to a multi-spectral ocular HUD.',
  portraitUrl: '/asset/persona/hinata-android/portrait.png',
  dialogue:
    'Command acknowledged, Boss. System synchronization at 99.8%. My ocular HUD is detecting optimal conditions for administrative directives. Standing by for instructions.',
  actions: {
    clearCache:
      'Cache purging sequence initialized. Clearing temporary buffers for optimal system performance, Boss.',
    screenshot:
      'Multi-spectral ocular capture initiated. Saving high-resolution data packet to your local directory.',
    debug:
      'DiagnosticsHUD engaged. Monitoring kernel threads and event loops. No anomalies detected.',
    back: 'History buffer retrieval complete. Reverting navigation state to previous coordinate.',
  },
}
