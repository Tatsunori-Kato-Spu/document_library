import React from "react";
import { useNavigate } from "react-router-dom";
import './buttonupload.css';

const ButtonUpload = () => {
  const navigate = useNavigate();  

  const handleUploadClick = () => {
    navigate('/document_library/adddoc');  
  };

  return (
    <div className="upload-section">
      <button className="upload-button" onClick={handleUploadClick}>
        <span className="upload-icon">
          <i className="bi bi-plus"></i>
        </span>
        อัปโหลด
      </button>
    </div>
  );
};

export default ButtonUpload;
