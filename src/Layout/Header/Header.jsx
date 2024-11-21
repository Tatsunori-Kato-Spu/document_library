import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import NotificationsA from "../Notification/NotificationsA";

import './Header.css';

function Header() {
    const [showNotifications, setShowNotifications] = useState(false); // สถานะการแสดง/ซ่อน NotificationsA

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications); // สลับการแสดง/ซ่อน
    };

    return ( 
        <div className="header-container">
            <header className="header">
                <img
                    src='/public/Logo.png' // โลโก้ที่อยู่ใน public
                    alt="Logo"
                    className="header-logo"
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
                            <button className="header-icon-button">
                                <FontAwesomeIcon icon={faUser} size="lg" style={{ color: 'orange' }} />
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="header-icon-button">
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