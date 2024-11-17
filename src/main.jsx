import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Stats from './pages/Stats/Stats.jsx'
import Permission from './pages/Permission/Permission.jsx'
import Searchbar from './pages/Searchbar/Searchbar.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Searchbar />
    <Permission/>
    <Stats />
  </StrictMode>,
)
