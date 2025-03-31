import { useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Permission from "./pages/Permission/Permission";
import Stats from "./pages/Stats/Stats";
import Login from "./pages/Login/Login";
import Pagedoc from "./pages/Pagedoc/page";
import Homepage from "./pages/Home/homepage";
import Profile from "./pages/profile/profile";
import History from "./pages/history/history";
import AddDoc from "./pages/AddDoc/AddDoc";
import EditDoc from "./pages/actiondropdown/editDoc";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "./App.css";
import Develope from "./pages/develope/develope";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userInfo) => {
    setIsLoggedIn(true);
    setUserRole(userInfo.role);
    setUser(userInfo);
    localStorage.setItem("token", userInfo.token);
  };

  const router = createBrowserRouter([
    {
      path: "/document_library/",
      element: <Homepage />,
    },
    {
      path: "/login",
      element: <Login onLoginSuccess={handleLoginSuccess} />,
    },
    {
      path: "/pagedoc",
      element: isLoggedIn ? (
        <Pagedoc userRole={userRole} />
      ) : (
        <Navigate to="/login" />
      ),
    },
    {
      path: "/editDoc",
      element: isLoggedIn ? (
        <EditDoc userRole={userRole} />
      ) : (
        <Navigate to="/login" />
      ),
    },
    {
      path: "/addDoc",
      element: isLoggedIn ? <AddDoc /> : <Navigate to="/login" />,
    },
    {
      path: "/permission",
      element: <Permission />,
    },
    {
      path: "/stats",
      element: <Stats />,
    },
    {
      path: "/profile",
      element: <Profile user={user} token={user?.token} />,
    },
    {
      path: "/history",
      element: <History user={user} />,
    },
    {
      path: "/develope",
      element: <Develope />,
    },
    {
      path: "*", // 🔥 fallback route
      element: <div style={{ padding: "2rem" }}>ไม่พบหน้าที่คุณต้องการ 🧭</div>,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
