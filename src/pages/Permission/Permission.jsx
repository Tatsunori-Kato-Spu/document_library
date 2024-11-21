import { userdata } from '../../data/userdata';  // นำเข้าข้อมูลจาก usersdata.js
import React, { useState } from 'react';
import Dropdown from "react-bootstrap/Dropdown";
import "./permission.css";
import Header from '../../Layout/Header/Header';
import Searchbar from '../Searchbar/Searchbar';

function Permission() {
  const [users, setUsers] = useState(userdata); // สร้าง state เพื่อจัดการข้อมูลผู้ใช้
  // const [query, setQuery] = useState(''); // สร้าง state สำหรับคำค้นหา
  const [filteredData, setFilteredData] = useState(userdata);
  // const [filteredUsers, setFilteredUsers] = useState(userdata); // เก็บข้อมูลผู้ใช้ที่กรองแล้ว
// console.log(userdata);
  // ฟังก์ชันสำหรับเปลี่ยน role
  const handleRoleChange = (index, newRole) => {
    const updatedUsers = [...users];
    updatedUsers[index].role = newRole;
    setUsers(updatedUsers);
  };

  // ฟังก์ชันสำหรับคำค้นหา
  const handleSearch = (filteredUsers) => {
    setFilteredData(filteredUsers); // อัปเดตข้อมูลผู้ใช้ที่กรองแล้ว
  };
  
  return (
    <div className="background">
      <Header />
      <div className="searchbar">
      <Searchbar onSearch={handleSearch} searchType="users" />
      </div>
      <div className="table-wrapper">
        <table className="table-container">
          <thead className="table-th">
            <tr >
              <th className='topic-textBox-1' >รูป</th>
              <th className='topic-textBox-2'>ชื่อ</th>
              <th className='topic-textBox-3'>รหัสประจำตัว</th>
              <th className='topic-textBox-4'>หน่วยงาน</th>
              <th className='topic-textBox-5'>ตำแหน่ง</th>
              <th className='topic-textBox-6'>E-mail</th>
              <th className='topic-textBox-7'>ติดต่อ</th>
              <th className='topic-textBox-8'>ระดับสิทธิ</th>
            </tr>
          </thead>
          <tbody>
          {Array.isArray(filteredData) && filteredData.map((user, index) => (
              <tr key={index}>
                <td>
                  <img src="../../importProfile/profile1.png" alt="" srcset="" className="profilePic" />
                </td>
                <td>{user.ชื่อ}</td>
                <td>{user.รหัสประจำตัว}</td>
                <td>{user.หน่วยงาน}</td>
                <td>{user.ตำแหน่ง}</td>
                <td>{user.Email}</td>
                <td>{user.ติดต่อ}</td>
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic" className='dropdown-button'>
                    {user.role}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleRoleChange(index, "admin")}>
                      Admin
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleRoleChange(index, "worker")}>
                      Worker
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>


              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Permission;