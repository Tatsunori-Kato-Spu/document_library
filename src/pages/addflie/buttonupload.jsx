import React from "react";
import './buttonupload.css';

const ButtonUpload = () => {  
  return (
    <div className="upload-section">
      <button className="upload-button">
        <span className="upload-icon">
          <i className="bi bi-plus"></i>
        </span>
        อัพโหลด
      </button>
    </div>
  );
};

export default ButtonUpload;
