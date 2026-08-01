import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@/asset/style.css'

import { AppProgram } from './program.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProgram />
  </StrictMode>,
)
