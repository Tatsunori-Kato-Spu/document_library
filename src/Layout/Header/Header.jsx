// src/Layout/Header/Header.jsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import NotificationsA from "../Notification/NotificationsA";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Header.css';
import Swal from "sweetalert2";

function Header({ user, onLogout }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleLogoClick = () => {
    navigate('/document_library/pagedoc');
  };

  const handleProfileClick = () => {
    navigate('/document_library/profile');
  };

  const handleLogoutClick = () => {
    Swal.fire({
      title: "คุณต้องการออกจากระบบหรือไม่?",
      icon: "question",
      showDenyButton: true,
      confirmButtonText: "ออกจากระบบ",
      denyButtonText: "ยกเลิก",
      confirmButtonColor: "#e74c3c", // สีแดง
      denyButtonColor: "#6c63ff",    // สีม่วง
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        if (onLogout) {
          onLogout(); // reset จาก App.jsx
        }
        navigate('/document_library/login');
        Swal.fire("ออกจากระบบแล้ว", "", "success");
      }
    });
  };

  return (
    <div className="header-container">
      <header className="header">
        <img
          src="/document_library/Logo.png"
          alt="Logo"
          className="header-profile-logo"
          onClick={handleLogoClick}
        />

        <nav>
          <ul className="header-nav">
            {user && (user.role === "admin" || user.role === "worker") && (
              <>
                <li className="nav-item">
                  <button onClick={toggleNotifications} className="header-icon-button">
                    <FontAwesomeIcon icon={faBell} size="lg" style={{ color: 'orange' }} />
                  </button>
                </li>
                <li className="nav-item">
                  <button onClick={handleProfileClick} className="header-icon-button">
                    <FontAwesomeIcon icon={faUser} size="lg" style={{ color: 'orange' }} />
                  </button>
                </li>
              </>
            )}
            <li className="nav-item">
              <button onClick={handleLogoutClick} className="header-icon-button">
                <FontAwesomeIcon icon={faRightToBracket} size="lg" style={{ color: 'orange' }} />
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {showNotifications && <NotificationsA />}
    </div>
  );
}

export default Header;
