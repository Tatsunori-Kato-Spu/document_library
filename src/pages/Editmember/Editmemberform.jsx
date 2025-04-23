import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./Editmemberform.css";

import Header from "../../Layout/Header/Header";

function EditMemberForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    department: "",
    position: "",
    contact: "",
    email: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/users/${id}`)
      .then((res) => setUser(res.data))
      .catch((err) => Swal.fire("โหลดข้อมูลล้มเหลว", "", "error"));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:3001/api/users/${id}`, user)
      .then(() => {
        Swal.fire("บันทึกเรียบร้อย", "", "success").then(() =>
          navigate("/document_library/editmember")
        );
      })
      .catch((err) => {
        console.error("PUT error:", err.response?.data || err.message);
        Swal.fire(
          "บันทึกล้มเหลว",
          err.response?.data?.message || "ไม่ทราบสาเหตุ",
          "error"
        );
      });
  };

  const handleCancelAdd = () => {
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "ข้อมูลที่กรอกจะไม่ถูกบันทึก",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ยกเลิก",
      cancelButtonText: "ไม่",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/document_library/editmember");
      }
    });
  };

  return (
    <div className="editmemberform-background">
      <Header />
      <div className="editmemberform-form">
        <form onSubmit={handleSubmit}>
          <h2 className="editmemberform-form-title">แก้ไขข้อมูลผู้ใช้งาน</h2>
          <div className="editmemberform-form-grid">
            <div>
              <label>ชื่อ-สกุล</label>
              <input
                name="name"
                value={user.name}
                onChange={handleChange}
                placeholder="ชื่อ-สกุล"
              />
            </div>

            <div>
              <label>หน่วยงาน</label>
              <input
                name="department"
                value={user.department}
                onChange={handleChange}
                placeholder="หน่วยงาน"
              />
            </div>

            <div>
              <label>ตำแหน่ง</label>
              <input
                name="position"
                value={user.position}
                onChange={handleChange}
                placeholder="ตำแหน่ง"
              />
            </div>

            <div>
              <label>เบอร์โทร</label>
              <input
                name="contact"
                value={user.contact}
                onChange={handleChange}
                placeholder="เบอร์โทร"
              />
            </div>

            <div>
              <label>Email</label>
              <input
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="อีเมล"
              />
            </div>
          </div>

          <div className="editmemberform-buttons">
            <button
              type="button"
              className="editmemberform-btn-secondary"
              onClick={handleCancelAdd}
            >
              ยกเลิก
            </button>

            <button type="submit" className="editmemberform-btn-primary">
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditMemberForm;
