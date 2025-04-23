import React, { useEffect, useState } from 'react';
import './Editmember.css';
import Header from '../../Layout/Header/Header';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EditMember({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/users?t=${Date.now()}`);
      const data = res.data;
      setUsers(data);
      setFilteredData(data);
    } catch (err) {
      console.error('โหลดข้อมูลล้มเหลว:', err);
      Swal.fire("โหลดข้อมูลล้มเหลว", "", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const goToEdit = (id) => {
    navigate(`/document_library/editmember/${id}`);
  };

  return (
    <div className="editmember-background">
      <Header user={user} onLogout={onLogout} />
      <div className="editmember-table-wrapper">
        <div className="editmember-table-container-wrapper">
          <table className="editmember-table-container">
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
              {filteredData.length > 0 ? (
                filteredData.map((u, i) => (
                  <tr key={i}>
                    <td>{u.name || u.username || '-'}</td>
                    <td>{u.id_card || '-'}</td>
                    <td>{u.department || '-'}</td>
                    <td>{u.position || '-'}</td>
                    <td>{u.email || '-'}</td>
                    <td>{u.contact || '-'}</td>
                    <td>
                      <button className="editmember-btn-primary" onClick={() => goToEdit(u.id)}>
                        แก้ไข
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                    ไม่พบข้อมูลผู้ใช้
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EditMember;
