import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Headerprofile.css';

function Headerprofile() {
    const navigate = useNavigate(); 

    const handleLogoClick = () => {
        navigate('/'); 
    };

    return ( 
        <div className="header-profile-container">
            <header className="header-profile">
                <img
                    src="/document_library/Logo.png"
                    alt="Logo"
                    className="header-profile-logo"
                    onClick={handleLogoClick} 
                
                />
            </header>
        </div>
    );
}

export default Headerprofile;
