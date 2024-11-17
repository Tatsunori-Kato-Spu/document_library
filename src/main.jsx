import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Stats from './pages/Stats/Stats.jsx'
import Permission from './pages/Permission/permission.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Permission/>
    <Stats />
  </StrictMode>,
)
