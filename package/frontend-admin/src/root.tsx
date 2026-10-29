import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { setPlatform } from '@core/platform'

import '@/asset/style.css'

import { webPlatform } from './platform'
import { AppProgram } from './program.tsx'

setPlatform(webPlatform)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProgram />
  </StrictMode>,
)
