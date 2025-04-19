import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Layout/Header/Header";
import "./AddDoc.css";

// ฟังก์ชันดึงเลขเอกสารล่าสุด
// ฟังก์ชันดึงเลขเอกสารล่าสุดจากฐานข้อมูล
const generateDocNumber = async () => {
  try {
    const res = await fetch("http://localhost:3001/api/documents/lastDocNumber");
    const data = await res.json();

    if (data && data.lastNumber !== undefined) {
      // เปลี่ยนเลขเอกสารล่าสุดที่ได้มาเป็นตัวเลข
      const nextNumber = parseInt(data.lastNumber, 10) + 1;
      return String(nextNumber).padStart(7, "0"); // ทำให้เป็นเลข 7 หลัก เช่น 0000012
    } else {
      return "0000001"; // เริ่มต้นถ้ายังไม่มีเอกสารในระบบ
    }
  } catch (err) {
    console.error("ไม่สามารถดึงเลขเอกสารล่าสุดได้:", err);
    return "0000001"; // กรณีเกิดข้อผิดพลาดจะใช้ค่าเริ่มต้น
  }
};

function AddDoc() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    docNumber: "", // เริ่มต้นเป็นค่าว่าง
    docName: "",
    budgetYear: "",
    date: "",
    department: "",
    roles: [], 
    subject: "", // เพิ่มฟิลด์หัวข้อเรื่อง
  });

  // Set current date for the minimum date
  const [currentDate, setCurrentDate] = useState("");

  // ดึงเลขเอกสารล่าสุดเมื่อเริ่มต้น
  useEffect(() => {
    const fetchDocNumber = async () => {
      const docNumber = await generateDocNumber(); // เรียกใช้ฟังก์ชันเพื่อดึงเลขเอกสาร
      setFormData((prev) => ({ ...prev, docNumber })); // กำหนดค่า docNumber ใหม่
    };
    fetchDocNumber();

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

  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("docNumber", formData.docNumber);
    formDataToSend.append("docName", formData.docName);
    formDataToSend.append("subject", formData.subject);
    formDataToSend.append("department", formData.department);
    formDataToSend.append("date", formData.date);
    formDataToSend.append("roles", JSON.stringify(formData.roles));
    
    if (selectedFile) {
      formDataToSend.append("file", selectedFile);
      console.log("Selected file:", selectedFile); // ดูว่าไฟล์ถูกเลือกหรือไม่
    }

    try {
      const res = await fetch("http://localhost:3001/api/documents/upload", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();
      console.log("Response from server:", data); // ตรวจสอบข้อมูลที่ตอบกลับจาก API

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
              <label htmlFor="docNumber" className="doc-Number-label" style={{ color: 'orange' }}>
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
              <label htmlFor="pdfFile" style={{ color: 'orange' }}>
                แนบไฟล์ PDF
              </label>
              <input
                id="pdfFile"
                type="file"
                accept="application/pdf"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
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
