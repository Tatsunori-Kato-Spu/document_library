import React from 'react';
import { useNavigate } from 'react-router-dom'; // นำเข้า useNavigate
import './Headerprofile.css';

function Headerprofile() {
    const navigate = useNavigate(); // สร้างฟังก์ชัน navigate

    const handleLogoClick = () => {
        navigate('/'); // นำทางไปยังหน้าแรก
    };

    return ( 
        <div className="header-profile-container">
            <header className="header-profile">
                <img
                    src="/public/Logo.png" // โลโก้ที่อยู่ใน public
                    alt="Logo"
                    className="header-profile-logo"
                    onClick={handleLogoClick} // กำหนดฟังก์ชันคลิก
                
                />
            </header>
        </div>
    );
}

export default Headerprofile;
