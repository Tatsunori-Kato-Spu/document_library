import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
<<<<<<< HEAD
import './index.css'
=======

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";

import Stats from './pages/Stats/Stats.jsx'
import Permission from './pages/Permission/Permission.jsx'
>>>>>>> 17a375aaa5e0d3900cd4c989bc11afcaee52880c

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
<<<<<<< HEAD
=======
    
    <Permission/>
    <Stats />
>>>>>>> 17a375aaa5e0d3900cd4c989bc11afcaee52880c
  </StrictMode>,
)
