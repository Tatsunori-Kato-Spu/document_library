import Header from "../../Layout/Header/Header"
import './AddDoc.css'

function AddDoc() {

    return <div className="add-doc-container">
        <Header />
        <div className="add-doc">
            <div className="form-container">
                <div className="colum-1">
                    <div className="form-group">
                        <label htmlFor="doc-number" className="doc-Number-label">ใส่เลขเอกสาร</label>
                        <input id="doc-number" type="text" placeholder="กรอกเลขเอกสาร" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="doc-name" className="doc-Text-label">ใส่ชื่อเอกสาร</label>
                        <input id="doc-name" type="text" placeholder="กรอกชื่อเอกสาร" />
                    </div>
                </div>
                <div className="colum-2">
                    <div className="form-group">
                        <label htmlFor="budget-year" className="doc-budget-label">ปีงบประมาณ</label>
                        <select id="budget-year">
                            <option value="" disabled selected>
                                โปรดเลือก...
                            </option>
                            {/* Add options as needed */}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="date" className="doc-data-label">วันที่รับ</label>
                        <input id="date" type="date" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="department" className="doc-department-label">หน่วยงาน</label>
                        <select id="department">
                            <option value="" disabled selected>
                                โปรดเลือก...
                            </option>
                            {/* Add options as needed */}
                        </select>
                    </div>
                </div>
                <div className="file-upload-container">
                    <label htmlFor="file-upload" className="file-upload-label">
                        อัปโหลดไฟล์
                    </label>
                    <input id="file-upload" type="file" className="file-upload" />
                </div>
                <div className="button-group">
                    <a href="/pagedoc">
                    <button className="cancel-button">ยกเลิก</button>
                    </a>
                    
                    <button className="submit-button">อัปโหลด</button>
                </div>
            </div>
        </div>
    </div>
}
export default AddDoc