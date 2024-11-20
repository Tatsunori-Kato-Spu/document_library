import { userdata } from '../../data/userdata';  // นำเข้าข้อมูลจาก usersdata.js
import React, { useState } from 'react';
import Dropdown from "react-bootstrap/Dropdown";
import "./permission.css";

function Permission() {
  const [users, setUsers] = useState(userdata); // สร้าง state เพื่อจัดการข้อมูลผู้ใช้

  // ฟังก์ชันสำหรับเปลี่ยน role
  const handleRoleChange = (index, newRole) => {
    const updatedUsers = [...users];
    updatedUsers[index].role = newRole;
    setUsers(updatedUsers);
  };
  return (
    <div className="background">
      <div className="table-wrapper">
        <table className="table-container">
          <thead className="table-th">
            <tr >
              <th className='topic-textBox-pic' >รูป</th>
              <th>ชื่อ</th>
              <th>รหัสประจำตัว</th>
              <th>หน่วยงาน</th>
              <th>ตำแหน่ง</th>
              <th>E-mail</th>
              <th>ติดต่อ</th>
              <th>ระดับสิทธิ</th>
            </tr>
          </thead>
          <tbody>
            {userdata.map((user, index) => (
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
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
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