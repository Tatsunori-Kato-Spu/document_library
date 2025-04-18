// src/Layout/Header/Header.jsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import NotificationsA from "../Notification/NotificationsA";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Header.css';

function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

  // ดึง token จาก localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', storedToken);
    setToken(storedToken);
  }, []);

  // เมื่อมี token ให้เรียก API /api/profile
  useEffect(() => {
    if (!token) return;

    axios.get('http://localhost:3001/api/profile', {
      params: { token }
    })
    .then(res => {
      if (res.data.success) {
        setUser(res.data.user);
      } else {
        console.log('ไม่พบผู้ใช้สำหรับ token นี้');
      }
    })
    .catch(err => console.error('Profile fetch error:', err));
  }, [token]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleLogoClick = () => {
    navigate('/pagedoc');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('token');
    navigate('/document_library/');
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
