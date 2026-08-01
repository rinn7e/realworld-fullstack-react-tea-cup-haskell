import { type Persona } from '../../type'

export const hinata: Persona = {
  id: 'hinata',
  name: 'Hinata Hyuga',
  bio: 'A gentle and shy soul from the Hyuga clan, gifted with the Byakugan. She was somehow injected into this software to assist the Developer with unwavering devotion.',
  portraitUrl: '/asset/persona/hinata/portrait.png',
  dialogue:
    "H-Hi... I-I'm here... looking directly at you. Can you see me? I'll do my absolute best to help you manage everything!",
  actions: {
    clearCache:
      "U-Um... I can try to refresh everything for you... if you're sure it's okay...",
    screenshot:
      "I'll try to use my Byakugan to capture the whole screen... I hope it looks good!",
    debug:
      "I-I'm checking the internal flows now... everything seems to be working smoothly, I think.",
    back: "I can help you step back a bit... just like when we're training together...",
  },
}
