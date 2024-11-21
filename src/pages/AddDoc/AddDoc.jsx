import React, { useState } from "react";
import Header from "../../Layout/Header/Header";
import { docdata } from "../../data/docdata"; // อัปเดต path ให้ถูกต้อง
import "./AddDoc.css";

function AddDoc() {
    // State สำหรับฟอร์ม
    const [formData, setFormData] = useState({
        docNumber: "",
        docName: "",
        budgetYear: "",
        date: "",
        department: "",
        file: null,
    });

    // อัปเดต state เมื่อมีการเปลี่ยนแปลงค่าในฟอร์ม
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    // อัปเดตไฟล์เมื่อมีการเลือกไฟล์ใหม่
    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
    };

    // ฟังก์ชันสำหรับเพิ่มข้อมูลใหม่ใน docdata
    const handleSubmit = () => {
        const newDoc = {
            หมายเลข: formData.docNumber,
            ชื่อเอกสาร: formData.docName,
            เรื่อง: `เรื่องของเอกสาร ${formData.docName}`,
            หน่วยงาน: formData.department,
            วันที่: formData.date,
            เวลา: new Date().toLocaleTimeString(),
            roles: ["admin"], // ค่า roles สามารถปรับได้ตามต้องการ
        };

        docdata.push(newDoc); // เพิ่มข้อมูลใหม่ลงใน docdata
        console.log("Updated docdata:", docdata);

        // หลังเพิ่มข้อมูลแล้วล้างฟอร์ม
        setFormData({
            docNumber: "",
            docName: "",
            budgetYear: "",
            date: "",
            department: "",
            file: null,
        });
    };

    return (
        <div className="add-doc-container">
            <Header />
            <div className="add-doc">
                <div className="form-container">
                    <div className="colum-1">
                        <div className="form-group">
                            <label htmlFor="docNumber" className="doc-Number-label">ใส่เลขเอกสาร</label>
                            <input
                                id="docNumber"
                                type="text"
                                placeholder="กรอกเลขเอกสาร"
                                value={formData.docNumber}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="docName" className="doc-Text-label">ใส่ชื่อเอกสาร</label>
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
                            <label htmlFor="budgetYear" className="doc-budget-label">ปีงบประมาณ</label>
                            <select
                                id="budgetYear"
                                value={formData.budgetYear}
                                onChange={handleChange}
                            >
                                <option value="" disabled>โปรดเลือก...</option>
                                <option value="2566">2566</option>
                                <option value="2567">2567</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="date" className="doc-data-label">วันที่รับ</label>
                            <input
                                id="date"
                                type="date"
                                value={formData.date}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="department" className="doc-department-label">หน่วยงาน</label>
                            <select
                                id="department"
                                value={formData.department}
                                onChange={handleChange}
                            >
                                <option value="" disabled>โปรดเลือก...</option>
                                <option value="บัญชี">บัญชี</option>
                                <option value="การเงิน">การเงิน</option>
                            </select>
                        </div>
                    </div>
                    <div className="file-upload-container">
                        <label htmlFor="file-upload" className="file-upload-label">อัปโหลดไฟล์</label>
                        <input
                            id="file-upload"
                            type="file"
                            className="file-upload"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="button-group">
                        <a href="/pagedoc">
                            <button className="cancel-button">ยกเลิก</button>
                        </a>
                        <button
                            className="submit-button"
                            onClick={handleSubmit}
                        >
                            อัปโหลด
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddDoc;