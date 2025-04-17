import React, { useEffect, useState } from 'react';
import Dropdown from "react-bootstrap/Dropdown";
import "./Permission.css";
import Header from '../../Layout/Header/Header';
import Searchbar from '../Searchbar/Searchbar';
import Swal from "sweetalert2";
import axios from 'axios';

function Permission() {
  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // ดึงข้อมูลจาก backend
  useEffect(() => {
    axios.get('http://localhost:3001/api/users')
      .then(res => {
        setUsers(res.data);
        setFilteredData(res.data);
      })
      .catch(err => {
        console.error("Error fetching users:", err);
      });
  }, []);

  // ยืนยัน + ส่งการเปลี่ยน role ไป backend
  const handleRoleChangeConfirm = (index, newRole) => {
    const userId = users[index].id;

    Swal.fire({
      title: "คุณต้องการบันทึกการเปลี่ยนแปลงหรือไม่?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      denyButtonText: `ยกเลิก`,
    }).then((result) => {
      if (result.isConfirmed) {
        axios.put(`http://localhost:3001/api/users/${userId}/role`, { role: newRole })
          .then(() => {
            const updatedUsers = [...users];
            updatedUsers[index].role = newRole;
            setUsers(updatedUsers);
            setFilteredData(updatedUsers);
            Swal.fire("Saved!", "", "success");
          })
          .catch((err) => {
            console.error(err);
            Swal.fire("เกิดข้อผิดพลาด", "", "error");
          });
      } else if (result.isDenied) {
        Swal.fire("การเปลี่ยนแปลงไม่ได้ถูกบันทึก", "", "info");
      }
    });
  };

  // ค้นหา (filter)
  const handleSearch = (filteredUsers) => {
    setFilteredData(filteredUsers);
  };

  return (
    <div className="background">
      <Header />
      <div className="searchbar">
        <Searchbar onSearch={handleSearch} searchType="users" />
      </div>
      <div className="table-wrapper-permission">
        <table className="table-container">
          <thead className="table-th">
            <tr>
              <th className='topic-textBox-1'>รูป</th>
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
                  <img src='/document_library/profile1.png' alt="profile" className="profilePic" />
                </td>
                <td>{user.name}</td>
                <td>{user.id_card}</td>
                <td>{user.department}</td>
                <td>{user.position}</td>
                <td>{user.email}</td>
                <td>{user.contact}</td>
                <Dropdown>
                  <Dropdown.Toggle variant="success" className='dropdown-button'>
                    {user.role}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleRoleChangeConfirm(index, "admin")}>admin</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleRoleChangeConfirm(index, "worker")}>worker</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleRoleChangeConfirm(index, "guest")}>guest</Dropdown.Item>
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
