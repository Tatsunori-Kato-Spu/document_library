import { useState } from 'react';
import { createBrowserRouter, RouterProvider ,Navigate} from 'react-router-dom';


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
  const [userRole, setUserRole] = useState(null); // สถานะเก็บบทบาทผู้ใช้

  const handleLoginSuccess = (userInfo) => {
    setIsLoggedIn(true);
    setUserRole(userInfo.role);
    console.log("User logged in with role:", userInfo.role);  // ตรวจสอบค่าบทบาทที่ส่ง
  };



  const router = createBrowserRouter([
    {
      path: "/",
      element: isLoggedIn ? (
        <Navigate to="/pagedoc" />  // ถ้า login แล้วจะไปที่ /pagedoc
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />  // ถ้ายังไม่ login แสดง Login
      ),
    },
    {
      path: "pagedoc",
      element: <Pagedoc />,  // เส้นทางไปที่ /pagedoc
    },
    {
      path: "permission",
      element: <Permission />,
    },
    {
      path: "stats",
      element: <Stats />,
    },
  ]);

  return (
    <div>
      <Header />
      <RouterProvider router={router} />
    </div>
  )
}

export default App

