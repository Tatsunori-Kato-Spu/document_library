import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Layout/Header/Header";
import "./AddDoc.css";

// ฟังก์ชันสุ่มเลขเอกสาร 7 หลัก
const generateDocNumber = () => {
  let docNumber = "";
  while (docNumber.length < 7) {
    // สุ่มตัวเลข 0-9
    const randomDigit = Math.floor(Math.random() * 10);
    // ตรวจสอบว่าเลขซ้ำหรือไม่
    if (!docNumber.includes(randomDigit)) {
      docNumber += randomDigit;
    }
  }
  return docNumber;
};

function AddDoc() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    docNumber: generateDocNumber(), // สร้างเลขเอกสารสุ่มตอนเริ่ม
    docName: "",
    budgetYear: "",
    date: "",
    department: "",
    roles: [],
  });

  // Set current date for the minimum date
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
    setCurrentDate(today);
  }, []);

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
    navigate("/document_library/pagedoc");
  };

  const handleSubmit = async () => {
    const payload = {
      docNumber: formData.docNumber,
  docName: formData.docName,
  subject: formData.subject, // ✅ เพิ่มบรรทัดนี้
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
        navigate("/document_library/pagedoc");
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
              <label htmlFor="docNumber" className="doc-Number-label"style={{ color: 'orange' }}>
                ใส่เลขเอกสาร
              </label>
              <input
                id="docNumber"
                type="text"
                placeholder="กรอกเลขเอกสาร"
                value={formData.docNumber}
                onChange={handleChange}
                readOnly // ไม่ให้ผู้ใช้แก้ไขเลขเอกสาร
              />
            </div>
            <div className="form-group">
              <label htmlFor="docName" className="doc-Text-label" style={{ color: 'orange' }}>
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
              {/* เพิ่มส่วนกรอกหัวข้อเรื่อง */}
              <div className="form-group2">
              <label htmlFor="subject" className="doc-Topic-label" style={{ color: 'orange' }} >
  หัวข้อเรื่อง
</label>

              <input
                id="subject"
                type="text"
                placeholder="กรอกหัวข้อเรื่อง"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
          <div className="colum-2">
            <div className="form-group">
              <label htmlFor="budgetYear" className="doc-budget-label " style={{ color: 'orange' }}>
                ปีงบประมาณ 
              </label>
              <input
                list="budgetYears" // เชื่อมโยงกับ datalist
                id="budgetYear"
                type="text"
                value={formData.budgetYear}
                onChange={handleChange}
                placeholder="พิมพ์หรือเลือกปีงบประมาณ"
              />
              <datalist id="budgetYears">
                <option value="2566" />
                <option value="2567" />
              </datalist>
            </div>
            <div className="form-group">
              <label htmlFor="date" className="doc-data-label" style={{ color: 'orange' }}>
                วันที่รับ
              </label>
              <input
                id="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                min={currentDate} // Set the minimum date to the current date
              />
            </div>
            <div className="form-group">
              <label htmlFor="department" className="doc-department-label" style={{ color: 'orange' }}>
                หน่วยงาน
              </label>
              <input
                list="departments" // ใช้ list เพื่อเชื่อมโยงกับ datalist
                id="department"
                type="text"
                value={formData.department}
                onChange={handleChange}
                placeholder="พิมพ์หรือเลือกหน่วยงาน"
              />
              <datalist id="departments">
                <option value="บัญชี" />
                <option value="การเงิน" />
                <option value="การคลัง" />
              </datalist>
            </div>
            <div className="form-group">
              <label className="doc-role" style={{ color: 'orange' }} >ระดับ</label>
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
