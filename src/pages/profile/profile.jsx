import React, { useState, useEffect } from 'react'; // Import useState
import './profile.css';
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { userdata } from '../../data/userdata'; // Import userdata.js
import Header from '../../Layout/Header/Header';

function Profile() {
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


    if (!user) {
        return <div>กำลังโหลดข้อมูล...</div>;  // หรือสามารถแสดงหน้าจอโหลด
    }

    const historyClick = () => {
        navigate('/history');
    };

    const permissionClick = () => {
        navigate('/permission');
    };

    const statsClick = () => {
        navigate('/stats');
    };

    return (
        <div>
            <Header />
            <div className='container'>
                <div className="profile-container">
                    <div className="profile-content-1">
                        <div>
                            <img
                                src="/document_library/profile1.png"
                                alt="รูปโปรไฟล์"
                                className='photo'
                            />
                        </div>

                        <button className='button-box-1'>ข้อมูลพื้นฐาน</button>

                        <div>
                            <button onClick={historyClick} className='button-box-1'>ประวัติ</button>
                        </div>

                        {user.role === "admin" && (
                            <>
                                <div>
                                    <button onClick={permissionClick} className='button-box-1'>กำหนดสิทธิ</button>
                                </div>

                                <div>
                                    <button onClick={statsClick} className='button-box-1'>สถิติ</button>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="profile-content-2">
                        <div className="user-profile">
                            <div className='text-box'>
                                <span className='text-left'>ชื่อ :</span>
                                <span className='text-right'>{user.ชื่อ}</span>
                            </div>
                            <div className='text-box'>
                                <span className='text-left'>รหัสประจำตัว :</span>
                                <span className='text-right'>{user.รหัสประจำตัว}</span>
                            </div>
                            <div className='text-box'>
                                <span className='text-left'>หน่วยงาน :</span>
                                <span className='text-right'>{user.หน่วยงาน}</span>
                            </div>
                            <div className='text-box'>
                                <span className='text-left'>ตำแหน่ง :</span>
                                <span className='text-right'>{user.ตำแหน่ง}</span>
                            </div>
                            <div className='text-box'>
                                <span className='text-left'>ระดับ :</span>
                                <span className='text-right'>{user.role}</span>
                            </div>
                            <div className='text-box'>
                                <span className='text-left'>Email :</span>
                                <span className='text-right'>{user.Email}</span>
                            </div>
                            <div className='text-box'>
                                <span className='text-left'>ติดต่อ :</span>
                                <span className='text-right'>{user.ติดต่อ}</span>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}


export default Profile;
