import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import NotificationsA from "../Notification/NotificationsA";
import { useNavigate } from 'react-router-dom'; 
import './Header.css';

function Header() {
    const [showNotifications, setShowNotifications] = useState(false); 
    const navigate = useNavigate();

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
        navigate('/document_library/'); 
    };

    return ( 
        <div className="header-container">

            <header className="header">
            <img 
                    src= '/document_library/Logo.png'
                    alt="Logo"
                    className="header-profile-logo"
                    onClick={handleLogoClick} 
                />

                <nav>
                    <ul className="header-nav">
                        <li className="nav-item">
                            {/* ปุ่มสำหรับการแสดง NotificationsA */}
                            <button onClick={toggleNotifications} className="header-icon-button">
                                <FontAwesomeIcon icon={faBell} size="lg" style={{ color: 'orange' }} />
                            </button>
                        </li>
                        <li className="nav-item">
                         
                            <button onClick={handleProfileClick} className="header-icon-button">
                                <FontAwesomeIcon icon={faUser} size="lg" style={{ color: 'orange' }} />
                            </button>
                        
                        </li>
                        <li className="nav-item">
                            <button onClick={handleLogoutClick} className="header-icon-button">
                                <FontAwesomeIcon icon={faRightToBracket} size="lg" style={{ color: 'orange' }} />
                            </button>
                        </li>
                    </ul>
                </nav>
            </header>

            {/* แสดง NotificationsA หาก showNotifications เป็น true */}
            {showNotifications && <NotificationsA />}
        </div>
    );
}

export default Header;