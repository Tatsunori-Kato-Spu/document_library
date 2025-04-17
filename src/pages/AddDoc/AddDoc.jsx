import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Layout/Header/Header";
import "./AddDoc.css";

function AddDoc() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    docNumber: "",
    docName: "",
    budgetYear: "",
    date: "",
    department: "",
    roles: [],
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      if (checked) {
        return { ...prev, roles: [...prev.roles, value] };
      } else {
        return { ...prev, roles: prev.roles.filter((role) => role !== value) };
      }
    });
  };

  const handleCancel = () => {
    navigate("/pagedoc");
  };

  const handleSubmit = async () => {
    const payload = {
      docNumber: formData.docNumber,
      docName: formData.docName,
      department: formData.department,
      date: formData.date,
      roles: formData.roles,
    };

    try {
      const res = await fetch("http://localhost:3001/api/documents/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert("อัปโหลดสำเร็จ");
        navigate("/pagedoc");
      } else {
        alert("อัปโหลดไม่สำเร็จ: " + data.message);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("เกิดข้อผิดพลาดในการอัปโหลด");
    }
  };

  return (
    <div className="add-doc-container">
      <Header />
      <div className="add-doc">
        <div className="form-container">
          <div className="colum-1">
            <div className="form-group">
              <label htmlFor="docNumber" className="doc-Number-label">
                ใส่เลขเอกสาร
              </label>
              <input
                id="docNumber"
                type="text"
                placeholder="กรอกเลขเอกสาร"
                value={formData.docNumber}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="docName" className="doc-Text-label">
                ใส่ชื่อเอกสาร
              </label>
              <input
                id="docName"
                type="text"
                placeholder="กรอกชื่อเอกสาร"
                value={formData.docName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="colum-2">
            <div className="form-group">
              <label htmlFor="budgetYear" className="doc-budget-label">
                ปีงบประมาณ
              </label>
              <select
                id="budgetYear"
                value={formData.budgetYear}
                onChange={handleChange}
              >
                <option value="" disabled>
                  โปรดเลือก...
                </option>
                <option value="2566">2566</option>
                <option value="2567">2567</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="date" className="doc-data-label">
                วันที่รับ
              </label>
              <input
                id="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="department" className="doc-department-label">
                หน่วยงาน
              </label>
              <select
                id="department"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="" disabled>
                  โปรดเลือก...
                </option>
                <option value="บัญชี">บัญชี</option>
                <option value="การเงิน">การเงิน</option>
              </select>
            </div>
            <div className="form-group">
              <label className="doc-role">ระดับ</label>
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    value="admin"
                    checked={formData.roles.includes("admin")}
                    onChange={handleCheckboxChange}
                  />
                  Admin
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="worker"
                    checked={formData.roles.includes("worker")}
                    onChange={handleCheckboxChange}
                  />
                  Worker
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="guest"
                    checked={formData.roles.includes("guest")}
                    onChange={handleCheckboxChange}
                  />
                  Guest
                </label>
              </div>
            </div>
          </div>

          {/* ไม่แสดงส่วนอัปโหลดไฟล์ */}
          {/* <div className="file-upload-container"> ... </div> */}

          <div className="button-group">
            <button onClick={handleCancel} className="cancel-button">
              ยกเลิก
            </button>
            <button className="submit-button" onClick={handleSubmit}>
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddDoc;
