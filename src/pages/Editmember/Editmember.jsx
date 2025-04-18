import React, { useEffect, useState } from 'react';
import './Editmember.css';
import Header from '../../Layout/Header/Header';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EditMember() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/api/users')
      .then(res => setUsers(res.data))
      .catch(err => {
        console.error(err);
        Swal.fire("โหลดข้อมูลล้มเหลว", "", "error");
      });
  }, []);

  const goToEdit = (id) => {
    navigate(`/document_library/editmember/${id}`);
  };

  return (
    <div className="background">
      <Header />
      <div className="table-wrapper">
        <table className="table-container">
          <thead>
            <tr>
              <th>ชื่อ</th>
              <th>รหัสประจำตัว</th>
              <th>หน่วยงาน</th>
              <th>ตำแหน่ง</th>
              <th>Email</th>
              <th>เบอร์โทร</th>
              <th>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={i}>
                <td>{user.name}</td>
                <td>{user.id_card}</td>
                <td>{user.department}</td>
                <td>{user.position}</td>
                <td>{user.email}</td>
                <td>{user.contact}</td>
                <td>
                  <button className="btn-primary" onClick={() => goToEdit(user.id)}>แก้ไข</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EditMember;
