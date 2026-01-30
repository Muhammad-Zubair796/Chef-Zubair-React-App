import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx' // This starts the chain

// 1. This part starts the React Engine
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

