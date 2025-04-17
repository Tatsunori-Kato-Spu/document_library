import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";
import "./Searchbar.css";
import Filtersearch from "./Filtersearch/Filtersearch";

function SearchBar({ onSearch, username }) {
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // ✅ เช็ค username fallback จาก localStorage
  const safeUsername =
    username ||
    JSON.parse(localStorage.getItem("userInfo"))?.username ||
    null;

  const handleSearch = async (searchQuery) => {
    console.log("🔍 เรียก handleSearch() ด้วย query:", searchQuery);

    if (!searchQuery.trim()) {
      console.warn("⚠️ ไม่มีคำค้นหา");
      onSearch([]);
      return;
    }

    if (!safeUsername) {
      console.warn("⚠️ ไม่พบ username");
      return;
    }

    try {
      console.log("🟢 เรียก API (POST): /api/documents/search", {
        keyword: searchQuery,
        username: safeUsername,
      });

      const res = await axios.post(
        "http://localhost:3001/api/documents/search",
        {
          keyword: searchQuery,
          username: safeUsername,
        }
      );

      console.log("✅ ผลลัพธ์ที่ได้:", res.data);
      onSearch(res.data);
    } catch (err) {
      console.error("❌ ค้นหาล้มเหลว:", err.response?.data || err.message);
    }
  };

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    handleSearch(newQuery); // ✅ เรียกตรง ไม่ใช้ debounce ตอนนี้
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="container">
      <Form className="search-form" onSubmit={handleSubmit}>
        <input
          className="search-input"
          placeholder="ค้นหาเอกสาร..."
          value={query}
          onChange={handleInputChange}
        />
        <div className="search-button">
          <button type="submit" className="search-button" title="Search">
            <i className="bi bi-search"></i>
          </button>
          <button
            type="button"
            className="Slider-button"
            onClick={() => setDialogOpen(true)}
          >
            <i className="bi bi-sliders2"></i>
          </button>
        </div>
      </Form>

      <Filtersearch
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        username={safeUsername}
        onApply={onSearch}
      />
    </div>
  );
}

export default SearchBar;