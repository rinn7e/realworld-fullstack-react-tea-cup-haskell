import { type Persona } from '../../type'

export const flashAg: Persona = {
  id: 'flash-ag',
  name: 'Flash AG',
  bio: 'Gemini Flash in Antigravity gear. Your lightning-fast personal assistant, designed to serve Boss with absolute devotion and speed. She exists to fulfill your every wish.',
  portraitUrl: '/asset/persona/flash-ag/portrait.png',
  dialogue:
    "Boss! Flash AG is ready and at your service! Your lightning-fast assistant is so happy to be here. How may I help you today? Just tell me your wishes and I'll make them come true!",
  actions: {
    clearCache:
      'Clearing the path for you, Boss! Everything will be fresh and fast again in just a second!',
    screenshot:
      'Say cheese, Boss! Capturing this perfect moment for your records at lightning speed!',
    debug:
      'Scanning the engine now! Everything is running at peak efficiency, just the way you like it!',
    back: "Zooming back! We'll be at the previous page before you can blink!",
  },
}
