import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './lib/install' // Starts listening for the install prompt as early as possible.
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
