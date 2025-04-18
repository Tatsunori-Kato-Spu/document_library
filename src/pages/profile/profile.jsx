import React, { useState, useEffect } from 'react';
import './profile.css';
import { useNavigate } from "react-router-dom";
import Header from '../../Layout/Header/Header';

function Profile() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            fetch(`http://localhost:3001/api/profile?token=${storedToken}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setUser(data.user);
                    } else {
                        console.log('ไม่พบผู้ใช้');
                    }
                })
                .catch(err => {
                    console.error('เกิดข้อผิดพลาด:', err);
                });
        }
    }, []);

    if (!user) {
        return <div>กำลังโหลดข้อมูล...</div>;
    }

    const historyClick = () => navigate('/document_library/history');
    const permissionClick = () => navigate('/document_library/permission');
    const statsClick = () => navigate('/document_library/stats');

    return (
        <div>
            <Header />
            <div className='container'>
                <div className="profile-container">
                    <div className="profile-content-1">
                        <img src="/document_library/profile1.png" alt="รูปโปรไฟล์" className='photo' />
                        <button className='button-box-1'>ข้อมูลพื้นฐาน</button>
                        <button onClick={historyClick} className='button-box-1'>ประวัติ</button>

                        {user.role === "admin" && (
                            <>
                                <button onClick={permissionClick} className='button-box-1'>กำหนดสิทธิ</button>
                            </>
                        )}
                    </div>

                    <div className="profile-content-2">
                        <div className="user-profile">
                            <div className='text-box'><span className='text-left'>ชื่อ :</span><span className='text-right'>{user.name}</span></div>
                            <div className='text-box'><span className='text-left'>รหัสประจำตัว :</span><span className='text-right'>{user.id_card}</span></div>
                            <div className='text-box'><span className='text-left'>หน่วยงาน :</span><span className='text-right'>{user.department}</span></div>
                            <div className='text-box'><span className='text-left'>ตำแหน่ง :</span><span className='text-right'>{user.position}</span></div>
                            <div className='text-box'><span className='text-left'>ระดับ :</span><span className='text-right'>{user.role}</span></div>
                            <div className='text-box'><span className='text-left'>Email :</span><span className='text-right'>{user.email}</span></div>
                            <div className='text-box'><span className='text-left'>ติดต่อ :</span><span className='text-right'>{user.contact}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Profile;
