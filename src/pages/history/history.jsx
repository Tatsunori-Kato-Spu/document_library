import React, { useState } from 'react';
import './history.css';
import { userdata } from '../../data/userdata'; // Import userdata.js
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { docdata } from "../../data/docdata";


function History() {
    const [users, setUsers] = useState(userdata); // ใช้ state สำหรับจัดการข้อมูลผู้ใช้
    const navigate = useNavigate(); // Use navigate hook

    return (
        <div className='container'>
            <div className="profile-container2">
                <div className="profile-content-1">
                    <div>
                        <img
                            src={('../../importProfile/profile1.png')} // ใช้ require สำหรับรูปภาพโลคอล
                            alt="รูปโปรไฟล์"
                            className='photo'
                        />
                    </div>
                    <button className='button-style' onClick={() => navigate('/profile')}>ข้อมูลพื้นฐาน</button>
                    <div className='box-1'>ประวัติ</div>
                    <button className='button-style' onClick={() => navigate('/permission')}>กำหนดสิทธิ</button>
                    <button className='button-style' onClick={() => navigate('/stats')}>สถิติ</button>
                </div>
                <div className="profile-content-2">
                    <div className="table-wrapper2">
                        <table className="table-contenner">
                            <thead className="table-th">
                                <tr>
                                    <th>หมายเลข</th>
                                    <th>
                                        ชื่อเอกสาร
                                    </th>
                                    <th>เรื่อง</th>
                                    <th>หน่วยงาน</th>
                                    <th>
                                        วันที่
                                    </th>
                                    <th>เวลา</th>
                                    
                                </tr>
                            </thead>
                            <tbody>

                                {docdata.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item["หมายเลข"]}</td>
                                        <td>{item["ชื่อเอกสาร"]}</td>
                                        <td>{item["เรื่อง"]}</td>
                                        <td>{item["หน่วยงาน"]}</td>
                                        <td>{item["วันที่"]}</td>
                                        <td>{item["เวลา"]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default History;
