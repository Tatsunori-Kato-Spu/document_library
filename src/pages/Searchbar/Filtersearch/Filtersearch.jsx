import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import "./Filtersearch.css";

const Filtersearch = ({ open, onClose, onApply, username }) => {
  const [formData, setFormData] = useState({
    docNumber: "",
    docName: "",
    department: "",
    timeRange: "ทั้งหมด",
  });
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    // ดึง departments ตอนที่ modal เปิด
    if (open) {
      axios
        .get("http://localhost:3001/api/departments")
        .then((res) => {
          const deptList = res.data.map((item) => item.department);
          setDepartments(deptList);
        })
        .catch((err) => {
          console.error("โหลด department ล้มเหลว:", err);
        });
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFormData({
      docNumber: "",
      docName: "",
      department: "",
      timeRange: "ทั้งหมด",
    });
  };

  const handleSubmit = async () => {
    let keyword = `${formData.docNumber} ${formData.docName}`.trim();
    let days = null;

    if (formData.timeRange === "1 วัน") days = 1;
    if (formData.timeRange === "7 วัน") days = 7;
    if (formData.timeRange === "30 วัน") days = 30;

    try {
      const res = await axios.post(
        `http://localhost:3001/api/documents/search/filter?username=${username}`,
        {
          keyword: keyword,
          department: formData.department,
          days: days,
        }
      );
      onApply(res.data);
      onClose();
    } catch (err) {
      console.error("ค้นหาแบบฟิลเตอร์ล้มเหลว:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>ค้นหาในเอกสาร</DialogTitle>
      <DialogContent className="filter-search-content">
        <TextField
          name="docNumber"
          label="เลขเอกสาร"
          value={formData.docNumber}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="docName"
          label="ชื่อเอกสาร"
          value={formData.docName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>หน่วยงาน</InputLabel>
          <Select
            name="department"
            value={formData.department}
            onChange={handleChange}
            sx={{ color: "white" }}
          >
            <MenuItem value="">เลือกทั้งหมด</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>ช่วงเวลา</InputLabel>
          <Select
            name="timeRange"
            value={formData.timeRange}
            onChange={handleChange}
            sx={{ color: "white" }}
          >
            <MenuItem value="ทั้งหมด">ทั้งหมด</MenuItem>
            <MenuItem value="1 วัน">1 วัน</MenuItem>
            <MenuItem value="7 วัน">7 วัน</MenuItem>
            <MenuItem value="30 วัน">30 วัน</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReset} color="secondary" sx={{ color: "white" }}>
          รีเซ็ต
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          sx={{
            backgroundColor: "#FF8539",
            color: "white",
            "&:hover": {
              backgroundColor: "#ff6c00",
            },
          }}
        >
          ค้นหา
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Filtersearch;
