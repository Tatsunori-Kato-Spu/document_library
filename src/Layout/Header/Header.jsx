import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import NotificationsA from "../Notification/NotificationsA";
import { useNavigate } from 'react-router-dom'; 
import './Header.css';
import { userdata } from '../../data/userdata';

function Header() {
    const [showNotifications, setShowNotifications] = useState(false); 
    const [user, setUser] = useState(null); // ตั้งค่า state สำหรับเก็บข้อมูลผู้ใช้
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    useEffect(() => {
        // ดึง token จาก localStorage เมื่อ component โหลด
        const storedToken = localStorage.getItem('token');
        console.log('Retrieved token from localStorage:', storedToken);
        setToken(storedToken); // ตั้งค่า token ใน state

    }, []);



    useEffect(() => {
        // ตรวจสอบว่า token ถูกตั้งค่าแล้ว
        if (token) {
            const currentUser = userdata.find(u => u.token === token);
            if (currentUser) {
                setUser(currentUser); // กำหนดข้อมูลผู้ใช้ใน state
            } else {
                console.log('ไม่พบผู้ใช้สำหรับ token นี้');
            }
        }
    }, [token]); // ใช้ token เป็น dependency เพื่อให้ effect นี้ทำงานเมื่อ token ถูกเปลี่ยนแปลง
    
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
        // ลบ token จาก localStorage
        localStorage.removeItem('token');
        // นำทางไปที่หน้า login
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
                    {user && (user.role === "admin" || user.role === "worker") && (
                            <>
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

            {/* แสดง NotificationsA หาก showNotifications เป็น true */}
            {showNotifications && <NotificationsA />}
        </div>
    );
}

export default Header;