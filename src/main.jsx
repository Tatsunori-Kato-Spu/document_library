import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";

import Stats from './pages/Stats/Stats.jsx'
import Permission from './pages/Permission/Permission.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    
    <Permission/>
    <Stats />
  </StrictMode>,
)
