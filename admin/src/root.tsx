import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { AppProgram } from './program.tsx'
import '@/asset/style.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProgram />
  </StrictMode>,
)
