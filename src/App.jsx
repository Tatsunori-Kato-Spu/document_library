import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Permission from "./pages/Permission/Permission";
import Login from "./pages/Login/Login";
import Pagedoc from "./pages/Pagedoc/page";
import Profile from "./pages/profile/profile";
import History from "./pages/history/history";
import AddDoc from "./pages/AddDoc/AddDoc";
import EditDoc from "./pages/actiondropdown/EditDoc";
import Develope from "./pages/develope/develope";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");

    if (token && role && username) {
      setIsLoggedIn(true);
      setUserRole(role);
      setUser({ username, role, token });
    }
  }, []);

  const handleLoginSuccess = (userInfo) => {
    setIsLoggedIn(true);
    setUserRole(userInfo.role);
    setUser(userInfo);

    localStorage.setItem("token", userInfo.token);
    localStorage.setItem("username", userInfo.username);
    localStorage.setItem("role", userInfo.role);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setUserRole(null);
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <Routes>
      <Route path="/document_library/" element={<Navigate to="/document_library/login" />} />

        <Route path="/document_library/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route
          path="/document_library/pagedoc"
          element={
            isLoggedIn ? (
              <Pagedoc user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/document_library/login" />
            )
          }
        />
        <Route
          path="/document_library/editDoc"
          element={
            isLoggedIn ? <EditDoc userRole={userRole} /> : <Navigate to="/document_library/login" />
          }
        />
        <Route
          path="/document_library/addDoc"
          element={
            isLoggedIn ? <AddDoc /> : <Navigate to="/document_library/login" />
          }
        />
        <Route path="/document_library/permission" element={<Permission />} />
        <Route path="/document_library/profile" element={<Profile user={user} token={user?.token} />} />
        <Route path="/document_library/history" element={<History user={user} />} />
        <Route path="/document_library/develope" element={<Develope />} />
        <Route path="*" element={<div style={{ padding: "2rem" }}>ไม่พบหน้าที่คุณต้องการ 🧭</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
