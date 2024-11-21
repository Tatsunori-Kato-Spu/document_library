import { useState } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

import Permission from './pages/Permission/Permission';
import Stats from './pages/Stats/Stats';
import Login from './pages/Login/Login';
import Pagedoc from './pages/Pagedoc/page';
import Homepage from './pages/Home/homepage';  // นำเข้า Homepage
import Profile from './pages/profile/profile';


import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import './App.css';
import Header from './Layout/Header/Header';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // สถานะการล็อกอิน
  const [userRole, setUserRole] = useState(null); // สถานะเก็บบทบาทผู้ใช้
  const [user, setUser] = useState(null); // สถานะเก็บข้อมูลผู้ใช้


  const handleLoginSuccess = (userInfo) => {
    setIsLoggedIn(true);
    setUserRole(userInfo.role);
    setUser(userInfo);  // เก็บข้อมูลผู้ใช้
        
    localStorage.setItem('token', userInfo.token);  // สมมติว่า userInfo.token คือ token ที่ได้รับจากเซิร์ฟเวอร์
  };



  const router = createBrowserRouter([
    {
      path: "/",
      element: <Homepage />,  // หน้าแรกจะเป็น Homepage
    },
    {
      path: "/login",
      element: isLoggedIn ? (
        <Navigate to="/pagedoc" />  // ถ้า login แล้วจะไปที่ /pagedoc
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      ),
    },
    {
      path: "pagedoc",
      element: <Pagedoc userRole={userRole} />, // ส่ง userRole ไปที่ Pagedoc
      
    },
    {
      path: "permission",
      element: <Permission />,
    },
    {
      path: "stats",
      element: <Stats />,
    },
    ,
    {
      
     path: "profile", 
     element: <Profile user={user} />
   
    }
  ]);

  return (
    <div>
      <Header />
      <RouterProvider router={router} />
      
    </div>
  );
}

export default App;
