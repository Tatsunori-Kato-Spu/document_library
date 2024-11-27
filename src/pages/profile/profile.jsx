import React, { useState } from 'react'; // Import useState
import './profile.css';
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { userdata } from '../../data/userdata'; // Import userdata.js
import Header from '../../Layout/Header/Header';

function Profile() {
    const [users, setUsers] = useState(userdata); // ใช้ state สำหรับจัดการข้อมูลผู้ใช้
    const navigate = useNavigate();

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

                        <div >
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
                        <div>


                            <button onClick={permissionClick} className='button-box-1'>กำหนดสิทธิ</button>

                        </div>

                        <div>


                            <button onClick={statsClick} className='button-box-1'>สถิติ</button>

                        </div>
                    </div>
                    <div className="profile-content-2">
                        <div className="user-profile">
                            <div className='text-box'>
                                <span className='text-left'>
                                    ชื่อ :
                                </span>
                                <span className='text-right'>
                                    นาย สมชาย ใจดี
                                </span>
                            </div>
                            <div className='text-box'>
                                <span className='text-left'>
                                    รหัสประจำตัว :
                                </span>
                                <span className='text-right'>
                                    123456
                                </span>
                            </div>
                            <div className='text-box'>
                                <span className='text-left'>
                                    หน่วยงาน :
                                </span>
                                <span className='text-right'>
                                    ฝ่ายการตลาด
                                </span>
                            </div>
                            <div className='text-box'>
                                <span className='text-left'>
                                    ตำแหน่ง :
                                </span>
                                <span className='text-right'>
                                    ผู้จัดการ
                                </span>
                            </div>
                            <div className='text-box'>
                                <span className='text-left'>
                                    ระดับ :
                                </span>
                                <span className='text-right'>
                                    admin
                                </span>
                            </div>
                            <div className='text-box'>
                                <span className='text-left'>
                                    Email :
                                </span>
                                <span className='text-right'>
                                    somchai@example.com
                                </span>
                            </div>
                            <div className='text-box'>
                                <span className='text-left'>
                                    ติดต่อ :
                                </span>
                                <span className='text-right'>
                                    081-1234567
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Profile;
