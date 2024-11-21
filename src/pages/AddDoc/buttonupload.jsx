import React from "react";
import { useNavigate } from "react-router-dom";
import './buttonupload.css';

const ButtonUpload = () => {
  const navigate = useNavigate();  // ใช้ useNavigate

  const handleUploadClick = () => {
    navigate('/adddoc');  // นำทางไปหน้า adddoc.jsx
  };

  return (
    <div className="upload-section">
      <button className="upload-button" onClick={handleUploadClick}>
        <span className="upload-icon">
          <i className="bi bi-plus"></i>
        </span>
        อัพโหลด
      </button>
    </div>
  );
};

export default ButtonUpload;
