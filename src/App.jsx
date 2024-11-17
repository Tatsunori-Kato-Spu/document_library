import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Permission from './pages/Permission/Permission';
import Stats from './pages/Stats/Stats';

import Login from './pages/Login/Login';
import Pagedoc from './pages/Pagedoc/page';
import Searchbar from './pages/Searchbar/Searchbar';


import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import './App.css'
import Header from './Layout/Header/Header';




function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false); // สถานะการล็อกอิน
    
  const handleLoginSuccess = () => {
    setIsLoggedIn(true); // ตั้งค่าการล็อกอินเมื่อสำเร็จ
  };

  const router = createBrowserRouter([ 
    {
      path: "/",
      element: isLoggedIn ? (
    <>
        
        <Pagedoc />
    </>
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      ),
    },{
      path: "pagedoc",
      element: <Searchbar />,
    },
    {
      path: "permission",
      element: <Permission />,
    },
    {
      path: "stats",
      element: <Stats />,
    }
  ]);
  return (
    <div>
    <Header/>
   <RouterProvider router={router}/>
    </div>
  )
}

export default App

