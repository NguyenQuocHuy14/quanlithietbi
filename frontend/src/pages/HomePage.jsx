// src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1 style={{ fontSize: "48px", color: "#1890ff" }}>
        HỆ THỐNG QUẢN LÝ THIẾT BỊ
      </h1>
      <p style={{ fontSize: "20px", margin: "40px 0" }}>
        Chào mừng bạn đến với hệ thống quản lý thiết bị phòng lab
      </p>
      <div style={{ marginTop: "50px" }}>
        <Link to="/devices">
          <button style={{
            padding: "15px 40px",
            fontSize: "18px",
            background: "#1890ff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}>
            Vào danh sách thiết bị →
          </button>
        </Link>
      </div>
    </div>
  );
}